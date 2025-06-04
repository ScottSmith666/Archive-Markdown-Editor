"use strict";

const { contextBridge, ipcRenderer } = require('electron/renderer');


// 打开新窗口
contextBridge.exposeInMainWorld('openNewWindow', {
    openNew: () => ipcRenderer.send('open-new'),
    openFile: () => ipcRenderer.send('open-file'),
    openFileFromPath: (path) => ipcRenderer.send('open-file-from-path', path),
});

// 获取打开文件历史记录
contextBridge.exposeInMainWorld('histories', {
    getPermanentHistory: () => ipcRenderer.invoke('get-permanent-history'),
    delHistory: (path, all) => ipcRenderer.invoke('delete-permanent-history', path, all),
});

// 退出应用
contextBridge.exposeInMainWorld('qt', {
    quit: () => ipcRenderer.send('quit'),
});
