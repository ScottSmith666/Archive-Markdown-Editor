<script setup>
import Viewer from "../workspace/Viewer.vue";
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";

const route = useRoute();

const content = ref("正在加载中...");

onMounted(() => {
    window.docLoaderPreload.docLoader(route.query.docname).then((data) => {
        content.value = data;
    });
});
</script>

<template>
<Viewer class="light-view" :enableToc="false" :enableSafe="false" :mdPiece="content"></Viewer>
</template>

<style>
.light-view {
    width: 100% !important;
    height: calc(100vh - 36px - 31px);;
}
</style>
