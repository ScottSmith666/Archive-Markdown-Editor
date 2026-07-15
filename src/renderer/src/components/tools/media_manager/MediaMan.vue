<script setup>
import {useStore} from "vuex";
import {ref, watch} from "vue";

const store = useStore();

const chosenMdzPageID = ref("NULL");
const mediaListInMdz = ref([]);
const mdzMediaHome = ref("");
const keyWord = ref("");

const displayConfirmDeleteMedia = ref(false);
const currentClickedFileName = ref("");

const urlParamsToObject = (url) => {
    // 将“/url?param1=value1&param2=value2...”转化为{param1: value1, param2: value2, ...}
    const queryString = url.split('?')[1] || '';  // 提取查询部分
    const query = queryString.split('#')[0];  // 去除锚点
    const kvList = query.split('&');
    const obj = {};
    for (let i = 0; i < kvList.length; i++) {
        let kv = kvList[i].split("=");
        obj[kv[0]] = decodeURI(kv[1]);
    }
    return obj;
};

const filterOpenedMDZs = (tabList) => {

    let result = [];

    for (let [key, value] of tabList) {
        if (value.get('isExistFile')) {  // 先判断是不是一个真实存在的文件
            let filePath = urlParamsToObject(value.get('path')).filepath;
            if (filePath.split(".").pop() === "mdz") {
                result.push([filePath, value.get("pageid")]);
            }
        }
    }

    return result;  // 这里计划返回：["文件路径", ...]
};

const searchMediaFileName = (list, keyWord) => {
    if (keyWord.value === "") {
        return list;
    }
    return list.filter((item) => {
        return item.toLowerCase().includes(keyWord.toLowerCase());
    });
};

const expandPreviewDialog = (url) => {
    localStorage.setItem(`${store.state.tab.currentOpenedPageId}-click-media-path`, decodeURI(url));
    setTimeout(() => {
        if (localStorage.getItem(`${store.state.tab.currentOpenedPageId}-click-media-path`)) {
            store.commit('toggleModal', {'kind': 'preview'});
        }
    }, 400);
};

const copyIntoClip = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        store.commit('autoTips', {kind: "tip", tipLevel:
                "success", content: store.state.i18n.langPackage[store.state.settings.lang].toolsPage.mdzMediaMan.copyResultPrompt.success});
    } catch (err) {
        store.commit('autoTips', {kind: "tip", tipLevel: "success",
            content: `${store.state.i18n.langPackage[store.state.settings.lang].toolsPage.mdzMediaMan.copyResultPrompt.fail}${err.name}`});
    }
}

const copyMdzCode = (fileName) => {
    let ext = fileName.split(".").pop().toLowerCase();
    if (store.state.exts.videoExts.includes(ext)) {
        copyIntoClip('![${video}:]($MDZ_MEDIA/' + encodeURI(fileName) + ')');
    } else if (store.state.exts.audioExts.includes(ext)) {
        copyIntoClip('![${audio}:]($MDZ_MEDIA/' + encodeURI(fileName) + ')');
    } else if (store.state.exts.imageExts.includes(ext)) {
        copyIntoClip(`![]($MDZ_MEDIA/${encodeURI(fileName)})`);
    } else {
        copyIntoClip('![${file}:]($MDZ_MEDIA/' + encodeURI(fileName) + ')');
    }
};

const deleteMediaInMdz = (fileName, filePath) => {
    let filePathDecoded = decodeURI(filePath);
    window.fileManPreload.deleteMediaInMdz(filePathDecoded).then((result) => {
        if (result.success) {
            mediaListInMdz.value = mediaListInMdz.value.filter(item => item !== fileName);
            // 更改mdz标签页为未保存状态
            store.state.tab.tabList.get(chosenMdzPageID.value).set("saved", false);
        }
        store.commit('autoTips', {kind: "tip", tipLevel: result.success ? "success" : "fail", content: result.message});
    });
};

const getMdzPathByPageID = (pageID) => {
    return decodeURI(urlParamsToObject(store.state.tab.tabList.get(pageID).get("path")).filepath);
};

