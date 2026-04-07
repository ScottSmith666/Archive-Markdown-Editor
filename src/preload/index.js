import {contextBridge, ipcRenderer} from 'electron';
import {electronAPI} from '@electron-toolkit/preload';

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI);
        contextBridge.exposeInMainWorld('api', api);
        // AME内部文件（about、usage等）加载
        contextBridge.exposeInMainWorld('docLoaderPreload', {
            docLoader: (fileName) => ipcRenderer.invoke('doc-loader', fileName),
        });
        // 用外部默认浏览器打开链接
        contextBridge.exposeInMainWorld('openURLPreload', {
            openURL: (url) => ipcRenderer.send('open-url', url),
        });
        // 文件管理相关
        contextBridge.exposeInMainWorld('fileManPreload', {
            activateOpenFileDialog: () => ipcRenderer.invoke('activate-open-file-dialog'),
            loadFileContent: (filePath) => ipcRenderer.invoke('load-file-content', filePath),
        });
        // 关闭前确认
        contextBridge.exposeInMainWorld('confirmPreload', {
            onAskForClose: (callback) => ipcRenderer.on('ask-for-close', callback),
            confirmClose: (canClose) => ipcRenderer.send('confirm-close', canClose),
            tryClose: () => ipcRenderer.send('try-close'),
        });
    } catch (error) {
        console.error(error);
    }
} else {
    window.electron = electronAPI;
    window.api = api;
}
