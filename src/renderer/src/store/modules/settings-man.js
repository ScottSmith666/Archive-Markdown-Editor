export const settingsMan = {
    state: () => {
        return {
            // 编辑器&渲染器调节相关变量
            editorMode: "mix",   // 编辑器模式，分为预览模式（preview）、编辑模式（edit）和混合模式（mix）
            renderDistance: 10,  // Markdown渲染距离
            safeMode: false,  // 安全模式
        };
    },
    mutations: {
        // 更改编辑器显示模式
        changeEditorMode(state, editorMode) {
            state.editorMode = editorMode;
        },
    },
    actions: {

    },
}
