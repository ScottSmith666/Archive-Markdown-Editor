import {BrowserWindow, ipcMain} from "electron";
import fs from "fs";
import path from "path";
import {APP_SHELL_PROTOCOL} from "../media-protocol";
import {rootVars} from "../themes/root_vars";

// ===== 导出PDF =====
// 技术路线：正文不在主窗口里印，而是新开一个隐藏窗口加载包内的独立打印页
// （src/renderer/ame-print.html，由 electron-vite 多入口打进 out/renderer/），
// 主进程只单向注入“正文HTML + 主题CSS”，页面排完版后置位就绪标志，
// 再调 webContents.printToPDF() 拿PDF字节流。
//
// 为什么不直接给主窗口 printToPDF：主窗口的布局是给屏幕用的（编辑器、侧栏、状态栏），
// 而且预览区是虚拟滚动 + morphdom 增量更新的，纸面上拿到的是残缺正文。
//
// 安全边界（和 src/main/window/index.js 同一套口径）：
// 1) 打印页不注入 preload，不持有任何IPC，主窗口能做的事它一件都做不了；
// 2) 正文在渲染进程已经过 DOMPurify 净化（见 App.vue 的 exportTo）；
// 3) 页脚模板整个由常量拼出来，不插任何外部字符串，标题走 document.title；
// 4) 拒绝新开窗口、拒绝导航；页码范围只认“1-5, 8, 11-13”这种形状；
// 5) 同一时刻只允许一个PDF任务，避免反复点按钮堆出一堆隐藏窗口。
//
// 注意：打印页用的是 default session，不是独立 partition。因为
// mdz-media-protocol 与 ame-app 两个协议只注册在 default session 上
// （src/main/media-protocol.js 的 protocol.handle），换 partition 的话
// 打印页连自己的 js/css 都取不到。相应地在 webRequest 层做拦截会连累主窗口，
// 这里就只做“窗口级”的拦截，网络面收敛交给上游的净化配置去管。

const PRINT_PAGE_URL = `${APP_SHELL_PROTOCOL}://bundle/ame-print.html`;

// 单次 executeJavaScript 注入的正文上限。字符串是拼进JS源码里的，
// 太长会撑大V8解析的单次输入，分片更稳。
const INJECT_CHUNK_CHARS = 200 * 1024;
const LOAD_TIMEOUT_MS = 30 * 1000;
const RENDER_TIMEOUT_MS = 90 * 1000;
const PRINT_TIMEOUT_MS = 60 * 1000;
const POLL_INTERVAL_MS = 120;
const THEME_CSS_MAX_CHARS = 2 * 1024 * 1024;

// 纸张尺寸（英寸），Electron 的 pageSize 也接受这些名字，这里只是用来推算打印页的排版宽度
const PAPER_INCHES = {
    A3: [11.69, 16.54],
    A4: [8.27, 11.69],
    A5: [5.83, 8.27],
    A6: [4.13, 5.83],
    Letter: [8.5, 11],
    Legal: [8.5, 14],
    Tabloid: [11, 17],
    Ledger: [17, 11],
};
const DEFAULT_PAGE_SIZE = "A4";
const LAYOUT_DPI = 96;

// 页边距档位，单位英寸（printToPDF 的 margins 只认英寸）
const MARGIN_PRESETS = {
    none: 0,
    narrow: 0.4,
    standard: 0.6,
    wide: 1.0,
};
const FOOTER_MIN_MARGIN_INCH = 0.45;

const PAGE_RANGES_PATTERN = /^[0-9]+(?:\s*-\s*[0-9]+)?(?:\s*,\s*[0-9]+(?:\s*-\s*[0-9]+)?)*$/;

let jobRunning = false;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const toBool = (value, fallback) => (value === undefined ? fallback : Boolean(value));

const toClampedNumber = (value, min, max, fallback) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
        return fallback;
    }
    return Math.min(Math.max(parsed, min), max);
};

const normalizeOptions = (raw) => {
    const input = raw && typeof raw === "object" ? raw : {};
    const pageSize = Object.prototype.hasOwnProperty.call(PAPER_INCHES, input.pageSize)
        ? input.pageSize
        : DEFAULT_PAGE_SIZE;
    const landscape = toBool(input.landscape, false);
    const marginKey = Object.prototype.hasOwnProperty.call(MARGIN_PRESETS, input.margins)
        ? input.margins
        : "standard";
    let margin = MARGIN_PRESETS[marginKey];
    const displayHeaderFooter = toBool(input.footer, false);
    if (displayHeaderFooter && margin < FOOTER_MIN_MARGIN_INCH) {
        // 底边距比页脚高度还小的话，Chromium 会把页脚整条切掉，PDF里看着就像没生效
        margin = FOOTER_MIN_MARGIN_INCH;
    }

    // 页码范围会被Chromium当成打印参数解析，形状不对就整个丢掉（宁可多印，不做透传）
    const rawRanges = typeof input.pageRanges === "string" ? input.pageRanges.trim().slice(0, 200) : "";
    const pageRanges = PAGE_RANGES_PATTERN.test(rawRanges) ? rawRanges.replace(/\s+/g, "") : "";

    return {
        pageSize,
        landscape,
        margins: {top: margin, bottom: margin, left: margin, right: margin},
        printBackground: toBool(input.printBackground, true),
        scale: toClampedNumber(input.scale, 0.2, 2, 1),
        pageRanges,
        displayHeaderFooter,
        generateDocumentOutline: toBool(input.outline, false),
    };
};

