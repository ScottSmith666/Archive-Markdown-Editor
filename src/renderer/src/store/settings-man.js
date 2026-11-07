import { defineStore } from 'pinia';

export const useSettingsManStore = defineStore("settings-man", {
    state: () => {
        return {
            // 编辑器&渲染器调节相关变量
            editorMode: "mix",   // 编辑器模式，分为预览模式（preview）、编辑模式（edit）和混合模式（mix）
            renderDistance: 10,  // Markdown渲染距离
            // quality和performance，performance则是应用虚拟滚动，截取编辑器内部分内容节约性能，但有可能会发生渲染错误
            // quality则是一次性渲染全部内容，虽然耗费更多性能但渲染错误概率明显降低
            renderMode: 'performance',
            userSettings: {},
            lang: 'zh-CN',
        };
    },
    actions: {
        // 更改编辑器显示模式
        changeEditorMode(editorMode) {
            this.editorMode = editorMode;
        },
        changeUserSettings(userSettingsKV) {
            this.userSettings[userSettingsKV[0]] = userSettingsKV[1];
            localStorage.setItem('userSettings', JSON.stringify(this.userSettings));
        },
        initUserSettings() {
            if (!localStorage.getItem('userSettings')) {
                // 如果刚打开时localStorage没有user settings，则初始化
                this.userSettings = {
                    'ame_theme_color': '#42b983',
                    'ame_theme_mode': 'light',
                    'ame_viewer_theme': 'default',
                    'ame_editor_theme': 'vs',
                    'editor_tab_size': 4,
                    'editor_font_size': 14,
                    'enable_line_num': 'on',
                    'enable_code_fold': 1,
                    'enable_auto_wrap_line': 'on',
                    'enable_auto_closure': 'always',
                    'display_vertical_scrollbar': 'visible',
                    'display_horizon_scrollbar': 'visible',
                    'display_code_scale': 1,
                    'display_editor_animation': 1,
                    'render_mode': 'performance',
                };
                localStorage.setItem('userSettings', JSON.stringify(this.userSettings));
            } else {
                // 如果刚打开时localStorage有user settings，则载入localStorage中的设置
                this.userSettings = JSON.parse(localStorage.getItem('userSettings'));
            }
        },
        forceResetUserSettings() {
            this.userSettings = {
                'ame_theme_color': '#42b983',
                'ame_theme_mode': 'light',
                'ame_viewer_theme': 'default',
                'ame_editor_theme': 'vs',
                'editor_tab_size': 4,
                'editor_font_size': 14,
                'enable_line_num': 'on',
                'enable_code_fold': 1,
                'enable_auto_wrap_line': 'on',
                'enable_auto_closure': 'always',
                'display_vertical_scrollbar': 'visible',
                'display_horizon_scrollbar': 'visible',
                'display_code_scale': 1,
                'display_editor_animation': 1,
                'render_mode': 'performance',
            };
            localStorage.setItem('userSettings', JSON.stringify(this.userSettings));
        },

        async initUserSettingsAction() {
            // 初始化语言
            try {
                let lang = await window.loadLangPreload.loadLang();
                this.lang = lang;
                localStorage.setItem('lang', lang);
            } catch (e) {
                console.error(e);
            }
            this.initUserSettings();
        }
    },
});
