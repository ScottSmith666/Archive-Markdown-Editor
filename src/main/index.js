import {app, protocol, net, dialog} from "electron";
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
    const sqliteConnection = new Sqlite3(path.join(settings_dir_path, "ame.sqlite"));

    menu();

    // Set app user model id for windows
    electronApp.setAppUserModelId("com.scottsmith.ame");

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on("browser-window-created", (_, window) => {
        optimizer.watchWindowShortcuts(window);
    });

    ipc(sqliteConnection);

    mainWindow();
});

app.on("window-all-closed", () => {
    app.quit();
});
