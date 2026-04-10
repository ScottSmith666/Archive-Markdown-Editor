<script setup>
import {useStore} from 'vuex';
import {onMounted, ref} from "vue";
import {onBeforeRouteUpdate} from "vue-router";

const store = useStore();

// data
const recentFileHistoryList = ref([]);

onBeforeRouteUpdate((to, from) => {
    loadHistory();
});

onMounted(() => {
    loadHistory();
});

// methods
const loadHistory = () => {
    // 加载历史记录
    window.sqliteDataManPreload.getRecentOpenedHistory().then(history => {
        // 返回的记录结构：[{'hsId', '...', 'fileName': '...', 'filePath': '...', 'openTime': '...'}, ...]
        recentFileHistoryList.value = history;
    }).catch(error => {
        store.commit('autoTips', {'kind': 'tip', tipLevel: "fail", content: "历史记录加载失败！"});
        store.commit('toggleModal', {'kind': 'none'});
    });
};

const deleteHistory = (hsId) => {
    // 先删库
    window.sqliteDataManPreload.deleteRecentOpenedHistory(hsId).then(() => {
        // 后删前端Array
        if (hsId === 'ALL') {
            recentFileHistoryList.value.splice(0, recentFileHistoryList.value.length);
            return 0;
        }
        for (let i = 0; i < recentFileHistoryList.value.length; i++) {
            if (hsId === recentFileHistoryList.value[i].hsId) {
                // 执行删除操作，list和数据库都是
                recentFileHistoryList.value.splice(i, 1);
                break;
            }
        }
    }).catch(error => {
        store.commit('autoTips', {'kind': 'tip', tipLevel: "fail", content: "历史记录删除失败！"});
        store.commit('toggleModal', {'kind': 'none'});
    });
};

const openHistoryFile = (filePath, fileName) => {
    store.dispatch('openFileFromHistoryAction', {
        'filePath': filePath,
        'fileName': fileName
    });
};

