const {app, ipcMain, shell} = require("electron");
const path = require("node:path");
const GlobalVar = require(path.join(__dirname, "../libs/globalvar"));
const LanguageLocale = require(path.join(__dirname, "../libs/languages"));


const gVar = new GlobalVar();

function CommonIpc() {
    this.commonIpcMain = (workWindow) => {
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
            workWindow();
        });
    };
}

module.exports = CommonIpc;
