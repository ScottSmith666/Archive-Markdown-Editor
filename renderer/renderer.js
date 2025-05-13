/**
 * 获取textarea内部的Markdown内容并发送给preload.js
 * 中间层，负责同时与渲染层与底层沟通
 * @type {HTMLElement}
 */

let leftObj = document.getElementById('leftMenu');
let rightObj = document.getElementById('rightMenu');
let renderTxt = document.getElementById("plh-render");

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
    });

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

    // 编辑区右键菜单点击事件
    document.getElementById("leftMenu-select-all").addEventListener('click', (e) => {
        selectAllContent();
        hideAllAreaMenu(e);
    });
    document.getElementById("leftMenu-cut").addEventListener('click', (e) => {
        copy(false);
        hideAllAreaMenu(e);
    });
    document.getElementById("leftMenu-copy").addEventListener('click', (e) => {
        copy(true);
        hideAllAreaMenu(e);
    });
    document.getElementById("leftMenu-paste").addEventListener('click', (e) => {
        mdPaste();
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

    function copy(keep) {
        // 将选中文本送入剪贴板，完成复制
        editor.focus();
        navigator.clipboard.writeText(window.getSelection().toString()).then(function() {}).catch(function(error) {
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
            renderChange();
        }).catch(function(error) {
            console.error("粘贴失败: ", error);
        });
    }

    async function renderChange() {
        // 判断textarea是否有内容而选择性显示“Markdown渲染区”
        let renderPlaceholderObj = document.getElementById("render-placeholder");
        if (editor.getValue() !== "") renderPlaceholderObj.style.display = "none";
        else renderPlaceholderObj.style.display = "block";

        // 渲染Markdown
        // console.log(editor.getValue());
        // console.log(marked);
        document.getElementById("render-content").innerHTML
            = marked.parse(editor.getValue());
        contentChangeEvent();
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
    leftObj.children[3].children[0].innerHTML = "&nbsp;&nbsp;&nbsp;" + presentLangEditRightMenu[3];

    // Render area right menu
    let presentLangRenderRightMenu = presentLangPackage[0].markdownRenderRightMenu[presentLangIndex];
    rightObj.children[0].children[0].innerHTML = "&nbsp;&nbsp;&nbsp;" + presentLangRenderRightMenu[0];
    rightObj.children[1].children[0].innerHTML = "&nbsp;&nbsp;&nbsp;" + presentLangRenderRightMenu[1];
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

    rightObj.style.opacity = 0;
    leftObj.style.display = "block";
    setTimeout(() => {
        leftObj.style.opacity = 1;
        rightObj.style.display = "none";
    }, 200);
}

function showRightAreaMenu(event) {
    /**
     * 定义渲染区右键菜单行为
     * @type {HTMLElement}
     */
    event.preventDefault(); //关闭浏览器右键默认事件
    let menuHeight = 120;
    let menuWidth = 200;
    rightObj.style.left = (event.clientX + menuWidth) < (document.body.clientWidth - 20)
        ? (event.clientX - document.body.clientWidth / 2 - 20) + 'px' : (document.body.clientWidth / 2 - 40 - menuWidth) + 'px';
    rightObj.style.top = (event.clientY + menuHeight + 30) <= document.body.clientHeight
        ? (event.clientY - 20) + 'px' : (document.body.clientHeight - menuHeight) + 'px';

    leftObj.style.opacity = 0;
    rightObj.style.display = "block";
    setTimeout(() => {
        rightObj.style.opacity = 1;
        leftObj.style.display = "none";
    }, 200);
}

function hideAllAreaMenu(event) {
    /**
     * 左键点击关闭所有右键菜单
     * @type {HTMLElement}
     */
    event.preventDefault();
    leftObj.style.opacity = 0;
    rightObj.style.opacity = 0;
    setTimeout(() => {
        leftObj.style.display = "none";
        rightObj.style.display = "none";
    }, 200);
}

async function contentChangeEvent() {
    Prism.plugins.NormalizeWhitespace.setDefaults({
        'remove-trailing': false,
        'remove-indent': false,
        'left-trim': false,
        'right-trim': false,
        'remove-initial-line-feed': false,
    });
    Prism.highlightAll();
}


// 载入语言
loadLanguage();

// 编辑区监听右键
document.getElementById("editor").addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showLeftAreaMenu(e);
});

// 渲染区监听右键
document.getElementById("preview").addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showRightAreaMenu(e);
});

// 渲染区监听左键
document.getElementById("preview").addEventListener('click', (e) => {
    e.preventDefault();
    hideAllAreaMenu(e);
});

// 渲染区右键菜单点击事件
document.getElementById("rightMenu-select-all").addEventListener('click', (e) => {

});
document.getElementById("rightMenu-copy").addEventListener('click', (e) => {

});
