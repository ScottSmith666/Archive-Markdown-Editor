import {contextBridge, ipcRenderer} from 'electron';

// Custom APIs for renderer
const api = {
    'docLoaderPreload': {
        docLoader: (fileName) => ipcRenderer.invoke('doc-loader', fileName),
    },
    'openURLPreload': {
        openURL: (url) => ipcRenderer.send('open-url', url),
    },
    'sqliteDataManPreload': {
        getRecentOpenedHistory: () => ipcRenderer.invoke('get-recent-opened-history'),
        setRecentOpenedHistory: (fileName, filePath, openTime) => ipcRenderer.invoke('set-recent-opened-history', fileName, filePath, openTime),
        deleteRecentOpenedHistory: (hsId) => ipcRenderer.invoke('delete-recent-opened-history', hsId),
    },
    'fileManPreload': {
        activateOpenFileDialog: (title, content) => ipcRenderer.invoke('activate-open-file-dialog', title, content),
        loadFileContent: (filePath, content) => ipcRenderer.invoke('load-file-content', filePath, content),
        activateInputMdzPasswordDialog: (title, content) => ipcRenderer.invoke('show-input-mdz-password-dialog', title, content),
        loadEncryptedMdzFileContent: (filePath, password) => ipcRenderer.invoke('load-encrypted-mdz-content', filePath, password),
        cleanMdzFolder: (cleanPath) => ipcRenderer.invoke('clean-mdz-folder', cleanPath),
        saveFileInMdz: (title, filePathOrURL) => ipcRenderer.send('save-file-in-mdz', title, filePathOrURL),
        getSavePath: (title, btLabel) => ipcRenderer.invoke('activate-save-file-dialog', title, btLabel),
        makeMdzDirectory: (purePath, pureFileName) => ipcRenderer.invoke('make-mdz-directory', purePath, pureFileName),
        makeMdMediaDirectory: (purePath, pureFileName) => ipcRenderer.invoke('make-md-media-directory', purePath, pureFileName),
        copyMdzMediaFiles: (filePathArray) => ipcRenderer.invoke('copy-mdz-media-files', filePathArray),
        defaultOpenFile: (callback) => ipcRenderer.on('default-open-file', (event, value) => callback(value)),
        saveFileContent: (purePath, pureFileName, content, ext) => ipcRenderer.invoke('save-file-content', purePath, pureFileName, content, ext),
        compressToMdz: (purePath, pureFileName, password) => ipcRenderer.invoke('compress-to-mdz', purePath, pureFileName, password),
    },
    'confirmPreload': {
        onAskForClose: (callback) => ipcRenderer.on('ask-for-close', callback),
        confirmClose: (canClose, mdzPaths) => ipcRenderer.send('confirm-close', canClose, mdzPaths),
        tryClose: () => ipcRenderer.send('try-close'),
    },
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        // AME内部文件（about、usage等）加载
        contextBridge.exposeInMainWorld('docLoaderPreload', api.docLoaderPreload);
        // 用外部默认浏览器打开链接
        contextBridge.exposeInMainWorld('openURLPreload', api.openURLPreload);
        // Sqlite数据读写
        contextBridge.exposeInMainWorld('sqliteDataManPreload', api.sqliteDataManPreload);
        // 文件管理相关
        contextBridge.exposeInMainWorld('fileManPreload', api.fileManPreload);
        // 关闭前确认
        contextBridge.exposeInMainWorld('confirmPreload', api.confirmPreload);
    } catch (error) {
        console.error(error);
    }
} else {
    window.api = api;
}
