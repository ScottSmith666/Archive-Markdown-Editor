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

    // let preset = `# 编辑Markdown从此开始...`;

    // preset value
    // editor.setValue(preset);

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
        let getRenderAreaTotalHeight = document.getElementById("write").offsetHeight;
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

        // 将选中文本送入剪贴板，完成复制
        if (rightMenuNeed) {
            editor.focus();
            editorAreaHasFocus = editor.hasTextFocus();
        }

        console.log(editorAreaHasFocus);

        // Editor获得选区内容
        let editorSelectionContent = editorAreaHasFocus ? editor.getModel().getValueInRange(editor.getSelection()) : window.getSelection().toString();
        navigator.clipboard.writeText(editorSelectionContent).then(function() {}).catch(function(error) {
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

    function renderChange() {
        // 判断textarea是否有内容而选择性显示“Markdown渲染区”
        document.getElementById("write").innerHTML = null;  // 初始化渲染区
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

        let isMermaid = false;

        function loop(){
            // 浏览器单线程，一次性渲染大量的DOM，会阻塞用户操作，阻塞CSS渲染，有较长白屏事件等问题
            // 所以我们只需要每次渲染少量的DOM不会阻塞用户操作即可解决这些问题
            requestAnimationFrame(async ()=> {
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

                    if (mdParserList[countOfRender].type === "code") {
                        if (mdParserList[countOfRender].lang === "mermaid") isMermaid = true;
                    }

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
