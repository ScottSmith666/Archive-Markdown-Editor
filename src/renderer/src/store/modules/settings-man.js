const initLangFunc = (state) => {

};

export const settingsMan = {
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
    mutations: {
        // 更改编辑器显示模式
        changeEditorMode(state, editorMode) {
            state.editorMode = editorMode;
        },
        changeUserSettings(state, userSettingsKV) {
            state.userSettings[userSettingsKV[0]] = userSettingsKV[1];
            localStorage.setItem('userSettings', JSON.stringify(state.userSettings));
        },
        initUserSettings(state) {
            if (!localStorage.getItem('userSettings')) {
                // 如果刚打开时localStorage没有user settings，则初始化
                state.userSettings = {
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
                    'safe_mode': 0,
                };
                localStorage.setItem('userSettings', JSON.stringify(state.userSettings));
            } else {
                // 如果刚打开时localStorage有user settings，则载入localStorage中的设置
                state.userSettings = JSON.parse(localStorage.getItem('userSettings'));
            }
        },
        forceResetUserSettings(state) {
            state.userSettings = {
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
                'safe_mode': 0,
            };
            localStorage.setItem('userSettings', JSON.stringify(state.userSettings));
        }
    },
    actions: {
        async initUserSettingsAction({rootState, commit}) {
            // 初始化语言
            try {
                let lang = await window.loadLangPreload.loadLang();
                rootState.settings.lang = lang;
                localStorage.setItem('lang', lang);
            } catch (e) {
                console.error(e);
            }
            commit('initUserSettings');
        }
    },
}
