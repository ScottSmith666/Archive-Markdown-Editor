"use strict";

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
require(['vs/editor/editor.main'], async function () {
    /**
     * 设置表
     * ----编辑----
     * 编辑区Tab缩进长度：editor_tab_size: <number>，初始化默认为4
     * 编辑区字体大小：editor_font_size: <number>，初始化默认为12
     * 开启行号：enable_line_num: 1 || 0，1代表"on"，0代表"off"，初始化默认为1
     * 开启代码折叠：enable_code_fold: 1 || 0，1代表true，0代表false，初始化默认为1
     * 开启自动折行：enable_auto_wrap_line: 1 || 0，1代表"on"，0代表"off"，初始化默认为1
     * 开启自动输入闭合引号/括号和成对删除引号/括号: enable_auto_closure: 1 || 0，1代表"always"，0代表"never"，初始化默认为1
     * 显示垂直滚动条：display_vertical_scrollbar: 0 || 1 || 2，0代表"visible"，1代表"auto"，2代表"hidden"，初始化默认为0
     * 显示水平滚动条：display_horizon_scrollbar: 0 || 1 || 2，0代表"visible"，1代表"auto"，2代表"hidden"，初始化默认为0
     * 显示代码缩略图：display_code_scale: 1 || 0，1代表true，0代表false，初始化默认为0
     * 启用编辑器动画效果：display_editor_animation:  1 || 0，1代表true，0代表false，初始化默认为1
     */

    let editorTabSize = await window.settings.getEditorTabSize();
    let editorFontSize = await window.settings.getEditorFontSize();
    let enableLineNum = ((await window.settings.getEnableLineNum()) === 1) ? "on" : "off";
    let enableCodeFold = ((await window.settings.getEnableCodeFold()) === 1);
    let enableAutoWrapLine = ((await window.settings.getEnableAutoWrapLine()) === 1) ? "on" : "off";
    let enableAutoClosure = ((await window.settings.getEnableAutoClosure()) === 1) ? "always" : "never";
    let displayVerticalScrollbar = "";
    switch ((await window.settings.getDisplayVerticalScrollbar())) {
        case 0:
            displayVerticalScrollbar = "visible";
            break;
        case 1:
            displayVerticalScrollbar = "auto";
            break;
        case 2:
            displayVerticalScrollbar = "hidden";
            break;
    }
    let displayHorizonScrollbar = "";
    switch ((await window.settings.getDisplayHorizonScrollbar())) {
        case 0:
            displayHorizonScrollbar = "visible";
            break;
        case 1:
            displayHorizonScrollbar = "auto";
            break;
        case 2:
            displayHorizonScrollbar = "hidden";
            break;
    }
    let displayCodeScale = ((await window.settings.getDisplayCodeScale()) === 1);
    let displayEditorAnimation = ((await window.settings.getDisplayEditorAnimation()) === 1);

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

    // 设置智能提示
    monaco.languages.registerCompletionItemProvider("markdown", {
        provideCompletionItems: function (model, position) {
            return {
                suggestions: suggestions("markdown"),
            };
        },
    });

    let editor = monaco.editor.create(document.getElementById('real-edit'), {
        value: "",
        language: "markdown",
        autoClosingBrackets: enableAutoClosure,
        autoClosingDelete: enableAutoClosure,
        autoClosingQuotes: enableAutoClosure,
        autoIndent: "advanced",
        folding: enableCodeFold,
        contextmenu: false,
        automaticLayout: true,
        scrollbar: {
            "vertical": displayVerticalScrollbar,
            "horizontal": displayHorizonScrollbar,
        },
        minimap: {
            enabled: displayCodeScale,
        },
        cursorSmoothCaretAnimation: displayEditorAnimation,
        wordWrap: enableAutoWrapLine,
        scrollBeyondLastLine: false,
        formatOnPaste: true,
        dragAndDrop: true,
        lineNumbers: enableLineNum,
        tabSize: editorTabSize,
        fontSize: editorFontSize,
    });

    // let preset = `# 编辑Markdown从此开始...`;

    // preset value
    // editor.setValue(preset);

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
    let oldValue = editor.getValue();
    editor.onDidChangeModelContent(function(e){
        renderChange(oldValue);  // 参数“oldValue”是上一次的渲染内容，便于前后比对以进行局部更新
        oldValue = editor.getValue();
    });
    editor.onDidScrollChange(() => {
        // 获取编辑区滚动到哪里了
        let rollProcess = (editor.getVisibleRanges()[0].startLineNumber + (editor.getVisibleRanges()[0].endLineNumber - editor.getVisibleRanges()[0].startLineNumber) / 2)
            / (editor.getModel().getLineCount() - (editor.getVisibleRanges()[0].endLineNumber - editor.getVisibleRanges()[0].startLineNumber) / 2);
        // console.log(`滚动进度：${ rollProcess * 100 }%`);

        // 相应改变渲染区滚动位置
        let getRenderAreaTotalHeight = document.getElementById("write").offsetHeight;
        let parentGetRenderAreaTotalHeight = document.querySelector(".middle-content-render");
        // console.log(`渲染区高度：${ getRenderAreaTotalHeight }`);
        // console.log(editor.getVisibleRanges()[0].startLineNumber);
        parentGetRenderAreaTotalHeight.scrollTo({
            top: editor.getVisibleRanges()[0].startLineNumber !== 1 ? getRenderAreaTotalHeight * rollProcess : 0,
            left: 0,
            behavior: "instant",
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

        let editorAreaHasFocus = editor.hasTextFocus();  // 编辑器是否聚焦

        if (rightMenuNeed) {
            editor.focus();
            editorAreaHasFocus = editor.hasTextFocus();
        }

        // Editor获得选区内容
        let editorSelectionContent = editorAreaHasFocus ? editor.getModel().getValueInRange(editor.getSelection()) : window.getSelection().toString();
        navigator.clipboard.writeText(editorSelectionContent).then(function() {}).catch(function(error) {
            console.error("复制失败: ", error);
        });
        // 如果是剪贴(keep = false)，则将指定位置的字符串替换成空字符串，实现剪切效果
        if (!keep) {
            let selection = editor.getSelection();
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
                ],
                true,
            );
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
        }).catch(function(error) {
            console.error("粘贴失败: ", error);
        });
    }

    function renderChange(oldEditorValue) {
        /**
         * 参数“oldEditorValue”是上一次的渲染内容，便于前后比对以进行局部更新
         * @type {null}
         */
        // 判断textarea是否有内容而选择性显示“Markdown渲染区”

        let newEditorValue = editor.getValue();
        let renderPlaceholderObj = document.getElementById("render-placeholder");
        if (newEditorValue !== "") renderPlaceholderObj.style.display = "none";
        else renderPlaceholderObj.style.display = "block";

        // 监视👀当前编辑区光标位置
        // 获取编辑区滚动到哪里了
        let presentLineProp = editor.getPosition().lineNumber / editor.getModel().getLineCount();

        // 渲染Markdown
        let mdParserList = marked.lexer(newEditorValue);  // 获得整个Markdown文档的抽象语法树
        let mdParserListOld = marked.lexer(oldEditorValue);  // 获得上一次编辑的整个Markdown文档的抽象语法树

        let total = mdParserList.length;
        let chunk = 200;
        let countOfRender = 0;
        let status = true;

        if (oldEditorValue === "") {  // 如果检测到前一次编辑器内部没有内容，后面的内容就全量更新
            function loop() {
                // 浏览器单线程，一次性渲染大量的DOM，会阻塞用户操作，阻塞CSS渲染，有较长白屏事件等问题
                // 所以我们只需要每次渲染少量的DOM不会阻塞用户操作即可解决这些问题
                // 递归进行
                requestAnimationFrame(async () => {
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

                        let afterProcessedHTML = processHTML(afterBlock, mdParserList[countOfRender]);
                        fragment.appendChild(afterProcessedHTML);  // 对HTML进行处理
                        countOfRender++;
                    }
                    document.getElementById("write").appendChild(fragment);
                    if (!status) {
                        // 整个文档已经渲染完成
                        MathJax.typesetPromise();
                        // 使渲染区滚动到相应位置
                        let getRenderAreaTotalHeight = document.getElementById("write").offsetHeight;
                        let parentGetRenderAreaTotalHeight = document.querySelector(".middle-content-render");
                        parentGetRenderAreaTotalHeight.scrollTo({
                            top: getRenderAreaTotalHeight * presentLineProp,
                            left: 0,
                            behavior: "instant",
                        });
                        // 重新渲染mermaid
                        await mde.mermaid.run({
                            querySelector: '.mermaid',
                        });
                        // 重新渲染prism
                        prism();
                        watchATags(document.getElementById('write'));
                        return 0;
                    }
                    loop();
                });
            }
            loop();
        } else {
            if (editor.getValue() === "") {
                // 如果当前编辑器内容为空，则清空渲染区所有DOM，以显示placeholder
                document.getElementById("write").innerHTML = null;  // 初始化渲染区
            } else {
                // 前一次编辑器内部有内容，且当前编辑器内容不为空，说明只改动了部分，则进行局部更新
                function getHash(obj) {
                    function sortObjectKeys(o) {
                        if (o === null || typeof o !== 'object') {
                            return o;
                        }
                        if (Array.isArray(o)) {
                            return o.map(sortObjectKeys);
                        }
                        const sorted = {};
                        Object.keys(o).sort().forEach(key => {
                            sorted[key] = sortObjectKeys(o[key]);
                        });
                        return sorted;
                    }
                    const sortedObj = sortObjectKeys(obj);
                    return JSON.stringify(sortedObj);
                }
                // 计算出需要局部更新时的文档列表元素
                function computeDiff(oldArray, newArray) {
                    const oldMap = new Map();
                    oldArray.forEach((obj, index) => {
                        const hash = getHash(obj);
                        if (!oldMap.has(hash)) {
                            oldMap.set(hash, []);
                        }
                        oldMap.get(hash).push(index);
                    });

                    const matchedOldIndices = new Set();
                    const added = [];

                    newArray.forEach((newObj, newIndex) => {
                        const hash = getHash(newObj);
                        if (oldMap.has(hash) && oldMap.get(hash).length > 0) {
                            const oldIndex = oldMap.get(hash).shift();
                            matchedOldIndices.add(oldIndex);
                        } else {
                            added.push({ added_object: newObj, in_new_index: newIndex });
                        }
                    });

                    const deleted = [];
                    oldArray.forEach((oldObj, oldIndex) => {
                        if (!matchedOldIndices.has(oldIndex)) {
                            deleted.push({ deleted_object: oldObj, in_old_index: oldIndex });
                        }
                    });

                    return [...deleted, ...added];
                }

                console.log(mdParserListOld);
                console.log(mdParserList);
                console.log(computeDiff(mdParserListOld, mdParserList));
            }
        }
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

    function watchATags(element) {
        /**
         * 递归遍历所有元素并找到<a>
         */
        if (element.children.length) {
            Array.from(element.children).forEach(child => watchATags(child));
        } else {
            if (element.tagName.toLowerCase() === "a") {
                let url = element.getAttribute("href");
                url = (url.includes("http://") || url.includes("https://")) ? url : "https://" + url;
                element.addEventListener("click", function (e) {
                    window.openOutLink.openLink(url);
                });
            }
        }
    }
});

// 渲染语言
async function loadLanguage() {
    let presentLangIndex = await window.settings.getLangSettings();
    let rightMenu = await window.userSurface.getRightMenuSurface();
    let renderPlaceholder = await window.userSurface.getRenderPlaceholderSurface();

    // Edit&Render placeholder language
    renderTxt.innerText = renderPlaceholder[presentLangIndex];

    // Right menu language
    // Edit area right menu
    leftObj.children[0].children[0].innerHTML = "&nbsp;&nbsp;&nbsp;" + rightMenu[presentLangIndex][0];
    leftObj.children[1].children[0].innerHTML = "&nbsp;&nbsp;&nbsp;" + rightMenu[presentLangIndex][1];
    leftObj.children[2].children[0].innerHTML = "&nbsp;&nbsp;&nbsp;" + rightMenu[presentLangIndex][2];
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
