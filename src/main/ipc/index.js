const prompt = require('electron-prompt');
import {ipcMain, shell} from "electron";
import {SqliteMan} from "../sqlite-man";
import {Dialogs} from "../dialogs";
import {is} from "@electron-toolkit/utils";
import path from "path";
import fs from "fs";
import {rm} from 'fs/promises';

let mdzUtils;
let docRootPath;
if (is.dev) {
    // 在开发环境
    mdzUtils = require(path.join(__dirname, "..", "..", "libs", "napi_cpp", "mdz_utils"));
    docRootPath = path.join(__dirname, "..", "..", "document");
} else {
    // 在生产环境
    const unpackedRoot = path.join(process.resourcesPath, 'app.asar.unpacked');
    mdzUtils = require(path.join(unpackedRoot, "libs", "napi_cpp", "mdz_utils"));
    docRootPath = path.join(
        unpackedRoot,
        `document`
    );
}

const dialogs = new Dialogs();

export const ipc = (sqliteConnection) => {
    const sqliteMan = new SqliteMan(sqliteConnection);

    ipcMain.handle("activate-open-file-dialog", (event, title, content) => {
        // 打开“选择打开文件”的操作系统组件，以向渲染端（前端）返回计划打开的文件路径
        let filePath = dialogs.openFileDialog(title);  // 获得打开的文件路径
        if (!filePath) {
            // 用户中途取消打开文件，直接关闭了openFileDialog
            return {'success': false, 'message': content};
        }
        return {'success': true, 'filePath': filePath[0], 'fileName': filePath[0].split(path.sep).pop()};
    });

    ipcMain.handle("activate-save-file-dialog", (event) => {
        // 打开“选择保存文件到某地”的操作系统组件，以向渲染端（前端）返回计划保存的文件路径
    });

    ipcMain.handle("show-input-mdz-password-dialog", async (event, title, content) => {
        try {
            let userInputPassword = await prompt({
                title: title,
                label: content,
                value: '',
                inputAttrs: {
                    type: 'password',
                },
                type: 'input'
            });
            if (userInputPassword !== null) {
                return {"success": true, password: userInputPassword};
            } else {
                return {"success": false, message: "USER_PASSWORD_CANCELLED"};
            }
        } catch (e) {
            return {"success": false, message: `${e.name}: ${e.message}`};
        }
    });

    ipcMain.handle("load-encrypted-mdz-content", async (event, filePath, password) => {
        // 单独解压加密的mdz文件并获得其内容
        let filePathArray = filePath.split(path.sep);
        let fileName = filePathArray.pop();
        let fileNameArray = fileName.split(".");
        fileNameArray.pop();
        let pureFileName = fileNameArray.join(".");
        let realFilePathInMdz
            = path.join(filePathArray.join(path.sep), `._mdz_content.${pureFileName}`, "mdz_contents", `${pureFileName}.md`);

        // 解压加密mdz文件并读取文件内容
        try {
            let re = await mdzUtils.genOrDecompressMdz(filePath, filePathArray.join(path.sep), "decompress", "", password);
            let fileContent = await fs.promises.readFile(realFilePathInMdz, 'utf8');
            return {success: true, content: fileContent, name: fileName, path: filePath, encrypted: true};
        } catch (e) {
            // 如果判断出是解压密码错误，那就返回特殊字符串
            if (e.message.includes('A password is required but none was provided')
                || e.message.includes('wrong password')) {
                return {success: false, message: "WRONG_PASSWORD_ERROR"};
            }
            return {success: false, message: (e.name + ": " + e.message)};
        }
    });

    ipcMain.handle("load-file-content", async (event, filePath, content) => {
        // 根据渲染端传过来的filePath，异步加载文件内容
        // 这里要判断文件类型了，到底是txt、md还是mdz
        let filePathArray = filePath.split(path.sep);
        let fileName = filePathArray.pop();

        let fileNameArray = fileName.split(".");
        let extensionTail = fileNameArray.pop();
        let pureFileName = fileNameArray.join(".");
        if (extensionTail === 'md' || extensionTail === 'txt') {
            // 直接读取文件就行
            try {
                let fileContent = await fs.promises.readFile(filePath, 'utf8');
                return {success: true, content: fileContent, name: fileName, path: filePath, encrypted: false};
            } catch (e) {
                return {success: false, message: (e.name + ": " + e.message)};
            }
        } else if (extensionTail === 'mdz') {
            // 不能直接读取，需要经历解压等步骤拿到真正的md文件路径
            // 先判断mdz文件有没有密码
            if (mdzUtils.verifyMdzIsEncrypted(filePath).message) {
                // 如果存在密码
                return {success: false, message: "PASSWORD_REQUIRED", encMdzPath: filePath};  // 返回“PASSWORD_REQUIRED”用于前端判断弹出输入密码框
            }
            // mdz文件（以/path/to/test.mdz为例）打开后的文件结构：
            // ._mdz_content.test/    # 这里的文件夹名格式是："._mdz_content." + mdz文件名去掉ext
            //          |             # 在posix平台，开头为“.”的文件和文件夹本身不可见（除非设置显示隐藏项目）
            //          V             # win32平台需要额外运行命令：attrib +h /path/to/._mdz_content.test 以使文件夹不可见
            //    mdz_contents/       # 这里的文件夹固定为“mdz_contents”
            //     |         |
            //     V         V
            //  test.md  media_src/   # md文件名去掉ext == mdz文件名去掉ext，同级的文件夹固定为“media_src”
            //               |
            //               V
            // *.jpg, *.mp4, *.mp3... # 固定在mdz文件内的多媒体文件，在mdz格式下，![...](path)语句括号内的path格式为：$MDZ_MEDIA/多媒体文件名
            //                        # 渲染器会将其自动解释为：/path/to/._mdz_content.test/mdz_contents/media_src/多媒体文件名
            // 因此/path/to/test.mdz文件的实际文件路径是：/path/to/._mdz_content.test/mdz_contents/test.md
            let realFilePathInMdz
                = path.join(filePathArray.join(path.sep), `._mdz_content.${pureFileName}`, "mdz_contents", `${pureFileName}.md`);

            // 解压mdz文件并读取文件内容
            try {
                await mdzUtils.genOrDecompressMdz(filePath, filePathArray.join(path.sep), "decompress", "", "");
                let fileContent = await fs.promises.readFile(realFilePathInMdz, 'utf8');
                return {success: true, content: fileContent, name: fileName, path: filePath, encrypted: false};
            } catch (e) {
                return {success: false, message: (e.name + ": " + e.message)};
            }
        } else {
            return {success: false, message: content};
        }
    });

    ipcMain.handle('clean-mdz-folder', async (event, cleanPath) => {
        try {
            await rm(cleanPath, {recursive: true, force: true});
            return {"success": true, "message": "清理成功"};
        } catch (err) {
            return {"success": false, "message": "清理失败"};
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