</script>
<template>
    <div class="welcome-main fonts">
        <!--Archive Markdown Editor Title-->
        <div class="title-container">
            <!--title-->
            <div class="title">Archive Markdown Editor</div>
            <!--subtitle-->
            <div class="subtitle">简约、美观、功能强大</div>
        </div>
        <div class="welcome-body">
            <div class="side">
                <div class="separator"></div>
                <!--Recent file title-->
                <div class="recent-file-title">
                    <div class="recent-file-title-body">
                        <div class="block"></div>
                        <div style="width: 6px;"></div>
                        <div style="font-weight: bold; font-size: 1.3rem;" id="history">开始</div>
                    </div>
                </div>
                <!--Separator-->
                <div class="separator"></div>
                <!--New File-->
                <div
                    @click="store.commit('addTabPage', {'pageType': 'file', 'pageTitle': '无标题文档', 'isExistFile': false})"
                    class="options" id="new"><span class="options-icon">㊢</span>新建文件...
                </div>
                <!--Open-->
                <div class="options" id="open" @click="store.dispatch('activateOpenFileDialogAction')"><span
                    class="options-icon">㊠</span>打开文件...
                </div>
                <!--Open-->
                <div
                    @click="store.commit('addTabPage', {'pageType': 'settings', 'pageTitle': '设置', 'isExistFile': false})"
                    class="settings" id="settings"><span class="options-icon">㊕</span>设置...
                </div>
                <!--Quit-->
                <div class="options-quit" id="quit" @click="store.commit('quitApp')"><span class="options-icon">㊡</span>退出AME
                </div>

                <!--Powered-->
                <div class="powered">
                    <div class="powered-title">Powered by</div>
                    <div class="powered-item">
                        <div>
                            <svg t="1774766310497" class="powered-icon icon" viewBox="0 0 1024 1024" version="1.1"
                                 xmlns="http://www.w3.org/2000/svg" p-id="5356" width="200" height="200">
                                <path
                                    d="M0 804.608h1024V349.056H457.258667V219.392H0zM86.229333 310.229333h284.032v85.077334c-74.24 89.173333-121.173333 192.085333-125.781333 315.904H148.352c3.84-106.709333 15.061333-211.370667 97.408-298.410667l1.408-1.408H86.229333z m360.533334 53.461334h563.84v432.768H446.72z m256.426666 51.754666v293.162667h63.232v-293.12z m117.546667 1.834667v294.912h68.949333v-103.253333h43.904c18.346667-0.042667 32.170667-12.373333 41.344-30.549334 18.218667-36.181333 18.304-96.298667-1.024-131.925333-9.685333-17.877333-24.362667-29.738667-44.074666-29.184z m-338.090667 0.085333v68.096h94.592l-98.304 159.402667v65.706667h182.912V644.266667h-115.114666l118.869333-166.784v-60.16z m403.285334 64.512h25.386666c6.997333-0.256 12.245333 3.456 15.829334 9.258667 7.253333 11.648 7.338667 31.402667 0.170666 42.24a15.530667 15.530667 0 0 1-15.914666 7.509333l-23.466667 2.005334z"
                                    p-id="5357" fill="#2c2c2c"></path>
                            </svg>
                        </div>
                        <div style="width: 5px;"></div>
                        <div class="powered-text">7-Zip</div>
                    </div>
                    <div class="powered-item">
                        <div>
                            <svg class="powered-icon" id="svg470" xmlns="http://www.w3.org/2000/svg"
                                 xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svg="http://www.w3.org/2000/svg"
                                 version="1.1" viewBox="0 0 121 132.4">
                                <defs>
                                    <clipPath id="clippath">
                                        <path style="fill: none;"
                                              d="M60.4,72.1c.7,1.2,3.5,6.1,4.1,7.7.6,1.8.8,2.3.8,2.3,0,0-1.6-8-4.1-12.7.6-1.9,1.2-4,2-6.2.9,1.6,2.9,5.1,3.6,6.8,0-.3,0-.6,0-1-.6-2.5-1.6-5.7-2.9-8.3,3.2-16.7,13.6-38.6,24.7-50.4H12c-3.8,0-6.9,3.1-6.9,6.9v81.4c17.4-6.7,38.3-12.8,56.4-12.5-.7-2.6-1.4-4.9-2.2-6.3-.4-.7,0-3.6,1.2-7.8Z"/>
                                    </clipPath>
                                    <linearGradient id="_未命名的渐变" data-name="未命名的渐变" x1="-146.1" y1="488.5"
                                                    x2="-145.1" y2="488.5"
                                                    gradientTransform="translate(-44843.8 13439) rotate(90) scale(91.9 -91.9)"
                                                    gradientUnits="userSpaceOnUse">
                                        <stop offset="0" stop-color="#97d9f6"/>
                                        <stop offset=".7" stop-color="#0f80cc"/>
                                        <stop offset=".9" stop-color="#0f80cc"/>
                                        <stop offset="1" stop-color="#0f80cc"/>
                                    </linearGradient>
                                </defs>
                                <g id="g337">
                                    <g id="g465">
                                        <path id="path21" style="fill: #0f80cc;"
                                              d="M64.1,100.3c0-.7,0-1.2,0-1.2,0,0-2.2-14.8-4.8-19.2-.4-.7,0-3.6,1.2-7.8.7,1.2,3.5,6.1,4.1,7.7.6,1.8.8,2.3.8,2.3,0,0-1.6-8-4.1-12.7.6-1.9,1.2-4,2-6.2,1,1.7,3.3,5.8,3.8,7.2.1.3.2.5.3.8,0-.1,0-.3,0-.4-.6-2.5-1.7-6.8-3.3-10,3.5-18.2,15.4-42.4,27.6-53.3H12c-5.3,0-9.7,4.4-9.7,9.7v87.8c0,5.3,4.4,9.7,9.7,9.7h52.4c-.4-4.6-.5-9.6-.3-14.5"/>
                                        <g style="clip-path: url(#clippath);">
                                            <g id="g37">
                                                <path id="path53" style="fill: url(#_未命名的渐变);"
                                                      d="M60.4,72.1c.7,1.2,3.5,6.1,4.1,7.7.6,1.8.8,2.3.8,2.3,0,0-1.6-8-4.1-12.7.6-1.9,1.2-4,2-6.2.9,1.6,2.9,5.1,3.6,6.8,0-.3,0-.6,0-1-.6-2.5-1.6-5.7-2.9-8.3,3.2-16.7,13.6-38.6,24.7-50.4H12c-3.8,0-6.9,3.1-6.9,6.9v81.4c17.4-6.7,38.3-12.8,56.4-12.5-.7-2.6-1.4-4.9-2.2-6.3-.4-.7,0-3.6,1.2-7.8"/>
                                            </g>
                                        </g>
                                        <path id="path55" style="fill: #003b57;"
                                              d="M110.2,4.7c-5.5-4.9-12.1-2.9-18.6,2.9-1,.9-1.9,1.8-2.9,2.8-11.1,11.8-21.5,33.7-24.7,50.4,1.3,2.5,2.2,5.8,2.9,8.3.2.6.3,1.2.4,1.7.3,1.2.4,2,.4,2,0,0-.1-.4-.5-1.6,0-.2-.2-.5-.3-.8,0-.1-.1-.3-.2-.4-.7-1.7-2.7-5.3-3.6-6.8-.8,2.2-1.4,4.3-2,6.2,2.6,4.7,4.1,12.7,4.1,12.7,0,0-.1-.5-.8-2.3-.6-1.6-3.4-6.6-4.1-7.7-1.2,4.2-1.6,7.1-1.2,7.8.8,1.4,1.6,3.7,2.2,6.3,1.5,5.8,2.6,12.9,2.6,12.9,0,0,0,.5,0,1.2-.2,4.9,0,9.9.3,14.5.5,6.1,1.4,11.3,2.6,14l.8-.4c-1.8-5.5-2.5-12.7-2.2-21,.5-12.7,3.4-28,8.8-43.9,9.1-24.1,21.7-43.3,33.3-52.6-10.5,9.5-24.8,40.3-29.1,51.7-4.8,12.8-8.2,24.8-10.2,36.3,3.5-10.8,14.9-15.4,14.9-15.4,0,0,5.6-6.9,12.1-16.7-3.9.9-10.3,2.4-12.5,3.3-3.2,1.3-4,1.8-4,1.8,0,0,10.3-6.3,19.1-9.1,12.1-19.1,25.3-46.2,12-58.1"/>
                                    </g>
                                </g>
                            </svg>
                        </div>
                        <div style="width: 5px;"></div>
                        <div class="powered-text">Sqlite</div>
                    </div>
                    <div class="powered-item">
                        <div>
                            <svg class="logo powered-icon" viewBox="0 0 128 128" width="24" height="24"
                                 data-v-434d909d="">
                                <path fill="#42b883"
                                      d="M78.8,10L64,35.4L49.2,10H0l64,110l64-110C128,10,78.8,10,78.8,10z"
                                      data-v-434d909d=""></path>
                                <path fill="#35495e" d="M78.8,10L64,35.4L49.2,10H25.6L64,76l38.4-66H78.8z"
                                      data-v-434d909d=""></path>
                            </svg>
                        </div>
                        <div style="width: 5px;"></div>
                        <div class="powered-text">Vue.js</div>
                    </div>
                    <div class="powered-item">
                        <div>
                            <svg class="powered-icon" t="1773985042416" viewBox="0 0 1024 1024" version="1.1"
                                 xmlns="http://www.w3.org/2000/svg" p-id="6000" width="200" height="200">
                                <path
                                    d="M112.981333 498.261333c-44.288-77.226667-53.290667-149.504-21.802666-203.989333 42.154667-73.045333 147.968-98.56 281.770666-74.197333a13.738667 13.738667 0 1 1-4.906666 27.008c-123.733333-22.528-218.069333 0.213333-253.098667 60.928-25.813333 44.672-18.048 107.050667 21.845333 176.64a13.738667 13.738667 0 1 1-23.808 13.653333z m636.586667-258.944c78.293333 1.024 134.656 25.429333 160.042667 69.376 34.986667 60.544 7.68 153.386667-73.301334 249.045334a13.738667 13.738667 0 1 0 20.906667 17.749333c87.637333-103.509333 118.229333-207.616 76.16-280.533333-30.976-53.632-96.426667-81.92-183.424-83.072a13.738667 13.738667 0 1 0-0.341333 27.434666z m-79.104 650.197334a13.738667 13.738667 0 0 0-18.858667 4.693333c-39.850667 66.261333-88.746667 102.357333-139.093333 102.357333-70.058667 0-136.874667-70.272-179.2-188.501333a13.738667 13.738667 0 1 0-25.856 9.258667C353.237333 945.237333 428.202667 1024 512.426667 1024c61.44 0 118.314667-41.898667 162.688-115.626667a13.738667 13.738667 0 0 0-4.693334-18.858666z m313.856-110.677334a65.706667 65.706667 0 0 1-103.936 53.333334c-104.746667 61.653333-304.896 30.293333-493.226667-78.506667-80.213333-46.293333-150.485333-102.058667-204.586666-161.493333a13.738667 13.738667 0 1 1 20.309333-18.474667c52.138667 57.301333 120.192 111.317333 197.973333 156.202667 177.792 102.656 364.928 133.12 460.672 81.322666a65.706667 65.706667 0 1 1 122.794667-32.384z m-813.312 0a65.706667 65.706667 0 1 1-97.493333-57.386666c-9.941333-122.752 119.04-287.317333 314.026666-399.872 80.981333-46.762667 165.290667-79.957333 244.522667-96.896a13.738667 13.738667 0 0 1 5.76 26.794666c-76.373333 16.384-157.994667 48.512-236.586667 93.866667-183.637333 106.026667-304.981333 258.858667-300.714666 368.085333 1.621333-0.128 3.2-0.256 4.821333-0.256 36.266667 0 65.706667 29.44 65.706667 65.706667zM446.805333 65.706667a65.706667 65.706667 0 0 1 131.328 0c0 0.981333-0.085333 1.92-0.128 2.858666 108.757333 56.192 184.32 247.893333 184.32 469.461334 0 91.093333-12.714667 178.517333-36.437333 254.293333a13.738667 13.738667 0 1 1-26.197333-8.192c22.869333-73.045333 35.2-157.738667 35.2-246.101333 0-208.64-69.376-388.053333-164.138667-442.154667a65.621333 65.621333 0 0 1-123.946667-30.165333z m55.637334 425.856a47.530667 47.530667 0 1 0 20.053333 92.928 47.530667 47.530667 0 0 0-20.053333-92.928z"
                                    p-id="6001"></path>
                            </svg>
                        </div>
                        <div style="width: 5px;"></div>
                        <div class="powered-text">Electron</div>
                    </div>
                    <div class="powered-item">
                        <div>
                            <svg class="powered-icon" t="1773985318810" viewBox="0 0 1024 1024" version="1.1"
                                 xmlns="http://www.w3.org/2000/svg" p-id="7818" width="200" height="200">
                                <path
                                    d="M92 192C42.24 192 0 232.128 0 282.016v459.968C0 791.904 42.24 832 92 832h840C981.76 832 1024 791.872 1024 741.984V282.016C1024 232.16 981.76 192 932 192z m0 64h840c16.512 0 28 12.256 28 26.016v459.968c0 13.76-11.52 26.016-28 26.016H92C75.488 768 64 755.744 64 741.984V282.016c0-13.76 11.52-25.984 28-25.984zM160 352v320h96v-212.992l96 127.008 96-127.04V672h96V352h-96l-96 128-96-128z m544 0v160h-96l144 160 144-160h-96v-160z"
                                    p-id="7819"></path>
                            </svg>
                        </div>
                        <div style="width: 5px;"></div>
                        <div class="powered-text">Markdown-It</div>
                    </div>
                    <div class="powered-item">
                        <div>
                            <svg class="powered-icon" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 1024 1024">
                                <path class="st0" d="M1024 1024H0V0h1024v1024z"/>
                                <path class="st1" d="M1024 85.333v853.333H0V85.333h1024z"/>
                                <path class="st2"
                                      d="M0 85.333h298.667v853.333H0V85.333zm1024 0v853.333H384V85.333h640zm-554.667 160h341.333v-64H469.333v64zm341.334 533.334H469.333v64h341.333l.001-64zm128-149.334H597.333v64h341.333l.001-64zm0-149.333H597.333v64h341.333l.001-64zm0-149.333H597.333v64h341.333l.001-64z"/>
                            </svg>
                        </div>
                        <div style="width: 5px;"></div>
                        <div class="powered-text">Monaco Editor</div>
                    </div>
                </div>
            </div>
            <!--Main area is showing recent files, 8 files max-->
            <div class="recent-file-list">
                <div class="separator"></div>
                <!--Recent file title-->
                <div class="recent-file-title">
                    <div class="recent-file-title-body">
                        <div class="block"></div>
                        <div style="width: 6px;"></div>
                        <div style="font-weight: bold; font-size: 1.3rem;" id="history">历史记录</div>
                    </div>
                    <div id="clear" class="clear-all-history" v-if="recentFileHistoryList.length > 0" @click="deleteHistory('ALL')">清空
                    </div>
                </div>
                <!--Separator-->
                <div class="separator"></div>
                <!--Recent file unit-->
                <template v-if="recentFileHistoryList.length === 0">
                    <div style="color: #6a737d;" id="empty">曾打开的文件将显示于此处。</div>
                </template>
                <template v-else>
                    <div class="recent-file-unit" v-for="(item, index) in recentFileHistoryList" :key="item.hsId">
                        <div class="file-info-block">
                            <!--File icon-->
                            <div>
                                <svg style="width: 40px; height: 40px;" t="1748343387536" class="icon"
                                     viewBox="0 0 1024 1024"
                                     version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11531" width="200"
                                     height="200">
                                    <path
                                        d="M554.666667 384 554.666667 149.333333 789.333333 384M256 85.333333C208.64 85.333333 170.666667 123.306667 170.666667 170.666667L170.666667 853.333333C170.666667 900.266667 209.066667 938.666667 256 938.666667L768 938.666667C814.933333 938.666667 853.333333 900.266667 853.333333 853.333333L853.333333 341.333333 597.333333 85.333333 256 85.333333Z"
                                        p-id="11532" data-spm-anchor-id="a313x.search_index.0.i0.3f013a81s5EGQ2"
                                        class="selected"
                                        fill="#42b883"></path>
                                </svg>
                            </div>
                            <div style="width: 10px;"></div>
                            <!--Info-->
                            <div>
                                <div>
                                    <!--File name-->
                                    <div class="access-file" @click="openHistoryFile(item.filePath, item.fileName);">
                                        {{ item.fileName }}
                                    </div>
                                    <!--File path-->
                                    <div class="access-file-path">
                                        {{ item.filePath }}
                                    </div>
                                </div>
                                <!--Date and time-->
                                <div class="last-open-date-time">{{ item.openTime }}</div>
                            </div>
                        </div>
                        <!--Delete icon-->
                        <div style="cursor: pointer;" @click="deleteHistory(item.hsId)">
                            <svg style="width: 30px; height: 30px;" t="1748343561453" class="icon"
                                 viewBox="0 0 1024 1024"
                                 version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14232" width="200"
                                 height="200">
                                <path
                                    d="M256 810.666667c0 46.933333 38.4 85.333333 85.333333 85.333333l341.333333 0c46.933333 0 85.333333-38.4 85.333333-85.333333L768 298.666667 256 298.666667 256 810.666667zM810.666667 170.666667l-149.333333 0-42.666667-42.666667-213.333333 0-42.666667 42.666667L213.333333 170.666667l0 85.333333 597.333333 0L810.666667 170.666667z"
                                    p-id="14233" data-spm-anchor-id="a313x.search_index.0.i5.3f013a81s5EGQ2"
                                    class="selected"
                                    fill="#c21f0a"></path>
                            </svg>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import "./welcome-page.css";
</style>
