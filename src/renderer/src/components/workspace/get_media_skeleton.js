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

export const returnMediaElement = (isURL, kind, url, caption = "") => {
    let lang = localStorage.getItem('lang');

    let langOption = {
        "zh-CN": {
            "saveFileInMdz": '保存mdz内嵌媒体文件',
            "unrecognizedFileFlag": '🚫错误：无法识别的文件类型标志：',
        },
        "zh-TW": {
            "saveFileInMdz": '儲存mdz內嵌媒體文件',
            "unrecognizedFileFlag": '🚫錯誤：無法辨識的文件類型標誌：',
        },
        "en": {
            "saveFileInMdz": 'Save mdz embedded media files as',
            "unrecognizedFileFlag": '🚫ERROR: Unrecognized file type flag: ',
        },
    };
    if (kind === 'video') {
        return `<video controls><source src="${isURL ? encodeURI(url) : ('file://' + url)}"></video>`;
    } else if (kind === 'audio') {
        return `<audio style="width: 100%;" controls src="${isURL ? encodeURI(url) : ('file://' + url)}"></audio>`;
    } else if (kind === 'file') {

        return `<div onclick="window.fileManPreload.saveFileInMdz('${langOption[lang].saveFileInMdz}', '${"file://" + url}');" `
            + `style="cursor:pointer; display: flex; flex-direction: row; align-items: center; padding: 15px; `
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
            + `color: #42b983;">${isURL ? decodeURI(url.split(/\//).pop()) : url.split(/\//).pop()}</div></div>`;
    } else if (kind === 'image') {
        return `<img src="${isURL ? encodeURI(url) : ('file://' + url)}" alt="${caption}">`;
    } else {
        return `<p style="color: red; font-weight: bold;">🚫${langOption[lang].unrecognizedFileFlag}${kind}</p>`;
    }
};
