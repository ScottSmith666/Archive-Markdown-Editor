import {
    actModel,
    tgModel,
    afterChosenFile,
    getMdzMediaPathToDirectPathEdits,
    getDirectPathToMdzMediaPathEdits,
    hdLoading,
    replaceIdToOriginCode,
    verifySaveForm,
    hdSaveForm,
    getNow, isOpened, addTabPage
} from "./common.js";

import {defineStore} from "pinia";
import {useAmeLifecycleManStore} from "./ame-lifecycle-man";
import {useI18nStore} from "./i18n";
import {useSettingsManStore} from "./settings-man";
import {useTabManStore} from "./tab-man";

export const useFileManStore = defineStore("file-man-store", {
    state: () => {
        return {
            isListenFileChange: true,
            saveAsError: '',
        };
    },
    actions: {
        // 激活“打开文件”操作系统组件
        activateOpenFileDialogMethod(state, rootState) {
            const ameLifecycleManStore = useAmeLifecycleManStore();
            const i18nStore = useI18nStore();
            const settingsManStore = useSettingsManStore();

            ameLifecycleManStore.toggleModal({wantToOpen: true, kind: "none"});
            let title = i18nStore.langPackage[settingsManStore.lang].dialog.systemDialogOpenFile;
            let content = i18nStore.langPackage[settingsManStore.lang].dialog.activeTip.userCancelOpen;
            window.fileManPreload.activateOpenFileDialog(title, content).then((result) => {
                // 如果result.success是true则在新标签页打开文件
                // 如果是false，则不触发任何事件
                if (result.success) {  // 用户选中了一个文件
                    this.afterChosenFile(result);
                } else {
                    // 显示“用户已取消”tip
                    ameLifecycleManStore.autoTips({
                        'wantToOpen': true,
                        'kind': 'tip',
                        'tipLevel': 'info',
                        'content': result.message,
                        'showTimeSecond': ameLifecycleManStore.tipDisplayTime
                    });
                }
            });
        },

        afterChosenFile(rootState, result, isHistoryMethod = false) {
            const ameLifecycleManStore = useAmeLifecycleManStore();
            const i18nStore = useI18nStore();
            const settingsManStore = useSettingsManStore();
            const tabManStore = useTabManStore();

            if (isHistoryMethod) {
                ameLifecycleManStore.toggleModal({wantToOpen: true, kind: "none"});
            }
            // 判断是否已经打开过文件
            if (tabManStore.isOpened(result.filePath)) {
                ameLifecycleManStore.autoTips({
                    'wantToOpen': true,
                    'kind': 'tip',
                    'tipLevel': 'fail',
                    'content': i18nStore.langPackage[settingsManStore.lang].dialog.activeTip.repeatOpenForbidden,
                    'showTimeSecond': ameLifecycleManStore.tipDisplayTime
                });
                return 0;
            }
            // 检查文件内是否有非法字符
            const fileForbiddenChars = [">", "<", ":", "'", "|", "*", "?"];
            let fileName = result.filePath.split(/\\|\//).pop();
            for (let i = 0; i < fileForbiddenChars.length; i++) {
                if (fileName.includes(fileForbiddenChars[i])) {
                    ameLifecycleManStore.autoTips({
                        'wantToOpen': true,
                        'kind': 'tip',
                        'tipLevel': 'fail',
                        'content': rootState.i18n.langPackage[rootState.settings.lang].dialog.activeTip.forbiddenCharsInFileName,
                        'showTimeSecond': rootState.lifecycle.tipDisplayTime
                    });
                    return 0;
                }
            }

            ameLifecycleManStore.autoTips({
                'wantToOpen': true,
                'kind': "loading",
                'content': rootState.i18n.langPackage[rootState.settings.lang].dialog.loading.open
            });  // 显示加载
            // 获得文件路径后，异步打开文件获得内容
            let planOpenFilePath = result.filePath;
            let planOpenFileName = result.fileName;
            let ext = planOpenFileName.split(".").pop();
            let content = i18nStore.langPackage[settingsManStore.lang].dialog.activeTip.unsupportedFileType;
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
                                ? rootState.i18n.langPackage[rootState.settings.lang].dialog.activeTip.fileNotFound
                                : result2.message,
                            'showTimeSecond': rootState.lifecycle.tipDisplayTime
                        });
                    } else if (ext === 'mdz') {
                        // 很可能是因为mdz设置了密码
                        // 进一步if确认如果真的mdz设置了密码
                        if (result2.message === "PASSWORD_REQUIRED") {
                            // 说明mdz设置了密码
                            // 那就弹出需要解锁密码的弹框输入密码
                            let promTitle = rootState.i18n.langPackage[rootState.settings.lang].dialog.openEncMdzPasswordRequired.title;
                            let promContent = rootState.i18n.langPackage[rootState.settings.lang].dialog.openEncMdzPasswordRequired.description;
                            let isPasswordWrong = false;  // 指示是否输入密码出错，如为true则说明密码输错
                            while (true) {
                                try {
                                    let returnFromInputMdzPasswordDialog = await showPasswordPrompt(promTitle, promContent, isPasswordWrong);
                                    // console.log("returnFromInputMdzPasswordDialog", returnFromInputMdzPasswordDialog);
                                    if (returnFromInputMdzPasswordDialog) {
                                        let userMdzPassword = returnFromInputMdzPasswordDialog;
                                        // 开始尝试用输入的密码打开加密mdz
                                        let result4 = await window.fileManPreload.loadEncryptedMdzFileContent(planOpenFilePath, userMdzPassword);
                                        // console.log("result4", result4);
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
                                                isPasswordWrong = true;
                                                promTitle = rootState.i18n.langPackage[rootState.settings.lang].dialog.openEncMdzPasswordRequired.wrongPasswordTitle;
                                            }
                                            // 如果不点取消则会一直重试
                                        }
                                    } else {
                                        // 用户点击了取消
                                        isPasswordWrong = false;
                                        hdLoading(rootState);
                                        tgModel(rootState, {kind: "none"});
                                        actModel(rootState, {
                                            'kind': 'tip',
                                            'tipLevel': 'info',
                                            'content': rootState.i18n.langPackage[rootState.settings.lang].dialog.activeTip.cancelPasswordInput,
                                            'showTimeSecond': rootState.lifecycle.tipDisplayTime
                                        });
                                        break;
                                    }
                                } catch (e) {
                                    console.log(e);
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
                                'content': result2.message === "FILE_NOT_FOUND" ? rootState.i18n.langPackage[rootState.settings.lang].dialog.activeTip.fileNotFound : result2.message,
                                'showTimeSecond': rootState.lifecycle.tipDisplayTime
                            });
                        }
                    } else {
                        hdLoading(rootState);
                        tgModel(rootState, {kind: "none"});
                        actModel(rootState, {
                            'kind': 'tip',
                            'tipLevel': 'fail',
                            'content': result2.message,
                            'showTimeSecond': rootState.lifecycle.tipDisplayTime
                        });
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
        },

        openFileFromHistoryMethod(state, object) {
            let rootState = object.rootState;
            let result = object.result;
            afterChosenFile(rootState, result, true);
        },
        changeFileStoreData(state, value) {
            state.isListenFileChange = value;
        },

        hdLoading(state, rootState) {
            hdLoading(rootState);
        },
        hdSaveForm(state, rootState) {
            hdSaveForm(rootState);
        },
        tgModel(state, object) {
            tgModel(object.rootState, object.object);
        },
        actModel(state, object) {
            actModel(object.rootState, object.object);
        },

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
        },
        // 保存文件
        async directSaveAction({commit, rootState}, data = []) {
            // 如果是用户提供的文件信息，则包含：data = [单纯文件名, 扩展名, 保存路径, 密码, 再次输入密码]
            // 如果用户不提供文件信息，则data为空列表
            let planSaveFileInfo = data;

            // 先拿到对应页面的相关信息
            let currentPageInfo = rootState.tab.tabList.get(rootState.tab.currentOpenedPageId);
            let currentPageMonacoEditorModel = currentPageInfo.get("monacoEditorModel");
            let currentPageIsExistFile = currentPageInfo.get("isExistFile");
            let currentPageIsEncryptedFile = currentPageInfo.get("encrypted");
            let currentPageIsEncryptedFilePassword = currentPageInfo.get("password");
            let currentPageExistFileRouter = currentPageInfo.get("path");

            if (currentPageIsExistFile && planSaveFileInfo.length === 0) {

                commit('tgModel', {
                    rootState: rootState,
                    object: {kind: "none"}
                });

                commit("actModel", {
                    rootState: rootState,
                    object: {
                        'kind': 'loading',
                        'content': rootState.i18n.langPackage[rootState.settings.lang].dialog.loading.save,
                    }
                });
                // currentPageIsExistFile为true，且用户不提供计划保存文件信息参数
                // 说明是已存在的文件，且用户进行“保存”操作
                // 直接在tabList的对应页面的item里拿取文件信息，覆盖保存即可

                // 处理路由为路径
                let currentOpenedFilePathArray = currentPageExistFileRouter.split("&").pop().replace('filepath=', '').split(/\\|\//);
                let currentPureFileNameArray = currentOpenedFilePathArray.pop().split(".");
                currentPureFileNameArray.pop();
                let currentPureFileName = currentPureFileNameArray.join(".");
                let currentPurePath = currentOpenedFilePathArray.join("/");

                let currentOpenedFileExt = currentPageExistFileRouter.split("&").pop().replace('filepath=', '').split('.').pop();

                if (currentOpenedFileExt === "mdz") {
                    // DONE
                    // 这里的逻辑是
                    // 当已存在的文件执行“保存”操作的时候
                    // 如果发现这个文件是mdz文件，则多媒体语句中：
                    // 采用绝对路径的本地多媒体文件将被嵌入mdz文件
                    // 而base64编码的图片和在线URL将保持不变

                    // 先创建好要保存的mdz文件夹结构（win32平台需要运行命令以使文件夹不可见）
                    try {
                        let result = await window.fileManPreload.makeMdzDirectory(currentPurePath, currentPureFileName);
                        if (result.success) {
                            commit('changeFileStoreData', false);
                            let editsCopies
                                = await getDirectPathToMdzMediaPathEdits(currentPageMonacoEditorModel, currentPureFileName, currentPurePath);
                            // mdz文件夹结构创建成功后，开始拷贝多媒体文件至mdz文件夹结构
                            let copyResult;
                            if (editsCopies[1].length === 0) {  // 没有可以拷贝的文件，可以直接走了
                                copyResult = {"success": true};
                            } else {
                                copyResult = await window.fileManPreload.copyMdzMediaFiles(editsCopies[1]);
                            }
                            if (copyResult.success) {
                                // 拷贝多媒体文件至mdz文件夹结构完成后，执行monaco editor edit序列操作
                                if (editsCopies[0].length > 0) {
                                    currentPageMonacoEditorModel.pushStackElement();
                                    currentPageMonacoEditorModel.applyEdits(editsCopies[0], false);
                                    currentPageMonacoEditorModel.pushStackElement();
                                }
                                if (editsCopies[2].length > 0) {
                                    await replaceIdToOriginCode(currentPageMonacoEditorModel, editsCopies[2]);
                                }
                                // edit序列执行完成后，将Model的内容保存至mdz文件夹结构
                                let writeResult = await window.fileManPreload.saveFileContent(
                                    currentPurePath,
                                    currentPureFileName,
                                    currentPageMonacoEditorModel.getValue(),
                                    currentOpenedFileExt
                                );
                                if (writeResult.success) {
                                    // 最后将文件夹压缩封装为mdz文件
                                    let makeMdzResult = await window.fileManPreload.compressToMdz(
                                        currentPurePath,
                                        currentPureFileName,
                                        currentPageIsEncryptedFilePassword
                                    );
                                    if (makeMdzResult.success) {
                                        // 封装完成后，修改store内tab数据，完成页面更新，并往sqlite历史记录表里写入一条记录
                                        currentPageInfo.set("saved", true);
                                        let sqlResult = await window.sqliteDataManPreload.setRecentOpenedHistory(
                                            `${currentPureFileName}.mdz`,
                                            `${currentPurePath}/${currentPureFileName}.mdz`,
                                            getNow()
                                        );
                                        if (sqlResult.success) {
                                            // 停止加载
                                            commit('hdLoading', rootState);
                                            commit('changeFileStoreData', true);
                                        } else {
                                            // 发送错误信息
                                            console.error(sqlResult.message);
                                            // 停止加载
                                            commit('hdLoading', rootState);
                                            commit('changeFileStoreData', true);
                                            return 0;
                                        }
                                    }
                                }
                            } else {
                                // 发送错误信息
                                console.error(copyResult.message);
                                // 停止加载
                                commit('hdLoading', rootState);
                                commit('tgModel', {
                                    rootState: rootState,
                                    object: {kind: "none"}
                                });
                                commit("actModel", {
                                    rootState: rootState,
                                    object: {
                                        'kind': 'tip',
                                        'tipLevel': 'fail',
                                        'content': rootState.i18n.langPackage[rootState.settings.lang].dialog.activeTip.saveFailed,
                                        'showTimeSecond': rootState.lifecycle.tipDisplayTime
                                    }
                                });
                                commit('changeFileStoreData', true);
                                return 0;
                            }
                        } else {
                            // 发送错误信息
                            console.error(result.message);
                            // 停止加载
                            commit('hdLoading', rootState);
                            commit('changeFileStoreData', true);
                            return 0;
                        }
                    } catch (e) {
                        // 发送错误信息
                        console.error(e);
                        // 停止加载
                        commit('hdLoading', rootState);
                        return 0;
                    }
                } else {
                    // DONE
                    // 如果发现这个文件不是mdz文件，则多媒体语句保持不变
                    // 将Model的内容保存至指定的保存路径
                    try {
                        let writeResult = await window.fileManPreload.saveFileContent(
                            currentPurePath,
                            currentPureFileName,
                            currentPageMonacoEditorModel.getValue(),
                            currentOpenedFileExt
                        );

                        if (writeResult.success) {
                            // 保存完成后，修改store内tab数据，完成页面更新，并往sqlite历史记录表里写入一条记录
                            currentPageInfo.set("saved", true);
                            try {
                                let sqlResult = await window.sqliteDataManPreload.setRecentOpenedHistory(
                                    `${currentPureFileName}.${currentOpenedFileExt}`,
                                    `${currentPurePath}/${currentPureFileName}.${currentOpenedFileExt}`,
                                    getNow()
                                );
                                if (sqlResult.success) {
                                    // 停止加载
                                    commit('hdLoading', rootState);
                                } else {
                                    // 停止加载
                                    commit('hdLoading', rootState);
                                    // 发送错误信息
                                    console.error(sqlResult.message);
                                    return 0;
                                }
                            } catch (e) {
                                // 停止加载
                                commit('hdLoading', rootState);
                                console.error(e);
                            }
                        } else {
                            // 停止加载
                            commit('hdLoading', rootState);
                            console.error(writeResult.message);
                        }
                    } catch (e) {
                        // 停止加载
                        commit('hdLoading', rootState);
                        console.error(e);
                    }
                }
            } else {
                commit("actModel", {
                    rootState: rootState,
                    object: {
                        'kind': 'loading',
                        'content': rootState.i18n.langPackage[rootState.settings.lang].dialog.loading.save,
                    }
                });

                // 表单验证
                let verifyResult = verifySaveForm(planSaveFileInfo, rootState);
                if (!verifyResult.success) {
                    // 停止加载
                    commit('hdLoading', rootState);
                    commit('tgModel', {
                        rootState: rootState,
                        object: {kind: "none"}
                    });
                    rootState.file.saveAsError = verifyResult.message;
                    return 0;
                }

                // 隐藏保存表单
                commit('hdSaveForm', rootState);
                commit('tgModel', {
                    rootState: rootState,
                    object: {kind: "none"}
                });

                if (currentPageIsExistFile && planSaveFileInfo.length !== 0) {
                    // 说明用户对一个已存在文件进行“另存为”操作
                    // 处理路由为路径
                    let currentOpenedFilePathArray = currentPageExistFileRouter.split("&").pop().replace('filepath=', '').split(/\\|\//);
                    let currentPureFileNameArray = currentOpenedFilePathArray.pop().split(".");
                    currentPureFileNameArray.pop();
                    let currentPureFileName = currentPureFileNameArray.join(".");
                    let currentPurePath = currentOpenedFilePathArray.join("/");
                    let currentOpenedFileExt = currentPageExistFileRouter.split("&").pop().replace('filepath=', '').split('.').pop();

                    // 需要接收用户提供的计划保存文件信息参数
                    if (
                        (currentOpenedFileExt === "md" || currentOpenedFileExt === "txt")
                        && (planSaveFileInfo[1] === "md" || planSaveFileInfo[1] === "txt")
                    ) {
                        // DONE
                        // 当(md或txt)另存为(md或txt)
                        // 则多媒体语句保持不变
                        // 需要用户提供的文件信息了
                        try {
                            let writeResult = await window.fileManPreload.saveFileContent(
                                planSaveFileInfo[2],
                                planSaveFileInfo[0],
                                currentPageMonacoEditorModel.getValue(),
                                planSaveFileInfo[1]
                            );
                            if (writeResult.success) {
                                // 保存完成后，修改store内tab数据，完成页面更新，并往sqlite历史记录表里写入一条记录
                                const win32PathPattern = /(^([A-Za-z]:)(\/\S+)+)|(^([A-Za-z]:)(\\\S+)+)/;
                                let sep = win32PathPattern.test(planSaveFileInfo[2]) ? "\\" : "/";
                                currentPageInfo.set("saved", true);
                                currentPageInfo.set("label",
                                    `${planSaveFileInfo[0]}.${planSaveFileInfo[1]}`);
                                currentPageInfo.set("path", `/workspace?` +
                                    `pageid=${rootState.tab.currentOpenedPageId}&` +
                                    `filepath=${planSaveFileInfo[2]}${sep}${planSaveFileInfo[0]}.${planSaveFileInfo[1]}`);
                                currentPageInfo.set("isExistFile", true);
                                currentPageInfo.set("pageid", rootState.tab.currentOpenedPageId);

                                try {
                                    let sqlResult = await window.sqliteDataManPreload.setRecentOpenedHistory(
                                        `${planSaveFileInfo[0]}.${planSaveFileInfo[1]}`,
                                        `${planSaveFileInfo[2]}/${planSaveFileInfo[0]}.${planSaveFileInfo[1]}`,
                                        getNow()
                                    );
                                    if (sqlResult.success) {
                                        // 停止加载
                                        commit('hdLoading', rootState);
                                    } else {
                                        // 停止加载
                                        commit('hdLoading', rootState);
                                        // 发送错误信息
                                        console.error(sqlResult.message);
                                        return 0;
                                    }
                                } catch (e) {
                                    // 停止加载
                                    commit('hdLoading', rootState);
                                    console.error(e);
                                }
                            } else {
                                // 停止加载
                                commit('hdLoading', rootState);
                                console.error(writeResult.message);
                            }
                        } catch (e) {
                            // 停止加载
                            commit('hdLoading', rootState);
                            console.error(err);
                        }
                    } else if (
                        (currentOpenedFileExt === "md" || currentOpenedFileExt === "txt" || currentOpenedFileExt === "mdz") && planSaveFileInfo[1] === "mdz"
                    ) {
                        // DONE
                        // 当(md或txt或mdz)另存为mdz
                        // 则多媒体语句中：
                        // 采用绝对路径的本地多媒体文件将被嵌入mdz文件
                        // 而base64编码的图片和在线URL将保持不变
                        // 先创建好要保存的mdz文件夹结构
                        try {
                            let result = await window.fileManPreload.makeMdzDirectory(planSaveFileInfo[2], planSaveFileInfo[0]);
                            if (result.success) {
                                commit('changeFileStoreData', false);
                                let editsCopies;
                                if (currentOpenedFileExt === "mdz") {
                                    editsCopies = await getDirectPathToMdzMediaPathEdits(
                                        currentPageMonacoEditorModel,
                                        planSaveFileInfo[0],
                                        planSaveFileInfo[2],
                                        true,
                                        currentPureFileName,
                                        currentPurePath
                                    );
                                } else {
                                    editsCopies = await getDirectPathToMdzMediaPathEdits(
                                        currentPageMonacoEditorModel,
                                        planSaveFileInfo[0],
                                        planSaveFileInfo[2]
                                    );
                                }
                                // mdz文件夹结构创建成功后，开始拷贝多媒体文件至mdz文件夹结构
                                let copyResult;
                                if (editsCopies[1].length === 0) {  // 没有可以拷贝的文件，可以直接走了
                                    copyResult = {"success": true};
                                } else {
                                    copyResult = await window.fileManPreload.copyMdzMediaFiles(editsCopies[1]);
                                }
                                if (copyResult.success) {
                                    // 拷贝多媒体文件至mdz文件夹结构完成后，执行monaco editor edit序列操作
                                    if (editsCopies[0].length > 0) {
                                        currentPageMonacoEditorModel.pushStackElement();
                                        currentPageMonacoEditorModel.applyEdits(editsCopies[0], false);
                                        currentPageMonacoEditorModel.pushStackElement();
                                    }
                                    if (editsCopies[2].length > 0) {
                                        await replaceIdToOriginCode(currentPageMonacoEditorModel, editsCopies[2]);
                                    }
                                    // edit序列执行完成后，将Model的内容保存至mdz文件夹结构
                                    let writeResult = await window.fileManPreload.saveFileContent(
                                        planSaveFileInfo[2],
                                        planSaveFileInfo[0],
                                        currentPageMonacoEditorModel.getValue(),
                                        planSaveFileInfo[1]
                                    );
                                    if (writeResult.success) {
                                        // 最后将文件夹压缩封装为mdz文件
                                        let makeMdzResult = await window.fileManPreload.compressToMdz(
                                            planSaveFileInfo[2],
                                            planSaveFileInfo[0],
                                            planSaveFileInfo[3]
                                        );
                                        if (makeMdzResult.success) {
                                            // 封装完成后，修改store内tab数据，完成页面更新，并往sqlite历史记录表里写入一条记录
                                            const win32PathPattern = /(^([A-Za-z]:)(\/\S+)+)|(^([A-Za-z]:)(\\\S+)+)/;
                                            let sep = win32PathPattern.test(planSaveFileInfo[2]) ? "\\" : "/";
                                            currentPageInfo.set("saved", true);
                                            currentPageInfo.set("label",
                                                `${planSaveFileInfo[0]}.${planSaveFileInfo[1]}`);
                                            currentPageInfo.set("path", `/workspace?` +
                                                `pageid=${rootState.tab.currentOpenedPageId}&` +
                                                `filepath=${planSaveFileInfo[2]}${sep}${planSaveFileInfo[0]}.${planSaveFileInfo[1]}`);
                                            currentPageInfo.set("isExistFile", true);
                                            currentPageInfo.set("pageid", rootState.tab.currentOpenedPageId);
                                            currentPageInfo.set("encrypted", planSaveFileInfo[3] !== "");
                                            currentPageInfo.set("password", planSaveFileInfo[3]);

                                            let sqlResult = await window.sqliteDataManPreload.setRecentOpenedHistory(
                                                `${planSaveFileInfo[0]}.mdz`,
                                                `${planSaveFileInfo[2]}/${planSaveFileInfo[0]}.mdz`,
                                                getNow()
                                            );
                                            if (sqlResult.success) {
                                                // 停止加载
                                                commit('hdLoading', rootState);
                                                commit('changeFileStoreData', true);
                                            } else {
                                                // 发送错误信息
                                                console.error(sqlResult.message);
                                                // 停止加载
                                                commit('hdLoading', rootState);
                                                commit('changeFileStoreData', true);
                                                return 0;
                                            }
                                        }
                                    }
                                } else {
                                    // 发送错误信息
                                    console.error(copyResult.message);
                                    // 停止加载
                                    commit('hdLoading', rootState);
                                    commit('tgModel', {
                                        rootState: rootState,
                                        object: {kind: "none"}
                                    });
                                    commit("actModel", {
                                        rootState: rootState,
                                        object: {
                                            'kind': 'tip',
                                            'tipLevel': 'fail',
                                            'content': rootState.i18n.langPackage[rootState.settings.lang].dialog.activeTip.saveFailed,
                                            'showTimeSecond': rootState.lifecycle.tipDisplayTime
                                        }
                                    });
                                    commit('changeFileStoreData', true);
                                    return 0;
                                }
                            } else {
                                // 发送错误信息
                                console.error(result.message);
                                // 停止加载
                                commit('hdLoading', rootState);
                                commit('tgModel', {
                                    rootState: rootState,
                                    object: {kind: "none"}
                                });
                                commit("actModel", {
                                    rootState: rootState,
                                    object: {
                                        'kind': 'tip',
                                        'tipLevel': 'fail',
                                        'content': result.message,
                                        'showTimeSecond': rootState.lifecycle.tipDisplayTime
                                    }
                                });
                                commit('changeFileStoreData', true);
                                return 0;
                            }
                        } catch (e) {
                            // 发送错误信息
                            console.error(e);
                            // 停止加载
                            commit('hdLoading', rootState);
                            commit('tgModel', {
                                rootState: rootState,
                                object: {kind: "none"}
                            });
                            commit("actModel", {
                                rootState: rootState,
                                object: {
                                    'kind': 'tip',
                                    'tipLevel': 'fail',
                                    'content': e,
                                    'showTimeSecond': rootState.lifecycle.tipDisplayTime
                                }
                            });
                            return 0;
                        }
                    } else if (currentOpenedFileExt === "mdz" && (planSaveFileInfo[1] === "md" || planSaveFileInfo[1] === "txt")) {
                        // 当mdz另存为(md或txt)
                        // 则多媒体语句中：
                        // 采用mdz媒体路径语法的本地多媒体文件将被解压出mdz文件
                        // 在mdz文件同一路径中创建“文件名.media_dir”文件夹，并把多媒体放置其中
                        // 然后将mdz媒体路径语法改成指向这个文件夹的媒体文件路径
                        // 而base64编码的图片和在线URL将保持不变
                        let currentOpenedFilePathArray = currentPageExistFileRouter.split("&").pop().replace('filepath=', '').split(/\\|\//);
                        let currentPureFileNameArray = currentOpenedFilePathArray.pop().split(".");
                        currentPureFileNameArray.pop();
                        let currentPureFileName = currentPureFileNameArray.join(".");
                        let currentPurePath = currentOpenedFilePathArray.join("/");
                        try {
                            let result = await window.fileManPreload.makeMdMediaDirectory(planSaveFileInfo[2], planSaveFileInfo[0]);
                            if (result.success) {
                                commit('changeFileStoreData', false);
                                let editsCopies = await getMdzMediaPathToDirectPathEdits(
                                    currentPageMonacoEditorModel,
                                    currentPurePath,
                                    currentPureFileName,
                                    planSaveFileInfo[2],
                                    planSaveFileInfo[0]
                                );
                                // mdz文件夹结构创建成功后，开始拷贝多媒体文件至mdz文件夹结构
                                let copyResult;
                                if (editsCopies[1].length === 0) {  // 没有可以拷贝的文件，可以直接走了
                                    copyResult = {"success": true};
                                } else {
                                    copyResult = await window.fileManPreload.copyMdzMediaFiles(editsCopies[1]);
                                }
                                if (copyResult.success) {
                                    // 拷贝多媒体文件至mdz文件夹完成后，执行monaco editor edit序列操作
                                    if (editsCopies[0].length > 0) {
                                        currentPageMonacoEditorModel.pushStackElement();
                                        currentPageMonacoEditorModel.applyEdits(editsCopies[0], false);
                                        currentPageMonacoEditorModel.pushStackElement();
                                    }
                                    if (editsCopies[2].length > 0) {
                                        await replaceIdToOriginCode(currentPageMonacoEditorModel, editsCopies[2]);
                                    }
                                    // edit序列执行完成后，将Model的内容保存至保存目录
                                    await window.fileManPreload.saveFileContent(
                                        planSaveFileInfo[2],
                                        planSaveFileInfo[0],
                                        currentPageMonacoEditorModel.getValue(),
                                        planSaveFileInfo[1]
                                    );
                                    // 保存完成后，修改store内tab数据，完成页面更新，并往sqlite历史记录表里写入一条记录
                                    const win32PathPattern = /(^([A-Za-z]:)(\/\S+)+)|(^([A-Za-z]:)(\\\S+)+)/;
                                    let sep = win32PathPattern.test(planSaveFileInfo[2]) ? "\\" : "/";
                                    currentPageInfo.set("saved", true);
                                    currentPageInfo.set("label",
                                        `${planSaveFileInfo[0]}.${planSaveFileInfo[1]}`);
                                    currentPageInfo.set("path", `/workspace?` +
                                        `pageid=${rootState.tab.currentOpenedPageId}&` +
                                        `filepath=${planSaveFileInfo[2]}${sep}${planSaveFileInfo[0]}.${planSaveFileInfo[1]}`);
                                    currentPageInfo.set("isExistFile", true);
                                    currentPageInfo.set("pageid", rootState.tab.currentOpenedPageId);
                                    currentPageInfo.set("encrypted", false);
                                    currentPageInfo.set("password", "");

                                    let sqlResult = await window.sqliteDataManPreload.setRecentOpenedHistory(
                                        `${planSaveFileInfo[0]}.${planSaveFileInfo[1]}`,
                                        `${planSaveFileInfo[2]}/${planSaveFileInfo[0]}.${planSaveFileInfo[1]}`,
                                        getNow()
                                    );
                                    if (sqlResult.success) {
                                        // 停止加载
                                        commit('hdLoading', rootState);
                                        commit('changeFileStoreData', true);
                                    } else {
                                        // 发送错误信息
                                        console.error(sqlResult.message);
                                        // 停止加载
                                        commit('hdLoading', rootState);
                                        commit('changeFileStoreData', true);
                                        return 0;
                                    }
                                } else {
                                    // 发送错误信息
                                    console.error(copyResult.message);
                                    // 停止加载
                                    commit('hdLoading', rootState);
                                    commit('tgModel', {
                                        rootState: rootState,
                                        object: {kind: "none"}
                                    });
                                    commit("actModel", {
                                        rootState: rootState,
                                        object: {
                                            'kind': 'tip',
                                            'tipLevel': 'fail',
                                            'content': '保存失败！',
                                            'showTimeSecond': rootState.lifecycle.tipDisplayTime
                                        }
                                    });
                                    commit('changeFileStoreData', true);
                                    return 0;
                                }
                            } else {
                                // 发送错误信息
                                console.error(result.message);
                                // 停止加载
                                commit('hdLoading', rootState);
                                commit('tgModel', {
                                    rootState: rootState,
                                    object: {kind: "none"}
                                });
                                commit("actModel", {
                                    rootState: rootState,
                                    object: {
                                        'kind': 'tip',
                                        'tipLevel': 'fail',
                                        'content': result.message,
                                        'showTimeSecond': rootState.lifecycle.tipDisplayTime
                                    }
                                });
                                commit('changeFileStoreData', true);
                                return 0;
                            }
                        } catch (e) {
                            // 发送错误信息
                            console.error(e);
                            // 停止加载
                            commit('hdLoading', rootState);
                            commit('tgModel', {
                                rootState: rootState,
                                object: {kind: "none"}
                            });
                            commit("actModel", {
                                rootState: rootState,
                                object: {
                                    'kind': 'tip',
                                    'tipLevel': 'fail',
                                    'content': e,
                                    'showTimeSecond': rootState.lifecycle.tipDisplayTime
                                }
                            });
                            return 0;
                        }
                    }
                } else if (!currentPageIsEncryptedFile && planSaveFileInfo.length !== 0) {
                    // 说明用户对一个新建文件进行“保存”或“另存为”操作
                    // 需要接收用户提供的计划保存文件信息参数
                    if (planSaveFileInfo[1] === "mdz") {
                        // 如果计划保存的是mdz文件，则多媒体语句中：
                        // 采用绝对路径的本地多媒体文件将被嵌入mdz文件
                        // 而base64编码的图片和在线URL将保持不变
                        // 先创建好要保存的mdz文件夹结构
                        try {
                            let result = await window.fileManPreload.makeMdzDirectory(planSaveFileInfo[2], planSaveFileInfo[0]);
                            if (result.success) {
                                commit('changeFileStoreData', false);
                                let editsCopies = await getDirectPathToMdzMediaPathEdits(
                                    currentPageMonacoEditorModel,
                                    planSaveFileInfo[0],
                                    planSaveFileInfo[2]
                                );
                                // mdz文件夹结构创建成功后，开始拷贝多媒体文件至mdz文件夹结构
                                let copyResult;
                                if (editsCopies[1].length === 0) {  // 没有可以拷贝的文件，可以直接走了
                                    copyResult = {"success": true};
                                } else {
                                    copyResult = await window.fileManPreload.copyMdzMediaFiles(editsCopies[1]);
                                }
                                if (copyResult.success) {
                                    // 拷贝多媒体文件至mdz文件夹结构完成后，执行monaco editor edit序列操作
                                    if (editsCopies[0].length > 0) {
                                        currentPageMonacoEditorModel.pushStackElement();
                                        currentPageMonacoEditorModel.applyEdits(editsCopies[0], false);
                                        currentPageMonacoEditorModel.pushStackElement();
                                    }
                                    if (editsCopies[2].length > 0) {
                                        await replaceIdToOriginCode(currentPageMonacoEditorModel, editsCopies[2]);
                                    }
                                    // edit序列执行完成后，将Model的内容保存至mdz文件夹结构
                                    let writeResult = await window.fileManPreload.saveFileContent(
                                        planSaveFileInfo[2],
                                        planSaveFileInfo[0],
                                        currentPageMonacoEditorModel.getValue(),
                                        planSaveFileInfo[1]
                                    );
                                    if (writeResult.success) {
                                        // 最后将文件夹压缩封装为mdz文件
                                        let makeMdzResult = await window.fileManPreload.compressToMdz(
                                            planSaveFileInfo[2],
                                            planSaveFileInfo[0],
                                            planSaveFileInfo[3]
                                        );
                                        if (makeMdzResult.success) {
                                            // 封装完成后，修改store内tab数据，完成页面更新，并往sqlite历史记录表里写入一条记录
                                            const win32PathPattern = /(^([A-Za-z]:)(\/\S+)+)|(^([A-Za-z]:)(\\\S+)+)/;
                                            let sep = win32PathPattern.test(planSaveFileInfo[2]) ? "\\" : "/";
                                            currentPageInfo.set("saved", true);
                                            currentPageInfo.set("label",
                                                `${planSaveFileInfo[0]}.${planSaveFileInfo[1]}`);
                                            currentPageInfo.set("path", `/workspace?` +
                                                `pageid=${rootState.tab.currentOpenedPageId}&` +
                                                `filepath=${planSaveFileInfo[2]}${sep}${planSaveFileInfo[0]}.${planSaveFileInfo[1]}`);
                                            currentPageInfo.set("isExistFile", true);
                                            currentPageInfo.set("pageid", rootState.tab.currentOpenedPageId);
                                            currentPageInfo.set("encrypted", planSaveFileInfo[3] !== "");
                                            currentPageInfo.set("password", planSaveFileInfo[3]);

                                            let sqlResult = await window.sqliteDataManPreload.setRecentOpenedHistory(
                                                `${planSaveFileInfo[0]}.mdz`,
                                                `${planSaveFileInfo[2]}/${planSaveFileInfo[0]}.mdz`,
                                                getNow()
                                            );
                                            if (sqlResult.success) {
                                                // 停止加载
                                                commit('hdLoading', rootState);
                                                commit('changeFileStoreData', true);
                                            } else {
                                                // 发送错误信息
                                                console.error(sqlResult.message);
                                                // 停止加载
                                                commit('hdLoading', rootState);
                                                commit('changeFileStoreData', true);
                                                return 0;
                                            }
                                        }
                                    }
                                } else {
                                    // 发送错误信息
                                    console.error(copyResult.message);
                                    // 停止加载
                                    commit('hdLoading', rootState);
                                    commit('tgModel', {
                                        rootState: rootState,
                                        object: {kind: "none"}
                                    });
                                    commit("actModel", {
                                        rootState: rootState,
                                        object: {
                                            'kind': 'tip',
                                            'tipLevel': 'fail',
                                            'content': '保存失败！',
                                            'showTimeSecond': rootState.lifecycle.tipDisplayTime
                                        }
                                    });
                                    commit('changeFileStoreData', true);
                                    return 0;
                                }
                            } else {
                                // 发送错误信息
                                console.error(result.message);
                                // 停止加载
                                commit('hdLoading', rootState);
                                commit('tgModel', {
                                    rootState: rootState,
                                    object: {kind: "none"}
                                });
                                commit("actModel", {
                                    rootState: rootState,
                                    object: {
                                        'kind': 'tip',
                                        'tipLevel': 'fail',
                                        'content': result.message,
                                        'showTimeSecond': rootState.lifecycle.tipDisplayTime
                                    }
                                });
                                commit('changeFileStoreData', true);
                                return 0;
                            }
                        } catch (e) {
                            // 发送错误信息
                            console.error(e);
                            // 停止加载
                            commit('hdLoading', rootState);
                            commit('tgModel', {
                                rootState: rootState,
                                object: {kind: "none"}
                            });
                            commit("actModel", {
                                rootState: rootState,
                                object: {
                                    'kind': 'tip',
                                    'tipLevel': 'fail',
                                    'content': e,
                                    'showTimeSecond': rootState.lifecycle.tipDisplayTime
                                }
                            });
                            return 0;
                        }
                    } else {
                        // DONE
                        // 如果计划保存的文件不是mdz文件，则多媒体语句保持不变
                        // 需要用户提供的文件信息了
                        try {
                            let writeResult = await window.fileManPreload.saveFileContent(
                                planSaveFileInfo[2],
                                planSaveFileInfo[0],
                                currentPageMonacoEditorModel.getValue(),
                                planSaveFileInfo[1]
                            );
                            if (writeResult.success) {
                                // 保存完成后，修改store内tab数据，完成页面更新，并往sqlite历史记录表里写入一条记录
                                const win32PathPattern = /(^([A-Za-z]:)(\/\S+)+)|(^([A-Za-z]:)(\\\S+)+)/;
                                let sep = win32PathPattern.test(planSaveFileInfo[2]) ? "\\" : "/";
                                currentPageInfo.set("saved", true);
                                currentPageInfo.set("label",
                                    `${planSaveFileInfo[0]}.${planSaveFileInfo[1]}`);
                                currentPageInfo.set("path", `/workspace?` +
                                    `pageid=${rootState.tab.currentOpenedPageId}&` +
                                    `filepath=${planSaveFileInfo[2]}${sep}${planSaveFileInfo[0]}.${planSaveFileInfo[1]}`);
                                currentPageInfo.set("isExistFile", true);
                                currentPageInfo.set("pageid", rootState.tab.currentOpenedPageId);

                                try {
                                    let sqlResult = await window.sqliteDataManPreload.setRecentOpenedHistory(
                                        `${planSaveFileInfo[0]}.${planSaveFileInfo[1]}`,
                                        `${planSaveFileInfo[2]}/${planSaveFileInfo[0]}.${planSaveFileInfo[1]}`,
                                        getNow()
                                    );
                                    if (sqlResult.success) {
                                        // 停止加载
                                        commit('hdLoading', rootState);
                                    } else {
                                        // 停止加载
                                        commit('hdLoading', rootState);
                                        // 发送错误信息
                                        console.error(sqlResult.message);
                                        return 0;
                                    }
                                } catch (e) {
                                    // 停止加载
                                    commit('hdLoading', rootState);
                                    console.error(e);
                                }
                            } else {
                                // 停止加载
                                commit('hdLoading', rootState);
                                console.error(writeResult.message);
                            }
                        } catch (e) {
                            // 停止加载
                            commit('hdLoading', rootState);
                            console.error(e);
                        }
                    }
                }
            }
        },
    },
});
