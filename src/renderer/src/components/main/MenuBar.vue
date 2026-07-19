<script setup>
import {onMounted} from "vue";
import {useStore} from 'vuex';

const store = useStore();

// methods
const closeCurrentPage = () => {
    let currentPage = store.state.tab.tabList.get(store.state.tab.currentOpenedPageId);
    store.commit('closeTabPage',
        {'pageId': store.state.tab.currentOpenedPageId, 'model': currentPage.get('monacoEditorModel')});
};

const openOfficialWebsite = () => {
    // https://scottsmith666.github.io/
    window.openURLPreload.openURL('https://archive-markdown-editor-ss.pages.dev/#/archive-markdown-editor');
};

const save = () => {
    // 检测当前打开的是不是已存在文件，如果不是，则说明是新建文件，直接调用另存为逻辑
    if (!store.state.tab.tabList.get(store.state.tab.currentOpenedPageId).get("isExistFile")) {
        store.commit('toggleModal', {'kind': 'save-as'});
    } else {
        store.dispatch('directSaveAction');
    }
};

const openUsageByHotkey = (e) => {
    let currentPage = store.state.tab.tabList.get(store.state.tab.currentOpenedPageId);
    // Ctrl/Command + Shift + H打开Archive Markdown Editor使用指南
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'h' || e.key === 'H')) {
        e.preventDefault(); // 阻止浏览器默认保存行为
        store.commit('addTabPage',
            {'pageType': 'document',
                'pageTitle': store.state.i18n.langPackage[store.state.settings.lang].tabBar.usage,
                'isExistFile': false, 'docName': `usage${store.state.settings.lang === 'zh-CN' ? '' : '-' + store.state.settings.lang}`});
    }
    // Ctrl/Command + N新建文件
    if ((e.ctrlKey || e.metaKey) && (e.key === 'n' || e.key === 'N')) {
        e.preventDefault();
        store.commit('addTabPage', {'pageType': 'file',
            'pageTitle': store.state.i18n.langPackage[store.state.settings.lang].tabBar.untitled, 'isExistFile': false});
    }
    // Ctrl/Command + O打开文件
    if ((e.ctrlKey || e.metaKey) && (e.key === 'o' || e.key === 'O')) {
        e.preventDefault();
        store.dispatch('getHarmonyPerms');
        store.dispatch('activateOpenFileDialogAction');
    }

    if (currentPage.get("type") === "file") {  // 只有文件页面才能保存
        // Ctrl/Command + S保存文件
        if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
            e.preventDefault();
            save();
        }
    }

    // Ctrl/Command + W关闭页面
    if ((e.ctrlKey || e.metaKey) && (e.key === 'w' || e.key === 'W')) {
        e.preventDefault();
        closeCurrentPage();
    }

    // Ctrl/Command + Q退出应用
    if ((e.ctrlKey || e.metaKey) && (e.key === 'q' || e.key === 'Q')) {
        e.preventDefault();
        window.confirmPreload.tryClose();
    }

    // Ctrl/Command + ,打开设置
    if ((e.ctrlKey || e.metaKey) && e.code === 'Comma') {
        e.preventDefault();
        store.commit('addTabPage', {'pageType': 'settings',
            'pageTitle': store.state.i18n.langPackage[store.state.settings.lang].tabBar.settings,
            'isExistFile': false});
    }
};

onMounted(() => {
    // 设置快捷键事件
    window.addEventListener('keydown', openUsageByHotkey);
});

</script>

<template>
    <div class="keep-head nav" id="nav">
        <div class="nav-ico-position">
            <div class="nav-ico-wrap">
                <svg class="icon nav-ico" id="图层_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                     viewBox="0 0 160.2 143.7" style="enable-background:new 0 0 160.2 143.7;" xml:space="preserve">
