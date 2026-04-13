import * as monaco from '../../../../../libs/third_party/monaco-editor/esm/vs/editor/editor.api.js';
import router from "../../router";
import {markRaw} from "vue";

export const mainManuAllHide = (state) => {
    // 关闭所有菜单栏下拉
    state.fileMenuStyleStatus = false;
    state.editMenuStyleStatus = false;
    state.viewMenuStyleStatus = false;
    state.toolMenuStyleStatus = false;
    state.helpMenuStyleStatus = false;
};

export const createMonacoEditorModel = (pageId, content = "") => {
    if (!pageId) {  // 要是没传入参数，就自己生成
        pageId = "UNUSED_" + crypto.randomUUID();
    }
    const uri = monaco.Uri.parse(`uuid:///${pageId}.md`);
    // 创建并返回 Model 实例
    return monaco.editor.createModel(content, "markdown", uri);
};

export const switchToPage = (state, item) => {
    // 更新当前窗口类型状态
    // state.currentActivatedTabType = item.get('type');
    state.currentOpenedPageId = item.get('pageid');
    router.replace(item.get('path'));
};

export const changePropsOfTab = (state, pageId, propName, propValue) => {
    if (state.tabList.get(pageId)) {
        state.tabList.get(pageId).set(propName, propValue);
    }
};

