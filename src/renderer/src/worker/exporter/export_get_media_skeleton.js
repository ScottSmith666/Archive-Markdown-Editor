import {toMediaUrl} from "../../media-url.js";

export const regExps = () => {
    return {
        imageBase64: /data:image\/(.*?);base64,/,
        url: /^(http(s?))(:\/\/)(\S+)/,
        path: {
            win32: /(^([A-Za-z]:)(\/\S+)+)|(^([A-Za-z]:)(\\\S+)+)/,
            posix: /^(\/)(\S+)(\/\S+)+/,
            mdz: /^(\$MDZ_MEDIA)\/\S+/,
            document: /^(\$DOCUMENT_MEDIA)\/\S+/,
        },
        mediaContentMark: /(\$\{)(\S+)(\})(:)([\S|\s]*)/,
    };
};

// 本地绝对路径最终写成什么形态，由这个开关决定：
//   "file"     —— 导出HTML用的老行为，拼 file:// + 路径，媒体已经拷进 .media_dir
//   "protocol" —— 导出PDF用的，改走 mdz-media-protocol://，媒体原地引用、一个字节都不拷
// 这个worker每次导出都是 new Worker() 新建的（App.vue 的 exportTo），
// 模块级变量不会在两次任务之间串味，所以不用把mode一路当参数透传。
let localSrcMode = "file";

export const setLocalSrcMode = (mode) => {
    localSrcMode = mode === "protocol" ? "protocol" : "file";
};

export const getLocalSrcMode = () => localSrcMode;

const localSrc = (url) => (localSrcMode === "protocol" ? toMediaUrl(url) : `file://${url}`);

// PDF是静态文档，<video>/<audio> 印出来只是一个画不出来的黑框（或者干脆什么都没有），
// 所以PDF模式下给它换成和“可下载文件卡片”同形状的静态卡片：一个图标 + 文件名。
// 不写任何中文/英文字面量，这份产物和语言无关。
const MEDIA_CARD_ICONS = {
    video: `<svg viewBox="0 0 24 24" aria-hidden="true">`
        + `<rect x="1.5" y="4.5" width="15" height="15" rx="2.5" fill="#42b983"></rect>`
        + `<path d="M17.5 10.2l4.3-2.9a.9.9 0 0 1 1.4.75v7.9a.9.9 0 0 1-1.4.75l-4.3-2.9z" fill="#42b983"></path>`
        + `<path d="M7 8.6l6 3.4-6 3.4z" fill="#ffffff"></path></svg>`,
    audio: `<svg viewBox="0 0 24 24" aria-hidden="true">`
        + `<path d="M11 4.4L5.4 9H2.6a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h2.8l5.6 4.6z" fill="#42b983"></path>`
        + `<path d="M15.3 8.3a5.4 5.4 0 0 1 0 7.4" fill="none" stroke="#42b983" stroke-width="1.8" `
        + `stroke-linecap="round"></path>`
        + `<path d="M18.1 5.5a9.4 9.4 0 0 1 0 13" fill="none" stroke="#42b983" stroke-width="1.8" `
        + `stroke-linecap="round"></path></svg>`,
};

const returnStaticMediaCard = (kind, url, caption) => {
    const mediaName = decodeURI(String(url).split(/\//).pop());
    return `<div class="ame-print-media-card">${MEDIA_CARD_ICONS[kind]}`
        + `<div><div class="ame-print-media-name">${mediaName}</div>`
        + (caption ? `<div class="ame-print-media-caption">${caption}</div>` : "")
        + `</div></div>`;
};

export const returnMediaElement = (isURL, kind, url, caption = "") => {
    // PDF模式：音视频不落地、也播不了，先于取地址的逻辑换成静态卡片
    if (localSrcMode === "protocol" && (kind === 'video' || kind === 'audio')) {
        return returnStaticMediaCard(kind, url, caption);
    }
    let lang = "zh-CN";

    let langOption = {
        "zh-CN": {
            "saveFileInMdz": '保存mdz内嵌媒体文件',
            "unrecognizedFileFlag": '🚫错误：无法识别的文件类型标志：',
        }
    };
    if (kind === 'video') {
        return `<video controls><source src="${isURL ? encodeURI(url) : localSrc(url)}"></video>`;
    } else if (kind === 'audio') {
        return `<audio style="width: 100%;" controls src="${isURL ? encodeURI(url) : localSrc(url)}"></audio>`;
    } else if (kind === 'file') {
        return `<div style="cursor:pointer; display: flex; flex-direction: row; align-items: center; padding: 15px; `
            + `border-radius: 5px; background-color: #42b98330; border: 1px solid #42b983;"><div>`
            + `<svg style="width: 50px; height: 50px;" t="1763025308845" class="icon" viewBox="0 0 1024 1024" `
            + `version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5358" width="200" height="200">`
            + `<path d="M135.68 0c-12.8 0-26.624 5.12-35.84 15.36-10.24 9.216-15.36 23.04-15.36 35.84v919.04c0 `
            + `12.8 5.12 26.624 15.36 35.84 10.24 10.24 23.04 15.36 35.84 15.36h749.056c12.8 0 26.624-5.12 35.84-15.36`
            + ` 10.24-10.24 15.36-23.04 15.36-35.84v-680.96L646.144 0H135.68z" fill="#42b883" p-id="5359" `
            + `data-spm-anchor-id="a313x.search_index.0.i11.5ffa3a81xZnch9" class=""></path>`
            + `<path d="M935.424 289.28h-238.08c-12.8 0-26.624-5.12-35.84-15.36-10.24-9.216-15.36-23.04-15.36-35.`
            + `84V0l289.28 289.28z" fill="#42b883" p-id="5360" `
            + `data-spm-anchor-id="a313x.search_index.0.i10.5ffa3a81xZnch9" class=""></path>`
            + `<path d="M451.072 0h58.368v57.856H451.072V0z m58.88 57.856H568.32v57.856H509.952V57.856zM451.072 `
            + `115.712h58.368v57.856H451.072V115.712z m58.88 57.856H568.32v57.856H509.952V173.568zM451.072 231.`
            + `424h58.368v57.856H451.072V231.424z m58.88 57.856H568.32v57.856H509.952V289.28z m-35.328 57.856H568.`
            + `32v128c0 12.8-10.24 23.04-23.552 23.04H474.624c-12.8 0-23.552-10.24-23.552-23.04V370.176c0-12.8 `
            + `10.752-23.04 23.552-23.04z m11.264 34.816v80.896h46.592V381.952h-46.592z" fill="#FCFCFC" p-id="5361">`
            + `</path></svg></div><div style="width: 10px;"></div><div style="font-weight: bold; `
            + `color: #42b983;">${decodeURI(url.split(/\//).pop())}</div></div>`;
    } else if (kind === 'image') {
        return `<img src="${isURL ? encodeURI(url) : localSrc(url)}" alt="${caption}">`;
    } else {
        return `<p style="color: red; font-weight: bold;">🚫${langOption[lang].unrecognizedFileFlag}${kind}</p>`;
    }
};
