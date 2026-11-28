import {app, protocol} from "electron";
import fs from "fs";
import path from "path";
import {Readable} from "stream";

// 本地多媒体资源协议名（必须与 src/renderer/src/media-url.js 中的常量保持一致）
// 渲染进程用 mdz-media-protocol://media?path=<encodeURIComponent(绝对路径)> 载入本地图片/音视频/PDF
export const MEDIA_PROTOCOL = "mdz-media-protocol";

// 应用外壳协议名：生产环境下承载渲染进程产物，取代 file://
// file:// 源的 origin 是 opaque 的，一旦开启同源策略，Worker 与动态 import() 都会被拒绝，
// 因此不能只把 webSecurity 打开，必须让应用本身也跑在一个正常的标准源上
export const APP_SHELL_PROTOCOL = "ame-app";

// 多媒体与内嵌文档的 MIME 白名单，同时也是协议允许代理的扩展名白名单，
// 避免该协议被当作「任意本地文件读取器」使用
const MIME_TYPES = {
    // 图片
    png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif",
    tif: "image/tiff", tiff: "image/tiff", bmp: "image/bmp", webp: "image/webp",
    svg: "image/svg+xml",
    // 视频
    mp4: "video/mp4", m4v: "video/mp4", mov: "video/quicktime", webm: "video/webm",
    avi: "video/x-msvideo", wmv: "video/x-ms-wmv", flv: "video/x-flv", mkv: "video/x-matroska",
    mpeg: "video/mpeg", mpg: "video/mpeg", ts: "video/mp2t",
    // 音频
    mp3: "audio/mpeg", wav: "audio/wav", flac: "audio/flac", ogg: "audio/ogg",
    wma: "audio/x-ms-wma", aac: "audio/aac", m4a: "audio/mp4",
    // 内嵌文档
    pdf: "application/pdf",
    // 应用外壳自身
    html: "text/html; charset=utf-8", js: "text/javascript; charset=utf-8",
    mjs: "text/javascript; charset=utf-8", css: "text/css; charset=utf-8",
    json: "application/json", map: "application/json",
    wasm: "application/wasm",
    woff: "font/woff", woff2: "font/woff2", ttf: "font/ttf", otf: "font/otf",
    ico: "image/x-icon"
};

const ALLOWED_EXTENSIONS = new Set(Object.keys(MIME_TYPES));

const extensionOf = (filePath) => path.extname(filePath).slice(1).toLowerCase();

// 必须在 app.whenReady() 之前调用
//
// 【别删 secure: true】两个协议都必须保持 secure，这样渲染进程才是安全上下文
// （isSecureContext === true）。renderer 里有 7 处 crypto.randomUUID()
// （src/renderer/src/store/common.js、src/renderer/src/store/tab-man.js）
// 和 2 处 navigator.clipboard.writeText（MediaMan.vue、Viewer.vue）依赖这个前提，
// 去掉 secure 会让它们当场抛错——生产环境的安全上下文完全靠这里撑着，
// 换成 ame-app 之后不再有 file:// 或 http://localhost 兜底。
export const registerPrivilegedSchemes = () => {
    protocol.registerSchemesAsPrivileged([
        {
            scheme: MEDIA_PROTOCOL,
            privileges: {
                standard: true,
                secure: true,
                supportFetchAPI: true,
                stream: true
            }
        },
        {
            scheme: APP_SHELL_PROTOCOL,
            privileges: {
                standard: true,
                // 应用外壳源，上面 7 处 crypto.randomUUID() 就挂在这个协议上
                secure: true,
                supportFetchAPI: true,
                stream: true,
                corsEnabled: true
            }
        }
    ]);
};

// 渲染进程产物根目录，与 src/main/window/index.js 的加载路径保持一致
export const resolveRendererRoot = () => {
    if (process.platform === "openharmony" || !app.isPackaged) {
        return path.join(__dirname, `..${path.sep}..${path.sep}out${path.sep}renderer`);
    }
    return path.join(process.resourcesPath, "app.asar", "out", "renderer");
};

const fail = (status, message) => new Response(message, {status});

// 解析 HTTP 字节区间。音视频拖动进度条会发起带 Range 的二次请求，
// 而它们能否拖动取决于响应里有没有“可知的总长度”（Content-Length 或 Content-Range 里的 total）：
// 长度未知的 200 响应会让 duration 变成 NaN，进度条直接失效。因此这里必须自己切片并按规范回头部。
const parseByteRange = (rangeHeader, fileSize) => {
    if (!rangeHeader) {
        return { kind: "all" };
    }
    // 多区间（multipart/byteranges）不在本地文件的必要场景内，按规范用 416 拒绝
    if (rangeHeader.includes(",")) {
        return { kind: "invalid" };
    }
    const matched = /^bytes=(\d*)-(\d*)$/i.exec(rangeHeader.trim());
    if (!matched || (matched[1] === "" && matched[2] === "")) {
        return { kind: "invalid" };
    }
    let start;
    let end;
    if (matched[1] === "") {
        // 后缀区间 bytes=-N：最后 N 个字节
        const suffixLength = Number(matched[2]);
        if (suffixLength === 0) {
            return { kind: "invalid" };
        }
        start = Math.max(fileSize - suffixLength, 0);
        end = fileSize - 1;
    } else {
        start = Number(matched[1]);
        // 终点越界按规范裁剪，而不是整条请求作废
        end = matched[2] === "" ? fileSize - 1 : Math.min(Number(matched[2]), fileSize - 1);
    }
    if (fileSize === 0 || start > end || start >= fileSize) {
        return { kind: "invalid" };
    }
    return { kind: "partial", start, end };
};

