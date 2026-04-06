<script setup>
import {onMounted} from "vue";
import {useStore} from 'vuex';

const store = useStore();

// emit
const emit = defineEmits(['tgModal']);

// methods
const closeCurrentPage = (tabList) => {
    for (let [key, value] of tabList) {
        if (value.get('focus')) {
            store.commit('closeTabPage', {'pageId': key, 'model': value.get('monacoEditorModel')});
            return 0;
        }
    }
};

const openOfficialWebsite = () => {
    window.openURLPreload.openURL('https://scottsmith666.github.io/');
};

const openUsageByHotkey = (e) => {
    // Ctrl/Command + Shift + H打开Archive Markdown Editor使用指南
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'h' || e.key === 'H')) {
        e.preventDefault(); // 阻止浏览器默认保存行为
        store.commit('addTabPage', {'pageType': 'document', 'pageTitle': 'AME使用指南', 'isExistFile': false, 'docName': 'usage'});
    }
    // Ctrl/Command + N新建文件
    if ((e.ctrlKey || e.metaKey) && (e.key === 'n' || e.key === 'N')) {
        e.preventDefault(); // 阻止浏览器默认保存行为
        store.commit('addTabPage', {'pageType': 'file', 'pageTitle': '无标题文档', 'isExistFile': false});
    }
    // Ctrl/Command + W关闭页面
    if ((e.ctrlKey || e.metaKey) && (e.key === 'w' || e.key === 'W')) {
        e.preventDefault(); // 阻止浏览器默认保存行为
        closeCurrentPage(store.state.tabList);
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
                <svg class="icon nav-ico" id="图层_1" data-name="图层 1" xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 160.22 143.74"><title>未标题-1</title>
                    <path d="M36.86,100.11l.78-.47,23.47,26.1-.54.74a17.73,17.73,0,0,1-23.71-26.37Z"
                          transform="translate(0.06 0.01)" style="fill:#fff;fill-rule:evenodd"/>
                    <path d="M36.86,100.11l.78-.47,23.47,26.1-.54.74a17.73,17.73,0,0,1-23.71-26.37Z"
                          transform="translate(0.06 0.01)"
                          style="fill:none;stroke:#040000;stroke-miterlimit:8;stroke-width:6px"/>
                    <path
                        d="M54.5,3a51.09,51.09,0,0,1,1.43,102.17c-.48,0-1,0-1.43,0L53.08,105v20L25.43,101.81a62.22,62.22,0,0,1-20-30.71l-.94-5.18L4,64.38l-.26-2.49L3.28,59.3V58h.06l-.4-4A51.29,51.29,0,0,1,54.48,3Z"
                        transform="translate(0.06 0.01)" style="fill:#f5ba1a;fill-rule:evenodd"/>
                    <path
                        d="M54.5,3a51.09,51.09,0,0,1,1.43,102.17c-.48,0-1,0-1.43,0L53.08,105v20L25.43,101.81a62.22,62.22,0,0,1-20-30.71l-.94-5.18L4,64.38l-.26-2.49L3.28,59.3V58h.06l-.4-4A51.29,51.29,0,0,1,54.48,3Z"
                        transform="translate(0.06 0.01)"
                        style="fill:none;stroke:#040000;stroke-miterlimit:8;stroke-width:6px"/>
                    <path
                        d="M33.9,16.37,54.54,26.54,72.8,16.47l4.55,3.8c13.07,13.26,13.31,34.21.54,46.78L54.78,89.82l-23.66-24C18.06,52.55,17.82,31.61,30.58,19Z"
                        transform="translate(0.06 0.01)" style="fill:#f5ba1a;fill-rule:evenodd"/>
                    <path
                        d="M33.9,16.37,54.54,26.54,72.8,16.47l4.55,3.8h0c13.07,13.26,13.31,34.21.54,46.78L54.78,89.82l-23.66-24C18.06,52.55,17.82,31.61,30.58,19Z"
                        transform="translate(0.06 0.01)"
                        style="fill:none;stroke:#040000;stroke-miterlimit:8;stroke-width:6px"/>
                    <path
                        d="M66.45,23.11l2.87,2.38h0a21.18,21.18,0,0,1-.23,29.94L54,70.32,39.15,55.24a21.17,21.17,0,0,1,.22-29.94h0l2.16-1.73,13.09,6.26Z"
                        transform="translate(0.06 0.01)" style="fill:#f9e198;fill-rule:evenodd"/>
                    <path d="M55.53,129l-.53-.18V94.18l.53-.18C61.31,94,66,101.84,66,111.5S61.31,129,55.53,129Z"
                          transform="translate(0.06 0.01)" style="fill:#040000;fill-rule:evenodd"/>
                    <path d="M55.53,129l-.53-.18V94.18l.53-.18C61.31,94,66,101.84,66,111.5S61.31,129,55.53,129Z"
                          transform="translate(0.06 0.01)"
                          style="fill:none;stroke:#040000;stroke-miterlimit:8;stroke-width:6px"/>
                    <polygon points="58.31 126.17 59.28 112.14 38.28 93.88 37.31 107.92 58.31 126.17"
                             style="fill:#040000"/>
                    <polygon points="57.65 113.98 60.22 100.16 51.95 91.11 49.38 104.94 57.65 113.98"
                             style="fill:#040000"/>
                    <path
                        d="M67,101.11l8-6.4a161.64,161.64,0,0,0,24.42-29l3.12-5.64L102,66.61c-1.54,5.81-5.16,12.58-10.51,18.93S80,96.62,74.56,99.11Z"
                        transform="translate(0.06 0.01)" style="fill:#fff;fill-rule:evenodd"/>
                    <path d="M77.19,97.74c-4.89-3.78-9.31-3.37-9.87.93a7.39,7.39,0,0,0,0,1.88Z"
                          transform="translate(0.06 0.01)" style="fill:#fff"/>
                    <line x1="73.13" y1="55.86" x2="57.56" y2="52.51"
                          style="fill:none;stroke:#040000;stroke-miterlimit:8"/>
                    <line x1="71.48" y1="58.59" x2="57.56" y2="53.51"
                          style="fill:none;stroke:#040000;stroke-miterlimit:8"/>
                    <line x1="69.66" y1="62.82" x2="57.56" y2="55.51"
                          style="fill:none;stroke:#040000;stroke-miterlimit:8"/>
                    <line x1="54.56" y1="60.92" x2="54.56" y2="48.51"
                          style="fill:none;stroke:#040000;stroke-miterlimit:8"/>
                    <path d="M54,60.56c-.73,1.69-2.9,2-4.85.78a5.89,5.89,0,0,1-1-.87"
                          transform="translate(0.06 0.01)"
                          style="fill:none;stroke:#040000;stroke-miterlimit:8"/>
                    <path d="M53.48,60.6c.74,1.69,2.91,2,4.86.78a5.53,5.53,0,0,0,1-.87"
                          transform="translate(0.06 0.01)"
                          style="fill:none;stroke:#040000;stroke-miterlimit:8"/>
                    <line x1="35.56" y1="55.86" x2="51.13" y2="52.51"
                          style="fill:none;stroke:#040000;stroke-miterlimit:8"/>
                    <line x1="36.56" y1="59.59" x2="50.48" y2="54.51"
                          style="fill:none;stroke:#040000;stroke-miterlimit:8"/>
                    <line x1="38.56" y1="62.82" x2="50.66" y2="55.51"
                          style="fill:none;stroke:#040000;stroke-miterlimit:8"/>
                    <path d="M65.53,42.71a4.26,4.26,0,0,1-6,.07l-3-3,3-3a4.25,4.25,0,1,1,6.08,5.94h-.08Z"
                          transform="translate(0.06 0.01)" style="fill:#fff"/>
                    <path d="M60,36.45A4.27,4.27,0,0,1,66,37h0l2.7,3.29L65.41,43A4.25,4.25,0,0,1,60,36.45Z"
                          transform="translate(0.06 0.01)" style="fill:#fff"/>
                    <ellipse cx="63.06" cy="40.01" rx="2" ry="4" style="fill:#040000"/>
                    <path d="M48.07,42.2a4.26,4.26,0,0,1-6,.07l-3-3,3-3a4.25,4.25,0,0,1,6.08,5.94h-.08Z"
                          transform="translate(0.06 0.01)" style="fill:#fff"/>
                    <path d="M42.58,36a4.25,4.25,0,0,1,6,.57l0,0,2.69,3.28L48,42.52A4.25,4.25,0,1,1,42.59,36Z"
                          transform="translate(0.06 0.01)" style="fill:#fff"/>
                    <ellipse cx="45.06" cy="39.51" rx="2" ry="4.5" style="fill:#040000"/>
                    <text transform="translate(70.92 118.59) scale(1.02 1)"
                          style="isolation:isolate;font-size:17.649999618530273px;fill:#040000;font-family:ArialRoundedMTBold, Arial Rounded MT Bold">
                        c
                    </text>
                    <text transform="translate(70.92 118.59) scale(1.02 1)"
                          style="isolation:isolate;font-size:17.649999618530273px;fill:none;stroke:#040000;stroke-miterlimit:10;stroke-width:0.8600000143051147px;font-family:ArialRoundedMTBold, Arial Rounded MT Bold">
                        c
                    </text>
                    <text transform="translate(81.67 118.59) scale(1.02 1)"
                          style="isolation:isolate;font-size:17.649999618530273px;fill:#040000;font-family:ArialRoundedMTBold, Arial Rounded MT Bold">
                        o
                    </text>
                    <text transform="translate(81.67 118.59) scale(1.02 1)"
                          style="isolation:isolate;font-size:17.649999618530273px;fill:none;stroke:#040000;stroke-miterlimit:10;stroke-width:0.8600000143051147px;font-family:ArialRoundedMTBold, Arial Rounded MT Bold">
                        o
                    </text>
                    <text transform="translate(92.54 118.59) scale(1.02 1)"
                          style="isolation:isolate;font-size:17.649999618530273px;fill:#040000;font-family:ArialRoundedMTBold, Arial Rounded MT Bold">
                        t
                    </text>
                    <text transform="translate(92.54 118.59) scale(1.02 1)"
                          style="isolation:isolate;font-size:17.649999618530273px;fill:none;stroke:#040000;stroke-miterlimit:10;stroke-width:0.8600000143051147px;font-family:ArialRoundedMTBold, Arial Rounded MT Bold">
                        t
                    </text>
                    <text transform="translate(98.92 118.59) scale(1.02 1)"
                          style="isolation:isolate;font-size:17.649999618530273px;fill:#040000;font-family:ArialRoundedMTBold, Arial Rounded MT Bold">
                        t
                    </text>
                    <text transform="translate(98.92 118.59) scale(1.02 1)"
                          style="isolation:isolate;font-size:17.649999618530273px;fill:none;stroke:#040000;stroke-miterlimit:10;stroke-width:0.8600000143051147px;font-family:ArialRoundedMTBold, Arial Rounded MT Bold">
                        t
                    </text>
                    <text transform="translate(109.79 118.59) scale(1.02 1)"
                          style="isolation:isolate;font-size:17.649999618530273px;fill:#040000;font-family:ArialRoundedMTBold, Arial Rounded MT Bold">
                        S
                    </text>
                    <text transform="translate(109.79 118.59) scale(1.02 1)"
                          style="isolation:isolate;font-size:17.649999618530273px;fill:none;stroke:#040000;stroke-miterlimit:10;stroke-width:0.8600000143051147px;font-family:ArialRoundedMTBold, Arial Rounded MT Bold">
                        S
                    </text>
                    <text transform="translate(121.79 118.59) scale(1.02 1)"
                          style="isolation:isolate;font-size:17.649999618530273px;fill:#040000;font-family:ArialRoundedMTBold, Arial Rounded MT Bold">
                        m
                    </text>
                    <text transform="translate(121.79 118.59) scale(1.02 1)"
                          style="isolation:isolate;font-size:17.649999618530273px;fill:none;stroke:#040000;stroke-miterlimit:10;stroke-width:0.8600000143051147px;font-family:ArialRoundedMTBold, Arial Rounded MT Bold">
                        m
                    </text>
                    <text transform="translate(137.66 118.59) scale(1.02 1)"
                          style="isolation:isolate;font-size:17.649999618530273px;fill:#040000;font-family:ArialRoundedMTBold, Arial Rounded MT Bold">
                        i
                    </text>
                    <text transform="translate(137.66 118.59) scale(1.02 1)"
                          style="isolation:isolate;font-size:17.649999618530273px;fill:none;stroke:#040000;stroke-miterlimit:10;stroke-width:0.8600000143051147px;font-family:ArialRoundedMTBold, Arial Rounded MT Bold">
                        i
                    </text>
                    <text transform="translate(142.54 118.59) scale(1.02 1)"
                          style="isolation:isolate;font-size:17.649999618530273px;fill:#040000;font-family:ArialRoundedMTBold, Arial Rounded MT Bold">
                        t
                    </text>
                    <text transform="translate(142.54 118.59) scale(1.02 1)"
                          style="isolation:isolate;font-size:17.649999618530273px;fill:none;stroke:#040000;stroke-miterlimit:10;stroke-width:0.8600000143051147px;font-family:ArialRoundedMTBold, Arial Rounded MT Bold">
                        t
                    </text>
                    <text transform="translate(148.92 118.59) scale(1.02 1)"
                          style="isolation:isolate;font-size:17.649999618530273px;fill:#040000;font-family:ArialRoundedMTBold, Arial Rounded MT Bold">
                        h
                    </text>
                    <text transform="translate(148.92 118.59) scale(1.02 1)"
                          style="isolation:isolate;font-size:17.649999618530273px;fill:none;stroke:#040000;stroke-miterlimit:10;stroke-width:0.8600000143051147px;font-family:ArialRoundedMTBold, Arial Rounded MT Bold">
                        h
                    </text>
                    <text transform="translate(70.92 139.59) scale(1.02 1)"
                          style="isolation:isolate;font-size:17.649999618530273px;fill:#040000;font-family:ArialRoundedMTBold, Arial Rounded MT Bold">
                        i
                    </text>
                    <text transform="translate(70.92 139.59) scale(1.02 1)"
                          style="isolation:isolate;font-size:17.649999618530273px;fill:none;stroke:#040000;stroke-miterlimit:10;stroke-width:0.8600000143051147px;font-family:ArialRoundedMTBold, Arial Rounded MT Bold">
                        i
                    </text>
                    <text transform="translate(75.79 139.59) scale(1.02 1)"
                          style="isolation:isolate;font-size:17.649999618530273px;fill:#040000;font-family:ArialRoundedMTBold, Arial Rounded MT Bold">
                        s
                    </text>
                    <text transform="translate(75.79 139.59) scale(1.02 1)"
                          style="isolation:isolate;font-size:17.649999618530273px;fill:none;stroke:#040000;stroke-miterlimit:10;stroke-width:0.8600000143051147px;font-family:ArialRoundedMTBold, Arial Rounded MT Bold">
                        s
                    </text>
                    <text transform="translate(90.04 139.59) scale(1.02 1)"
                          style="isolation:isolate;font-size:17.649999618530273px;fill:#b41d23;font-family:ArialRoundedMTBold, Arial Rounded MT Bold">
                        H
                    </text>
                    <text transform="translate(90.04 139.59) scale(1.02 1)"
                          style="isolation:isolate;font-size:17.649999618530273px;fill:none;stroke:#b41d23;stroke-miterlimit:10;stroke-width:0.8600000143051147px;font-family:ArialRoundedMTBold, Arial Rounded MT Bold">
                        H
                    </text>
                    <text transform="translate(103.67 139.59) scale(1.02 1)"
                          style="isolation:isolate;font-size:17.649999618530273px;fill:#b41d23;font-family:ArialRoundedMTBold, Arial Rounded MT Bold">
                        E
                    </text>
                    <text transform="translate(103.67 139.59) scale(1.02 1)"
                          style="isolation:isolate;font-size:17.649999618530273px;fill:none;stroke:#b41d23;stroke-miterlimit:10;stroke-width:0.8600000143051147px;font-family:ArialRoundedMTBold, Arial Rounded MT Bold">
                        E
                    </text>
                    <text transform="translate(115.67 139.59) scale(1.02 1)"
                          style="isolation:isolate;font-size:17.649999618530273px;fill:#b41d23;font-family:ArialRoundedMTBold, Arial Rounded MT Bold">
                        R
                    </text>
                    <text transform="translate(115.67 139.59) scale(1.02 1)"
                          style="isolation:isolate;font-size:17.649999618530273px;fill:none;stroke:#b41d23;stroke-miterlimit:10;stroke-width:0.8600000143051147px;font-family:ArialRoundedMTBold, Arial Rounded MT Bold">
                        R
                    </text>
                    <text transform="translate(128.66 139.59) scale(1.02 1)"
                          style="isolation:isolate;font-size:17.649999618530273px;fill:#b41d23;font-family:ArialRoundedMTBold, Arial Rounded MT Bold">
                        E
                    </text>
                    <text transform="translate(128.66 139.59) scale(1.02 1)"
                          style="isolation:isolate;font-size:17.649999618530273px;fill:none;stroke:#b41d23;stroke-miterlimit:10;stroke-width:0.8600000143051147px;font-family:ArialRoundedMTBold, Arial Rounded MT Bold">
                        E
                    </text>
                </svg>
            </div>
            <div class="break"></div>
            <div class="bar-menu-position">
                <div class="bar-menu-element lower">
                    <div id="file" class="bar-menu-element-txt fonts" @click="store.commit('mainManuClick', 'file')">
                        文件
                    </div>
                    <Transition name="slide-fade">
                        <div id="file-expand" class="upper menu" style="margin-left: -10px;"
                             v-if="store.state.fileMenuStyleStatus">
                            <div class="menu-element" id="main-menu-new"
                                 @click="store.commit('addTabPage', {'pageType': 'file', 'pageTitle': '无标题文档', 'isExistFile': false}); store.commit('mainManuAllHide');">
                                <p class="fonts">新建</p>
                            </div>
                            <div class="menu-element" id="main-menu-open">
                                <p class="fonts">打开...</p>
                            </div>
                            <template v-if="store.state.tabList.get(store.state.currentOpenedPageId)
                                ? store.state.tabList.get(store.state.currentOpenedPageId).get('type') === 'file'
                                : false">
                                <div class="menu-element" id="main-menu-save">
                                    <p class="fonts">保存</p>
                                </div>
                                <div class="menu-element" id="main-menu-save-as">
                                    <p class="fonts">另存为...</p>
                                </div>
                            </template>
                            <template v-if="store.state.tabList.size !== 0">
                                <div class="menu-element" id="main-menu-close"
                                     @click="closeCurrentPage(store.state.tabList); store.commit('mainManuAllHide');">
                                    <p class="fonts">关闭</p>
                                </div>
                            </template>
                            <div class="menu-element" id="app-quit" @click="store.commit('quitApp'); store.commit('mainManuAllHide');">
                                <p class="fonts">退出AME</p>
                            </div>
                        </div>
                    </Transition>

                    <div class="main-menu-separator"></div>

                    <div id="edit" class="bar-menu-element-txt fonts" @click="store.commit('mainManuClick', 'edit')">
                        编辑
                    </div>
                    <Transition name="slide-fade">
                        <div id="edit-expand" class="upper menu" style="margin-left: calc(1 * (25px + 15px));"
                             v-if="store.state.editMenuStyleStatus">
                            <template v-if="store.state.tabList.get(store.state.currentOpenedPageId)
                                ? store.state.tabList.get(store.state.currentOpenedPageId).get('type') === 'file'
                                : false">
                                <div class="menu-element" id="main-menu-search">
                                    <p class="fonts">查找</p>
                                </div>
                            </template>
                            <div class="menu-element" id="settings"
                                 @click="store.commit('addTabPage', {'pageType': 'settings', 'pageTitle': '设置', 'isExistFile': false}); store.commit('mainManuAllHide');">
                                <p class="fonts">设置...</p>
                            </div>
                            <div class="menu-element" id="settings"
                                 @click="emit('tgModal', 'tip'); store.commit('mainManuAllHide');">
                                <p class="fonts">测试：toggle模态框...</p>
                            </div>
                        </div>
                    </Transition>

                    <template v-if="store.state.tabList.get(store.state.currentOpenedPageId)
                        ? store.state.tabList.get(store.state.currentOpenedPageId).get('type') === 'file'
                        : false">
                        <div class="main-menu-separator"></div>
                        <div id="view" class="bar-menu-element-txt fonts"
                             @click="store.commit('mainManuClick', 'view')">视图
                        </div>
                        <Transition name="slide-fade">
                            <div id="view-expand" class="upper menu" style="margin-left: calc(2 * (25px + 18px));"
                                 v-if="store.state.viewMenuStyleStatus">
                                <div class="menu-element" id="preview-mode"
                                     @click="store.commit('changeEditorMode', 'preview'); store.commit('mainManuAllHide');">
                                    <p class="fonts">预览模式</p>
                                </div>
                                <div class="menu-element" id="edit-mode"
                                     @click="store.commit('changeEditorMode', 'edit'); store.commit('mainManuAllHide');">
                                    <p class="fonts">编辑模式</p>
                                </div>
                                <div class="menu-element" id="mix-mode"
                                     @click="store.commit('changeEditorMode', 'mix'); store.commit('mainManuAllHide');">
                                    <p class="fonts">混合模式</p>
                                </div>
                            </div>
                        </Transition>
                    </template>

                    <template v-if="store.state.tabList.get(store.state.currentOpenedPageId)
                        ? store.state.tabList.get(store.state.currentOpenedPageId).get('type') === 'file'
                        : false">
                        <div class="main-menu-separator"></div>
                        <div id="tool" class="bar-menu-element-txt fonts"
                             @click="store.commit('mainManuClick', 'tool')">工具
                        </div>
                        <Transition name="slide-fade">
                            <div id="view-expand" class="upper menu"
                                 :style="`margin-left: calc((3 - ${(store.state.tabList.get(store.state.currentOpenedPageId)
                                    ? store.state.tabList.get(store.state.currentOpenedPageId).get('type') === 'file'
                                    : false) ? 0 : 1}) * (25px + 18px));`"
                                 v-if="store.state.toolMenuStyleStatus">
                                <template v-if="store.state.tabList.get(store.state.currentOpenedPageId)
                                    ? store.state.tabList.get(store.state.currentOpenedPageId).get('type') === 'file'
                                    : false">
                                    <div class="menu-element" id="mdz-media-man">
                                        <p class="fonts">mdz媒体管理工具...</p>
                                    </div>
                                </template>
                            </div>
                        </Transition>
                    </template>

                    <div class="main-menu-separator"></div>

                    <div id="help" class="bar-menu-element-txt fonts" @click="store.commit('mainManuClick', 'help')">
                        帮助
                    </div>
                    <Transition name="slide-fade">
                        <div id="help-expand" class="upper menu"
                             :style="`margin-left: calc((4 - ${(store.state.tabList.get(store.state.currentOpenedPageId)
                                ? store.state.tabList.get(store.state.currentOpenedPageId).get('type') === 'file'
                                : false) ? 0 : 2}) * (25px + 18px));`"
                             v-if="store.state.helpMenuStyleStatus">
                            <div class="menu-element"
                                 @click="store.commit('addTabPage', {'pageType': 'welcome', 'pageTitle': '欢迎', 'isExistFile': false})">
                                <p class="fonts">欢迎</p>
                            </div>
                            <div class="menu-element" id="about"
                                 @click="store.commit('addTabPage', {'pageType': 'document', 'pageTitle': '关于AME', 'isExistFile': false, 'docName': 'about'})">
                                <p class="fonts">关于AME...</p>
                            </div>
                            <div class="menu-element" id="about"
                                 @click="store.commit('addTabPage', {'pageType': 'document', 'pageTitle': 'AME使用指南', 'isExistFile': false, 'docName': 'usage'})">
                                <p class="fonts">使用指南...</p>
                            </div>
                            <div class="menu-element" id="donate" @click="emit('tgModal', 'donate'); store.commit('mainManuAllHide');">
                                <p class="fonts" style="color: red;">打赏...</p>
                            </div>
                            <div class="menu-element" id="learn-more" @click="openOfficialWebsite">
                                <p class="fonts">官方网站...</p>
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
