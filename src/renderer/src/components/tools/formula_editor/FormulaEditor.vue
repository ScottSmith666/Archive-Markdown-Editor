<script setup>
/**
 * ----工具页：LaTeX编辑器----
 * 左半边复用Monaco Editor（语言为latex，带智能提示），右半边用MathJax实时预览
 * 内容常驻在标签页的editor model上，因此切换标签页不会丢失
 */
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useTabManStore } from "../../../store/tab-man";
import { useI18nStore } from "../../../store/i18n";
import { useSettingsManStore } from "../../../store/settings-man";
import { useAmeLifecycleManStore } from "../../../store/ame-lifecycle-man";
import { acquireToolEditor, createDebouncer, escapeHtml } from "../tool-editor-core";

const route = useRoute();
const tabManStore = useTabManStore();
const i18nStore = useI18nStore();
const settingsManStore = useSettingsManStore();
const ameLifecycleManStore = useAmeLifecycleManStore();

const pageId = route.query.pageid;
const editorMount = ref(null);
const previewContent = ref(null);

const toolText = () => i18nStore.langPackage[settingsManStore.lang].toolsPage.formulaEditor;

let editor = null;
let releaseEditor = null;
let contentChangeListener = null;
let mathJaxRetryTimes = 0;
const debounceRender = createDebouncer(300);

const getModel = () => {
    const tab = tabManStore.tabList.get(pageId);
    return tab ? tab.get("monacoEditorModel") : null;
};

/**
 * 把LaTeX源码转成可交给MathJax排版的HTML
 * 1. 必须整体转义，源码里的标签不能当作HTML执行
 * 2. 数学定界符不能被<br>、<p>这类标签截断，所以只有“完全不含数学”的段落才转行内换行
 */
const latexSourceToHtml = (source) => {
    const htmlList = [];
    source.split(/\n{2,}/).forEach((block) => {
        if (block.trim() === "") {
            return;
        }
        const escaped = escapeHtml(block);
        const hasMath = /\$\$|\$|\\\(|\\begin\{/.test(block);
        if (!hasMath) {
            // 纯文本段落里“%”开头的行是LaTeX注释，不渲染；数学块内的注释交给MathJax自己处理
            const textHtml = escapeHtml(
                block.split("\n").filter((line) => !/^\s*%/.test(line)).join("\n")
            ).replace(/\n/g, "<br />");
            if (textHtml.replace(/<br \/>/g, "").trim() === "") {
                return;
            }
            htmlList.push(`<div class="formula-block">${textHtml}</div>`);
        } else if (/^\s*(\$\$|\\\[|\\begin\{)/.test(block)) {
            htmlList.push(`<div class="formula-block formula-display">${escaped}</div>`);
        } else {
            htmlList.push(`<div class="formula-block">${escaped}</div>`);
        }
    });
    return htmlList.join("");
};

/**
 * MathJax在index.html里是async加载的，可能还没就绪，未就绪时有限次重试
 */
const typesetMath = (target) => {
    if (!window.MathJax || !window.MathJax.typesetPromise) {
        if (mathJaxRetryTimes < 20) {
            mathJaxRetryTimes += 1;
            setTimeout(() => typesetMath(target), 300);
        }
        return;
    }
    const run = () => {
        try {
            window.MathJax.typesetClear([target]);
            window.MathJax.typesetPromise([target]).catch((err) => {
                console.error(err);
            });
        } catch (err) {
            console.error(err);
        }
    };
    if (window.MathJax.startup && window.MathJax.startup.promise) {
        window.MathJax.startup.promise.then(run).catch((err) => {
            console.error(err);
        });
    } else {
        run();
    }
};

const renderPreview = () => {
    const target = previewContent.value;
    if (!target) {
        return;
    }
    const model = getModel();
    const source = model ? model.getValue() : "";
    if (source.trim() === "") {
        target.innerHTML = `<div class="preview-placeholder">${escapeHtml(toolText().emptyPreview)}</div>`;
        return;
    }
    target.innerHTML = latexSourceToHtml(source);
    typesetMath(target);
};

const copyCode = async () => {
    const model = getModel();
    const text = model ? model.getValue() : "";
    try {
        await navigator.clipboard.writeText(text);
        ameLifecycleManStore.autoTips({
            wantToOpen: true,
            kind: "tip",
            tipLevel: "success",
            content: toolText().copyResultPrompt.success
        });
    } catch (err) {
        ameLifecycleManStore.autoTips({
            wantToOpen: true,
            kind: "tip",
            tipLevel: "fail",
            content: `${toolText().copyResultPrompt.fail}${err.name}`
        });
    }
};

const clearCode = () => {
    const model = getModel();
    if (!model) {
        return;
    }
    // setValue会触发onDidChangeContent，预览由防抖统一刷新
    model.setValue("");
    if (editor) {
        editor.focus();
    }
};

onMounted(() => {
    const model = getModel();
    if (!model || !editorMount.value) {
        return;
    }
    const handle = acquireToolEditor({
        language: "latex",
        container: editorMount.value,
        model: model,
        pageid: pageId,
        isPageAlive: (checkId) => tabManStore.tabList.has(checkId)
    });
    editor = handle.editor;
    releaseEditor = handle.release;

    contentChangeListener = model.onDidChangeContent(() => {
        debounceRender(renderPreview);
    });

    renderPreview();
});

onBeforeUnmount(() => {
    if (contentChangeListener) {
        contentChangeListener.dispose();
        contentChangeListener = null;
    }
    debounceRender.cancel();
    if (releaseEditor) {
        releaseEditor();
        releaseEditor = null;
    }
    editor = null;
});
</script>

<template>
    <div class="tool-editor-container fonts">
        <div class="tool-editor">
            <div class="title1">
                <div class="title1-block"></div>
                <div style="width: 8px"></div>
                <h1>
                    {{ i18nStore.langPackage[settingsManStore.lang].toolsPage.formulaEditor.tabTitle }}
                </h1>
            </div>

            <div class="block-line"></div>

            <div class="editor-preview-group">
                <div class="editor-side">
                    <div class="side-toolbar">
                        <div class="title2">
                            <div class="title2-block"></div>
                            <div style="width: 8px"></div>
                            <h2>{{ i18nStore.langPackage[settingsManStore.lang].toolsPage.formulaEditor.editorTitle }}</h2>
                        </div>
                        <div class="media-button-group">
                            <div class="copy-code-button" @click="copyCode">
                                {{ i18nStore.langPackage[settingsManStore.lang].toolsPage.formulaEditor.copyButton }}
                            </div>
                            <div style="width: 15px"></div>
                            <div class="delete-button" @click="clearCode">
                                {{ i18nStore.langPackage[settingsManStore.lang].toolsPage.formulaEditor.clearButton }}
                            </div>
                        </div>
                    </div>
                    <div ref="editorMount" class="editor-mount code-editor"></div>
                </div>

                <div class="preview-side">
                    <div class="side-toolbar">
                        <div class="title2">
                            <div class="title2-block"></div>
                            <div style="width: 8px"></div>
                            <h2>{{ i18nStore.langPackage[settingsManStore.lang].toolsPage.formulaEditor.previewTitle }}</h2>
                        </div>
                    </div>
                    <!--注意：这里不能加code-editor、mermaid这两个class，也不能把公式包进pre/code，否则MathJax会跳过-->
                    <div class="preview-scroll">
                        <div class="preview-content" ref="previewContent"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import "../styles/tool-editor.css";
</style>
