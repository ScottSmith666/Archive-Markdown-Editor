import {
    actModel,
    tgModel,
    afterChosenFile,
    getMdzMediaPathToDirectPathEdits,
    getDirectPathToMdzMediaPathEdits,
    hdLoading,
    replaceIdToOriginCode,
    verifySaveForm,
    hdSaveForm
} from "./common.js";

const getNow = () => {
    const now = new Date();
    return now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false  // 使用24小时制
    }).replace(/\//g, '-');
};

export const fileMan = {
    state: () => {
        return {
            isListenFileChange: true,
        };
    },
    mutations: {
        // 激活“打开文件”操作系统组件
        activateOpenFileDialogMethod(state, rootState) {
            tgModel(rootState, {kind: "none"});
            let title = rootState.i18n.langPackage[rootState.settings.lang].dialog.systemDialogOpenFile;
            console.log("in activateOpenFileDialogMethod title: ", title);
            let content = rootState.i18n.langPackage[rootState.settings.lang].dialog.activeTip.userCancelOpen;
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
                        'content': result.message,
                        'showTimeSecond': rootState.lifecycle.tipDisplayTime
                    });
                }
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
                                    console.log("image url替换完成");
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
                                console.log("writeResult", writeResult);
                                if (writeResult.success) {
                                    // 最后将文件夹压缩封装为mdz文件
                                    let makeMdzResult = await window.fileManPreload.compressToMdz(
                                        currentPurePath,
                                        currentPureFileName,
                                        currentPageIsEncryptedFilePassword
                                    );
                                    console.log("makeMdzResult", makeMdzResult);
                                    if (makeMdzResult.success) {
                                        // 封装完成后，修改store内tab数据，完成页面更新，并往sqlite历史记录表里写入一条记录
                                        currentPageInfo.set("saved", true);
                                        console.log("修改保存状态");
                                        const win32PathPattern = /(^([A-Za-z]:)(\/\S+)+)|(^([A-Za-z]:)(\\\S+)+)/;
                                        let sep = win32PathPattern.test(currentPurePath) ? "\\" : "/";
                                        let sqlResult = await window.sqliteDataManPreload.setRecentOpenedHistory(
                                            `${currentPureFileName}.mdz`,
                                            `${currentPurePath}${sep}${currentPureFileName}.mdz`,
                                            getNow()
                                        );
                                        console.log("sqlResult", sqlResult);
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
                            const win32PathPattern = /(^([A-Za-z]:)(\/\S+)+)|(^([A-Za-z]:)(\\\S+)+)/;
                            let sep = win32PathPattern.test(currentPurePath) ? "\\" : "/";

                            try {
                                let sqlResult = await window.sqliteDataManPreload.setRecentOpenedHistory(
                                    `${currentPureFileName}.${currentOpenedFileExt}`,
                                    `${currentPurePath}${sep}${currentPureFileName}.${currentOpenedFileExt}`,
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
                let verifyResult = verifySaveForm(planSaveFileInfo);
                if (!verifyResult.success) {
                    alert(verifyResult.message);
                    // 停止加载
                    commit('hdLoading', rootState);
                    commit('tgModel', {
                        rootState: rootState,
                        object: {kind: "none"}
                    });
                    return 0;
                }

                // 隐藏保存表单
                commit('hdSaveForm', rootState);
                commit('tgModel', {
                    rootState: rootState,
                    object: {kind: "none"}
                });

                console.log("表单验证完成");
                console.log("currentPageIsExistFile", currentPageIsExistFile);
                console.log("planSaveFileInfo.length", planSaveFileInfo.length);
                if (currentPageIsExistFile && planSaveFileInfo.length !== 0) {
                    // 说明用户对一个已存在文件进行“另存为”操作
                    // 处理路由为路径
                    let currentOpenedFilePathArray = currentPageExistFileRouter.split("&").pop().replace('filepath=', '').split(/\\|\//);
                    let currentPureFileNameArray = currentOpenedFilePathArray.pop().split(".");
                    currentPureFileNameArray.pop();
                    let currentPureFileName = currentPureFileNameArray.join(".");
                    let currentPurePath = currentOpenedFilePathArray.join("/");
                    let currentOpenedFileExt = currentPageExistFileRouter.split("&").pop().replace('filepath=', '').split('.').pop();

                    console.log("currentOpenedFileExt", currentOpenedFileExt);
                    console.log("planSaveFileInfo", planSaveFileInfo);
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
                                        `${planSaveFileInfo[2]}${sep}${planSaveFileInfo[0]}.${planSaveFileInfo[1]}`,
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
                            console.log("makeMdzDirectory");
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
                                    console.log("进入getDirectPathToMdzMediaPathEdits");
                                    editsCopies = await getDirectPathToMdzMediaPathEdits(
                                        currentPageMonacoEditorModel,
                                        planSaveFileInfo[0],
                                        planSaveFileInfo[2]
                                    );
                                    console.log("出来getDirectPathToMdzMediaPathEdits");
                                }
                                // mdz文件夹结构创建成功后，开始拷贝多媒体文件至mdz文件夹结构
                                console.log("开始copyMdzMediaFiles");
                                console.log("editsCopies", editsCopies);
                                console.log("editsCopies[1].length", editsCopies[1].length);
                                console.log("editsCopies[1]", editsCopies[1]);
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
                                        console.log("image url替换完成");
                                    }
                                    if (editsCopies[2].length > 0) {
                                        console.log("开始替换了replaceIdToOriginCode");
                                        await replaceIdToOriginCode(currentPageMonacoEditorModel, editsCopies[2]);
                                    }
                                    // edit序列执行完成后，将Model的内容保存至mdz文件夹结构
                                    let writeResult = await window.fileManPreload.saveFileContent(
                                        planSaveFileInfo[2],
                                        planSaveFileInfo[0],
                                        currentPageMonacoEditorModel.getValue(),
                                        planSaveFileInfo[1]
                                    );
                                    console.log("writeResult", writeResult);
                                    if (writeResult.success) {
                                        // 最后将文件夹压缩封装为mdz文件
                                        let makeMdzResult = await window.fileManPreload.compressToMdz(
                                            planSaveFileInfo[2],
                                            planSaveFileInfo[0],
                                            planSaveFileInfo[3]
                                        );
                                        console.log("makeMdzResult", makeMdzResult);
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

                                            console.log("修改保存状态");

                                            let sqlResult = await window.sqliteDataManPreload.setRecentOpenedHistory(
                                                `${planSaveFileInfo[0]}.mdz`,
                                                `${planSaveFileInfo[2]}${sep}${planSaveFileInfo[0]}.mdz`,
                                                getNow()
                                            );
                                            console.log("sqlResult", sqlResult);
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
                                        console.log("image url替换完成");
                                    }
                                    if (editsCopies[2].length > 0) {
                                        await replaceIdToOriginCode(currentPageMonacoEditorModel, editsCopies[2]);
                                    }
                                    // edit序列执行完成后，将Model的内容保存至保存目录
                                    let writeResult = await window.fileManPreload.saveFileContent(
                                        planSaveFileInfo[2],
                                        planSaveFileInfo[0],
                                        currentPageMonacoEditorModel.getValue(),
                                        planSaveFileInfo[1]
                                    );
                                    console.log("writeResult", writeResult);
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

                                    console.log("修改保存状态");

                                    let sqlResult = await window.sqliteDataManPreload.setRecentOpenedHistory(
                                        `${planSaveFileInfo[0]}.${planSaveFileInfo[1]}`,
                                        `${planSaveFileInfo[2]}${sep}${planSaveFileInfo[0]}.${planSaveFileInfo[1]}`,
                                        getNow()
                                    );
                                    console.log("sqlResult", sqlResult);
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
                                        console.log("image url替换完成");
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
                                    console.log("writeResult", writeResult);
                                    if (writeResult.success) {
                                        // 最后将文件夹压缩封装为mdz文件
                                        let makeMdzResult = await window.fileManPreload.compressToMdz(
                                            planSaveFileInfo[2],
                                            planSaveFileInfo[0],
                                            planSaveFileInfo[3]
                                        );
                                        console.log("makeMdzResult", makeMdzResult);
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

                                            console.log("修改保存状态");

                                            let sqlResult = await window.sqliteDataManPreload.setRecentOpenedHistory(
                                                `${planSaveFileInfo[0]}.mdz`,
                                                `${planSaveFileInfo[2]}${sep}${planSaveFileInfo[0]}.mdz`,
                                                getNow()
                                            );
                                            console.log("sqlResult", sqlResult);
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
                                        `${planSaveFileInfo[2]}${sep}${planSaveFileInfo[0]}.${planSaveFileInfo[1]}`,
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
}
