"use strict";

const { contextBridge, ipcRenderer } = require('electron/renderer');


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
    getLangSettings: () => ipcRenderer.invoke('load-storage-settings', "lang_index"),
    // Get edit
    getEditorTabSize: () => ipcRenderer.invoke('load-storage-settings', "editor_tab_size"),
    getEditorFontSize: () => ipcRenderer.invoke('load-storage-settings', "editor_font_size"),
    getEnableLineNum: () => ipcRenderer.invoke('load-storage-settings', "enable_line_num"),
    getEnableCodeFold: () => ipcRenderer.invoke('load-storage-settings', "enable_code_fold"),
    getEnableAutoWrapLine: () => ipcRenderer.invoke('load-storage-settings', "enable_auto_wrap_line"),
    getEnableAutoClosure: () => ipcRenderer.invoke('load-storage-settings', "enable_auto_closure"),
    getDisplayVerticalScrollbar: () => ipcRenderer.invoke('load-storage-settings', "display_vertical_scrollbar"),
    getDisplayHorizonScrollbar: () => ipcRenderer.invoke('load-storage-settings', "display_horizon_scrollbar"),
    getDisplayCodeScale: () => ipcRenderer.invoke('load-storage-settings', "display_code_scale"),
    getDisplayEditorAnimation: () => ipcRenderer.invoke('load-storage-settings', "display_editor_animation"),
});

// 加载用户界面
contextBridge.exposeInMainWorld('userSurface', {
    getRightMenuSurface: async () => (await ipcRenderer.invoke('load-language-user-surface', "display")).index.markdownEditRightMenu,
    getRenderPlaceholderSurface: async () => (await ipcRenderer.invoke('load-language-user-surface', "display")).index.markdownRenderPlaceholder,
});
