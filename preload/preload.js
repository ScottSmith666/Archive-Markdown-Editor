const { contextBridge, ipcRenderer } = require('electron/renderer');


// 文本操作
contextBridge.exposeInMainWorld('contentOperateCVA', {
    selectAll: (callback) => ipcRenderer.on('select-all', (_event) => callback()),  // 全选
    copy: (callback) => ipcRenderer.on('copy', (_event, keep) => callback(keep)),  // 复制&剪切
    paste: (callback) => ipcRenderer.on('paste', (_event) => callback()),  // 粘贴
});

contextBridge.exposeInMainWorld('lang', {
    getLangIndexLangContent: () => {
        return ipcRenderer.invoke('load-lang');
    },
});

contextBridge.exposeInMainWorld('swDebug', {
    switchDebuggingMode: () => {
        return ipcRenderer.invoke('switch-debug');
    }
});
