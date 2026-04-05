import {ipcMain, shell} from "electron";
import { SqliteManMemory } from "../sqlite-man/memory";
import { SqliteManStorage } from "../sqlite-man/storage";
import path from "path";
import fs from "fs";

const docRootPath = path.join(__dirname, "..", "..", "document");

export const ipc = (memoryConnection, storageConnection) => {
    const sqliteManMemory = new SqliteManMemory(memoryConnection);
    const sqliteManStorage = new SqliteManStorage(storageConnection);

    ipcMain.on("new-page", (event, pageId, isNewFile) => {
        if (isNewFile) {

        } else {

        }
    });

    ipcMain.on("undo", (event, pageId) => {

    });

    ipcMain.on("save-file", (event, pageId, savePath) => {

    });

    ipcMain.on("open-file", (event, pageId, openFilePath) => {

    });

    ipcMain.handle("doc-loader", (event, fileName) => {
        const filePath = docRootPath + path.sep + fileName + '.md';
        return fs.readFileSync(filePath, 'utf8');
    });

    ipcMain.on('open-url', (event, url) => {
        shell.openExternal(url);
    });
};
