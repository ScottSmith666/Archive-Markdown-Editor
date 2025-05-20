"use strict";

let generalItem = document.getElementById('general');
let editItem = document.getElementById('edit');
let updateItem = document.getElementById('update');

function settingsItemClickEvent(indexOfItems, ...itemsDom) {
    let shouldApplyItem = itemsDom[indexOfItems];  // 定义点击就应用style的Item
    shouldApplyItem.addEventListener('click', () => {  // 通用
        itemsDom.forEach((item) => {
            let applyClass = (item === shouldApplyItem) ? "options-items side-item-focused-for-js" : "options-items";
            let showApplyClass = (item === shouldApplyItem) ? "" : " hide-content";
            let itemDomId = item.getAttribute('id');
            item.removeAttribute("class");
            item.setAttribute("class", applyClass);
            // 设置各项对应页面内容显示
            let pageDom = document.getElementById(`settings-item-${ itemDomId }-content`);
            pageDom.removeAttribute("class");
            pageDom.setAttribute("class", `settings-item-content${ showApplyClass }`);
        });
    });
}

const closeButton = document.getElementById('close');
closeButton.addEventListener('click', () => {
    window.close();
});

// 设置菜单栏点击事件
settingsItemClickEvent(0, generalItem, editItem, updateItem);
settingsItemClickEvent(1, generalItem, editItem, updateItem);
settingsItemClickEvent(2, generalItem, editItem, updateItem);

// ---- 读取硬盘中sqlite设置，以保持设置界面的状态一致性 START ----
(async () => {
    // 自动创建内存sqlite表
    window.settings.initMemorySettings();

    // 设置表
    // ----通用----
    // 选择界面语言：lang_index: 0 || 1 || 2，0代表简体中文，1代表繁体中文，2代表English，初始化默认为0
    document.getElementById("lang_index").value = await window.settings.getLangSettings();
    // ----编辑----
    // 编辑区Tab缩进长度：editor_tab_size: <number>，初始化默认为4
    document.getElementById("editor_tab_size").value = await window.settings.getEditorTabSize();
    // 编辑区字体大小：editor_font_size: <number>，初始化默认为12
    document.getElementById("editor_font_size").value = await window.settings.getEditorFontSize();
    // 开启行号：enable_line_num: 1 || 0，1代表"on"，0代表"off"，初始化默认为1
    document.getElementById("enable_line_num").checked = ((await window.settings.getEnableLineNum()) === 1);
    // 开启代码折叠：enable_code_fold: 1 || 0，1代表true，0代表false，初始化默认为1
    document.getElementById("enable_code_fold").checked = ((await window.settings.getEnableCodeFold()) === 1);
    // 开启自动折行：enable_auto_wrap_line: 1 || 0，1代表"on"，0代表"off"，初始化默认为1
    document.getElementById("enable_auto_wrap_line").checked = ((await window.settings.getEnableAutoWrapLine()) === 1);
    // 开启自动输入闭合引号/括号和成对删除引号/括号: enable_auto_closure: 1 || 0，1代表"always"，0代表"never"，初始化默认为1
    document.getElementById("enable_auto_closure").checked = ((await window.settings.getEnableAutoClosure()) === 1);
    // 显示垂直滚动条：display_vertical_scrollbar: 0 || 1 || 2，0代表"visible"，1代表"auto"，2代表"hidden"，初始化默认为0
    document.getElementById("display_vertical_scrollbar").value = await window.settings.getDisplayVerticalScrollbar();
    // 显示水平滚动条：display_horizon_scrollbar: 0 || 1 || 2，0代表"visible"，1代表"auto"，2代表"hidden"，初始化默认为0
    document.getElementById("display_horizon_scrollbar").value = await window.settings.getDisplayHorizonScrollbar();

    // 显示代码缩略图：display_code_scale: 1 || 0，1代表true，0代表false，初始化默认为0
    document.getElementById("display_code_scale").checked = ((await window.settings.getDisplayCodeScale()) === 0);
    // 启用编辑器动画效果：display_editor_animation:  1 || 0，1代表true，0代表false，初始化默认为1
    document.getElementById("display_editor_animation").checked = ((await window.settings.getDisplayEditorAnimation()) === 1);
})();
// ---- 读取硬盘中sqlite设置，以保持设置界面的状态一致性 END ----


// ---- 设置表单监听事件，并将更改值写入内存sqlite START ----
function changeCheckButtonValue(instruction, type = "check") {
    /**
     * 将对应CheckButton的值写入内存sqlite
     */
    let buttonElement = document.getElementById(instruction);
    let settingsValue = null;
    buttonElement.addEventListener('change', (event) => {
        if (type === "check") {
            if (buttonElement.checked) settingsValue = 1;
            else settingsValue = 0;
        } else if (type === "values") {
            settingsValue = buttonElement.value;
        }
        // 将值写入内存sqlite
        window.settings.setMemorySettings(instruction, settingsValue);
    });
}

changeCheckButtonValue("lang_index");
changeCheckButtonValue("editor_tab_size");
changeCheckButtonValue("editor_font_size");
changeCheckButtonValue("enable_line_num");
changeCheckButtonValue("enable_code_fold");
changeCheckButtonValue("enable_auto_wrap_line");
changeCheckButtonValue("enable_auto_closure");
changeCheckButtonValue("display_vertical_scrollbar");
changeCheckButtonValue("display_horizon_scrollbar");
changeCheckButtonValue("display_code_scale");
changeCheckButtonValue("display_editor_animation");
// ---- 设置表单监听事件，并将更改值写入内存sqlite END ----
