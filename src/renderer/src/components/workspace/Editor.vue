<script setup>
// init monaco editor i18n
import '../../../../../libs/third_party/monaco-editor/esm/vs/nls/lang/switch-lang.js';

// init monaco editor
import * as monaco from '../../../../../libs/third_party/monaco-editor/esm/vs/editor/editor.api.js';
import '../../../../../libs/third_party/monaco-editor/esm/vs/basic-languages/monaco.contribution.js';
import '../../../../../libs/third_party/monaco-editor/esm/vs/editor/contrib/contextmenu/browser/contextmenu.js';
import '../../../../../libs/third_party/monaco-editor/esm/vs/editor/contrib/clipboard/browser/clipboard.js';
import '../../../../../libs/third_party/monaco-editor/esm/vs/editor/contrib/inlineCompletions/browser/inlineCompletions.contribution.js';
import '../../../../../libs/third_party/monaco-editor/esm/vs/editor/contrib/find/browser/findController.js';
import './suggestions.js';

// import monaco editor themes
import Themes from "../../../../../libs/third_party/monaco-editor-themes";

// get Vue API
import {nextTick, onMounted, ref} from "vue";
import {useTabManStore} from "../../store/tab-man";
import {useI18nStore} from "../../store/i18n";
import {useSettingsManStore} from "../../store/settings-man";
import {useFileManStore} from "../../store/file-man";
import {useRoute, onBeforeRouteUpdate} from 'vue-router';

import {exampleContent} from "./example.js";

const route = useRoute();
const tabManStore = useTabManStore();
const i18nStore = useI18nStore();
const settingsManStore = useSettingsManStore();
const fileManStore = useFileManStore();

let monacoInstance;

// emit
const emit = defineEmits(['update', 'top', 'bottom']);

const updateMonacoEditorTheme = (monacoInstance) => {
    monacoInstance.updateOptions({
        // 基础属性，固定不变
        contextmenu: true,
        language: 'markdown',
        automaticLayout: true,
        scrollBeyondLastLine: false,
        autoIndent: "advanced",
        formatOnPaste: true,
        dragAndDrop: false,

        // 可调节属性
        tabSize: Number(settingsManStore.userSettings.editor_tab_size),
        fontSize: Number(settingsManStore.userSettings.editor_font_size),
        lineNumbers: settingsManStore.userSettings.enable_line_num,
        folding: settingsManStore.userSettings.enable_code_fold === 1,
        wordWrap: settingsManStore.userSettings.enable_auto_wrap_line,
        autoClosingBrackets: settingsManStore.userSettings.enable_auto_closure,
        autoClosingDelete: settingsManStore.userSettings.enable_auto_closure,
        autoClosingQuotes: settingsManStore.userSettings.enable_auto_closure,
        scrollbar: {
            "vertical": settingsManStore.userSettings.display_vertical_scrollbar,
            "horizontal": settingsManStore.userSettings.display_horizon_scrollbar,
        },
        minimap: {
            enabled: settingsManStore.userSettings.display_code_scale === 1,
        },
        cursorSmoothCaretAnimation: settingsManStore.userSettings.display_editor_animation === 1,
        theme: settingsManStore.userSettings.ame_editor_theme,
    });
};

onBeforeRouteUpdate((to, from) => {
    // 页面变动时存储上一个旧页面的state
    tabManStore.changePropsOfTab(
        from.query.pageid,
        'viewState',
        monacoInstance.saveViewState()
    );
    // 页面变动时切换Monaco Editor Model
    let model = tabManStore.tabList.get(to.query.pageid).get('monacoEditorModel');
    updateMonacoEditorTheme(monacoInstance);
    monacoInstance.setModel(model);

    // 加载新编辑器页面的state
    monacoInstance.restoreViewState(tabManStore.tabList.get(to.query.pageid).get("viewState"));
    monacoInstance.focus();
    update(monacoInstance, to.query.pageid);
});

