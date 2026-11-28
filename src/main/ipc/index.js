import {dialog, ipcMain, app, clipboard, nativeImage} from "electron";
import {Dialogs} from "../dialogs";
import path from "path";
import fs from 'fs';
import {rm} from 'fs/promises';
import {sqliteIpc} from "./modules/sqliteipc.js";
import {SqliteMan} from "../sqlite-man";
import os from "os";
import {harmonyPermissionIpc} from "./modules/harmonyPermissionIpc.js";
import {themesIpc} from "./modules/themesIpc";
import {
    setOpenedFileHistory,
    fileNameIsContainsIllegalChar,
    stox,
    getNow,
    copyOnHarmony
} from "./modules/common";
import {appVersionIpc} from "./modules/appVersionIpc";
import {exportIpc} from "./modules/exportIpc";
import {exportPdfIpc} from "../print";
import {openExternalSafe} from "../external-url";

const util = require('util');
const exec = util.promisify(require('child_process').exec);

let mdzUtils;
let docRootPath;
let XLSX;
if (!app.isPackaged) {
    // 在开发环境
    mdzUtils = process.platform === 'openharmony'
        ? require(path.join(__dirname, `..${path.sep}..${path.sep}napi_cpp${path.sep}mdz_utils`))
        : require(path.join(__dirname, "..", "..", "libs", "napi_cpp", "mdz_utils"));
    docRootPath = path.join(__dirname, "..", "..", "document");
    XLSX = process.platform === 'openharmony'
        ? require(path.join(__dirname, `..${path.sep}..${path.sep}node_modules${path.sep}xlsx`))
        : require("xlsx");
} else {
    // 在生产环境
    const unpackedRoot = path.join(process.resourcesPath, 'app.asar.unpacked');
    mdzUtils = process.platform === 'openharmony'
        ? require(path.join(__dirname, `..${path.sep}..${path.sep}napi_cpp${path.sep}mdz_utils`))
        : require(path.join(unpackedRoot, "libs", "napi_cpp", "mdz_utils"));
    XLSX = process.platform === 'openharmony'
        ? require(path.join(__dirname, `..${path.sep}..${path.sep}node_modules${path.sep}xlsx`))
        : require(path.join(unpackedRoot, "node_modules", "xlsx"));
    docRootPath = process.platform === 'openharmony'
        ? path.join(__dirname, "..", "..", "document")
        : path.join(unpackedRoot, `document`);
}

const dialogs = new Dialogs();

// ===== Electron 45 剪贴板适配层 =====
// Electron 45 起主进程 clipboard 改为「异步 + 基于 MIME」：
//   clipboard.read() -> Promise<ClipboardItem[]>，item.types: string[]，item.getType(mime) -> Promise<Blob>
// 旧的 availableFormats() / read(format) / readBuffer(format) / readImage() 已整体删除。
// 平台私有格式可能以裸名（FileNameW）或 osclipboard 命名空间形式
// （electron application/osclipboard;format="FileNameW"）出现在 item.types 里，这里两种都认。

const OS_CLIPBOARD_FORMAT_PREFIX = "electron application/osclipboard;format=";

// 把 item.types 里的键归一化成裸格式名（小写），便于跨平台比对
const normalizedFormat = (type) => {
    let lower = String(type).toLowerCase();
    if (lower.startsWith(OS_CLIPBOARD_FORMAT_PREFIX)) {
        lower = lower.slice(OS_CLIPBOARD_FORMAT_PREFIX.length).replace(/^"+|"+$/g, "");
    }
    return lower;
};

// 在候选格式名里，返回该条目实际暴露的那个 types 键（找不到返回空串）
const pickFormat = (item, candidates) => {
    const wanted = candidates.map((name) => name.toLowerCase());
    for (const type of item.types) {
        if (wanted.includes(normalizedFormat(type))) {
            return type;
        }
    }
    return "";
};

