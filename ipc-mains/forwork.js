const { ipcMain } = require("electron");
const path = require("node:path");
const SqliteMan = require(path.join(__dirname, "../libs/sqliteman"));
const ConfirmDialog = require(path.join(__dirname, "../dialogs/dialogs"));
const GlobalVar = require(path.join(__dirname, "..", "libs", "globalvar"));  // 全局变量模块引入
const LanguageLocale = require(path.join(__dirname, "..", "libs", "languages"));


let gVar = new GlobalVar();
let langSurface = new LanguageLocale().operationsInstructions();

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
                [
                    langSurface.prompts.confirmWithoutApplySettings.cancelButton[gVar.langs()],
                    langSurface.prompts.confirmWithoutApplySettings.confirmButton[gVar.langs()],
                ],
                1,
                langSurface.prompts.confirmWithoutApplySettings.title[gVar.langs()],
                langSurface.prompts.confirmWithoutApplySettings.description[gVar.langs()],
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
                    [
                        langSurface.prompts.confirmApplySettings.cancelButton[gVar.langs()],
                        langSurface.prompts.confirmApplySettings.confirmButton[gVar.langs()]
                    ],
                    1,
                    langSurface.prompts.confirmApplySettings.title[gVar.langs()],
                    langSurface.prompts.confirmApplySettings.description[gVar.langs()],
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
                    [langSurface.prompts.confirmNeedNotSettings.confirmButton[gVar.langs()]],
                    1,
                    langSurface.prompts.confirmNeedNotSettings.title[gVar.langs()],
                    langSurface.prompts.confirmNeedNotSettings.description[gVar.langs()],
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
                [
                    langSurface.prompts.confirmResetSettings.cancelButton[gVar.langs()],
                    langSurface.prompts.confirmResetSettings.confirmButton[gVar.langs()],
                ],
                1,
                langSurface.prompts.confirmResetSettings.title[gVar.langs()],
                langSurface.prompts.confirmResetSettings.description[gVar.langs()],
                0
            )) {  // 返回true则应用重置设置
                // 写入sqlite
                let settingsConfigManager = new SqliteMan.SettingsConfigManager();
                settingsConfigManager.deleteTable();
                settingsConfigManager.initSettingsConfig();
                return true;
            }
            return false;
        });
    };
}

module.exports = ForWork;
