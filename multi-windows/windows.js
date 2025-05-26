const { BrowserWindow, Menu } = require("electron");
const path = require("node:path");
// 全局变量模块引入
const GlobalVar = require(path.join(__dirname, "../libs/globalvar"));

function Windows() {
    this.workSpaceWindow = () => {
        let gVar = new GlobalVar();
        let win = new BrowserWindow({  // 主窗口
            backgroundColor: '#ffffff',
            autoHideMenuBar: true,
            width: 1600,
            height: 1000,
            minWidth: 800,
            minHeight: 500,
            x: 0,
            y: 0,
            show: false,
            icon: path.join(__dirname, "../assets/app_icon/tmp.iconset/icon_256x256.png"),
            webPreferences: {
                preload: path.join(__dirname, '../preload/preload-work.js'),
            },
            devTools: gVar.DEBUG,
        });
        const url = `file://${ __dirname }/../ui/workspace.html?windowId=${win.id}`;  // 传递应用打开生命周期内窗口唯一ID
        win.loadURL(url);
        win.on('ready-to-show', function () {
            win.show();  // 初始化后再显示
        });
        if (gVar.DEBUG) win.webContents.openDevTools();  // 打开开发者工具
        win.on('closed', () => {
            // 当窗口被关闭时，将 mainWindow 设置为 null
            win = null;
        });
        return win;
    };
}

module.exports = Windows;