// 任一条目暴露了候选格式之一即为命中
const hasFormat = (items, candidates) => {
    const wanted = candidates.map((name) => name.toLowerCase());
    return items.some((item) => item.types.some((type) => wanted.includes(normalizedFormat(type))));
};

// 按候选格式读取文本内容，读不到返回空串
const readTextByFormats = async (item, candidates) => {
    const type = pickFormat(item, candidates);
    if (!type) {
        return "";
    }
    try {
        return await (await item.getType(type)).text();
    } catch (e) {
        return "";
    }
};

// 按候选格式读取原始字节，读不到返回 null
const readBufferByFormats = async (item, candidates) => {
    const type = pickFormat(item, candidates);
    if (!type) {
        return null;
    }
    try {
        return Buffer.from(await (await item.getType(type)).arrayBuffer());
    } catch (e) {
        return null;
    }
};

// 遍历所有条目，返回第一个非空的文本
const readFirstText = async (items, candidates) => {
    for (const item of items) {
        const text = await readTextByFormats(item, candidates);
        if (text.trim() !== "") {
            return text;
        }
    }
    return "";
};

// 把 text/uri-list / public.file-url / x-special/gnome-copied-files 这类
// 「一行一个 URI」的文本转成绝对路径数组；顺带丢掉空行、
// RFC 2483 的 # 注释行，以及 gnome-copied-files 的首行动作标记（copy/cut）
const uriListToPaths = (raw) => raw.split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== "" && !line.startsWith("#"))
    .filter((line) => line.startsWith("file://"))
    .map((line) => line.replace("file://", ""));

// 各平台“在文件管理器里复制了文件”时暴露的私有格式（按优先级）
const FILE_URL_FORMATS = {
    win32: ["FileNameW", "FileGroupDescriptorW", "text/uri-list"],
    darwin: ["public.file-url", "text/uri-list"],
    linux: ["x-special/gnome-copied-files", "text/uri-list"],
    openharmony: ["text/uri-list"],
};
const ALL_FILE_URL_FORMATS = Array.from(new Set(Object.values(FILE_URL_FORMATS).flat()));

// ===== mdz 包格式常量与解包辅助层 =====
// mdz 内部结构（名称全部固定，与外层 mdz 文件名无关，因此用文件管理器重命名 mdz 后依然能打开）：
//   <mdz所在目录>/._mdz_content.<mdz文件名去ext>/mdz_contents/content.md    主 Markdown
//   <mdz所在目录>/._mdz_content.<mdz文件名去ext>/mdz_contents/media_src/*   包内多媒体文件
// 解包目录名由“当前”mdz 文件名派生，所以渲染端的 $MDZ_MEDIA 路径也跟随重命名自动生效。
const pathExists = async (targetPath) => {
    try {
        await fs.promises.access(targetPath);
        return true;
    } catch (e) {
        return false;
    }
};

const MDZ_WORK_DIR_PREFIX = "._mdz_content.";
const MDZ_CONTENTS_DIR = "mdz_contents";
const MDZ_MEDIA_DIR = "media_src";
const MDZ_MAIN_MD_NAME = "content.md";
const MDZ_STAGE_DIR = ".ame_mdz_stage";  // 解压暂存目录，仅解压瞬间存在，随后搬移并删除
const MDZ_CACHE_EXT = ".mdzcache";  // “保存”就地覆盖时的原包留底扩展名，仅在压缩成功前存在

const mdzWorkDirPath = (dirPath, pureFileName) => dirPath + path.sep + MDZ_WORK_DIR_PREFIX + pureFileName;

// 在解压结果里定位 mdz_contents 目录（包内可能带一层顶层目录，也可能不带）
const findMdzContentsDir = async (rootPath) => {
    const candidates = [path.join(rootPath, MDZ_CONTENTS_DIR)];
    for (const entry of await fs.promises.readdir(rootPath, {withFileTypes: true})) {
        if (entry.isDirectory()) {
            candidates.push(path.join(rootPath, entry.name, MDZ_CONTENTS_DIR));
        }
    }
    for (const candidate of candidates) {
        try {
            if ((await fs.promises.stat(candidate)).isDirectory()) return candidate;
        } catch (e) {
            // 该候选路径不存在，继续尝试下一个
        }
    }
    return "";
};

