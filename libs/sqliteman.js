const { DatabaseSync } = require('node:sqlite');
const os = require('os');
const path = require('path');
const fs = require("fs");


const sqliteFilePath = os.homedir() + path.sep + ".archivemdconf" + path.sep + "settings.db";
const settingsDirPath = os.homedir() + path.sep + ".archivemdconf";

function SettingsConfigManager() {

    this.initConfigDir = () => {
        fs.mkdirSync(settingsDirPath);
    }

    this.initLangConfig = () => {
        /**
         * 初始化语言配置文件（刚安装本软件时）
         */
        console.log("正在初始化语言配置文件...");
        // 配置语言
        const db = new DatabaseSync(sqliteFilePath);
        const create = db.prepare('CREATE TABLE AME_LANGUAGE_CONF (lang_index VARCHAR(100));');
        create.run();
        const insert = db.prepare('INSERT INTO AME_LANGUAGE_CONF (lang_index) VALUES (0);');
        insert.run();
        db.close();
        console.log("初始化语言配置文件完成...");
    }

    this.saveSettingsConfig = () => {
    }

    this.resetSettingsConfig = () => {

    }
}

function LanguageConfigManager() {
    this.setLangConfig = (langIndex) => {
        if (!fs.existsSync(sqliteFilePath)) {
            new SettingsConfigManager().initConfigDir();
            new SettingsConfigManager().initLangConfig();
        }
        const db = new DatabaseSync(sqliteFilePath);
        const updateLang = db.prepare("UPDATE AME_LANGUAGE_CONF SET lang_index = " + langIndex);
        updateLang.run();
        db.close();
    }

    this.loadLangConfig = () => {
        if (!fs.existsSync(sqliteFilePath)) {
            new SettingsConfigManager().initConfigDir();
            new SettingsConfigManager().initLangConfig();
        }
        const db = new DatabaseSync(sqliteFilePath);
        const query = db.prepare('SELECT lang_index FROM AME_LANGUAGE_CONF;');
        let langRes = query.all()[0].lang_index
        db.close();
        return langRes;
    }
}

module.exports = {
    LanguageConfigManager,
    SettingsConfigManager,
};
