const { BrowserWindow, Menu } = require("electron");
const path = require("node:path");
const querystring = require('querystring');
const process = require("node:process");


// 全局变量模块引入
const GlobalVar = require(path.join(__dirname, "../libs/globalvar"));
let gVar = new GlobalVar();

function Windows() {
    this.workSpaceWindow = (filePath) => {
        let win = new BrowserWindow({  // 工作窗口
            backgroundColor: '#ffffff',
            autoHideMenuBar: true,
            width: 1600,
            height: 1000,
            minWidth: 800,
            minHeight: 660,
            x: 0,
            y: 0,
            show: false,
            icon: path.join(__dirname, "../assets/app_icon/tmp.iconset/icon_256x256.png"),
            webPreferences: {
                preload: path.join(__dirname, '../preload/preload-work.js'),
            },
            devTools: gVar.DEBUG,
        });
        let fileName;
        if (!filePath) {  // 传入“NEW_FILE”字符串使App以新建文件的方式打开窗口，注意不要让用户将文件重命名为“NEW_FILE”
            fileName = `NEW_FILE`;
            filePath = "NO_PATH";
        } else fileName = filePath.split(path.sep).pop();
        let encodedQuery = querystring.stringify({
            name: fileName,
            path: filePath,
        });
        const url = `file://${ __dirname }/../ui/workspace.html?windowId=${win.id}&${encodedQuery}&platform=${process.platform}`;  // windowId：传递应用打开生命周期内窗口唯一ID，platform：传递系统类型，以便于处理文件路径
        win.loadURL(url);
        win.on('ready-to-show', function () {
            win.center();
            win.show();  // 初始化后再显示
        });
        if (gVar.DEBUG) win.webContents.openDevTools();  // 打开开发者工具
        win.on('closed', () => {
            // 当窗口被关闭时，将 mainWindow 设置为 null
            win = null;
        });
        return win;
    };

    this.mainWindow = () => {
        let win = new BrowserWindow({  // 主窗口
            backgroundColor: '#ffffff',
            autoHideMenuBar: true,
            width: 800,
            height: 500,
            x: 0,
            y: 0,
            show: false,
            resizable: false,
            webPreferences: {
                preload: path.join(__dirname, '../preload/preload-main.js'),
            },
            devTools: gVar.DEBUG,
        });
        const url = `file://${ __dirname }/../index.html?windowId=${win.id}`;
        win.loadURL(url);
        win.on('ready-to-show', function () {
            win.center();
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