// 定位包内主 md：优先固定名 content.md；为兼容历史 mdz 包（内部 md 名曾要求等于 mdz 文件名），
// 回退取 mdz_contents 下第一个 .md 文件
const findMdzMainMdPath = async (contentsDir) => {
    const fixedPath = path.join(contentsDir, MDZ_MAIN_MD_NAME);
    try {
        if ((await fs.promises.stat(fixedPath)).isFile()) return fixedPath;
    } catch (e) {
        // 没有 content.md，走下面的历史包回退逻辑
    }
    const mdNames = (await fs.promises.readdir(contentsDir))
        .filter((name) => name.toLowerCase().endsWith(".md"))
        .sort();
    if (mdNames.length === 0) {
        // 文案沿用 strerror 风格的 "No such file or directory"，以命中上层 FILE_NOT_FOUND 判断
        throw new Error(`ENOENT: No such file or directory, open '${fixedPath}'`);
    }
    return path.join(contentsDir, mdNames[0]);
};

// 解压 mdz 到暂存目录，并把内容根归一化到 "._mdz_content.<当前mdz文件名去ext>"，返回主 md 的真实路径
const extractMdzContent = async (filePath, dirPath, pureFileName, password) => {
    const workDir = mdzWorkDirPath(dirPath, pureFileName);
    const stageDir = dirPath + path.sep + MDZ_STAGE_DIR;
    await rm(stageDir, {recursive: true, force: true});
    let contentRoot = "";
    try {
        await mdzUtils.genOrDecompressMdz(filePath, stageDir, "decompress", "", password);
        const contentsDir = await findMdzContentsDir(stageDir);
        contentRoot = contentsDir ? path.dirname(contentsDir) : "";
    } catch (e) {
        await rm(stageDir, {recursive: true, force: true});
        throw e;
    }
    if (!contentRoot) {
        await rm(stageDir, {recursive: true, force: true});
        // 文案沿用 strerror 风格的 "No such file or directory"，以命中上层 FILE_NOT_FOUND 判断
        throw new Error(`ENOENT: No such file or directory, open '${path.join(workDir, MDZ_CONTENTS_DIR)}'`);
    }
    try {
        if (await pathExists(workDir)) {
            // 工作目录已存在（可能含有尚未压缩进包的新导入媒体）：合并覆盖，不丢弃多余文件
            await fs.promises.cp(contentRoot, workDir, {recursive: true});
        } else {
            await fs.promises.rename(contentRoot, workDir);
        }
    } finally {
        await rm(stageDir, {recursive: true, force: true});
    }
    if (process.platform === "win32") {
        // Windows平台运行 attrib +h "X:/path/to/folder" 命令隐藏文件夹
        await exec(`attrib +h "${workDir}"`);
    }
    return await findMdzMainMdPath(path.join(workDir, MDZ_CONTENTS_DIR));
};

// 清理解包目录里遗留的历史主 md（旧格式内部 md 名等于 mdz 文件名），避免重新压缩后包内出现两份正文
const removeStaleMdzMainMd = async (contentsDir) => {
    try {
        for (const name of await fs.promises.readdir(contentsDir)) {
            if (name !== MDZ_MAIN_MD_NAME && name.toLowerCase().endsWith(".md")) {
                await rm(path.join(contentsDir, name), {force: true});
            }
        }
    } catch (e) {
        // 清理失败不影响保存主流程
    }
};