onMounted(() => {

    let monacoEditorObj = monaco.editor;

    // 注册编辑器样式
    Themes.register("github-light", Themes.themes.light.github, monacoEditorObj);
    Themes.register("atom-light", Themes.themes.light.atom, monacoEditorObj);
    Themes.register("material-light", Themes.themes.light.material, monacoEditorObj);

    Themes.register("darcula", Themes.themes.dark.darcula, monacoEditorObj);
    Themes.register("material-dark", Themes.themes.dark.material, monacoEditorObj);
    Themes.register("atom-dark", Themes.themes.dark.atom, monacoEditorObj);
    Themes.register("github-dark", Themes.themes.dark.github, monacoEditorObj);
    Themes.register("one-dark-pro", Themes.themes.dark["one-dark-pro"], monacoEditorObj);
    Themes.register("monokai-pro", Themes.themes.dark["monokai-pro"], monacoEditorObj);

    monacoInstance = monacoEditorObj.create(document.getElementById("editor"), {
        automaticLayout: true,
    });
    updateMonacoEditorTheme(monacoInstance);

    // 加载页面对应的model
    let model = tabManStore.tabList.get(route.query.pageid).get('monacoEditorModel');
    monacoInstance.setModel(model);
    // 加载对应编辑器页面的state
    monacoInstance.restoreViewState(tabManStore.tabList.get(route.query.pageid).get("viewState"));

    // 自动聚焦
    monacoInstance.focus();

    // 添加撤销、重做
    monacoInstance.addAction({
        // 唯一 ID
        id: 'custom-undo',
        // 菜单上显示的文字
        label: i18nStore.langPackage[settingsManStore.lang].contextMenu.inEditor.undo,
        // 指定快捷键 (可选)
        keybindings: [
            monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyZ,
        ],
        // 控制菜单项显示在哪个分组 (可选)
        // navigation 是顶部，modification 是中间，9_cutcopypaste 是剪贴板组
        contextMenuGroupId: 'navigation',
        // 点击后执行的逻辑
        run: function () {
            monacoInstance.trigger('source', 'undo');
            return null;
        }
    });
    monacoInstance.addAction({
        id: 'custom-redo',
        label: i18nStore.langPackage[settingsManStore.lang].contextMenu.inEditor.redo,
        keybindings: [
            monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyY,
        ],
        contextMenuGroupId: 'navigation',
        run: function () {
            monacoInstance.trigger('source', 'redo');
            return null;
        }
    });

    // 在 9_cutcopypaste 组添加“添加示例语句”
    monacoInstance.addAction({
        id: 'add-example',
        label: i18nStore.langPackage[settingsManStore.lang].contextMenu.inEditor.addExample,
        contextMenuGroupId: '9_cutcopypaste',
        run: function () {
            const selection = monacoInstance.getSelection();

            monacoInstance.executeEdits('example', [
                {
                    // 如果使用 selection，当有文本被选中时会替换它；否则在光标处插入
                    range: selection,
                    text: exampleContent,
                    forceMoveMarkers: true // 通常设置为 true
                }
            ]);

            // 让编辑器重新获得焦点，确保光标可见
            monacoInstance.focus();
            return null;
        }
    });

    // 在 9_cutcopypaste 组添加“粘贴多媒体”
    monacoInstance.addAction({
        id: 'paste-other-media',
        label: i18nStore.langPackage[settingsManStore.lang].contextMenu.inEditor.pasteMedia,
        keybindings: [
            monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KeyV,
        ],
        contextMenuGroupId: '9_cutcopypaste',
        run: async function () {
            let mediaMdFromClipboard = await window.clipboardPreload
                .mediaPaster(i18nStore.langPackage[settingsManStore.lang].editorPlace.pasteErrorMsg);
            const selection = monacoInstance.getSelection();
            monacoInstance.executeEdits('media-md', [
                {
                    range: selection,
                    text: mediaMdFromClipboard,
                    forceMoveMarkers: true
                }
            ]);
            monacoInstance.focus();
            return null;
        }
    });

    // 剪切快捷键
    monacoInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyX, () => {
        monacoInstance.trigger('source', 'editor.action.clipboardCutAction');
    });

    // 复制快捷键
    monacoInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC, () => {
        monacoInstance.trigger('source', 'editor.action.clipboardCopyAction');
    });

    // 粘贴快捷键
    monacoInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV, () => {
        monacoInstance.trigger('source', 'editor.action.clipboardPasteAction');
    });

    // 监测内容改变事件
    monacoInstance.onDidChangeModelContent((event) => {
        if (fileManStore.isListenFileChange) {
            debounceChange()(() => {
                // 将标签上的关闭按钮换成圆形
                tabManStore.changePropsOfTab(
                    route.query.pageid,
                    'saved',
                    false
                );
                getPlanPiece(monacoInstance, route.query.pageid);
            });
        }
    });

    // Monaco Editor滚动事件
    // 滚动事件触发后，将从Monaco Editor中间行号开始，向两边各截取n/2倍Monaco Editor可视行数的文本传进渲染器
    monacoInstance.onDidScrollChange((event) => {
        if (route.query.pageid === tabManStore.currentOpenedPageId) {
            // 由于Monaco Editor切换Model时会自动执行onDidScrollChange事件，因此需要判断route param是否与打开的页面id相同
            let isUp = monacoInstance.getVisibleRanges().length === 0
                ? true
                : (monacoInstance.getVisibleRanges()[0].startLineNumber === 1);
            let isDown = monacoInstance.getVisibleRanges().length === 0
                ? true
                : (monacoInstance.getVisibleRanges()[0].endLineNumber
                    === tabManStore.tabList.get(route.query.pageid).get('monacoEditorModel').getLineCount());
            if (isUp) {  // Editor是否到顶
                emit('top');
            }

            if (isDown) {  // Editor是否到底
                emit('bottom');
            }

            debounceScroll()(() => {
                // 设置页面滚动、光标位置等状态
                // 页面滚动时存储本页面的state
                tabManStore.changePropsOfTab(
                    route.query.pageid,
                    'viewState',
                    monacoInstance.saveViewState()
                );
                getPlanPiece(monacoInstance, route.query.pageid);
            });
        }
    });

    nextTick(() => {
        let isUp = monacoInstance.getVisibleRanges().length === 0
            ? true
            : (monacoInstance.getVisibleRanges()[0].startLineNumber === 1);
        if (isUp) {  // Editor是否到顶
            emit('top');
        }
    });

    update(monacoInstance, route.query.pageid);
});

