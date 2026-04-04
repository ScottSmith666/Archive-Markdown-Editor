<script setup>
// init monaco editor i18n
import '../../../../../libs/third_party/monaco-editor/esm/vs/nls/lang/switch-lang.js';

// init monaco editor
import * as monaco from '../../../../../libs/third_party/monaco-editor/esm/vs/editor/editor.api.js';
import '../../../../../libs/third_party/monaco-editor/esm/vs/basic-languages/monaco.contribution.js';
import '../../../../../libs/third_party/monaco-editor/esm/vs/editor/contrib/contextmenu/browser/contextmenu.js';
import '../../../../../libs/third_party/monaco-editor/esm/vs/editor/contrib/clipboard/browser/clipboard.js';
import '../../../../../libs/third_party/monaco-editor/esm/vs/editor/contrib/inlineCompletions/browser/inlineCompletions.contribution.js';
import '../../../../../libs/third_party/monaco-editor/esm/vs/editor/contrib/placeholderText/browser/placeholderText.contribution.js';
import '../../../../../libs/third_party/monaco-editor/esm/vs/editor/contrib/find/browser/findController.js';
import './suggestions.js';

// get Vue API
import {onMounted} from "vue";
import {useStore} from 'vuex';
import {useRoute, onBeforeRouteUpdate} from 'vue-router';

const route = useRoute();
const store = useStore();

let monacoInstance = null;

// props
const props = defineProps(['pageData']);

// data

// emit
const emit = defineEmits(['update', 'top', 'bottom']);

onBeforeRouteUpdate((to, from) => {
    // 页面变动时切换Monaco Editor Model
    monacoInstance.setModel(store.state.switchedPageMonacoEditorModel);
    monacoInstance.focus();
    update(monacoInstance, route.query.pageid);
});

onMounted(() => {
    monacoInstance = monaco.editor.create(document.getElementById("editor"), {
        language: "markdown",
        contextmenu: true,
        placeholder: "请在此处键入Markdown...",
        automaticLayout: true,
        cursorSmoothCaretAnimation: true,
        scrollBeyondLastLine: false,
        wordWrap: true,
    });
    // 加载页面对应的model
    monacoInstance.setModel(store.state.switchedPageMonacoEditorModel);
    // 自动聚焦
    monacoInstance.focus();
    // 添加撤销和重做
    monacoInstance.addAction({
        // 唯一 ID
        id: 'custom-undo',
        // 菜单上显示的文字
        label: '撤销',
        // 指定快捷键 (可选)
        keybindings: [
            monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyZ,
        ],
        // 控制菜单项显示在哪个分组 (可选)
        // navigation 是顶部，modification 是中间，9_cutcopypaste 是剪贴板组
        contextMenuGroupId: 'navigation',
        // 点击后执行的逻辑
        run: function() {
            monacoInstance.trigger('source', 'undo');
            return null;
        }
    });
    monacoInstance.addAction({
        id: 'custom-redo',
        label: '重做',
        keybindings: [
            monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyY,
        ],
        contextMenuGroupId: 'navigation',
        run: function() {
            monacoInstance.trigger('source', 'redo');
            return null;
        }
    });
    update(monacoInstance, route.query.pageid);
});

// methods
const debounce = (fn, editor, delay = 15, scroll = true) => {
    // 防抖
    let timeout = null;
    return function (...args) {
        if (scroll && store.state.switchedPageMonacoEditorModel) {
            let isUp = editor.getVisibleRanges().length === 0
                ? true
                : (editor.getVisibleRanges()[0].startLineNumber === 1);
            let isDown = editor.getVisibleRanges().length === 0
                ? true
                : (editor.getVisibleRanges()[0].endLineNumber === store.state.switchedPageMonacoEditorModel.getLineCount());
            if (isUp) {  // Editor是否到顶
                emit('top');
            }

            if (isDown) {  // Editor是否到底
                emit('bottom');
            }
        }

        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn(...args);
        }, delay);
    };
};

