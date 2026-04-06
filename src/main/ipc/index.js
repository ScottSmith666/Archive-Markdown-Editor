import {ipcMain, shell} from "electron";
import {SqliteManMemory} from "../sqlite-man/memory";
import {SqliteManStorage} from "../sqlite-man/storage";
import {is} from "@electron-toolkit/utils";
import path from "path";
import fs from "fs";

let docRootPath;
if (is.dev) {
    // 在开发环境
    docRootPath = path.join(__dirname, "..", "..", "document");
} else {
    // 在生产环境
    const unpackedRoot = path.join(process.resourcesPath, 'app.asar.unpacked')
    docRootPath = path.join(
        unpackedRoot,
        `document`
    );
}

export const ipc = (memoryConnection, storageConnection) => {
    const sqliteManMemory = new SqliteManMemory(memoryConnection);
    const sqliteManStorage = new SqliteManStorage(storageConnection);

    ipcMain.on("save-file", (event, pageId, savePath) => {

    });

    ipcMain.on("open-file", (event, pageId, openFilePath) => {

    });

    ipcMain.handle("doc-loader", async (event, fileName) => {
        const filePath = docRootPath + path.sep + fileName + '.md';
        try {
            let docContent = await fs.promises.readFile(filePath, 'utf8');
            return { success: true, content: docContent, root: docRootPath + path.sep + 'media' };
        } catch (e) {
            return { success: false, error: (e.name + ": " + e.message) };
        }
    });

    ipcMain.on('open-url', (event, url) => {
        shell.openExternal(url);
    });
};
