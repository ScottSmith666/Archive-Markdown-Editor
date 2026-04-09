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
            activateOpenFileDialog: (title, content) => ipcRenderer.invoke('activate-open-file-dialog', title, content),
            loadFileContent: (filePath, content) => ipcRenderer.invoke('load-file-content', filePath, content),
            activateInputMdzPasswordDialog: (title, content) => ipcRenderer.invoke('show-input-mdz-password-dialog', title, content),
            loadEncryptedMdzFileContent: (filePath, password) => ipcRenderer.invoke('load-encrypted-mdz-content', filePath, password),
            cleanMdzFolder: (cleanPath) => ipcRenderer.invoke('clean-mdz-folder', cleanPath),
        });
        // 关闭前确认
        contextBridge.exposeInMainWorld('confirmPreload', {
            onAskForClose: (callback) => ipcRenderer.on('ask-for-close', callback),
            confirmClose: (canClose, mdzPaths) => ipcRenderer.send('confirm-close', canClose, mdzPaths),
            tryClose: () => ipcRenderer.send('try-close'),
        });
    } catch (error) {
        console.error(error);
    }
} else {
    window.electron = electronAPI;
    window.api = api;
}
