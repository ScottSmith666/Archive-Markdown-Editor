/*
 * 导出PDF专用打印页的脚本（只服务 src/renderer/ame-print.html）。
 *
 * 职责边界很窄：主进程用 webContents.executeJavaScript 单向注入
 * “正文HTML + 主题CSS + 文档标题”，本文件负责把它排好版，
 * 全部就绪后置位 window.__AME_PRINT_READY__，由主进程轮询到之后调用 printToPDF()。
 *
 * 这里没有Vue、没有pinia、没有任何IPC，也不读用户数据。
 * 注入进来的正文在渲染进程已经过 DOMPurify 净化（见 App.vue 的 exportTo），
 * 本文件直接 innerHTML 的前提就是那句话。
 */

// Prism 的配色主题只是样式，没有求值顺序问题，正常从npm包引；
// 必须排在 print.css 之前，让打印页自己的覆盖规则在后面。
import "prismjs/themes/prism.css";
import "./print.css";

import mermaid from "mermaid";

// Prism 的 js 由 ame-print.html 用有序的经典 <script> 直接挂到全局（原因见
// src/renderer/libs/Prism/README.md），这里只是取用；没挂上就跳过高亮而不是整体失败。
const Prism = window.Prism;

const root = document.getElementById("viewer-content");
const themeStyleTag = document.getElementById("ame-print-user-theme");

// 正文分片到达的缓冲区。主进程是串行 await 注入的，顺序有保证，这里只负责拼接。
let bodyHtml = "";
let started = false;

// 单个图片的等待上限。图片挂了（协议被扩展名白名单拒绝、文件被删）不能让整份PDF卡死。
const PER_IMAGE_TIMEOUT_MS = 8000;
// MathJax 主构建是 async 加载的，等它出现的上限
const MATHJAX_APPEAR_TIMEOUT_MS = 20000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const setTheme = (cssText) => {
    themeStyleTag.textContent = String(cssText);
    // 挪到 head 末尾再生效：vite 会把打包出来的基础样式注到 head 尾部，
    // 用户主题必须排在它们后面才盖得住（app 内预览的 #viewer-theme-style 同理）
    document.head.appendChild(themeStyleTag);
    return true;
};

const setTitle = (titleText) => {
    // 页脚模板里的 <span class="title"> 取的就是 document.title
    document.title = String(titleText);
    return true;
};

const appendBody = (chunk) => {
    if (started) {
        throw new Error("print body arrived after start");
    }
    bodyHtml += String(chunk);
    return true;
};

const waitForImages = async () => {
    const images = Array.from(root.querySelectorAll("img"));
    await Promise.all(images.map(async (image) => {
        if (image.complete) {
            return;
        }
        await Promise.race([
            new Promise((resolve) => {
                image.addEventListener("load", resolve, {once: true});
                image.addEventListener("error", resolve, {once: true});
            }),
            sleep(PER_IMAGE_TIMEOUT_MS),
        ]);
    }));
};

const waitForMathJax = async () => {
    const deadline = Date.now() + MATHJAX_APPEAR_TIMEOUT_MS;
    while (!(window.MathJax && window.MathJax.startup && window.MathJax.startup.promise)) {
        if (Date.now() > deadline) {
            return null;
        }
        await sleep(80);
    }
    return window.MathJax;
};

const render = async () => {
    // 注入进来的正文已在渲染进程净化过
    root.innerHTML = bodyHtml;

    if (Prism) {
        Prism.highlightAllUnder(root);
    }

    const diagrams = root.querySelectorAll(".mermaid");
    if (diagrams.length !== 0) {
        // 必须 startOnLoad:false + 手动 run()。用 startOnLoad 的话 mermaid 会在
        // 正文注入之前就去扫空文档，扫不到任何东西。
        mermaid.initialize({startOnLoad: false});
        await mermaid.run({nodes: diagrams});
    }

    const mathJax = await waitForMathJax();
    if (mathJax) {
        await mathJax.startup.promise;
        await mathJax.typesetPromise([root]);
    }

    await waitForImages();
    // MathJax 的 CHTML 字体和主题字体都是 @font-face，等它们就位再印，
    // 否则 printToPDF 可能赶上字体未加载，PDF 里公式变成豆腐块
    await document.fonts.ready;
};

const start = async () => {
    if (started) {
        return true;
    }
    started = true;
    try {
        await render();
    } catch (e) {
        // 排版失败也要置位 READY，让主进程能立刻拿到 __AME_PRINT_ERROR__ 报错，
        // 而不是干等到超时
        window.__AME_PRINT_ERROR__ = String((e && e.message) || e);
    }
    window.__AME_PRINT_READY__ = true;
    return true;
};

window.__AME_PRINT_SET_THEME__ = setTheme;
window.__AME_PRINT_SET_TITLE__ = setTitle;
window.__AME_PRINT_APPEND_BODY__ = appendBody;
window.__AME_PRINT_START__ = start;
// 主进程在 did-finish-load 之后先确认这个标志，再开始注入，
// 避免抢在本模块（type=module，天然defer）执行之前调用还不存在的函数
window.__AME_PRINT_PAGE_LOADED__ = true;
