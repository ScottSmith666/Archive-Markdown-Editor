/**
 * 获取textarea内部的Markdown内容并发送给preload.js
 * 中间层，负责同时与渲染层与底层沟通
 * @type {HTMLElement}
 */
let leftObj = document.getElementById('leftMenu');
let rightObj = document.getElementById('rightMenu');
let markdownObj = document.getElementById("md-content");
let renderTxt = document.getElementById("plh-render");

// 初始化编辑器
let editor = CodeMirror.fromTextArea(document.getElementById("md-content"), { // 标识到textarea
    lineWrapping: true,
    lineNumbers: true,  // 显示行号
    theme: 'juejin',
    electricChars: true,  // 自动锁进
});

// 渲染语言
async function loadLanguage() {
    let presentLangPackage = await window.lang.getLangIndexLangContent();

    // Edit&Render placeholder language
    let presentLangIndex = presentLangPackage[1];
    let presentLangEditPlh = presentLangPackage[0].markdownEditPlaceholder[presentLangIndex];
    renderTxt.innerText = presentLangPackage[0].markdownRenderPlaceholder[presentLangIndex];
    markdownObj.setAttribute("placeholder", presentLangEditPlh);

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

loadLanguage();

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

async function renderChange() {
    let swDebug = await window.swDebug.switchDebuggingMode();
    // 更改渲染区的内容
    let afterRenderedMd = await window.writeMarkdown.changeContent(editor.getValue());

    document.getElementById("render-content").innerHTML
        = afterRenderedMd[1];

    console.log(swDebug);
    if (swDebug) {
        console.log("----PRINT START----");
        console.log(editor.getValue());
        console.log(afterRenderedMd[0]);
        console.log(afterRenderedMd[1]);
        console.log("----PRINT END----");
    }
    contentChangeEvent();
}

async function contentChangeEvent() {
    // Render placeholder show/hide
    let swDebug = await window.swDebug.switchDebuggingMode();
    // 判断textarea是否有内容而选择性显示“Markdown渲染区”
    let renderPlaceholderObj = document.getElementById("render-placeholder");
    if (editor.getValue() !== "") renderPlaceholderObj.style.display = "none";
    else renderPlaceholderObj.style.display = "block";

    if (swDebug) {
        console.log("textarea内容：" + editor.getValue());
    }

    Prism.plugins.NormalizeWhitespace.setDefaults({
        'remove-trailing': false,
        'remove-indent': false,
        'left-trim': false,
        'right-trim': false,
        'remove-initial-line-feed': false,
    });
    Prism.highlightAll();
}

function copy(keep) {
    // 获得选中文本
    let catchContent = editor.getSelection();
    // 将选中文本送入剪贴板，完成复制
    navigator.clipboard.writeText(catchContent).then(function() {}).catch(function(error) {
        console.error("复制失败: ", error);
    });
    // 如果是剪贴(keep = false)，则将指定位置的字符串替换成空字符串，实现剪切效果
    if (!keep) {
        editor.replaceSelection("", catchContent);
        // 同时更改渲染区内容
        renderChange();
    }
}

async function selectAllContent() {
    let swDebug = await window.swDebug.switchDebuggingMode();
    if (swDebug) console.log("selectAll");
    let allContentLine = editor.getValue().split("\n");

    let startSelection = { line: 0, ch: 0 };  // 最开头的选区
    let endSelection = {
        line: (allContentLine.length - 1),
        ch: allContentLine[allContentLine.length - 1].length,
    };
    editor.setSelection(startSelection, endSelection);  // 执行设置选区操作
}

function mdPaste() {
    // 获得光标位置
    let start = editor.getSelection();
    navigator.clipboard.readText().then(function(content) {
        editor.replaceSelection(content, start);
        // 同时更改渲染区内容
        renderChange();
    }).catch(function(error) {
        console.error("粘贴失败: ", error);
    });
}

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

// 编辑区监听左键
document.getElementById("editor").addEventListener('click', async (e) => {
    let swDebug = await window.swDebug.switchDebuggingMode();
    e.preventDefault();
    hideAllAreaMenu(e);
    editor.focus();

    if (swDebug) {
        console.log("光标位置左: ");
        console.log(editor.getCursor("from"));
        console.log("光标位置右: ");
        console.log(editor.getCursor("to"));
        console.log("选区: ");
        console.log(editor.getSelection());
    }
});

// 渲染区监听左键
document.getElementById("preview").addEventListener('click', (e) => {
    e.preventDefault();
    hideAllAreaMenu(e);
});

// 编辑区右键菜单点击事件
document.getElementById("leftMenu-select-all").addEventListener('click', (e) => {
    selectAllContent();
});
document.getElementById("leftMenu-cut").addEventListener('click', (e) => {
    copy(false);
});
document.getElementById("leftMenu-copy").addEventListener('click', (e) => {
    copy(true);
});
document.getElementById("leftMenu-paste").addEventListener('click', (e) => {
    mdPaste();
});

// 渲染区右键菜单点击事件
document.getElementById("rightMenu-select-all").addEventListener('click', (e) => {

});
document.getElementById("rightMenu-copy").addEventListener('click', (e) => {

});

editor.on("change", async () => {
    let swDebug = await window.swDebug.switchDebuggingMode();
    // 如果在最后一行输入
    let allContentLines = editor.getValue().split("\n");
    let selectionLine = editor.getCursor().line;  // 最开头的选区
    let endSelectionLine = allContentLines.length - 1;
    if (selectionLine === endSelectionLine)
        document.getElementById("real-edit").scrollTo({
            behavior: "smooth",
            top: 999999,
        });

    // 同时更改渲染区内容
    renderChange();

    if (swDebug) {
        console.log("触发输入事件...");
        console.log("开始滑动...");
        console.log("两个光标的行：" + selectionLine + " " + endSelectionLine);
    }
});

// 全选
window.contentOperateCVA.selectAll(async () => {
    selectAllContent();
});

// 复制&剪切
window.contentOperateCVA.copy((keep) => {
    copy(keep);
});

// 粘贴
window.contentOperateCVA.paste(() => {
    mdPaste();
});

// 撤销
window.contentOperateCVA.undo(() => {});

// 重做
window.contentOperateCVA.redo(() => {});
