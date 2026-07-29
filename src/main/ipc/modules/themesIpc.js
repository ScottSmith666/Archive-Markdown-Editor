import {app, ipcMain} from "electron";
import path from "path";
import os from "os";
import fs from "fs";

let themesDir = (process.platform === 'openharmony'
    ? path.join(app.getPath('appData'), ".ame_conf", "themes")  // 鸿蒙系统只能存在appData目录内，其他地方没有权限
    : path.join(os.homedir(), ".ame_conf", "themes"));  // 其它系统内，配置文件置于$HOME目录的.ame_conf隐藏文件夹内

let themeFilePath = (themeName, themeType) =>
    path.join(themesDir, `${themeType}-theme.${themeName}.${themeType === 'viewer' ? 'css' : 'json'}`);

export const themesIpc = () => {
    ipcMain.handle("get-viewer-theme", async (event, themeName) => {
        // 默认的主题是“default”
        try {
            return await fs.promises.readFile(themeFilePath(themeName, "viewer"), "utf8");
        } catch (e) {
            console.error(e);
            return await fs.promises.readFile(themeFilePath("default", "viewer"), "utf8");
        }
    });

    ipcMain.handle("get-all-theme-name", async (event, themeType) => {
        // themeType的值分为："viewer"和"editor"，分别对应：viewer-theme.xxx.css和editor-theme.xxx.json
        let fullFileList = fs.readdirSync(themesDir);
        return fullFileList.filter(file => {
            return file.startsWith(`${themeType}-theme.`);
        });
    });
};
