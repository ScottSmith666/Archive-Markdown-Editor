// sqlite管理模块

"use strict";

const { DatabaseSync } = require('node:sqlite');
const os = require('os');
const path = require('path');
const fs = require("fs");


// ---- 所有设置项和默认值START ----
/**
 * 设置表
 * ----通用 instruction（指令）----
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
function SettingsConfigManager() {
    /**
     * 初始化、读取和写入硬盘上的“设置”sqlite数据库
     * “AME”是“Archive Markdown Editor”的缩写
     */
    this.SETTINGS_TABLE_NAME = 'AME_SETTINGS_CONF';  // 放置“设置”内容的数据表
    this.INSTANT_AND_PERMANENT_OPEN_HISTORY = 'AME_INSTANT_AND_PERMANENT_OPEN_HISTORY';  // 放置“打开的文件路径”历史记录的数据表
    this.SETTINGS_TABLE_COL_AND_TYPES = [  // 定义AME_SETTINGS_CONF表的数据类型
        {
            "colName": "instructions",
            "colType": "VARCHAR(100)",
        },
        {
            "colName": "settings_value",
            "colType": "INTEGER",
        },
    ];
    this.INSTANT_AND_PERMANENT_OPEN_HISTORY_COL_AND_TYPES = [  // 定义AME_INSTANT_AND_PERMANENT_OPEN_HISTORY表的数据类型
        {
            "colName": "open_timestamp",
            "colType": "BIGINT",
        },
        {
            "colName": "open_datetime",
            "colType": "VARCHAR(100)",
        },
        {
            "colName": "opened_file_path",
            "colType": "TEXT",
        },
        {
            // type是区分“临时历史记录”和“持久化历史记录”的字段
            // “临时历史记录”用于指示文件是否打开，文件关闭时立即删除，用于判断文件是否打开，改进用户体验
            // “持久化历史记录”用于在主页面显示打开记录
            // Optional values: "instant" and "permanent"
            "colName": "type",
            "colType": "VARCHAR(100)",
        },
    ];

    this.PART_OF_TABLE_CREATE
        = (table_structure = this.SETTINGS_TABLE_COL_AND_TYPES) =>
            table_structure.map(
                (item, index) =>
                    `${ item.colName } ${ item.colType }`
            ).join();

    this.PART_OF_TABLE_INSERT
        = (table_structure = this.SETTINGS_TABLE_COL_AND_TYPES) =>
            table_structure.map((item, index) => item.colName).join();

    this.INIT_SETTINGS_ITEMS_KEY_VALUES = [
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

    this.SETTINGS_DIR_PATH = os.homedir() + path.sep + ".archivemdconf";  // 配置文件置于$HOME目录
    this.SQLITE_FILE_PATH = this.SETTINGS_DIR_PATH + path.sep + "settings.db";

    // ---- 数据库操作部分START ----
    /**
     * 数据库操作部分
     * 逻辑上是这样运行的：
     * Step1. 判断有没有放sqliteDB文件的路径（$HOME/.archivemdconf），没有则创建一个
     * Step2. 在Step1成立的前提下（即存在放sqliteDB文件的路径），判断有没有sqliteDB（settings.db），没有则创建一个
     * Step3. 在Step2成立的前提下，判断有没有sqlite数据表（AME_SETTINGS_CONF），没有则创建一个
     * Step4. 在Step3成立的前提下，判断表中“instructions”有没有相应的设置指令，没有则创建一个，并指定默认值。
     */
    this.initConfigDir = () => {
        /**
         * Step1: 初始化配置文件保存路径（在用户目录，文件夹名称：.archivemdconf）
         */
        fs.mkdirSync(this.SETTINGS_DIR_PATH);
    }

    this.initSettingsDB = () => {
        /**
         * Step2: 初始化配置文件数据库
         */
        const db = new DatabaseSync(this.SQLITE_FILE_PATH);
        db.close();
    };

    this.initTable = (tableName = this.SETTINGS_TABLE_NAME,
                              tableCreateTemplate = this.PART_OF_TABLE_CREATE()) => {
        /**
         * Step3: 初始化配置文件数据表 in 数据库
         */
        const db = new DatabaseSync(this.SQLITE_FILE_PATH);
        const create = db.prepare(
            `CREATE TABLE ${ tableName } ( ${ tableCreateTemplate } );`
        );
        create.run();
        db.close();
    };

    this.initSettingsConfig = () => {
        /**
         * Step4: 初始化默认设置
         */
        if (!this.dirIsExists()) this.initConfigDir();  // 存放sqliteDB文件的路径不存在，则创建
        if (!this.dbFileIsExists()) this.initSettingsDB();  // 如果sqliteDB文件不存在，则新建db并读取，如存在，则正常读取
        if (!this.tableIsExists()) this.initTable();  // 如果settings sqlite数据表不存在，则新建一个
        if (!this.tableIsExists(this.INSTANT_AND_PERMANENT_OPEN_HISTORY)) // 如果history sqlite数据表不存在，则新建一个
            this.initTable(
                this.INSTANT_AND_PERMANENT_OPEN_HISTORY,
                this.PART_OF_TABLE_CREATE(this.INSTANT_AND_PERMANENT_OPEN_HISTORY_COL_AND_TYPES),
            );
        // 开始写入设置部分默认值
        const db = new DatabaseSync(this.SQLITE_FILE_PATH);
        let insert = db.prepare(
            `INSERT INTO ${ this.SETTINGS_TABLE_NAME } (${ this.PART_OF_TABLE_INSERT() }) VALUES (?, ?);`
        );
        for (let set of this.INIT_SETTINGS_ITEMS_KEY_VALUES) {  // settings记录循环写入
            if (!this.settingsInstructionsIsExists(set.instructions))
                insert.run(set.instructions, set.settings_value);
        }
        db.close();
    };

    this.deleteTable = (tableName = this.SETTINGS_TABLE_NAME) => {
        /**
         * 删除数据表
         */
        const db = new DatabaseSync(this.SQLITE_FILE_PATH);
        let deleteTable = db.prepare(`DROP TABLE ${ tableName };`);
        deleteTable.run();
        db.close();
    };

    this.deleteInstantHistoryRecords = (path, allPath = false) => {
        /**
         * 删除临时历史记录
         */
        const db = new DatabaseSync(this.SQLITE_FILE_PATH);
        if (allPath) {
            let deleteRecords =
                db.prepare(`DELETE
                            FROM ${this.INSTANT_AND_PERMANENT_OPEN_HISTORY}
                            WHERE type = ?;`);
            deleteRecords.run('instant');
        } else {
            let deleteRecords =
                db.prepare(`DELETE
                            FROM ${this.INSTANT_AND_PERMANENT_OPEN_HISTORY}
                            WHERE type = ?
                              AND opened_file_path = ?;`);
            deleteRecords.run('instant', path);
        }
        db.close();
    };

    this.deletePermanentHistoryRecords = (path, allPath = false) => {
        /**
         * 删除持久化历史记录
         */
        const db = new DatabaseSync(this.SQLITE_FILE_PATH);
        if (allPath) {
            let deleteRecords =
                db.prepare(`DELETE
                            FROM ${this.INSTANT_AND_PERMANENT_OPEN_HISTORY}
                            WHERE type = ?;`);
            deleteRecords.run('permanent');
        } else {
            let deleteRecords =
                db.prepare(`DELETE
                            FROM ${this.INSTANT_AND_PERMANENT_OPEN_HISTORY}
                            WHERE type = ?
                              AND opened_file_path = ?;`);
            deleteRecords.run('permanent', path);
        }
        db.close();
    };

    this.getAllPermanentHistoryRecords = () => {
        /**
         * 获得所有持久化历史记录
         */
        const db = new DatabaseSync(this.SQLITE_FILE_PATH);
        const query =
            // SETTINGS_TABLE_COL_AND_TYPES[0].colName表示选表中第一个列作为筛选条件
            db.prepare(`SELECT * FROM ${ this.INSTANT_AND_PERMANENT_OPEN_HISTORY } WHERE type=?;`);
        let queryResult = query.all('permanent');
        db.close();
        return queryResult;
    }

    // ---- 数据库操作部分END ----

    // ---- 判断部分START ----
    /**
     * 软件运行时可能遇到这些情况：
     * 1. 没有放sqliteDB文件的路径
     * 2. 有放sqliteDB文件的路径，但没有sqliteDB文件（settings.db）
     * 3. 有sqliteDB文件，但没有sqlite数据表（AME_SETTINGS_CONF）
     * 4. 有sqlite数据表（AME_SETTINGS_CONF），但表中“instructions”没有相应的设置指令
     */
    this.dirIsExists = () => fs.existsSync(this.SETTINGS_DIR_PATH);  // 判断存放sqliteDB文件的路径是否存在

    this.dbFileIsExists = () => fs.existsSync(this.SQLITE_FILE_PATH);  // 判断sqliteDB文件是否存在

    this.tableIsExists = (tableName = this.SETTINGS_TABLE_NAME) => {
        /**
         * 判断sqlite数据表是否存在
         * @type {module:node:sqlite.DatabaseSync}
         */
        const db = new DatabaseSync(this.SQLITE_FILE_PATH);
        const tableExists = db.prepare(`PRAGMA table_info(${ tableName });`).all();
        db.close();
        return (tableExists.length !== 0);
    };

    this.settingsInstructionsIsExists = (instructionName) => {
        /**
         * 判断表中是否存在“instructions”相应的设置指令
         */
        const db = new DatabaseSync(this.SQLITE_FILE_PATH);
        const query =
            // SETTINGS_TABLE_COL_AND_TYPES[0].colName表示选表中第一个列作为筛选条件
            db.prepare(`SELECT * FROM ${ this.SETTINGS_TABLE_NAME } WHERE ${ this.SETTINGS_TABLE_COL_AND_TYPES[0].colName }='${ instructionName }';`).all();
        db.close();
        return (query.length !== 0);
    }

    this.recentPermanentHistoryIsExists = (path) => {
        /**
         * 判断以前的历史记录有没有同路径，返回true则说明有同路径
         */
        const db = new DatabaseSync(this.SQLITE_FILE_PATH);
        const query =
            db.prepare(`SELECT * FROM ${ this.INSTANT_AND_PERMANENT_OPEN_HISTORY } WHERE opened_file_path=? AND type=?;`);
        let queryResult = query.all(path, 'permanent');
        db.close();
        return (queryResult.length !== 0);
    };

    this.openHistoryIsExists = (path) => {
        /**
         * 判断历史记录表中是否存在即时打开记录，如果没有则插入path
         */
        if (!path) return path;
        const db = new DatabaseSync(this.SQLITE_FILE_PATH);
        const query =
            // SETTINGS_TABLE_COL_AND_TYPES[0].colName表示选表中第一个列作为筛选条件
            db.prepare(`SELECT * FROM ${ this.INSTANT_AND_PERMANENT_OPEN_HISTORY } WHERE opened_file_path=? AND type=?;`);
        let queryResult = query.all(path, 'instant');
        if (queryResult.length !== 0) {
            db.close();
            return true;
        } else {
            let dateStr = new Date().toLocaleString();
            let tms = new Date().getTime();
            let insertRecord = db.prepare(`INSERT INTO ${ this.INSTANT_AND_PERMANENT_OPEN_HISTORY } VALUES (?, ?, ?, ?);`);
            let updateRecord = db.prepare(`UPDATE ${ this.INSTANT_AND_PERMANENT_OPEN_HISTORY } SET open_timestamp=?, open_datetime=? WHERE opened_file_path=?;`);
            insertRecord.run(tms, dateStr, path, 'instant');
            if (this.recentPermanentHistoryIsExists(path)) updateRecord.run(tms, dateStr, path);
            else insertRecord.run(tms, dateStr, path, 'permanent');
            db.close();
            return false;
        }
    };
    // ---- 判断部分END ----

    this.getSettings = (instruction, applyCondition = true) => {
        /**
         * 读取设置内容
         */
        let condition
            = applyCondition ? ` WHERE ${ this.SETTINGS_TABLE_COL_AND_TYPES[0].colName }='${ instruction }'` : '';
        this.initSettingsConfig();  // 如不存在则初始化
        const db = new DatabaseSync(this.SQLITE_FILE_PATH);
        const query =
            db.prepare(`SELECT * FROM ${ (this.SETTINGS_TABLE_NAME + condition) };`).all();
        db.close();
        return applyCondition ? query[0].settings_value : query.length;
    };

    this.setSettings = (instruction, value, type = "update") => {  // type = "update" or "insert"
        /**
         * 写入新设置内容
         */
        this.initSettingsConfig();  // 如不存在则初始化
        const db = new DatabaseSync(this.SQLITE_FILE_PATH);
        let inst = (type === "update")
            ? db.prepare(`UPDATE ${ this.SETTINGS_TABLE_NAME } SET settings_value = ${ value } WHERE ${ this.SETTINGS_TABLE_COL_AND_TYPES[0].colName }='${ instruction }';`)
            : db.prepare(`INSERT INTO ${ this.SETTINGS_TABLE_NAME } VALUES (${ instruction }, ${ value });`);
        inst.run();
        db.close();
    };
}

module.exports = {
    SettingsConfigManager,
};
