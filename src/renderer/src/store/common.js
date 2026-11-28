import * as monaco from '../../../../libs/third_party/monaco-editor/esm/vs/editor/editor.api.js';

export const getNow = () => {
    const now = new Date();
    return now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false  // 使用24小时制
    }).replace(/\//g, '-');
};

export const createMonacoEditorModel = (pageId = null, content = "") => {
    if (!pageId) {  // 要是没传入参数，就自己生成
        pageId = "UNUSED_" + crypto.randomUUID();
    }
    const uri = monaco.Uri.parse(`uuid:///${pageId}.md`);
    // 创建并返回 Model 实例
    return monaco.editor.createModel(content, "markdown", uri);
};

// 密码弹出框
const extractMediaMdInCode = (model) => {
    // 这里需要注意，为了不把代码块中的image语句的url也给转换了，所以先把：
    // ---------------------------
    // 1. 内联代码语句
    const inlineCodeRegex = /(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/;
    // ---------------------------
    // 2. 代码块语句“```”
    const codeBlockRegex = /^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/;  // 代码块语句“```”
    const codeBlockSpaceTab = /^( {4,}|\t+).*(?:\\r?\\n( {4,}|\t+).*)*/;  // 代码块语句“\t或4个及以上空格”
    // ---------------------------
    // 3. <pre>...</pre>
    // ---------------------------
    // 4. <pre>
    //        ...
    //    </pre>
    // ---------------------------
    // 5. <pre><code>...</code></pre>
    // ---------------------------
    // 6. <pre>
    //        <code>
    //            ...
    //        </code>
    //    </pre>
    const preTagRegex = /<pre\b[^>]*>[(\s\S)|(\n)|(\r\n)]*?<\/pre>/;
    // 都识别出来，统一以“$CODE-HERE-uuid”做替换，替换下来的以[[content, $CODE-HERE-uuid], ...]二维数组暂时保存入变量
    // 等后面要把“$CODE-HERE-uuid”ID替换回相应原文的时候，将Array进行reverse操作后再进行依次替换
    // 至于为什么用uuid，是因为uuid随机生成，几乎不可能由用户打出来

    // 先匹配块再匹配内联，因为块内可能包含内联
    let imageInCodeKV = [];  // 所有的ID以及对应的替换内容
    let editArray = [];
    const blockCodeMatches = model.findMatches(
        codeBlockRegex.source,
        false,
        true,
        false,
        null,
        true
    );
    if (blockCodeMatches.length > 0) {
        for (let i = 0; i < blockCodeMatches.length; i++) {
            let originContent = blockCodeMatches[i].matches[0];
            let originContentRange = blockCodeMatches[i].range;
            let replaceId = `$CODE-HERE-${crypto.randomUUID()}`;
            let replaceIdReg = `\\${replaceId}`;
            editArray.push({
                range: originContentRange,
                text: replaceId,
                forceMoveMarkers: false // 确保光标和标记跟随替换移动
            });
            imageInCodeKV.push([
                originContent,
                replaceId,
                replaceIdReg
            ]);
        }
    }

    if (editArray.length > 0) {
        // 每次一个条件匹配完就要马上修改
        model.pushStackElement();
        model.applyEdits(editArray, false);  // 开始将原始code内容替换成ID
        model.pushStackElement();
    }
    editArray = [];
    const blockCodeSpaceTabMatches = model.findMatches(
        codeBlockSpaceTab.source,
        false,
        true,
        false,
        null,
        true
    );
    if (blockCodeSpaceTabMatches.length > 0) {
        for (let i = 0; i < blockCodeSpaceTabMatches.length; i++) {
            let originContent = blockCodeSpaceTabMatches[i].matches[0];
            let originContentRange = blockCodeSpaceTabMatches[i].range;
            let replaceId = `$CODE-HERE-${crypto.randomUUID()}`;
            let replaceIdReg = `\\${replaceId}`;
            editArray.push({
                range: originContentRange,
                text: replaceId,
                forceMoveMarkers: false // 确保光标和标记跟随替换移动
            });
            imageInCodeKV.push([
                originContent,
                replaceId,
                replaceIdReg
            ]);
        }
    }

    if (editArray.length > 0) {
        // 每次一个条件匹配完就要马上修改
        model.pushStackElement();
        model.applyEdits(editArray, false);
        model.pushStackElement();
    }
    editArray = [];
    const inlineCodeMatches = model.findMatches(
        inlineCodeRegex.source,
        false,
        true,
        false,
        null,
        true
    );
    if (inlineCodeMatches.length > 0) {
        for (let i = 0; i < inlineCodeMatches.length; i++) {
            let originContent = inlineCodeMatches[i].matches[0];
            let originContentRange = inlineCodeMatches[i].range;
            let replaceId = `$CODE-HERE-${crypto.randomUUID()}`;
            let replaceIdReg = `\\${replaceId}`;
            editArray.push({
                range: originContentRange,
                text: replaceId,
                forceMoveMarkers: false // 确保光标和标记跟随替换移动
            });
            imageInCodeKV.push([
                originContent,
                replaceId,
                replaceIdReg
            ]);
        }
    }

    if (editArray.length > 0) {
        model.pushStackElement();
        model.applyEdits(editArray, false);
        model.pushStackElement();
    }
    editArray = [];
    const preTagMatches = model.findMatches(
        preTagRegex.source,
        false,
        true,
        false,
        null,
        true
    );
    if (preTagMatches.length > 0) {
        for (let i = 0; i < preTagMatches.length; i++) {
            let originContent = preTagMatches[i].matches[0];
            let originContentRange = preTagMatches[i].range;
            let replaceId = `$CODE-HERE-${crypto.randomUUID()}`;
            let replaceIdReg = `\\${replaceId}`;
            editArray.push({
                range: originContentRange,
                text: replaceId,
                forceMoveMarkers: false // 确保光标和标记跟随替换移动
            });
            imageInCodeKV.push([
                originContent,
                replaceId,
                replaceIdReg
            ]);
        }
    }

    if (editArray.length > 0) {
        model.pushStackElement();
        model.applyEdits(editArray, false);
        model.pushStackElement();
    }
    editArray = null;
    imageInCodeKV.reverse();  // 将imageInCodeKV列表进行reverse
    return imageInCodeKV;
};

export const getMdzMediaPathToDirectPathEdits = async (model, presentPath, presentPureFileName, savePath, savePureFileName) => {
    // 将mdz媒体路径转为普通绝对路径
    let replaceArray = extractMediaMdInCode(model);
    const imageRegex = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+["']([^"']*)["'])?\)/;
    const matches = model.findMatches(
        imageRegex.source,  // 要查找的字符串或正则表达式
        false,  // 是否只在可编辑范围内查找
        true,  // searchString 是否为正则表达式
        false,  // 是否区分大小写
        null,  // 字分隔符（如需要匹配整个单词）
        true  // 是否捕获匹配组（仅对正则有效）
    );
    if (matches.length > 0) {
        let edits = [];
        let copies = [];
        for (let i = 0; i < matches.length; i++) {
            let alt = matches[i].matches[1];
            let url = matches[i].matches[2];
            let textAfterUrl = matches[i].matches[3] ? ` "${matches[i].matches[3]}"` : '';
            const mdzPattern = /^(\$MDZ_MEDIA)\/\S+/;
            const imageBase64Pattern = /data:image\/(.*?);base64,/;
            const win32PathPattern = /(^([A-Za-z]:)(\/\S+)+)|(^([A-Za-z]:)(\\\S+)+)/;
            const urlPattern = /^(http(s?))(:\/\/)(\S+)/;
            if (mdzPattern.test(url) && (!imageBase64Pattern.test(url) || !urlPattern.test(url))) {
                // 符合mdz媒体路径语法
                let mediaFileName = url.replace("$MDZ_MEDIA/", "");
                if (win32PathPattern.test(savePath)) {
                    savePath = savePath.split(/\\|\//).join("/");  // 把路径分隔符洗一遍
                }
                edits.push({
                    range: matches[i].range,
                    text: `![${alt}](${savePath + "/" + savePureFileName + ".media_dir/" + mediaFileName}${textAfterUrl})`,
                    forceMoveMarkers: false // 确保光标和标记跟随替换移动
                });
                copies.push(
                    [
                        // 源文件 -> 拷贝文件
                        `${presentPath}/._mdz_content.${presentPureFileName}/mdz_contents/media_src/${decodeURI(mediaFileName)}`,
                        `${savePath}/${savePureFileName}.media_dir/${decodeURI(mediaFileName)}`,
                    ]
                );
            }
        }
        return [edits, copies, replaceArray];
    } else {
        // 就算没有匹配到多媒体语句，也应该把已经替换的code部分给替换回来
        return [[], [], replaceArray];
    }
};

