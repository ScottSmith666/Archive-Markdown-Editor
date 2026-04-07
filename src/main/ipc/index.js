import {ipcMain, shell, dialog} from "electron";
import {SqliteMan} from "../sqlite-man";
import {Dialogs} from "../dialogs";
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

const dialogs = new Dialogs();

export const ipc = (sqliteConnection) => {
    const sqliteMan = new SqliteMan(sqliteConnection);

    ipcMain.handle("activate-open-file-dialog", (event) => {
        // 打开“选择打开文件”的操作系统组件，以向渲染端（前端）返回计划打开的文件路径
        let filePath = dialogs.openFileDialog('打开文件');  // 获得打开的文件路径
        if (!filePath) {
            // 用户中途取消打开文件，直接关闭了openFileDialog
            return {'success': false, 'message': '用户已取消打开文件'};
        }
        return {'success': true, 'filePath': filePath};
    });

    ipcMain.handle("activate-save-file-dialog", (event) => {
        // 打开“选择保存文件到某地”的操作系统组件，以向渲染端（前端）返回计划保存的文件路径
    });

    ipcMain.handle("load-file-content", async (event, filePath) => {
        // 根据渲染端传过来的filePath，异步加载文件内容
        // 这里要判断文件类型了，到底是txt、md还是mdz
        let fileName = filePath.split(path.sep).pop();
        let extensionTail = fileName.split(".").pop();
        if (extensionTail === 'md' || extensionTail === 'txt') {
            // 直接读取文件就行
            try {
                let fileContent = await fs.promises.readFile(filePath, 'utf8');
                return {success: true, content: fileContent, name: fileName, path: filePath};
            } catch (e) {
                return {success: false, message: (e.name + ": " + e.message)};
            }
        } else if (extensionTail === 'mdz') {
            // 不能直接读取，需要经历解压等步骤拿到真正的文件路径
            return {success: true, content: ''};
        } else {
            return {success: false, message: "不支持打开这种类型的文件！"};
        }
    });

    ipcMain.handle("save-file-content", async (event, filePath) => {

    });

    ipcMain.handle("doc-loader", async (event, fileName) => {
        const filePath = docRootPath + path.sep + fileName + '.md';
        try {
            let docContent = await fs.promises.readFile(filePath, 'utf8');
            return {success: true, content: docContent, root: docRootPath + path.sep + 'media'};
        } catch (e) {
            return {success: false, message: (e.name + ": " + e.message)};
        }
    });

    ipcMain.on('open-url', (event, url) => {
        shell.openExternal(url);
    });
};
