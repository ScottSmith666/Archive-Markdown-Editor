"use strict";

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

    ipcMain.handle('load-storage-settings', async (event, instruction) => {
        /**
         * 从硬盘上的本地Sqlite数据库读取settings
         */
        const settingsConfigManager = new SqliteMan.SettingsConfigManager();
        return Number(settingsConfigManager.getSettings(instruction));
    });

    ipcMain.handle('load-memory-settings', async (event, instruction, query) => {
        /**
         * 从内存上的本地Sqlite数据库读取settings（query = true时返回第一个结果，query为false时返回总记录条数）
         */
        const settingsMemoryConfigManager = new SqliteMan.SettingsConfigManager(true);
        return Number(settingsMemoryConfigManager.getSettings(instruction, query));
    });

    ipcMain.on('set-storage-settings', (event, instruction, value) => {
        /**
         * 修改硬盘上的本地Sqlite数据库settings
         */
        const settingsConfigManager = new SqliteMan.SettingsConfigManager();
        settingsConfigManager.setSettings(instruction, value);
    });

    ipcMain.on('set-memory-settings', (event, instruction, value, type) => {
        /**
         * 修改内存上的本地Sqlite数据库settings
         */
        const settingsMemoryConfigManager = new SqliteMan.SettingsConfigManager(true);
        settingsMemoryConfigManager.setSettings(instruction, value, type);
    });

    ipcMain.handle('memory-sqlite-table-init', async (event) => {
        const settingsMemoryConfigManager = new SqliteMan.SettingsConfigManager(true);
        settingsMemoryConfigManager.initSettingsConfig();
        return 0;
    });

    ipcMain.handle('memory-sqlite-table-delete', async (event) => {
        const settingsMemoryConfigManager = new SqliteMan.SettingsConfigManager(true);
        settingsMemoryConfigManager.deleteSettingsConfig();
        return 0;
    });

    ipcMain.handle('memory-settings-inst-exists', async (event, inst) => {
        const settingsMemoryConfigManager = new SqliteMan.SettingsConfigManager(true);
        settingsMemoryConfigManager.settingsInstructionsIsExists(inst);
        return settingsMemoryConfigManager.deleteSettingsConfig();
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
