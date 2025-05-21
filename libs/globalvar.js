"use strict";

function GlobalVar() {
    /**
     * 全局变量控制器
     * @type {null}
     */
    this.DEBUG = false;  // 是否开启debug模式（即运行软件就默认启动Chromium开发者工具）
}

module.exports = GlobalVar;
