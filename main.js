"use strict";

const { app, BrowserWindow, ipcMain, Menu, Tray, shell, nativeImage } = require("electron");
const path = require("node:path");

// 全局变量模块引入
const GlobalVar = require("./libs/globalvar");
// 全局菜单引入
const GlobalMenu = require("./menu");
const SqliteMan = require("./libs/sqliteman");
const LanguageLocale = require("./libs/languages");
const ConfirmDialog = require("./dialogs");


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

    ipcMain.handle('settings-cancel-option', (event) => {
        /**
         * 点击“取消”时弹出确认关闭不保存设置弹框
         */
        win.focus();
        let warningConfirmDialogChosen = new ConfirmDialog(
                                                            win,
                                                            "warning",
                                                            ["不关闭", "关闭"],
                                                            1,
                                                            '设置未应用',
                                                            '您有设置未应用，要直接关闭“设置”窗口吗？如选择“关闭”，改动将不会应用。',
                                                            0
                                                        );
        return warningConfirmDialogChosen.confirm;  // 返回true则直接关闭设置对话框
    });

    ipcMain.handle('settings-confirm-option', (event, instructionList) => {
        /**
         * 点击“应用更改”时弹出确认应用设置弹框
         */
        win.focus();
        if (instructionList.length > 0) {  // 有更改的设置
            let warningConfirmDialogChosen = new ConfirmDialog(
                win,
                "warning",
                ["取消", "应用"],
                1,
                '确认应用',
                '您确定应用刚才更改的设置吗？如选择“应用”，程序将重新启动，请注意保存您的数据。',
                0
            );
            if (warningConfirmDialogChosen.confirm) {  // 返回true则应用重启应用设置
                let settingsConfigManager = new SqliteMan.SettingsConfigManager();
                // 写入sqlite
                for (let instruction of instructionList) {
                    settingsConfigManager.setSettings(
                        instruction.instructions,
                        instruction.settings_value,
                        settingsConfigManager.settingsInstructionsIsExists(instruction.instructions) ? "update" : "insert",
                    );
                }
                return true;
            }
        } else {  // 没有更改的设置，提示不需要应用
            new ConfirmDialog(
                win,
                "warning",
                ["确定"],
                1,
                '应用提示',
                '您未更改任何设置，无需进行应用。',
                0
            );
        }
        return false;
    });

    ipcMain.handle('settings-reset-option', (event) => {
        /**
         * 点击“重置”时弹出确认应用设置弹框
         */
        win.focus();
        let warningConfirmDialogChosen = new ConfirmDialog(
            win,
            "warning",
            ["取消", "重置"],
            1,
            '确认重置',
            '您确定重置本程序的所有设置吗？',
            0
        );
        if (warningConfirmDialogChosen.confirm) {  // 返回true则应用重置设置
            // 写入sqlite
            let settingsConfigManager = new SqliteMan.SettingsConfigManager();
            settingsConfigManager.deleteSettingsConfig();
            settingsConfigManager.initSettingsConfig();
            return true;
        }
        return false;
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
