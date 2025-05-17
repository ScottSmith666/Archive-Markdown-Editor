const { app, BrowserWindow, ipcMain, Menu, Tray, shell, nativeImage } = require("electron");
const path = require("node:path");

// 全局变量模块引入
const GlobalVar = require("./libs/globalvar");
// 全局菜单引入
const GlobalMenu = require("./menu");
const SqliteMan = require("./libs/sqliteman");
const LanguageLocale = require("./libs/languages");


// function traySettings() {
//     appIcon = new Tray(path.join(__dirname, "./assets/app_icon/tmp.iconset/icon_16x16.png"));
//     const contextMenu = Menu.buildFromTemplate([
//         { label: 'Item1', type: 'radio' },
//         { label: 'Item2', type: 'radio' }
//     ]);
//     // Make a change to the context menu
//     contextMenu.items[1].checked = false;
//     // Call this again for Linux because we modified the context menu
//     appIcon.setContextMenu(contextMenu);
// }

// 建立全局变量模块对象
let gVar = new GlobalVar();
let win = null, aboutWin = null, settingsWin = null;
const createWindow = () => {
    win = new BrowserWindow({  // 主窗口
        backgroundColor: '#ffffff',
        width: 1600,
        height: 1000,
        minWidth: 800,
        minHeight: 500,
        x: 0,
        y: 0,
        show: false,
        icon: path.join(__dirname, "./assets/app_icon/tmp.iconset/icon_256x256.png"),
        webPreferences: {
            preload: path.join(__dirname, 'preload/preload.js'),
        },
        devTools: gVar.DEBUG,
    });
    win.loadFile("index.html");
    win.on('ready-to-show', function () {
        win.show();  // 初始化后再显示
    });

    if (gVar.DEBUG) win.webContents.openDevTools();  // 打开开发者工具
    win.on('closed', () => {
        // 当窗口被关闭时，将 mainWindow 设置为 null
        win = null;
    });

    // 创建菜单对象
    let menuObj = new GlobalMenu(win, aboutWin, settingsWin);
    // 从对象引入菜单模版
    let template = menuObj.menu;
    //载入模板
    const menu = Menu.buildFromTemplate(template);
    //主进程设置应用菜单
    Menu.setApplicationMenu(menu);
};

// 开始运行
app.whenReady().then(() => {
    // traySettings();

    ipcMain.handle('load-lang', async (event) => {
        /**
         * 在这里加载并渲染index语言
         * @type {LanguageConfigManager}
         */
        const languageConfigManagerObject = new SqliteMan.LanguageConfigManager();
        let appLangObj = new LanguageLocale();
        return [
            appLangObj.operationsInstructions().display.index,
            Number(languageConfigManagerObject.loadLangConfig()),
        ];
    });

    ipcMain.handle('load-lang-for-about-dialog', async (event) => {
        /**
         * 在这里加载并渲染about dialog语言
         */
        const languageConfigManagerObject = new SqliteMan.LanguageConfigManager();
        let appLangObj = new LanguageLocale();
        return [
            appLangObj.operationsInstructions().menu.aboutDialog,
            Number(languageConfigManagerObject.loadLangConfig()),
        ];
    });

    ipcMain.handle('switch-debug', async (event) => {
        /**
         * 开启/关闭DEBUG选项，便于调试
         */
        return gVar.DEBUG;
    });

    // 通过默认浏览器打开外部链接
    ipcMain.on('open-url', (event, url) => {
        shell.openExternal(url);
    });

    createWindow();
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
