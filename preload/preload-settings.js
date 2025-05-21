"use strict";

const { contextBridge, ipcRenderer } = require('electron/renderer');


// 设置
contextBridge.exposeInMainWorld('settings', {
    // Get general from storage
    getLangSettings: () => ipcRenderer.invoke('load-storage-settings', "lang_index"),
    // Get edit from storage
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

    // Set settings to storage sqlite
    // dialogs
    getSettingsCancelOption: () => ipcRenderer.invoke('settings-cancel-option'),
    getSettingsConfirmOption: (instructionsList) => ipcRenderer.invoke('settings-confirm-option', instructionsList),
    getSettingsResetOption: () => ipcRenderer.invoke('settings-reset-option'),
    reloadSettings: () => ipcRenderer.send('reload-app'),
});
