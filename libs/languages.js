"use strict";

const { app } = require("electron");


function LanguageLocale() {
    // [简体中文, 繁体中文, English] 该列表的index对应语言类型
    this.operationsInstructions = (...args) => ({
        "display": {
            "index": {
                // AME主界面placeholder
                "markdownEditPlaceholder": ["请在此处键入Markdown...", "請在此鍵入Markdown...", "Insert Markdown Here..."],
                "markdownRenderPlaceholder": ["Markdown渲染区", "Markdown渲染區", "Markdown Rendering Area"],
                // AME主界面右键菜单
                "markdownEditRightMenu": [
                    ["剪切", "复制", "粘贴"],
                    ["剪切", "拷貝", "貼上"],
                    ["Cut", "Copy", "Paste"]
                ],
                "markdownRenderRightMenu": [
                    ["复制"],
                    ["拷貝"],
                    ["Copy"]
                ],
            }
        },
        "index": {
            "new": ["新建文件...", "新建文件...", "New File..."],
            "open": ["打开文件...", "開啟文件...", "Open File..."],
            "quit": ["退出Archive Markdown Editor", "退出Archive Markdown Editor", "Quit AME"],
            "history": ["历史记录", "歷史記錄", "History"],
            "clear": ["清空", "清空", "Clear"],
            "emptyHistoryPrompt": ["曾打开的文件将显示于此处。", "曾開啟的文件將顯示於此。", "Files that have been opened will be displayed here."],
        },
        "menu": {
            // Menu 1
            "about": ["关于" + app.name + "...", "關於" + app.name + "...", "About " + app.name + "..."],
            "settings": ["首选项...", "設定...", "Settings..."],
            "quit": ["退出", "退出", "Quit"],

            // Menu 2
            "file": ["文件", "文件", "File"],
            "new": ["新建...", "新建...", "New..."],
            "open": ["打开...", "打開...", "Open..."],
            "save": ["保存", "儲存", "Save"],
            "saveAs": ["另存为...", "另存為...", "Save As..."],
            "export": ["导出...", "匯出...", "Export..."],
            "language": ["切换界面语言", "切換介面語言", "Switch Interface Language"],

            // Menu 3
            "edit": ["编辑", "編輯", "Edit"],
            "import": ["插入...", "導入...", "Import..."],
            "cut": ["剪切", "剪切", "Cut"],
            "copy": ["复制", "拷貝", "Copy"],
            "paste": ["粘贴", "貼上", "Paste"],

            // Menu 4
            "view": ["视图", "視圖", "View"],
            "theme": ["主题", "主題", "Theme"],
            "lightMode": ["明亮", "明亮", "Light Mode"],
            "darkMode": ["暗黑", "暗黑", "Dark Mode"],
            "mode": ["模式", "模式", "Mode"],
            "viewMode": ["预览模式", "預覽模式", "View Mode"],
            "editMode": ["编辑模式", "編輯模式", "Edit Mode"],
            "mixMode": ["混合模式", "混合模式", " Mix Mode"],

            // Menu 5
            "help": ["帮助", "幫助", "Help"],
            "moreInfo": ["了解更多...", "瞭解更多...", "More Info..."],

            // Menu 6
            "donate": ["打赏", "打賞", "Donate"],
            "donateToSS": ["打赏给Scott Smith...", "打賞給Scott Smith...", "Donate To Scott Smith..."],

            // set password surface
            "SetPasswordSurface": {
                "title": ["设定密码", "設定密碼", "Set Password"],
                "infoExplain": [
                    "1. 该界面设置的密码仅在保存为mdz文件时有效。<br>2. 如您在保存文件时不想设置密码，请不要在密码框填写任何内容，直接点“继续”按钮即可。",
                    "1. 此介面設定的密碼僅在儲存為mdz檔案時有效。<br>2. 如您在儲存檔案時不想設定密碼，請不要在密碼框填寫任何內容，直接點「繼續」按鈕即可。",
                    "1. The password set on this interface is only valid when saving as an .mdz file. <br>2. If you do not want to set a password when saving the file, please do not enter anything in the password box and simply click the \"Continue\" button."
                ],
                "fatalErrorExplain": [
                    "特别注意：请自行妥善保存您设置的密码，Archive Markdown Editor不会以任何形式保存任何mdz文件的密码，一旦密码丢失将无法找回！",
                    "特別注意：請自行妥善保存您設定的密碼，Archive Markdown Editor不會以任何形式保存任何mdz檔案的密碼，一旦密碼遺失將無法找回！",
                    "WARNING: Please keep your password safe. Archive Markdown Editor does not save the password of any mdz file in any form, and once the password is lost, it cannot be recovered!",
                ],
                "placeholder1": ["输入密码", "輸入密碼", "Enter password"],
                "placeholder2": ["再次输入密码", "再次輸入密碼", "Enter password again"],
                "buttonContinue": ["继续", "繼續", "Continue"],
                "buttonCancel": ["取消", "取消", "Cancel"],
            },

            // need password prompt
            "NeedPasswordPrompt": {
                "title": ["解锁文件", "解鎖文件", "Unlock File"],
                "explain": [
                    "本文件受密码保护，请输入正确密码以解锁文件",
                    "本文件受密碼保護，請輸入正確密碼解鎖文件",
                    "This file is protected. Please enter the correct password."
                ],
                "buttonUnlock": ["解锁", "解鎖", "Unlock"],
                "buttonClose": ["关闭", "關閉", "Close"],
            },

            // settings
            "Settings": {
                "settingsTitle": ["首选项", "設定", "Settings"],
                "settingsItem1": ["通用", "一般", "General"],
                "settingsItem2": ["编辑", "編輯", "Edit"],
                "settingsItem3": ["更新", "更新", "Update"],
                "settingsItem11": ["选择界面语言", "選擇介面語言", "Select Display Language"],
                "settingsItem21": ["编辑区Tab缩进长度", "編輯區Tab縮排長度", "Tab Size"],
                "settingsItem22": ["编辑区字体大小", "編輯區字體大小", "Font Size"],
                "settingsItem23": ["开启行号", "開啟行號", "Line Numbers"],
                "settingsItem24": ["开启代码折叠", "開啟程式碼折疊", "Code Folding"],
                "settingsItem25": ["开启自动折行", "開啟自動折行", "Line Wrapping"],
                "settingsItem26": [
                    "开启输入自动闭合引号/括号和成对删除引号/括号",
                    "開啟輸入自動閉合引號/括號和成對刪除引號/括號",
                    "Automatic Closing of Quotes/Parentheses",
                ],
                "settingsItem27": ["显示垂直滚动条", "顯示垂直捲軸", "Vertical Scroll Bar"],
                "settingsItem271": ["显示", "顯示", "Show"],
                "settingsItem272": ["自动显示/隐藏", "自動顯示/隱藏", "Auto"],
                "settingsItem273": ["隐藏", "隱藏", "Hide"],
                "settingsItem28": ["显示水平滚动条", "顯示水平捲軸", "Horizontal Scroll Bar"],
                "settingsItem281": ["显示", "顯示", "Show"],
                "settingsItem282": ["自动显示/隐藏", "自動顯示/隱藏", "Auto"],
                "settingsItem283": ["隐藏", "隱藏", "Hide"],
                "settingsItem29": ["显示代码缩略图", "顯示程式碼縮圖", "Code Thumbnail"],
                "settingsItem210": ["启用编辑器动画效果", "啟用編輯器動畫效果", "Editor Animation Effects"],
                "settingsItem31": ["检查更新", "檢查更新", "Check for Updates"],
                "settingsItem311": ["当前版本：", "目前版本：", "Current Version: "],
                "settingsApply": ["应用更改", "應用變更", "Apply Changes"],
                "settingsCancel": ["取消", "取消", "Cancel"],
                "settingsReset": ["重置设置", "重置設定", "Reset"],
            },

            "About": {
                "aboutVersionText": ["版本", "版本", "Version"],
                "description": [
                    "一款简约美观、功能强大的Markdown编辑器。",
                    "一款簡約美觀、功能強大的Markdown編輯器。",
                    "A simple, beautiful, and powerful Markdown editor.",
                ],
                "credits": ["鸣谢开源项目", "鳴謝開源項目", "Credits"],
                "contact": ["有事请联系", "有事請聯絡", "Contact"],
                "github": ["GitHub项目地址", "GitHub專案地址", "GitHub"],
                "confirm": ["确定", "確認", "Close"],
            },
        },
        "prompts": {
            "saveAs": {
                "saveTitle": ["保存文件", "儲存檔案", "Save As"],
                "errorTooLongSaveTitle": ["文件名太长，请重新修改！", "檔案名稱太長，請重新修改！", "The filename is too long!"],
                "errorInvalidCharsSaveTitle": ["文件名有空格等非法字符，请重新修改！", "檔案名稱有空格等非法字符，請重新修改！", "The filename contains spaces or other illegal characters!"],
            },
            "open": ["打开文件", "開啟文件", "Open File"],
            "confirmSaved": {
                "cancelButton": ["取消", "取消", "Cancel"],
                "confirmButton": ["确定", "確認", "Confirm"],
                "confirmTitle": ["确认关闭", "確認關閉", "Confirm Close"],
                "confirmDescription": [
                    "您有项目未保存，如果直接关闭，当前进度将不会保存，确认要直接关闭吗？",
                    "您有項目未儲存，如果直接關閉，當前進度將不會儲存，確認要直接關閉嗎？",
                    "You have unsaved items. If you close this window now, your current progress will not be saved. Are you sure you want to close this window now?"
                ],
            },
            "confirmWithoutApplySettings": {
                "cancelButton": ["不关闭", "不關閉", "Don't Close"],
                "confirmButton": ["关闭", "關閉", "Close"],
                "title": ["设置未应用", "設定未套用", "Changes are not applied"],
                "description": [
                    "您有设置未应用，要直接关闭“设置”窗口吗？如选择“关闭”，改动将不会应用。",
                    "您有設定未套用，要直接關閉「設定」視窗嗎？如選擇“關閉”，變更將不會套用。",
                    "Do you want to close the \"Settings\" window directly? If you select \"Close,\" the changes will not be applied.",
                ],
            },
            "confirmApplySettings": {
                "cancelButton": ["取消", "取消", "Cancel"],
                "confirmButton": ["应用", "套用", "Apply"],
                "title": ["确认应用", "確認套用", "Confirm"],
                "description": [
                    "您确定应用刚才更改的设置吗？如选择“应用”，程序将重新启动，请注意保存您的数据。",
                    "您確定套用剛才變更的設定嗎？如選擇「應用」，程式將重新啟動，請注意保存您的資料。",
                    "Are you sure you want to apply the settings you just changed? If you select \"Apply\", the program will restart. Please remember to save your data.",
                ],
            },
            "confirmNeedNotSettings": {
                "confirmButton": ["确定", "確認", "Confirm"],
                "title": ["应用提示", "套用提示", "Notification"],
                "description": [
                    "您未更改任何设置，无需进行应用。",
                    "您未更改任何設置，無需進行套用。",
                    "You haven't changed any settings, so there's no need to apply them.",
                ],
            },
            "confirmResetSettings": {
                "cancelButton": ["取消", "取消", "Cancel"],
                "confirmButton": ["重置", "重置", "Reset"],
                "title": ["确认重置", "確認重置", "Confirm"],
                "description": [
                    "您确定重置本程序的所有设置吗？",
                    "您確定重置本程式的所有設定嗎？",
                    "Are you sure you want to reset all settings for this program?",
                ],
            }
        },
    });
}

module.exports = LanguageLocale;
