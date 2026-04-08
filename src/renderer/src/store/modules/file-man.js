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
                if (result.success) {  // 用户选中了一个文件
                    actModel(rootState, {kind: "loading", content: "正在打开文件..."});  // 显示加载
                    // 获得文件路径后，异步打开文件获得内容
                    let planOpenFilePath = result.filePath;
                    let planOpenFileName = result.fileName;
                    let ext = planOpenFileName.split(".").pop();
                    window.fileManPreload.loadFileContent(planOpenFilePath).then((result) => {
                        if (result.success) {  // 符合条件的md、txt文件以及不带密码的mdz文件可直接打开
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
                            if (ext === 'md' || ext === 'txt') {  // 符合条件的md、txt文件以及不带密码的mdz文件出错那是真出错了，直接抛出异常提示
                                hdLoading(rootState);  // 最后等页面load完成后，再关闭加载提示
                                tgModel(rootState, {kind: "none"});
                                actModel(rootState, {
                                    'kind': 'tip',
                                    'tipLevel': 'fail',
                                    'content': result.message,
                                    'showTimeSecond': rootState.lifecycle.tipDisplayTime
                                });
                            } else if (ext === 'mdz') {
                                // 很可能是因为mdz设置了密码
                                // 进一步if确认如果真的mdz设置了密码
                                // 那就弹出需要解锁密码的弹框输入密码

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