// 打印页排版用的视口宽高。mermaid 出图、MathJax 断行都是按“当前视口宽度”量出来的，
// 视口比纸张宽，图就会在PDF里被裁掉一半，所以这里按“纸张减去页边距后的可印宽度”开窗口。
const layoutSize = (options) => {
    const inches = PAPER_INCHES[options.pageSize];
    const [shortEdge, longEdge] = inches;
    const widthInches = options.landscape ? longEdge : shortEdge;
    const heightInches = options.landscape ? shortEdge : longEdge;
    const usableWidth = (widthInches - options.margins.left - options.margins.right) * LAYOUT_DPI;
    const usableHeight = (heightInches - options.margins.top - options.margins.bottom) * LAYOUT_DPI;
    return {
        width: Math.round(Math.min(Math.max(usableWidth, 320), 2400)),
        // 高度只用来给一个初始滚动条，排版长度由 printToPDF 自己按纸长决定
        height: Math.round(Math.min(Math.max(usableHeight, 480), 3200)),
    };
};

const footerTemplate = () =>
    // 只放 Chromium 认的那几个类名（date/title/url/pageNumber/totalPages），
    // 不插任何外部字符串，标题走 document.title
    `<div style="width:100%;font-size:9px;text-align:center;color:#666666;">`
    + `<span class="date"></span>&nbsp;&nbsp;<span class="title"></span>`
    + `&nbsp;&nbsp;<span class="pageNumber"></span>&nbsp;/&nbsp;<span class="totalPages"></span>`
    + `</div>`;

const withTimeout = (promise, ms, message) => {
    let timer = null;
    const guard = new Promise((resolve, reject) => {
        timer = setTimeout(() => reject(new Error(message)), ms);
    });
    return Promise.race([promise, guard]).finally(() => clearTimeout(timer));
};

const waitForPrintPage = async (contents) => {
    const deadline = Date.now() + LOAD_TIMEOUT_MS;
    while (Date.now() < deadline) {
        const loaded = await contents.executeJavaScript("window.__AME_PRINT_PAGE_LOADED__ === true");
        if (loaded) {
            return;
        }
        await sleep(POLL_INTERVAL_MS);
    }
    throw new Error("打印页加载超时/print page load timeout");
};

const injectBody = async (contents, htmlContent) => {
    for (let offset = 0; offset < htmlContent.length; offset += INJECT_CHUNK_CHARS) {
        await contents.executeJavaScript(
            `window.__AME_PRINT_APPEND_BODY__(${JSON.stringify(htmlContent.slice(offset, offset + INJECT_CHUNK_CHARS))})`
        );
    }
};

const waitForRendered = async (contents) => {
    // 故意不 await START() 本身：它是异步的，让 executeJavaScript 等它就等于放弃了下面的超时控制
    await contents.executeJavaScript("window.__AME_PRINT_START__(); true;");
    const deadline = Date.now() + RENDER_TIMEOUT_MS;
    let state = null;
    while (Date.now() < deadline) {
        state = await contents.executeJavaScript(
            "({ready: window.__AME_PRINT_READY__ === true, error: window.__AME_PRINT_ERROR__ || null})"
        );
        if (state && state.ready) {
            break;
        }
        await sleep(POLL_INTERVAL_MS);
    }
    if (!state || !state.ready) {
        throw new Error("正文排版超时/content rendering timeout");
    }
    if (state.error) {
        throw new Error(`正文排版失败/content rendering failed: ${state.error}`);
    }
};

const printToPdf = async (printWindow, pdfArguments) => {
    try {
        return await withTimeout(
            printWindow.webContents.printToPDF(pdfArguments),
            PRINT_TIMEOUT_MS,
            "printToPDF超时/printToPDF timeout"
        );
    } catch (firstError) {
        // 隐藏窗口在部分环境下会被Chromium判成“没有可画的渲染源”而直接失败。
        // 兜底：短暂显形再印，然后立刻藏回去。
        console.error("printToPDF failed on hidden window, retrying with a visible window", firstError);
        printWindow.show();
        await sleep(300);
        try {
            return await withTimeout(
                printWindow.webContents.printToPDF(pdfArguments),
                PRINT_TIMEOUT_MS,
                "printToPDF超时/printToPDF timeout"
            );
        } finally {
            if (!printWindow.isDestroyed()) {
                printWindow.hide();
            }
        }
    }
};

