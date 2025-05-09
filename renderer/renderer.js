/**
 * 获取textarea内部的Markdown内容并发送给preload.js
 * 中间层，负责同时与渲染层与底层沟通
 * @type {HTMLElement}
 */
let leftObj = document.getElementById('leftMenu');
let rightObj = document.getElementById('rightMenu');
let markdownObj = document.getElementById("md-content");
let renderTxt = document.getElementById("plh-render");

let editAreaUp = document.getElementById("edit-area-up");

// 支持textarea和code同时滚动
let txtArea = document.getElementById("real-edit");
let codeArea = document.getElementById("real-show");

function countFormerWrapLineNumber(str) {
    /**
     * 计数字符串最前面有几个换行符
     */
    let count = 0;
    let i = 0;
    while (i < str.length) {
        if (str[i] === '\r') {
            // 检查是否为 \r\n
            if (i + 1 < str.length && str[i + 1] === '\n') {
                count++;
                i += 2;
            } else {
                count++;
                i++;
            }
        } else if (str[i] === '\n') {
            count++;
            i++;
        } else {
            // 遇到非换行符，结束循环
            break;
        }
    }
    return count;
}

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
    let afterRenderedMd = await window.writeMarkdown.changeContent(markdownObj.value);

    document.getElementById("render-content").innerHTML
        = afterRenderedMd[1];

    console.log(swDebug);
    if (swDebug) {
        console.log("----PRINT START----");
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
    if (markdownObj.value !== "") renderPlaceholderObj.style.display = "none";
    else renderPlaceholderObj.style.display = "block";

    if (swDebug) {
        console.log("textarea内容：" + markdownObj.value);
    }

    // 同步更新code area内容
    // 支持编辑区语法高亮
    let visualizer = document.getElementById("language-md");
    visualizer.textContent = "\n" + markdownObj.value;  // 这里前面加一个换行符的目的是补上被prismjs吞掉的一个换行符。
    Prism.plugins.NormalizeWhitespace.setDefaults({
        'remove-trailing': false,
        'remove-indent': false,
        'left-trim': false,
        'right-trim': false,
        'remove-initial-line-feed': false,
    });
    Prism.highlightAll();

    // 动态调整Textarea的高度（与code area同步）
    markdownObj.style.height = (document.getElementById("code-area-down").scrollHeight + 5.7) + 'px';
    // 使外面的div与里面的textarea等高
    editAreaUp.style.height = markdownObj.style.height;

    // 同步滚动
    codeArea.scrollTop = txtArea.scrollTop;
    // txtArea.scrollTop = codeArea.scrollTop;
}

function copy(keep) {
    let mdContent = markdownObj.value;
    // 获得选中的起始位置和结束位置
    let start = markdownObj.selectionStart;
    let end = markdownObj.selectionEnd;

    // 选择
    markdownObj.focus();
    // 获得选中文本
    let catchContent = mdContent.substring(start, end);
    // 将选中文本送入剪贴板，完成复制
    navigator.clipboard.writeText(catchContent).then(function() {}).catch(function(error) {
        console.error("复制失败: ", error);
    });

    // 如果是剪贴(keep = false)，则将指定位置的字符串替换成空字符串，实现剪切效果
    if (!keep) {
        markdownObj.value = mdContent.substring(0, start) + "" + mdContent.substring(end, mdContent.length);
        markdownObj.setSelectionRange(start, start);  // 光标移动到选中部分前面的位置
        // 同时更改渲染区内容
        renderChange();
    }
}

function mdPaste() {
    let mdContent = markdownObj.value;
    // 获得光标位置
    let start = markdownObj.selectionStart;
    navigator.clipboard.readText().then(function(content) {
        markdownObj.value = mdContent.substring(0, start) + content + mdContent.substring(start, mdContent.length);
        markdownObj.setSelectionRange(start + content.length, start + content.length);  // 光标移动到合适位置
        // 同时更改渲染区内容
        markdownObj.focus();
        renderChange();

        txtArea.scroll
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
document.getElementById("editor").addEventListener('click', (e) => {
    e.preventDefault();
    hideAllAreaMenu(e);
    markdownObj.focus();
});

// 渲染区监听左键
document.getElementById("preview").addEventListener('click', (e) => {
    e.preventDefault();
    hideAllAreaMenu(e);
});

// 编辑区右键菜单点击事件
document.getElementById("leftMenu-select-all").addEventListener('click', (e) => {
    markdownObj.select();
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

markdownObj.addEventListener("input", async () => {  // "input"事件，输入就触发
    if (swDebug) console.log("触发输入事件...");
    // 同时更改渲染区内容
    renderChange();
});

// 全选
window.contentOperateCVA.selectAll(() => {
    markdownObj.select();
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

txtArea.addEventListener("scroll", function() {
    codeArea.scrollTop = txtArea.scrollTop;
});
//
// codeArea.addEventListener("scroll", function() {
//     codeArea.scrollTop = txtArea.scrollTop;
// });
