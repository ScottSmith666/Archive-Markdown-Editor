"use strict";

const {dialog} = require("electron");

function Dialogs(windowObject, type, buttonList, defaultButtonIndex, title, content, cancelButtonIndex) {
    /**
     * Confirm dialog function
     * @return true/false (confirm/cancel)
     */

    this.confirm = (1 === dialog.showMessageBoxSync(windowObject, {
        type: type,
        buttons: buttonList,
        defaultId: defaultButtonIndex,
        title: title,
        detail: content,
        cancelId: cancelButtonIndex,
    }));
}

module.exports = Dialogs;