// 把本地文件作为响应返回，补全 MIME 并按 Range 返回 206 分片，保证音视频可拖动进度条
const serveFile = (filePath, request, contentType) => {
    let stats;
    try {
        stats = fs.statSync(filePath);
    } catch (e) {
        return fail(404, "Not Found");
    }
    if (!stats.isFile()) {
        return fail(404, "Not Found");
    }
    const fileSize = stats.size;
    const range = parseByteRange(request.headers.get("range"), fileSize);
    if (range.kind === "invalid") {
        return new Response(request.method === "HEAD" ? null : "", {
            status: 416,
            headers: { "Content-Range": `bytes */${fileSize}`, "Content-Length": "0" }
        });
    }
    const isPartial = range.kind === "partial";
    const start = isPartial ? range.start : 0;
    const end = isPartial ? range.end : Math.max(fileSize - 1, 0);
    const length = end >= start ? end - start + 1 : 0;
    const headers = new Headers();
    headers.set("Content-Type", contentType);
    // 关键：显式给出长度，否则协议层会以“长度未知”的形式交给 Blink，音视频进度条将无法拖动
    headers.set("Content-Length", String(length));
    headers.set("Accept-Ranges", "bytes");
    headers.set("X-Content-Type-Options", "nosniff");
    if (isPartial) {
        headers.set("Content-Range", `bytes ${start}-${end}/${fileSize}`);
    }
    if (request.method === "HEAD") {
        return new Response(null, { status: 200, headers });
    }
    const body = length === 0 ? null : Readable.toWeb(fs.createReadStream(filePath, { start, end }));
    return new Response(body, { status: isPartial ? 206 : 200, headers });
};

// 只接受 GET / HEAD
const methodAllowed = (request) => request.method === "GET" || request.method === "HEAD";

// 把请求 URL 映射到渲染产物目录内的文件，禁止越出该目录
const resolveShellFile = (rendererRoot, requestUrl) => {
    const relative = path.normalize(decodeURIComponent(new URL(requestUrl).pathname).replace(/^\/+/, ""));
    const resolved = path.resolve(rendererRoot, relative);
    const rootWithSep = rendererRoot.endsWith(path.sep) ? rendererRoot : rendererRoot + path.sep;
    // 根路径本身（ame-app://bundle/）也属于合法请求，交给下面的目录回落处理
    if (resolved !== rendererRoot && !resolved.startsWith(rootWithSep)) {
        return null;
    }
    return resolved;
};

// 文件在 stat 与读取之间被删除/替换时不能让异常冒泡，否则协议层会返回不可读的失败
const serveFileSafely = (filePath, request, contentType) => {
    try {
        return serveFile(filePath, request, contentType);
    } catch (e) {
        return fail(404, "Not Found");
    }
};

// 必须在 app.whenReady() 之后、创建窗口之前调用
export const registerMediaProtocolHandler = () => {
    // 本地多媒体资源：只读，绝对路径，且扩展名必须在白名单内
    protocol.handle(MEDIA_PROTOCOL, async (request) => {
        if (!methodAllowed(request)) {
            return fail(405, "Method Not Allowed");
        }
        const requested = new URL(request.url).searchParams.get("path");
        if (!requested) {
            return fail(400, "Bad Request");
        }
        const filePath = path.normalize(requested);
        if (!path.isAbsolute(filePath)) {
            return fail(400, "Bad Request");
        }
        const ext = extensionOf(filePath);
        if (!ALLOWED_EXTENSIONS.has(ext)) {
            return fail(403, "Forbidden");
        }
        let stats;
        try {
            stats = fs.statSync(filePath);
        } catch (e) {
            return fail(404, "Not Found");
        }
        if (!stats.isFile()) {
            return fail(404, "Not Found");
        }
        return serveFileSafely(filePath, request, MIME_TYPES[ext]);
    });

    // 应用外壳：URL 路径映射到渲染产物目录，路径不存在时回落 index.html
    const rendererRoot = resolveRendererRoot();
    protocol.handle(APP_SHELL_PROTOCOL, async (request) => {
        if (!methodAllowed(request)) {
            return fail(405, "Method Not Allowed");
        }
        const resolved = resolveShellFile(rendererRoot, request.url);
        if (!resolved) {
            return fail(403, "Forbidden");
        }
        let target = resolved;
        let stats;
        try {
            stats = fs.statSync(target);
        } catch (e) {
            stats = null;
        }
        if (!stats || stats.isDirectory()) {
            // 应用使用 memory history，不依赖 URL 路由，因此统一回落首页
            target = path.join(rendererRoot, "index.html");
        }
        const ext = extensionOf(target);
        if (!ALLOWED_EXTENSIONS.has(ext)) {
            return fail(403, "Forbidden");
        }
        return serveFileSafely(target, request, MIME_TYPES[ext]);
    });
};
