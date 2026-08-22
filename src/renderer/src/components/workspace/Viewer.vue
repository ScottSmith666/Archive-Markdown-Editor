<script setup>
import engine from "./engine.js";
import {regExps, returnMediaElement} from "./get_media_skeleton.js";

import morphdom from 'morphdom';
import DOMPurify from "dompurify";

import mermaid from 'mermaid';
// 引入Prism
import Prism from 'prismjs';
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

import {nextTick, onMounted, ref, watch} from "vue";
import {useStore} from 'vuex';

import {onBeforeRouteUpdate} from "vue-router";

const store = useStore();

// props
const props = defineProps({
    mdPiece: {
        type: String,
        default: () => {
            return "";
        }
    },
    startLineNumber: {
        type: Number,
        default: () => {
            return 1;
        }
    },
    middleLineNumber: {
        type: Number,
        default: () => {
            return 25;
        }
    },
    enableToc: {
        type: Boolean,
        default: () => {
            return true;
        }
    },
    enableDocumentMediaPath: {
        type: Object,
        default: () => {
            return {
                isEnabled: false,
                path: '',
            };
        }
    }
});

// Markdown-It engine
let mdIt = engine(props.enableDocumentMediaPath);

// 保留image旧渲染规则
const defaultMediaRender = mdIt.renderer.rules.image || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
};

