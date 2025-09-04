const {app, ipcMain, shell} = require("electron");
const path = require("node:path");
const GlobalVar = require(path.join(__dirname, "../libs/globalvar"));
const SqliteMan = require(path.join(__dirname, "../libs/sqliteman"));
const LanguageLocale = require(path.join(__dirname, "../libs/languages"));
const RwMdz = require(path.join(__dirname, "../libs/rwmdz"));
const Dialogs = require(path.join(__dirname, "../dialogs/dialogs"));
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
            // 以打开exists文件的方式打开work窗口
            if (filePath) {
                workWindow(filePath[0]);
            }
        });
        ipcMain.on('open-file-from-path', (event, path) => {
            workWindow(path);
        });
        ipcMain.handle('load-file-content', (event, path, platform) => {
            /**
             * 加载文件内容
             */
            // 将打开的路径写入sqlite数据库

            // 加载普通Markdown文件
            if (path.split(".").pop() === "md") return fs.readFileSync(path, 'utf8');
            else if (path.split(".").pop() === "mdz") {  // 加载Archive Markdown File (mdz)
                let mdzCoreFilePath = rwMdz.readMdz(path, platform);
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

        });

        ipcMain.handle('custom-save-file', (event, content) => {
            /**
             * 保存新文件（即保存时弹出保存框选择路径保存）
             */
            let newFileName = "";
            let fullFilePath = "";
            return [newFileName, fullFilePath];
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