const writePdfAtomically = async (pdfBuffer, targetPath) => {
    const directory = path.dirname(targetPath);
    await fs.promises.mkdir(directory, {recursive: true});
    const tempPath = path.join(directory, `.${path.basename(targetPath)}.${process.pid}.tmp`);
    try {
        await fs.promises.writeFile(tempPath, pdfBuffer);
        await fs.promises.rename(tempPath, targetPath);
    } catch (e) {
        await fs.promises.rm(tempPath, {force: true}).catch(() => {});
        throw e;
    }
};

const runExport = async (htmlContent, rawOptions, exportPdfFullPath, themeCss) => {
    if (process.platform === "openharmony") {
        throw new Error("当前系统暂不支持导出PDF/PDF export is not supported on this platform");
    }
    if (jobRunning) {
        throw new Error("已有PDF任务在运行/a PDF job is already running");
    }
    if (typeof htmlContent !== "string" || htmlContent.length === 0) {
        throw new Error("正文为空/empty content");
    }
    if (typeof exportPdfFullPath !== "string" || exportPdfFullPath.includes("\u0000")) {
        throw new Error("保存路径非法/illegal save path");
    }
    const targetPath = path.normalize(exportPdfFullPath);
    if (!path.isAbsolute(targetPath) || path.extname(targetPath).toLowerCase() !== ".pdf") {
        throw new Error("保存路径必须是.pdf结尾的绝对路径/save path must be an absolute .pdf path");
    }
    const cssText = typeof themeCss === "string" ? themeCss.slice(0, THEME_CSS_MAX_CHARS) : "";

    const options = normalizeOptions(rawOptions);
    const {width, height} = layoutSize(options);
    jobRunning = true;
    let printWindow = null;
    try {
        printWindow = new BrowserWindow({
            show: false,
            width,
            height,
            useContentSize: true,
            skipTaskbar: true,
            resizable: false,
            movable: false,
            minimizable: false,
            maximizable: false,
            fullscreenable: false,
            backgroundColor: "#ffffff",
            webPreferences: {
                sandbox: true,
                contextIsolation: true,
                nodeIntegration: false,
                // 隐藏窗口不能被降频，否则排版会一直不动
                backgroundThrottling: false,
                // show:false 时不打开这个，ready-to-show 不会触发，Chromium也不保证有渲染源
                paintWhenInitiallyHidden: true,
                // 这里刻意不配 preload：打印页不需要IPC，主进程单向注入就够了
            },
        });

        printWindow.webContents.setWindowOpenHandler(() => ({action: "deny"}));
        printWindow.webContents.on("will-navigate", (event) => event.preventDefault());

        await withTimeout(
            printWindow.loadURL(PRINT_PAGE_URL),
            LOAD_TIMEOUT_MS,
            "打印页加载超时/print page load timeout"
        );
        await waitForPrintPage(printWindow.webContents);

        // 主题与标题先落地，MathJax/字体测量要用到
        await printWindow.webContents.executeJavaScript(
            `window.__AME_PRINT_SET_THEME__(${JSON.stringify(`${rootVars}\n${cssText}`)})`
        );
        await printWindow.webContents.executeJavaScript(
            `window.__AME_PRINT_SET_TITLE__(${JSON.stringify(path.basename(targetPath, path.extname(targetPath)))})`
        );

        await injectBody(printWindow.webContents, htmlContent);
        await waitForRendered(printWindow.webContents);

        const pdfArguments = {
            pageSize: options.pageSize,
            landscape: options.landscape,
            margins: options.margins,
            scale: options.scale,
            printBackground: options.printBackground,
            displayHeaderFooter: options.displayHeaderFooter,
            // 页宽由 pageSize 决定，别让正文里的 @page 把纸张换掉
            preferCSSPageSize: false,
            generateDocumentOutline: options.generateDocumentOutline,
        };
        if (options.displayHeaderFooter) {
            pdfArguments.footerTemplate = footerTemplate();
        }
        if (options.pageRanges) {
            pdfArguments.pageRanges = options.pageRanges;
        }

        const pdfBuffer = await printToPdf(printWindow, pdfArguments);
        if (!pdfBuffer || pdfBuffer.length < 1024 || pdfBuffer.subarray(0, 5).toString("latin1") !== "%PDF-") {
            throw new Error("拿到的不是有效的PDF/invalid PDF data");
        }
        await writePdfAtomically(pdfBuffer, targetPath);
        return targetPath;
    } finally {
        jobRunning = false;
        if (printWindow && !printWindow.isDestroyed()) {
            printWindow.destroy();
        }
    }
};

export const exportPdfIpc = () => {
    ipcMain.handle("export-pdf", async (event, htmlContent, pdfOptions, exportPdfFullPath, themeCss) => {
        try {
            const savedPath = await runExport(htmlContent, pdfOptions, exportPdfFullPath, themeCss);
            return {"success": true, "message": savedPath};
        } catch (e) {
            console.error(e);
            return {"success": false, "message": String((e && e.message) || e.name)};
        }
    });
};
