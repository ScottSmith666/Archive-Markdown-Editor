import {actModel, addTabPage, tgModel, hdLoading, isOpened} from "./common.js";

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
                    // 判断是否已经打开过文件
                    if (isOpened(rootState, result.filePath)) {
                        actModel(rootState, {
                            'kind': 'tip',
                            'tipLevel': 'fail',
                            'content': "你已经打开过这个文件了",
                            'showTimeSecond': rootState.lifecycle.tipDisplayTime
                        });
                        return 0;
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
                                    'content': result2.message,
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
                                    tgModel(rootState, {kind: "none"});
                                    actModel(rootState, {
                                        'kind': 'tip',
                                        'tipLevel': 'fail',
                                        'content': result2.message,
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
