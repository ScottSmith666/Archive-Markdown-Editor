/**
 * 获取textarea内部的Markdown内容并发送给preload.js
 * 中间层，负责同时与渲染层与底层沟通
 * @type {HTMLElement}
 */

let leftObj = document.getElementById('leftMenu');
let renderTxt = document.getElementById("plh-render");

// 载入UI语言
loadLanguage();

// 初始化编辑器
require.config({ paths: { vs: './libs/third_party/monaco/min/vs' } });
require.config({ 'vs/nls': { availableLanguages: { '*': 'zh-cn' } } });
require(['vs/editor/editor.main'], function () {
    // 定义自定义主题
    monaco.editor.defineTheme('myEditorTheme', {
        base: "vs",
        inherit: true,
        rules: [{ background: '#f8f9fa' }],
        colors: {
            'editor.background': '#f8f9fa',
            'editorCursor.foreground': '#42b983',
            'editor.lineHighlightBackground': '#42b98333',
            'editor.selectionBackground': '#6cffbc',
        }
    });
    //设置刚刚定义的自定义主题
    monaco.editor.setTheme('myEditorTheme');

    let editor = monaco.editor.create(document.getElementById('real-edit'), {
        value: "",
        language: "markdown",
        autoClosingBrackets: 'always',
        autoClosingDelete: 'always',
        autoClosingQuotes: 'always',
        autoIndent: "advanced",
        contextmenu: false,
        automaticLayout: true,
        scrollbar: {
            "vertical": "hidden",
        },
        cursorSmoothCaretAnimation: true,
        wordWrap: "on",
        scrollBeyondLastLine: false,
        formatOnPaste: true,
    });

    // preset value
    editor.setValue(`---
title: Lorem ipsum
author: SprInec
references: typora-theme-Jinxiu
description: 这个 block 块是 YAML front matters
---

# Lorem ipsum

在[出版](https://www.wikiwand.com/en/Publishing)和[平面设计](https://www.wikiwand.com/en/Graphic_design)中，**lorem ipsum**（源自拉丁语 *dolorem ipsum*，翻译为“痛苦本身”）是一个[填充文本](https://www.wikiwand.com/en/Filler_text)，通常用于演示文档或视觉呈现的图形元素[^1]

## 样例文本

常见的 *lorem ipsum* 起头如下：

> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
>
> 我必须向你们解释，谴责快乐和赞美痛苦的这一错误观念是如何诞生的，我将给你们一个完整的系统说明，并阐述真理的伟大探索者，人类幸福的主要建造者的实际教导。

-------

内联样式支持**粗体**、*斜体*、\`code\`、<u>下划线</u>、~~删除线~~、:smile:、$\\LaTeX$、X^2^、H~2~O、==高亮==、[链接](typora.io)和图像：

![img](https://w.wallhaven.cc/full/3l/wallhaven-3lpymv.png)

层级标题：

### 标题3

#### 标题4

##### 标题5

###### 标题6

表格：

<center><strong>表 2  全球/中国桌面操作系统市场份额占比（%）</strong></center>

| OS   | Windows | macOS | Unknown | Linux | Chrome OS | 其他 |
| ---- | ------- | ----- | ------- | ----- | --------- | ---- |
| 全球 | 76.56   | 17.1  | 2.68    | 1.93  | 1.72      | 0.01 |
| 中国 | 87.55   | 5.44  | 6.24    | 0.75  | 0.01      | 0.01 |

项目列表：

1.  有序列表项
2.   有序列表项2
    +   无序列表项1
    +   无序列表项2. 
        *   [x] 表示已完成。
        *   [ ] 表示未完成。

*   项目1 
    - 项目2 
    
    -   项目3 

1. 项目1 
2. 项目2 
    1. 项目2.1 
    2. 项目2.2 
        1. 项目2.2.1 
        2. 项目2.2.2

代码块：

\`\`\`html
<!DOCTYPE html>
<html>
<body>

<h1>The *= Operator</h1>
  
<p id="demo"></p>

<script>
var x = 10;
x *= 5;
document.getElementById("demo").innerHTML = x;
</script>

</body>
</html>
\`\`\`

mermaid  图形：

\`\`\`mermaid
graph LR
A(开始) -->
input[/输入a,b/] --> if{a%b=0 ?}
if --->|yes| f1[GCD = b] --> B(结束)
if --->|no| f2["a, b = b, a % b "]-->if
\`\`\`

公式:

$$
\\iint\\limits_{x^2 + y^2 \\leq R^2} f(x,y)\\,\\mathrm{d}x\\,\\mathrm{d}y = \\int_{\\theta=0}^{2\\pi} \\mathrm{d}\\theta\\int_{r=0}^R f(r\\cos\\theta,r\\sin\\theta) r\\,\\mathrm{d}r\\, \\tag{1}
$$

alter:

> [!tip]
>
> Inline styles support **strong**, *Emphasis*, \`code\`, :smile:, $\\LaTeX$, X^2^, H~2~O, table, [Link](typora.io), and code block:
>
> \`\`\`bash
>echo "警告框代码块示例"
> \`\`\`
> 
> |  TITLE  |  title  |
> | :-----: | :-----: |
> | content | content |

> [!important]
>
> Inline styles support **strong**, *Emphasis*, \`code\`, :smile:, $\\LaTeX$, X^2^, H~2~O, table, [Link](typora.io), and code block:
>
> |  TITLE  |  title  |
> | :-----: | :-----: |
> | content | content |

> [!note]
>
> Inline styles support **strong**, *Emphasis*, \`code\`, :smile:, $\\LaTeX$, X^2^, H~2~O, table, [Link](typora.io), and code block:
>
> |  TITLE  |  title  |
> | :-----: | :-----: |
> | content | content |

> [!warning]
>
> Inline styles support **strong**, *Emphasis*, \`code\`, :smile:, $\\LaTeX$, X^2^, H~2~O, table, [Link](typora.io), and code block:
>
> |  TITLE  |  title  |
> | :-----: | :-----: |
> | content | content |

> [!caution]
>
> Inline styles support **strong**, *Emphasis*, \`code\`, :smile:, $\\LaTeX$, X^2^, H~2~O, table, [Link](typora.io), and code block:
>
> |  TITLE  |  title  |
> | :-----: | :-----: |
> | content | content |

目录：

[TOC]

[^1]: 从 https://en.wikipedia.org/wiki/Lorem_ipsum 整理得到

`);

    // 初始化渲染
    renderChange();

    // Ctrl/Cmd + C快捷键
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC, function() {
        copy(true);
    });
    // Ctrl/Cmd + V快捷键
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV, function() {
        mdPaste();
        console.log('粘贴');
    });
    // Ctrl/Cmd + X
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyX, function() {
        copy(false);
        console.log('剪切');
    });
    // Monaco Editor内容改变事件
    editor.onDidChangeModelContent(function(e){
        renderChange();
    });
    editor.onDidScrollChange(() => {
        // 获取编辑区滚动到哪里了
        let rollProcess = (editor.getVisibleRanges()[0].startLineNumber + (editor.getVisibleRanges()[0].endLineNumber - editor.getVisibleRanges()[0].startLineNumber) / 2)
            / (editor.getModel().getLineCount() - (editor.getVisibleRanges()[0].endLineNumber - editor.getVisibleRanges()[0].startLineNumber) / 2);
        // console.log(`滚动进度：${ rollProcess * 100 }%`);

        // 相应改变渲染区滚动位置
        let getRenderAreaTotalHeight = document.getElementById("render-content").offsetHeight;
        let parentGetRenderAreaTotalHeight = document.querySelector(".middle-content-render");
        // console.log(`渲染区高度：${ getRenderAreaTotalHeight }`);
        // console.log(editor.getVisibleRanges()[0].startLineNumber);
        parentGetRenderAreaTotalHeight.scrollTo({
            top: editor.getVisibleRanges()[0].startLineNumber !== 1 ? getRenderAreaTotalHeight * rollProcess : 0,
            left: 0,
            behavior: "smooth",
        });
    });

    // 编辑区右键菜单点击事件
    document.getElementById("leftMenu-cut").addEventListener('click', (e) => {
        copy(false, true);
        hideAllAreaMenu(e);
    });
    document.getElementById("leftMenu-copy").addEventListener('click', (e) => {
        copy(true, true);
        hideAllAreaMenu(e);
    });
    document.getElementById("leftMenu-paste").addEventListener('click', (e) => {
        mdPaste();
        hideAllAreaMenu(e);
    });

    // 编辑区监听右键
    document.getElementById("editor").addEventListener('contextmenu', (e) => {
        showLeftAreaMenu(e);
    });

    // 渲染区监听左键
    document.getElementById("preview").addEventListener('click', (e) => {
        console.log(window.getSelection().toString());
        hideAllAreaMenu(e);
    });

    // 编辑区监听左键
    document.getElementById("real-edit").addEventListener('click', async (e) => {
        let swDebug = await window.swDebug.switchDebuggingMode();
        e.preventDefault();
        hideAllAreaMenu(e);
        if (swDebug) {
            console.log("光标位置: ");
            console.log(editor.getPosition());
            console.log("选区: ");
            console.log(window.getSelection().toString());
        }
    });

    // ----菜单栏 START----
    // 复制 || 剪切
    window.contentOperateCVA.copy((keep) => {
        copy(keep);
    });
    // 粘贴
    window.contentOperateCVA.paste(() => {
        mdPaste();
    });
    // ----菜单栏 END----

    function copy(keep, rightMenuNeed = false) {
        // 将选中文本送入剪贴板，完成复制
        if (rightMenuNeed) editor.focus();
        navigator.clipboard.writeText(window.getSelection().toString()).then(async function() {
            let swDebug = await window.swDebug.switchDebuggingMode();
            if (swDebug) console.log(window.getSelection().toString());
        }).catch(function(error) {
            console.error("复制失败: ", error);
        });
        // 如果是剪贴(keep = false)，则将指定位置的字符串替换成空字符串，实现剪切效果
        if (!keep) {
            let selection = editor.getSelection();
            console.log(selection.startLineNumber);
            editor.executeEdits("number-scrubber",
                [
                    {
                        range: new monaco.Range(
                            selection.startLineNumber,
                            selection.startColumn,
                            selection.endLineNumber,
                            selection.endColumn
                        ),
                        text: "",
                    }
                ], true);
            // 同时更改渲染区内容
            renderChange();
        }
    }

    function mdPaste() {
        // 获得光标位置
        let selection = editor.getSelection();
        navigator.clipboard.readText().then(function(content) {
            console.log(selection.startLineNumber);
            editor.executeEdits("number-scrubber",
                [
                    {
                        range: new monaco.Range(
                            selection.startLineNumber,
                            selection.startColumn,
                            selection.endLineNumber,
                            selection.endColumn
                        ),
                        text: content,
                    }
                ], true);
            // 同时更改渲染区内容
        }).catch(function(error) {
            console.error("粘贴失败: ", error);
        });
    }

    function renderChange() {
        // 判断textarea是否有内容而选择性显示“Markdown渲染区”
        document.getElementById("render-content").innerHTML = null;  // 初始化渲染区
        let renderPlaceholderObj = document.getElementById("render-placeholder");
        if (editor.getValue() !== "") renderPlaceholderObj.style.display = "none";
        else renderPlaceholderObj.style.display = "block";

        // 监视👀当前编辑区光标位置
        // 获取编辑区滚动到哪里了
        let presentLineProp = editor.getPosition().lineNumber / editor.getModel().getLineCount();

        // 渲染Markdown
        let mdParserList = marked.lexer(editor.getValue());
        let total = mdParserList.length;
        let chunk = 200;
        let countOfRender = 0;
        let status = true;
        function loop(){
            // 浏览器单线程，一次性渲染大量的DOM，会阻塞用户操作，阻塞CSS渲染，有较长白屏事件等问题
            // 所以我们只需要每次渲染少量的DOM不会阻塞用户操作即可解决这些问题
            requestAnimationFrame(()=> {
                let fragment = document.createDocumentFragment();
                // 每次只渲染chunk条数据
                for (let i = 0; i < chunk; i++) {
                    let temp = document.createElement("div");
                    // 当DOM渲染完就退出
                    if (countOfRender >= total) {
                        status = false;
                        break;
                    }
                    temp.setAttribute("id", ("block" + countOfRender));
                    let afterBlock = marked.parser([mdParserList[countOfRender]]);
                    let afterProcessedHTML = processHTML(afterBlock);
                    fragment.appendChild(afterProcessedHTML);  // 对HTML进行处理
                    countOfRender++;
                }
                document.getElementById("render-content").appendChild(fragment);
                if (!status) {
                    console.log("文件读取完成...");
                    prism();
                    MathJax.typesetPromise();
                    // 使渲染区滚动到相应位置
                    let getRenderAreaTotalHeight = document.getElementById("render-content").offsetHeight;
                    let parentGetRenderAreaTotalHeight = document.querySelector(".middle-content-render");
                    parentGetRenderAreaTotalHeight.scrollTo({
                        top: getRenderAreaTotalHeight * presentLineProp,
                        left: 0,
                        behavior: "instant",
                    });
                    return 0;
                }
                loop();
            });
        }
        loop();
    }

    function prism() {
        // 渲染区代码高亮
        Prism.plugins.NormalizeWhitespace.setDefaults({
            'remove-trailing': false,
            'remove-indent': false,
            'left-trim': false,
            'right-trim': false,
            'remove-initial-line-feed': false,
        });
        Prism.highlightAll();
    }
});

