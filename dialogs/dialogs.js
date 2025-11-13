"use strict";

const { dialog } = require("electron");
const os = require('os');


function Dialogs() {
    /**
     * Confirm dialog function
     * @return true/false (confirm/cancel)
     */

    this.confirm = (windowObject, type, buttonList, defaultButtonIndex, title, content, cancelButtonIndex) => {
        return (1 === dialog.showMessageBoxSync(windowObject, {
            type: type,
            buttons: buttonList,
            defaultId: defaultButtonIndex,
            title: title,
            detail: content,
            cancelId: cancelButtonIndex,
        }));
    };

    this.openFileDialog = () => dialog.showOpenDialogSync({
        /**
         * 打开文件
         */
        title: "打开文件",
        properties: ['openFile'],
        defaultPath: os.homedir(),
        buttonLabel: '打开',
        message: '打开文件',
        filters: [
            { name: 'Markdown File', extensions: ['md'] },
            { name: 'Archive Markdown File', extensions: ['mdz'] },
            { name: 'Text File', extensions: ['txt'] },
        ]
    });

    this.saveFileDialog = (title = "保存文件") => dialog.showSaveDialogSync({
        /**
         * 另存为文件
         */
        title: title,
        defaultPath: os.homedir(),
        buttonLabel: '保存',
        message: title,
        filters: [
            { name: 'Markdown File', extensions: ['md'] },
            { name: 'Archive Markdown File', extensions: ['mdz'] },
            { name: 'Text File', extensions: ['txt'] },
        ]
    });

    this.saveMediaDialog = (title = "保存文件", defPath = os.homedir()) => dialog.showSaveDialogSync({
        /**
         * 另存为文件
         */
        title: title,
        defaultPath: defPath,
        buttonLabel: '保存',
        message: title,
    });
}

module.exports = Dialogs;
