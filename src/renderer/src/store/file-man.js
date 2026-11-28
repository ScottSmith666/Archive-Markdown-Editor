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

// 文件名中的非法字符
const FILE_FORBIDDEN_CHARS = [">", "<", ":", "'", "|", "*", "?"];
// win32 绝对路径（盘符开头）特征
const WIN32_PATH_PATTERN = /(^([A-Za-z]:)(\/\S+)+)|(^([A-Za-z]:)(\\\S+)+)/;
// 纯文本扩展名
const TEXT_EXTS = ["md", "txt"];

const isTextExt = (ext) => TEXT_EXTS.includes(ext);

const hasForbiddenChars = (fileName) => FILE_FORBIDDEN_CHARS.some((char) => fileName.includes(char));

// 目标目录的路径分隔符（win32 绝对路径用反斜杠）
const pathSeparatorOf = (dirPath) => WIN32_PATH_PATTERN.test(dirPath) ? "\\" : "/";

// 当前语言包（Pinia store 为进程内单例，重复取用开销可忽略）
const currentLang = () => useI18nStore().langPackage[useSettingsManStore().lang];

// 从 workspace 路由中解析出「纯文件名 / 所在目录 / 扩展名」
const parseRouterFilePath = (router) => {
    const filePath = router.split("&").pop().replace('filepath=', '');
    const pathParts = filePath.split(/\\|\//);
    const nameParts = pathParts.pop().split(".");
    nameParts.pop();
    return {
        pureFileName: nameParts.join("."),
        purePath: pathParts.join("/"),
        ext: filePath.split(".").pop()
    };
};

// 往 sqlite 历史记录表里写入一条最近打开记录（记录内路径固定使用 / 分隔）
const addRecentOpenedHistory = (dirPath, fullFileName) => window.sqliteDataManPreload.setRecentOpenedHistory(
    fullFileName,
    `${dirPath}/${fullFileName}`,
    getNow()
);

// “另存为”成功后同步 Tab 数据；encrypted / password 传 undefined 时保持页面原值不变
const applySaveAsTabInfo = (pageInfo, pureFileName, ext, dirPath, encrypted, password) => {
    const tabManStore = useTabManStore();
    pageInfo.set("saved", true);
    pageInfo.set("label", `${pureFileName}.${ext}`);
    pageInfo.set("path", `/workspace?` +
        `pageid=${tabManStore.currentOpenedPageId}&` +
        `filepath=${dirPath}${pathSeparatorOf(dirPath)}${pureFileName}.${ext}`);
    pageInfo.set("isExistFile", true);
    pageInfo.set("pageid", tabManStore.currentOpenedPageId);
    if (encrypted !== undefined) {
        pageInfo.set("encrypted", encrypted);
    }
    if (password !== undefined) {
        pageInfo.set("password", password);
    }
};

// 拷贝多媒体文件到目标目录结构（没有需要拷贝的文件时直接视为成功）
const copyMediaFiles = async (editsCopies) => editsCopies[1].length === 0
    ? {"success": true}
    : await window.fileManPreload.copyMdzMediaFiles(editsCopies[1]);

// 把 edit 序列应用到 Monaco Editor Model 上
const applyMediaEdits = async (monacoEditorModel, editsCopies) => {
    if (editsCopies[0].length > 0) {
        monacoEditorModel.pushStackElement();
        monacoEditorModel.applyEdits(editsCopies[0], false);
        monacoEditorModel.pushStackElement();
    }
    if (editsCopies[2].length > 0) {
        await replaceIdToOriginCode(monacoEditorModel, editsCopies[2]);
    }
};

// 显示加载提示
const showLoadingTip = (content) => useAmeLifecycleManStore().autoTips({
    'wantToOpen': true,
    'kind': 'loading',
    'content': content
});

// 等页面 load 完成后，关闭加载提示
const closeLoadingTip = () => useAmeLifecycleManStore().autoTips({
    'wantToOpen': false,
    'kind': 'loading',
    'content': ''
});

// 失败提示条
const tipFail = (content) => {
    const ameLifecycleManStore = useAmeLifecycleManStore();
    ameLifecycleManStore.autoTips({
        'wantToOpen': true,
        'kind': 'tip',
        'tipLevel': 'fail',
        'content': content,
        'showTimeSecond': ameLifecycleManStore.tipDisplayTime
    });
};

// 信息提示条
const tipInfo = (content) => {
    const ameLifecycleManStore = useAmeLifecycleManStore();
    ameLifecycleManStore.autoTips({
        'wantToOpen': true,
        'kind': 'tip',
        'tipLevel': 'info',
        'content': content,
        'showTimeSecond': ameLifecycleManStore.tipDisplayTime
    });
};

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

        // 收起遮罩与窗体，并把结果交回调用方（null 代表用户取消）
        const finish = (value) => {
            modal.style.display = 'none';
            form.style.display = 'none';
            title.style.color = "#42b983";
            resolve(value);
        };

        // 绑定确定按钮
        document.getElementById('pwd-ok').onclick = () => finish(input.value);

        // 绑定回车键事件
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                finish(input.value);
            }
        });

        // 绑定取消按钮
        document.getElementById('pwd-cancel').onclick = () => finish(null);
    });
};

