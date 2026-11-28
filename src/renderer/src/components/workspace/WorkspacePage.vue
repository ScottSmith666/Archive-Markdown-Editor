<script setup>
import { ref } from "vue";
import Editor from "./Editor.vue";
import Viewer from "./Viewer.vue";
import {useAmeLifecycleManStore} from "../../store/ame-lifecycle-man";
import {useTabManStore} from "../../store/tab-man";
import {useSettingsManStore} from "../../store/settings-man";

const ameLifecycleManStore = useAmeLifecycleManStore();
const tabManStore = useTabManStore();
const settingsManStore = useSettingsManStore();

// data
const parentPieceContent = ref("");
const parentFirstLineNumber = ref(1);
const parentMiddleLineNumber = ref(25);

const goToTopOrBottom = ref(null);

// 定义修改data的方法
const updateParentData = (newValueList) => {
    parentPieceContent.value = newValueList[0];
    parentFirstLineNumber.value = newValueList[1];
    parentMiddleLineNumber.value = newValueList[2];
};

const handleGoToTop = () => {
    goToTopOrBottom.value?.goToTop();
}

const handleGoToBottom = () => {
    goToTopOrBottom.value?.goToBottom();
}

const expandPreviewDialog = () => {
    setTimeout(() => {
        if (localStorage.getItem(`${tabManStore.currentOpenedPageId}-click-media-path`)) {
            ameLifecycleManStore.toggleModal({'wantToOpen': true, 'kind': 'preview'});
        }
    }, 400);
};
</script>

<template>
    <div class="workspace-page">
        <!--Editor不能添加v-if，否则会出问题-->
        <Editor
            :class="settingsManStore.editorMode === 'preview' ? 'editor-down' : ''"
            :style="settingsManStore.editorMode === 'edit' ? 'width: 100%;' : ''"
            @update="updateParentData"
            @top="handleGoToTop"
            @bottom="handleGoToBottom"
        />
        <Viewer
            v-if="settingsManStore.editorMode === 'mix' || settingsManStore.editorMode === 'preview'"
            :md-piece="parentPieceContent"
            :start-line-number="parentFirstLineNumber"
            :middle-line-number="parentMiddleLineNumber"
            :enableToc="false"
            :enable-document-media-path="{'isEnabled': false, 'path': ''}"
            ref="goToTopOrBottom"
            @click="expandPreviewDialog"
        />
    </div>
</template>
<style scoped>
@import "./styles/workspace-page.css";
</style>
