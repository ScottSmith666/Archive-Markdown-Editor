"use strict";

const { contextBridge, ipcRenderer } = require('electron/renderer');


// 打开新窗口
contextBridge.exposeInMainWorld('openNewWindow', {
    openNew: () => ipcRenderer.send('open-new'),
    openFile: () => ipcRenderer.send('open-file'),
});
