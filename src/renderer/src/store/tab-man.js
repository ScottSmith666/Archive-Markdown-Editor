// 创建新标签页时创建对应页面的monaco editor model
import {defineStore} from "pinia";
import {useMainMenuManStore} from "./main-menu-man";
import {useI18nStore} from "./i18n";
import router from "../router";
import {markRaw} from "vue";
import {createMonacoEditorModel} from "./common.js";

export const useTabManStore = defineStore("tab-man", {
    state: () => {
        return {
            // Tab窗口管理相关变量
            tabList: new Map(),  // 所有打开的Tab(s)
            currentOpenedPageId: 'DEFAULT_PAGE',  // 当前打开窗口的pageId
            currentTryClosePageId: 'DEFAULT_PAGE',  // 用户施加过关闭指令的pageId
            currentOpenedTabNumber: 0,

            showConfirm: false,  // 是否显示“确认”“取消”弹出框
            showConfirmModal: false,  // 是否显示和“确认”“取消”弹出框搭配的modal
        };
    },

    actions: {
        // 以下是标签页更改方法
        // 新增标签页
        // 第二个参数是object，里面有pageType, pageTitle和isExistFile和docName属性，注意docName是AME内置文档的名称，用于显示在document页面
        addTabPage(object) {
            const mainMenuManStore = useMainMenuManStore();
            mainMenuManStore.mainManuAllHide();
            let isOpenedWelcome = false;
            let isOpenedSettings = false;
            let isOpenedMdzMediaMan = false;
            // 检查设置页面和欢迎页面有没有打开
            for (let [key, value] of this.tabList) {
                if (value.get('type') === 'welcome') {
                    isOpenedWelcome = true;
                }

                if (value.get('type') === 'settings') {
                    isOpenedSettings = true;
                }

                if (value.get('type') === 'tools') {
                    let url = value.get('path');
                    let paramsList = url.split('?')[1].split('&');
                    for (let paramI = 0; paramI < paramsList.length; paramI++) {
                        if (paramsList[paramI].split('=')[0] === 'toolkind') {
                            if (paramsList[paramI].split('=')[1] === 'mdzMediaMan') {
                                isOpenedMdzMediaMan = true;
                                break;
                            }
                        }
                    }
                }
            }

            if (object.pageType === 'welcome' && isOpenedWelcome) {
                return 0;
            }
            if (object.pageType === 'settings' && isOpenedSettings) {
                return 0;
            }
            if (object.pageType === 'tools' && isOpenedMdzMediaMan) {
                return 0;
            }

            let lastFilePageID = this.currentOpenedPageId;
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
            if (this.tabList.get(lastFilePageID)) {
                this.tabList.get(lastFilePageID).set('focus', false);
            }

            let newPageObject = new Map(Object.entries({
                "label": object.pageTitle,
                "type": object.pageType,
                // object.toolKind的值有”mdzMediaMan“和”preview“
                "path": `/${urlContent}?pageid=${filePageID}${object.docName ? ("&docname=" + object.docName) : ""}${object.isExistFile ? "&filepath=" + object.filePath : ""}${object.toolKind ? "&toolkind=" + object.toolKind : ""}${object.previewMediaPath ? "&previewmediapath=" + object.previewMediaPath : ""}`,
                "focus": true,
                "isExistFile": object.isExistFile,
                "saved": true,
                "hovered": false,
                "pageid": filePageID,
                "monacoEditorModel": markRaw(model),
                "encrypted": object.encrypted ? (object.encrypted === true) : false,
                "password": object.password ? object.password : "",
                "viewState": null,
            }));
            this.tabList.set(filePageID, newPageObject);
            this.currentOpenedPageId = filePageID;  // 更新当前打开的pageId
            // 最后把页面切过去
            this.currentOpenedPageId = newPageObject.get('pageid');
            router.replace(newPageObject.get('path'));
            this.currentOpenedTabNumber = this.tabList.size;  // 更新目前共打开了几个页面
        },

        // 关闭指定标签页
        closeTabPage(object) {
            this.currentTryClosePageId = object.pageId; // 马上将施加关闭指令的窗口ID固定
            let keys = Array.from(this.tabList.keys());  // 获得所有标签的pageId (Key Array)
            // 先检查该页面保存状态
            if (this.tabList.get(object.pageId).get('saved')) {
                // 检查目前还有几个标签页
                if (keys.length > 1) {
                    // 再检查要关闭的标签页是不是最后一个
                    this.deleteThisEditorPageContent(object.pageId, object.model);
                    this.executeClose(object, keys);
                } else if (keys.length === 1) {
                    this.deleteThisEditorPageContent(object.pageId, object.model);
                    this.tabList.delete(object.pageId);
                    // 切回默认页面
                    this.currentOpenedPageId = "DEFAULT_PAGE";
                    router.replace("/");
                }
                this.currentOpenedTabNumber = this.tabList.size;
            } else {
                // 弹窗提示未保存
                this.showConfirmModal = true;
                this.showConfirm = true;
            }
        },

        // 清除本页面所有内容
        deleteThisEditorPageContent(pageid, model) {
            // 释放Monaco Editor Model
            model.dispose();
            // 如果打开了mdz文件，则删除对应目录中的残留文件夹
            let pageInfo = this.tabList.get(pageid);
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
                        this.currentOpenedTabNumber = this.tabList.size;
                    }).catch((e) => {
                        this.currentOpenedTabNumber = this.tabList.size;
                    });
                } else {
                }
            } else {
                this.currentOpenedTabNumber = this.tabList.size;
            }
        },

        executeClose(object, keys) {
            const isLastTab = keys.indexOf(object.pageId) === keys.length - 1;  // 检查要关闭的标签页是不是最后一个
            // 如果被关闭的标签页状态是active，则直接切换到被关闭的标签页的前一个标签页
            if (this.tabList.get(object.pageId).get('focus')) {
                let idx = keys.indexOf(object.pageId);
                this.tabList.delete(object.pageId);  // 删除一个标签页
                keys = Array.from(this.tabList.keys());  // 因为前面一行代码删了Map的一个元素，因此这次获得的标签的pageId Array少了那个被删掉的pageId
                this.changePropsOfTab(isLastTab ? keys[keys.length - 1] : keys[idx], "focus", true);
                this.currentOpenedPageId = this.tabList.get(isLastTab ? keys[keys.length - 1] : keys[idx]).get('pageid');
                router.replace(this.tabList.get(isLastTab ? keys[keys.length - 1] : keys[idx]).get('path'));
            } else {
                this.tabList.delete(object.pageId);
            }
        },

        // 更改指定标签页属性
        changePropsOfTab(pageId, propName, propValue) {
            if (this.tabList.get(pageId)) {
                if (propName === 'viewState') {  // 防止过度深层解析导致卡死
                    propValue = markRaw(propValue);
                }
                this.tabList.get(pageId).set(propName, propValue);
            }
        },

        // 确认弹出框点击事件
        confirmDialogInteractive(isConfirmed) {
            if (isConfirmed) {
                // 这里的逻辑是：如果弹窗那边选择确认，就把state.tabList.get(object.pageId).get('saved')设置成true
                // 这样再请求关闭页面就能关闭了
                this.tabList.get(this.currentTryClosePageId).set('saved', true);
                this.closeTabPage({
                    'pageId': this.currentTryClosePageId,
                    'model': this.tabList.get(this.currentTryClosePageId).get('monacoEditorModel')
                });
            }
            this.showConfirmModal = false;
            this.showConfirm = false;
        },

        // 切换到指定标签页
        // 切换标签页
        switchToCurrentTab(object) {
            // 先让上一个标签页处于inactive状态
            this.changePropsOfTab(this.currentOpenedPageId, 'focus', false);
            // 然后点亮当前点击的标签页
            this.changePropsOfTab(object.pageId, "focus", true);
            // 最后把页面切过去
            this.currentOpenedPageId = this.tabList.get(object.pageId).get('pageid');
            router.replace(this.tabList.get(object.pageId).get('path'));
        },

        // 初始化（即软件启动后）打开的页面，计划分为：不打开任何页面、打开欢迎页面
        async initOpenAppTab() {  // 第一次打开AME时加载的页面，可进行更改
            let lang = localStorage.getItem('lang');
            let initPageId = crypto.randomUUID();

            const i8nStore = useI18nStore();

            let i18nObject = i8nStore.langPackage;
            let initPage = new Map(Object.entries({
                "label": i18nObject[lang].welcomePage.tabTitle,
                "type": 'welcome',  // 标签页类型，分为文件（file）、欢迎页面（welcome）、设置页面（settings）、文档页面（document）和工具页面（tools）
                                    // 其中文档页面可以渲染“关于”“更新日志”“使用指南”等自定义内容
                                    // 工具页面为各类集成工具的使用页面，如“mdz多媒体文件预览”以及“文本比对工具”等
                                    // 并且禁止打开多个欢迎页面（welcome）和设置页面（settings）
                "path": '/welcome',
                "focus": true,
                "isExistFile": false,  // 是否为一个真实存在的文件
                "saved": true,  // 当前页面文件保存状态
                "hovered": false,  // 鼠标是否划过标签页
                "pageid": initPageId,  // 标签页唯一ID
                "monacoEditorModel": markRaw(createMonacoEditorModel()),
                "encrypted": false,
                "password": "",
                "viewState": null,  // 保存编辑区状态
            }));
            // 如果设置为启动时不打开任何页面，则该值为空值
            // let initPage = null;
            if (initPage) {
                this.tabList.set(initPageId, initPage);
                this.currentOpenedPageId = initPageId;
                this.currentOpenedTabNumber = 1;  // 更新目前共打开了几个页面
                router.replace(initPage.get('path'));
            } else {
                // 如果设置为启动时不打开任何页面，即展示的就是默认页面，当前打开的页面ID就设置为“DEFAULT_PAGE”
                router.replace('/');
            }
        },

        isOpened(filePath) {
            // 遍历每个标签（即打开的文件信息）
            let isOpenedFile = false;
            for (const [key, value] of this.tabList) {
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
        },
    },
});