// 保存表单验证，提示文案从 i18n store 取
// 用户提供的文件信息包含：data = [单纯文件名, 扩展名, 保存路径, 密码, 再次输入密码]
const verifySaveForm = (formArray) => {
    const saveFormText = currentLang().dialog.saveForm;

    if (formArray[0] === '') {
        return {"success": false, message: saveFormText.fileNameRequired};
    }
    if (hasForbiddenChars(formArray[0])) {
        return {"success": false, message: saveFormText.forbiddenChars};
    }
    if (formArray[2] === '') {
        return {"success": false, message: saveFormText.savePathRequired};
    }
    if (formArray[3] !== formArray[4]) {
        return {"success": false, message: saveFormText.twicePasswordNotSame};
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

            ameLifecycleManStore.toggleModal({wantToOpen: true, kind: "none"});
            window.fileManPreload.activateOpenFileDialog(
                currentLang().dialog.systemDialogOpenFile,
                currentLang().dialog.activeTip.userCancelOpen
            ).then((result) => {
                // 如果result.success是true则在新标签页打开文件
                // 如果是false，则不触发任何事件
                if (result.success) {  // 用户选中了一个文件
                    this.afterChosenFile(result);
                } else {
                    // 显示“用户已取消”tip
                    tipInfo(result.message);
                }
            });
        },

        // 用户选中文件之后的处理（打开文件 / 历史记录打开）
        afterChosenFile(result, isHistoryMethod = false) {
            const ameLifecycleManStore = useAmeLifecycleManStore();
            const tabManStore = useTabManStore();

            if (isHistoryMethod) {
                ameLifecycleManStore.toggleModal({wantToOpen: true, kind: "none"});
            }
            // 判断是否已经打开过文件
            if (tabManStore.isOpened(result.filePath)) {
                tipFail(currentLang().dialog.activeTip.repeatOpenForbidden);
                return 0;
            }
            // 检查文件名内是否有非法字符
            if (hasForbiddenChars(result.filePath.split(/\\|\//).pop())) {
                tipFail(currentLang().dialog.activeTip.forbiddenCharsInFileName);
                return 0;
            }

            showLoadingTip(currentLang().dialog.loading.open);  // 显示加载
            // 获得文件路径后，异步打开文件获得内容
            const planOpenFilePath = result.filePath;
            const ext = result.fileName.split(".").pop();
            window.fileManPreload.loadFileContent(
                planOpenFilePath,
                currentLang().dialog.activeTip.unsupportedFileType
            ).then(async (result2) => {
                // 符合条件的md、txt文件以及不带密码的mdz文件可直接打开
                if (result2.success) {
                    // 然后将其装载入Monaco Editor Model
                    // 最后将这个Model装入Tab Map，打开这个Tab对应的页面
                    tabManStore.addTabPage({
                        'pageType': 'file',
                        'pageTitle': result2.name,
                        'isExistFile': true,
                        'filePath': result2.path,
                        'content': result2.content,
                    });
                    closeLoadingTip();
                    return;
                }
                if (isTextExt(ext)) {
                    // 符合条件的md、txt文件出错那是真出错了，直接抛出异常提示
                    closeLoadingTip();
                    tipFail(result2.message.includes('no such file or directory')
                        ? currentLang().dialog.activeTip.fileNotFound
                        : result2.message);
                    return;
                }
                if (ext !== 'mdz') {
                    closeLoadingTip();
                    tipFail(result2.message);
                    return;
                }
                // 很可能是因为mdz设置了密码，进一步确认如果真的mdz设置了密码
                if (result2.message !== "PASSWORD_REQUIRED") {
                    closeLoadingTip();
                    tipFail(result2.message === "FILE_NOT_FOUND"
                        ? currentLang().dialog.activeTip.fileNotFound : result2.message);
                    return;
                }
                // 说明mdz设置了密码，弹出需要解锁密码的弹框输入密码
                await this.promptMdzPassword(planOpenFilePath, tabManStore);
            }).catch((e) => {
                tipFail(`${e.name}: ${e.message}`);
            });
        },

        // mdz 已加密时循环索取解锁密码，直到成功、取消或异常
        async promptMdzPassword(planOpenFilePath, tabManStore) {
            let promTitle = currentLang().dialog.openEncMdzPasswordRequired.title;
            let promContent = currentLang().dialog.openEncMdzPasswordRequired.description;
            let isPasswordWrong = false;  // 指示是否输入密码出错，如为true则说明密码输错
            while (true) {
                try {
                    const typedPassword = await showPasswordPrompt(promTitle, promContent, isPasswordWrong);
                    if (!typedPassword) {
                        // 用户点击了取消
                        closeLoadingTip();
                        tipInfo(currentLang().dialog.activeTip.cancelPasswordInput);
                        break;
                    }
                    // 开始尝试用输入的密码打开加密mdz
                    const result4 = await window.fileManPreload.loadEncryptedMdzFileContent(
                        planOpenFilePath,
                        typedPassword
                    );
                    if (result4.success) {
                        // 说明密码正确，开始加载内容
                        tabManStore.addTabPage({
                            'pageType': 'file',
                            'pageTitle': result4.name,
                            'isExistFile': true,
                            'filePath': result4.path,
                            'content': result4.content,
                            'encrypted': result4.encrypted,
                            'password': typedPassword,
                        });
                        closeLoadingTip();
                        break;
                    }
                    if (result4.message === "WRONG_PASSWORD_ERROR") {
                        isPasswordWrong = true;
                        promTitle = currentLang().dialog.openEncMdzPasswordRequired.wrongPasswordTitle;
                    }
                    // 如果不点取消则会一直重试
                } catch (e) {
                    console.log(e);
                    closeLoadingTip();
                    tipFail(`${e.name}: ${e.message}`);
                    break;
                }
            }
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
            const planSaveFileInfo = data;
            const ameLifecycleManStore = useAmeLifecycleManStore();
            const tabManStore = useTabManStore();

            // 先拿到对应页面的相关信息
            const currentPageInfo = tabManStore.tabList.get(tabManStore.currentOpenedPageId);
            const pageContext = {
                pageInfo: currentPageInfo,
                monacoEditorModel: currentPageInfo.get("monacoEditorModel"),
                isExistFile: currentPageInfo.get("isExistFile"),
                isEncryptedFile: currentPageInfo.get("encrypted"),
                encryptedFilePassword: currentPageInfo.get("password"),
                existFileRouter: currentPageInfo.get("path")
            };

            if (pageContext.isExistFile && planSaveFileInfo.length === 0) {
                // currentPageIsExistFile为true，且用户不提供计划保存文件信息参数
                // 说明是已存在的文件，且用户进行“保存”操作
                // 直接在tabList的对应页面的item里拿取文件信息，覆盖保存即可
                ameLifecycleManStore.toggleModal({wantToOpen: true, kind: "none"});
                showLoadingTip(currentLang().dialog.loading.save);
                return await this.saveInPlaceAction(pageContext);
            }

            showLoadingTip(currentLang().dialog.loading.save);

            // 表单验证
            const verifyResult = verifySaveForm(planSaveFileInfo);
            if (!verifyResult.success) {
                ameLifecycleManStore.hideLoading();
                // 表单不关闭，保留模态背景以便显示错误信息
                ameLifecycleManStore.toggleModal({wantToOpen: true, kind: "none"});
                this.saveAsError = verifyResult.message;
                return 0;
            }

            // 隐藏“另存为”表单，但保留加载提示所需的模态背景
            ameLifecycleManStore.toggleModal({wantToOpen: false, kind: 'save-as'});
            ameLifecycleManStore.toggleModal({wantToOpen: true, kind: 'none'});

            if (pageContext.isExistFile && planSaveFileInfo.length !== 0) {
                // 说明用户对一个已存在文件进行“另存为”操作
                return await this.saveAsOverExistingAction(pageContext, planSaveFileInfo);
            }
            if (!pageContext.isEncryptedFile && planSaveFileInfo.length !== 0) {
                // 说明用户对一个新建文件进行“保存”或“另存为”操作
                // 需要接收用户提供的计划保存文件信息参数
                return await this.saveAsNewFileAction(pageContext, planSaveFileInfo);
            }
        },

        // 覆盖保存已存在的文件（“保存”操作）
        async saveInPlaceAction({pageInfo, monacoEditorModel, encryptedFilePassword, existFileRouter}) {
            const ameLifecycleManStore = useAmeLifecycleManStore();
            // 处理路由为路径
            const {pureFileName, purePath, ext} = parseRouterFilePath(existFileRouter);

            if (ext !== "mdz") {
                // 如果发现这个文件不是mdz文件，则多媒体语句保持不变
                // 将Model的内容保存至指定的保存路径
                try {
                    const writeResult = await window.fileManPreload.saveFileContent(
                        purePath,
                        pureFileName,
                        monacoEditorModel.getValue(),
                        ext
                    );
                    if (!writeResult.success) {
                        ameLifecycleManStore.hideLoading();
                        console.error(writeResult.message);
                        return;
                    }
                    // 保存完成后，修改store内tab数据，完成页面更新，
                    // 并往sqlite历史记录表里写入一条记录
                    pageInfo.set("saved", true);
                    try {
                        const sqlResult = await addRecentOpenedHistory(purePath, `${pureFileName}.${ext}`);
                        ameLifecycleManStore.hideLoading();
                        if (!sqlResult.success) {
                            console.error(sqlResult.message);
                            return 0;
                        }
                    } catch (e) {
                        ameLifecycleManStore.hideLoading();
                        console.error(e);
                    }
                } catch (e) {
                    ameLifecycleManStore.hideLoading();
                    console.error(e);
                }
                return;
            }

            // 这里的逻辑是
            // 当已存在的文件执行“保存”操作的时候
            // 如果发现这个文件是mdz文件，则多媒体语句中：
            // 采用绝对路径的本地多媒体文件将被嵌入mdz文件
            // 而base64编码的图片和在线URL将保持不变
            try {
                // 先创建好要保存的mdz文件夹结构（win32平台需要运行命令以使文件夹不可见）
                const result = await window.fileManPreload.makeMdzDirectory(purePath, pureFileName);
                if (!result.success) {
                    console.error(result.message);
                    ameLifecycleManStore.hideLoading();
                    this.changeFileStoreData(true);
                    return 0;
                }
                this.changeFileStoreData(false);
                const editsCopies = await getDirectPathToMdzMediaPathEdits(
                    monacoEditorModel,
                    pureFileName,
                    purePath
                );
                // mdz文件夹结构创建成功后，开始拷贝多媒体文件至mdz文件夹结构
                const copyResult = await copyMediaFiles(editsCopies);
                if (!copyResult.success) {
                    console.error(copyResult.message);
                    ameLifecycleManStore.hideLoading();
                    tipFail(currentLang().dialog.activeTip.saveFailed);
                    this.changeFileStoreData(true);
                    return 0;
                }
                // 拷贝多媒体文件至mdz文件夹结构完成后，执行monaco editor edit序列操作
                await applyMediaEdits(monacoEditorModel, editsCopies);
                // edit序列执行完成后，将Model的内容保存至mdz文件夹结构
                const writeResult = await window.fileManPreload.saveFileContent(
                    purePath,
                    pureFileName,
                    monacoEditorModel.getValue(),
                    ext
                );
                if (!writeResult.success) {
                    return;
                }
                // 最后将文件夹压缩封装为mdz文件
                const makeMdzResult = await window.fileManPreload.compressToMdz(
                    purePath,
                    pureFileName,
                    encryptedFilePassword,
                    // 就地“保存”：主进程会先把原包改名成 .mdzcache 留底，新包压缩成功后才删除留底
                    true
                );
                if (!makeMdzResult.success) {
                    console.error(makeMdzResult.message);
                    ameLifecycleManStore.hideLoading();
                    this.changeFileStoreData(true);
                    return;
                }
                // 封装完成后，修改store内tab数据，完成页面更新，
                // 并往sqlite历史记录表里写入一条记录
                pageInfo.set("saved", true);
                const sqlResult = await addRecentOpenedHistory(purePath, `${pureFileName}.mdz`);
                if (sqlResult.success) {
                    ameLifecycleManStore.hideLoading();
                    this.changeFileStoreData(true);
                } else {
                    console.error(sqlResult.message);
                    ameLifecycleManStore.hideLoading();
                    this.changeFileStoreData(true);
                    return 0;
                }
            } catch (e) {
                console.error(e);
                ameLifecycleManStore.hideLoading();
                return 0;
            }
        },

        // 对一个已存在文件执行“另存为”
        async saveAsOverExistingAction(pageContext, planSaveFileInfo) {
            // 需要接收用户提供的计划保存文件信息参数
            // 处理路由为路径
            const {pureFileName, purePath, ext} = parseRouterFilePath(pageContext.existFileRouter);
            const planSaveExt = planSaveFileInfo[1];

            if (isTextExt(ext) && isTextExt(planSaveExt)) {
                // 当(md或txt)另存为(md或txt)，则多媒体语句保持不变
                return await this.saveAsPlainTextAction(pageContext, planSaveFileInfo);
            }
            if ((isTextExt(ext) || ext === "mdz") && planSaveExt === "mdz") {
                // 当(md或txt或mdz)另存为mdz，则多媒体语句中：
                // 采用绝对路径的本地多媒体文件将被嵌入mdz文件
                // 而base64编码的图片和在线URL将保持不变
                // 源文件本身是mdz时，还需把媒体路径从旧mdz目录改写为新mdz目录
                return await this.saveAsMdzAction(pageContext, planSaveFileInfo, {
                    rebaseFromFileName: ext === "mdz" ? pureFileName : undefined,
                    rebaseFromDirPath: ext === "mdz" ? purePath : undefined,
                    getCopyFailMessage: () => currentLang().dialog.activeTip.saveFailed
                });
            }
            if (ext === "mdz" && isTextExt(planSaveExt)) {
                // 当mdz另存为(md或txt)，则多媒体语句中：
                // 采用mdz媒体路径语法的本地多媒体文件将被解压出mdz文件
                // 在mdz文件同一路径中创建“文件名.media_dir”文件夹，并把多媒体放置其中
                // 然后将mdz媒体路径语法改成指向这个文件夹的媒体文件路径
                // 而base64编码的图片和在线URL将保持不变
                return await this.extractMdzToMediaDirAction(pageContext, planSaveFileInfo, {
                    pureFileName,
                    purePath
                });
            }
        },

        // 对一个新建文件执行“保存”或“另存为”
        async saveAsNewFileAction(pageContext, planSaveFileInfo) {
            if (planSaveFileInfo[1] === "mdz") {
                // 如果计划保存的是mdz文件，则多媒体语句中：
                // 采用绝对路径的本地多媒体文件将被嵌入mdz文件
                // 而base64编码的图片和在线URL将保持不变
                return await this.saveAsMdzAction(pageContext, planSaveFileInfo, {
                    getCopyFailMessage: () => '保存失败！'
                });
            }
            // 如果计划保存的文件不是mdz文件，则多媒体语句保持不变
            return await this.saveAsPlainTextAction(pageContext, planSaveFileInfo);
        },

        // 纯文本另存为：直接把Model内容写入目标路径
        async saveAsPlainTextAction({pageInfo, monacoEditorModel}, planSaveFileInfo) {
            const ameLifecycleManStore = useAmeLifecycleManStore();
            const [pureFileName, ext, dirPath] = planSaveFileInfo;
            try {
                const writeResult = await window.fileManPreload.saveFileContent(
                    dirPath,
                    pureFileName,
                    monacoEditorModel.getValue(),
                    ext
                );
                if (!writeResult.success) {
                    ameLifecycleManStore.hideLoading();
                    console.error(writeResult.message);
                    return;
                }
                // 保存完成后，修改store内tab数据，完成页面更新，
                // 并往sqlite历史记录表里写入一条记录
                applySaveAsTabInfo(pageInfo, pureFileName, ext, dirPath);
                const sqlResult = await addRecentOpenedHistory(dirPath, `${pureFileName}.${ext}`);
                ameLifecycleManStore.hideLoading();
                if (!sqlResult.success) {
                    console.error(sqlResult.message);
                    return 0;
                }
            } catch (e) {
                ameLifecycleManStore.hideLoading();
                console.error(e);
            }
        },

        // 另存为mdz：内嵌本地多媒体 → 改写媒体路径 → 压缩封装
        // rebaseFromFileName / rebaseFromDirPath 仅在源文件本身是mdz时传入
        async saveAsMdzAction({pageInfo, monacoEditorModel}, planSaveFileInfo, options) {
            const ameLifecycleManStore = useAmeLifecycleManStore();
            const [pureFileName, ext, dirPath, password] = planSaveFileInfo;
            try {
                // 先创建好要保存的mdz文件夹结构
                const result = await window.fileManPreload.makeMdzDirectory(dirPath, pureFileName);
                if (!result.success) {
                    console.error(result.message);
                    ameLifecycleManStore.hideLoading();
                    tipFail(result.message);
                    this.changeFileStoreData(true);
                    return 0;
                }
                this.changeFileStoreData(false);
                const editsCopies = options.rebaseFromFileName === undefined
                    ? await getDirectPathToMdzMediaPathEdits(monacoEditorModel, pureFileName, dirPath)
                    : await getDirectPathToMdzMediaPathEdits(
                        monacoEditorModel,
                        pureFileName,
                        dirPath,
                        true,
                        options.rebaseFromFileName,
                        options.rebaseFromDirPath
                    );
                // mdz文件夹结构创建成功后，开始拷贝多媒体文件至mdz文件夹结构
                const copyResult = await copyMediaFiles(editsCopies);
                if (!copyResult.success) {
                    console.error(copyResult.message);
                    ameLifecycleManStore.hideLoading();
                    tipFail(options.getCopyFailMessage());
                    this.changeFileStoreData(true);
                    return 0;
                }
                // 拷贝多媒体文件至mdz文件夹结构完成后，执行monaco editor edit序列操作
                await applyMediaEdits(monacoEditorModel, editsCopies);
                // edit序列执行完成后，将Model的内容保存至mdz文件夹结构
                const writeResult = await window.fileManPreload.saveFileContent(
                    dirPath,
                    pureFileName,
                    monacoEditorModel.getValue(),
                    ext
                );
                if (!writeResult.success) {
                    return;
                }
                // 最后将文件夹压缩封装为mdz文件
                const makeMdzResult = await window.fileManPreload.compressToMdz(
                    dirPath,
                    pureFileName,
                    password
                );
                if (!makeMdzResult.success) {
                    return;
                }
                // 封装完成后，修改store内tab数据，完成页面更新，
                // 并往sqlite历史记录表里写入一条记录
                applySaveAsTabInfo(pageInfo, pureFileName, ext, dirPath, password !== "", password);
                const sqlResult = await addRecentOpenedHistory(dirPath, `${pureFileName}.mdz`);
                if (sqlResult.success) {
                    ameLifecycleManStore.hideLoading();
                    this.changeFileStoreData(true);
                } else {
                    console.error(sqlResult.message);
                    ameLifecycleManStore.hideLoading();
                    this.changeFileStoreData(true);
                    return 0;
                }
            } catch (e) {
                console.error(e);
                ameLifecycleManStore.hideLoading();
                tipFail(e);
                return 0;
            }
        },

        // mdz另存为纯文本：把mdz内媒体解压到同名.media_dir目录并改写媒体路径
        async extractMdzToMediaDirAction({pageInfo, monacoEditorModel}, planSaveFileInfo, source) {
            const ameLifecycleManStore = useAmeLifecycleManStore();
            const [pureFileName, ext, dirPath] = planSaveFileInfo;
            try {
                const result = await window.fileManPreload.makeMdMediaDirectory(dirPath, pureFileName);
                if (!result.success) {
                    console.error(result.message);
                    ameLifecycleManStore.hideLoading();
                    tipFail(result.message);
                    this.changeFileStoreData(true);
                    return 0;
                }
                this.changeFileStoreData(false);
                const editsCopies = await getMdzMediaPathToDirectPathEdits(
                    monacoEditorModel,
                    source.purePath,
                    source.pureFileName,
                    dirPath,
                    pureFileName
                );
                // mdz文件夹结构创建成功后，开始拷贝多媒体文件至mdz文件夹结构
                const copyResult = await copyMediaFiles(editsCopies);
                if (!copyResult.success) {
                    console.error(copyResult.message);
                    ameLifecycleManStore.hideLoading();
                    tipFail('保存失败！');
                    this.changeFileStoreData(true);
                    return 0;
                }
                // 拷贝多媒体文件至mdz文件夹完成后，执行monaco editor edit序列操作
                await applyMediaEdits(monacoEditorModel, editsCopies);
                // edit序列执行完成后，将Model的内容保存至保存目录
                // 注意：此处沿用原实现，未检查写入结果
                await window.fileManPreload.saveFileContent(
                    dirPath,
                    pureFileName,
                    monacoEditorModel.getValue(),
                    ext
                );
                // 保存完成后，修改store内tab数据，完成页面更新，
                // 并往sqlite历史记录表里写入一条记录
                applySaveAsTabInfo(pageInfo, pureFileName, ext, dirPath, false, "");
                const sqlResult = await addRecentOpenedHistory(dirPath, `${pureFileName}.${ext}`);
                if (sqlResult.success) {
                    ameLifecycleManStore.hideLoading();
                    this.changeFileStoreData(true);
                } else {
                    console.error(sqlResult.message);
                    ameLifecycleManStore.hideLoading();
                    this.changeFileStoreData(true);
                    return 0;
                }
            } catch (e) {
                console.error(e);
                ameLifecycleManStore.hideLoading();
                tipFail(e);
                return 0;
            }
        },
    },
});
