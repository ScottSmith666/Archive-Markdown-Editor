"use strict";

const { contextBridge, ipcRenderer } = require('electron/renderer');


contextBridge.exposeInMainWorld('aboutDialogLang', {
    getAboutDialogLangContent: async () => {
        let langIndex = await ipcRenderer.invoke('load-storage-settings', "lang_index");
        return (await ipcRenderer.invoke('load-language-user-surface', "menu")).aboutDialog[langIndex];
    },
});

contextBridge.exposeInMainWorld('openOutLink', {
    openLink: (url) => ipcRenderer.send('open-url', url),
});
