import {ipcMain} from "electron";
import os from "os";
import path from "path";
import {copyOnHarmony} from "./common";
import {exportHtmlTemplate} from "../../themes/export_html_template";
import {defaultViewerTheme} from "../../themes/default-viewer-theme";
import {rootVars} from "../../themes/root_vars";
import fs from "fs";

const copyExport = process.platform === "openharmony"
    ? copyOnHarmony
    : fs.promises.copyFile;

export const exportIpc = (dialogs) => {
    ipcMain.handle("get-export-name-and-folder", (event, type, title, failed) => {
        let savePath = dialogs.saveMediaDialog(
            title,
            (os.homedir() + path.sep + `export.${type}`),
            true
        );  // 获得打开的文件路径
        if (savePath) {
            return {"success": true, "message": savePath.replaceAll("\\", "/")};
        } else {
            return {"success": false, "message": failed};
        }
    });

    ipcMain.handle("set-finished-export-files", async (
        event,
        copyPasteMediaPathArray,
        exportHtmlFullPath,
        exportHtmlMediaFolderPath,
        exportHtmlContent) => {
        try {
            if (copyPasteMediaPathArray.length !== 0) {
                await fs.promises.mkdir(exportHtmlMediaFolderPath);
                for (let i = 0; i < copyPasteMediaPathArray.length; i++) {
                    await copyExport(decodeURI(copyPasteMediaPathArray[i][0]), decodeURI(copyPasteMediaPathArray[i][1]));
                }
            }
            await fs.promises.writeFile(exportHtmlFullPath, exportHtmlTemplate(
                rootVars,
                defaultViewerTheme,
                exportHtmlContent
            ));
            return {"success": true};
        } catch (e) {
            console.log(e);
            return {"success": false, "message": e.name};
        }
    });
};