// 数据及视图更新
const update = (monacoInstance, pageId) => {
    monacoInstance.focus();
    getPlanPiece(monacoInstance);  // 初始打开页面时就取一遍值
    // 监测内容改变事件，并将操作栈写入数据库
    monacoInstance.onDidChangeModelContent(debounce(() => {
        getPlanPiece(monacoInstance);
    }, null, 100, false));

    // Monaco Editor滚动事件
    // 滚动事件触发后，将从Monaco Editor中间行号开始，向两边各截取n/2倍Monaco Editor可视行数的文本传进渲染器
    monacoInstance.onDidScrollChange(debounce((event) => {
        if (store.state.switchedPageMonacoEditorModel) {
            getPlanPiece(monacoInstance);
        }
    }, monacoInstance));

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
};

const getContentOfLineRange = (startLine, endLine) => {
    return store.state.switchedPageMonacoEditorModel.getValueInRange({
        startLineNumber: startLine,
        startColumn: 1,
        endLineNumber: endLine,
        endColumn: store.state.switchedPageMonacoEditorModel.getLineMaxColumn(endLine) // 获取该行最后一个字符的列号
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

const getPlanPiece = (monacoInstance) => {
    let fileTotalLines = store.state.switchedPageMonacoEditorModel.getLineCount();  // 编辑器内的文本总行数
    let vt = getLineNumsOfVisualPage(monacoInstance);
    let planCutContentLines = vt.linesInVisualPage * store.state.renderDistance;  // 选区总长度，即可视页面行数与渲染距离之积
    let rangeFirstLineNumber = 1;  // 选区第一行行数
    let rangeLastLineNumber = fileTotalLines;  // 选区最后一行行数

    // 这里的逻辑是：
    // 1. 如果编辑器内的文本行数小于等于可视页面行数与渲染距离之积，那就直接获取编辑器内所有内容
    // 2. 如果编辑器内的文本行数大于可视页面行数与渲染距离之积，则又分为3种情况：
    //    这里为了保证体验，则以可视页面中间行为基准向两边扩散截取内容。
    //     2.1. 如果(文本总行数 - 可视页面中间行行数 + 1)小于等于可视页面行数与渲染距离之积的一半，则获取编辑器内第(最后一行 - 可视页面行数与渲染距离之积 + 1)行至最后一行的内容
    //     2.2. 如果(可视页面中间行行数)小于等于可视页面行数与渲染距离之积的一半，则获取编辑器内第1行至第(可视页面行数与渲染距离之积)行的内容
    //     2.3. 如果(文本总行数 - 可视页面中间行行数 + 1)和(可视页面中间行行数)均大于可视页面行数与渲染距离之积的一半
    //        则获取编辑器内第(可视页面中间行行数 - 可视页面行数与渲染距离之积的一半 + 1)行至第(可视页面中间行行数 + 可视页面行数与渲染距离之积的一半)行的内容
    let pieceContent;
    if (fileTotalLines <= planCutContentLines) {
        // 分支1
        pieceContent = store.state.switchedPageMonacoEditorModel.getValue();
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
        pieceContent = getContentOfLineRange(rangeFirstLineNumber, rangeLastLineNumber);
    }
    emit('update', [
        pieceContent, // 传内容片段过去
        rangeFirstLineNumber,  // 传选区第一行数据，目的是通过这个来计算HTML片段内实际对应原始Markdown代码第几行
        vt.lineNumAtPageCenter,  // 传可视页面中间行数，目的是通过滚动编辑区使渲染区内容自动滚到对应编辑区的内容等高位置
        vt.lineNumAtPageTop,  // 传可视页面第一行行数，目的是通过判断其是否为1从而将渲染区滚到顶（这里将其放宽至小于等于2）
        vt.lineNumAtPageBottom,  // 传可视页面最后行数，目的是通过判断其是否为文件行数从而将渲染区滚到底（这里将其放宽至大于等于文件行数 - 2）
        fileTotalLines,  // 传文件总行数
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