// 清除本页面所有内容
export const deleteThisEditorPage = (state, pageid, model) => {
    // 释放Monaco Editor Model
    model.dispose();
    // 如果打开了mdz文件，则删除对应目录中的残留文件夹
    let pageInfo = state.tabList.get(pageid);
    if (pageInfo.get("isExistFile")) {
        let pageRouter = pageInfo.get("path");
        let pagePathParam = pageRouter.split("&").pop();
        let pagePath = pagePathParam.replace("filepath=", "");
        let ext = pagePath.split(".").pop();
        let pagePathArray = pagePath.split(/\\|\//);
        let fileName = pagePathArray.pop();
        let fileNameArray = fileName.split(".");
        fileNameArray.pop();
        let pureFileName = fileNameArray.join(".");
        let pathRemoveFileName = pagePathArray.join("/");
        if (ext === "mdz") {
            // 执行清除残余文件夹代码
            let cleanPath = `${pathRemoveFileName}/._mdz_content.${pureFileName}`;
            window.fileManPreload.cleanMdzFolder(cleanPath).then(() => {
                state.currentOpenedTabNumber = state.tabList.size;
            }).catch((e) => {
                state.currentOpenedTabNumber = state.tabList.size;
            });
        } else {
        }
    } else {
        state.currentOpenedTabNumber = state.tabList.size;
    }
};

export const addTabPage = (state, object) => {  // 新增标签页
    let lastFilePageID = state.currentOpenedPageId;
    let filePageID = crypto.randomUUID();
    let urlContent;
    let model;
    if (object.pageType === 'file') {
        urlContent = 'workspace';
        model = createMonacoEditorModel(filePageID, object.isExistFile ? object.content : '');
    } else {
        model = createMonacoEditorModel();
        urlContent = object.pageType;
    }
    // 将上一个pageId对应的Tab取消选中
    changePropsOfTab(state, lastFilePageID, 'focus', false);

    let newPageObject = new Map(Object.entries({
        "label": object.pageTitle,
        "type": object.pageType,
        "path": `/${urlContent}?pageid=${filePageID}${object.docName ? ("&docname=" + object.docName) : ""}${object.isExistFile ? "&filepath=" + object.filePath : ""}`,
        "focus": true,
        "isExistFile": object.isExistFile,
        "saved": true,
        "hovered": false,
        "pageid": filePageID,
        "monacoEditorModel": markRaw(model),
        "encrypted": object.encrypted ? (object.encrypted === true) : false,
        "password": object.password ? object.password : "",
    }));
    state.tabList.set(filePageID, newPageObject);
    state.currentOpenedPageId = filePageID;  // 更新当前打开的pageId
    // 最后把页面切过去
    switchToPage(state, newPageObject);
    state.currentOpenedTabNumber = state.tabList.size;  // 更新目前共打开了几个页面
};

export const closeTabPage = (state, object) => {
    state.currentTryClosePageId = object.pageId; // 马上将施加关闭指令的窗口ID固定
    let keys = Array.from(state.tabList.keys());  // 获得所有标签的pageId (Key Array)
    // 先检查该页面保存状态
    if (state.tabList.get(object.pageId).get('saved')) {
        // 检查目前还有几个标签页
        if (keys.length > 1) {
            // 再检查要关闭的标签页是不是最后一个
            if (keys.indexOf(object.pageId) === keys.length - 1) {  // 是最后一个
                // 如果被关闭的标签页状态是active，则直接切换到被关闭的标签页的前一个标签页
                deleteThisEditorPage(state, object.pageId, object.model);
                if (state.tabList.get(object.pageId).get('focus')) {
                    state.tabList.delete(object.pageId);  // 删除一个标签页
                    keys = Array.from(state.tabList.keys());  // 因为前面一行代码删了Map的一个元素，因此这次获得的标签的pageId Array少了那个被删掉的pageId
                    changePropsOfTab(state, keys[keys.length - 1], "focus", true);
                    switchToPage(state, state.tabList.get(keys[keys.length - 1]));
                } else {
                    state.tabList.delete(object.pageId);
                }
            } else {
                deleteThisEditorPage(state, object.pageId, object.model);
                if (state.tabList.get(object.pageId).get('focus')) {
                    let idx = keys.indexOf(object.pageId);
                    state.tabList.delete(object.pageId);
                    keys = Array.from(state.tabList.keys());  // 因为前面一行代码删了Map的一个元素，因此这次获得的标签的pageId Array少了那个被删掉的pageId
                    changePropsOfTab(state, keys[idx], "focus", true);
                    switchToPage(state, state.tabList.get(keys[idx]));
                } else {
                    state.tabList.delete(object.pageId);
                }
            }
        } else if (keys.length === 1) {
            deleteThisEditorPage(state, object.pageId, object.model);
            state.tabList.delete(object.pageId);
            // 切回默认页面
            switchToPage(state, new Map(Object.entries({
                "type": 'default',
                "path": '/',
                "monacoEditorModel": createMonacoEditorModel(),
                "encrypted": false,
                "password": "",
            })));
        }
        state.currentOpenedTabNumber = state.tabList.size;
    } else {
        // 弹窗提示未保存
        state.showConfirmModal = !state.showConfirmModal;
        state.showConfirm = !state.showConfirm;
    }
};

export const tgModel = (rootState, object) => {
    // object: {kind: "..."}
    rootState.lifecycle.showModal = !rootState.lifecycle.showModal;
    if (object.kind === 'donate') {
        rootState.lifecycle.showDonate = !rootState.lifecycle.showDonate;
    }
};

export const actModel = (rootState, object) => {
    // object: {kind: "...", tipLevel: "...", content: "...", showTimeSecond: %d}
    if (object.kind === 'loading') {  // kind是提示框的类型，分为loading、donate和tip，none则是仅弹出背景模态框
        rootState.lifecycle.loadingContent = object.content;
        rootState.lifecycle.showLoading = !rootState.lifecycle.showLoading;
    } else if (object.kind === 'tip') {
        rootState.lifecycle.tipContent = object.content;
        rootState.lifecycle.tLevel = object.tipLevel;
        rootState.lifecycle.showTip = !rootState.lifecycle.showTip;
        setTimeout(() => {
            rootState.lifecycle.showTip = !rootState.lifecycle.showTip;
            rootState.lifecycle.showModal = !rootState.lifecycle.showModal;
        }, object.showTimeSecond * 1000);
    }
};

export const hdLoading = (rootState) => {
    rootState.lifecycle.showLoading = !rootState.lifecycle.showLoading;
    rootState.lifecycle.showModal = !rootState.lifecycle.showModal;
};

export const hdSaveForm = (rootState) => {
    rootState.lifecycle.showSaveAs = !rootState.lifecycle.showSaveAs;
    rootState.lifecycle.showModal = !rootState.lifecycle.showModal;
};

export const isOpened = (rootState, filePath) => {
    // 遍历每个标签（即打开的文件信息）
    let isOpenedFile = false;
    for (const [key, value] of rootState.tab.tabList) {
        if (value.get("isExistFile")) {
            let openedPathParam = value.get("path").split("&").pop();
            let openedPath = openedPathParam.replace("filepath=", "");
            if (openedPath === filePath) {
                isOpenedFile = true;
                break;
            }
        }
    }
    return isOpenedFile;
};

export const afterChosenFile = (rootState, result, isHistoryMethod = false) => {
    if (isHistoryMethod) {
        tgModel(rootState, {kind: "none"});
    }
    // 判断是否已经打开过文件
    if (isOpened(rootState, result.filePath)) {
        actModel(rootState, {
            'kind': 'tip',
            'tipLevel': 'fail',
            'content': "禁止重复打开已打开的文件",
            'showTimeSecond': rootState.lifecycle.tipDisplayTime
        });
        return 0;
    }
    // 检查文件内是否有非法字符
    const fileForbiddenChars = [">", "<", ":", "'", "|", "*", "?"];
    let fileName = result.filePath.split(/\\|\//).pop();
    for (let i = 0; i < fileForbiddenChars.length; i++) {
        if (fileName.includes(fileForbiddenChars[i])) {
            actModel(rootState, {
                'kind': 'tip',
                'tipLevel': 'fail',
                'content': "文件名内有非法字符 > < : ' | * ?",
                'showTimeSecond': rootState.lifecycle.tipDisplayTime
            });
            return 0;
        }
    }

    actModel(rootState, {kind: "loading", content: "正在打开文件..."});  // 显示加载
    // 获得文件路径后，异步打开文件获得内容
    let planOpenFilePath = result.filePath;
    let planOpenFileName = result.fileName;
    let ext = planOpenFileName.split(".").pop();
    let content = "不支持打开这种类型的文件！";
    window.fileManPreload.loadFileContent(planOpenFilePath, content).then(async (result2) => {
        if (result2.success) {  // 符合条件的md、txt文件以及不带密码的mdz文件可直接打开
            // 然后将其装载入Monaco Editor Model
            // 最后将这个Model装入Tab Map，打开这个Tab对应的页面
            addTabPage(rootState.tab, {
                'pageType': 'file',
                'pageTitle': result2.name,
                'isExistFile': true,
                'filePath': result2.path,
                'content': result2.content,
            });
            hdLoading(rootState);  // 最后等页面load完成后，再关闭加载提示
        } else {
            if (ext === 'md' || ext === 'txt') {  // 符合条件的md、txt文件以及不带密码的mdz文件出错那是真出错了，直接抛出异常提示
                hdLoading(rootState);  // 最后等页面load完成后，再关闭加载提示
                tgModel(rootState, {kind: "none"});
                actModel(rootState, {
                    'kind': 'tip',
                    'tipLevel': 'fail',
                    'content': result2.message.includes('no such file or directory')
                        ? '无法打开不存在的文件'
                        : result2.message,
                    'showTimeSecond': rootState.lifecycle.tipDisplayTime
                });
            } else if (ext === 'mdz') {
                // 很可能是因为mdz设置了密码
                // 进一步if确认如果真的mdz设置了密码
                if (result2.message === "PASSWORD_REQUIRED") {
                    // 说明mdz设置了密码
                    // 那就弹出需要解锁密码的弹框输入密码
                    let promTitle = "输入密码";
                    let promContent = "此文件已加密，需要输入密码查看内容";
                    while (true) {
                        try {
                            let returnFromInputMdzPasswordDialog = await window.fileManPreload.activateInputMdzPasswordDialog(promTitle, promContent);
                            if (returnFromInputMdzPasswordDialog.success) {
                                let userMdzPassword = returnFromInputMdzPasswordDialog.password;
                                // 开始尝试用输入的密码打开加密mdz
                                let result4 = await window.fileManPreload.loadEncryptedMdzFileContent(planOpenFilePath, userMdzPassword);
                                if (result4.success) {
                                    // 说明密码正确，开始加载内容
                                    addTabPage(rootState.tab, {
                                        'pageType': 'file',
                                        'pageTitle': result4.name,
                                        'isExistFile': true,
                                        'filePath': result4.path,
                                        'content': result4.content,
                                        'encrypted': result4.encrypted,
                                        'password': userMdzPassword,
                                    });
                                    hdLoading(rootState);  // 最后等页面load完成后，再关闭加载提示
                                    break;
                                } else {
                                    if (result4.message === "WRONG_PASSWORD_ERROR") {
                                        promTitle = "密码错误，请重试";
                                    }
                                    // 如果不点取消则会一直重试
                                }
                            } else {
                                hdLoading(rootState);
                                tgModel(rootState, {kind: "none"});
                                // 用户点击了取消
                                if (returnFromInputMdzPasswordDialog.message === "USER_PASSWORD_CANCELLED") {
                                    actModel(rootState, {
                                        'kind': 'tip',
                                        'tipLevel': 'info',
                                        'content': '用户已取消输入密码!',
                                        'showTimeSecond': rootState.lifecycle.tipDisplayTime
                                    });
                                } else {
                                    actModel(rootState, {
                                        'kind': 'tip',
                                        'tipLevel': 'fail',
                                        'content': returnFromInputMdzPasswordDialog.message,
                                        'showTimeSecond': rootState.lifecycle.tipDisplayTime
                                    });
                                }
                                break;
                            }
                        } catch (e) {
                            hdLoading(rootState);
                            tgModel(rootState, {kind: "none"});
                            actModel(rootState, {
                                'kind': 'tip',
                                'tipLevel': 'fail',
                                'content': `${e.name}: ${e.message}`,
                                'showTimeSecond': rootState.lifecycle.tipDisplayTime
                            });
                            break;
                        }
                    }
                } else {
                    hdLoading(rootState);
                    tgModel(rootState, {kind: "none"});
                    actModel(rootState, {
                        'kind': 'tip',
                        'tipLevel': 'fail',
                        'content': result2.message === "FILE_NOT_FOUND" ? "无法打开不存在的文件" : result2.message,
                        'showTimeSecond': rootState.lifecycle.tipDisplayTime
                    });
                }
            }
        }
    }).catch((e) => {
        actModel(rootState, {
            'kind': 'tip',
            'tipLevel': 'fail',
            'content': `${e.name}: ${e.message}`,
            'showTimeSecond': rootState.lifecycle.tipDisplayTime
        });
    });
};

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
            console.log('originContent', originContent);
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
            console.log('originContentSpaceTab', originContent);
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
    console.log("code -> ID替换完成");
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
                        `${presentPath}/._mdz_content.${presentPureFileName}/mdz_contents/media_src/${mediaFileName}`,
                        `${savePath}/${savePureFileName}.media_dir/${mediaFileName}`,
                    ]
                );
            }
        }
        return [edits, copies, replaceArray];
    } else {
        return [[], [], []];
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
    console.log("matches", matches);
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
                    [url, `${savePath}/._mdz_content.${savePureFileName}/mdz_contents/media_src/${mediaFileName}`]  // 源文件 -> 拷贝文件
                );
            }
            // 当saveAs = true时，且当一个已存在的旧mdz文件另存为另一个mdz文件
            // 则记录旧mdz文件实际媒体路径 -> 新mdz文件实际媒体路径
            if (saveAs) {
                if (mdzPattern.test(url)) {
                    copies.push(
                        [
                            `${originPurePath}/._mdz_content.${originPureFileName}/mdz_contents/media_src/${url.split("/").pop()}`,
                            `${savePath}/._mdz_content.${savePureFileName}/mdz_contents/media_src/${mediaFileName}`]
                    );
                }
            }
        }
        return [edits, copies, replaceArray];
    } else {
        return [[], [], []];
    }
};