export const ipc = (Sqlite3, dbPath) => {
    const sqliteMan = new SqliteMan(Sqlite3, dbPath);
    sqliteMan.init();  // 检查相关sqlite表是否存在，如不存在就新建

    ipcMain.handle("activate-open-file-dialog", (event, title, content) => {
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

        // 解压加密mdz文件并读取文件内容
        try {
            let realFilePathInMdz
                = await extractMdzContent(filePath, filePathArray.join(path.sep), pureFileName, password);
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
            // ._mdz_content.test/    # 解包目录名格式："._mdz_content." + 当前mdz文件名去掉ext
            //          |             # 在posix平台，开头为“.”的文件和文件夹本身不可见（除非设置显示隐藏项目）
            //          V             # win32平台需要额外运行命令：attrib +h /path/to/._mdz_content.test 以使文件夹不可见
            //    mdz_contents/       # 这里的文件夹固定为“mdz_contents”
            //     |         |
            //     V         V
            // content.md  media_src/ # 主md文件名固定为“content.md”（与外层mdz文件名无关），同级文件夹固定为“media_src”
            //               |
            //               V
            // *.jpg, *.mp4, *.mp3... # 固定在mdz文件内的多媒体文件，在mdz格式下，![...](path)语句括号内的path格式为：$MDZ_MEDIA/多媒体文件名
            //                        # 渲染器会将其自动解释为：/path/to/._mdz_content.test/mdz_contents/media_src/多媒体文件名
            // 因此/path/to/test.mdz文件的实际文件路径是：/path/to/._mdz_content.test/mdz_contents/content.md
            // 包内条目名与解包目录名都不依赖打包时的文件名，故重命名mdz文件后仍可正常打开；
            // 历史包（内部md名等于mdz文件名）由 extractMdzContent 归一化目录名 + findMdzMainMdPath 回退旧名继续支持
            // 解压mdz文件并读取文件内容
            try {
                let realFilePathInMdz
                    = await extractMdzContent(filePath, filePathArray.join(path.sep), pureFileName, "");
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
        const workDir = mdzWorkDirPath(purePath, pureFileName);
        try {
            await fs.promises.mkdir(path.join(workDir, MDZ_CONTENTS_DIR, MDZ_MEDIA_DIR), {recursive: true});
            if (process.platform === "win32") {
                // Windows平台运行 attrib +h "X:/path/to/folder" 命令隐藏文件夹
                await exec(`attrib +h "${workDir}"`);
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
            try {
                if (process.platform === 'openharmony') {
                    await copyOnHarmony(decodeURI(filePathArray[i][0]), decodeURI(filePathArray[i][1]));
                } else {
                    await fs.promises.copyFile(decodeURI(filePathArray[i][0]), decodeURI(filePathArray[i][1]));
                }
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
        try {
            if (ext === "mdz") {
                // 内部主md文件名固定为 content.md，不再要求与外层mdz文件名一致
                const contentsDir = path.join(mdzWorkDirPath(purePath, pureFileName), MDZ_CONTENTS_DIR);
                await fs.promises.writeFile(path.join(contentsDir, MDZ_MAIN_MD_NAME), content, 'utf8');
                await removeStaleMdzMainMd(contentsDir);
            } else if (ext === "md" || ext === "txt") {
                await fs.promises.writeFile(purePath + path.sep + pureFileName + `.${ext}`, content, 'utf8');
            }
            return {"success": true, "message": "写入文件成功"};
        } catch (e) {
            return {"success": false, message: `${e.name}: ${e.message}`};
        }
    });

    ipcMain.handle("compress-to-mdz", async (event, purePath, pureFileName, password, backupOldMdz) => {
        const mdzPath = purePath + path.sep + pureFileName + ".mdz";
        const cachePath = purePath + path.sep + pureFileName + MDZ_CACHE_EXT;
        try {
            if (backupOldMdz) {
                // “保存”（就地覆盖）：先把原包改名留底，压缩出新包成功后才删除留底。
                // 这样压缩报错、磁盘写满、进程被强杀等情况下原mdz不会被丢弃。
                if (await pathExists(cachePath)) {
                    // 上一次保存被强杀留下的留底文件，可能已经是这篇文档仅存的内容，不能静默覆盖
                    return {
                        "success": false,
                        "message": `EXISTS: 同目录下还留着上次保存中断产生的 '${pureFileName}${MDZ_CACHE_EXT}'，`
                            + `确认其内容后请手动删除再保存`
                    };
                }
                if (await pathExists(mdzPath)) {
                    await fs.promises.rename(mdzPath, cachePath);
                }
            } else {
                // “另存为”：保持原来的直接删除再覆盖行为
                await rm(mdzPath, {recursive: true, force: true});
            }
            try {
                // 再压缩产生新的
                await mdzUtils.genOrDecompressMdz(
                    mdzWorkDirPath(purePath, pureFileName),
                    mdzPath,
                    "compress",
                    password,
                    ""
                );
            } catch (compressError) {
                // 打包没成功：把留底改回原名，让原mdz回到保存之前的状态
                if (backupOldMdz && await pathExists(cachePath)) {
                    try {
                        await fs.promises.rename(cachePath, mdzPath);
                    } catch (rollbackError) {
                        throw new Error(`${compressError.name}: ${compressError.message}`
                            + `；原包留在 '${pureFileName}${MDZ_CACHE_EXT}'，把它的扩展名改回 .mdz 即可找回`);
                    }
                }
                throw compressError;
            }
            // 只有打包成功，才删除留底；删除本身失败不影响本次保存结果
            if (backupOldMdz) {
                await rm(cachePath, {recursive: true, force: true});
            }
            return {"success": true, "message": "保存成功"};
        } catch (e) {
            return {"success": false, message: `${e.name}: ${e.message}`};
        }
    });

    ipcMain.on("save-file-in-mdz", async (event, title, filePath) => {
        // 打开“选择打开文件”的操作系统组件，以向渲染端（前端）返回计划打开的文件路径
        filePath = decodeURI(filePath.replace("file://", ""));
        let fileName = filePath.split("/").pop();
        let savePath = dialogs.saveMediaDialog(title, (os.homedir() + path.sep + fileName));  // 获得打开的文件路径
        if (savePath) {
            // 开始保存文件
            try {
                if (process.platform === 'openharmony') {
                    await copyOnHarmony(filePath, savePath);
                } else {
                    await fs.promises.copyFile(filePath, savePath);
                }
                dialog.showMessageBoxSync({
                    type: 'info',
                    message: '保存成功 Save successfully!',
                    buttons: ['OK'],
                    defaultId: 0,
                });
                return 0;
            } catch (err) {
                dialog.showMessageBoxSync({
                    type: 'error',
                    message: '保存失败 Save failed!',
                    buttons: ['OK'],
                    defaultId: 0,
                });
                return -1;
            }
        } else {
            // 用户中途取消打开文件，直接关闭了saveFileDialog
            dialog.showMessageBoxSync({
                type: 'warning',
                message: '用户取消保存 User save canceled!',
                buttons: ['OK'],
                defaultId: 0,
            });
            return -1;
        }
    });

    ipcMain.handle("get-file-buffer",  (event, path, isXlsx) => {
        const bufferSize = 64 * 1024;
        return new Promise((resolve, reject) => {
            const stream = fs.createReadStream(path, { highWaterMark: bufferSize });
            const chunks = [];
            stream.on('data', chunk => chunks.push(chunk));
            stream.on('end', () => {
                const buffer = Buffer.concat(chunks);
                if (!isXlsx) {
                    resolve(buffer);
                } else {
                    const workbook = XLSX.read(buffer);
                    resolve(stox(XLSX, workbook));
                }
            });
            stream.on('error', reject);
        });
    });

    ipcMain.handle("get-file-as-txt",  async (event, path) => {
        try {
            let fileContent = await fs.promises.readFile(path, 'utf8');
            return {"success": true, "message": fileContent.substring(0, 10000)};  // 截取前10000个字，以免卡死
        } catch (e) {
            return {"success": false, "message": e};
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

    ipcMain.handle("media-paster", async (event, errorMsg) => {
        let items;
        try {
            items = await clipboard.read();
        } catch (e) {
            // 剪贴板不可用或无内容时按“没有可粘贴内容”处理，别把异常抛给编辑器
            return "";
        }
        let fileURLs, type;
        // 常见视频文件的扩展名
        const videoExts = ["mp4", "mov", "webm", "avi", "wmv", "flv", "mkv", "m4v", "mpeg", "ts"];
        // 常见音频文件的扩展名
        const audioExts = ["mp3", "wav", "flac", "ogg", "wma", "aac", "m4a"];
        // 常见图片文件的扩展名
        const imageExts = ["jpg", "jpeg", "tif", "tiff", "gif", "bmp", "svg", "png", "webp"];
        // 优先检查是否存在文件专用格式
        // 只要存在，说明最近一次操作绝对是“复制了文件”
        const platformFormats = FILE_URL_FORMATS[process.platform] || ALL_FILE_URL_FORMATS;
        let isFile = hasFormat(items, platformFormats);
        if (!isFile) {
            // 兜底：桌面环境五花八门，格式名没命中时，只要内容里出现 file:// 也算复制了文件
            isFile = (await readFirstText(items, ALL_FILE_URL_FORMATS)).includes("file://");
        }
        // 如果直接复制已有多媒体文件，则返回文件路径
        if (isFile) {
            if (process.platform === 'win32') {
                // 必须优先检查 FileNameW 格式
                // 它是 MULTI_SZ（UTF-16LE 编码），按 ucs2 解码才能正确处理中文/特殊字符路径
                let fileNameBuffer = null;
                for (const item of items) {
                    fileNameBuffer = await readBufferByFormats(item, ["FileNameW"]);
                    if (fileNameBuffer) {
                        break;
                    }
                }
                if (fileNameBuffer) {
                    // 多个文件路径以 \0 分隔，结尾会有两个 \0，过滤掉空字符串即可
                    const raw = fileNameBuffer.toString('ucs2').replaceAll("\\", "/");
                    fileURLs = raw.split('\0').filter(p => p.length > 0);
                } else {
                    // 少数文件管理器只提供 text/uri-list
                    fileURLs = uriListToPaths(await readFirstText(items, ["text/uri-list"]));
                }
            } else if (process.platform === 'darwin') {
                // macOS 复制多个文件时，路径通常以换行符 \n 分隔
                fileURLs = uriListToPaths(await readFirstText(items, ["public.file-url"]));
                if (fileURLs.length === 0) {
                    fileURLs = uriListToPaths(await readFirstText(items, ["text/uri-list"]));
                }
            } else if (process.platform === 'linux') {
                // 注意这个mime不是通用的，不同的发行版可能有不同的mime，后续开发注意补充
                // 首行是 copy/cut 动作标记，uriListToPaths 会因为不以 file:// 开头而丢弃
                fileURLs = uriListToPaths(await readFirstText(items, ["x-special/gnome-copied-files"]));
                if (fileURLs.length === 0) {
                    fileURLs = uriListToPaths(await readFirstText(items, ["text/uri-list"]));
                }
            } else if (process.platform === 'openharmony') {
                fileURLs = uriListToPaths(await readFirstText(items, ["text/uri-list"]));
            } else {
                // 未知平台：避免 fileURLs 为 undefined 时下面取 length 直接抛错
                fileURLs = [];
            }

            let result = "";
            for (let i = 0; i < fileURLs.length; i++) {
                if (fileNameIsContainsIllegalChar(fileURLs[i].split("/").pop())) {
                    result = result + `${errorMsg}\n`;
                } else {
                    let fileURL = encodeURI(fileURLs[i]);
                    let ext = fileURL.split(".").pop().toLowerCase();
                    if (videoExts.includes(ext)) {
                        type = "${video}:";
                    } else if (audioExts.includes(ext)) {
                        type = "${audio}:";
                    } else if (imageExts.includes(ext)) {
                        type = "";
                    } else {
                        type = "${file}:";
                    }
                    result = result + ("![" + type + "](" + fileURL + ")\n");
                }
            }
            return result;
        }
        // 剪贴板内为图片的具体内容，则返回base64编码的内容
        for (const item of items) {
            const imageTypes = item.types.filter((format) => normalizedFormat(format).startsWith("image/"));
            for (const imageType of imageTypes) {
                let imageBuffer;
                try {
                    imageBuffer = Buffer.from(await (await item.getType(imageType)).arrayBuffer());
                } catch (e) {
                    continue;
                }
                if (imageBuffer.length === 0) {
                    continue;
                }
                // 与旧的 clipboard.readImage().toDataURL() 保持一致：统一输出 PNG 的 data URL
                const image = nativeImage.createFromBuffer(imageBuffer);
                if (!image.isEmpty()) {
                    return `![](${image.toDataURL()})`;
                }
                // nativeImage 解不出来（少见的位图容器）时，按原始 MIME 直接兜底
                return `![](data:${normalizedFormat(imageType)};base64,${imageBuffer.toString("base64")})`;
            }
        }
        return "";
    });

    ipcMain.handle("get-media-list-in-mdz", async (event, mediaHomePath) => {
        try {
            let mediaList = await fs.promises.readdir(mediaHomePath);
            return {"success": true, "message": {"homeDir": mediaHomePath, "nameList": mediaList}}
        } catch (e) {
            return {"success": false, "message": e};
        }
    });

    ipcMain.handle("import-media-into-mdz", async (event, title, destinationPath, errorMsg) => {
        // 打开“选择打开文件”的操作系统组件，以向渲染端（前端）返回计划打开的文件路径
        let mediaFilePaths = dialogs.openFileDialog(title, true);  // 获得打开的文件路径
        if (!mediaFilePaths) {
            // 用户中途取消打开文件，直接关闭了openFileDialog
            return {'success': false, 'message': ["用户已取消导入媒体/User Canceled"]};
        }
        let mediaFilePath = decodeURI(mediaFilePaths[0]);
        let mediaFileName = mediaFilePath.split(path.sep).pop();
        if (fileNameIsContainsIllegalChar(mediaFileName)) {
            return {"success": false, "message": [errorMsg]};
        }
        try {
            if (process.platform === 'openharmony') {
                await copyOnHarmony(mediaFilePath, `${destinationPath}/${mediaFileName}`);
            } else {
                await fs.promises.copyFile(mediaFilePath, `${destinationPath}/${mediaFileName}`);
            }
            return {
                'success': true,
                'message': ["媒体导入成功/Successfully Imported", mediaFileName],
            };
        } catch (e) {
            return {'success': false, 'message': [e.name]};
        }
    });

    ipcMain.handle("delete-media-in-mdz",  async (event, mediaPath) => {
        try {
            await rm(mediaPath, {recursive: true, force: true});
            return {"success": true, "message": "删除成功/Delete Successfully"};
        } catch (e) {
            return {"success": false, "message": "删除失败/Delete Failed"};
        }
    });

    ipcMain.on('open-url', (event, url) => {
        // URL 来自渲染端，源头是 markdown 正文里的链接，必须过协议白名单才能交给系统
        openExternalSafe(url);
    });

    ipcMain.handle('get-system-lang', (event) => {
        // 检测操作系统的语言设置并返回
        let locale = process.platform === 'openharmony'
            ? app.getPreferredSystemLanguages()[0]
            : app.getLocale();
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

    // get harmony os permissions
    harmonyPermissionIpc();

    // get themes
    themesIpc();

    // get app version
    appVersionIpc();

    // export
    exportIpc(dialogs);

    // export pdf
    exportPdfIpc();
};
