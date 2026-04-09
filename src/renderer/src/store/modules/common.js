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
