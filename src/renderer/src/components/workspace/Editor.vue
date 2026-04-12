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
import {onMounted, ref} from "vue";
import {useStore} from 'vuex';
import {useRoute, onBeforeRouteUpdate} from 'vue-router';

const route = useRoute();
const store = useStore();

let monacoInstance;

// props
const props = defineProps(['pageData']);

// data
const monacoEditorStateMap = ref(new Map());  // 存储每个标签页的状态（光标位置、滚动位置等）

// emit
const emit = defineEmits(['update', 'top', 'bottom']);

onBeforeRouteUpdate((to, from) => {
    // 页面变动时存储上一个旧页面的state
    monacoEditorStateMap.value.set(from.query.pageid, monacoInstance.saveViewState());
    // 页面变动时切换Monaco Editor Model
    let model = store.state.tab.tabList.get(to.query.pageid).get('monacoEditorModel');
    monacoInstance.setModel(model);

    // 加载新编辑器页面的state
    if (monacoEditorStateMap.value.get(to.query.pageid)) {
        monacoInstance.restoreViewState(monacoEditorStateMap.value.get(to.query.pageid));
    }

    monacoInstance.focus();
    update(monacoInstance, to.query.pageid);
});

onMounted(() => {
    monacoInstance = monaco.editor.create(document.getElementById("editor"), {
        contextmenu: true,
        language: 'markdown',
        automaticLayout: true,
        cursorSmoothCaretAnimation: true,
        scrollBeyondLastLine: false,
        wordWrap: true,
        largeFileOptimizations: false, // 禁用大文件自动优化
    });

    // 加载页面对应的model
    let model = store.state.tab.tabList.get(route.query.pageid).get('monacoEditorModel');
    monacoInstance.setModel(model);

    // 加载对应编辑器页面的state
    if (monacoEditorStateMap.value.get(route.query.pageid)) {
        monacoInstance.restoreViewState(monacoEditorStateMap.value.get(route.query.pageid));
    }

    // 自动聚焦
    monacoInstance.focus();

    // 添加撤销、重做
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
        run: function () {
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
        run: function () {
            monacoInstance.trigger('source', 'redo');
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
        if (store.state.file.isListenFileChange) {
            runDebounceChange(() => {
                console.log("内容改变了！");
                store.commit('changePropsOfTab', {  // 将标签上的关闭按钮换成圆形
                    'pageId': route.query.pageid,
                    'propName': 'saved',
                    'propValue': false,
                });
                getPlanPiece(monacoInstance, route.query.pageid);
            });
        }
    });

    // Monaco Editor滚动事件
    // 滚动事件触发后，将从Monaco Editor中间行号开始，向两边各截取n/2倍Monaco Editor可视行数的文本传进渲染器
    monacoInstance.onDidScrollChange((event) => {
        if (route.query.pageid === store.state.tab.currentOpenedPageId) {  // 由于Monaco Editor切换Model时会自动执行onDidScrollChange事件，因此需要判断route param是否与打开的页面id相同
            let isUp = monacoInstance.getVisibleRanges().length === 0
                ? true
                : (monacoInstance.getVisibleRanges()[0].startLineNumber === 1);
            let isDown = monacoInstance.getVisibleRanges().length === 0
                ? true
                : (monacoInstance.getVisibleRanges()[0].endLineNumber
                    === store.state.tab.tabList.get(route.query.pageid).get('monacoEditorModel').getLineCount());
            if (isUp) {  // Editor是否到顶
                emit('top');
            }

            if (isDown) {  // Editor是否到底
                emit('bottom');
            }

            runDebounceScroll(() => {
                getPlanPiece(monacoInstance, route.query.pageid);
            });
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
const runDebounceScroll = debounceScroll();

const debounceChange = (fn, delay = 100) => {
    // 编辑防抖
    let timeout = null;
    return function (fn) {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(fn, delay);
    };
};
const runDebounceChange = debounceChange();

// 数据及视图更新
const update = (monacoInstance, pageId) => {
    monacoInstance.focus();
    getPlanPiece(monacoInstance, pageId);
};

const getContentOfLineRange = (startLine, endLine, pageId) => {
    return store.state.tab.tabList.get(pageId).get('monacoEditorModel').getValueInRange({
        startLineNumber: startLine,
        startColumn: 1,
        endLineNumber: endLine,
        endColumn: store.state.tab.tabList.get(pageId).get('monacoEditorModel').getLineMaxColumn(endLine) // 获取该行最后一个字符的列号
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

const getPlanPiece = (monacoInstance, pageId) => {
    let fileTotalLines = store.state.tab.tabList.get(pageId).get('monacoEditorModel').getLineCount();  // 编辑器内的文本总行数
    let vt = getLineNumsOfVisualPage(monacoInstance);
    let planCutContentLines = vt.linesInVisualPage * store.state.settings.renderDistance;  // 选区总长度，即可视页面行数与渲染距离之积
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
        pieceContent = store.state.tab.tabList.get(pageId).get('monacoEditorModel').getValue();
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
    emit('update', [
        pieceContent, // 传内容片段过去
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
