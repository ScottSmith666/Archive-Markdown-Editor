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
                                "save": '保存...',
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
                                "officialSite": '官方网站',
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
                        },
                        "loading": {
                            "open": '正在打开文件...',
                            "save": '正在保存...',
                        },
                        "confirm": {},
                        "passwordInput": '',
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
                                "mdz": 'Archive md文件（*.mdz）',
                                "md": 'Markdown文件（*.md）',
                                "txt": '文本文件（*.txt）',
                            },
                            "savePathPlaceholder": '保存路径',
                            "savePathChooseButton": '选择...',
                            "attention": '● 请注意，为防止数据泄露，AME不会以任何方式持久化保存您的密码，请自行牢记密码！如因自身原因密码丢失导致加密mdz文件打不开的，后果自负！<br>\n' +
                                '                                ● 建议设置复杂度较高的密码以免被暴力破解！\n' +
                                '                                ● 如您想创建无密码的Archive md文件，则不用输入密码，直接保存即可。',
                            "savePasswordPlaceholder": '输入密码',
                            "savePasswordAgainPlaceholder": '再次输入密码',
                            "cancelButton": '取消',
                            "confirmButton": '保存',
                        },
                        "donate": {
                            "title": '打赏',
                            "info": '如果本软件对您有所帮助，不妨请我喝一杯小小的咖啡吧～各位用户的鼎力支持是我完善软件的最大动力:)。',
                            "closeButton": '关闭',
                        },
                    },
                    "settings": {
                        "title": '设置',
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
                                        "untilMouseIn": '鼠标移入编辑器时时显示',
                                        "hidden": '不显示',
                                    }
                                },
                                "horizonalScrollbarStatus": {
                                    "title": '水平滚动条状态',
                                    "options": {
                                        "always": '始终显示',
                                        "untilMouseIn": '鼠标移入编辑器时时显示',
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
                        }
                    },
                    "welcomePage": {
                        "subTitle": '简约、美观、功能强大',
                        "startButtonGroup": {
                            "new": '新建文件...',
                            "open": '打开文件...',
                            "settings": '设置...',
                            "exitAME": '退出AME',
                        },
                        "history": {
                            "title": '历史记录',
                            "clearButton": '清空'
                        },
                    },
                    "renderPlaceholder": 'Markdown渲染区',
                },
                "zh-TW": {

                },
                "en": {

                },
            },
        };
    },
}
