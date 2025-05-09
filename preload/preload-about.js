const { contextBridge, ipcRenderer } = require('electron/renderer');


contextBridge.exposeInMainWorld('aboutDialogLang', {
    getAboutDialogLangContent: () => {
        return ipcRenderer.invoke('load-lang-for-about-dialog');
    },
});

contextBridge.exposeInMainWorld('openOutLink', {
    openLink: (url) => ipcRenderer.send('open-url', url),
});
