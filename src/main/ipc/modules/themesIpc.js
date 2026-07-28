import {app, ipcMain} from "electron";
import path from "path";
import os from "os";
import fs from "fs";

export const themesIpc = () => {
    ipcMain.handle("get-viewer-theme", async (data) => {
        let viewerThemeFilePath = process.platform === 'openharmony'
            ? path.join(app.getPath('appData'), ".ame_conf", "themes", "viewer-theme.css")  // 鸿蒙系统只能存在appData目录内，其他地方没有权限
            : path.join(os.homedir(), ".ame_conf", "themes", "viewer-theme.css");  // 其它系统内，配置文件置于$HOME目录的.ame_conf隐藏文件夹内
        try {
            return await fs.promises.readFile(viewerThemeFilePath, "utf8");
        } catch (e) {
            return "";
        }
    });
};