export const getDirectPathToMdzMediaPathEdits = async (model, savePureFileName,
                                                       savePath, saveAs = false,
                                                       originPureFileName = "", originPurePath = ""
) => {
    // 将普通绝对路径转为mdz媒体路径
    let replaceArray = extractMediaMdInCode(model);
    const imageRegex = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+["']([^"']*)["'])?\)/;
    const matches = model.findMatches(
        imageRegex.source,
        false,
        true,
        false,
        null,
        true
    );
    if (matches.length > 0) {
        let edits = [];
        let copies = [];
        for (let i = 0; i < matches.length; i++) {
            let alt = matches[i].matches[1];
            let url = matches[i].matches[2];
            let textAfterUrl = matches[i].matches[3] ? ` "${matches[i].matches[3]}"` : '';
            const win32PathPattern = /(^([A-Za-z]:)(\/\S+)+)|(^([A-Za-z]:)(\\\S+)+)/;
            const posixPathPattern = /^(\/)(\S+)(\/\S+)+/;
            const imageBase64Pattern = /data:image\/(.*?);base64,/;
            const mdzPattern = /^(\$MDZ_MEDIA)\/\S+/;
            const urlPattern = /^(http(s?))(:\/\/)(\S+)/;
            // 然后剩下的再进行多媒体url的修改和替换
            let mediaFileName = url.split(/\\|\//).pop();
            if ((win32PathPattern.test(url) || posixPathPattern.test(url))
                && (!imageBase64Pattern.test(url) || !urlPattern.test(url))) {
                // 符合本地绝对路径语法
                edits.push({
                    range: matches[i].range,
                    text: `![${alt}]($MDZ_MEDIA/${mediaFileName}${textAfterUrl})`,
                    forceMoveMarkers: false
                });
                copies.push(
                    [decodeURI(url), `${savePath}/._mdz_content.${savePureFileName}/mdz_contents/media_src/${decodeURI(mediaFileName)}`]  // 源文件 -> 拷贝文件
                );
            }
            // 当saveAs = true时，且当一个已存在的旧mdz文件另存为另一个mdz文件
            // 则记录旧mdz文件实际媒体路径 -> 新mdz文件实际媒体路径
            if (saveAs) {
                if (mdzPattern.test(url)) {
                    copies.push(
                        [
                            `${originPurePath}/._mdz_content.${originPureFileName}/mdz_contents/media_src/${decodeURI(url.split("/").pop())}`,
                            `${savePath}/._mdz_content.${savePureFileName}/mdz_contents/media_src/${decodeURI(mediaFileName)}`]
                    );
                }
            }
        }
        return [edits, copies, replaceArray];
    } else {
        // 就算没有匹配到多媒体语句，也应该把已经替换的code部分给替换回来
        return [[], [], replaceArray];
    }
};

