"use strict";

const { contextBridge, ipcRenderer } = require('electron/renderer');


// 文本操作
contextBridge.exposeInMainWorld('contentOperateCVA', {
    selectAll: (callback) => ipcRenderer.on('select-all', (_event) => callback()),  // 全选
    copy: (callback) => ipcRenderer.on('copy', (_event, keep) => callback(keep)),  // 复制&剪切
    paste: (callback) => ipcRenderer.on('paste', (_event) => callback()),  // 粘贴
});

// 设置语言
contextBridge.exposeInMainWorld('lang', {
    getLangIndexLangContent: () => {
        return ipcRenderer.invoke('load-lang');
    },
});

// 传递debug信号
contextBridge.exposeInMainWorld('swDebug', {
    switchDebuggingMode: () => {
        return ipcRenderer.invoke('switch-debug');
    }
});

// 打开外部链接
contextBridge.exposeInMainWorld('openOutLink', {
    openLink: (url) => ipcRenderer.send('open-url', url),
});

// 设置edit
contextBridge.exposeInMainWorld('editSettings', {
    getEditSettings: () => ipcRenderer.invoke('load-edit-settings'),
});
