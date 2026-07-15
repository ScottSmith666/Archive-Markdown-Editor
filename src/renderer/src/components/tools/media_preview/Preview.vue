<script setup>
// props
import {nextTick, onMounted, ref} from "vue";
import {renderAsync} from "docx-preview";
import Spreadsheet from "x-data-spreadsheet";
import ZhCN from "x-data-spreadsheet/src/locale/zh-cn";
import store from "../../../store";

// 引入Prism
// 导入需要的语言
import 'prismjs/components/prism-clike.js'
import 'prismjs/components/prism-c.js';
import 'prismjs/components/prism-cpp.js';
import 'prismjs/components/prism-java.js';
import 'prismjs/components/prism-markup.js';
import 'prismjs/components/prism-css.js';
import 'prismjs/components/prism-javascript.js';
import 'prismjs/components/prism-typescript.js';
import 'prismjs/components/prism-python.js';
import 'prismjs/components/prism-markdown.js';
// 引入 Toolbar 插件
import 'prismjs/plugins/toolbar/prism-toolbar.js';
import 'prismjs/plugins/toolbar/prism-toolbar.css';
// 引入Show Language插件
import 'prismjs/plugins/show-language/prism-show-language.js';
// 引入Copy to Clipboard插件
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.js';
// 引入行号样式
import "prismjs/plugins/line-numbers/prism-line-numbers.js";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
// 导入主题
import 'prismjs/themes/prism.css';
import { ZoomImg } from 'vue3-zoomer';

Spreadsheet.locale("zh-cn", ZhCN);

const props = defineProps({
    mediaFilePath: {
        type: String,
        required: true,
    }
});

const isPreviewAsText = ref(false);

const previewAsTextContent = ref("");

// methods
const getExt = () => {
    let path = props.mediaFilePath;
    return path.split(".").pop();
};

const previewDocx = async () => {
    try {
        let path = decodeURI(props.mediaFilePath);
        let docxContent = await window.fileManPreload.getFileBuffer(path);
        renderAsync(docxContent, document.getElementById("docx-container")).then(x => {});
    } catch (e) {
        console.error("错误", e);
    }
};

const previewXlsx = async () => {
    try {
        let path = decodeURI(props.mediaFilePath);
        let xlsxContent = await window.fileManPreload.getFileBuffer(path, true);
        new Spreadsheet("#xlsx-container").loadData(xlsxContent);
    } catch (e) {
        console.error("错误", e);
    }
};

const previewAsText = async () => {
    try {
        previewAsTextContent.value = await window.fileManPreload.getFileAsText(props.mediaFilePath);
        isPreviewAsText.value = true;
        await nextTick(() => {
            Prism.highlightAll();
        });
    } catch (e) {
        console.error("错误", e);
    }
};

// mounted
onMounted(() => {
    if (getExt(props.mediaFilePath).toLowerCase() === 'docx') {
        previewDocx();
    } else if (getExt(props.mediaFilePath).toLowerCase() === 'xlsx') {
        previewXlsx();
    }
});

</script>

<template>
    <div class="preview-container">
        <div class="pdf-preview" v-if="getExt().toLowerCase() === 'pdf'">
            <iframe class="pdf-preview" :src="'file://' + encodeURI(props.mediaFilePath)"></iframe>
        </div>
        <div class="docx-preview" v-else-if="getExt().toLowerCase() === 'docx'">
            <div id="docx-container"></div>
        </div>
        <div class="docx-preview" v-else-if="getExt().toLowerCase() === 'xlsx'">
            <div id="xlsx-container"></div>
        </div>
        <div class="video-preview" v-else-if="store.state.exts.videoExts.includes(getExt().toLowerCase())">
            <video style="object-fit: contain;" controls>
                <source :src="'file://' + encodeURI(props.mediaFilePath)"/>
            </video>
        </div>
        <div class="audio-preview" v-else-if="store.state.exts.audioExts.includes(getExt().toLowerCase())">
            <audio style="width: 100%;" controls :src="'file://' + encodeURI(props.mediaFilePath)"></audio>
        </div>
        <div class="image-preview" v-else-if="store.state.exts.imageExts.includes(getExt().toLowerCase())">
            <zoom-img
                class="h-[30rem]"
                zoom-type="drag"
                :zoom-scale="5"
                :step="1"
                full-screen-mode
                :show-zoom-btns="true"
                :show-img-map="true"
                :src="'file://' + encodeURI(props.mediaFilePath)"
            />
        </div>
        <div class="cannot-preview" v-else>
            <div v-if="!isPreviewAsText"
                 style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <svg t="1783819512956" class="icon" viewBox="0 0 1024 1024" version="1.1"
                     xmlns="http://www.w3.org/2000/svg"
                     p-id="4749" width="200" height="200">
                    <path
                        d="M712.248889 86.471111c-39.253333 0-77.937778 8.533333-113.208889 24.462222l-73.955556 154.737778 114.915556 79.644445-158.72 193.991111 53.475556 154.168889-103.537778-157.582223 119.466666-166.115555-121.173333-55.182222 81.92-141.084445c-51.768889-55.182222-124.017778-86.471111-200.248889-86.471111-151.893333-0.568889-275.911111 124.586667-278.755555 279.893333V375.466667c0.568889 72.248889 27.306667 139.946667 75.662222 192.284444 1.137778 1.137778 1.706667 2.275556 2.844444 3.413333l3.982223 3.982223L468.764444 921.6c11.377778 11.377778 26.737778 17.635556 43.235556 17.635556s32.426667-6.826667 44.373333-18.204445c11.377778-10.24 289.564444-281.031111 353.848889-345.884444l0.568889-0.568889 2.275556-2.844445c50.631111-54.044444 79.075556-125.724444 78.506666-199.68 0-157.013333-125.155556-285.582222-279.324444-285.582222z"
                        fill="#cccccc" p-id="4750" data-spm-anchor-id="a313x.search_index.0.i0.b2d83a81QSBJB7"
                        class="selected"></path>
                </svg>
                <div style="color: #cccccc; font-weight: bold;">{{ store.state.i18n.langPackage[store.state.settings.lang].toolsPage.preview.notDirectPreview[0] }}</div>
                <div style="color: #cccccc; font-weight: bold;">{{ store.state.i18n.langPackage[store.state.settings.lang].toolsPage.preview.notDirectPreview[1] }}<span @click="previewAsText"
                     style="color: var(--main-color); cursor: pointer;"><u>{{ store.state.i18n.langPackage[store.state.settings.lang].toolsPage.preview.notDirectPreview[2] }}</u></span>
                </div>
            </div>
            <div class="text-preview" v-else>
                <pre class="line-numbers">
                    <code :class="'language-' + props.mediaFilePath.split('.').pop().toLowerCase()" style="display: block;">{{ previewAsTextContent.message }}</code>
                </pre>
            </div>
        </div>
    </div>
</template>

<style scoped>
.preview-container {
    width: 100%;
    height: calc(100% - 20px * 2 - 26px * 2);
    padding-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.pdf-preview {
    width: 100%;
    height: 100%;
    border: none;
}

.video-preview {
    width: 80%;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    object-fit: cover;
}

.audio-preview {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.docx-preview {
    width: 100%;
    height: 100%;
    overflow: scroll;
}

.text-preview {
    width: 100%;
    height: 100%;
    overflow: scroll;
}

.cannot-preview {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
</style>
