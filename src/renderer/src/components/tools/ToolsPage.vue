<template>
    <MediaMan v-if="route.query.toolkind === 'mdzMediaMan'"></MediaMan>
    <ThemeEditor v-if="route.query.toolkind === 'themeEditor'"></ThemeEditor>
    <FormulaEditor v-if="route.query.toolkind === 'formulaEditor'"></FormulaEditor>
    <MermaidEditor v-if="route.query.toolkind === 'mermaidEditor'"></MermaidEditor>
</template>
<script setup>
/**
 * ----工具页面----
 * -----Mdz媒体管理工具（mdzMediaMan）-----
 * -----媒体预览工具（preview）-----
 * -----主题编辑器（themeEditor）-----
 * -----公式编辑器（formulaEditor）-----
 * -----mermaid编辑器（mermaidEditor）-----
 */
import MediaMan from "./media_manager/MediaMan.vue";
import {useRoute} from "vue-router";
import ThemeEditor from "./theme_editor/ThemeEditor.vue";
import FormulaEditor from "./formula_editor/FormulaEditor.vue";
import MermaidEditor from "./mermaid_editor/MermaidEditor.vue";

const route = useRoute();

</script>
<style scoped>

</style>
