// 创建新标签页时创建对应页面的monaco editor model
import router from "../../router";
import {markRaw} from "vue";
import {
    switchTo,
    mainManuAllHide,
    addTabPage,
    changePropsOfTab,
    switchToPage,
    createMonacoEditorModel,
    closeTabPage
} from "./common.js";

export const tMan = {
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
    mutations: {
        // 以下是标签页更改方法
        // 新增标签页
        // 第二个参数是object，里面有pageType, pageTitle和isExistFile和docName属性，注意docName是AME内置文档的名称，用于显示在document页面
        addTabPage(state, object) {
            mainManuAllHide(state);
            let isOpenedWelcome = false;
            let isOpenedSettings = false;
            let isOpenedMdzMediaMan = false;
            // 检查设置页面和欢迎页面有没有打开
            for (let [key, value] of state.tabList) {
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
            addTabPage(state, object);
        },
        // 关闭指定标签页
        closeTabPage(state, object) {
            closeTabPage(state, object);
        },

        // 确认弹出框点击事件
        confirmDialogInteractive(state, isConfirmed) {
            if (isConfirmed) {
                // 这里的逻辑是：如果弹窗那边选择确认，就把state.tabList.get(object.pageId).get('saved')设置成true
                // 这样再请求关闭页面就能关闭了
                state.tabList.get(state.currentTryClosePageId).set('saved', true);
                closeTabPage(state, {
                    'pageId': state.currentTryClosePageId,
                    'model': state.tabList.get(state.currentTryClosePageId).get('monacoEditorModel')
                });
            }
            state.showConfirmModal = !state.showConfirmModal;
            state.showConfirm = !state.showConfirm;
        },

        // 切换到指定标签页
        // 切换标签页
        switchToCurrentTab(state, object) {
            // 先让上一个标签页处于inactive状态
            changePropsOfTab(state, state.currentOpenedPageId, 'focus', false);
            // 然后点亮当前点击的标签页
            changePropsOfTab(state, object.pageId, "focus", true);
            // 最后把页面切过去
            switchToPage(state, state.tabList.get(object.pageId));
        },
        // 更改指定标签页属性
        // 第二个参数是object，里面有index、propName和propValue属性
        changePropsOfTab(state, object) {
            changePropsOfTab(state, object.pageId, object.propName, object.propValue);
        },
    },
    actions: {
        // 初始化（即软件启动后）打开的页面，计划分为：不打开任何页面、打开欢迎页面
        async initOpenAppTab({rootState, commit}) {  // 第一次打开AME时加载的页面，可进行更改
            let lang = localStorage.getItem('lang');
            let initPageId = crypto.randomUUID();
            let i18nObject = rootState.i18n.langPackage;
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
            }));
            // 如果设置为启动时不打开任何页面，则该值为空值
            // let initPage = null;
            if (initPage) {
                rootState.tab.tabList.set(initPageId, initPage);
                rootState.tab.currentOpenedPageId = initPageId;
                rootState.tab.currentOpenedTabNumber = 1;  // 更新目前共打开了几个页面
                switchTo(initPage.get('path'), initPageId);
            } else {
                // 如果设置为启动时不打开任何页面，即展示的就是默认页面，当前打开的页面ID就设置为“DEFAULT_PAGE”
                router.replace('/');
            }
        },
    },
}
