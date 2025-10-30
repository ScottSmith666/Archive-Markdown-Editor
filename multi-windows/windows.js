const { BrowserWindow, Menu, ipcMain} = require("electron");
const path = require("node:path");
const ConfirmDialog = require(path.join(__dirname, "..", "dialogs", "dialogs"));
const SqliteMan = require(path.join(__dirname, "..", "libs", "sqliteman"));
const querystring = require('querystring');
const process = require("node:process");
const GlobalVar = require(path.join(__dirname, "..", "libs", "globalvar"));  // 全局变量模块引入
const fs = require("fs");


let gVar = new GlobalVar();
const settingsConfigManager = new SqliteMan.SettingsConfigManager();

function Windows() {
    this.workSpaceWindow = (filePath) => {
        let saveStatusMap = {};
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
            icon: path.join(__dirname, "..", "assets", "app_icon", "tmp.iconset", "icon_256x256.png"),
            webPreferences: {
                preload: path.join(__dirname, '..', 'preload', 'preload-work.js'),
            },
            devTools: gVar.DEBUG,
        });
        let fileName;
        if (!filePath) {  // 传入空字符串使App以新建文件的方式打开窗口
            fileName = "";
            filePath = "";
        } else fileName = filePath.split(path.sep).pop();
        let encodedQuery = querystring.stringify({
            name: fileName,
            path: filePath,
        });
        // windowId：传递应用打开生命周期内窗口唯一ID，platform：传递系统类型，以便于处理文件路径，name：打开文件的文件名，path：打开文件的完整文件路径
        const url = `file://${ __dirname }/../ui/workspace.html?windowId=${win.id}&${encodedQuery}&platform=${process.platform}`;
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
        // 接收保存信号并存储至WeakMap
        ipcMain.handle('change-save-status' + win.id, (e, saveStatus) => {
            saveStatusMap[`Window_${ win.id }`] = saveStatus;
        });
        win.on('close', e => {  // 检测本窗口是否未保存
            e.preventDefault(); // 先阻止一下默认行为，不然直接关了，提示框只会闪一下
            if (saveStatusMap[`Window_${ win.id }`]) {  // 如果已保存，不弹框直接关闭窗口
                if (filePath !== '') {
                    if (filePath.split(".").pop() === "mdz") {
                        // 删除mdz临时文件夹
                        let originPathList = filePath.split(gVar.pathSep);
                        let oFileName = originPathList.pop();  // 去掉文件名
                        let oFileNameList = oFileName.split(".");
                        oFileNameList.pop();  // 去掉扩展名
                        let oFileNameRmExt = oFileNameList.join(".");
                        let oRoot = originPathList.join(gVar.pathSep);
                        fs.rmSync(oRoot + gVar.pathSep + "._mdz_content." + oFileNameRmExt, {recursive: true});
                    }
                    settingsConfigManager.deleteInstantHistoryRecords(filePath);  // 删除临时历史记录
                }
                win.destroy();
            } else {
                let warningConfirmDialogChosen = new ConfirmDialog();
                if (warningConfirmDialogChosen.confirm(
                    win,
                    "warning",
                    ["取消", "确定"],
                    1,
                    '确认关闭',
                    '您有项目未保存，如果直接关闭，当前进度将不会保存，确认要直接关闭吗？',
                    0
                )) {
                    if (filePath !== '') {
                        if (filePath.split(".").pop() === "mdz") {
                            // 删除mdz临时文件夹
                            let originPathList = filePath.split(gVar.pathSep);
                            let oFileName = originPathList.pop();  // 去掉文件名
                            let oFileNameList = oFileName.split(".");
                            oFileNameList.pop();  // 去掉扩展名
                            let oFileNameRmExt = oFileNameList.join(".");
                            let oRoot = originPathList.join(gVar.pathSep);
                            fs.rmSync(oRoot + gVar.pathSep + "._mdz_content." + oFileNameRmExt, {recursive: true});
                        }
                        settingsConfigManager.deleteInstantHistoryRecords(filePath);  // 删除临时历史记录
                    }
                    win.destroy();
                }
            }
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
                preload: path.join(__dirname, '..', 'preload', 'preload-main.js'),
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