export const replaceIdToOriginCode = async (model, replaceArray) => {
    let edits = [];
    for (let i = 0; i < replaceArray.length; i++) {

        if (i % 50 === 0) {
            await new Promise(resolve => setTimeout(resolve, 150));
        }

        console.log(`(${i + 1}) replaceArray[i]`, replaceArray[i]);
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
        console.log("idMatches", idMatches);
        if (idMatches.length > 0) {
            edits.push({
                range: idMatches[0].range,
                text: content,
                forceMoveMarkers: false // 确保光标和标记跟随替换移动
            });
        }
    }
    console.log("edits in replaceIdToOriginCode", edits);
    model.pushStackElement();
    model.applyEdits(edits);
    model.pushStackElement();
    edits = null;  // 用完就把变量回收
    console.log("ID -> code替换完成");
}

export const verifySaveForm = (formArray) => {
    // 用户提供的文件信息，则包含：data = [单纯文件名, 扩展名, 保存路径, 密码, 再次输入密码]
    console.log("verifySaveForm", formArray);
    const fileForbiddenChars = [">", "<", ":", "'", "|", "*", "?"];

    if (formArray[0] === '') {
        return {"success": false, message: "保存失败，请填写文件名！"};
    }

    for (let i = 0; i < fileForbiddenChars.length; i++) {
        if (formArray[0].includes(fileForbiddenChars[i])) {
            return {"success": false, message: "保存失败，文件名内含有非法字符 > < : ' | * ?"};
        }
    }

    if (formArray[2] === '') {
        return {"success": false, message: "保存失败，未指定保存路径！"};
    }

    console.log("formArray[3]", formArray[3]);
    console.log("formArray[4]", formArray[4]);
    if (formArray[3] !== formArray[4]) {
        return {"success": false, message: "保存失败，两次输入的密码不一致，请重新输入！"};
    }

    return {"success": true};
};
