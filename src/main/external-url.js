import {shell} from "electron";

// 外部 URL 的协议白名单：只有这几种协议允许交给系统默认程序打开。
// 交给 shell.openExternal 的 URL 有两个来源都不可信：
//   1. src/main/ipc/index.js 的 "open-url"，URL 由渲染端传来，源头是 markdown 正文里的链接；
//   2. src/main/window/index.js 的 setWindowOpenHandler，URL 由页面里的脚本或 target=_blank 决定。
// 一旦不做限制，file:、任意自定义协议、Windows 上的可执行路径等都可能被用来启动本地程序，
// 因此新增的协议必须显式加进这里，而不是反过来按黑名单排除。
const ALLOWED_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

// 需要带主机名的协议（否则 http:///etc/passwd 这种畸形串会被下游程序二次解析）
const HOST_REQUIRED_PROTOCOLS = new Set(["http:", "https:"]);

// 长度上限取常见的命令行/URL 极限，避免超长串进入 shell 层
const MAX_URL_LENGTH = 8192;

// 校验并归一化外部 URL：合法返回归一化后的字符串，任何可疑输入一律返回 null
export const normalizeExternalUrl = (rawUrl) => {
    if (typeof rawUrl !== "string") {
        return null;
    }
    const urlText = rawUrl.trim();
    if (urlText === "" || urlText.length > MAX_URL_LENGTH) {
        return null;
    }
    // 控制字符（含 \0 \n \r \t 与 DEL）可能被 URL 解析器静默吃掉，
    // 再由下游的 shell / 默认程序二次解析出完全不同的东西，这里直接挡掉
    if (/[\u0000-\u001f\u007f]/.test(urlText)) {
        return null;
    }
    let parsed;
    try {
        // 相对地址（如 //host/path、./a.html）在这里会直接抛错，符合“只接受绝对地址”的预期
        parsed = new URL(urlText);
    } catch (e) {
        return null;
    }
    if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
        return null;
    }
    if (HOST_REQUIRED_PROTOCOLS.has(parsed.protocol) && parsed.hostname === "") {
        return null;
    }
    // 返回归一化结果，顺带把空格等字符完成百分号编码，避免原串带着裸空格进入 shell 层
    return parsed.href;
};

// 只记录协议而不记录完整 URL，防止把用户点开的外部地址整条写进日志
const protocolOf = (rawUrl) => {
    try {
        return new URL(String(rawUrl).trim()).protocol;
    } catch (e) {
        return "(无法解析)";
    }
};

// 通过白名单校验才交给系统默认程序；返回是否真的打开了
export const openExternalSafe = async (rawUrl) => {
    const safeUrl = normalizeExternalUrl(rawUrl);
    if (safeUrl === null) {
        console.warn(`[external-url] 已拒绝打开外部链接，协议不在白名单内：${protocolOf(rawUrl)}`);
        return false;
    }
    try {
        await shell.openExternal(safeUrl);
        return true;
    } catch (e) {
        console.warn(`[external-url] 系统未能打开外部链接：${e && e.message ? e.message : e}`);
        return false;
    }
};