const addMediaIntoMdz = () => {
    let mdzPathArray = getMdzPathByPageID(chosenMdzPageID.value).split("/");
    let mdzNameArray = mdzPathArray.pop().split(".");
    mdzNameArray.pop();
    let mdzNameRemoveExt = mdzNameArray.join(".");
    let mdzHomePath = mdzPathArray.join("/");
    let destinationMediaHomePath = `${mdzHomePath}/._mdz_content.${mdzNameRemoveExt}/mdz_contents/media_src`;
    window.fileManPreload.importMediaIntoMdz(
        store.state.i18n.langPackage[store.state.settings.lang].dialog.systemDialogImportMdzMedia,
        destinationMediaHomePath
    ).then((result) => {
        if (result.success) {
            mediaListInMdz.value.push(result.message[1]);
            // 更改mdz标签页为未保存状态
            store.state.tab.tabList.get(chosenMdzPageID.value).set("saved", false);
        }
        store.commit('autoTips', {kind: "tip", tipLevel: result.success ? "success" : "fail", content: result.message[0]});
    });
};

// watch
watch(chosenMdzPageID, async (newVal, oldVal) => {
    if (newVal !== 'NULL') {
        let chosenMdzPath = getMdzPathByPageID(newVal);
        let mdzPathList = chosenMdzPath.split('/');
        let mdzFileNameDotSplitList = mdzPathList.pop().split('.');
        let mdzInPath = mdzPathList.join("/");
        mdzFileNameDotSplitList.pop();
        let mdzFileNameRemoveExt = mdzFileNameDotSplitList.join(".");
        let mediaHomePath = `${mdzInPath}/._mdz_content.${mdzFileNameRemoveExt}/mdz_contents/media_src/`;
        let searchResult = await window.fileManPreload.getMdzMediaList(mediaHomePath);
        if (searchResult.success) {
            mediaListInMdz.value = searchResult.message.nameList;
            mdzMediaHome.value = searchResult.message.homeDir;
        }
    }
});
</script>

