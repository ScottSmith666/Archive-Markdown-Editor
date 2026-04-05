<script setup>
import { ref } from "vue";
import Editor from "./Editor.vue";
import Viewer from "./Viewer.vue";
import { useStore } from 'vuex';

const store = useStore();

// data
const parentPieceContent = ref("");
const parentFirstLineNumber = ref(1);
const parentVisualFirstLineNumber = ref(1);
const parentVisualLastLineNumber = ref(50);
const parentMiddleLineNumber = ref(25);
const parentFileTotalLineNumber = ref(50);

const goToTopOrBottom = ref(null);

// 定义修改data的方法
const updateParentData = (newValueList) => {
    parentPieceContent.value = newValueList[0];
    parentFirstLineNumber.value = newValueList[1];
    parentMiddleLineNumber.value = newValueList[2];
    parentVisualFirstLineNumber.value = newValueList[3]
    parentVisualLastLineNumber.value = newValueList[4];
    parentFileTotalLineNumber.value = newValueList[5];
};

const handleGoToTop = () => {
    goToTopOrBottom.value?.goToTop();
}

const handleGoToBottom = () => {
    goToTopOrBottom.value?.goToBottom();
}
</script>

<template>
    <div class="workspace-page">
        <!--Editor不能添加v-if，否则会出问题-->
        <Editor
            :class="store.state.editorMode === 'preview' ? 'editor-down' : ''"
            @update="updateParentData"
            @top="handleGoToTop"
            @bottom="handleGoToBottom"
        />
        <Viewer
            v-if="store.state.editorMode === 'mix' || store.state.editorMode === 'preview'"
            :class="store.state.editorMode === 'preview' ? 'viewer-up' : ''"
            :md-piece="parentPieceContent"
            :start-line-number="parentFirstLineNumber"
            :middle-line-number="parentMiddleLineNumber"
            :visual-start-line-number="parentVisualFirstLineNumber"
            :visual-end-line-number="parentVisualLastLineNumber"
            :file-total-line-number="parentFileTotalLineNumber"
            ref="goToTopOrBottom"
        />
    </div>
</template>
<style scoped>
@import "./styles/workspace-page.css";
</style>