<path style="fill-rule:evenodd;clip-rule:evenodd;fill:#FFFFFF;" class="st0" d="M36.9,100.1l0.8-0.5l23.5,26.1l-0.5,0.7c-7.3,6.5-18.5,6-25-1.3C29,117.9,29.6,106.7,36.9,100.1z"/>
                    <path class="st1" style="fill:none;stroke:#040000;stroke-width:6;stroke-miterlimit:8;" d="M36.9,100.1l0.8-0.5l23.5,26.1l-0.5,0.7c-7.3,6.5-18.5,6-25-1.3C29,117.9,29.6,106.7,36.9,100.1z"/>
                    <path class="st2" style="fill-rule:evenodd;clip-rule:evenodd;fill:#F5BA1A;" d="M54.6,3c28.2-0.4,51.4,22.2,51.8,50.4S84.2,104.8,56,105.2c-0.5,0-1,0-1.4,0l-1.4-0.2v20l-27.7-23.2
	c-9.6-8-16.6-18.7-20-30.7l-0.9-5.2l-0.5-1.5l-0.3-2.5l-0.5-2.6V58h0.1L3,54C3.2,25.7,26.2,2.9,54.6,3L54.6,3z"/>
                    <path class="st1" style="fill:none;stroke:#040000;stroke-width:6;stroke-miterlimit:8;" d="M54.6,3c28.2-0.4,51.4,22.2,51.8,50.4S84.2,104.8,56,105.2c-0.5,0-1,0-1.4,0l-1.4-0.2v20l-27.7-23.2
	c-9.6-8-16.6-18.7-20-30.7l-0.9-5.2l-0.5-1.5l-0.3-2.5l-0.5-2.6V58h0.1L3,54C3.2,25.7,26.2,2.9,54.6,3L54.6,3z"/>
                    <path class="st2" style="fill-rule:evenodd;clip-rule:evenodd;fill:#F5BA1A;" d="M34,16.4l20.6,10.2l18.3-10.1l4.6,3.8c13,13.2,13.2,34.2,0.5,46.8L54.8,89.8l-23.7-24
	c-13-13.2-13.2-34.2-0.5-46.8L34,16.4z"/>
                    <path class="st1" style="fill:none;stroke:#040000;stroke-width:6;stroke-miterlimit:8;" d="M34,16.4l20.6,10.2l18.3-10.1l4.6,3.8l0,0c13,13.2,13.2,34.2,0.5,46.8L54.8,89.8l-23.7-24
	c-13-13.2-13.2-34.2-0.5-46.8L34,16.4z"/>
                    <path class="st3" style="fill-rule:evenodd;clip-rule:evenodd;fill:#F9E198;" d="M66.5,23.1l2.9,2.4l0,0c8.2,8.3,8.1,21.7-0.2,29.9L54.1,70.3L39.2,55.2c-8.2-8.3-8.1-21.7,0.2-29.9l0,0l0,0
	l2.2-1.7l13.1,6.3L66.5,23.1z"/>
                    <path class="st4" style="fill-rule:evenodd;clip-rule:evenodd;fill:#040000;" d="M55.6,129l-0.5-0.2V94.2l0.5-0.2c5.8,0,10.5,7.8,10.5,17.5S61.4,129,55.6,129z"/>
                    <path class="st1" style="fill:none;stroke:#040000;stroke-width:6;stroke-miterlimit:8;" d="M55.6,129l-0.5-0.2V94.2l0.5-0.2c5.8,0,10.5,7.8,10.5,17.5S61.4,129,55.6,129z"/>
                    <polygon class="st5" style="fill:#040000;" points="58.3,126.2 59.3,112.1 38.3,93.9 37.3,107.9 "/>
                    <polygon class="st5" style="fill:#040000;" points="57.7,114 60.2,100.2 52,91.1 49.4,104.9 "/>
                    <path class="st0" style="fill-rule:evenodd;clip-rule:evenodd;fill:#FFFFFF;" d="M67.1,101.1l8-6.4c9.2-8.7,17.4-18.4,24.4-29l3.1-5.6l-0.5,6.5c-1.5,5.8-5.2,12.6-10.5,18.9s-11.5,11.1-17,13.6
	L67.1,101.1z"/>
                    <path class="st6" style="fill:#FFFFFF;" d="M77.2,97.7c-4.9-3.8-9.3-3.4-9.9,0.9c-0.1,0.6-0.1,1.3,0,1.9L77.2,97.7z"/>
                    <line class="st7" style="fill:none;stroke:#040000;stroke-miterlimit:8;" x1="73.1" y1="55.9" x2="57.6" y2="52.5"/>
                    <line class="st7" style="fill:none;stroke:#040000;stroke-miterlimit:8;" x1="71.5" y1="58.6" x2="57.6" y2="53.5"/>
                    <line class="st7" style="fill:none;stroke:#040000;stroke-miterlimit:8;" x1="69.7" y1="62.8" x2="57.6" y2="55.5"/>
                    <line class="st7" style="fill:none;stroke:#040000;stroke-miterlimit:8;" x1="54.6" y1="60.9" x2="54.6" y2="48.5"/>
                    <path class="st7" style="fill:none;stroke:#040000;stroke-miterlimit:8;" d="M54.1,60.6c-0.7,1.7-2.9,2-4.8,0.8c-0.4-0.3-0.7-0.5-1-0.9"/>
                    <path class="st7" style="fill:none;stroke:#040000;stroke-miterlimit:8;" d="M53.5,60.6c0.7,1.7,2.9,2,4.9,0.8c0.4-0.2,0.7-0.5,1-0.9"/>
                    <line class="st7" style="fill:none;stroke:#040000;stroke-miterlimit:8;" x1="35.6" y1="55.9" x2="51.1" y2="52.5"/>
                    <line class="st7" style="fill:none;stroke:#040000;stroke-miterlimit:8;" x1="36.6" y1="59.6" x2="50.5" y2="54.5"/>
                    <line class="st7" style="fill:none;stroke:#040000;stroke-miterlimit:8;" x1="38.6" y1="62.8" x2="50.7" y2="55.5"/>
                    <path class="st6" style="fill:#FFFFFF;" d="M65.6,42.7c-1.6,1.7-4.3,1.7-6,0.1l-3-3l3-3c1.6-1.7,4.3-1.7,6-0.1C67.3,38.4,67.3,41.1,65.6,42.7L65.6,42.7
	L65.6,42.7z"/>
                    <path class="st6" style="fill:#FFFFFF;" d="M60.1,36.5c1.8-1.5,4.5-1.3,6,0.5l0,0l2.7,3.3L65.5,43c-1.9,1.4-4.5,1.1-6-0.8C58.1,40.5,58.4,37.9,60.1,36.5z"
                    />
                    <ellipse class="st5" style="fill:#040000;" cx="63.1" cy="40" rx="2" ry="4"/>
                    <path class="st6" style="fill:#FFFFFF;" d="M48.1,42.2c-1.6,1.7-4.3,1.7-6,0.1l-3-3l3-3c1.6-1.7,4.3-1.7,6-0.1C49.8,37.9,49.9,40.5,48.1,42.2L48.1,42.2
	L48.1,42.2z"/>
                    <path class="st6" style="fill:#FFFFFF;" d="M42.6,36c1.8-1.5,4.5-1.3,6,0.6l0,0l0,0l2.7,3.3L48,42.6c-1.7,1.6-4.4,1.6-6-0.1c-1.6-1.7-1.6-4.4,0.1-6
	C42.3,36.3,42.5,36.1,42.6,36L42.6,36z"/>
                    <ellipse class="st5" style="fill:#040000;" cx="45.1" cy="39.5" rx="2" ry="4.5"/>
                    <path d="M134.9,133.7H88.7c-2.1,0-3.9-1.7-3.9-3.9v-25.4c0-2.1,1.7-3.9,3.9-3.9h46.2c2.1,0,3.9,1.7,3.9,3.9v25.4
	C138.8,132,137,133.7,134.9,133.7L134.9,133.7z M97.8,126v-10.1l5.2,6.5l5.2-6.5V126h5.2v-17.6h-5.2l-5.2,6.5l-5.2-6.5h-5.2V126
	H97.8L97.8,126z M132.5,117.2h-5.2v-8.8h-5.2v8.8H117l7.8,9.1L132.5,117.2z"/>
