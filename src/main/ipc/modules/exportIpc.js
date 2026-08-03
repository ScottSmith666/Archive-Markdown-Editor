import {ipcMain} from "electron";
import os from "os";
import path from "path";

export const exportIpc = (dialogs) => {
    ipcMain.handle("get-export-name-and-folder", (event, type, title, failed) => {
        let savePath = dialogs.saveMediaDialog(
            title,
            (os.homedir() + path.sep + `export.${type}`),
            true
        );  // 获得打开的文件路径
        if (savePath) {
            return {"success": true, "message": savePath};
        } else {
            return {"success": false, "message": failed};
        }
    });
};
