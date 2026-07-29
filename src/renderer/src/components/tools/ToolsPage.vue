<template>
    <MediaMan v-if="route.query.toolkind === 'mdzMediaMan'"></MediaMan>
    <Preview v-if="route.query.toolkind === 'preview'"></Preview>
    <ThemeEditor v-if="route.query.toolkind === 'themeEditor'"></ThemeEditor>
</template>
<script setup>
/**
 * ----工具页面----
 * -----Mdz媒体管理工具（mdzMediaMan）-----
 * -----媒体预览工具（preview）-----
 * -----主题编辑器-----
 */
import MediaMan from "./media_manager/MediaMan.vue";
import Preview from "./media_preview/Preview.vue";
import {useRoute} from "vue-router";
import ThemeEditor from "./theme_editor/ThemeEditor.vue";

const route = useRoute();

</script>
<style scoped>

</style>
