const { ipcMain } = require("electron");
const path = require("node:path");
const SqliteMan = require(path.join(__dirname, "../libs/sqliteman"));
const ConfirmDialog = require(path.join(__dirname, "../dialogs/dialogs"));


function ForWork() {
    this.workIpcMain = (mainWin) => {
        let windowId = mainWin.id;  // 获取window Id，使创建的ipc唯一

        ipcMain.handle('load-storage-settings' + windowId, async (event, instruction) => {
            /**
             * 从硬盘上的本地Sqlite数据库读取settings
             */
            const settingsConfigManager = new SqliteMan.SettingsConfigManager();
            return Number(settingsConfigManager.getSettings(instruction));
        });
        ipcMain.handle('settings-cancel-option' + windowId, (event) => {
            /**
             * 点击“取消”时弹出确认关闭不保存设置弹框
             */
            mainWin.focus();
            let warningConfirmDialogChosen = new ConfirmDialog();
            return warningConfirmDialogChosen.confirm(
                mainWin,
                "warning",
                ["不关闭", "关闭"],
                1,
                '设置未应用',
                '您有设置未应用，要直接关闭“设置”窗口吗？如选择“关闭”，改动将不会应用。',
                0
            );  // 返回true则直接关闭设置对话框
        });
        ipcMain.handle('settings-confirm-option' + windowId, (event, instructionList) => {
            /**
             * 点击“应用更改”时弹出确认应用设置弹框
             */
            mainWin.focus();
            let warningConfirmDialogChosen = new ConfirmDialog();
            if (instructionList.length > 0) {  // 有更改的设置
                if (warningConfirmDialogChosen.confirm(
                    mainWin,
                    "warning",
                    ["取消", "应用"],
                    1,
                    '确认应用',
                    '您确定应用刚才更改的设置吗？如选择“应用”，程序将重新启动，请注意保存您的数据。',
                    0
                )) {  // 返回true则应用重启应用设置
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
                warningConfirmDialogChosen.confirm(
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
        ipcMain.handle('settings-reset-option' + windowId, (event) => {
            /**
             * 点击“重置”时弹出确认应用设置弹框
             */
            mainWin.focus();
            let warningConfirmDialogChosen = new ConfirmDialog();
            if (warningConfirmDialogChosen.confirm(
                mainWin,
                "warning",
                ["取消", "重置"],
                1,
                '确认重置',
                '您确定重置本程序的所有设置吗？',
                0
            )) {  // 返回true则应用重置设置
                // 写入sqlite
                let settingsConfigManager = new SqliteMan.SettingsConfigManager();
                settingsConfigManager.deleteSettingsConfig();
                settingsConfigManager.initSettingsConfig();
                return true;
            }
            return false;
        });
    };
}

module.exports = ForWork;
