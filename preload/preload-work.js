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
});

// 打开新窗口
contextBridge.exposeInMainWorld('openNewWindow', {
    openNew: () => ipcRenderer.send('open-new'),
});
