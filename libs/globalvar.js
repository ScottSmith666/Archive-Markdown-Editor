"use strict";

function GlobalVar() {
    /**
     * 全局变量控制器
     * @type {null}
     */
    // 是否开启debug模式（即运行软件就默认启动Chromium开发者工具）
    this.DEBUG = false;
    // 检查文件名的合法性，以下符号禁止出现在文件名中，因此无法指定含有下列字符的文件名，如有存在这些字符的文件也将被禁止打开
    this.ForbiddenChars = [">", "<", ":", "\"", "'", "/", "\\", "|", "*", "?"]
    // 文件名长度不准大于以下值
    this.MaxFileNameLength = 200;
    // 定义不同系统的文件路径分隔符
    this.pathSep = (process.platform === 'win32') ? '\\' : '/';
}

module.exports = GlobalVar;
