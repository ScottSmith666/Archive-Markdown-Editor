import {actModel, tgModel, afterChosenFile} from "./common.js";

export const fileMan = {
    state: () => {
        return {};
    },
    mutations: {
        // 激活“打开文件”操作系统组件
        activateOpenFileDialogMethod(state, rootState) {
            tgModel(rootState, {kind: "none"});
            let title = "打开文件";
            let content = "用户已取消打开文件";
            window.fileManPreload.activateOpenFileDialog(title, content).then((result) => {
                // 如果result.success是true则在新标签页打开文件
                // 如果是false，则不触发任何事件
                if (result.success) {  // 用户选中了一个文件
                    afterChosenFile(rootState, result);
                } else {
                    // 显示“用户已取消”tip
                    actModel(rootState, {
                        'kind': 'tip',
                        'tipLevel': 'info',
                        'content': '用户已取消打开文件',
                        'showTimeSecond': rootState.lifecycle.tipDisplayTime
                    });
                }
            });
        },
        openFileFromHistoryMethod(state, object) {
            let rootState = object.rootState;
            let result = object.result;
            afterChosenFile(rootState, result, true);
        }
    },
    actions: {
        // 激活“打开文件”操作系统组件 + modal
        activateOpenFileDialogAction({commit, rootState}) {
            commit('activateOpenFileDialogMethod', rootState);
        },
        // 直接在历史记录中打开
        openFileFromHistoryAction({commit, rootState}, result) {
            let object = {
                'rootState': rootState,
                'result': result  // result: {'filePath': '...', 'fileName': '...'}
            };
            commit('openFileFromHistoryMethod', object);
        }
    },
}
