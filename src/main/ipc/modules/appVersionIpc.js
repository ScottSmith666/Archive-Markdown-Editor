import {app, ipcMain} from "electron";

export const appVersionIpc = () => {
    ipcMain.handle('get-app-version', (event) => {
        return app.getVersion();
    });
};
