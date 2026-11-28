<script setup>
import Viewer from "../workspace/Viewer.vue";
import {onMounted, ref} from "vue";
import {onBeforeRouteUpdate, useRoute} from "vue-router";
import {useAmeLifecycleManStore} from "../../store/ame-lifecycle-man";
import {useTabManStore} from "../../store/tab-man";

// 与编辑区预览（workspace/Editor.vue）同一份数学片段预处理：
// 文档正文同样要经 markdown-it，不做这一步的话 \left\{ 这类写法在文档页里会被吃掉反斜杠
import {processLatex} from "../../latex-preprocess.js";

const route = useRoute();
const ameLifecycleManStore = useAmeLifecycleManStore();
const tabManStore = useTabManStore();

const content = ref("正在加载中...");
const rootPath = ref('');

// methods
const readDocument = async (docName) => {
    try {
        let result = await window.docLoaderPreload.docLoader(docName);
        if (result.success) {
            rootPath.value = result.root.replaceAll("\\", "/");  // 渲染端不许出现反斜杠
            content.value = processLatex(result.content);  // 数学片段补反斜杠后再交给 Viewer 渲染
        } else {
            ameLifecycleManStore.autoTips({
                wantToOpen: true,
                kind: "tip",
                tipLevel: "fail",
                content: result.message,
                showTimeSecond: ameLifecycleManStore.tipDisplayTime
            });
        }
    } catch (e) {
        ameLifecycleManStore.autoTips({
            wantToOpen: true,
            kind: "tip",
            tipLevel: "fail",
            content: `${e.name}: ${e.message}`,
            showTimeSecond: ameLifecycleManStore.tipDisplayTime
        });
    }
};

const expandPreviewDialog = () => {
    setTimeout(() => {
        if (localStorage.getItem(`${tabManStore.currentOpenedPageId}-click-media-path`)) {
            ameLifecycleManStore.toggleModal({'wantToOpen': true, 'kind': 'preview'});
        }
    }, 400);
};

onBeforeRouteUpdate(async (to, from) => {
    // 页面变动时切换内容
    await readDocument(to.query.docname);
});

onMounted(async () => {
    await readDocument(route.query.docname);
});
</script>

<template>
    <Viewer
        v-if="rootPath !== ''"
        class="light-view"
        :enableToc="false"
        :mdPiece="content"
        :enable-document-media-path="{'isEnabled': true, 'path': rootPath}"
        @click="expandPreviewDialog"
    ></Viewer>
</template>

<style>
.light-view {
    width: 100% !important;
    height: calc(100vh - 36px - 31px - 15px - 20px);
}
</style>
