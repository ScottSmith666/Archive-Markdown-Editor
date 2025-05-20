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
    // Set settings from storage
    setSettings: (instruction, value) => ipcRenderer.send('set-storage-settings', instruction, value),
    // Get general from memory
    getMemoryLangSettings: () => ipcRenderer.invoke('load-memory-settings', "lang_index", true),
    // Get edit from memory
    getMemoryEditorTabSize: () => ipcRenderer.invoke('load-memory-settings', "editor_tab_size", true),
    getMemoryEditorFontSize: () => ipcRenderer.invoke('load-memory-settings', "editor_font_size", true),
    getMemoryEnableLineNum: () => ipcRenderer.invoke('load-memory-settings', "enable_line_num", true),
    getMemoryEnableCodeFold: () => ipcRenderer.invoke('load-memory-settings', "enable_code_fold", true),
    getMemoryEnableAutoWrapLine: () => ipcRenderer.invoke('load-memory-settings', "enable_auto_wrap_line", true),
    getMemoryEnableAutoClosure: () => ipcRenderer.invoke('load-memory-settings', "enable_auto_closure", true),
    getMemoryDisplayVerticalScrollbar: () => ipcRenderer.invoke('load-memory-settings', "display_vertical_scrollbar", true),
    getMemoryDisplayHorizonScrollbar: () => ipcRenderer.invoke('load-memory-settings', "display_horizon_scrollbar", true),
    getMemoryDisplayCodeScale: () => ipcRenderer.invoke('load-memory-settings', "display_code_scale", true),
    getMemoryDisplayEditorAnimation: () => ipcRenderer.invoke('load-memory-settings', "display_editor_animation", true),
    // Set settings from storage
    setMemorySettings: (instruction, value) => ipcRenderer.send('set-memory-settings', instruction, value, "update"),
    insertMemorySettings: (instruction, value) => ipcRenderer.send('set-memory-settings', instruction, value, "insert"),
    // init memory sqlite table
    initMemorySettings: () => ipcRenderer.invoke('memory-sqlite-table-init'),

    deleteMemorySettings: () => ipcRenderer.invoke('memory-sqlite-table-delete'),
    instIsExists: () => ipcRenderer.invoke('memory-settings-inst-exists'),
});
