const {app, ipcMain, shell, BrowserWindow} = require("electron");
const path = require("node:path");
const GlobalVar = require(path.join(__dirname, "..", "libs", "globalvar"));
const SqliteMan = require(path.join(__dirname, "..", "libs", "sqliteman"));
const LanguageLocale = require(path.join(__dirname, "..", "libs", "languages"));
const RwMdz = require(path.join(__dirname, "..", "libs", "rwmdz"));
const Dialogs = require(path.join(__dirname, "..", "dialogs", "dialogs"));
const fs = require("fs");


const gVar = new GlobalVar();
const rwMdz = new RwMdz();
const settingsConfigManager = new SqliteMan.SettingsConfigManager();


function CommonIpc() {
    this.commonIpcMain = (workWindow) => {
        ipcMain.on('quit', (event) => {
            /**
             * 退出整个应用
             */
            app.quit();
        });
        ipcMain.on('close-window', (event, windowId) => {
            /**
             * 关闭当前窗口
             */
            const readyDestroyedWindow = BrowserWindow.fromId(Number(windowId));
            readyDestroyedWindow.destroy();
        });
        ipcMain.on('reload-app', (event) => {
            /**
             * 重启整个应用
             */
            app.relaunch();
            app.quit();
        });
        ipcMain.handle('load-language-user-surface', async (event, part) => {
            /**
             * 载入用户语言界面
             */
            return new LanguageLocale().operationsInstructions()[part];
        });
        ipcMain.handle('switch-debug', async (event) => {
            /**
             * 开启/关闭DEBUG选项，便于调试
             */
            return gVar.DEBUG;
        });
        ipcMain.on('open-url', (event, url) => {
            /**
             * 通过默认浏览器打开外部链接
             * @type {any|string}
             */
            url = (url.includes("http://") || url.includes("https://") ? url : "https://" + url);  // 检测到不包括协议的URL，就加上协议
            shell.openExternal(url);
        });
        ipcMain.on('open-new', (event) => {
            /**
             * 打开新窗口
             */
            workWindow();
        });
        ipcMain.on('open-file', (event) => {
            const dialogs = new Dialogs();
            let filePath = dialogs.openFileDialog();  // 获得打开的文件路径
            console.log(filePath);
            // 以打开exists文件的方式打开work窗口
            if (filePath) workWindow(filePath[0]);
        });
        ipcMain.on('open-file-from-path', (event, path) => {
            workWindow(path);
        });
        ipcMain.handle('load-file-content', (event, path) => {
            /**
             * 加载文件内容
             */
            // 加载普通Markdown文件
            if (path.split(".").pop() === "md" || path.split(".").pop() === "txt")
                return fs.readFileSync(path, 'utf8');
            else if (path.split(".").pop() === "mdz") {  // 加载Archive Markdown File (mdz)
                let mdzCoreFilePath = rwMdz.readMdz(path);
                return fs.readFileSync(mdzCoreFilePath, 'utf8');
            }
        });
        ipcMain.handle('verify-file-was-opened', (event, path) => {
            /**
             * 检测对应path的文件是否已被打开，如已被打开则弹窗警告禁止再次打开
             * 返回true则说明文件已被打开
             */
            if (path) return settingsConfigManager.openHistoryIsExists(path);
            else return path;
        });
        ipcMain.handle('verify-file-is-exists', (event, path) => {
            /**
             * 检测对应path的文件是否存在
             * 返回true则说明文件已存在
             */
            return fs.existsSync(path);
        });
        ipcMain.handle('verify-file-name-is-valid', (event, path) => {
            /**
             * 检测对应path的文件名是否合法
             * 返回true则说明文件名合法
             */
            fileName = path.split(gVar.pathSep).pop();  // 获得文件名
            if (fileName.length > gVar.MaxFileNameLength) return false;  // 文件名长度如不符合要求直接返回false，不用验证非法字符
            let num = 0;
            for (let i = 0; i < gVar.ForbiddenChars.length; i++) {
                if (fileName.indexOf(gVar.ForbiddenChars[i]) !== -1) break;  // 如果检出非法字符，则num肯定不等于gVar.ForbiddenChars.length - 1
                num = i;
            }
            return (num === gVar.ForbiddenChars.length - 1);
        });
        ipcMain.handle('before-close-window', (event, path) => {
            /**
             * 关闭文件（窗口）之前删除sqlite中打开的路径
             */
            settingsConfigManager.deleteInstantHistoryRecords(path);
            return 0;
        });
        ipcMain.handle('auto-save-file', (event, content, fullFilePath) => {
            /**
             * 保存旧文件（即点击按钮或按下热键时直接按照之前的路径默认保存）
             */
            let extName = fileName.split(".").pop();
            if (extName === "mdz") {
                // 如果在内容中发现了绝对路径或相对路径，则改成mdz文件中特有的路径（多媒体路径$MDZ_MEDIA），并将多媒体收入mdz文件内

                // 内容写入
                fs.writeFileSync(fullFilePath, content, 'utf8');
                // 打包为mdz

            } else fs.writeFileSync(fullFilePath, content, 'utf8');
        });

        ipcMain.handle('custom-save-file', (event, content) => {
            /**
             * 保存新文件（即保存时弹出保存框选择路径保存）
             */
            // 弹出保存选择路径框
            const dialogs = new Dialogs();
            let isFileIncludeForbiddenChars = true;
            let isFileNameTooLong = true;
            let fileSaveAsPath = "";
            let fileName = "";
            let saveTitle = "保存文件";
            while (isFileIncludeForbiddenChars || isFileNameTooLong) {
                fileSaveAsPath = dialogs.saveFileDialog(saveTitle);  // 获得打开的文件路径
                // 如果取消保存，即保存失败，返回的路径则为undefined，那么就直接返回
                if (!fileSaveAsPath) return [undefined, undefined];
                fileName = fileSaveAsPath.split(gVar.pathSep).pop();  // 获得自定义保存的文件名
                // 验证文件名的合法性
                if (fileName.length > gVar.MaxFileNameLength) {  // 文件名长度如不符合要求直接跳进下一个循环，不用验证非法字符
                    saveTitle = "文件名太长，请重新修改！";
                    isFileNameTooLong = true;
                    continue;
                } else isFileNameTooLong = false;
                let num = 0;
                for (let i = 0; i < gVar.ForbiddenChars.length; i++) {
                    if (fileName.indexOf(gVar.ForbiddenChars[i]) !== -1) {
                        saveTitle = "文件名有非法字符，请重新修改！";
                        break;  // 如果检出非法字符，则num肯定不等于gVar.ForbiddenChars.length - 1
                    }
                    num = i;
                }
                if (num === gVar.ForbiddenChars.length - 1) isFileIncludeForbiddenChars = false;  // 如果文件名内未检出非法字符，则跳出while循环
            }
            // 接下来开始写入文件
            // 先判断保存文件类型：md、mdz和txt
            let extName = fileName.split(".").pop();
            if (extName === "mdz") {
                // 如果在内容中发现了绝对路径或相对路径，则改成mdz文件中特有的路径（多媒体路径$MDZ_MEDIA），并将多媒体收入mdz文件内

            } else if (extName === "md" || extName === "txt") {
                // 如果在内容中发现了mdz文件中特有的内容（多媒体路径$MDZ_MEDIA），则修改其中的路径，并将mdz文件中的多媒体放在保存目录的一个文件夹内
                // 先用正则表达式识别出多媒体Markdown代码
                fs.writeFileSync(fileSaveAsPath, 'fuck', 'utf8');
            }
            return [fileName, fileSaveAsPath];
        });

        ipcMain.handle('get-permanent-history', (event) => {
            return [settingsConfigManager.getAllPermanentHistoryRecords(), process.platform === 'win32' ? '\\' : '/'];
        });

        ipcMain.handle('delete-permanent-history', (event, path, all) => {
            if (!all) settingsConfigManager.deletePermanentHistoryRecords(path);
            else settingsConfigManager.deletePermanentHistoryRecords(path, all);
            return 0;
        });
    };
}

module.exports = CommonIpc;
