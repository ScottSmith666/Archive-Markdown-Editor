"use strict";

const { app, BrowserWindow, Menu } = require("electron");
const Windows = require("./multi-windows/windows");
const ForMainIpcMain = require("./ipc-mains/formain");
const GlobalMenu = require("./menu/menu");


let win = null, aboutWin = null, settingsWin = null;
let mainWindow = null, newFileWindow = null;
const createWindow = () => {
    // 渲染主窗口
    let windowsObject = new Windows();
    mainWindow = windowsObject.mainWindow(win);
    // 创建菜单对象
    let menuObj = new GlobalMenu(mainWindow, aboutWin, settingsWin);
    // 从对象引入菜单模版
    let template = menuObj.menuSimple;
    //载入模板
    const menu = Menu.buildFromTemplate(template);
    //主进程设置应用菜单
    Menu.setApplicationMenu(menu);
};

// 开始运行
app.whenReady().then(() => {
    createWindow();

    let forMainIpcMain = new ForMainIpcMain();
    forMainIpcMain.mainIpcMain(mainWindow);
    app.on("activate", () => {
        console.log(BrowserWindow.getAllWindows());
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
