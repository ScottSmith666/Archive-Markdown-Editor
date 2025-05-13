const { contextBridge, ipcRenderer } = require('electron/renderer');


// contextBridge.exposeInMainWorld('writeMarkdown', {
//     changeContent: (md) => {
//         return ipcRenderer.invoke('change-content', md);
//     }  // 发送到主进程
// });

// 文本操作
contextBridge.exposeInMainWorld('contentOperateCVA', {
    selectAll: (callback) => ipcRenderer.on('select-all', (_event) => callback()),  // 全选
    copy: (callback) => ipcRenderer.on('copy', (_event, keep) => callback(keep)),  // 复制&剪切
    paste: (callback) => ipcRenderer.on('paste', (_event) => callback()),  // 粘贴
    undo: (callback) => ipcRenderer.on('undo', (_event) => callback()),  // 撤销
    redo: (callback) => ipcRenderer.on('redo', (_event) => callback()),  // 重做
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
