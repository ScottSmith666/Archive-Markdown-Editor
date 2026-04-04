import {markRaw} from 'vue';
import {createStore} from "vuex";
import router from "../router";
import localforage from "localforage";
import * as monaco from '../../../../libs/third_party/monaco-editor/esm/vs/editor/editor.api.js';

const mainManuAllHide = (state) => {
    // 关闭所有菜单栏下拉
    state.fileMenuStyleStatus = false;
    state.editMenuStyleStatus = false;
    state.viewMenuStyleStatus = false;
    state.toolMenuStyleStatus = false;
    state.helpMenuStyleStatus = false;
};

// 创建新标签页时创建对应页面的monaco editor model
const createMonacoEditorModel = (pageId) => {
    const uri = monaco.Uri.parse(`uuid:///${pageId}.md`);
    // 创建并返回 Model 实例
    return monaco.editor.createModel("", "markdown", uri);
};

const switchToPage = (state, item) => {
    if (item.get('type') === 'file') {
        state.switchedPageMonacoEditorModel = markRaw(item.get('monacoEditorModel'));
    } else if (item.get('type') === 'welcome') {
        state.switchedPageMonacoEditorModel = null;
    }
    // 更新当前窗口类型状态
    state.currentActivatedTabType = item.get('type');
    router.replace(item.get('path'));
};

const allTabDeFocus = (state) => {
    // 让所有的标签页都处于inactive状态
    for (let [key, value] of state.tabList) {
        value.set('focus', false);
    }
};

const changePropsOfTab = (state, pageId, propName, propValue) => {
    if (state.tabList.get(pageId)) {
        state.tabList.get(pageId).set(propName, propValue);
    }
};

const initOpenAppTab = () => {  // 第一次打开AME时加载的页面，可进行更改
    let initPageId = crypto.randomUUID();
    return new Map([
        [initPageId, new Map(Object.entries({
            "label": '欢迎',
            "type": 'welcome',  // 标签页类型，分为文件（file）和欢迎页面（welcome）
            "path": '/welcome',
            "focus": true,
            "isExistFile": false,  // 是否为一个真实存在的文件
            "saved": true,  // 当前页面文件保存状态
            "hovered": false,  // 鼠标是否划过标签页
            "pageid": initPageId,  // 标签页唯一ID
            "monacoEditorModel": null
        }))],
    ]);
};

// 清除本页面所有内容
const deleteThisEditorPage = (state, pageid, model) => {
    localforage.config({
        driver: localforage.INDEXEDDB,
        name: 'AME_PAGE_FILE'
    });
    localforage.removeItem(`${pageid}-lineRank`).then(function () {
    }).catch(function (err) {
        console.error(err);
    });
    if (model) {
        model.dispose();
    }
};

