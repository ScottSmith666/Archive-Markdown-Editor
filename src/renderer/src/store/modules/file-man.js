import {actModel, addTabPage, tgModel, hdLoading} from "./common.js";

export const fileMan = {
    state: () => {
        return {};
    },
    mutations: {
        // 激活“打开文件”操作系统组件
        activateOpenFileDialogMethod(state, rootState) {
            tgModel(rootState, {kind: "none"});
            window.fileManPreload.activateOpenFileDialog().then((result) => {
                // 如果result.success是true则在新标签页打开文件
                // 如果是false，则不触发任何事件
                if (result.success) {
                    actModel(rootState, {kind: "loading", content: "正在打开文件..."});  // 显示加载
                    // 获得文件路径后，异步打开文件获得内容
                    let planOpenFilePath = result.filePath[0];
                    window.fileManPreload.loadFileContent(planOpenFilePath).then((result) => {
                        if (result.success) {
                            // 然后将其装载入Monaco Editor Model
                            // 最后将这个Model装入Tab Map，打开这个Tab对应的页面
                            addTabPage(rootState.tab, {
                                'pageType': 'file',
                                'pageTitle': result.name,
                                'isExistFile': true,
                                'filePath': result.path,
                                'content': result.content,
                            });
                            hdLoading(rootState);  // 最后等页面load完成后，再关闭加载提示
                        } else {
                            hdLoading(rootState);  // 最后等页面load完成后，再关闭加载提示
                            tgModel(rootState, {kind: "none"});
                            actModel(rootState, {
                                'kind': 'tip',
                                'tipLevel': 'fail',
                                'content': result.message,
                                'showTimeSecond': rootState.lifecycle.tipDisplayTime
                            });
                        }
                    }).catch((e) => {
                        actModel(rootState, {
                            'kind': 'tip',
                            'tipLevel': 'fail',
                            'content': `${e.name}: ${e.message}`,
                            'showTimeSecond': rootState.lifecycle.tipDisplayTime
                        });
                    });
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
    },
    actions: {
        // 激活“打开文件”操作系统组件 + modal
        activateOpenFileDialogAction({commit, rootState}) {
            commit('activateOpenFileDialogMethod', rootState);
        }
    },
}