<template>
    <div class="media-manager-container fonts">
        <div class="media-manager">
            <div class="title1">
                <div class="title1-block"></div>
                <div style="width: 8px"></div>
                <h1>
                    {{ store.state.i18n.langPackage[store.state.settings.lang].toolsPage.mdzMediaMan.tabTitle }}
                </h1>
            </div>

            <div class="title2">
                <div class="title2-block"></div>
                <div style="width: 8px"></div>
                <h2>{{ store.state.i18n.langPackage[store.state.settings.lang].toolsPage.mdzMediaMan.targetMdz }}</h2>
            </div>

            <!--这里通过选择已经打开的mdz文件查看里面的媒体文件(select)，如果没有，则显示“当前未打开mdz文件”-->
            <template v-if="filterOpenedMDZs(store.state.tab.tabList).length === 0">
                <div style="color: #6a737d;">{{ store.state.i18n.langPackage[store.state.settings.lang].toolsPage.mdzMediaMan.notExistsMdz }}</div>
            </template>
            <template v-else>
                <select class="choose-opened-mdz" v-model="chosenMdzPageID">
                    <option value="NULL" selected>
                        {{ store.state.i18n.langPackage[store.state.settings.lang].toolsPage.mdzMediaMan.chooseOpenedMdz }}
                    </option>
                    <template v-for="(item, index) in filterOpenedMDZs(store.state.tab.tabList)" :key="item[1]">
                        <option :value="item[1]">
                            {{ item[0].split("/").pop() }}
                        </option>
                    </template>
                </select>
            </template>

            <div class="title2">
                <div class="title2-block"></div>
                <div style="width: 8px"></div>
                <h2>{{ store.state.i18n.langPackage[store.state.settings.lang].toolsPage.mdzMediaMan.mediaList }}</h2>
            </div>

            <!--选中的mdz文件中媒体文件将列于此处-->
            <Transition name="slide-fade">
                <div v-if="chosenMdzPageID === 'NULL'" style="color: #6a737d;">
                    {{ store.state.i18n.langPackage[store.state.settings.lang].toolsPage.mdzMediaMan.cannotShowMediaInMdz }}
                </div>
            </Transition>
            <Transition name="slide-fade">
                <div v-if="chosenMdzPageID !== 'NULL'">
                    <div class="title3">
                        <div class="title3-block"></div>
                        <div style="width: 8px"></div>
                        <h3>{{ store.state.i18n.langPackage[store.state.settings.lang].toolsPage.mdzMediaMan.mediaFileListed[0] }}{{ getMdzPathByPageID(chosenMdzPageID) }}{{ store.state.i18n.langPackage[store.state.settings.lang].toolsPage.mdzMediaMan.mediaFileListed[1] }}</h3>
                    </div>

                    <div>
                        <!--工具栏-->
                        <div class="toolbar-group">
                            <input class="choose-opened-mdz"
                                   :placeholder="store.state.i18n.langPackage[store.state.settings.lang].toolsPage.mdzMediaMan.searchPlaceholder"
                                   v-model="keyWord"/>
                            <div class="insert-media-button" @click="addMediaIntoMdz">
                                {{ store.state.i18n.langPackage[store.state.settings.lang].toolsPage.mdzMediaMan.addMedia }}
                            </div><!--插入媒体文件按钮-->
                        </div>
                        <div style="height: 5px;"></div>
                        <div class="block-line"></div>
                    </div>
                    <div v-if="searchMediaFileName(mediaListInMdz, keyWord).length === 0"
                         style="color: #6a737d; line-height: 25px; width: 100%; text-align: center;">
                        {{ store.state.i18n.langPackage[store.state.settings.lang].toolsPage.mdzMediaMan.searchNoResult }}
                    </div>
                    <div v-else>
                        <!--列表区域-->
                        <TransitionGroup name="list" tag="div">
                            <div class="record" v-for="(item, index) in searchMediaFileName(mediaListInMdz, keyWord)" :key="item">
                                <div class="media-file-name-icon">
                                    <svg v-if="store.state.exts.videoExts.includes(item.split('.').pop().toLowerCase())" t="1783733655325" class="icon record-icon video-" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5380" width="200" height="200"><path d="M512.18430154 511.7630409m-505.43372745 0a505.43372742 505.43372742 0 1 0 1010.86745489 0 505.43372742 505.43372742 0 1 0-1010.86745489 0Z" fill="#42b983" p-id="5381" data-spm-anchor-id="a313x.search_index.0.i3.41e13a818r7TFt" class="selected"></path><path d="M373.94664998 257.46644997v508.59811855c0 1.20947866 1.30821162 1.94997582 2.3449076 1.3575781l440.47238174-254.31140091c1.036696-0.5923977 1.036696-2.09807521 0-2.71515618L376.29155758 256.10887187a1.57479055 1.57479055 0 0 0-2.3449076 1.3575781z" fill="#FFFFFF" p-id="5382"></path></svg>
                                    <svg v-else-if="store.state.exts.audioExts.includes(item.split('.').pop().toLowerCase())" t="1783735207526" class="icon record-icon audio-" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8026" width="200" height="200"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#42b983" p-id="8027" data-spm-anchor-id="a313x.search_index.0.i14.41e13a812AtRJy" class="selected"></path><path d="M512 665.6c-90.2784 0-164.9536-66.752-177.3824-153.6H386.56c11.8656 58.432 63.5136 102.4 125.44 102.4 61.9264 0 113.5744-43.968 125.44-102.4h51.9424c-12.416 86.848-87.104 153.6-177.3824 153.6z" fill="#FFFFFF" p-id="8028"></path><path d="M512 307.2a76.8 76.8 0 0 1 76.8 76.8v102.4a76.8 76.8 0 1 1-153.6 0v-102.4a76.8 76.8 0 0 1 76.8-76.8z m0 51.2a25.6 25.6 0 0 0-25.536 23.68L486.4 384v102.4a25.6 25.6 0 0 0 51.136 1.92L537.6 486.4v-102.4a25.6 25.6 0 0 0-25.6-25.6z" fill="#FFFFFF" p-id="8029"></path><path d="M486.4 627.2h51.2v89.6h-51.2z" fill="#FFFFFF" p-id="8030"></path></svg>
                                    <svg v-else-if="store.state.exts.imageExts.includes(item.split('.').pop().toLowerCase())" t="1783734978963" class="icon record-icon image-" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6564" width="200" height="200"><path d="M512 42.666667c259.2 0 469.333333 210.133333 469.333333 469.333333s-210.133333 469.333333-469.333333 469.333333S42.666667 771.2 42.666667 512 252.8 42.666667 512 42.666667z m0 64C288.149333 106.666667 106.666667 288.149333 106.666667 512c0 70.784 18.133333 137.344 50.048 195.264l216.384-197.546667a32 32 0 0 1 38.485333-3.541333l2.517333 1.728 158.72 121.386667 297.557334-306.837334C802.346667 194.133333 667.392 106.666667 512 106.666667z m138.666667 181.333333a64 64 0 1 1 0 128 64 64 0 0 1 0-128z" fill="#42b983" p-id="6565" data-spm-anchor-id="a313x.search_index.0.i6.41e13a812AtRJy" class="selected"></path></svg>
                                    <svg v-else t="1783735033353" class="icon record-icon file-" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6884" width="200" height="200"><path d="M512 63C264 63 63 264 63 512s201 449 449 449 449-201 449-449S760 63 512 63z m239.46 669.76H272.54V310h230l21.15 37.42h139.05c38.61 0 70 25.18 70 56.13V428h-29.91v-24.5c0-14.2-18.36-26.2-40.09-26.2H540.61l28.67 50.7h182.18z" fill="#42b983" p-id="6885" data-spm-anchor-id="a313x.search_index.0.i10.41e13a812AtRJy" class=""></path><path d="M485.05 339.88H302.46v362.94h419.08V457.9H551.81l-66.76-118.02z" fill="#42b983" p-id="6886" data-spm-anchor-id="a313x.search_index.0.i9.41e13a812AtRJy" class=""></path></svg>
                                    <div style="width: 10px;"></div>
                                    <div>{{ item }}</div>
                                </div>
                                <div v-if="displayConfirmDeleteMedia && currentClickedFileName === item" class="media-button-group">
                                    <div>
                                        {{ store.state.i18n.langPackage[store.state.settings.lang].toolsPage.mdzMediaMan.deleteConfirm.question }}
                                    </div>
                                    <div style="width: 15px;"></div>
                                    <div style="color: #b41d23; cursor: pointer;" @click="deleteMediaInMdz(item, mdzMediaHome + '/' + item)">
                                        {{ store.state.i18n.langPackage[store.state.settings.lang].toolsPage.mdzMediaMan.deleteConfirm.yes }}
                                    </div>
                                    <div style="width: 15px;"></div>
                                    <div style="color: var(--main-color); cursor: pointer;" @click="displayConfirmDeleteMedia = false;">
                                        {{ store.state.i18n.langPackage[store.state.settings.lang].toolsPage.mdzMediaMan.deleteConfirm.no }}
                                    </div>
                                </div>
                                <div v-else class="media-button-group">
                                    <div class="preview-button" @click="expandPreviewDialog(mdzMediaHome + '/' + item)">
                                        {{ store.state.i18n.langPackage[store.state.settings.lang].toolsPage.mdzMediaMan.buttonGroup.preview }}
                                    </div>
                                    <div class="copy-code-button" @click="copyMdzCode(item)">
                                        {{ store.state.i18n.langPackage[store.state.settings.lang].toolsPage.mdzMediaMan.buttonGroup.copy }}
                                    </div>
                                    <div class="delete-button" @click="currentClickedFileName = item; displayConfirmDeleteMedia = true;">
                                        {{ store.state.i18n.langPackage[store.state.settings.lang].toolsPage.mdzMediaMan.buttonGroup.delete }}
                                    </div>
                                </div>
                            </div>
                        </TransitionGroup>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>

<style scoped>
@import "./styles/mediaman.css";

/* animations */
/*
  进入和离开动画可以使用不同
  持续时间和速度曲线。
*/
.slide-fade-enter-active {
    transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(10px);
    opacity: 0;
}

.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>
