"use strict";

const { app, BrowserWindow, Menu } = require("electron");
const Windows = require("./multi-windows/windows");
const ForWorkIpcMain = require("./ipc-mains/forwork");
const CommonIpc = require("./ipc-mains/commonipc");
const GlobalMenu = require("./menu/menu");
const SqliteMan = require("./libs/sqliteman");


let menuObj = new GlobalMenu();  // 创建菜单对象
let template = menuObj.menuSimple;  // 从对象引入菜单模版
const menu = Menu.buildFromTemplate(template);  //载入模板
const settingsConfigManager = new SqliteMan.SettingsConfigManager();

const createMainWindow = () => {
    /**
     * 创建主窗口（欢迎+新建）
     */
    let windowsObject = new Windows();
    windowsObject.mainWindow();
};

const createWorkSpaceWindow = (filePath = false) => {
    /**
     * 创建工作窗口（编辑器）
     */
    let windowsObject = new Windows();
    // 建立属于自己窗口的ipc通信
    let workWindow = windowsObject.workSpaceWindow(filePath);
    let forWorkIpcMain = new ForWorkIpcMain();
    forWorkIpcMain.workIpcMain(workWindow);
};

// 开始运行
app.whenReady().then(() => {
    settingsConfigManager.initSettingsConfig();  // 初始化配置
    settingsConfigManager.deleteInstantHistoryRecords("", true);  // 初始化打开历史记录
    Menu.setApplicationMenu(menu);  //主进程设置应用菜单
    createMainWindow();
    // 加载通用ipc
    let commonIpc = new CommonIpc();
    commonIpc.commonIpcMain(createWorkSpaceWindow);
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
    });

    app.on('will-quit', () => {
        settingsConfigManager.deleteInstantHistoryRecords("", true);
    });
});

app.on('window-all-closed', () => {
    createMainWindow();
});
