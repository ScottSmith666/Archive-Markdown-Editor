const {app, ipcMain, shell, BrowserWindow} = require("electron");
const path = require("node:path");
const GlobalVar = require(path.join(__dirname, "..", "libs", "globalvar"));
const SqliteMan = require(path.join(__dirname, "..", "libs", "sqliteman"));
const LanguageLocale = require(path.join(__dirname, "..", "libs", "languages"));
const RwMdz = require(path.join(__dirname, "..", "libs", "rwmdz"));
const Dialogs = require(path.join(__dirname, "..", "dialogs", "dialogs"));
const fs = require("fs");

const gVar = new GlobalVar();
const rwMdz = new RwMdz();
let langSurface = new LanguageLocale().operationsInstructions();
const settingsConfigManager = new SqliteMan.SettingsConfigManager();


function runCommand(command, afterDoing = () => 0) {
    console.log("正在执行：" + command);
    let exec = require('child_process').exec;
    exec(command, function (err, stdout, stderr) {
        if (err) {
            console.log('error:' + stderr);
        } else {
            console.log(stdout);
            afterDoing();
        }
    });
}

function CommonIpc() {
    this.commonIpcMain = (workWindow) => {
        ipcMain.on('quit', (event) => {
            /**
             * 退出整个应用
             */
            app.quit();
        });
        ipcMain.on('close-window', (event, windowId) => {
            /**
             * 关闭当前窗口
             */
            const readyDestroyedWindow = BrowserWindow.fromId(Number(windowId));
            readyDestroyedWindow.destroy();
        });
        ipcMain.on('close-window-and-rm-ins-history', (event, windowId, path) => {
            /**
             * 关闭当前窗口并清除临时历史记录
             */
            const readyDestroyedWindow = BrowserWindow.fromId(Number(windowId));
            readyDestroyedWindow.destroy();
            settingsConfigManager.deleteInstantHistoryRecords(path);
        });
        ipcMain.on('reload-app', (event) => {
            /**
             * 重启整个应用
             */
            app.relaunch();
            app.quit();
        });
        ipcMain.handle('load-language-user-surface', async (event, part) => {
            /**
             * 载入用户语言界面
             */
            return new LanguageLocale().operationsInstructions()[part];
        });
        ipcMain.handle('load-storage-settings-index', async (event, instruction) => {
            /**
             * 从硬盘上的本地Sqlite数据库读取settings
             */
            const settingsConfigManager = new SqliteMan.SettingsConfigManager();
            return Number(settingsConfigManager.getSettings(instruction));
        });
        ipcMain.handle('switch-debug', async (event) => {
            /**
             * 开启/关闭DEBUG选项，便于调试
             */
            return gVar.DEBUG;
        });
        ipcMain.on('open-url', (event, url) => {
            /**
             * 通过默认浏览器打开外部链接
             * @type {any|string}
             */
            url = (url.includes("http://") || url.includes("https://") ? url : "https://" + url);  // 检测到不包括协议的URL，就加上协议
            shell.openExternal(url);
        });
        ipcMain.on('open-new', (event) => {
            /**
             * 打开新窗口
             */
            workWindow();
        });
        ipcMain.on('open-file', (event) => {
            const dialogs = new Dialogs();
            let openFileTitle = langSurface.prompts.open[gVar.langs()];
            let filePath = dialogs.openFileDialog(openFileTitle);  // 获得打开的文件路径
            // 以打开exists文件的方式打开work窗口
            if (filePath) workWindow(filePath[0]);
        });
        ipcMain.on('open-file-from-path', (event, path) => {
            workWindow(path);
        });
        ipcMain.handle('load-file-content', (event, path, password) => {
            /**
             * 加载文件内容
             */
            // 加载普通Markdown文件或txt文件
            if (path.split(".").pop() === "md" || path.split(".").pop() === "txt")
                return fs.readFileSync(path, 'utf8');
            else if (path.split(".").pop() === "mdz") {  // 加载Archive Markdown File (mdz)
                let mdzCoreFilePath = rwMdz.readMdz(path, password);
                if (mdzCoreFilePath === -1) return false;
                return fs.readFileSync(mdzCoreFilePath, 'utf8');
            }
        });
        ipcMain.handle('verify-file-was-opened', (event, path) => {
            /**
             * 检测对应path的文件是否已被打开，如已被打开则弹窗警告禁止再次打开
             * 返回true则说明文件已被打开
             */
            if (path) return settingsConfigManager.openHistoryIsExists(path);
            else return path;
        });
        ipcMain.handle('verify-file-is-exists', (event, path) => {
            /**
             * 检测对应path的文件是否存在
             * 返回true则说明文件已存在
             */
            return fs.existsSync(path);
        });
        ipcMain.handle('verify-file-name-is-valid', (event, path) => {
            /**
             * 检测对应path的文件名是否合法
             * 返回true则说明文件名合法
             */
            fileName = path.split(gVar.pathSep).pop();  // 获得文件名
            if (fileName.length > gVar.MaxFileNameLength) return false;  // 文件名长度如不符合要求直接返回false，不用验证非法字符
            let num = 0;
            for (let i = 0; i < gVar.ForbiddenChars.length; i++) {
                if (fileName.indexOf(gVar.ForbiddenChars[i]) !== -1) break;  // 如果检出非法字符，则num肯定不等于gVar.ForbiddenChars.length - 1
                else if (path.indexOf(" ") !== -1) break;  // 文件路径有空格
                num = i;
            }
            return (num === gVar.ForbiddenChars.length - 1);
        });
        ipcMain.handle('before-close-window', (event, path) => {
            /**
             * 关闭文件（窗口）之前删除sqlite中打开的路径
             */
            settingsConfigManager.deleteInstantHistoryRecords(path);
            return 0;
        });
        ipcMain.handle('auto-save-file', (event, content, fullFilePath, password) => {
            /**
             * 保存旧文件（即点击按钮或按下热键时直接按照之前的路径默认保存）
             */
            let extName = fullFilePath.split(".").pop();
            if (extName === "mdz") {
                // 如果在内容中发现了绝对路径或相对路径，则改成mdz文件中特有的路径（多媒体路径$MDZ_MEDIA），并将多媒体收入mdz文件内
                let codeBlockMdCodeReg = /```\s*(\w+)?\s*\n?([\s\S]*?)\n?```/g;  // 匹配代码块
                let inlineCodeMdCodeReg = /(?<!\\)`([^`\n]+)(?<!\\)`/g;  // 匹配内联代码
                let mediaMdCodeReg = /!\[([^\]]*)\]\(([^)]+)\)/g;
                let match;
                let codeResult = {
                    inline: [],
                    block: [],
                };
                // 先匹配代码块
                let block_num = 0;
                while ((match = codeBlockMdCodeReg.exec(content)) !== null) {
                    content = content.replace(match[0], `$MAYBE_MEDIA_IN_CODE${block_num}`);
                    codeResult.block.push({
                        type: 'block',
                        language: match[1] || 'text',
                        content: match[2].trim(),
                        raw: match[0],
                        position: match.index
                    });
                    block_num++;
                }

                // 再匹配内联代码
                let inline_num = 0;
                while ((match = inlineCodeMdCodeReg.exec(content)) !== null) {
                    content = content.replace(match[0], `$MAYBE_MEDIA_IN_INLINE_CODE${inline_num}`);
                    codeResult.inline.push({
                        type: 'inline',
                        content: match[1],
                        raw: match[0],
                        position: match.index
                    });
                    inline_num++;
                }
                // 如果在内容中发现了绝对路径或相对路径，则改成mdz文件中特有的路径（多媒体路径$MDZ_MEDIA），并将多媒体收入mdz文件内
                let al = [...content.matchAll(mediaMdCodeReg)].map(match => ({
                    fullMatch: match[0],
                    altText: match[1],
                    imagePath: match[2]
                }));

                let savePathList = fullFilePath.split(gVar.pathSep);
                let fileName = savePathList.pop();
                let fileNameList = fileName.split(".");
                fileNameList.pop();
                let root = savePathList.join(gVar.pathSep);
                let realMdzFilePath = root + gVar.pathSep + "._mdz_content." + fileNameList.join(".") + gVar.pathSep + "mdz_contents" + gVar.pathSep + fileNameList.join(".") + ".md";

                for (let i = 0; i < al.length; i++) {
                    let urlReg = /^http(s)*(:\/\/)/;
                    let relativePathReg = /(\.|\.\.)(\/|\\)(\S|\s)+/;
                    let mdzPathReg = /^(\$MDZ_MEDIA\/)(\S)+/;

                    let mediaCodeElement = al[i].fullMatch;
                    let originMediaPath = al[i].imagePath;
                    let mediaFileName = originMediaPath.split(/\/|\\/).pop();
                    let mediaPath = originMediaPath;

                    if (urlReg.test(mediaPath) || mdzPathReg.test(mediaPath)) continue;  // 判断URL或者mdz路径
                    else if (relativePathReg.test(mediaPath)) {  // 判断相对路径
                        mediaPath = root + gVar.pathSep + mediaPath;  // 获得多媒体的绝对路径
                    }
                    // 拷贝多媒体至文件夹
                    fs.copyFileSync(mediaPath, root + gVar.pathSep + "._mdz_content." + fileNameList.join(".") + gVar.pathSep + "mdz_contents" + gVar.pathSep + "media_src" + gVar.pathSep + mediaFileName);
                    // 最后修改路径为$MDZ_MEDIA
                    let modifiedMediaCode = mediaCodeElement.replace(originMediaPath, `$MDZ_MEDIA/${mediaFileName}`);
                    // 新代码替换旧代码
                    content = content.replace(mediaCodeElement, modifiedMediaCode);
                }
                // 将代码块替换回来
                for (let i = 0; i < codeResult.inline.length; i++)
                    content = content.replace(`$MAYBE_MEDIA_IN_INLINE_CODE${i}`, codeResult.inline[i].raw);
                for (let i = 0; i < codeResult.block.length; i++)
                    content = content.replace(`$MAYBE_MEDIA_IN_CODE${i}`, codeResult.block[i].raw);
                // 内容写入
                fs.writeFileSync(realMdzFilePath, content, 'utf8');
                // 打包为mdz
                rwMdz.writeMdz(root + gVar.pathSep + "._mdz_content." + fileNameList.join("."), password);
            } else fs.writeFileSync(fullFilePath, content, 'utf8');
            settingsConfigManager.deleteInstantHistoryRecords(fullFilePath);
            return true;
        });

        ipcMain.handle('custom-save-file', (event, content, originPath, password) => {
            /**
             * 保存新文件（即保存时弹出保存框选择路径保存）
             */
            // 弹出保存选择路径框
            const dialogs = new Dialogs();
            let isFileIncludeForbiddenChars = true;
            let isFileNameTooLong = true;
            let fileSaveAsPath = "";
            let fileName = "";
            let saveTitle = langSurface.prompts.saveAs.saveTitle[gVar.langs()];
            while (isFileIncludeForbiddenChars || isFileNameTooLong) {
                fileSaveAsPath = dialogs.saveFileDialog(saveTitle);  // 获得打开的文件路径
                // 如果取消保存，即保存失败，返回的路径则为undefined，那么就直接返回
                if (!fileSaveAsPath) return [undefined, undefined];
                fileName = fileSaveAsPath.split(gVar.pathSep).pop();  // 获得自定义保存的文件名
                // 验证文件名的合法性
                if (fileName.length > gVar.MaxFileNameLength) {  // 文件名长度如不符合要求直接跳进下一个循环，不用验证非法字符
                    saveTitle = langSurface.prompts.saveAs.errorTooLongSaveTitle[gVar.langs()];
                    isFileNameTooLong = true;
                    continue;
                } else isFileNameTooLong = false;
                let num = 0;
                for (let i = 0; i < gVar.ForbiddenChars.length; i++) {
                    if (fileName.indexOf(gVar.ForbiddenChars[i]) !== -1) {
                        saveTitle = langSurface.prompts.saveAs.errorInvalidCharsSaveTitle[gVar.langs()];
                        break;  // 如果检出非法字符，则num肯定不等于gVar.ForbiddenChars.length - 1
                    }
                    num = i;
                }
                if (num === gVar.ForbiddenChars.length - 1) isFileIncludeForbiddenChars = false;  // 如果文件名内未检出非法字符，则跳出while循环
            }
            // 接下来开始写入文件
            // 先判断保存文件类型：md、mdz和txt
            fileNameList = fileName.split(".");
            let extName = fileNameList.pop();
            // 用正则表达式识别出多媒体Markdown代码
            let mediaMdCodeReg = /!\[([^\]]*)\]\(([^)]+)\)/g;
            // 当然还有一种情况，就是多媒体Markdown代码在“code”内时，是绝对不能修改任何内容的（包括内联 `code` 和块 ```code```）
            // 因此需要先去掉code部分，以“$MAYBE_MEDIA_IN_CODE<index>”（$MAYBE_MEDIA_IN_CODE0、$MAYBE_MEDIA_IN_CODE1）或“$MAYBE_MEDIA_IN_INLINE_CODE<index>”等临时代替
            // 等替换完剩下的media代码后，再把code重新替换回去

            let codeBlockMdCodeReg = /```\s*(\w+)?\s*\n?([\s\S]*?)\n?```/g;  // 匹配代码块
            let inlineCodeMdCodeReg = /(?<!\\)`([^`\n]+)(?<!\\)`/g;  // 匹配内联代码
            let match;
            let codeResult = {
                inline: [],
                block: [],
            };
            // 先匹配代码块
            let block_num = 0;
            while ((match = codeBlockMdCodeReg.exec(content)) !== null) {
                content = content.replace(match[0], `$MAYBE_MEDIA_IN_CODE${block_num}`);
                codeResult.block.push({
                    type: 'block',
                    language: match[1] || 'text',
                    content: match[2].trim(),
                    raw: match[0],
                    position: match.index
                });
                block_num++;
            }

            // 再匹配内联代码
            let inline_num = 0;
            while ((match = inlineCodeMdCodeReg.exec(content)) !== null) {
                content = content.replace(match[0], `$MAYBE_MEDIA_IN_INLINE_CODE${inline_num}`);
                codeResult.inline.push({
                    type: 'inline',
                    content: match[1],
                    raw: match[0],
                    position: match.index
                });
                inline_num++;
            }

            let urlReg = /^http(s)*(:\/\/)/;
            let relativePathReg = /(\.|\.\.)(\/|\\)(\S|\s)+/;
            let mdzPathReg = /^(\$MDZ_MEDIA\/)(\S)+/;

            if (extName === "mdz") {
                // 如果在内容中发现了绝对路径或相对路径，则改成mdz文件中特有的路径（多媒体路径$MDZ_MEDIA），并将多媒体收入mdz文件内
                let al = [...content.matchAll(mediaMdCodeReg)].map(match => ({
                    fullMatch: match[0],
                    altText: match[1],
                    imagePath: match[2]
                }));

                // 创建mdz多媒体文件夹
                let savePathList = fileSaveAsPath.split(gVar.pathSep);
                savePathList.pop();  // 去掉文件名
                let root = savePathList.join(gVar.pathSep);
                let mediaFolder = root + gVar.pathSep + "._mdz_content." + fileNameList.join(".") + gVar.pathSep + "mdz_contents" + gVar.pathSep + "media_src";
                fs.mkdirSync(mediaFolder, { recursive: true });
                // 如果是Windows，需要给文件夹设置隐藏属性
                runCommand(process.platform === 'win32' ? `attrib +h ${root + gVar.pathSep + "._mdz_content." + fileNameList.join(".")}` : `echo`, () => {
                    for (let i = 0; i < al.length; i++) {
                        let mediaCodeElement = al[i].fullMatch;
                        let originMediaPath = al[i].imagePath;
                        let mediaFileName = originMediaPath.split(/\/|\\/).pop();
                        let mediaPath = originMediaPath;

                        if (urlReg.test(mediaPath)) continue;  // 判断URL
                        else if (relativePathReg.test(mediaPath)) {
                            // 判断相对路径
                            let savePathList = fileSaveAsPath.split(gVar.pathSep);
                            savePathList.pop();  // 去掉文件名
                            let root = savePathList.join(gVar.pathSep);
                            mediaPath = root + gVar.pathSep + mediaPath;  // 获得多媒体的绝对路径
                        } else if (mdzPathReg.test(mediaPath)) {
                            // 判断是mdz专属路径
                            let originPathList = originPath.split(gVar.pathSep);
                            let oFileName = originPathList.pop();  // 去掉文件名
                            let oFileNameList = oFileName.split(".");
                            oFileNameList.pop();  // 去掉扩展名
                            let oFileNameRmExt = oFileNameList.join(".");
                            let oRoot = originPathList.join(gVar.pathSep);
                            mediaPath = oRoot + gVar.pathSep + "._mdz_content." + oFileNameRmExt + gVar.pathSep + "mdz_contents" + gVar.pathSep + "media_src" + gVar.pathSep + mediaFileName;
                            // 拷贝多媒体至文件夹
                            fs.copyFileSync(mediaPath, mediaFolder + gVar.pathSep + mediaFileName);
                            continue;
                        }
                        // 拷贝多媒体至文件夹
                        fs.copyFileSync(mediaPath, mediaFolder + gVar.pathSep + mediaFileName);
                        // 最后修改路径为$MDZ_MEDIA
                        let modifiedMediaCode = mediaCodeElement.replace(originMediaPath, `$MDZ_MEDIA/${mediaFileName}`);
                        // 新代码替换旧代码
                        content = content.replace(mediaCodeElement, modifiedMediaCode);
                    }

                    // 将代码块替换回来
                    for (let i = 0; i < codeResult.inline.length; i++)
                        content = content.replace(`$MAYBE_MEDIA_IN_INLINE_CODE${i}`, codeResult.inline[i].raw);
                    for (let i = 0; i < codeResult.block.length; i++)
                        content = content.replace(`$MAYBE_MEDIA_IN_CODE${i}`, codeResult.block[i].raw);

                    // 写入md文件内容至文件夹
                    fs.writeFileSync(root + gVar.pathSep + "._mdz_content." + fileNameList.join(".") + gVar.pathSep + "mdz_contents" + gVar.pathSep + fileNameList.join(".") + ".md",
                        content, 'utf8');
                    // 打包mdz
                    rwMdz.writeMdz(root + gVar.pathSep + "._mdz_content." + fileNameList.join("."), password);

                    // 删除原文件的临时目录
                    let originPathList = originPath.split(gVar.pathSep);
                    let oFileName = originPathList.pop();  // 去掉文件名
                    let oFileNameList = oFileName.split(".");
                    oFileNameList.pop();  // 去掉扩展名
                    let oFileNameRmExt = oFileNameList.join(".");
                    let oRoot = originPathList.join(gVar.pathSep);
                    fs.rmSync(oRoot + gVar.pathSep + "._mdz_content." + oFileNameRmExt, {recursive: true});
                });
            } else if (extName === "md" || extName === "txt") {
                // 如果在内容中发现了mdz文件中特有的内容（多媒体路径$MDZ_MEDIA），则修改其中的路径，并将mdz文件中的多媒体放在保存目录的一个文件夹内
                let al = [...content.matchAll(mediaMdCodeReg)].map(match => ({
                    fullMatch: match[0],
                    altText: match[1],
                    imagePath: match[2]
                }));
                for (let i = 0; i < al.length; i++) {
                    let mediaCodeElement = al[i].fullMatch;
                    let originMediaPath = al[i].imagePath;
                    let mediaFileName = originMediaPath.split(/\/|\\/).pop();
                    let mediaPath = originMediaPath;

                    if (urlReg.test(mediaPath)) continue;  // 判断URL
                    else if (mdzPathReg.test(mediaPath)) {
                        // 判断有mdz专属路径
                        let savePathList = fileSaveAsPath.split(gVar.pathSep);
                        let sFileName = savePathList.pop();
                        let mdMediaFolderPathRoot = savePathList.join(gVar.pathSep) + gVar.pathSep + sFileName + ".media_dir" + gVar.pathSep;
                        if (!fs.existsSync(mdMediaFolderPathRoot)) fs.mkdirSync(mdMediaFolderPathRoot);
                        // 拷贝多媒体文件至新建文件夹
                        let originPathList = originPath.split(gVar.pathSep);
                        let oFileName = originPathList.pop();  // 去掉文件名
                        let oFileNameList = oFileName.split(".");
                        oFileNameList.pop();  // 去掉扩展名
                        let oFileNameRmExt = oFileNameList.join(".");
                        let oRoot = originPathList.join(gVar.pathSep);
                        mediaPath = oRoot + gVar.pathSep + "._mdz_content." + oFileNameRmExt + gVar.pathSep + "mdz_contents" + gVar.pathSep + "media_src" + gVar.pathSep + mediaFileName;
                        // 拷贝多媒体至文件夹
                        fs.copyFileSync(mediaPath, mdMediaFolderPathRoot + gVar.pathSep + mediaFileName);
                        // 最后修改路径为相对路径
                        let modifiedMediaCode = mediaCodeElement.replace(originMediaPath, `.${gVar.pathSep}${sFileName + ".media_dir"}${gVar.pathSep}${mediaFileName}`);
                        // 新代码替换旧代码
                        content = content.replace(mediaCodeElement, modifiedMediaCode);
                    }
                }

                // 将代码块替换回来
                for (let i = 0; i < codeResult.inline.length; i++)
                    content = content.replace(`$MAYBE_MEDIA_IN_INLINE_CODE${i}`, codeResult.inline[i].raw);
                for (let i = 0; i < codeResult.block.length; i++)
                    content = content.replace(`$MAYBE_MEDIA_IN_CODE${i}`, codeResult.block[i].raw);

                fs.writeFileSync(fileSaveAsPath, content, 'utf8');
            }

            // 最后一步，如果是已保存的文件，则消除打开的临时历史记录
            if (originPath) settingsConfigManager.deleteInstantHistoryRecords(originPath);
            return [fileName, fileSaveAsPath];
        });

        ipcMain.handle('get-permanent-history', (event) => {
            return [settingsConfigManager.getAllPermanentHistoryRecords(), process.platform === 'win32' ? '\\' : '/'];
        });

        ipcMain.handle('delete-permanent-history', (event, path, all) => {
            if (!all) settingsConfigManager.deletePermanentHistoryRecords(path);
            else settingsConfigManager.deletePermanentHistoryRecords(path, all);
            return 0;
        });
        ipcMain.handle('get-version', (event) => {
            return gVar.getVersion()[1];
        });
    };
}

module.exports = CommonIpc;
