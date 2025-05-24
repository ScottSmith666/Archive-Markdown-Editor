const {ipcMain, app, shell} = require("electron");
const path = require("node:path");
const SqliteMan = require(path.join(__dirname, "../libs/sqliteman"));
const ConfirmDialog = require(path.join(__dirname, "../dialogs"));
const LanguageLocale = require(path.join(__dirname, "../libs/languages"));
const GlobalVar = require(path.join(__dirname, "../libs/globalvar"));

function ForMain() {
    this.mainIpcMain = (mainWin) => {
        let gVar = new GlobalVar();
        ipcMain.handle('load-storage-settings', async (event, instruction) => {
            /**
             * 从硬盘上的本地Sqlite数据库读取settings
             */
            const settingsConfigManager = new SqliteMan.SettingsConfigManager();
            return Number(settingsConfigManager.getSettings(instruction));
        });
        ipcMain.handle('settings-cancel-option', (event) => {
            /**
             * 点击“取消”时弹出确认关闭不保存设置弹框
             */
            mainWin.focus();
            let warningConfirmDialogChosen = new ConfirmDialog(
                mainWin,
                "warning",
                ["不关闭", "关闭"],
                1,
                '设置未应用',
                '您有设置未应用，要直接关闭“设置”窗口吗？如选择“关闭”，改动将不会应用。',
                0
            );
            return warningConfirmDialogChosen.confirm;  // 返回true则直接关闭设置对话框
        });
        ipcMain.handle('settings-confirm-option', (event, instructionList) => {
            /**
             * 点击“应用更改”时弹出确认应用设置弹框
             */
            mainWin.focus();
            if (instructionList.length > 0) {  // 有更改的设置
                let warningConfirmDialogChosen = new ConfirmDialog(
                    mainWin,
                    "warning",
                    ["取消", "应用"],
                    1,
                    '确认应用',
                    '您确定应用刚才更改的设置吗？如选择“应用”，程序将重新启动，请注意保存您的数据。',
                    0
                );
                if (warningConfirmDialogChosen.confirm) {  // 返回true则应用重启应用设置
                    let settingsConfigManager = new SqliteMan.SettingsConfigManager();
                    // 写入sqlite
                    for (let instruction of instructionList) {
                        settingsConfigManager.setSettings(
                            instruction.instructions,
                            instruction.settings_value,
                            settingsConfigManager.settingsInstructionsIsExists(instruction.instructions) ? "update" : "insert",
                        );
                    }
                    return true;
                }
            } else {  // 没有更改的设置，提示不需要应用
                new ConfirmDialog(
                    mainWin,
                    "warning",
                    ["确定"],
                    1,
                    '应用提示',
                    '您未更改任何设置，无需进行应用。',
                    0
                );
            }
            return false;
        });
        ipcMain.handle('settings-reset-option', (event) => {
            /**
             * 点击“重置”时弹出确认应用设置弹框
             */
            mainWin.focus();
            let warningConfirmDialogChosen = new ConfirmDialog(
                mainWin,
                "warning",
                ["取消", "重置"],
                1,
                '确认重置',
                '您确定重置本程序的所有设置吗？',
                0
            );
            if (warningConfirmDialogChosen.confirm) {  // 返回true则应用重置设置
                // 写入sqlite
                let settingsConfigManager = new SqliteMan.SettingsConfigManager();
                settingsConfigManager.deleteSettingsConfig();
                settingsConfigManager.initSettingsConfig();
                return true;
            }
            return false;
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
        ipcMain.handle('switch-debug', async (event) => {
            /**
             * 开启/关闭DEBUG选项，便于调试
             */
            return gVar.DEBUG;
        });
        // 通过默认浏览器打开外部链接
        ipcMain.on('open-url', (event, url) => {
            shell.openExternal(url);
        });
    };
}

module.exports = ForMain;
