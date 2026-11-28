<script setup>
/**
 * ----工具页：Mermaid编辑器----
 * 左半边复用Monaco Editor（语言为mermaid，带智能提示），右半边用mermaid实时渲染图表
 * 内容常驻在标签页的editor model上，因此切换标签页不会丢失
 */
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import mermaid from "mermaid";
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

const toolText = () => i18nStore.langPackage[settingsManStore.lang].toolsPage.mermaidEditor;

let editor = null;
let releaseEditor = null;
let contentChangeListener = null;
let renderSequence = 0;
const debounceRender = createDebouncer(300);

const getModel = () => {
    const tab = tabManStore.tabList.get(pageId);
    return tab ? tab.get("monacoEditorModel") : null;
};

/**
 * mermaid.render要求id全局唯一且不与页面上已有元素冲突，因此每次渲染都换新id
 * 渲染是异步的，用序号保证慢的那次结果不会覆盖快的那次
 */
const renderPreview = async () => {
    const target = previewContent.value;
    if (!target) {
        return;
    }
    const model = getModel();
    const source = model ? model.getValue() : "";
    const currentSequence = ++renderSequence;

    if (source.trim() === "") {
        target.innerHTML = `<div class="preview-placeholder">${escapeHtml(toolText().emptyPreview)}</div>`;
        return;
    }

    try {
        mermaid.initialize({ startOnLoad: false, securityLevel: "strict" });
        await mermaid.parse(source);
        const result = await mermaid.render(`ame-mermaid-preview-${currentSequence}`, source);
        if (currentSequence !== renderSequence) {
            return;
        }
        target.innerHTML = `<div class="mermaid-image">${result.svg}</div>`;
    } catch (err) {
        if (currentSequence !== renderSequence) {
            return;
        }
        const message = err && err.message ? err.message : String(err);
        target.innerHTML = `<div class="preview-error">${escapeHtml(`${toolText().renderError}${message}`)}</div>`;
    }
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
        language: "mermaid",
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
                    {{ i18nStore.langPackage[settingsManStore.lang].toolsPage.mermaidEditor.tabTitle }}
                </h1>
            </div>

            <div class="block-line"></div>

            <div class="editor-preview-group">
                <div class="editor-side">
                    <div class="side-toolbar">
                        <div class="title2">
                            <div class="title2-block"></div>
                            <div style="width: 8px"></div>
                            <h2>{{ i18nStore.langPackage[settingsManStore.lang].toolsPage.mermaidEditor.editorTitle }}</h2>
                        </div>
                        <div class="media-button-group">
                            <div class="copy-code-button" @click="copyCode">
                                {{ i18nStore.langPackage[settingsManStore.lang].toolsPage.mermaidEditor.copyButton }}
                            </div>
                            <div style="width: 15px"></div>
                            <div class="delete-button" @click="clearCode">
                                {{ i18nStore.langPackage[settingsManStore.lang].toolsPage.mermaidEditor.clearButton }}
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
                            <h2>{{ i18nStore.langPackage[settingsManStore.lang].toolsPage.mermaidEditor.previewTitle }}</h2>
                        </div>
                    </div>
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