export default createStore({
    state() {
        return {
            editorMode: "mix",   // 编辑器模式，分为预览模式（preview）、编辑模式（edit）和混合模式（mix）
            tabList: initOpenAppTab(),
            currentActivatedTabType: 'welcome',  // 当前打开的窗口类型

            // 以下是App菜单栏相关变量
            fileMenuStyleStatus: false,
            editMenuStyleStatus: false,
            viewMenuStyleStatus: false,
            toolMenuStyleStatus: false,
            helpMenuStyleStatus: false,

            renderDistance: 10,  // Markdown渲染距离

            safeMode: false,

            switchedPageMonacoEditorModel: null,
        }
    },
    mutations: {
        setSwitchedPage(state, mEditorModel) {
            state.switchedPageMonacoEditorModel = mEditorModel;
        },
        // 更改编辑器显示模式
        changeEditorMode(state, editorMode) {
            state.editorMode = editorMode;
        },

        // 以下是标签页更改方法
        // 新增标签页
        // 第二个参数是object，里面有pageType, pageTitle和isExistFile属性
        addTabPage(state, object) {
            mainManuAllHide(state);
            allTabDeFocus(state);
            let filePageID = crypto.randomUUID();
            let urlContent = 'welcome';
            let model = null;
            if (object.pageType === 'file') {
                urlContent = 'workspace';
                model = createMonacoEditorModel(filePageID);
            } else if (object.pageType === 'welcome') {
                urlContent = 'welcome';
            }
            let newPageObject = new Map(Object.entries({
                "label": object.pageTitle,
                "type": object.pageType,
                "path": `/${urlContent}?pageid=${filePageID}`,
                "focus": true,
                "isExistFile": object.isExistFile,
                "saved": true,
                "hovered": false,
                "pageid": filePageID,
                "monacoEditorModel": model ? markRaw(model) : null,
            }));
            state.tabList.set(filePageID, newPageObject);
            // 最后把页面切过去
            switchToPage(state, newPageObject);
        },
        // 关闭指定标签页
        closeTabPage(state, object) {
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
                            keys = Array.from(state.tabList.keys());
                            changePropsOfTab(state, keys[keys.length - 1], "focus", true);
                            switchToPage(state, state.tabList.get(keys[keys.length - 1]));
                        } else {
                            state.tabList.delete(object.pageId);
                        }
                    } else {
                        deleteThisEditorPage(state, object.pageId, object.model);
                        if (state.tabList.get(object.pageId).get('focus')) {
                            let idx = keys.indexOf(object.pageId);
                            state.tabList.delete(object.pageId);  // 后删除Map
                            keys = Array.from(state.tabList.keys());
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
                        "type": 'welcome',
                        "path": '/',
                        "monacoEditorModel": null
                    })));
                }
            } else {
                // 弹窗提示未保存
                // if 取消关闭
                // if 仍要关闭
                alert("未保存，禁止直接关闭！");
            }
        },
        // 切换到指定标签页
        // 切换标签页
        // 第二个参数是object，里面有tabIndex和replace属性
        switchToCurrentTab(state, object) {
            // 先让所有的标签页都处于inactive状态
            allTabDeFocus(state);
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

        // 以下是更改App菜单栏相关方法
        // 关闭所有菜单栏下拉
        mainManuAllHide(state) {
            mainManuAllHide(state);
        },
        mainManuClick(state, id) {
            // 先初始化菜单栏下拉
            mainManuAllHide(state);
            // 然后对点击的菜单栏应用显示（true：显示）
            switch (id) {
                case "file":
                    state.fileMenuStyleStatus = true;
                    break;
                case "edit":
                    state.editMenuStyleStatus = true;
                    break;
                case "view":
                    state.viewMenuStyleStatus = true;
                    break;
                case "tool":
                    state.toolMenuStyleStatus = true;
                    break;
                case "help":
                    state.helpMenuStyleStatus = true;
                    break;
            }
        },
        quitApp(state) {

        },

        // 更改IndexedDB内容（本页面的内容）
        keepThisEditorPageContentStatus(state, object) {
            // object:
            // {
            //     "pageid": "PAGEID",
            //     "content": "CONTENT"
            // }
            localforage.config({
                driver: localforage.INDEXEDDB,
                name: 'AME_PAGE_FILE'
            });
            localforage.setItem(
                `${object.pageid}-content`, object.content
            ).then(function (value) {
            }).catch(function (err) {
                console.error(err);
            });
        },

        // 更改IndexedDB内容（本页面文本编辑器停在第几行）
        keepThisEditorPageLineNumStatus(state, object) {
            // object:
            // {
            //     "pageid": "PAGEID",
            //     "cursorPosition": [row, col]
            // }
            localforage.config({
                driver: localforage.INDEXEDDB,
                name: 'AME_PAGE_FILE'
            });
            localforage.setItem(
                `${object.pageid}-lineRank`, object.cursorPosition
            ).then(function (value) {
            }).catch(function (err) {
                console.error(err);
            });
        },

        // 清除本页面所有内容
        deleteThisEditorPage(state, pageid, model) {
            deleteThisEditorPage(state, pageid, model);
        },
    },
    actions: {
        // 获得pageID对应页面的内容
        getThisEditorPageStatus({commit}, pageid) {
            localforage.config({
                driver: localforage.INDEXEDDB,
                name: 'AME_PAGE_FILE'
            });
            return localforage.getItem(pageid);
        },
    }
});
