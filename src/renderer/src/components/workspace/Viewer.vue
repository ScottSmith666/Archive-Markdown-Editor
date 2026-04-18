<script setup>
import engine from "./engine.js";
import {regExps, returnMediaElement} from "./get_media_skeleton.js";

import * as IncrementalDOM from 'incremental-dom';
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

import {nextTick, onMounted, watch, ref} from "vue";
import {useStore} from 'vuex';

import SafeModeInfo from "./SafeModeInfo.vue";

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
    enableSafe: {
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

// data
const confirmContentSafe = ref(false);
const viewerContextMenuShow = ref(false);
const contextMenuPositionStyle = ref('');
const viewerTocShow = ref(false);

onMounted(() => {
    if ((!(Number(store.state.settings.userSettings.safe_mode) === 1)) || (!props.enableSafe)) {
        render(props.mdPiece);
    }
    window.addEventListener('keydown', copyInViewerByHotkey);
});

// methods
const render = async (content) => {
    if (content === '') {
        content = '<div style="color: rgba(var(--main-color-R), var(--main-color-G), var(--main-color-B), 0.35);'
            + ` user-select: none; font-weight: bold; font-size: 2rem; padding-top: 20px;">${store.state.i18n.langPackage[store.state.settings.lang].renderPlaceholder}</div>`;
    }

    // apply render HTML content piece
    try {
        IncrementalDOM.patch(
            document.getElementById('write'),
            mdIt.renderToIncrementalDOM(content),
        );
    } catch (e) {
        console.error(`渲染器出错，原因：${e.name}: ${e.message}`);
    }

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
        let target = document.getElementById('write');
        if (target) {
            // 先清除该区域之前的渲染状态（防止重复渲染或内存泄漏）
            nextTick().then(() => {
                MathJax.startup.promise.then(() => {
                    window.MathJax.typesetClear([target]);
                    // 只渲染特定ID的容器，避免全局扫描，性能更好
                    window.MathJax.typesetPromise([target]).then(() => {
                    }).catch((err) => {
                        console.log(err);
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
        // 先清除data-processed节点
        const nodes = document.getElementById('write')
            .querySelectorAll('.mermaid');
        if (nodes.length !== 0) {
            nodes.forEach(node => {
                // 关键：移除该属性，否则 Mermaid 会跳过这些节点
                node.removeAttribute('data-processed');
            });
        }
        // 再执行渲染
        mermaid.initialize({startOnLoad: false});
        await mermaid.run({querySelector: '.mermaid'});
    });
};

const scrollCustomLineElementToCenter = (middleLine, rangeFirstLine) => {
    nextTick().then(() => {
        const container = document.getElementById('viewer-container');  // 外面的容器，包裹着里面的滚动着的高div
        if (!container || !container.firstChild) {
            return 0;
        }
        let targetElement;
        const lineOffsets = [0, -1, 1, -2, 2, -3, 3]; // 查找优先级：当前行 -> 前一行 -> 后一行，以此类推
        // 在右侧容器中查找具有相同 data-source-line 的元素
        for (const offset of lineOffsets) {
            targetElement = container.firstChild
                .querySelector(`[data-source-line="${(middleLine - rangeFirstLine + 1
                    /* data-source-line的编号是从0开始的，因此需要减1 -> */ - 1) + offset}"]`);
            if (targetElement) {
                break;
            }
        }
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'auto',
                block: 'center',
                container: 'nearest',
                inline: 'center',
            });
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
        if (document.getElementById('write').children.length !== 0) {
            setTimeout(() => {
                document.getElementById('viewer-container').scrollTo(0, 0);
            }, 100);
        }
    } catch (e) {
    }
};

const goToBottom = () => {
    // 滚到底了
    try {
        if (document.getElementById('write').children.length !== 0) {
            setTimeout(() => {
                document.getElementById('write').lastChild.scrollIntoView({
                    behavior: 'auto',
                    block: 'center',
                    inline: 'center',
                });
            }, 100);
        }
    } catch (e) {
    }
};

defineExpose({
    goToTop,
    goToBottom,
});

// watch
watch(
    () => [props.mdPiece, props.middleLineNumber],
    ([newMdPiece, newMiddleLineNumber], [oldMdPiece, oldMiddleLineNumber]) => {
        if ((!(Number(store.state.settings.userSettings.safe_mode) === 1)) || (!props.enableSafe)) {
            render(newMdPiece);
            if (newMiddleLineNumber !== oldMiddleLineNumber) {
                scrollCustomLineElementToCenter(
                    newMiddleLineNumber,
                    props.startLineNumber
                );
            }
        }
    }
);

watch(confirmContentSafe, (newValue, oldValue) => {
    if (newValue) {
        nextTick().then(() => {
            if ((!(Number(store.state.settings.userSettings.safe_mode) === 1)) || (!props.enableSafe)) {
                render(props.mdPiece);
            }
        });
    }
});

</script>

<template>
    <Transition>
        <nav v-if="(!(Number(store.state.settings.userSettings.safe_mode) === 1)) && props.enableToc && viewerTocShow" class="custom-toc">
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
                <p>&nbsp;&nbsp;&nbsp;{{ store.state.i18n.langPackage[store.state.settings.lang].contextMenu.inViewer.copy }}</p>
            </div>
            <div v-if="props.enableToc" class="vc-menu-element"
                 @click="viewerTocShow = !viewerTocShow; viewerContextMenuShow = false;">
                <p>&nbsp;&nbsp;&nbsp;{{ viewerTocShow ? '关闭' : '打开' }}此文档目录</p>
            </div>
        </div>
    </Transition>

    <div class="viewer-area fonts"
         id="viewer-container"
         tabindex="-1"
         v-bind="$attrs"
         @contextmenu.prevent="displayViewerContextMenu"
         @click="viewerContextMenuShow = false"
         @blur="viewerContextMenuShow = false">
        <div v-if="(!(Number(store.state.settings.userSettings.safe_mode) === 1)) || (!props.enableSafe)" id="write">
            <!--Generated HTML was injected here...-->
        </div>
        <safe-mode-info v-if="Number(store.state.settings.userSettings.safe_mode) === 1 && props.enableSafe"></safe-mode-info>
    </div>
</template>

<style scoped>
@import "./styles/viewer.css";
</style>
<style>
@import "./styles/theme.css";

/* 行内代码样式（适用于 <code> 标签，且不影响 <pre><code> 代码块） */
code {
    /* 字体：优先使用等宽字体 */
    font-family: 'SF Mono', 'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Roboto Mono', monospace;

    /* 背景与文字颜色（亮色主题） */
    background-color: #f6f8fa;
    color: #e83e8c;

    /* 内边距与圆角 */
    padding: 0.2em 0.4em;
    border-radius: 6px;

    /* 字号略小于正文 */
    font-size: 0.875em;

    /* 长代码自动换行，避免溢出 */
    white-space: normal;
    word-break: break-word;

    /* 可选：平滑过渡效果（不影响功能） */
    transition: background-color 0.1s ease;
}

/* 鼠标悬停时稍微加深背景，提升交互感（可选） */
code:hover {
    background-color: #e9ecef;
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {

}

/* 重置代码块（<pre><code>）内的样式，确保代码块保持原始格式 */
pre code {
    background-color: transparent;
    padding: 0;
    border-radius: 0;
    font-size: inherit;
    color: inherit;
    white-space: pre; /* 保留代码缩进与换行 */
    word-break: normal; /* 避免代码块内单词折断 */
}

* {
    word-break: break-all !important;
}

.markdown-alert.markdown-alert-note {
    background-color: rgba(47, 129, 247, 0.06);
}

.markdown-alert.markdown-alert-important {
    background-color: rgba(163, 113, 247, 0.06);
}

.markdown-alert.markdown-alert-tip {
    background-color: rgba(63, 185, 80, 0.06);
}

.markdown-alert.markdown-alert-warning {
    background-color: rgba(210, 153, 34, 0.06);
}

.markdown-alert.markdown-alert-caution {
    background-color: rgba(248, 81, 73, 0.06);
}
</style>