// 添加mdz media path渲染新规则
mdIt.renderer.rules.image = function (tokens, idx, options, env, self) {
    const originalImageHTML = defaultMediaRender(tokens, idx, options, env, self);
    const regs = regExps();
    let currentPageInfo = store.state.tab.tabList.get(store.state.tab.currentOpenedPageId);
    if (originalImageHTML.includes("?MUST_RENDER_MDZ?")) {  // 开始渲染mdz
        let res = JSON.parse(originalImageHTML);
        let url = res.url;
        let caption = res.caption;
        let matchedMediaMark = regs.mediaContentMark.exec(caption);
        if (!currentPageInfo.get("isExistFile")) {  // 如果当前打开的是非已有文件的页面，则禁止渲染本规则
            return `<p style="color: red; font-weight: bold;">🚫错误：当前打开的页面不是mdz格式的文件，请不要使用mdz媒体路径语法</p>`;
        } else {
            // 当前打开的是已有文件的页面
            let currentFilePathParam = currentPageInfo.get("path").split('&').pop();  // 当前打开文件的路径参数
            let currentFilePath = currentFilePathParam.replace("filepath=", "");  // 去掉参数名和等于号，并解码为正常的路径字符串
            let currentFileName = currentFilePath.split(/\\|\//).pop();
            let currentFileNameArray = currentFileName.split(".");
            currentFileNameArray.pop();
            let currentFileNameRemoveExt = currentFileNameArray.join(".");
            let ext = currentFilePath.split(".").pop();
            if (ext !== "mdz") {
                return `<p style="color: red; font-weight: bold;">🚫错误：当前打开的页面不是mdz格式的文件，请不要使用mdz媒体路径语法</p>`;
            }
            // 开始拼接路径
            let currentFilePathArray = currentFilePath.split(/\\|\//);  // 同时匹配posix和win32路径分隔符
            currentFilePathArray.pop();
            let currentFilePathRemoveFileName = currentFilePathArray.join("/");  // 路径去掉文件名
            let factMediaPath
                = currentFilePathRemoveFileName + `/._mdz_content.${currentFileNameRemoveExt}/mdz_contents/media_src/${url.replace("$MDZ_MEDIA/", "")}`;
            if (matchedMediaMark !== null) {
                let kind = matchedMediaMark[2];
                let getCaption = matchedMediaMark[4];
                return returnMediaElement(false, kind, factMediaPath, getCaption);
            } else {
                return returnMediaElement(false, 'image', factMediaPath, caption);
            }
        }
    } else {
        // 如果不符合mdz media规则，就返回原来的旧规则
        return originalImageHTML;
    }
};

// 加载主题
const loadViewerTheme = async () => {
    const themeContent = await window.themesManPreload.getViewerTheme(store.state.settings.userSettings.ame_viewer_theme);
    let styleTag;
    if (document.getElementById("viewer-theme-style")) {
        styleTag = document.getElementById("viewer-theme-style");
        styleTag.textContent = "";
        styleTag.textContent = themeContent;
    } else {
        styleTag = document.createElement('style');
        styleTag.id = "viewer-theme-style";
        styleTag.textContent = "";
        styleTag.textContent = themeContent;
        document.head.appendChild(styleTag);
    }
};

// data
const viewerContextMenuShow = ref(false);
const contextMenuPositionStyle = ref('');
const viewerTocShow = ref(false);

onMounted(() => {
    loadViewerTheme();
    render(props.mdPiece);
    window.addEventListener('keydown', copyInViewerByHotkey);
});

onBeforeRouteUpdate((to, from) => {
    loadViewerTheme();
});

// methods
const render = async (content) => {
    if (content === '') {
        content = '<div style="color: rgba(var(--main-color-R), var(--main-color-G), var(--main-color-B), 0.35);'
            + ` user-select: none; font-weight: bold; font-size: 2rem; padding-top: 20px;">${store.state.i18n.langPackage[store.state.settings.lang].renderPlaceholder}</div>`;
    }

    // apply render HTML content piece
    // 用markdown-it渲染成HTML字符串
    let rawHTMLStr = mdIt.render(content);
    // 然后用DOMPurify消毒
    let purifiedHTMLStr = DOMPurify.sanitize(rawHTMLStr, {
        ADD_TAGS: ['img', 'audio', 'video', 'source'],
        ADD_ATTR: ['src', 'autoplay', 'loop'],
        ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel|ftp|file|blob|data):|[^&?#]*[./])/i,
        ALLOW_UNKNOWN_PROTOCOLS: true
    });
    // 然后形成真实DOM
    let newDOM = document.createElement("div");
    newDOM.setAttribute("id", "viewer-content");
    newDOM.innerHTML = purifiedHTMLStr;
    // 更新
    morphdom(document.getElementById("viewer-content"), newDOM);

    // render Prism Highlight
    nextTick().then(() => {
        Prism.highlightAll();
    });

    // render MathJax
    mathJaxRender();
    // render mermaid
    mermaidRender();
};

const mathJaxRender = () => {
    if (window.MathJax && window.MathJax.typesetPromise) {
        let target = document.getElementById('viewer-content');
        if (target) {
            // 先清除该区域之前的渲染状态（防止重复渲染或内存泄漏）
            nextTick().then(() => {
                MathJax.startup.promise.then(() => {
                    window.MathJax.typesetClear([target]);
                    // 只渲染特定ID的容器，避免全局扫描，性能更好
                    window.MathJax.typesetPromise([target]).then(() => {
                    }).catch((err) => {
                        console.error(err);
                    });
                }).then(() => {
                }).catch(err => {
                    console.error('渲染失败', err);
                });
            });
        }
    }
};

const mermaidRender = () => {
    nextTick().then(async () => {
        mermaid.initialize({startOnLoad: false});
        await mermaid.run({querySelector: '.mermaid'});
    });
};

const scrollCustomLineElementToCenter = (middleLine, rangeFirstLine) => {
    nextTick().then(() => {
        const container = document.getElementById('viewer-content');  // 外面的容器，包裹着里面的滚动着的高div
        const errRange = [-1, 0, 1];
        // 在右侧容器中查找具有相同 data-source-line (误差范围正负1) 的元素
        for (let i = 0; i < errRange.length; i++) {
            let targetElements = container.querySelectorAll(
                `[data-source-line="${middleLine - rangeFirstLine + 1 /* data-source-line的编号是从0开始的，因此需要减1 -> */ - 1 + errRange[i]}"]`);
            if (targetElements.length !== 0) {
                // 看下是不是blockquote，是就滚动祖父元素
                if (targetElements[0].parentElement?.parentElement.tagName === 'BLOCKQUOTE' ||
                    targetElements[0].parentElement?.parentElement.classList.contains('markdown-alert')) {
                    targetElements[0].parentElement?.parentElement.scrollIntoView({
                        behavior: 'auto',
                        block: 'center',
                        container: 'nearest',
                        inline: 'center',
                    });
                } else {
                    targetElements[0].scrollIntoView({
                        behavior: 'auto',
                        block: 'center',
                        container: 'nearest',
                        inline: 'center',
                    });
                }
                break;
            }
        }
    });
};

const displayViewerContextMenu = (event) => {
    const menuHeight = 60;
    const menuWidth = 200;

    let left;
    if (store.state.settings.editorMode === 'preview') {
        // 这是预览模式下的右键菜单位置判定
        left = `left: ${
            (event.clientX + menuWidth) <= (document.body.clientWidth - 20)
                ? (event.clientX)
                : (document.body.clientWidth - 40 - menuWidth)
        }px; `;
    } else if (store.state.settings.editorMode === 'mix') {
        // 这是混合模式下的右键菜单位置判定
        left = `left: ${
            (event.clientX + menuWidth) <= (document.body.clientWidth - 20)
                ? (event.clientX)
                : (document.body.clientWidth - 40 - menuWidth)
        }px; `;
    }

    let top = `top: ${
        (event.clientY + menuHeight + 30) <= document.body.clientHeight
            ? (event.clientY - 20 - 30 + menuHeight)
            : (document.body.clientHeight - menuHeight - 60 - 30)
    }px;`;

    contextMenuPositionStyle.value = left + top;
    viewerContextMenuShow.value = true;
};

const copyInViewer = () => {
    let selection = window.getSelection();
    let selectionText = selection.toString();
    navigator.clipboard.writeText(selectionText).then(() => {
        viewerContextMenuShow.value = false;
    }).catch((error) => {
        console.error("复制失败: ", error);
        viewerContextMenuShow.value = false
    });
};

const copyInViewerByHotkey = (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault(); // 阻止浏览器默认保存行为
        copyInViewer();
    }
};

const goToTop = () => {
    // 滚到顶了
    try {
        if (document.getElementById('viewer-content').children.length !== 0) {
            setTimeout(() => {
                document.getElementById('viewer-content').firstElementChild.scrollIntoView({
                    behavior: 'auto',
                    block: 'center',
                    inline: 'center',
                });
            }, 100);
        }
    } catch (e) {
    }
};

const goToBottom = () => {
    // 滚到底了
    try {
        if (document.getElementById('viewer-content').children.length !== 0) {
            setTimeout(() => {
                document.getElementById('viewer-content').lastElementChild.scrollIntoView({
                    behavior: 'auto',
                    block: 'center',
                    inline: 'center',
                });
            }, 100);
        }
    } catch (e) {
    }
};

const customClickEvents = (event) => {
    const clickObject = event.target.closest('.ame-custom-click');
    if (clickObject.dataset.typeFlag === "link") {
        window.openURLPreload.openURL(clickObject.dataset.href);
    } else if (clickObject.dataset.typeFlag === "file") {
        localStorage.setItem(`${store.state.tab.currentOpenedPageId}-click-media-path`, clickObject.dataset.fileUrl);
    }
};

defineExpose({
    goToTop,
    goToBottom,
});

// watch
watch(
    () => [props.mdPiece, props.middleLineNumber],
    async ([newMdPiece, newMiddleLineNumber], [oldMdPiece, oldMiddleLineNumber]) => {
        await nextTick();
        render(newMdPiece);
        if (newMiddleLineNumber !== oldMiddleLineNumber) {
            scrollCustomLineElementToCenter(
                newMiddleLineNumber,
                props.startLineNumber
            );
        }
    }
);

watch(() => store.state.tab.tabList.get(store.state.tab.currentOpenedPageId).get("isExistFile"), (newVal, oldVal) => {
    // 当新值和旧值不一样且新值为true时，肯定是另存为的时候，刷新渲染器，防止意外报错
    if (newVal === true && newVal !== oldVal) {
        render(props.mdPiece);
    }
});

</script>

<template>
    <Transition>
        <nav v-if="props.enableToc && viewerTocShow"
             class="custom-toc">
            <div class="toc fonts">
                <div class="toc-title-block"></div>
                <div class="toc-title">目录</div>
            </div>
            <div>
                <ul>
                    <li><a href="#lorem-ipsum">Lorem ipsum</a>
                        <ul>
                            <li><a href="#">样例文本</a>
                                <ul>
                                    <li><a href="#3">标题3</a>
                                        <ul>
                                            <li><a href="#4">标题4</a>
                                                <ul>
                                                    <li><a href="#5">标题5</a>
                                                        <ul>
                                                            <li><a href="#6">标题6</a></li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <li><a href="#lorem-ipsum-1">Lorem ipsum</a>
                        <ul>
                            <li><a href="#-1">样例文本</a>
                                <ul>
                                    <li><a href="#3-1">标题3</a>
                                        <ul>
                                            <li><a href="#4-1">标题4</a>
                                                <ul>
                                                    <li><a href="#5-1">标题5</a>
                                                        <ul>
                                                            <li><a href="#6-1">标题6</a></li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <li><a href="#lorem-ipsum-2">Lorem ipsum</a>
                        <ul>
                            <li><a href="#-2">样例文本</a>
                                <ul>
                                    <li><a href="#3-2">标题3</a>
                                        <ul>
                                            <li><a href="#4-2">标题4</a>
                                                <ul>
                                                    <li><a href="#5-2">标题5</a>
                                                        <ul>
                                                            <li><a href="#6-2">标题6</a></li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    </Transition>

    <Transition>
        <div v-if="viewerContextMenuShow" class="viewer-contextmenu fonts"
             :style="contextMenuPositionStyle">
            <div class="vc-menu-element" @click="copyInViewer">
                <p>&nbsp;&nbsp;&nbsp;{{
                        store.state.i18n.langPackage[store.state.settings.lang].contextMenu.inViewer.copy
                    }}</p>
            </div>
            <div v-if="props.enableToc" class="vc-menu-element"
                 @click="viewerTocShow = !viewerTocShow; viewerContextMenuShow = false;">
                <p>&nbsp;&nbsp;&nbsp;{{ viewerTocShow ? '关闭' : '打开' }}此文档目录</p>
            </div>
        </div>
    </Transition>

    <div class="viewer-area fonts"
         :class="store.state.settings.editorMode === 'preview' && (!props.enableDocumentMediaPath.isEnabled) ? 'viewer-upper' : ''"
         id="viewer-container"
         tabindex="-1"
         v-bind="$attrs"
         @contextmenu.prevent="displayViewerContextMenu"
         @click="viewerContextMenuShow = false"
         @blur="viewerContextMenuShow = false">
        <div @click="customClickEvents">
            <div id="viewer-content">
                <!--Generated HTML was injected here...-->
            </div>
        </div>
    </div>
</template>

<style scoped>
@import "./styles/viewer.css";
</style>
<style>
* {
    word-break: break-all !important;
}
</style>