export const replaceIdToOriginCode = async (model, replaceArray) => {
    let edits = [];
    for (let i = 0; i < replaceArray.length; i++) {

        if (i % 50 === 0) {
            await new Promise(resolve => setTimeout(resolve, 150));
        }

        let content = replaceArray[i][0];
        const idMatches = model.findMatches(
            replaceArray[i][2],
            false,
            true,
            true,
            null,
            true,
            100
        );
        if (idMatches.length > 0) {
            edits.push({
                range: idMatches[0].range,
                text: content,
                forceMoveMarkers: false // 确保光标和标记跟随替换移动
            });
        }
    }
    model.pushStackElement();
    model.applyEdits(edits);
    model.pushStackElement();
    edits = null;  // 用完就把变量回收
}

export const verifySaveForm = (formArray, rootState) => {
    // 用户提供的文件信息，则包含：data = [单纯文件名, 扩展名, 保存路径, 密码, 再次输入密码]
    const fileForbiddenChars = [">", "<", ":", "'", "|", "*", "?"];

    if (formArray[0] === '') {
        return {
            "success": false,
            message: rootState.i18n.langPackage[rootState.settings.lang].dialog.saveForm.fileNameRequired
        };
    }

    for (let i = 0; i < fileForbiddenChars.length; i++) {
        if (formArray[0].includes(fileForbiddenChars[i])) {
            return {
                "success": false,
                message: rootState.i18n.langPackage[rootState.settings.lang].dialog.saveForm.forbiddenChars
            };
        }
    }

    if (formArray[2] === '') {
        return {
            "success": false,
            message: rootState.i18n.langPackage[rootState.settings.lang].dialog.saveForm.savePathRequired
        };
    }

    if (formArray[3] !== formArray[4]) {
        return {
            "success": false,
            message: rootState.i18n.langPackage[rootState.settings.lang].dialog.saveForm.twicePasswordNotSame
        };
    }
    return {"success": true};
};
