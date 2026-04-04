import { ipcMain } from "electron";
import { SqliteManMemory } from "../sqlite-man/memory";
import { SqliteManStorage } from "../sqlite-man/storage";

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
};
