let renderProcess = {
    data() {
        return {
            mdResult: [],
            windowId: null,
            windowTitle: null,
            openFilePath: null,
            openFileName: null,
            openFileContent: null,
            platform: null,
            saveStatus: true,
        }
    },
    async mounted() {
        /**
         * 等DOM加载完成后再应用
         */

        // 加载窗口Title
        document.getElementById("app-title").innerText = this.windowTitle;

        // 载入UI语言
        let editorPlaceholder = await this.loadLanguage();

        // new 快捷键事件
        window.addEventListener("keydown", function(event) {
            // 判断是否按下了Ctrl/Command键和 N 键
            if (event.ctrlKey && event.key === "n") {  // Windows
                window.openNewWindow.openNew();
            }
            if (event.metaKey && event.key === "n") {  // macOS
                window.openNewWindow.openNew();
            }
        });

        // 初始化编辑器
        require.config({paths: {vs: '../libs/third_party/monaco/min/vs'}});
        require.config({'vs/nls': {availableLanguages: {'*': 'zh-cn'}}});
        require(['vs/editor/editor.main'], async () => {
            /**
             * ---- 设置表 START ----
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
            // ---- 设置表 END ----

            // 定义自定义主题
            monaco.editor.defineTheme('myEditorTheme', {
                base: "vs",
                inherit: true,
                rules: [{background: '#f8f9fa'}],
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
                provideCompletionItems: (model, position) => {
                    return {
                        suggestions: suggestions("markdown"),
                    };
                },
            });

            // 创建Editor对象
            let editor = monaco.editor.create(document.getElementById('real-edit'), {
                value: "",
                language: "markdown",
                autoClosingBrackets: enableAutoClosure,
                autoClosingDelete: enableAutoClosure,
                autoClosingQuotes: enableAutoClosure,
                autoIndent: "advanced",
                folding: enableCodeFold,
                placeholder: editorPlaceholder,
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

            // 初始化editor value
            if (this.fileContent) editor.setValue(this.fileContent);

            // 初始化值
            this.renderChange(editor);
            // 初始化聚焦
            editor.focus();

            // Ctrl/Cmd + C快捷键
            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC,  () => {
                this.copy(editor, true);
            });
            // Ctrl/Cmd + V快捷键
            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV,  () => {
                this.mdPaste(editor);
            });
            // Ctrl/Cmd + X
            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyX,  () => {
                this.copy(editor, false);
            });
            // Ctrl/Cmd + S
            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,  () => {
                if (!this.openFileName && !this.openFilePath) this.saveFile(editor, true);
                else this.saveFile(editor);
            });
            // Ctrl/Cmd + Shift + S
            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyS,  () => {
                this.saveFile(editor, true);
            });
            // Monaco Editor内容改变事件
            editor.onDidChangeModelContent((e) => {
                // 更改标题
                document.getElementById('app-title').innerText = "(未保存) " + this.windowTitle;
                this.renderChange(editor);
                this.saveStatus = false;
                window.setSaveStatus.setSaveStatus(false);
            });
            editor.onDidScrollChange(() => {
                // 获取编辑区滚动到哪里了
                let rollProcess = (editor.getVisibleRanges()[0].startLineNumber + (editor.getVisibleRanges()[0].endLineNumber - editor.getVisibleRanges()[0].startLineNumber) / 2)
                    / (editor.getModel().getLineCount() - (editor.getVisibleRanges()[0].endLineNumber - editor.getVisibleRanges()[0].startLineNumber) / 2);

                // 相应改变渲染区滚动位置
                let getRenderAreaTotalHeight = document.getElementById("write").offsetHeight;
                let parentGetRenderAreaTotalHeight = document.querySelector(".middle-content-render");
                parentGetRenderAreaTotalHeight.scrollTo({
                    top: editor.getVisibleRanges()[0].startLineNumber !== 1 ? getRenderAreaTotalHeight * rollProcess : 0,
                    left: 0,
                    behavior: "smooth",
                });
            });

            // 编辑区右键菜单点击事件
            document.getElementById("leftMenu-cut").addEventListener('click', (e) => {
                this.copy(editor, false, true);
                this.hideAllAreaMenu(e);
            });
            document.getElementById("leftMenu-copy").addEventListener('click', (e) => {
                this.copy(editor, true, true);
                this.hideAllAreaMenu(e);
            });
            document.getElementById("leftMenu-paste").addEventListener('click', (e) => {
                this.mdPaste(editor);
                this.hideAllAreaMenu(e);
            });

            // 编辑区监听右键
            document.getElementById("editor").addEventListener('contextmenu', (e) => {
                this.showLeftAreaMenu(e);
            });
            // 渲染区监听左键
            document.getElementById("preview").addEventListener('click', (e) => {
                this.hideAllAreaMenu(e);
            });
            // 编辑区监听左键
            document.getElementById("real-edit").addEventListener('click', async (e) => {
                let swDebug = await window.swDebug.switchDebuggingMode();
                e.preventDefault();
                this.hideAllAreaMenu(e);
                if (swDebug) {
                    console.log("光标位置: ");
                    console.log(editor.getPosition());
                    console.log("选区: ");
                    console.log(window.getSelection().toString());
                }
            });

            this.mainManuHoverIn("file");
            this.mainManuHoverOut("file");

            this.mainManuHoverIn("edit");
            this.mainManuHoverOut("edit");

            this.mainManuHoverIn("view");
            this.mainManuHoverOut("view");

            this.mainManuHoverIn("help");
            this.mainManuHoverOut("help");

            document.getElementById("cnt").addEventListener('mouseenter', (e) => {
                this.mainManuAllHide("file", "edit", "view", "help");
            });

            // main menu点击事件
            // cut
            document.getElementById("main-menu-cut").addEventListener('click', (e) => {
                this.copy(editor, false, true);
                this.mainManuAllHide("file", "edit", "view", "help");
            });
            // copy
            document.getElementById("main-menu-copy").addEventListener('click', (e) => {
                this.copy(editor, true, true);
                this.mainManuAllHide("file", "edit", "view", "help");
            });
            // paste
            document.getElementById("main-menu-paste").addEventListener('click', (e) => {
                this.mdPaste(editor);
                this.mainManuAllHide("file", "edit", "view", "help");
            });
            // quit
            document.getElementById("app-quit").addEventListener('click', (e) => {
                window.qt.quit();
            });

            // save
            document.getElementById("main-menu-save").addEventListener('click', (e) => {
                if (!this.openFileName && !this.openFilePath) this.saveFile(editor, true);  // 说明是新建的文件，保存即另存为
                else this.saveFile(editor);
                this.mainManuAllHide("file", "edit", "view", "help");
            });
            // save as
            document.getElementById("main-menu-save-as").addEventListener('click', (e) => {
                this.saveFile(editor, true);
                this.mainManuAllHide("file", "edit", "view", "help");
            });

            // about
            document.getElementById("about").addEventListener("click", (e) => {
                this.mainManuAllHide("file", "edit", "view", "help");
                document.getElementById("about-modal").style.display = "block";  // 先出现
                document.styleSheets[0].insertRule(
                    `@keyframes aboutin {
                               0% {opacity: 0;}
                               100% {opacity: 1;} 
                           }`,
                    0
                );
                document.getElementById("about-modal-face").style.animation = "aboutin 0.3s ease";
            });
            // settings
            document.getElementById("settings").addEventListener("click", (e) => {
                this.mainManuAllHide("file", "edit", "view", "help");
                document.getElementById("settings-modal").style.display = "block";
            });

            // 解锁文件
            document.getElementById("unlock").addEventListener("click", async () => {
                let inputPassword = document.getElementById("file-password").value;
                this.fileContent = await window.loadFileContent.loadFileContent(this.openFilePath, inputPassword);
                if (!this.fileContent) {

                }
            });

            // 关闭解锁文件窗口
            document.getElementById("unlock-close").addEventListener("click", () => {
                window.qt.totalCloseThisWindow(this.windowId, this.openFilePath);
            });

            // about内部按钮关闭监听
            document.getElementById("confirm-button-close-about").addEventListener("click", (e) => {
                this.mainManuAllHide("file", "edit", "view", "help");
                document.styleSheets[0].insertRule(
                    `@keyframes aboutout {
                               0% {opacity: 1;}
                               100% {opacity: 0;} 
                           }`,
                    0
                );
                document.getElementById("about-modal-face").style.animation = "aboutout 0.3s ease";
                document.getElementById("about-modal").style.display = "none";  // 最后消失
            });
            // 点击about模态框其他地方关闭
            document.getElementById("about-modal-surface").addEventListener("click", (e) => {
                document.styleSheets[0].insertRule(
                    `@keyframes aboutout {
                               0% {opacity: 1;}
                               100% {opacity: 0;} 
                           }`,
                    0
                );
                document.getElementById("about-modal-face").style.animation = "aboutout 0.3s ease";
                document.getElementById("about-modal").style.display = "none";  // 最后消失
            });

            // settings内部其他事件
            let generalItem = document.getElementById('general');
            let editItem = document.getElementById('set-edit');
            let updateItem = document.getElementById('update');

            // 初始化更改设置列表
            let changeSettingsList = [];

            function settingsItemClickEvent(indexOfItems, ...itemsDom) {
                let shouldApplyItem = itemsDom[indexOfItems];  // 定义点击就应用style的Item
                shouldApplyItem.addEventListener('click', () => {  // 通用
                    itemsDom.forEach((item) => {
                        console.log(item);
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

            // 设置菜单栏点击事件
            settingsItemClickEvent(0, generalItem, editItem, updateItem);
            settingsItemClickEvent(1, generalItem, editItem, updateItem);
            settingsItemClickEvent(2, generalItem, editItem, updateItem);

            // ---- 读取硬盘中sqlite设置，以保持设置界面的状态一致性 START ----
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
            document.getElementById("display_code_scale").checked = ((await window.settings.getDisplayCodeScale()) === 1);
            // 启用编辑器动画效果：display_editor_animation:  1 || 0，1代表true，0代表false，初始化默认为1
            document.getElementById("display_editor_animation").checked = ((await window.settings.getDisplayEditorAnimation()) === 1);
            // ---- 读取硬盘中sqlite设置，以保持设置界面的状态一致性 END ----

            // ---- 设置表单监听事件，并将更改值写入list ----
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
                    // 将值写入更改列表
                    // 检查列表内是否已有instruction
                    let canUseInsert = true;
                    for (let i = 0; i < changeSettingsList.length; i++) {
                        if (instruction === changeSettingsList[i].instructions) {
                            changeSettingsList[i].settings_value = settingsValue;
                            canUseInsert = false;
                            break;
                        }
                    }
                    if (canUseInsert) changeSettingsList.push({
                        "instructions": instruction,
                        "settings_value": settingsValue,
                    });
                });
            }

            changeCheckButtonValue("lang_index", "values");
            changeCheckButtonValue("editor_tab_size", "values");
            changeCheckButtonValue("editor_font_size", "values");
            changeCheckButtonValue("enable_line_num");
            changeCheckButtonValue("enable_code_fold");
            changeCheckButtonValue("enable_auto_wrap_line");
            changeCheckButtonValue("enable_auto_closure");
            changeCheckButtonValue("display_vertical_scrollbar", "values");
            changeCheckButtonValue("display_horizon_scrollbar", "values");
            changeCheckButtonValue("display_code_scale");
            changeCheckButtonValue("display_editor_animation");
            // ---- 设置表单监听事件，并将更改值写入内存sqlite END ----

            // 应用更改
            document.getElementById("apply").addEventListener("click", async () => {
                if ((await window.settings.getSettingsConfirmOption(changeSettingsList)))
                    window.settings.reloadSettings();
            });
            // 取消应用更改
            document.getElementById("settings-close").addEventListener("click", async () => {
                if (changeSettingsList.length !== 0) {
                    let confirmClose = await window.settings.getSettingsCancelOption();
                    if (confirmClose) {
                        changeSettingsList = [];  // 关闭页面时清除临时列表中的内容
                        document.getElementById("settings-modal").style.display = "none";
                    }
                } else document.getElementById("settings-modal").style.display = "none";
            });
            // 重置设置
            document.getElementById("reset").addEventListener("click", async () => {
                if ((await window.settings.getSettingsResetOption())) window.settings.reloadSettings();
            });
        });
    },
    methods: {
        mainManuHoverIn(id) {
            // 先初始化菜单栏下拉
            let menuUnit = document.getElementById(id);
            menuUnit.addEventListener('mouseenter', (evt) => {
                this.mainManuAllHide("file", "edit", "view", "help");
                document.getElementById(`${ id }-expand`).style.display = 'block';
            });
        },
        mainManuHoverOut(id) {
            let menuExpandUnit = document.getElementById(`${ id }-expand`);
            menuExpandUnit.addEventListener('mouseleave', (evt) => {
                document.getElementById(`${ id }-expand`).style.display = 'none';
            });
        },
        mainManuAllHide(...ids) {
            for (let id of ids) {
                document.getElementById(`${ id }-expand`).style.display = 'none';
            }
        },
        copy(monacoEditorObj, keep, rightMenuNeed = false) {

            let editorAreaHasFocus = monacoEditorObj.hasTextFocus();  // 编辑器是否聚焦

            if (rightMenuNeed) {
                monacoEditorObj.focus();
                editorAreaHasFocus = monacoEditorObj.hasTextFocus();
            }

            // Editor获得选区内容
            let editorSelectionContent = editorAreaHasFocus ? monacoEditorObj.getModel().getValueInRange(monacoEditorObj.getSelection())
                : window.getSelection().toString();
            navigator.clipboard.writeText(editorSelectionContent).then(() => {
            }).catch((error) => {
                console.error("复制失败: ", error);
            });
            // 如果是剪贴(keep = false)，则将指定位置的字符串替换成空字符串，实现剪切效果
            if (!keep) {
                let selection = monacoEditorObj.getSelection();
                monacoEditorObj.executeEdits("number-scrubber",
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
        },
        mdPaste(editor) {
            // 获得光标位置
            let selection = editor.getSelection();
            navigator.clipboard.readText().then((content) => {
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
                // 聚焦
                editor.focus();
            }).catch((error) => {
                console.error("粘贴失败: ", error);
            });
        },
        async saveFile(editor, saveAs = false) {
            /**
             * 保存文件
             */
            let afterSave = [true, true];
            if (!saveAs) {
                // 已存在的文件更改后的保存
                let autoSaveResult = await window.save.autoSaveFile(editor.getValue(), this.openFilePath);
                if (autoSaveResult) {
                    const currentUrl = new URL(window.location.href);
                    window.location.href = currentUrl.toString();  // 重定向到新 URL
                    window.setSaveStatus.setSaveStatus(true);
                }
                return 0;
            } else {
                // 新建文件编辑后保存，fullPath为false
                afterSave = await window.save.customSaveFile(editor.getValue(), this.openFilePath);
            }

            if (afterSave[1]) {  // 如果另存为之后返回的列表第二个元素（代表文件路径）为undefined，则不设置保存成功标记
                // 设置保存状态
                window.setSaveStatus.setSaveStatus(true);
                if (saveAs) {
                    window.loadFileContent.openFileInNewWindow(afterSave[1]);
                    window.qt.closeThisWindow(this.windowId);
                }
            }
        },

        renderChange(editor) {
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
            // let presentLineProp = editor.getPosition().lineNumber / editor.getModel().getLineCount();

            // 渲染Markdown
            // 获得当前编辑的整个Markdown文档的抽象语法树
            this.$data.mdResult = marked.lexer(newEditorValue);

            // 使渲染区滚动到相应位置
            // let getRenderAreaTotalHeight = document.getElementById("write").offsetHeight;
            // let parentGetRenderAreaTotalHeight = document.querySelector(".middle-content-render");
            // parentGetRenderAreaTotalHeight.scrollTo({
            //     top: getRenderAreaTotalHeight * presentLineProp,
            //     left: 0,
            //     behavior: "instant",
            // });
            this.afterPage();
        },

        async afterPage() {
            this.$nextTick(() => {  // 等所有页面加载完成
                // 重新渲染mermaid
                mde.mermaid.run({
                    querySelector: '.mermaid',
                });
                // 重新渲染prism
                this.prism();
                // 重新渲染mathjax
                document.getElementById("MathJax-script").setAttribute(
                    "src", "../libs/third_party/MathJax/es5/tex-svg-full.js");
                MathJax.typesetPromise();
            });
        },

        renderExecute(tree) {
            return marked.parser([tree]);
        },

        prism() {
            // 渲染区代码高亮
            Prism.highlightAll();
        },

        // 渲染语言
        async loadLanguage() {
            let leftObj = document.getElementById('leftMenu');
            let renderTxt = document.getElementById("plh-render");
            let presentLangIndex = await window.settings.getLangSettings();
            let rightMenu = await window.userSurface.getRightMenuSurface();
            let renderPlaceholder = await window.userSurface.getRenderPlaceholderSurface();
            let editorPlaceholder = await window.userSurface.getEditorPlaceholderSurface();

            // Edit&Render placeholder language
            let ePlaceholder = editorPlaceholder[presentLangIndex];
            renderTxt.innerText = renderPlaceholder[presentLangIndex];

            // Right menu language
            // Edit area right menu
            leftObj.children[0].children[0].innerHTML = "&nbsp;&nbsp;&nbsp;" + rightMenu[presentLangIndex][0];
            leftObj.children[1].children[0].innerHTML = "&nbsp;&nbsp;&nbsp;" + rightMenu[presentLangIndex][1];
            leftObj.children[2].children[0].innerHTML = "&nbsp;&nbsp;&nbsp;" + rightMenu[presentLangIndex][2];

            return ePlaceholder;
        },

        showLeftAreaMenu(event) {
            /**
             * 定义编辑区右键菜单行为
             * @type {HTMLElement}
             */
            let leftObj = document.getElementById('leftMenu');
            event.preventDefault(); //关闭浏览器右键默认事件
            let menuHeight = 120;
            let menuWidth = 200;
            leftObj.style.left = (event.clientX + menuWidth) <= (document.body.clientWidth / 2 - 20)
                ? (event.clientX - 20) + 'px' : (document.body.clientWidth / 2 - 40 - menuWidth) + 'px';
            leftObj.style.top = (event.clientY + menuHeight + 30) <= document.body.clientHeight
                ? (event.clientY - 20 - 30) + 'px' : (document.body.clientHeight - menuHeight - 60 - 30) + 'px';

            leftObj.style.display = "block";
            setTimeout(() => {
                leftObj.style.opacity = 1;
            }, 200);
        },

        hideAllAreaMenu(event) {
            /**
             * 左键点击关闭所有右键菜单
             * @type {HTMLElement}
             */
            let leftObj = document.getElementById('leftMenu');
            event.preventDefault();
            leftObj.style.opacity = 0;
            setTimeout(() => {
                leftObj.style.display = "none";
            }, 200);
        },
    },
    async created() {
        // 获得本窗口唯一ID
        const queryParams = new URLSearchParams(window.location.search);
        this.windowId = queryParams.get('windowId');
        let platform = queryParams.get('platform');
        this.platform = platform;
        let openFileName = queryParams.get('name') !== '' ? queryParams.get('name') : false;
        this.openFileName = openFileName;
        // 获得相应窗口title
        this.windowTitle = !openFileName ? `Archive Markdown Editor - Untitled ${ this.windowId - 1 }` : `Archive Markdown Editor - ${ openFileName }`;
        // 获得打开的文件路径
        let openFilePath = queryParams.get('path') !== '' ? queryParams.get('path') : false;
        this.openFilePath = openFilePath;

        // 验证路径下的文件是否存在，如不存在则提醒
        if (openFilePath && !(await window.loadFileContent.verifyFileExists(openFilePath))) {
            alert(`文件“${ openFilePath }”不存在，无法打开！`);
            window.qt.closeThisWindow(this.windowId);
        }

        // 验证文件名是否合法，如不合法则禁止打开
        if (openFilePath && !(await window.loadFileContent.verifyFileNameValid(openFilePath))) {
            alert(`文件名包含非法字符，或者文件所处路径内含有空格，请修改文件名或将文件移至其他路径再尝试打开！`);
            window.qt.closeThisWindow(this.windowId);
        }

        // 加载文件内容
        if ((await window.loadFileContent.verifyFileIsOpen(openFilePath))) {
            alert(`文件“${ openFilePath }”已打开，请勿再次打开！`);
            window.qt.closeThisWindow(this.windowId);
        } else {
            console.log(openFilePath.split(".").pop());
            if (openFilePath.split(".").pop() === "mdz") {
                this.fileContent = await window.loadFileContent.loadFileContent(openFilePath, "");
                if (!this.fileContent) {
                    document.getElementById("unlock-modal").style.display = "block";
                }
            } else this.fileContent = openFilePath ? (await window.loadFileContent.loadFileContent(openFilePath, "")) : false;
        }

        window.setSaveStatus.setSaveStatus(true);  // 初始化本页面保存状态为true

        const KIND_OF_TIPS_FOR_COLORS_SVGS = {
            "tip": '<span class="md-alert-text md-alert-text-tip"><svg viewBox="0 0 16 16" version="1.1" width="1em" height="1em" aria-hidden="true"><path d="M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 0 1-1.484.211c-.04-.282-.163-.547-.37-.847a8.456 8.456 0 0 0-.542-.68c-.084-.1-.173-.205-.268-.32C3.201 7.75 2.5 6.766 2.5 5.25 2.5 2.31 4.863 0 8 0s5.5 2.31 5.5 5.25c0 1.516-.701 2.5-1.328 3.259-.095.115-.184.22-.268.319-.207.245-.383.453-.541.681-.208.3-.33.565-.37.847a.751.751 0 0 1-1.485-.212c.084-.593.337-1.078.621-1.489.203-.292.45-.584.673-.848.075-.088.147-.173.213-.253.561-.679.985-1.32.985-2.304 0-2.06-1.637-3.75-4-3.75ZM5.75 12h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5ZM6 15.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z"></path></svg>Tip</span>',
            "important": '<span class="md-alert-text md-alert-text-important"><svg viewBox="0 0 16 16" version="1.1" width="1em" height="1em" aria-hidden="true"><path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H8.06l-2.573 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path></svg>Important</span>',
            "note": '<span class="md-alert-text md-alert-text-note"><svg viewBox="0 0 16 16" version="1.1" width="1em" height="1em" aria-hidden="true"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path></svg>Note</span>',
            "warning": '<span class="md-alert-text md-alert-text-warning"><svg viewBox="0 0 16 16" version="1.1" width="1em" height="1em" aria-hidden="true"><path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path></svg>Warning</span>',
            "caution": '<span class="md-alert-text md-alert-text-caution"><svg viewBox="0 0 16 16" version="1.1" width="1em" height="1em" aria-hidden="true"><path d="M4.47.22A.749.749 0 0 1 5 0h6c.199 0 .389.079.53.22l4.25 4.25c.141.14.22.331.22.53v6a.749.749 0 0 1-.22.53l-4.25 4.25A.749.749 0 0 1 11 16H5a.749.749 0 0 1-.53-.22L.22 11.53A.749.749 0 0 1 0 11V5c0-.199.079-.389.22-.53Zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5ZM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path></svg>Caution</span>',
        };

        function getAbsoluteMediaPath(platform, originFilePath, originMediaPath) {
            /**
             * 根据Markdown媒体文件的相对路径生成绝对路径
             * 参数“mdz”：确认是否为mdz文件，以启用不同的路径转化
             * 要求：相对路径开头必须包括“./”或“../”
             */
            let sep = (platform === 'win32') ? '\\' : '/';
            let filePathList = originFilePath ? originFilePath.split(sep) : [];
            let fullFileName = filePathList.pop();  // 取出列表最后一个元素，即文件名
            let fileNameList = originFilePath ? fullFileName.split(".") : [];
            fileNameList.pop();  // 去掉扩展名元素
            let fileName = fileNameList.join(".");
            let rootPath = filePathList.join(sep);

            if (/(\.|\.\.)(\/|\\)(\S|\s)+/.test(originMediaPath)) {  // 如果是相对路径（必须以“./” “../” “.\” “..\”开头）
                if (!originFilePath) return false;  // 未保存文件，无法使用相对路径引用多媒体
                return rootPath + sep + originMediaPath;
            }

            if (/(\$MDZ_MEDIA\/)(\S|\s)+/.test(originMediaPath))   // 如果是mdz文件引用媒体（形如“$MDZ_MEDIA/test.jpg”）
                return rootPath + sep + "._mdz_content." + fileName + sep + "mdz_contents" + sep + "media_src" + sep + originMediaPath.split("/").pop();
            return originMediaPath;
        }

        const escapeReplacements = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
        };
        const getEscapeReplacement = (ch) => escapeReplacements[ch];

        function escape(html, encode) {
            if (encode) {
                if (/[&<>"']/.test(html)) {
                    return html.replace(/[&<>"']/g, getEscapeReplacement);
                }
            } else {
                if (/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/.test(html)) {
                    return html.replace(/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, getEscapeReplacement);
                }
            }
            return html;
        }

        function cleanUrl(href) {
            try {
                href = encodeURI(href).replace(/%25/g, '%');
            } catch {
                return null;
            }
            return href;
        }

        marked.use({
            renderer: {
                // 修改默认输出HTML，实现扩展语法
                // mermaid图形
                code({text, lang, escaped}) {
                    const langString = (lang || '').match(/^\S*/)?.[0];
                    const code = text.replace(/\n$/, '') + '\n';
                    if (!langString) {
                        return '<pre><code>'
                            + (escaped ? code : escape(code, true))
                            + '</code></pre>\n';
                    } else if (langString === 'mermaid') {  // mermaid图形
                        return `<div class="mermaid">
                        ${(escaped ? code : escape(code, true))}
                    </div>`;
                    }
                    return '<pre><code class="language-'
                        + escape(langString)
                        + '">'
                        + (escaped ? code : escape(code, true))
                        + '</code></pre>\n';
                },

                // 自定义提示、警告blockquote
                blockquote({tokens}) {
                    let body = this.parser.parse(tokens);
                    let bodyList = body.split("\n");
                    // 获得第一行的特征值
                    let specify = bodyList[0].replace("<p>[!", "").replace("]</p>", "");
                    if (["tip", "important", "note", "warning", "caution"].includes(specify)) {
                        bodyList.splice(0, 1);
                        body = `<p>${KIND_OF_TIPS_FOR_COLORS_SVGS[specify]}</p>\n` + bodyList.join("\n");
                        return `<blockquote class="md-alert md-alert-${specify} ${specify}">\n${body}</blockquote>\n`;
                    }
                    return `<blockquote>\n${body}</blockquote>\n`;
                },

                // 支持音视频
                image({href, title, text, tokens}) {
                    if (tokens) {
                        text = this.parser.parseInline(tokens, this.parser.textRenderer);  // “![]”内的字符
                    }
                    if (!(/(http\:\/\/)(\S|\s)+/.test(href) || /(https\:\/\/)(\S|\s)+/.test(href))) {
                        href = getAbsoluteMediaPath(platform, openFilePath, href);
                        href = href.replaceAll('\\', '/');  // 如果不是URL，且包含反斜杠（普通文件名里面基本没这个符号，可以放心全部替换），说明是Windows文件路径，将其替换成正斜杠
                        if (!href) return `<p style="color: red; font-weight: bold;">错误：未保存文件，无法使用相对路径引用多媒体！</p>`
                    }
                    let cleanHref = cleanUrl(href);  // 多媒体链接（URL或文件路径）
                    if (cleanHref === null) {
                        return escape(text);
                    }
                    href = cleanHref;
                    let out = `<img src="${href}" alt="${text}"`;
                    if (title) {
                        out += ` title="${escape(title)}"`;
                    }
                    out += '>';
                    if (/(\$\{)(\S+)(\})(:)([\S|\s]*)/.test(text)) {  // 匹配指定多媒体的字符格式
                        let identifierRegObj = /(\$\{)(\S+)(\})(:)([\S|\s]*)/.exec(text);
                        let fileKind = identifierRegObj[2];
                        let note = identifierRegObj[4];
                        if (fileKind === "video") {
                            return `<video controls><source src="${href}"></video>`;
                        } else if (fileKind === "audio") {
                            return `<audio style="width: 100%;" controls src="${href}"></audio>`;
                        }
                        // else if (fileKind in ["docx", "xlsx", "pptx"]) {
                        //
                        // }
                        // 后续版本再考虑加上别的文档文件，首先解决文件安全性问题
                        // else if (fileKind === "pdf") {
                        //     out.innerHTML += ``;
                        //     return out;
                        // } else if (fileKind === "compressed") {
                        //     out.innerHTML += ``;
                        //     return out;
                        // }
                    }
                    return out;
                },

                // 链接可在electron中点击
                link({href, title, tokens}) {
                    const text = this.parser.parseInline(tokens);
                    const cleanHref = cleanUrl(href);
                    if (cleanHref === null) {
                        return text;
                    }
                    href = cleanHref;
                    let func = `window.openOutLink.openLink('${href}');`;
                    let out = `<a onclick="${func}" href="' + href + '"`;
                    if (title) {
                        out += ' title="' + (escape(title)) + '"';
                    }
                    out += '>' + text + '</a>';
                    return out;
                }
            }
        });
    }
};
