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
    return windowsObject.mainWindow();
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

// 当应用启动前双击文件时，app.on("open-file")会比app.whenReady()先运行，就会产生bug打不开文件
// 因此设置了这个全局变量，以备储存打开文件的路径
let beforeRunFileInfo = false;
let isExecutedInOpenFile = false;

let firstOpenedMainWinID = 0;

if (process.platform === 'darwin') {
    app.on("open-file", (event, filePath) => {
        beforeRunFileInfo = filePath;
        event.preventDefault();
        try {
            createWorkSpaceWindow(filePath);
            setTimeout(() => {
                console.log(`First ID - ${firstOpenedMainWinID}`);
                if (BrowserWindow.fromId(firstOpenedMainWinID)) BrowserWindow.fromId(firstOpenedMainWinID).close();
                isExecutedInOpenFile = true;
            }, 500);
        } catch (e) {}
    });
}

app.whenReady().then(() => {
    settingsConfigManager.initSettingsConfig();  // 初始化配置
    settingsConfigManager.deleteInstantHistoryRecords("", true);  // 初始化打开历史记录
    Menu.setApplicationMenu(menu);  //主进程设置应用菜单

    // 如果是命令行参数指定文件路径（仅支持绝对路径），则直接打开WorkSpace Window
    // --direct-open-file=/path/to/file.md(z)
    let args = process.argv;
    let pathArg = false;
    for (let i = 0; i < args.length; i++) {
        let arg = args[i];
        if (arg.indexOf("--direct-open-file=") !== -1) {
            pathArg = arg.replace("--direct-open-file=", "");
            break;
        }
    }
    if (pathArg) createWorkSpaceWindow(pathArg);
    else if (pathArg === false) {
        if (BrowserWindow.getAllWindows().length === 0) firstOpenedMainWinID = createMainWindow().id;
    }

    if (process.platform === 'darwin') {
        if (beforeRunFileInfo !== false && !isExecutedInOpenFile) {
            createWorkSpaceWindow(beforeRunFileInfo);
            if (BrowserWindow.fromId(firstOpenedMainWinID)) BrowserWindow.fromId(firstOpenedMainWinID).close();
        }
    }

    // 加载通用ipc
    let commonIpc = new CommonIpc();
    commonIpc.commonIpcMain(createWorkSpaceWindow);

    app.on('will-quit', () => {
        settingsConfigManager.deleteInstantHistoryRecords("", true);
    });
});

app.on('window-all-closed', () => {
    firstOpenedMainWinID = createMainWindow().id;
    console.log(`Empty ID - ${firstOpenedMainWinID}`);
});
