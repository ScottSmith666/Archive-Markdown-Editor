import {app, protocol, net} from "electron";
import path from "path";
import {electronApp, optimizer, is} from "@electron-toolkit/utils";
import url from 'url';

let Sqlite3;
if (is.dev) {
    // 在开发环境
    Sqlite3 = require("sqlite3");
} else {
    // 在生产环境
    const unpackedRoot = path.join(process.resourcesPath, 'app.asar.unpacked')
    Sqlite3 = require(path.join(
        unpackedRoot,
        `node_modules${path.sep}sqlite3`)
    );
}

import {ipc} from "./ipc";
import {menu} from "./menu";
import {mainWindow} from "./window";

app.whenReady().then(() => {
    // 创建一个Sqlite memory连接
    const sqliteMemoryConnection = new Sqlite3.Database(":memory:");
    const sqliteStorageConnection = null;

    // menu();

    // Set app user model id for windows
    electronApp.setAppUserModelId("com.scottsmith.ame");

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on("browser-window-created", (_, window) => {
        optimizer.watchWindowShortcuts(window);
    });

    ipc(sqliteMemoryConnection, sqliteStorageConnection);

    mainWindow();

    (() => {
        // 测试Sqlite Memory
        // 写入和读取数据
        const editRecord = new Sqlite3.Database(":memory:");
        console.log(editRecord);
        console.log(editRecord.serialize);
        console.log(editRecord.run);
        editRecord.serialize(() => {
            editRecord.run("CREATE TABLE page (info TEXT);");
            const stmt = editRecord.prepare("INSERT INTO page VALUES (?)");
            stmt.run("TEST SUCCESSFUL!");

            editRecord.each("SELECT info FROM page;", (err, row) => {
                console.log("Sqlite memory内容：" + row.info);
            });
        });
    })();
});

app.on("window-all-closed", () => {
    app.quit();
});
