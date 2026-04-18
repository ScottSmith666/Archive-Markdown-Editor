export const i18n = {
    state: () => {
        return {
            langPackage: {
                "zh-CN": {
                    "menuBar": {
                        "file": {
                            'mainCaption': '文件',
                            'subCaptions': {
                                "new": '新建...',
                                "open": '打开...',
                                "save": '保存',
                                "saveAs": '另存为...',
                                "close": '关闭',
                                "exitAME": '退出AME',
                            },
                        },
                        "edit": {
                            'mainCaption': '编辑',
                            'subCaptions': {
                                "settings": '设置...',
                            },
                        },
                        "view": {
                            'mainCaption': '视图',
                            'subCaptions': {
                                "viewMode": '预览模式',
                                "editMode": '编辑模式',
                                "mixMode": '混合模式',
                            },
                        },
                        "help": {
                            'mainCaption': '帮助',
                            'subCaptions': {
                                "welcome": '欢迎...',
                                "about": '关于AME...',
                                "usage": 'AME使用指南...',
                                "syntax": 'Markdown语法学习...',
                                "donate": '打赏...',
                                "officialSite": '官方网站...',
                            },
                        },
                    },
                    "tabBar": {
                        "welcome": '欢迎',
                        "settings": '设置',
                        "about": '关于AME',
                        "usage": 'AME使用指南',
                        "syntax": 'Markdown语法学习',
                        "untitled": '无标题文档',
                    },
                    "contextMenu": {
                        "inViewer": {
                            "copy": '复制',
                        },
                        "inEditor": {
                            "undo": '撤销',
                            "redo": '重做',
                        },
                    },
                    "dialog": {
                        "activeTip": {
                            "userCancelOpen": '用户已取消打开文件',
                            "repeatOpenForbidden": '禁止重复打开已打开的文件',
                            "forbiddenCharsInFileName": '文件名内有非法字符 > < : \' | * ?',
                            "unsupportedFileType": '不支持打开这种类型的文件',
                            "fileNotFound": '无法打开不存在的文件',
                            "cancelPasswordInput": '用户已取消输入密码',
                            "saveFailed": '保存失败，请马上直接关闭文件以回滚到您上次保存的状态',
                        },
                        "loading": {
                            "open": '正在打开文件...',
                            "save": '正在保存...',
                        },
                        "openEncMdzPasswordRequired": {
                            "title": '输入密码',
                            "wrongPasswordTitle": '密码错误，请重试',
                            "description": '此文件已加密，需要输入密码查看内容',
                        },
                        "systemDialogOpenFile": '打开文件',
                        "systemDialogChoosePath": {
                            "title": '选择保存路径',
                            "confirmButton": '确定',
                        },
                        "systemDialogSaveMedia": '保存mdz内嵌媒体文件',
                        "saveAs": {
                            "title": '另存为',
                            "saveNamePlaceholder": '保存文件名',
                            "selectOptions": {
                                "mdz": 'Archive MD文件（*.mdz）',
                                "md": 'Markdown文件（*.md）',
                                "txt": '文本文件（*.txt）',
                            },
                            "savePathPlaceholder": '保存路径',
                            "savePathChooseButton": '选择...',
                            "attention": '请注意，为防止数据泄露，AME不会以任何方式持久化保存您的密码，请自行牢记密码！如因自身原因密码丢失导致加密mdz文件打不开的，后果自负！' +
                                '建议设置复杂度较高的密码以免被暴力破解！' +
                                '如您想创建无密码的Archive MD文件，则不用输入密码，直接保存即可。',
                            "savePasswordPlaceholder": '输入密码',
                            "savePasswordAgainPlaceholder": '再次输入密码',
                            "cancelButton": '取消',
                            "confirmButton": '保存',
                        },
                        "confirm": {
                            "confirmCloseTab": {
                                "title": '确认关闭',
                                "content": '您计划关闭的页面内容未保存，如果现在关闭则失去该页面所有未保存进度，是否继续关闭？',
                                "cancelButton": '否',
                                "confirmButton": '是',
                            },
                            "confirmQuit": {
                                "title": '确认退出',
                                "content": '您有1个或多个页面的内容未保存，如果现在退出则失去所有未保存进度，是否继续退出？',
                                "cancelButton": '否',
                                "confirmButton": '是',
                            },
                        },
                        "donate": {
                            "title": '打赏',
                            "info": '如果本软件对您有所帮助，不妨请我喝一杯小小的咖啡吧～各位用户的鼎力支持是我完善软件的最大动力:)。',
                            "closeButton": '关闭',
                        },
                    },
                    "settings": {
                        "title": '设置',
                        "attention": '设置更改后即时生效，无需重启应用。',
                        "editor": {
                            "mainCaption": '编辑器',
                            "subCaptions": {
                                "fontSize": '字体大小（px）',
                                "tabSize": '制表符缩进长度',
                                "lineNum": {
                                    "title": '行号',
                                    "options": {
                                        "enable": '开启',
                                        "disable": '关闭',
                                    },
                                },
                                "codeFold": {
                                    "title": '代码折叠',
                                    "options": {
                                        "enable": '开启',
                                        "disable": '关闭',
                                    }
                                },
                                "autoWrap": {
                                    "title": '自动折行',
                                    "options": {
                                        "enable": '开启',
                                        "disable": '关闭',
                                    }
                                },
                                "autoClosure": {
                                    "title": '自动输入闭合引号/括号和成对删除引号/括号',
                                    "options": {
                                        "enable": '开启',
                                        "disable": '关闭',
                                    }
                                },
                                "verticalScrollbarStatus": {
                                    "title": '垂直滚动条状态',
                                    "options": {
                                        "always": '始终显示',
                                        "untilMouseIn": '鼠标移入编辑器时显示',
                                        "hidden": '不显示',
                                    }
                                },
                                "horizonalScrollbarStatus": {
                                    "title": '水平滚动条状态',
                                    "options": {
                                        "always": '始终显示',
                                        "untilMouseIn": '鼠标移入编辑器时显示',
                                        "hidden": '不显示',
                                    }
                                },
                                "codeScale": {
                                    "title": '代码缩略图',
                                    "options": {
                                        "enable": '开启',
                                        "disable": '关闭',
                                    }
                                },
                                "editorAnimation": {
                                    "title": '编辑器动画效果',
                                    "options": {
                                        "enable": '开启',
                                        "disable": '关闭',
                                    }
                                },
                            },
                        },
                        "safe": {
                            "mainCaption": '安全',
                            "subCaptions": {
                                "safeMode": {
                                    "title": '安全模式',
                                    "options": {
                                        "enable": '开启',
                                        "disable": '关闭',
                                    }
                                },
                            },
                        },
                        "resetButton": '重置',
                    },
                    "welcomePage": {
                        "subTitle": '简约、美观、功能强大',
                        "start": '开始',
                        "startButtonGroup": {
                            "new": '新建文件...',
                            "open": '打开文件...',
                            "settings": '设置...',
                            "exitAME": '退出AME',
                        },
                        "history": {
                            "title": '历史记录',
                            "describe": '曾打开的文件将显示于此处',
                            "clearButton": '清空'
                        },
                    },
                    "defaultPage": {
                        "activateHotKey": '激活如下所示热键',
                        "motivation": '打开Archive Markdown Editor使用指南',
                    },
                    "renderPlaceholder": 'Markdown渲染区',
                },
                "zh-TW": {
                    "menuBar": {
                        "file": {
                            'mainCaption': '文件',
                            'subCaptions': {
                                "new": '新建...',
                                "open": '打開...',
                                "save": '儲存',
                                "saveAs": '另存為...',
                                "close": '關閉',
                                "exitAME": '退出AME',
                            },
                        },
                        "edit": {
                            'mainCaption': '編輯',
                            'subCaptions': {
                                "settings": '設定...',
                            },
                        },
                        "view": {
                            'mainCaption': '視圖',
                            'subCaptions': {
                                "viewMode": '預覽模式',
                                "editMode": '編輯模式',
                                "mixMode": '混合模式',
                            },
                        },
                        "help": {
                            'mainCaption': '幫助',
                            'subCaptions': {
                                "welcome": '歡迎...',
                                "about": '關於AME...',
                                "usage": 'AME使用指南...',
                                "syntax": 'Markdown語法學習...',
                                "donate": '打賞...',
                                "officialSite": '官方網站...',
                            },
                        },
                    },
                    "tabBar": {
                        "welcome": '歡迎',
                        "settings": '設定',
                        "about": '關於AME',
                        "usage": 'AME使用指南',
                        "syntax": 'Markdown語法學習',
                        "untitled": '無標題文檔',
                    },
                    "contextMenu": {
                        "inViewer": {
                            "copy": '拷貝',
                        },
                        "inEditor": {
                            "undo": '撤銷',
                            "redo": '重做',
                        },
                    },
                    "dialog": {
                        "activeTip": {
                            "userCancelOpen": '用戶已取消開啟文件',
                            "repeatOpenForbidden": '禁止重複開啟已開啟的文件',
                            "forbiddenCharsInFileName": '檔案名稱內有非法字符 > < : \' | * ?',
                            "unsupportedFileType": '不支援開啟這種類型的文件',
                            "fileNotFound": '無法開啟不存在的文件',
                            "cancelPasswordInput": '用戶已取消輸入密碼',
                            "saveFailed": '儲存失敗，請馬上直接關閉檔案以回滾到您上次儲存的狀態',
                        },
                        "loading": {
                            "open": '正在開啟檔案...',
                            "save": '正在儲存...',
                        },
                        "openEncMdzPasswordRequired": {
                            "title": '輸入密碼',
                            "wrongPasswordTitle": '密碼錯誤，請重試',
                            "description": '此檔案已加密，需要輸入密碼查看內容',
                        },
                        "systemDialogOpenFile": '開啟文件',
                        "systemDialogChoosePath": {
                            "title": '選擇儲存路徑',
                            "confirmButton": '確認',
                        },
                        "systemDialogSaveMedia": '儲存mdz內嵌媒體文件',
                        "saveAs": {
                            "title": '另存為',
                            "saveNamePlaceholder": '儲存檔案名稱',
                            "selectOptions": {
                                "mdz": 'Archive MD檔（*.mdz）',
                                "md": 'Markdown檔案（*.md）',
                                "txt": '文字檔（*.txt）',
                            },
                            "savePathPlaceholder": '儲存路徑',
                            "savePathChooseButton": '選擇...',
                            "attention": '請注意，為防止資料洩露，AME不會以任何方式持久化保存您的密碼，請自行牢記密碼！如因自身原因密碼遺失導致加密mdz檔案打不開的，後果自負！' +
                                '建議設定複雜度較高的密碼以免被暴力破解！' +
                                '如您想建立無密碼的Archive MD檔，則不用輸入密碼，直接儲存即可。',
                            "savePasswordPlaceholder": '輸入密碼',
                            "savePasswordAgainPlaceholder": '再次輸入密碼',
                            "cancelButton": '取消',
                            "confirmButton": '儲存',
                        },
                        "confirm": {
                            "confirmCloseTab": {
                                "title": '確認關閉',
                                "content": '您計劃關閉的頁面內容未儲存，如果現在關閉則失去該頁面所有未儲存進度，是否繼續關閉？',
                                "cancelButton": '否',
                                "confirmButton": '是',
                            },
                            "confirmQuit": {
                                "title": '確認退出',
                                "content": '您有1個或多個頁面的內容未儲存，如果現在退出則失去所有未儲存進度，是否繼續退出？',
                                "cancelButton": '否',
                                "confirmButton": '是',
                            },
                        },
                        "donate": {
                            "title": '打賞',
                            "info": '如果本軟體對您有幫助，不妨請我喝一杯小小的咖啡吧～各位用戶的鼎力支持是我完善軟體的最大動力:)。',
                            "closeButton": '關閉',
                        },
                    },
                    "settings": {
                        "title": '設定',
                        "attention": '設定變更後即時生效，無需重新啟動應用。',
                        "editor": {
                            "mainCaption": '編輯器',
                            "subCaptions": {
                                "fontSize": '字體大小（px）',
                                "tabSize": '製表符縮排長度',
                                "lineNum": {
                                    "title": '行號',
                                    "options": {
                                        "enable": '開啟',
                                        "disable": '關閉',
                                    },
                                },
                                "codeFold": {
                                    "title": '程式碼折疊',
                                    "options": {
                                        "enable": '開啟',
                                        "disable": '關閉',
                                    }
                                },
                                "autoWrap": {
                                    "title": '自動折行',
                                    "options": {
                                        "enable": '開啟',
                                        "disable": '關閉',
                                    }
                                },
                                "autoClosure": {
                                    "title": '自動輸入閉合引號/括號和成對刪除引號/括號',
                                    "options": {
                                        "enable": '開啟',
                                        "disable": '關閉',
                                    }
                                },
                                "verticalScrollbarStatus": {
                                    "title": '垂直捲軸狀態',
                                    "options": {
                                        "always": '始終顯示',
                                        "untilMouseIn": '滑鼠移入編輯器時顯示',
                                        "hidden": '不顯示',
                                    }
                                },
                                "horizonalScrollbarStatus": {
                                    "title": '水平捲軸狀態',
                                    "options": {
                                        "always": '始終顯示',
                                        "untilMouseIn": '滑鼠移入編輯器時顯示',
                                        "hidden": '不顯示',
                                    }
                                },
                                "codeScale": {
                                    "title": '程式碼縮圖',
                                    "options": {
                                        "enable": '開啟',
                                        "disable": '關閉',
                                    }
                                },
                                "editorAnimation": {
                                    "title": '編輯器動畫效果',
                                    "options": {
                                        "enable": '開啟',
                                        "disable": '關閉',
                                    }
                                },
                            },
                        },
                        "safe": {
                            "mainCaption": '安全',
                            "subCaptions": {
                                "safeMode": {
                                    "title": '安全模式',
                                    "options": {
                                        "enable": '開啟',
                                        "disable": '關閉',
                                    }
                                },
                            },
                        },
                        "resetButton": '重置',
                    },
                    "welcomePage": {
                        "subTitle": '簡約、美觀、功能強大',
                        "start": '開始',
                        "startButtonGroup": {
                            "new": '新建檔案...',
                            "open": '開啟檔案...',
                            "settings": '設定...',
                            "exitAME": '退出AME',
                        },
                        "history": {
                            "title": '歷史記錄',
                            "describe": '曾開啟的檔案將顯示於此處',
                            "clearButton": '清空'
                        },
                    },
                    "defaultPage": {
                        "activateHotKey": '啟動如下所示熱鍵',
                        "motivation": '開啟Archive Markdown Editor使用指南',
                    },
                    "renderPlaceholder": 'Markdown渲染區',
                },
                "en": {
                    "menuBar": {
                        "file": {
                            'mainCaption': 'File',
                            'subCaptions': {
                                "new": 'New File...',
                                "open": 'Open...',
                                "save": 'Save',
                                "saveAs": 'Save As...',
                                "close": 'Close',
                                "exitAME": 'Exit AME',
                            },
                        },
                        "edit": {
                            'mainCaption': 'Edit',
                            'subCaptions': {
                                "settings": 'Settings...',
                            },
                        },
                        "view": {
                            'mainCaption': 'View',
                            'subCaptions': {
                                "viewMode": 'View Mode',
                                "editMode": 'Edit Mode',
                                "mixMode": 'Mix Mode',
                            },
                        },
                        "help": {
                            'mainCaption': 'Help',
                            'subCaptions': {
                                "welcome": 'Welcome...',
                                "about": 'About AME...',
                                "usage": 'AME User Guide...',
                                "syntax": 'Markdown Learning...',
                                "donate": 'Donate...',
                                "officialSite": 'Official Site...',
                            },
                        },
                    },
                    "tabBar": {
                        "welcome": 'Welcome',
                        "settings": 'Settings',
                        "about": 'About',
                        "usage": 'AME User Guide',
                        "syntax": 'Markdown Learning',
                        "untitled": 'Untitled',
                    },
                    "contextMenu": {
                        "inViewer": {
                            "copy": 'Copy',
                        },
                        "inEditor": {
                            "undo": 'Undo',
                            "redo": 'Redo',
                        },
                    },
                    "dialog": {
                        "activeTip": {
                            "userCancelOpen": 'The user has canceled opening the file',
                            "repeatOpenForbidden": 'Prevent opening an already opened file again',
                            "forbiddenCharsInFileName": 'The filename contains illegal characters > < : \' | * ?',
                            "unsupportedFileType": 'This type of file is not supported',
                            "fileNotFound": 'Unable to open a file that does not exist',
                            "cancelPasswordInput": 'The user has cancelled entering a password',
                            "saveFailed": 'Saving failed! Please close the file immediately to revert to your last saved state',
                        },
                        "loading": {
                            "open": 'Opening...',
                            "save": 'Saving...',
                        },
                        "openEncMdzPasswordRequired": {
                            "title": 'Enter password',
                            "wrongPasswordTitle": 'Incorrect password, please try again',
                            "description": 'Encrypted mdz file, password required!',
                        },
                        "systemDialogOpenFile": 'Open',
                        "systemDialogChoosePath": {
                            "title": 'Choose the save path',
                            "confirmButton": 'OK',
                        },
                        "systemDialogSaveMedia": 'Save mdz embedded media files',
                        "saveAs": {
                            "title": 'Save As',
                            "saveNamePlaceholder": 'File Name',
                            "selectOptions": {
                                "mdz": 'Archive MD File（*.mdz）',
                                "md": 'Markdown File（*.md）',
                                "txt": 'Text File（*.txt）',
                            },
                            "savePathPlaceholder": 'Save Path',
                            "savePathChooseButton": 'Browse...',
                            "attention": 'ATTENTION! To prevent data leakage, AME will NOT persistently store your password in any way. Please remember your password! If you lose your password due to your own reasons and the encrypted .mdz file cannot be opened, you will be solely responsible for the consequences! ' +
                                'We recommend setting a STRONG password to prevent brute-force attacks! ' +
                                'If you want to create a passwordless Archive MD file, you don\'t need to enter a password; just save it directly.',
                            "savePasswordPlaceholder": 'Enter Password',
                            "savePasswordAgainPlaceholder": 'Enter Password Again',
                            "cancelButton": 'Cancel',
                            "confirmButton": 'Save',
                        },
                        "confirm": {
                            "confirmCloseTab": {
                                "title": 'Confirm Close',
                                "content": 'The page content you plan to close has not been saved. If you close it now, you will lose all the unsaved progress on this page. Do you want to continue closing?',
                                "cancelButton": 'Cancel',
                                "confirmButton": 'Continue',
                            },
                            "confirmQuit": {
                                "title": 'Confirm Quit',
                                "content": 'You have one or more pages of unsaved content. If you exit now, you will lose all unsaved progress. Do you want to continue exiting?',
                                "cancelButton": 'Cancel',
                                "confirmButton": 'Continue',
                            },
                        },
                        "donate": {
                            "title": 'Donate',
                            "info": 'If this software has been helpful to you, how about buying me a small cup of coffee? Your support is my greatest motivation to improve the software :).',
                            "closeButton": 'Close',
                        },
                    },
                    "settings": {
                        "title": 'Settings',
                        "attention": 'Settings changes take effect immediately without requiring an application restart.',
                        "editor": {
                            "mainCaption": 'Editor',
                            "subCaptions": {
                                "fontSize": 'Fontsize (px)',
                                "tabSize": 'Tab Size',
                                "lineNum": {
                                    "title": 'Line Numbers',
                                    "options": {
                                        "enable": 'Enable',
                                        "disable": 'Disable',
                                    },
                                },
                                "codeFold": {
                                    "title": 'Code Folding',
                                    "options": {
                                        "enable": 'Enable',
                                        "disable": 'Disable',
                                    }
                                },
                                "autoWrap": {
                                    "title": 'Automatic Line Wrapping',
                                    "options": {
                                        "enable": 'Enable',
                                        "disable": 'Disable',
                                    }
                                },
                                "autoClosure": {
                                    "title": 'Automatically Closure quotation marks/parentheses',
                                    "options": {
                                        "enable": 'Enable',
                                        "disable": 'Disable',
                                    }
                                },
                                "verticalScrollbarStatus": {
                                    "title": 'Vertical Scroll Bar Status',
                                    "options": {
                                        "always": 'Always showing',
                                        "untilMouseIn": 'Until mouse hovers over the editor',
                                        "hidden": 'Hidden',
                                    }
                                },
                                "horizonalScrollbarStatus": {
                                    "title": 'Horizontal Scroll Bar Status',
                                    "options": {
                                        "always": 'Always showing',
                                        "untilMouseIn": 'Until mouse hovers over the editor',
                                        "hidden": 'Hidden',
                                    }
                                },
                                "codeScale": {
                                    "title": 'Code thumbnail',
                                    "options": {
                                        "enable": 'Enable',
                                        "disable": 'Disable',
                                    }
                                },
                                "editorAnimation": {
                                    "title": 'Editor Animation Effects',
                                    "options": {
                                        "enable": 'Enable',
                                        "disable": 'Disable',
                                    }
                                },
                            },
                        },
                        "safe": {
                            "mainCaption": 'Safety',
                            "subCaptions": {
                                "safeMode": {
                                    "title": 'Safe Mode',
                                    "options": {
                                        "enable": 'Enable',
                                        "disable": 'Disable',
                                    }
                                },
                            },
                        },
                        "resetButton": 'Reset Settings',
                    },
                    "welcomePage": {
                        "subTitle": 'Simple, beautiful, and powerful',
                        "start": 'Start',
                        "startButtonGroup": {
                            "new": 'New File...',
                            "open": 'Open File...',
                            "settings": 'Settings...',
                            "exitAME": 'Exit AME',
                        },
                        "history": {
                            "title": 'History',
                            "describe": 'Previously opened files will be displayed here',
                            "clearButton": 'Clear'
                        },
                    },
                    "defaultPage": {
                        "activateHotKey": 'Activate the hotkey shown below',
                        "motivation": 'To open Archive Markdown Editor User Guide',
                    },
                    "renderPlaceholder": 'Markdown Rendering Area',
                },
            },
        };
    },
}
