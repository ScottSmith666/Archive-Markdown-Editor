import {dialog, ipcMain, shell, app, clipboard} from "electron";
import {Dialogs} from "../dialogs";
import {is} from "@electron-toolkit/utils";
import path from "path";
import fs from "fs";
import {rm} from 'fs/promises';
import {sqliteIpc} from "./modules/sqliteipc.js";
import {SqliteMan} from "../sqlite-man";
import os from "os";

const util = require('util');
const exec = util.promisify(require('child_process').exec);

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

const setOpenedFileHistory = (sqliteMan, fileName, filePath, openTime) => {
    // 成功打开文件后，将一条记录写入sqlite，一条记录包括：文件名、文件路径和打开时间str
    let uuid = crypto.randomUUID();
    sqliteMan.setHistory(uuid, fileName, filePath, openTime);
};

const getNow = () => {
    const now = new Date();
    return now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false  // 使用24小时制
    }).replace(/\//g, '-');
};

export const ipc = (Sqlite3, dbPath) => {
    const sqliteMan = new SqliteMan(Sqlite3, dbPath);
    sqliteMan.init();  // 检查相关sqlite表是否存在，如不存在就新建

    ipcMain.handle("activate-open-file-dialog", (event, title, content) => {
        console.log(`[${title}] ${content}`);
        // 打开“选择打开文件”的操作系统组件，以向渲染端（前端）返回计划打开的文件路径
        let filePath = dialogs.openFileDialog(title);  // 获得打开的文件路径
        if (!filePath) {
            // 用户中途取消打开文件，直接关闭了openFileDialog
            return {'success': false, 'message': content};
        }
        return {
            'success': true,
            'filePath': filePath[0].replaceAll("\\", "/"),
            'fileName': filePath[0].replaceAll("\\", "/").split("/").pop()
        };
    });

    ipcMain.handle("activate-save-file-dialog", (event, title, btLabel) => {
        // 打开“选择保存文件到某地”的操作系统组件，以向渲染端（前端）返回计划保存的文件路径
        let filePath = dialogs.saveFileDialog(title, btLabel);  // 获得打开的文件路径
        if (!filePath) {
            // 用户中途取消打开文件，直接关闭了openFileDialog
            return {'success': false};
        }
        return {'success': true, 'savePath': filePath[0].replaceAll("\\", "/")};
    });

    ipcMain.handle("load-encrypted-mdz-content", async (event, filePath, password) => {
        // 单独解压加密的mdz文件并获得其内容
        let filePathArray = filePath.split("/");
        let fileName = filePathArray.pop();
        let fileNameArray = fileName.split(".");
        fileNameArray.pop();
        let pureFileName = fileNameArray.join(".");
        let realFilePathInMdz
            = path.join(filePathArray.join(path.sep), `._mdz_content.${pureFileName}`, "mdz_contents", `${pureFileName}.md`);
        let realDirPathInMdz = path.join(filePathArray.join(path.sep), `._mdz_content.${pureFileName}`);

        // 解压加密mdz文件并读取文件内容
        try {
            await mdzUtils.genOrDecompressMdz(filePath, filePathArray.join(path.sep), "decompress", "", password);
            if (process.platform === "win32") {
                // Windows平台运行 attrib +h X:/path/to/folder 命令隐藏文件夹
                await exec(`attrib +h "${realDirPathInMdz}"`);
            }
            let fileContent = await fs.promises.readFile(realFilePathInMdz, 'utf8');
            setOpenedFileHistory(sqliteMan, fileName, filePath, getNow());
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
        let filePathArray = filePath.split("/");
        let fileName = filePathArray.pop();

        let fileNameArray = fileName.split(".");
        let extensionTail = fileNameArray.pop();
        let pureFileName = fileNameArray.join(".");
        if (extensionTail === 'md' || extensionTail === 'txt') {
            // 直接读取文件就行
            try {
                let fileContent = await fs.promises.readFile(filePath, 'utf8');
                setOpenedFileHistory(sqliteMan, fileName, filePath, getNow());
                return {success: true, content: fileContent, name: fileName, path: filePath, encrypted: false};
            } catch (e) {
                return {success: false, message: (e.name + ": " + e.message)};
            }
        } else if (extensionTail === 'mdz') {
            // 不能直接读取，需要经历解压等步骤拿到真正的md文件路径
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
            let realDirPathInMdz = path.join(filePathArray.join(path.sep), `._mdz_content.${pureFileName}`);
            // 解压mdz文件并读取文件内容
            try {
                await mdzUtils.genOrDecompressMdz(filePath, filePathArray.join(path.sep), "decompress", "", "");
                if (process.platform === "win32") {
                    // Windows平台运行 attrib +h "X:/path/to/folder" 命令隐藏文件夹
                    await exec(`attrib +h "${realDirPathInMdz}"`);
                }
                let fileContent = await fs.promises.readFile(realFilePathInMdz, 'utf8');
                setOpenedFileHistory(sqliteMan, fileName, filePath, getNow());
                return {success: true, content: fileContent, name: fileName, path: filePath, encrypted: false};
            } catch (e) {
                if (e.message.includes('password is required but none was provided') ||
                    e.message.includes('wrong password')) {
                    return {success: false, message: "PASSWORD_REQUIRED", encMdzPath: filePath};  // 返回“PASSWORD_REQUIRED”用于前端判断弹出输入密码框
                }
                if (e.message.includes('No such file or directory')) {
                    return {success: false, message: "FILE_NOT_FOUND", encMdzPath: filePath};
                }
                return {success: false, message: (e.name + ": " + e.message)};
            }
        } else {
            return {success: false, message: content};
        }
    });

    ipcMain.handle("make-mdz-directory", async (event, purePath, pureFileName) => {
        try {
            await fs.promises.mkdir(purePath + path.sep + "._mdz_content." + pureFileName + path.sep
                + "mdz_contents" + path.sep + "media_src", {recursive: true});
            if (process.platform === "win32") {
                // Windows平台运行 attrib +h X:/path/to/folder 命令隐藏文件夹
                await exec(`attrib +h "${purePath + path.sep + "._mdz_content." + pureFileName}"`);
            }
            return {"success": true, "message": "创建文件夹成功"};
        } catch (e) {
            return {"success": false, message: `${e.name}: ${e.message}`};
        }
    });

    ipcMain.handle("make-md-media-directory", async (event, purePath, pureFileName) => {
        try {
            await fs.promises.mkdir(purePath + path.sep + pureFileName + ".media_dir", {recursive: true});
            return {"success": true, "message": "创建文件夹成功"};
        } catch (e) {
            return {"success": false, message: `${e.name}: ${e.message}`};
        }
    });

    ipcMain.handle("copy-mdz-media-files", async (event, filePathArray) => {
        for (let i = 0; i < filePathArray.length; i++) {
            console.log(`第${i + 1}个，共${filePathArray.length}个。${filePathArray[i][0]} -> ${filePathArray[i][1]}`);
            try {
                await fs.promises.copyFile(filePathArray[i][0], filePathArray[i][1]);
            } catch (e) {
                // 有时候用户写的Markdown文档中会发现找不到媒体文件，就跳过拷贝这个文件
                if (!e.message.includes('ENOENT: no such file or directory, copyfile')) {
                    return {"success": false, message: `${e.name}: ${e.message}`};
                }
            }
        }
        return {"success": true, "message": "拷贝媒体成功"};
    });

    ipcMain.handle('clean-mdz-folder', async (event, cleanPath) => {
        try {
            await rm(cleanPath, {recursive: true, force: true});
            return {"success": true, "message": "清理成功"};
        } catch (e) {
            return {"success": false, message: `${e.name}: ${e.message}`};
        }
    });

    ipcMain.handle("save-file-content", async (event, purePath, pureFileName, content, ext) => {
        console.log(ext);
        try {
            if (ext === "mdz") {
                await fs.promises.writeFile(purePath + path.sep + "._mdz_content." + pureFileName + path.sep
                    + "mdz_contents" + path.sep + pureFileName + ".md", content, 'utf8');
            } else if (ext === "md" || ext === "txt") {
                await fs.promises.writeFile(purePath + path.sep + pureFileName + `.${ext}`, content, 'utf8');
            }
            return {"success": true, "message": "写入文件成功"};
        } catch (e) {
            return {"success": false, message: `${e.name}: ${e.message}`};
        }
    });

    ipcMain.handle("compress-to-mdz", async (event, purePath, pureFileName, password) => {
        try {
            // 先删除原来的mdz包
            await rm(purePath + path.sep + pureFileName + ".mdz", {recursive: true, force: true});
            // 再压缩产生新的
            await mdzUtils.genOrDecompressMdz(
                purePath + path.sep + "._mdz_content." + pureFileName,
                purePath + path.sep + pureFileName + ".mdz",
                "compress",
                password,
                ""
            );
            return {"success": true, "message": "保存成功"};
        } catch (e) {
            return {"success": false, message: `${e.name}: ${e.message}`};
        }
    });

    ipcMain.on("save-file-in-mdz", async (event, title, filePath) => {
        // 打开“选择打开文件”的操作系统组件，以向渲染端（前端）返回计划打开的文件路径
        filePath = filePath.replace("file://", "");
        let fileName = filePath.split(path.sep).pop();
        let savePath = dialogs.saveMediaDialog(title, (os.homedir() + path.sep + fileName));  // 获得打开的文件路径
        if (savePath) {
            // 开始保存文件
            await fs.copyFile(filePath, savePath, (err) => {
                if (err) {
                    console.log(err);
                    dialog.showMessageBoxSync({
                        type: 'error',
                        message: '保存失败 Save failed!',
                        buttons: ['OK'],
                        defaultId: 0,
                    });
                    return console.error(err);
                }
                dialog.showMessageBoxSync({
                    type: 'info',
                    message: '保存成功 Save successfully!',
                    buttons: ['OK'],
                    defaultId: 0,
                });
            });
        } else {
            // 用户中途取消打开文件，直接关闭了saveFileDialog
            dialog.showMessageBoxSync({
                type: 'warning',
                message: '用户取消保存 User save canceled!',
                buttons: ['OK'],
                defaultId: 0,
            });
        }
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

    ipcMain.handle("media-paster", async (event) => {
        const formats = clipboard.availableFormats();
        let fileURLs, type;
        // 常见视频文件的扩展名
        const videoExts = ["mp4", "mov", "webm", "avi", "wmv", "flv", "mkv", "m4v", "mpeg", "ts"];
        // 常见音频文件的扩展名
        const audioExts = ["mp3", "wav", "flac", "ogg", "wma", "aac", "m4a"];
        // 常见图片文件的扩展名
        const imageExts = ["jpg", "jpeg", "tif", "tiff", "gif", "bmp", "svg", "png"];
        // 优先检查是否存在文件专用格式
        // 只要存在，说明最近一次操作绝对是“复制了文件”
        const isFile = formats.some(format =>
            format === 'FileNameW' ||        // Windows
            format === 'public.file-url' ||  // macOS
            format === 'text/uri-list'       // Linux
        );
        // 如果直接复制已有多媒体文件，则返回文件路径
        if (isFile) {
            if (process.platform === 'win32') {
                // 必须优先检查 FileNameW 格式
                // 注意：使用 readBuffer 并指定 ucs2 编码，以正确处理中文/特殊字符路径
                const buffer = clipboard.readBuffer('FileNameW');
                // Windows 剪贴板中的 MULTI_SZ 格式使用 UTF-16LE 编码 (ucs2)
                const raw = buffer.toString('ucs2').replaceAll("\\", "/");
                // 多个文件路径以 \0 分隔，结尾会有两个 \0，过滤掉空字符串即可
                fileURLs = raw.split('\0').filter(p => p.length > 0);
            } else if (process.platform === 'darwin') {
                const raw = clipboard.read('public.file-url');
                // macOS 复制多个文件时，路径通常以换行符 \n 分隔
                fileURLs = raw.split('\n')
                    .map(url => url.trim())
                    .filter(url => url.startsWith('file://'))
                    .map(url => {
                        // 去掉 file:// 前缀，并对特殊字符（如空格、中文）进行 URL 解码
                        return url.replace('file://', '');
                    });
            } else if (process.platform === 'linux') {
                const raw = clipboard.read('text/uri-list');
                fileURLs = raw.split('\n')
                    .map(url => url.trim())
                    .filter(url => url.startsWith('file://'))
                    .map(url => {
                        return url.replace('file://', '');
                    });
            }
            let result = "";
            for (let i = 0; i < fileURLs.length; i++) {
                let fileURL = encodeURI(fileURLs[i]);
                let ext = fileURL.split(".").pop();
                if (videoExts.includes(ext)) {
                    type = "${video}:";
                } else if (audioExts.includes(ext)) {
                    type = "${audeo}:";
                } else if (imageExts.includes(ext)) {
                    type = "";
                } else {
                    type = "${file}:";
                }
                result = result + ("![" + type + "](" + fileURL + ")\n");
            }
            return result;
        } else {
            const isImage = formats.some(format => format.includes('image'));
            // 如果剪切版内为图片的具体内容，则返回base64编码的内容
            if (isImage) {
                const image = clipboard.readImage();
                const imageURL = image.toDataURL();
                return `![](${imageURL})`;
            }
        }
    });

    ipcMain.on('open-url', (event, url) => {
        shell.openExternal(url);
    });

    ipcMain.handle('get-system-lang', (event) => {
        // 检测操作系统的语言设置并返回
        let locale = app.getLocale();
        console.log(locale);
        if (['zh-CN', 'zh', 'zh-Hans'].includes(locale)) {
            // 加载简体中文
            return 'zh-CN';
        } else if (['zh-TW', 'zh-HK', 'zh-MO', 'zh-Hant'].includes(locale)) {
            // 这些地区统一加载繁体中文
            return 'zh-TW';
        } else if (locale.startsWith('en')) {
            return 'en';
        } else {
            // 其他语言，默认英文
            return 'en';
        }
    });

    // sqlite ipc
    sqliteIpc(Sqlite3, dbPath);
};