// methods
const debounceScroll = (delay = 15) => {
    // 滚动防抖
    let timeout = null;
    return function (fn) {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(fn, delay);
    };
};

const debounceChange = (delay = 100) => {
    // 编辑防抖
    let timeout = null;
    return function (fn) {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(fn, delay);
    };
};

// 数据及视图更新
const update = (monacoInstance, pageId) => {
    monacoInstance.focus();
    getPlanPiece(monacoInstance, pageId);
};

const getContentOfLineRange = (startLine, endLine, pageId) => {
    return tabManStore.tabList.get(pageId).get('monacoEditorModel').getValueInRange({
        startLineNumber: startLine,
        startColumn: 1,
        endLineNumber: endLine,
        endColumn: tabManStore.tabList.get(pageId).get('monacoEditorModel').getLineMaxColumn(endLine) // 获取该行最后一个字符的列号
    });
}

const getLineNumsOfVisualPage = (editor) => {
    const visibleRanges = editor.getVisibleRanges();
    if (visibleRanges.length > 0) {
        const startLine = visibleRanges[0].startLineNumber;
        const endLine = visibleRanges[0].endLineNumber;
        const middleLine = Math.floor((startLine + endLine - 1) / 2 + 0.5);
        return {
            'linesInVisualPage': (endLine - startLine + 1),  // 可视页面行数
            'lineNumAtPageTop': startLine,  // 可视页面第一行行数
            'lineNumAtPageCenter': middleLine,  // 可视页面中间行行数
            'lineNumAtPageBottom': endLine,  // 可视页面最后一行行数
        };
    } else {
        return {
            'linesInVisualPage': 1,
            'lineNumAtPageTop': 1,
            'lineNumAtPageCenter': 1,
            'lineNumAtPageBottom': 1,
        };
    }
};

const processLatex = (originContent) => {
    // 1. 处理 $$ ... $$ 块
    originContent = originContent.replaceAll(/\$\$([\s\S]*?)\$\$/g, (match, content) => {
        const newContent = content.replaceAll(/(?<!\\)\\\\(?!\\)/g, '\\\\\\\\');
        return '$$' + newContent + '$$';
    });

    // 2. 处理 \[ ... \] 块
    originContent = originContent.replaceAll(/\\\[([\s\S]*?)\\\]/g, (match, content) => {
        const newContent = content.replaceAll(/(?<!\\)\\\\(?!\\)/g, '\\\\\\\\');
        return '\\[' + newContent + '\\]';
    });

    // 3. 处理转义$
    originContent = originContent.replaceAll("\\$", "\\\\$");
    // console.log("处理后的内容：\n", originContent);
    return originContent;
};

