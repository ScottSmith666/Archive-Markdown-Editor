<script setup>
import Viewer from "../workspace/Viewer.vue";
import {onMounted, ref} from "vue";
import {onBeforeRouteUpdate, useRoute} from "vue-router";

const route = useRoute();

const content = ref("正在加载中...");
const rootPath = ref('');

// methods
const readDocument = async (docName) => {
    try {
        let result = await window.docLoaderPreload.docLoader(docName);
        if (result.success) {
            rootPath.value = result.root.replaceAll("\\", "/");  // 渲染端不许出现反斜杠
            content.value = result.content;
        } else {
            console.error('读取失败:', result.error);
        }
    } catch (e) {
        console.error(e);
    }
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
        :enableSafe="false"
        :mdPiece="content"
        :enable-document-media-path="{'isEnabled': true, 'path': rootPath}"
    ></Viewer>
</template>

<style>
.light-view {
    width: 100% !important;
    height: calc(100vh - 36px - 31px);;
}
</style>