</svg>
            </div>
            <div class="break"></div>
            <div class="bar-menu-position">
                <div class="bar-menu-element lower">
                    <div id="file" class="bar-menu-element-txt fonts" @click="store.commit('mainManuClick', 'file')">
                        {{ store.state.i18n.langPackage[store.state.settings.lang].menuBar.file.mainCaption }}
                    </div>
                    <Transition name="slide-fade">
                        <div id="file-expand" class="upper menu" style="margin-left: -10px;"
                             v-if="store.state.menu.fileMenuStyleStatus">
                            <div class="menu-element" id="main-menu-new"
                                 @click="store.commit('addTabPage',
                                 {'pageType': 'file',
                                 'pageTitle': store.state.i18n.langPackage[store.state.settings.lang].tabBar.untitled, 'isExistFile': false});
                                 store.dispatch('getHarmonyPerms');
                                 store.commit('mainManuAllHide');">
                                <p class="fonts">{{ store.state.i18n.langPackage[store.state.settings.lang].menuBar.file.subCaptions.new }}</p>
                            </div>
                            <div class="menu-element" id="main-menu-open"
                                 @click="store.dispatch('activateOpenFileDialogAction');
                                 store.dispatch('getHarmonyPerms');
                                 store.commit('mainManuAllHide');">
                                <p class="fonts">{{ store.state.i18n.langPackage[store.state.settings.lang].menuBar.file.subCaptions.open }}</p>
                            </div>
                            <template v-if="store.state.tab.tabList.get(store.state.tab.currentOpenedPageId)
                                ? store.state.tab.tabList.get(store.state.tab.currentOpenedPageId).get('type') === 'file'
                                : false">
                                <div class="menu-element" id="main-menu-save"
                                     @click="save(); store.commit('mainManuAllHide');">
                                    <p class="fonts">{{ store.state.i18n.langPackage[store.state.settings.lang].menuBar.file.subCaptions.save }}</p>
                                </div>
                                <div class="menu-element" id="main-menu-save-as"
                                     @click="store.commit('toggleModal', {'kind': 'save-as'}); store.commit('mainManuAllHide');">
                                    <p class="fonts">{{ store.state.i18n.langPackage[store.state.settings.lang].menuBar.file.subCaptions.saveAs }}</p>
                                </div>
                            </template>

                            <template v-if="store.state.tab.tabList.size !== 0">
                                <div class="menu-element" id="main-menu-close"
                                     @click="closeCurrentPage(); store.commit('mainManuAllHide');">
                                    <p class="fonts">{{ store.state.i18n.langPackage[store.state.settings.lang].menuBar.file.subCaptions.close }}</p>
                                </div>
                            </template>
                            <div class="menu-element" id="app-quit" @click="store.commit('quitApp');
                                 store.commit('mainManuAllHide');">
                                <p class="fonts">{{ store.state.i18n.langPackage[store.state.settings.lang].menuBar.file.subCaptions.exitAME }}</p>
                            </div>
                        </div>
                    </Transition>

                    <div class="main-menu-separator"></div>

                    <div id="edit" class="bar-menu-element-txt fonts"
                         @click="store.commit('mainManuClick', 'edit')">
                        {{ store.state.i18n.langPackage[store.state.settings.lang].menuBar.edit.mainCaption }}
                    </div>
                    <Transition name="slide-fade">
                        <div id="edit-expand" class="upper menu" style="margin-left: calc(1 * (25px + 15px));"
                             v-if="store.state.menu.editMenuStyleStatus">
                            <div class="menu-element" id="settings"
                                 @click="store.commit('addTabPage',
                                 {'pageType': 'settings',
                                 'pageTitle': store.state.i18n.langPackage[store.state.settings.lang].tabBar.settings, 'isExistFile': false});
                                 store.commit('mainManuAllHide');">
                                <p class="fonts">{{ store.state.i18n.langPackage[store.state.settings.lang].menuBar.edit.subCaptions.settings }}</p>
                            </div>
                        </div>
                    </Transition>

                    <template v-if="store.state.tab.tabList.get(store.state.tab.currentOpenedPageId)
                        ? store.state.tab.tabList.get(store.state.tab.currentOpenedPageId).get('type') === 'file'
                        : false">
                        <div class="main-menu-separator"></div>
                        <div id="view" class="bar-menu-element-txt fonts"
                             @click="store.commit('mainManuClick', 'view')">
                            {{ store.state.i18n.langPackage[store.state.settings.lang].menuBar.view.mainCaption }}
                        </div>
                        <Transition name="slide-fade">
                            <div id="view-expand" class="upper menu" style="margin-left: calc(2 * (25px + 18px));"
                                 v-if="store.state.menu.viewMenuStyleStatus">
                                <div class="menu-element" id="preview-mode"
                                     @click="store.commit('changeEditorMode', 'preview'); store.commit('mainManuAllHide');">
                                    <p class="fonts">{{ store.state.i18n.langPackage[store.state.settings.lang].menuBar.view.subCaptions.viewMode }}</p>
                                </div>
                                <div class="menu-element" id="edit-mode"
                                     @click="store.commit('changeEditorMode', 'edit'); store.commit('mainManuAllHide');">
                                    <p class="fonts">{{ store.state.i18n.langPackage[store.state.settings.lang].menuBar.view.subCaptions.editMode }}</p>
                                </div>
                                <div class="menu-element" id="mix-mode"
                                     @click="store.commit('changeEditorMode', 'mix'); store.commit('mainManuAllHide');">
                                    <p class="fonts">{{ store.state.i18n.langPackage[store.state.settings.lang].menuBar.view.subCaptions.mixMode }}</p>
                                </div>
                            </div>
                        </Transition>
                    </template>

                        <div class="main-menu-separator"></div>
                        <div id="tool" class="bar-menu-element-txt fonts"
                             @click="store.commit('mainManuClick', 'tool')">
                            {{ store.state.i18n.langPackage[store.state.settings.lang].menuBar.tools.mainCaption }}
                        </div>
                        <Transition name="slide-fade">
                            <div id="view-expand" class="upper menu"
                                 :style="`margin-left: calc((3 - ${(store.state.tab.tabList.get(store.state.tab.currentOpenedPageId)
                                    ? store.state.tab.tabList.get(store.state.tab.currentOpenedPageId).get('type') === 'file'
                                    : false) ? 0 : 1}) * (25px + 18px));`"
                                 v-if="store.state.menu.toolMenuStyleStatus">
                                <div class="menu-element" id="mdz-media-man"
                                     @click="store.commit('addTabPage',
                                        {
                                            'pageType': 'tools',
                                            'pageTitle': store.state.i18n.langPackage[store.state.settings.lang].toolsPage.mdzMediaMan.tabTitle,
                                            'toolKind': 'mdzMediaMan'
                                        }); store.commit('mainManuAllHide');">
                                    <p class="fonts">{{ store.state.i18n.langPackage[store.state.settings.lang].menuBar.tools.subCaptions.mdzMediaMan }}</p>
                                </div>
                            </div>
                        </Transition>

                    <div class="main-menu-separator"></div>

                    <div id="help" class="bar-menu-element-txt fonts" @click="store.commit('mainManuClick', 'help')">
                        {{ store.state.i18n.langPackage[store.state.settings.lang].menuBar.help.mainCaption }}
                    </div>
                    <Transition name="slide-fade">
                        <div id="help-expand" class="upper menu"
                             :style="`margin-left: calc((4 - ${(store.state.tab.tabList.get(store.state.tab.currentOpenedPageId)
                                ? store.state.tab.tabList.get(store.state.tab.currentOpenedPageId).get('type') === 'file'
                                : false) ? 0 : 1}) * (25px + 18px));`"
                             v-if="store.state.menu.helpMenuStyleStatus">
                            <div class="menu-element"
                                 @click="store.commit('addTabPage', {'pageType': 'welcome',
                                 'pageTitle': store.state.i18n.langPackage[store.state.settings.lang].tabBar.welcome, 'isExistFile': false}); store.commit('mainManuAllHide');">
                                <p class="fonts">{{ store.state.i18n.langPackage[store.state.settings.lang].menuBar.help.subCaptions.welcome }}</p>
                            </div>
                            <div class="menu-element" id="about"
                                 @click="store.commit('addTabPage', {'pageType': 'document',
                                 'pageTitle': store.state.i18n.langPackage[store.state.settings.lang].tabBar.about, 'isExistFile': false,
                                 'docName': `about${store.state.settings.lang === 'zh-CN' ? '' : '-' + store.state.settings.lang}`}); store.commit('mainManuAllHide');">
                                <p class="fonts">{{ store.state.i18n.langPackage[store.state.settings.lang].menuBar.help.subCaptions.about }}</p>
                            </div>
                            <div class="menu-element" id="about"
                                 @click="store.commit('addTabPage', {'pageType': 'document',
                                 'pageTitle': store.state.i18n.langPackage[store.state.settings.lang].tabBar.usage, 'isExistFile': false,
                                 'docName': `usage${store.state.settings.lang === 'zh-CN' ? '' : '-' + store.state.settings.lang}`}); store.commit('mainManuAllHide');">
                                <p class="fonts">{{ store.state.i18n.langPackage[store.state.settings.lang].menuBar.help.subCaptions.usage }}</p>
                            </div>
                            <div class="menu-element" id="syntax"
                                 @click="store.commit('addTabPage', {'pageType': 'document',
                                 'pageTitle': store.state.i18n.langPackage[store.state.settings.lang].tabBar.syntax, 'isExistFile': false,
                                 'docName': `syntax${store.state.settings.lang === 'zh-CN' ? '' : '-' + store.state.settings.lang}`}); store.commit('mainManuAllHide');">
                                <p class="fonts">{{ store.state.i18n.langPackage[store.state.settings.lang].menuBar.help.subCaptions.syntax }}</p>
                            </div>
                            <div class="menu-element" id="donate"
                                 @click="store.commit('toggleModal', {'kind': 'donate'}); store.commit('mainManuAllHide');">
                                <p class="fonts" style="color: red;">{{ store.state.i18n.langPackage[store.state.settings.lang].menuBar.help.subCaptions.donate }}</p>
                            </div>
                            <div class="menu-element" id="learn-more"
                                 @click="openOfficialWebsite(); store.commit('mainManuAllHide');">
                                <p class="fonts">{{ store.state.i18n.langPackage[store.state.settings.lang].menuBar.help.subCaptions.officialSite }}</p>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
@import "./styles/menu-bar.css";

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
</style>
