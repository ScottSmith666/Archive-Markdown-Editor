"use strict";

const { dialog } = require("electron");
const os = require('os');


function Dialogs() {
    /**
     * Confirm dialog function
     * @return true/false (confirm/cancel)
     */

    this.confirm = (windowObject, type, buttonList, defaultButtonIndex, title, content, cancelButtonIndex) => (1 === dialog.showMessageBoxSync(windowObject, {
        type: type,
        buttons: buttonList,
        defaultId: defaultButtonIndex,
        title: title,
        detail: content,
        cancelId: cancelButtonIndex,
    }));

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
}

module.exports = Dialogs;