const getPlanPiece = (monacoInstance, pageId) => {
    let fileTotalLines = tabManStore.tabList.get(pageId).get('monacoEditorModel').getLineCount();  // 编辑器内的文本总行数
    let vt = getLineNumsOfVisualPage(monacoInstance);
    let planCutContentLines = vt.linesInVisualPage * settingsManStore.renderDistance;  // 选区总长度，即可视页面行数与渲染距离之积
    let rangeFirstLineNumber = 1;  // 选区第一行行数
    let rangeLastLineNumber = fileTotalLines;  // 选区最后一行行数

    // 这里的逻辑是：
    // 0. 如果设置中开启了质量模式，则默认渲染编辑器内所有内容，下面的规则全部失效
    // 1. 如果编辑器内的文本行数小于等于可视页面行数与渲染距离之积，那就直接获取编辑器内所有内容
    // 2. 如果编辑器内的文本行数大于可视页面行数与渲染距离之积，则又分为3种情况：
    //    这里为了保证体验，则以可视页面中间行为基准向两边扩散截取内容。
    //     2.1. 如果(文本总行数 - 可视页面中间行行数 + 1)小于等于可视页面行数与渲染距离之积的一半，则获取编辑器内第(最后一行 - 可视页面行数与渲染距离之积 + 1)行至最后一行的内容
    //     2.2. 如果(可视页面中间行行数)小于等于可视页面行数与渲染距离之积的一半，则获取编辑器内第1行至第(可视页面行数与渲染距离之积)行的内容
    //     2.3. 如果(文本总行数 - 可视页面中间行行数 + 1)和(可视页面中间行行数)均大于可视页面行数与渲染距离之积的一半
    //        则获取编辑器内第(可视页面中间行行数 - 可视页面行数与渲染距离之积的一半 + 1)行至第(可视页面中间行行数 + 可视页面行数与渲染距离之积的一半)行的内容
    let pieceContent;
    // 分支0，开启质量模式
    if (settingsManStore.userSettings.render_mode === 'quality') {
        pieceContent = tabManStore.tabList.get(pageId).get('monacoEditorModel').getValue();
    } else if (settingsManStore.userSettings.render_mode === 'performance'
        || !settingsManStore.userSettings.render_mode  // 当旧版软件没有“渲染模式”这个设置选项时，默认无（undefined）则为性能模式
    ) {
        // 开启性能模式
        if (fileTotalLines <= planCutContentLines) {
            // 分支1
            pieceContent = tabManStore.tabList.get(pageId).get('monacoEditorModel').getValue();
        } else {
            if ((fileTotalLines - vt.lineNumAtPageCenter + 1) <= Math.floor(planCutContentLines / 2 + 0.5)) {
                // 分支2.1
                rangeFirstLineNumber = fileTotalLines - planCutContentLines + 1;
                rangeLastLineNumber = fileTotalLines;
            }
            if (vt.lineNumAtPageCenter <= Math.floor(planCutContentLines / 2 + 0.5)) {
                // 分支2.2
                rangeFirstLineNumber = 1;
                rangeLastLineNumber = planCutContentLines;
            }
            if ((fileTotalLines - vt.lineNumAtPageCenter + 1) > Math.floor(planCutContentLines / 2 + 0.5) &&
                vt.lineNumAtPageCenter > Math.floor(planCutContentLines / 2 + 0.5)) {
                // 分支2.3
                rangeFirstLineNumber = vt.lineNumAtPageCenter - Math.floor(planCutContentLines / 2 + 0.5) + 1;
                rangeLastLineNumber = vt.lineNumAtPageCenter + Math.floor(planCutContentLines / 2 + 0.5);
            }
            pieceContent = getContentOfLineRange(rangeFirstLineNumber, rangeLastLineNumber, pageId);
        }
    }
    emit('update', [
        processLatex(pieceContent), // 传内容片段过去，并处理latex时所需
        rangeFirstLineNumber,  // 传选区第一行数据，目的是通过这个来计算HTML片段内实际对应原始Markdown代码第几行
        vt.lineNumAtPageCenter,  // 传可视页面中间行数，目的是通过滚动编辑区使渲染区内容自动滚到对应编辑区的内容等高位置
    ]);
};
</script>

<template>
    <div class="editor">
        <div id="editor" class='code-editor'></div>
    </div>
</template>

<style scoped>
@import "./styles/editor.css";
</style>
<style>
/* 强制行号数字在一行显示，不准折行 */
/* 强制行号数字在一行显示，不准折行 */
.monaco-editor .line-numbers {
    white-space: nowrap !important;
}
</style>
