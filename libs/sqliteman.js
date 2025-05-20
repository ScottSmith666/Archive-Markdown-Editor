// sqlite管理模块

"use strict";

const { DatabaseSync } = require('node:sqlite');
const os = require('os');
const path = require('path');
const fs = require("fs");


// ---- 所有设置项和默认值START ----
/**
 * 设置表
 * ----通用 instruction----
 * 选择界面语言：lang_index: 0 || 1 || 2，0代表简体中文，1代表繁体中文，2代表English，初始化默认为0
 * ----编辑 instructions----
 * 编辑区Tab缩进长度：editor_tab_size: <number>，初始化默认为4
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
const SETTINGS_TABLE_NAME = 'AME_SETTINGS_CONF';
const SETTINGS_TABLE_COL_AND_TYPES = [
    {
        "colName": "instructions",
        "colType": "VARCHAR(100)",
    },
    {
        "colName": "settings_value",
        "colType": "INTEGER",
    },
];
const PART_OF_SETTINGS_TABLE_CREATE
    = SETTINGS_TABLE_COL_AND_TYPES.map(
        (item, index) => `${ item.colName } ${ item.colType }`
    ).join();
const PART_OF_SETTINGS_TABLE_INSERT
    = SETTINGS_TABLE_COL_AND_TYPES.map((item, index) => item.colName).join();

const INIT_SETTINGS_ITEMS_KEY_VALUES = [
    {
        instructions: 'lang_index',
        settings_value: 0,
    },
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
// ---- 所有设置项和默认值END ----

const SETTINGS_DIR_PATH = os.homedir() + path.sep + ".archivemdconf";  // 配置文件置于$HOME目录
const SQLITE_FILE_PATH = SETTINGS_DIR_PATH + path.sep + "settings.db";

function SettingsConfigManager(memory = false) {
    /**
     * 初始化、读取和写入硬盘上的“设置”sqlite数据库
     */

    // ---- 数据库操作部分START ----
    /**
     * 数据库操作部分
     * 逻辑上是这样运行的：
     * Step1. 判断有没有放sqliteDB文件的路径（$HOME/.archivemdconf），没有则创建一个
     * Step2. 在Step1成立的前提下（即存在放sqliteDB文件的路径），判断有没有sqliteDB（settings.db），没有则创建一个
     * Step3. 在Step2成立的前提下，判断有没有sqlite数据表（AME_SETTINGS_CONF），没有则创建一个
     * Step4. 在Step3成立的前提下，判断表中“instructions”有没有相应的设置指令，没有则创建一个，并指定默认值。
     * 注1. 当数据库路径为“:memory:”时，不需要判断数据库文件路径存在与否。
     */

    let dbPath = memory ? ":memory:" : SQLITE_FILE_PATH;

    this.initConfigDir = () => {
        /**
         * Step1: 初始化配置文件保存路径（在用户目录，文件夹名称：.archivemdconf），只能在memory = false的时候起作用
         */
        if (!memory) fs.mkdirSync(SETTINGS_DIR_PATH);
        else console.log("当数据库路径为“:memory:”时调用this.initConfigDir()函数不合适！");
    }

    this.initSettingsDB = () => {
        /**
         * Step2: 初始化配置文件数据库
         */
        const db = new DatabaseSync(dbPath);
        db.close();
    };

    this.initSettingsTable = () => {
        /**
         * Step3: 初始化配置文件数据表 in 数据库
         */
        const db = new DatabaseSync(dbPath);
        const create = db.prepare(
            `CREATE TABLE ${ SETTINGS_TABLE_NAME } ( ${ PART_OF_SETTINGS_TABLE_CREATE } );`
        );
        create.run();
        db.close();
    };

    this.initSettingsConfig = () => {
        /**
         * Step4: 初始化默认设置
         */
        if (!memory) {
            if (!this.dirIsExists()) this.initConfigDir();  // 存放sqliteDB文件的路径不存在，则创建
            if (!this.dbFileIsExists()) this.initSettingsDB();  // 如果sqliteDB文件不存在，则新建db并读取，如存在，则正常读取
            if (!this.settingsTableIsExists()) this.initSettingsTable();  // 如果sqlite数据表不存在，则新建一个
            // 开始写入设置部分默认值
            const db = new DatabaseSync(dbPath);
            let insert = db.prepare(
                `INSERT INTO ${ SETTINGS_TABLE_NAME } (${ PART_OF_SETTINGS_TABLE_INSERT }) VALUES (?, ?);`
            );
            for (let set of INIT_SETTINGS_ITEMS_KEY_VALUES) {  // settings记录循环写入
                if (!this.settingsInstructionsIsExists(set.instructions)) insert.run(set.instructions, set.settings_value);
            }
            db.close();
        } else {
            if (!this.settingsTableIsExists()) this.initSettingsTable();  // 如果sqlite数据表不存在，则新建一个
        }
    };

    this.deleteSettingsConfig = () => {
        /**
         * 删除数据表
         */
        const db = new DatabaseSync(dbPath);
        let deleteTable = db.prepare(`DROP TABLE ${ SETTINGS_TABLE_NAME };`);
        deleteTable.run();
        db.close();
    };

    // ---- 数据库操作部分END ----

    // ---- 判断部分START ----
    /**
     * 软件运行时可能遇到这些情况：
     * 1. 没有放sqliteDB文件的路径
     * 2. 有放sqliteDB文件的路径，但没有sqliteDB文件（settings.db）
     * 3. 有sqliteDB文件，但没有sqlite数据表（AME_SETTINGS_CONF）
     * 4. 有sqlite数据表（AME_SETTINGS_CONF），但表中“instructions”没有相应的设置指令
     */
    this.dirIsExists = () => fs.existsSync(SETTINGS_DIR_PATH);  // 判断存放sqliteDB文件的路径是否存在

    this.dbFileIsExists = () => fs.existsSync(dbPath);  // 判断sqliteDB文件是否存在

    this.settingsTableIsExists = () => {
        /**
         * 判断sqlite数据表是否存在
         * @type {module:node:sqlite.DatabaseSync}
         */
        const db = new DatabaseSync(dbPath);
        const tableExists = db.prepare(`PRAGMA table_info(${ SETTINGS_TABLE_NAME });`).all();
        db.close();
        return (tableExists.length !== 0);
    };

    this.settingsInstructionsIsExists = (instructionName) => {
        /**
         * 判断表中是否存在“instructions”相应的设置指令
         */
        const db = new DatabaseSync(dbPath);
        const query =
            // SETTINGS_TABLE_COL_AND_TYPES[0].colName表示选表中第一个列作为筛选条件
            db.prepare(`SELECT * FROM ${ SETTINGS_TABLE_NAME } WHERE ${ SETTINGS_TABLE_COL_AND_TYPES[0].colName }='${ instructionName }';`).all();
        db.close();
        return (query.length !== 0);
    }
    // ---- 判断部分END ----

    this.getSettings = (instruction, applyCondition = true) => {
        /**
         * 读取设置内容
         */
        let condition
            = applyCondition ? ` WHERE ${ SETTINGS_TABLE_COL_AND_TYPES[0].colName }='${ instruction }'` : '';
        this.initSettingsConfig();  // 如不存在则初始化
        const db = new DatabaseSync(dbPath);
        const query =
            db.prepare(`SELECT * FROM ${ (SETTINGS_TABLE_NAME + condition) };`).all();
        db.close();
        return applyCondition ? query[0].settings_value : query.length;
    };

    this.setSettings = (instruction, value, type = "update") => {  // type = "update" or "insert"
        /**
         * 写入新设置内容
         */
        this.initSettingsConfig();  // 如不存在则初始化
        const db = new DatabaseSync(dbPath);
        let inst = (type === "update")
            ? db.prepare(`UPDATE ${ SETTINGS_TABLE_NAME } SET settings_value = ${ value } WHERE ${ SETTINGS_TABLE_COL_AND_TYPES[0].colName }='${ instruction }';`)
            : db.prepare(`INSERT INTO ${ SETTINGS_TABLE_NAME } VALUES (${ instruction }, ${ value });`);
        inst.run();
        db.close();
    };
}

module.exports = {
    SettingsConfigManager,
};
