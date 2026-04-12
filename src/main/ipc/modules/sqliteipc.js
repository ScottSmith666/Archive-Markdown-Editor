import {SqliteMan} from "../../sqlite-man";
import {ipcMain} from "electron";

export const sqliteIpc = (Sqlite3, dbPath) => {
    const sqliteMan = new SqliteMan(Sqlite3, dbPath);
    ipcMain.handle("get-recent-opened-history", (event) => {
        // 获取曾经打开的文件的历史记录
        return sqliteMan.getAllHistories();
    });

    ipcMain.handle("set-recent-opened-history", (event, fileName, filePath, openTime) => {
        // 写入一条历史记录
        let hsId = crypto.randomUUID();
        sqliteMan.setHistory(hsId, fileName, filePath, openTime);
        return {'success': true, 'message': '写入成功'};
    });

    ipcMain.handle("delete-recent-opened-history", (event, hsId) => {
        // 删除曾经打开的文件的历史记录
        // hsId如果是一条uuid，则删除对应的一条history
        // 但如果是“ALL”，则删除所有的histories
        if (hsId === 'ALL') {
            sqliteMan.deleteAllHistories();
        } else {
            sqliteMan.deleteHistory(hsId);
        }
        return {'success': true, 'message': '删除成功'};
    });
};
