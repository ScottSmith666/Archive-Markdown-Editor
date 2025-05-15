const { app } = require("electron");


function LanguageLocale() {
    this.languageObject = [
            {
                "description": "中文（简体）",
            }, {
                "description": "中文（繁體）",
            }, {
                "description": "English",
            }
    ];

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
        "menu": {
            // Menu 1
            "about": ["关于" + app.name + "...", "關於" + app.name + "...", "About " + app.name + "..."],
            "settings": ["设置...", "設定...", "Settings..."],
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
            "theme": ["主题", "主題", "Theme"],
            "lightMode": ["明亮", "明亮", "Light Mode"],
            "darkMode": ["暗黑", "暗黑", "Dark Mode"],

            // Menu 5
            "help": ["帮助", "幫助", "Help"],
            "moreInfo": ["了解更多...", "瞭解更多...", "More Info..."],
            "donate": ["捐赠给Scott Smith...", "捐贈給Scott Smith...", "Donate To Scott Smith..."],

            // Language switch confirm dialog
            "LangSwitchConfirmDialog": [
                {
                    "title": "切换语言",
                    "description": "您已切换至" + args[0] + "，请重启以应用该语言，确定要重启吗？",
                    "buttons": ["暂时不要", "确定"],
                },
                {
                    "title": "切換語言",
                    "description": "您已切換至" + args[0] + "，請重啟以應用該語言，確定要重新啟動嗎？",
                    "buttons": ["暫時不要", "確認"],
                },
                {
                    "title": "Switch Language",
                    "description": "You have switched to " + args[0] + ". Please restart app to apply this language. Are you sure you want to restart?",
                    "buttons": ["Not Now", "Switch Now"],
                },
            ],
            "LangNoNeedSwitchDialog": [
                {
                    "title": "切换语言",
                    "description": "您的语言已是" + args[0] + "，无需切换。",
                    "buttons": ["确定"],
                },
                {
                    "title": "切換語言",
                    "description": "您的語言已是" + args[0] + "，無需切換。",
                    "buttons": ["確認"],
                },
                {
                    "title": "Switch Language",
                    "description": "Your language is already " + args[0] + ", so there is no need to switch.",
                    "buttons": ["OK"],
                },
            ],

            // about窗口
            "aboutDialog": [
                {
                    "description": "一款简易美观，功能强大的Markdown编辑器。",
                    "credit": "鸣谢开源项目",
                    "contact": "有事请联系",
                    "github": "项目地址",
                    "button": "确定",
                },
                {
                    "description": "一款簡易美觀，功能強大的Markdown編輯器。",
                    "credit": "鳴謝開源項目",
                    "contact": "有事請聯絡",
                    "github": "項目地址",
                    "button": "確認",
                },
                {
                    "description": "A simple, beautiful and powerful Markdown editor.",
                    "credit": "Credit",
                    "contact": "Contact E-mail",
                    "github": " project URL",
                    "button": "OK",
                },
            ],
        },
    });
}

module.exports = LanguageLocale;
