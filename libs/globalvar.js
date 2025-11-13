"use strict";

const path = require("node:path");
const SqliteMan = require(path.join(__dirname, "./sqliteman"));
const fs = require("fs");


function GlobalVar() {
    /**
     * 全局变量控制器
     * @type {null}
     */
    // 是否开启debug模式（即运行软件就默认启动Chromium开发者工具）
    this.DEBUG = false;
    // 检查文件名的合法性，以下符号禁止出现在文件名中，因此无法指定含有下列字符的文件名，如有存在这些字符的文件也将被禁止打开
    this.ForbiddenChars = [">", "<", ":", "\"", "'", "/", "\\", "|", "*", "?", " "];
    // 文件名长度不准大于以下值
    this.MaxFileNameLength = 200;
    // 定义不同系统的文件路径分隔符
    this.pathSep = (process.platform === 'win32') ? '\\' : '/';
    // 常见视频文件的扩展名
    this.videoExts = ["mp4", "mov", "webm", "avi", "wmv", "flv", "mkv", "m4v", "mpeg", "ts"];
    // 常见音频文件的扩展名
    this.audioExts = ["mp3", "wav", "flac", "ogg", "wma", "aac", "m4a"];
    // 常见图片文件的扩展名
    this.imageExts = ["jpg", "jpeg", "tif", "tiff", "gif", "bmp", "svg", "png"];
    // 常见压缩包的扩展名
    this.compressExts = ["zip", "7z", "rar", "gz", "tar", "zstd", "bz2", "xz", "iso", "img", "dmg", "docx", "pptx", "xlsx", "mdz"];
    // 获取数据库中的语言设置
    this.langs = () => {
        /**
         * 从硬盘上的本地Sqlite数据库读取settings
         */
        const settingsConfigManager = new SqliteMan.SettingsConfigManager();
        return Number(settingsConfigManager.getSettings("lang_index"));
    };
    this.getVersion = () => {
        const packageJsonPath = path.join(__dirname, '../package.json');
        // 读取并解析package.json文件
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        // 获取包名
        const appName = packageJson.name;
        const version = packageJson.version;
        return [appName, version];
    };
}

module.exports = GlobalVar;
