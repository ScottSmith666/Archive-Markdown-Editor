import {dialog} from "electron";
import os from "os";

export class Dialogs {
    constructor() {}
    confirm(windowObject, type, buttonList, defaultButtonIndex, title, content, cancelButtonIndex) {
        return (1 === dialog.showMessageBoxSync(windowObject, {
            type: type,
            buttons: buttonList,
            defaultId: defaultButtonIndex,
            title: title,
            detail: content,
            cancelId: cancelButtonIndex,
        }));
    }

    openFileDialog(title, isMedia = false) {
        let extFilters = isMedia ? [] : [
            { name: 'Markdown File Family', extensions: ['mdz', "md"] },
            { name: 'Text File Family', extensions: ['txt'] },
        ];
        return dialog.showOpenDialogSync({
            /**
             * 打开文件
             */
            title: title,
            properties: ['openFile'],
            defaultPath: os.homedir(),
            message: title,
            filters: extFilters
        });
    }

    saveFileDialog(title = "保存文件", btLabel = "确定") {
        return dialog.showOpenDialogSync({
            /**
             * 另存为文件
             */
            title: title,
            defaultPath: os.homedir(),
            properties: ['openDirectory'], // 设置为只能选择文件夹
            buttonLabel: btLabel,
            message: title,
        });
    }

    saveMediaDialog(title = "保存文件", defPath = os.homedir(), isExport = false) {
        // 导出类型由传进来的默认路径后缀决定（调用方拼的就是 export.<type>），
        // 这样保存框只给一种过滤器，用户不会把PDF存成.html
        let extFilters = [];
        if (isExport) {
            const exportExt = String(defPath).split(".").pop().toLowerCase();
            extFilters = exportExt === "pdf"
                ? [{name: 'Portable Document Format', extensions: ['pdf']}]
                : [{name: 'Hypertext Markup Language File', extensions: ['html']}];
        }
        return dialog.showSaveDialogSync({
            /**
             * 另存为文件
             */
            title: title,
            defaultPath: defPath,
            buttonLabel: '保存',
            message: title,
            filters: extFilters,
        });
    }
}
