import {app, dialog} from "electron";
import path from "path";
import {electronApp, optimizer, is} from "@electron-toolkit/utils";

let Sqlite3;
if (is.dev) {
    // 在开发环境
    Sqlite3 = require("better-sqlite3");
} else {
    // 在生产环境
    const unpackedRoot = path.join(process.resourcesPath, 'app.asar.unpacked');
    Sqlite3 = require(path.join(
        unpackedRoot,
        `node_modules${path.sep}better-sqlite3`)
    );
}

import {ipc} from "./ipc";
import {menu} from "./menu";
import {mainWindow} from "./window";
import os from "os";
import fs from "fs";

let main;
// 当应用启动前双击文件时，app.on("open-file")会比app.whenReady()先运行
// 因此设置了这个全局变量，以备储存打开文件的路径
let globalFilePath;
if (process.platform === 'darwin') {
    // macOS平台双击文件类型打开默认应用
    app.on("open-file", (event, filePath) => {
        event.preventDefault();
        if (main && main.webContents) {
            // 如果窗口准备就绪，就发送打开文件信号
            // 针对热启动
            main.webContents.send("default-open-file", filePath);
        } else {
            // 当应用启动前（即冷启动）双击文件时，app.on("open-file")会比app.whenReady()先运行
            // 因此先把文件路径存进一个全局变量
            globalFilePath = filePath;
        }
    });
}

app.whenReady().then(() => {
    // 创建一个Sqlite连接
    let settings_dir_path = path.join(os.homedir(), ".ame_conf");  // 配置文件置于$HOME目录的.ame_conf隐藏文件夹内
    try {
        const stats = fs.statSync(settings_dir_path);
        if (!stats.isDirectory()) {  // 确认路径存在，但不是文件夹
            dialog.showMessageBox({
                type: 'error',  // 图标类型: info, error, question, none
                title: 'AME启动出错',
                message: `路径“${ os.homedir() }”内有“.ame_conf”文件残留，请将它删除，否则AME无法启动！`, // 主内容
                buttons: ['退出AME'] // 按钮文字数组
            }).then(result => {
                if (result.response === 0) {
                    app.quit();
                }
            });
        }
    } catch (e) {  // 没有该路径，就创建文件夹
        fs.mkdirSync(settings_dir_path, { recursive: true });
    }

    menu();

    // Set app user model id for windows
    electronApp.setAppUserModelId("com.scottsmith.ame");

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on("browser-window-created", (_, window) => {
        optimizer.watchWindowShortcuts(window);
    });

    ipc(Sqlite3, path.join(settings_dir_path, "ame.sqlite"));

    // 命令行参数指定文件路径（仅支持绝对路径）打开文件
    // 也是设置Windows和Linux默认打开的方法
    // --direct-open-file=/path/to/file.md(z)
    let args = process.argv;
    for (let i = 0; i < args.length; i++) {
        let arg = args[i];
        if (arg.indexOf("--direct-open-file=") !== -1) {
            // 将获得的路径传入全局变量
            globalFilePath = arg.replace("--direct-open-file=", "");
            break;
        }
    }

    main = mainWindow();
    // 针对冷启动打开文件
    main.webContents.on('did-finish-load', () => {
        if (globalFilePath) {
            main.webContents.send("default-open-file", globalFilePath);
            globalFilePath = null;
        }
    });
});

app.on("window-all-closed", () => {
    app.quit();
});
