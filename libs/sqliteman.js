"use strict";

const { DatabaseSync } = require('node:sqlite');
const os = require('os');
const path = require('path');
const fs = require("fs");


// 配置文件置于$HOME目录
const sqliteFilePath = os.homedir() + path.sep + ".archivemdconf" + path.sep + "settings.db";
const settingsDirPath = os.homedir() + path.sep + ".archivemdconf";

function SettingsConfigManager() {
    /**
     * 设置表
     * ----通用----
     * 选择界面语言：lang_index: 0 || 1 || 2，0代表简体中文，1代表繁体中文，2代表English，初始化默认为0
     * ----编辑----
     * 编辑区Tab缩进长度：editor_font_kind: <number>，初始化默认为4
     * 编辑区字体大小：editor_font_size: <number>，初始化默认为12
     * 开启行号：enable_line_num: 1 || 0，1代表"on"，0代表"off"，初始化默认为1
     * 开启代码折叠：enable_code_fold: 1 || 0，1代表true，0代表false，初始化默认为1
     * 开启自动折行：enable_auto_wrap_line: 1 || 0，1代表"on"，0代表"off"，初始化默认为1
     * 开启自动输入闭合引号/括号和成对删除引号/括号: enable_auto_closure: 1 || 0，1代表"always"，0代表"never"，初始化默认为1
     * 显示垂直滚动条：display_vertical_scrollbar: 0 || 1 || 2，0代表"visible"，1代表"auto"，2代表"hidden"，初始化默认为0
     * 显示水平滚动条：display_horizon_scrollbar: 0 || 1 || 2，0代表"visible"，1代表"auto"，2代表"hidden"，初始化默认为0
     * 显示代码缩略图：display_code_scale: 1 || 0，1代表true，0代表false，初始化默认为0
     * 启用编辑器动画效果：display_editor_animation:  1 || 0，1代表true，0代表false，初始化默认为1
     */

    this.initConfigDir = () => {
        /**
         * Step1: 初始化配置文件保存路径（在用户目录））
         */
        fs.mkdirSync(settingsDirPath);
    }

    this.initLangConfig = () => {
        /**
         * Step2: 初始化语言（通用）设置配置文件（第一次启动本软件时）
         */
        console.log("正在初始化语言配置文件...");
        // 配置语言
        const db = new DatabaseSync(sqliteFilePath);
        const create = db.prepare('CREATE TABLE AME_LANGUAGE_CONF (lang_index VARCHAR(100));');
        create.run();
        const insert = db.prepare(`INSERT INTO AME_LANGUAGE_CONF ('lang_index') VALUES (0);`);
        insert.run();
        db.close();
        console.log("初始化语言配置文件完成...");
    }

    this.initEditSettingsConfig = () => {
        /**
         * Step3: 初始化编辑部分默认设置（第一次启动本软件时）
         */
        const db = new DatabaseSync(sqliteFilePath);
        const create = db.prepare(
            'CREATE TABLE AME_EDIT_CONF (instructions VARCHAR(100), settings_value INTEGER);'
        );
        create.run();

        let editSets = [
            {
                instructions: 'editor_tab_size',
                settings_value: 4
            },
            {
                instructions: 'editor_font_size',
                settings_value: 12
            },
            {
                instructions: 'enable_line_num',
                settings_value: 1
            },
            {
                instructions: 'enable_code_fold',
                settings_value: 1
            },
            {
                instructions: 'enable_auto_wrap_line',
                settings_value: 1
            },
            {
                instructions: 'enable_auto_closure',
                settings_value: 1
            },
            {
                instructions: 'display_vertical_scrollbar',
                settings_value: 0
            },
            {
                instructions: 'display_horizon_scrollbar',
                settings_value: 0
            },
            {
                instructions: 'display_code_scale',
                settings_value: 0
            },
            {
                instructions: 'display_editor_animation',
                settings_value: 1
            },
        ];
        let insert = db.prepare(
            `INSERT INTO AME_EDIT_CONF (instructions, settings_value) VALUES (?, ?);`
        );
        for (let set of editSets) {
            insert.run(set.instructions, set.settings_value);
        }
        db.close();
        console.log("初始化编辑配置文件完成...");
    };
}

function initAllConfigs() {
    new SettingsConfigManager().initConfigDir();
    new SettingsConfigManager().initLangConfig();
    new SettingsConfigManager().initEditSettingsConfig();
}

function LanguageConfigManager() {
    /**
     * 设置和读取保存在本地的语言（通用）设置
     * @param langIndex
     */
    this.setLangConfig = (langIndex) => {
        if (!fs.existsSync(sqliteFilePath)) {
            initAllConfigs();
        }
        const db = new DatabaseSync(sqliteFilePath);
        const updateLang = db.prepare("UPDATE AME_LANGUAGE_CONF SET lang_index = " + langIndex);
        updateLang.run();
        db.close();
    }

    this.loadLangConfig = () => {
        if (!fs.existsSync(sqliteFilePath)) {
            initAllConfigs();
        }
        const db = new DatabaseSync(sqliteFilePath);
        const query = db.prepare('SELECT lang_index FROM AME_LANGUAGE_CONF;');
        let langRes = query.all()[0].lang_index
        db.close();
        return langRes;
    }
}

function EditConfigManager() {
    /**
     * 设置和读取保存在本地的编辑设置
     */
    this.setEditConfig = () => {

    };

    this.loadEditConfig = () => {
        if (!fs.existsSync(sqliteFilePath)) {
            initAllConfigs();
        }
        const db = new DatabaseSync(sqliteFilePath);
        const query = db.prepare('SELECT * FROM AME_EDIT_CONF;');
        let langRes = query.all();
        db.close();
        return langRes;
    };
}

module.exports = {
    LanguageConfigManager,
    EditConfigManager,
};
