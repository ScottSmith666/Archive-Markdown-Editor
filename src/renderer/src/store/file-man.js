// 仅保留与 store 状态无关的纯工具函数，状态相关的一律改为引用对应的 store
import {
    getMdzMediaPathToDirectPathEdits,
    getDirectPathToMdzMediaPathEdits,
    replaceIdToOriginCode,
    getNow
} from "./common.js";

import {defineStore} from "pinia";
import {useAmeLifecycleManStore} from "./ame-lifecycle-man";
import {useI18nStore} from "./i18n";
import {useSettingsManStore} from "./settings-man";
import {useTabManStore} from "./tab-man";

// 密码弹出框
const showPasswordPrompt = (t, message, isWrongPassword) => {
    return new Promise((resolve) => {
        const modal = document.getElementById('pwd-modal');
        const form = document.getElementById('pwd-form');
        const input = document.getElementById('pwd-input');
        const title = document.getElementById('pwd-title');
        const msg = document.getElementById('pwd-msg');

        title.innerText = t;
        // 如果密码错误，则字体呈现红色
        if (isWrongPassword) {
            title.style.color = "red";
        }
        msg.innerText = message;
        input.value = ''; // 清空上次输入
        modal.style.display = 'block'; // 显示遮罩
        form.style.display = 'block'; // 显示窗体
        input.focus();

        // 绑定确定按钮
        document.getElementById('pwd-ok').onclick = () => {
            modal.style.display = 'none';
            form.style.display = 'none';
            title.style.color = "#42b983";
            resolve(input.value); // 返回输入的密码
        };

        // 绑定回车键事件
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                modal.style.display = 'none';
                form.style.display = 'none';
                title.style.color = "#42b983";
                resolve(input.value); // 返回输入的密码
            }
        });

        // 绑定取消按钮
        document.getElementById('pwd-cancel').onclick = () => {
            modal.style.display = 'none';
            form.style.display = 'none';
            title.style.color = "#42b983";
            resolve(null); // 返回 null 代表取消
        };
    });
};

// 保存表单验证，提示文案改为从 i18n store 取
const verifySaveForm = (formArray, i18nStore, settingsManStore) => {
    // 用户提供的文件信息，则包含：data = [单纯文件名, 扩展名, 保存路径, 密码, 再次输入密码]
    const fileForbiddenChars = [">", "<", ":", "'", "|", "*", "?"];

    if (formArray[0] === '') {
        return {
            "success": false,
            message: i18nStore.langPackage[settingsManStore.lang].dialog.saveForm.fileNameRequired
        };
    }

    for (let i = 0; i < fileForbiddenChars.length; i++) {
        if (formArray[0].includes(fileForbiddenChars[i])) {
            return {
                "success": false,
                message: i18nStore.langPackage[settingsManStore.lang].dialog.saveForm.forbiddenChars
            };
        }
    }

    if (formArray[2] === '') {
        return {
            "success": false,
            message: i18nStore.langPackage[settingsManStore.lang].dialog.saveForm.savePathRequired
        };
    }

    if (formArray[3] !== formArray[4]) {
        return {
            "success": false,
            message: i18nStore.langPackage[settingsManStore.lang].dialog.saveForm.twicePasswordNotSame
        };
    }
    return {"success": true};
};

