"use strict";

const { contextBridge, ipcRenderer } = require('electron/renderer');


const queryParams = new URLSearchParams(window.location.search);
const windowId = queryParams.get('windowId');

// 文本操作
contextBridge.exposeInMainWorld('contentOperateCVA', {
    selectAll: (callback) => ipcRenderer.on('select-all', (_event) => callback()),  // 全选
    copy: (callback) => ipcRenderer.on('copy', (_event, keep) => callback(keep)),  // 复制&剪切
    paste: (callback) => ipcRenderer.on('paste', (_event) => callback()),  // 粘贴
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

// 设置
contextBridge.exposeInMainWorld('settings', {
    // Get general
    getLangSettings: () => ipcRenderer.invoke('load-storage-settings' + windowId, "lang_index"),
    // Get edit
    getEditorTabSize: () => ipcRenderer.invoke('load-storage-settings' + windowId, "editor_tab_size"),
    getEditorFontSize: () => ipcRenderer.invoke('load-storage-settings' + windowId, "editor_font_size"),
    getEnableLineNum: () => ipcRenderer.invoke('load-storage-settings' + windowId, "enable_line_num"),
    getEnableCodeFold: () => ipcRenderer.invoke('load-storage-settings' + windowId, "enable_code_fold"),
    getEnableAutoWrapLine: () => ipcRenderer.invoke('load-storage-settings' + windowId, "enable_auto_wrap_line"),
    getEnableAutoClosure: () => ipcRenderer.invoke('load-storage-settings' + windowId, "enable_auto_closure"),
    getDisplayVerticalScrollbar: () => ipcRenderer.invoke('load-storage-settings' + windowId, "display_vertical_scrollbar"),
    getDisplayHorizonScrollbar: () => ipcRenderer.invoke('load-storage-settings' + windowId, "display_horizon_scrollbar"),
    getDisplayCodeScale: () => ipcRenderer.invoke('load-storage-settings' + windowId, "display_code_scale"),
    getDisplayEditorAnimation: () => ipcRenderer.invoke('load-storage-settings' + windowId, "display_editor_animation"),

    // Set settings to storage sqlite
    // dialogs
    getSettingsCancelOption: () => ipcRenderer.invoke('settings-cancel-option' + windowId),
    getSettingsConfirmOption: (instructionsList) => ipcRenderer.invoke('settings-confirm-option' + windowId, instructionsList),
    getSettingsResetOption: () => ipcRenderer.invoke('settings-reset-option' + windowId),
    reloadSettings: () => ipcRenderer.send('reload-app'),
});

// 加载用户界面
contextBridge.exposeInMainWorld('userSurface', {
    getRightMenuSurface: async () => (await ipcRenderer.invoke('load-language-user-surface', "display")).index.markdownEditRightMenu,
    getRenderPlaceholderSurface: async () => (await ipcRenderer.invoke('load-language-user-surface', "display")).index.markdownRenderPlaceholder,
    getEditorPlaceholderSurface: async () => (await ipcRenderer.invoke('load-language-user-surface', "display")).index.markdownEditPlaceholder,
    getMainSurface: async () => ipcRenderer.invoke('load-language-user-surface', "menu"),
    getIndexSurface: async () => ipcRenderer.invoke('load-language-user-surface', "index"),
});

// 打开新窗口&文件窗口
contextBridge.exposeInMainWorld('openNewWindow', {
    openNew: () => ipcRenderer.send('open-new'),
    openFile: () => ipcRenderer.invoke('open-file'),
});

// 加载文件内容
contextBridge.exposeInMainWorld('loadFileContent', {
    openFileInNewWindow: (path) => ipcRenderer.invoke('open-file-from-path', path),
    loadFileContent: (path, password) => ipcRenderer.invoke('load-file-content', path, password),
    verifyFileIsOpen: (filePath) => ipcRenderer.invoke('verify-file-was-opened', filePath),  // 检查该路径的文件是否已打开
    verifyFileExists: (path) => ipcRenderer.invoke('verify-file-is-exists', path),  // 验证文件存在
    verifyFileNameValid: (path) => ipcRenderer.invoke('verify-file-name-is-valid', path),  // 验证文件名合法
});

// 设置当前窗口保存状态
contextBridge.exposeInMainWorld('setSaveStatus', {
    setSaveStatus: (saveStatus) => ipcRenderer.invoke('change-save-status' + windowId, saveStatus),
});

// 保存文件
contextBridge.exposeInMainWorld('save', {
    autoSaveFile: (content, path, password) => ipcRenderer.invoke('auto-save-file', content, path, password),
    customSaveFile: (content, path, password) => ipcRenderer.invoke('custom-save-file', content, path, password),
    saveMedia: (mediaPath) => ipcRenderer.invoke('save-media', mediaPath),
});

// 退出应用
contextBridge.exposeInMainWorld('qt', {
    quit: () => ipcRenderer.send('quit'),
    // 关闭当前窗口
    closeThisWindow: (windowId) => ipcRenderer.send('close-window', windowId),
    totalCloseThisWindow: (windowId, path) => ipcRenderer.send('close-window-and-rm-ins-history', windowId, path),
});

contextBridge.exposeInMainWorld('ver', {
    getVersion: () => ipcRenderer.invoke('get-version'),
});