// 渲染语言
async function loadLanguage() {
    let presentLangPackage = await window.lang.getLangIndexLangContent();

    // Edit&Render placeholder language
    let presentLangIndex = presentLangPackage[1];
    renderTxt.innerText = presentLangPackage[0].markdownRenderPlaceholder[presentLangIndex];

    // Right menu language
    // Edit area right menu
    let presentLangEditRightMenu = presentLangPackage[0].markdownEditRightMenu[presentLangIndex];
    leftObj.children[0].children[0].innerHTML = "&nbsp;&nbsp;&nbsp;" + presentLangEditRightMenu[0];
    leftObj.children[1].children[0].innerHTML = "&nbsp;&nbsp;&nbsp;" + presentLangEditRightMenu[1];
    leftObj.children[2].children[0].innerHTML = "&nbsp;&nbsp;&nbsp;" + presentLangEditRightMenu[2];
}

function showLeftAreaMenu(event) {
    /**
     * 定义编辑区右键菜单行为
     * @type {HTMLElement}
     */
    event.preventDefault(); //关闭浏览器右键默认事件
    let menuHeight = 120;
    let menuWidth = 200;
    leftObj.style.left = (event.clientX + menuWidth) <= (document.body.clientWidth / 2 - 20)
        ? (event.clientX - 20) + 'px' : (document.body.clientWidth / 2 - 40 - menuWidth) + 'px';
    leftObj.style.top = (event.clientY + menuHeight + 30) <= document.body.clientHeight
        ? (event.clientY - 20) + 'px' : (document.body.clientHeight - menuHeight - 60) + 'px';

    leftObj.style.display = "block";
    setTimeout(() => {
        leftObj.style.opacity = 1;
    }, 200);
}

function hideAllAreaMenu(event) {
    /**
     * 左键点击关闭所有右键菜单
     * @type {HTMLElement}
     */
    event.preventDefault();
    leftObj.style.opacity = 0;
    setTimeout(() => {
        leftObj.style.display = "none";
    }, 200);
}
