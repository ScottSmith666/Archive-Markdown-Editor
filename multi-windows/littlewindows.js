const {BrowserWindow} = require("electron");
const path = require("node:path");
const GlobalVar = require(path.join(__dirname, '../libs/globalvar'));

function LittleWindows() {
    let gVar = new GlobalVar();
    this.aboutPage = (parentWindow, aboutWindow) => {
        if (!aboutWindow) {  // 判断“关于”窗口是否已打开，防止重复打开同一个窗口
            aboutWindow = new BrowserWindow({  // 创建“关于”窗口对象
                backgroundColor: '#ffffff',
                width: 630,
                height: 620,
                frame: false,  // 无边框
                resizable: false,  // 不可调节大小
                parent: parentWindow,
                show: false,
                webPreferences: {
                    preload: path.join(__dirname, '../preload/preload-about.js'),
                },
                devTools: gVar.DEBUG,
            });
            aboutWindow.loadFile(path.join(__dirname, '../ui/about.html'));
            aboutWindow.on('ready-to-show', function () {
                aboutWindow.show();  // 初始化后再显示
            });
            aboutWindow.setAlwaysOnTop(true, 'screen-saver');
            if (gVar.DEBUG) aboutWindow.webContents.openDevTools();  // 打开开发者工具
            aboutWindow.on('closed', () => {
                // 当窗口被关闭时，将 aboutWin 设置为 null
                aboutWindow = null;
            });
        } else {
            aboutWindow.show();
        }

        return aboutWindow;
    };

    this.settingsPage = (parentWindow, settingsWindow) => {
        if (!settingsWindow) {  // 判断“关于”窗口是否已打开，防止重复打开同一个窗口
            settingsWindow = new BrowserWindow({  // 创建“关于”窗口对象
                backgroundColor: '#ffffff',
                width: 630,
                height: 470,
                frame: false,  // 无边框
                resizable: false,  // 不可调节大小
                parent: parentWindow,
                show: false,
                webPreferences: {
                    preload: path.join(__dirname, '../preload/preload-settings.js'),
                },
                devTools: gVar.DEBUG,
            });
            settingsWindow.loadFile(path.join(__dirname, '../ui/settings.html'));
            settingsWindow.on('ready-to-show', function () {
                settingsWindow.show();  // 初始化后再显示
            });
            settingsWindow.setAlwaysOnTop(true, 'screen-saver');
            if (gVar.DEBUG) settingsWindow.webContents.openDevTools();  // 打开开发者工具
            settingsWindow.on('closed', () => {
                // 当窗口被关闭时，将 aboutWin 设置为 null
                settingsWindow = null;
            });
        } else {
            settingsWindow.show();
        }

        return settingsWindow;
    };
}

module.exports = LittleWindows;