export const useFileManStore = defineStore("file-man-store", {
    state: () => {
        return {
            isListenFileChange: true,
            saveAsError: '',
        };
    },
    actions: {
        // 激活“打开文件”操作系统组件
        activateOpenFileDialogMethod() {
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

        // 用户选中文件之后的处理（打开文件 / 历史记录打开）
        afterChosenFile(result, isHistoryMethod = false) {
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
                        'content': i18nStore.langPackage[settingsManStore.lang].dialog.activeTip.forbiddenCharsInFileName,
                        'showTimeSecond': ameLifecycleManStore.tipDisplayTime
                    });
                    return 0;
                }
            }

            ameLifecycleManStore.autoTips({
                'wantToOpen': true,
                'kind': "loading",
                'content': i18nStore.langPackage[settingsManStore.lang].dialog.loading.open
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
                    tabManStore.addTabPage({
                        'pageType': 'file',
                        'pageTitle': result2.name,
                        'isExistFile': true,
                        'filePath': result2.path,
                        'content': result2.content,
                    });
                    ameLifecycleManStore.autoTips({
                        'wantToOpen': false,
                        'kind': "loading",
                        'content': ''
                    });  // 最后等页面load完成后，再关闭加载提示
                } else {
                    if (ext === 'md' || ext === 'txt') {  // 符合条件的md、txt文件以及不带密码的mdz文件出错那是真出错了，直接抛出异常提示
                        ameLifecycleManStore.autoTips({
                            'wantToOpen': false,
                            'kind': "loading",
                            'content': ''
                        });  // 最后等页面load完成后，再关闭加载提示

                        ameLifecycleManStore.autoTips({
                            'wantToOpen': true,
                            'kind': 'tip',
                            'tipLevel': 'fail',
                            'content': result2.message.includes('no such file or directory')
                                ? i18nStore.langPackage[settingsManStore.lang].dialog.activeTip.fileNotFound
                                : result2.message,
                            'showTimeSecond': ameLifecycleManStore.tipDisplayTime
                        });
                    } else if (ext === 'mdz') {
                        // 很可能是因为mdz设置了密码
                        // 进一步if确认如果真的mdz设置了密码
                        if (result2.message === "PASSWORD_REQUIRED") {
                            // 说明mdz设置了密码
                            // 那就弹出需要解锁密码的弹框输入密码
                            let promTitle = i18nStore.langPackage[settingsManStore.lang].dialog.openEncMdzPasswordRequired.title;
                            let promContent = i18nStore.langPackage[settingsManStore.lang].dialog.openEncMdzPasswordRequired.description;
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
                                            tabManStore.addTabPage({
                                                'pageType': 'file',
                                                'pageTitle': result4.name,
                                                'isExistFile': true,
                                                'filePath': result4.path,
                                                'content': result4.content,
                                                'encrypted': result4.encrypted,
                                                'password': userMdzPassword,
                                            });
                                            ameLifecycleManStore.autoTips({
                                                'wantToOpen': false,
                                                'kind': "loading",
                                                'content': ''
                                            });  // 最后等页面load完成后，再关闭加载提示
                                            break;
                                        } else {
                                            if (result4.message === "WRONG_PASSWORD_ERROR") {
                                                isPasswordWrong = true;
                                                promTitle = i18nStore.langPackage[settingsManStore.lang].dialog.openEncMdzPasswordRequired.wrongPasswordTitle;
                                            }
                                            // 如果不点取消则会一直重试
                                        }
                                    } else {
                                        // 用户点击了取消
                                        isPasswordWrong = false;
                                        ameLifecycleManStore.autoTips({
                                            'wantToOpen': false,
                                            'kind': "loading",
                                            'content': ''
                                        });
                                        ameLifecycleManStore.autoTips({
                                            'wantToOpen': true,
                                            'kind': 'tip',
                                            'tipLevel': 'info',
                                            'content': i18nStore.langPackage[settingsManStore.lang].dialog.activeTip.cancelPasswordInput,
                                            'showTimeSecond': ameLifecycleManStore.tipDisplayTime
                                        });
                                        break;
                                    }
                                } catch (e) {
                                    console.log(e);
                                    ameLifecycleManStore.autoTips({
                                        'wantToOpen': false,
                                        'kind': "loading",
                                        'content': ''
                                    });
                                    ameLifecycleManStore.autoTips({
                                        'wantToOpen': true,
                                        'kind': 'tip',
                                        'tipLevel': 'fail',
                                        'content': `${e.name}: ${e.message}`,
                                        'showTimeSecond': ameLifecycleManStore.tipDisplayTime
                                    });
                                    break;
                                }
                            }
                        } else {
                            ameLifecycleManStore.autoTips({
                                'wantToOpen': false,
                                'kind': "loading",
                                'content': ''
                            });
                            ameLifecycleManStore.autoTips({
                                'wantToOpen': true,
                                'kind': 'tip',
                                'tipLevel': 'fail',
                                'content': result2.message === "FILE_NOT_FOUND"
                                    ? i18nStore.langPackage[settingsManStore.lang].dialog.activeTip.fileNotFound : result2.message,
                                'showTimeSecond': ameLifecycleManStore.tipDisplayTime
                            });
                        }
                    } else {
                        ameLifecycleManStore.autoTips({
                            'wantToOpen': false,
                            'kind': "loading",
                            'content': ''
                        });
                        ameLifecycleManStore.autoTips({
                            'wantToOpen': true,
                            'kind': 'tip',
                            'tipLevel': 'fail',
                            'content': result2.message,
                            'showTimeSecond': ameLifecycleManStore.tipDisplayTime
                        });
                    }
                }
            }).catch((e) => {
                ameLifecycleManStore.autoTips({
                    'wantToOpen': true,
                    'kind': 'tip',
                    'tipLevel': 'fail',
                    'content': `${e.name}: ${e.message}`,
                    'showTimeSecond': ameLifecycleManStore.tipDisplayTime
                });
            });
        },

        // 在历史记录中打开文件时，走同一条处理链路
        openFileFromHistoryMethod(result) {
            this.afterChosenFile(result, true);
        },

        changeFileStoreData(value) {
            this.isListenFileChange = value;
        },

        // 激活“打开文件”操作系统组件 + modal
        activateOpenFileDialogAction() {
            this.activateOpenFileDialogMethod();
        },
        // 直接在历史记录中打开
        openFileFromHistoryAction(result) {
            this.openFileFromHistoryMethod(result);
        },
        // 保存文件
        async directSaveAction(data = []) {
            // 如果是用户提供的文件信息，则包含：data = [单纯文件名, 扩展名, 保存路径, 密码, 再次输入密码]
            // 如果用户不提供文件信息，则data为空列表
            let planSaveFileInfo = data;

            const ameLifecycleManStore = useAmeLifecycleManStore();
            const i18nStore = useI18nStore();
            const settingsManStore = useSettingsManStore();
            const tabManStore = useTabManStore();

            // 先拿到对应页面的相关信息
            let currentPageInfo = tabManStore.tabList.get(tabManStore.currentOpenedPageId);
            let currentPageMonacoEditorModel = currentPageInfo.get("monacoEditorModel");
            let currentPageIsExistFile = currentPageInfo.get("isExistFile");
            let currentPageIsEncryptedFile = currentPageInfo.get("encrypted");
            let currentPageIsEncryptedFilePassword = currentPageInfo.get("password");
            let currentPageExistFileRouter = currentPageInfo.get("path");

            if (currentPageIsExistFile && planSaveFileInfo.length === 0) {

                ameLifecycleManStore.toggleModal({wantToOpen: true, kind: "none"});

                ameLifecycleManStore.autoTips({
                    'wantToOpen': true,
                    'kind': 'loading',
                    'content': i18nStore.langPackage[settingsManStore.lang].dialog.loading.save,
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
                            this.changeFileStoreData(false);
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
                                            ameLifecycleManStore.hideLoading();
                                            this.changeFileStoreData(true);
                                        } else {
                                            // 发送错误信息
                                            console.error(sqlResult.message);
                                            // 停止加载
                                            ameLifecycleManStore.hideLoading();
                                            this.changeFileStoreData(true);
                                            return 0;
                                        }
                                    }
                                }
                            } else {
                                // 发送错误信息
                                console.error(copyResult.message);
                                // 停止加载
                                ameLifecycleManStore.hideLoading();
                                ameLifecycleManStore.autoTips({
                                    'wantToOpen': true,
                                    'kind': 'tip',
                                    'tipLevel': 'fail',
                                    'content': i18nStore.langPackage[settingsManStore.lang].dialog.activeTip.saveFailed,
                                    'showTimeSecond': ameLifecycleManStore.tipDisplayTime
                                });
                                this.changeFileStoreData(true);
                                return 0;
                            }
                        } else {
                            // 发送错误信息
                            console.error(result.message);
                            // 停止加载
                            ameLifecycleManStore.hideLoading();
                            this.changeFileStoreData(true);
                            return 0;
                        }
                    } catch (e) {
                        // 发送错误信息
                        console.error(e);
                        // 停止加载
                        ameLifecycleManStore.hideLoading();
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
                                    ameLifecycleManStore.hideLoading();
                                } else {
                                    // 停止加载
                                    ameLifecycleManStore.hideLoading();
                                    // 发送错误信息
                                    console.error(sqlResult.message);
                                    return 0;
                                }
                            } catch (e) {
                                // 停止加载
                                ameLifecycleManStore.hideLoading();
                                console.error(e);
                            }
                        } else {
                            // 停止加载
                            ameLifecycleManStore.hideLoading();
                            console.error(writeResult.message);
                        }
                    } catch (e) {
                        // 停止加载
                        ameLifecycleManStore.hideLoading();
                        console.error(e);
                    }
                }
            } else {
                ameLifecycleManStore.autoTips({
                    'wantToOpen': true,
                    'kind': 'loading',
                    'content': i18nStore.langPackage[settingsManStore.lang].dialog.loading.save,
                });

                // 表单验证
                let verifyResult = verifySaveForm(planSaveFileInfo, i18nStore, settingsManStore);
                if (!verifyResult.success) {
                    // 停止加载
                    ameLifecycleManStore.hideLoading();
                    // 表单不关闭，保留模态背景以便显示错误信息
                    ameLifecycleManStore.toggleModal({wantToOpen: true, kind: "none"});
                    this.saveAsError = verifyResult.message;
                    return 0;
                }

                // 隐藏“另存为”表单，但保留加载提示所需的模态背景
                ameLifecycleManStore.toggleModal({wantToOpen: false, kind: 'save-as'});
                ameLifecycleManStore.toggleModal({wantToOpen: true, kind: 'none'});

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
                                    `pageid=${tabManStore.currentOpenedPageId}&` +
                                    `filepath=${planSaveFileInfo[2]}${sep}${planSaveFileInfo[0]}.${planSaveFileInfo[1]}`);
                                currentPageInfo.set("isExistFile", true);
                                currentPageInfo.set("pageid", tabManStore.currentOpenedPageId);

                                try {
                                    let sqlResult = await window.sqliteDataManPreload.setRecentOpenedHistory(
                                        `${planSaveFileInfo[0]}.${planSaveFileInfo[1]}`,
                                        `${planSaveFileInfo[2]}/${planSaveFileInfo[0]}.${planSaveFileInfo[1]}`,
                                        getNow()
                                    );
                                    if (sqlResult.success) {
                                        // 停止加载
                                        ameLifecycleManStore.hideLoading();
                                    } else {
                                        // 停止加载
                                        ameLifecycleManStore.hideLoading();
                                        // 发送错误信息
                                        console.error(sqlResult.message);
                                        return 0;
                                    }
                                } catch (e) {
                                    // 停止加载
                                    ameLifecycleManStore.hideLoading();
                                    console.error(e);
                                }
                            } else {
                                // 停止加载
                                ameLifecycleManStore.hideLoading();
                                console.error(writeResult.message);
                            }
                        } catch (e) {
                            // 停止加载
                            ameLifecycleManStore.hideLoading();
                            console.error(e);
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
                                this.changeFileStoreData(false);
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
                                                `pageid=${tabManStore.currentOpenedPageId}&` +
                                                `filepath=${planSaveFileInfo[2]}${sep}${planSaveFileInfo[0]}.${planSaveFileInfo[1]}`);
                                            currentPageInfo.set("isExistFile", true);
                                            currentPageInfo.set("pageid", tabManStore.currentOpenedPageId);
                                            currentPageInfo.set("encrypted", planSaveFileInfo[3] !== "");
                                            currentPageInfo.set("password", planSaveFileInfo[3]);

                                            let sqlResult = await window.sqliteDataManPreload.setRecentOpenedHistory(
                                                `${planSaveFileInfo[0]}.mdz`,
                                                `${planSaveFileInfo[2]}/${planSaveFileInfo[0]}.mdz`,
                                                getNow()
                                            );
                                            if (sqlResult.success) {
                                                // 停止加载
                                                ameLifecycleManStore.hideLoading();
                                                this.changeFileStoreData(true);
                                            } else {
                                                // 发送错误信息
                                                console.error(sqlResult.message);
                                                // 停止加载
                                                ameLifecycleManStore.hideLoading();
                                                this.changeFileStoreData(true);
                                                return 0;
                                            }
                                        }
                                    }
                                } else {
                                    // 发送错误信息
                                    console.error(copyResult.message);
                                    // 停止加载
                                    ameLifecycleManStore.hideLoading();
                                    ameLifecycleManStore.autoTips({
                                        'wantToOpen': true,
                                        'kind': 'tip',
                                        'tipLevel': 'fail',
                                        'content': i18nStore.langPackage[settingsManStore.lang].dialog.activeTip.saveFailed,
                                        'showTimeSecond': ameLifecycleManStore.tipDisplayTime
                                    });
                                    this.changeFileStoreData(true);
                                    return 0;
                                }
                            } else {
                                // 发送错误信息
                                console.error(result.message);
                                // 停止加载
                                ameLifecycleManStore.hideLoading();
                                ameLifecycleManStore.autoTips({
                                    'wantToOpen': true,
                                    'kind': 'tip',
                                    'tipLevel': 'fail',
                                    'content': result.message,
                                    'showTimeSecond': ameLifecycleManStore.tipDisplayTime
                                });
                                this.changeFileStoreData(true);
                                return 0;
                            }
                        } catch (e) {
                            // 发送错误信息
                            console.error(e);
                            // 停止加载
                            ameLifecycleManStore.hideLoading();
                            ameLifecycleManStore.autoTips({
                                'wantToOpen': true,
                                'kind': 'tip',
                                'tipLevel': 'fail',
                                'content': e,
                                'showTimeSecond': ameLifecycleManStore.tipDisplayTime
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
                                this.changeFileStoreData(false);
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
                                        `pageid=${tabManStore.currentOpenedPageId}&` +
                                        `filepath=${planSaveFileInfo[2]}${sep}${planSaveFileInfo[0]}.${planSaveFileInfo[1]}`);
                                    currentPageInfo.set("isExistFile", true);
                                    currentPageInfo.set("pageid", tabManStore.currentOpenedPageId);
                                    currentPageInfo.set("encrypted", false);
                                    currentPageInfo.set("password", "");

                                    let sqlResult = await window.sqliteDataManPreload.setRecentOpenedHistory(
                                        `${planSaveFileInfo[0]}.${planSaveFileInfo[1]}`,
                                        `${planSaveFileInfo[2]}/${planSaveFileInfo[0]}.${planSaveFileInfo[1]}`,
                                        getNow()
                                    );
                                    if (sqlResult.success) {
                                        // 停止加载
                                        ameLifecycleManStore.hideLoading();
                                        this.changeFileStoreData(true);
                                    } else {
                                        // 发送错误信息
                                        console.error(sqlResult.message);
                                        // 停止加载
                                        ameLifecycleManStore.hideLoading();
                                        this.changeFileStoreData(true);
                                        return 0;
                                    }
                                } else {
                                    // 发送错误信息
                                    console.error(copyResult.message);
                                    // 停止加载
                                    ameLifecycleManStore.hideLoading();
                                    ameLifecycleManStore.autoTips({
                                        'wantToOpen': true,
                                        'kind': 'tip',
                                        'tipLevel': 'fail',
                                        'content': '保存失败！',
                                        'showTimeSecond': ameLifecycleManStore.tipDisplayTime
                                    });
                                    this.changeFileStoreData(true);
                                    return 0;
                                }
                            } else {
                                // 发送错误信息
                                console.error(result.message);
                                // 停止加载
                                ameLifecycleManStore.hideLoading();
                                ameLifecycleManStore.autoTips({
                                    'wantToOpen': true,
                                    'kind': 'tip',
                                    'tipLevel': 'fail',
                                    'content': result.message,
                                    'showTimeSecond': ameLifecycleManStore.tipDisplayTime
                                });
                                this.changeFileStoreData(true);
                                return 0;
                            }
                        } catch (e) {
                            // 发送错误信息
                            console.error(e);
                            // 停止加载
                            ameLifecycleManStore.hideLoading();
                            ameLifecycleManStore.autoTips({
                                'wantToOpen': true,
                                'kind': 'tip',
                                'tipLevel': 'fail',
                                'content': e,
                                'showTimeSecond': ameLifecycleManStore.tipDisplayTime
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
                                this.changeFileStoreData(false);
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
                                                `pageid=${tabManStore.currentOpenedPageId}&` +
                                                `filepath=${planSaveFileInfo[2]}${sep}${planSaveFileInfo[0]}.${planSaveFileInfo[1]}`);
                                            currentPageInfo.set("isExistFile", true);
                                            currentPageInfo.set("pageid", tabManStore.currentOpenedPageId);
                                            currentPageInfo.set("encrypted", planSaveFileInfo[3] !== "");
                                            currentPageInfo.set("password", planSaveFileInfo[3]);

                                            let sqlResult = await window.sqliteDataManPreload.setRecentOpenedHistory(
                                                `${planSaveFileInfo[0]}.mdz`,
                                                `${planSaveFileInfo[2]}/${planSaveFileInfo[0]}.mdz`,
                                                getNow()
                                            );
                                            if (sqlResult.success) {
                                                // 停止加载
                                                ameLifecycleManStore.hideLoading();
                                                this.changeFileStoreData(true);
                                            } else {
                                                // 发送错误信息
                                                console.error(sqlResult.message);
                                                // 停止加载
                                                ameLifecycleManStore.hideLoading();
                                                this.changeFileStoreData(true);
                                                return 0;
                                            }
                                        }
                                    }
                                } else {
                                    // 发送错误信息
                                    console.error(copyResult.message);
                                    // 停止加载
                                    ameLifecycleManStore.hideLoading();
                                    ameLifecycleManStore.autoTips({
                                        'wantToOpen': true,
                                        'kind': 'tip',
                                        'tipLevel': 'fail',
                                        'content': '保存失败！',
                                        'showTimeSecond': ameLifecycleManStore.tipDisplayTime
                                    });
                                    this.changeFileStoreData(true);
                                    return 0;
                                }
                            } else {
                                // 发送错误信息
                                console.error(result.message);
                                // 停止加载
                                ameLifecycleManStore.hideLoading();
                                ameLifecycleManStore.autoTips({
                                    'wantToOpen': true,
                                    'kind': 'tip',
                                    'tipLevel': 'fail',
                                    'content': result.message,
                                    'showTimeSecond': ameLifecycleManStore.tipDisplayTime
                                });
                                this.changeFileStoreData(true);
                                return 0;
                            }
                        } catch (e) {
                            // 发送错误信息
                            console.error(e);
                            // 停止加载
                            ameLifecycleManStore.hideLoading();
                            ameLifecycleManStore.autoTips({
                                'wantToOpen': true,
                                'kind': 'tip',
                                'tipLevel': 'fail',
                                'content': e,
                                'showTimeSecond': ameLifecycleManStore.tipDisplayTime
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
                                    `pageid=${tabManStore.currentOpenedPageId}&` +
                                    `filepath=${planSaveFileInfo[2]}${sep}${planSaveFileInfo[0]}.${planSaveFileInfo[1]}`);
                                currentPageInfo.set("isExistFile", true);
                                currentPageInfo.set("pageid", tabManStore.currentOpenedPageId);

                                try {
                                    let sqlResult = await window.sqliteDataManPreload.setRecentOpenedHistory(
                                        `${planSaveFileInfo[0]}.${planSaveFileInfo[1]}`,
                                        `${planSaveFileInfo[2]}/${planSaveFileInfo[0]}.${planSaveFileInfo[1]}`,
                                        getNow()
                                    );
                                    if (sqlResult.success) {
                                        // 停止加载
                                        ameLifecycleManStore.hideLoading();
                                    } else {
                                        // 停止加载
                                        ameLifecycleManStore.hideLoading();
                                        // 发送错误信息
                                        console.error(sqlResult.message);
                                        return 0;
                                    }
                                } catch (e) {
                                    // 停止加载
                                    ameLifecycleManStore.hideLoading();
                                    console.error(e);
                                }
                            } else {
                                // 停止加载
                                ameLifecycleManStore.hideLoading();
                                console.error(writeResult.message);
                            }
                        } catch (e) {
                            // 停止加载
                            ameLifecycleManStore.hideLoading();
                            console.error(e);
                        }
                    }
                }
            }
        },
    },
});
