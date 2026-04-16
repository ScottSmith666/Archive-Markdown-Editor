import * as monaco from '../../../../../libs/third_party/monaco-editor/esm/vs/editor/editor.api.js';

monaco.languages.registerCompletionItemProvider("markdown", {
    provideCompletionItems: (model, position) => {
        return {
            suggestions: [
                // 一级标题
                {
                    label: "# 一级标题",
                    insertText: "# ",
                    detail: "Markdown一级标题",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/header",
                },
                {
                    label: "一级标题\n===",
                    insertText: "标题\n===",
                    detail: "Markdown一级标题",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/header",
                },
                {
                    label: "<h1>一级标题</h1>",
                    insertText: "<h1></h1>",
                    detail: "HTML一级标题",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/header",
                },
                // 二级标题
                {
                    label: "## 二级标题",
                    insertText: "## ",
                    detail: "Markdown二级标题",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/header",
                },
                {
                    label: "二级标题\n---",
                    insertText: "标题\n---",
                    detail: "Markdown二级标题",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/header",
                },
                {
                    label: "<h2>二级标题</h2>",
                    insertText: "<h2></h2>",
                    detail: "HTML二级标题",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/header",
                },
                // 三级标题
                {
                    label: "### 三级标题",
                    insertText: "### ",
                    detail: "Markdown三级标题",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/header",
                },
                {
                    label: "<h3>三级标题</h3>",
                    insertText: "<h3></h3>",
                    detail: "HTML三级标题",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/header",
                },
                // 四级标题
                {
                    label: "#### 四级标题",
                    insertText: "#### ",
                    detail: "Markdown四级标题",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/header",
                },
                {
                    label: "<h4>四级标题</h4>",
                    insertText: "<h4></h4>",
                    detail: "HTML四级标题",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/header",
                },
                // 五级标题
                {
                    label: "##### 五级标题",
                    insertText: "##### ",
                    detail: "Markdown五级标题",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/header",
                },
                {
                    label: "<h5>五级标题</h5>",
                    insertText: "<h5></h5>",
                    detail: "HTML五级标题",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/header",
                },
                // 六级标题
                {
                    label: "###### 六级标题",
                    insertText: "###### ",
                    detail: "Markdown六级标题",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/header",
                },
                {
                    label: "<h6>六级标题</h6>",
                    insertText: "<h6></h6>",
                    detail: "HTML六级标题",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/header",
                },

                // 换行
                {
                    label: "<br>",
                    insertText: "<br>",
                    detail: "HTML换行标签",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/br",
                },

                // 粗体
                {
                    label: "**粗体**",
                    insertText: "**键入文字**",
                    detail: "Markdown粗体",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/strong",
                },
                {
                    label: "<strong>粗体</strong>",
                    insertText: "<strong>键入文字</strong>",
                    detail: "HTML粗体标签",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/strong",
                },

                // 斜体
                {
                    label: "*斜体*",
                    insertText: "*键入文字*",
                    detail: "Markdown斜体",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/italic",
                },

                // 高亮
                {
                    label: "==高亮==",
                    insertText: "==键入文字==",
                    detail: "Markdown高亮",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/light",
                },

                // 删除线
                {
                    label: "~~删除线~~",
                    insertText: "~~键入文字~~",
                    detail: "Markdown删除线",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/delete",
                },

                // 下划线
                {
                    label: "<u>下滑线</u>",
                    insertText: "<u>键入文字</u>",
                    detail: "Markdown下划线",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/underline",
                },

                // 上标
                {
                    label: "<sup>上标</sup>",
                    insertText: "<sup>键入文字</sup>",
                    detail: "Markdown上标",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/sup",
                },

                // 下标
                {
                    label: "<sub>下标</sub>",
                    insertText: "<sub>键入文字</sub>",
                    detail: "Markdown下标",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/sub",
                },

                // 引用
                {
                    label: "> Markdown普通引用",
                    insertText: "> 键入文字",
                    detail: "Markdown普通引用",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/quote",
                },
                {
                    label: "> Markdown提示引用",
                    insertText: "> [!tip]\n> 键入文字",
                    detail: "Markdown提示引用",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/quote",
                },
                {
                    label: "> Markdown信息引用",
                    insertText: "> [!note]\n> 键入文字",
                    detail: "Markdown信息引用",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/quote",
                },
                {
                    label: "> Markdown警告引用",
                    insertText: "> [!warning]\n> 键入文字",
                    detail: "Markdown警告引用",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/quote",
                },
                {
                    label: "> Markdown强烈警告引用",
                    insertText: "> [!caution]\n> 键入文字",
                    detail: "Markdown强烈警告引用",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/quote",
                },

                // 列表
                {
                    label: "1. Markdown有序列表",
                    insertText: "1. 键入文字",
                    detail: "Markdown有序列表",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/list",
                },
                {
                    label: "+ Markdown无序列表",
                    insertText: "+ 键入文字",
                    detail: "Markdown无序列表",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/list",
                },
                {
                    label: "- Markdown无序列表",
                    insertText: "- 键入文字",
                    detail: "Markdown无序列表",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/list",
                },
                {
                    label: "* Markdown无序列表",
                    insertText: "* 键入文字",
                    detail: "Markdown无序列表",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/list",
                },
                {
                    label: "- [ ] Markdown未完成任务列表",
                    insertText: "- [ ] 键入文字",
                    detail: "Markdown未完成任务列表",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/list",
                },
                {
                    label: "- [x] Markdown已完成任务列表",
                    insertText: "- [x] 键入文字",
                    detail: "Markdown已完成任务列表",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/list",
                },

                // 表格
                {
                    label: "不带对齐样式的表格",
                    insertText: "| 字段1     | 字段2    | 字段3    |\n" +
                        "|----------|---------|----------|\n" +
                        "| 内容1-1   | 内容1-2  | 内容1-3  |\n" +
                        "| 内容2-1   | 内容2-2  | 内容2-2  |\n" +
                        "| 内容3-1   | 内容3-2  | 内容3-2  |",
                    detail: "不带对齐样式的表格",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/table",
                },
                {
                    label: "带对齐样式的表格",
                    insertText: "| 居左字段1     | 居中字段2    | 居右字段3    |\n" +
                        "|:----------|:---------:|----------:|\n" +
                        "| 居左内容1-1   | 居中内容1-2  | 居右内容1-3  |\n" +
                        "| 居左内容2-1   | 居中内容2-2  | 居右内容2-2  |\n" +
                        "| 居左内容3-1   | 居中内容3-2  | 居右内容3-2  |",
                    detail: "带对齐样式的表格",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/table",
                },

                // 代码
                {
                    label: "`Markdown行内代码`",
                    insertText: "`在此处键入代码...`",
                    detail: "Markdown行内代码",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/code",
                },
                {
                    label: "```Markdown代码块```",
                    insertText: "```指定语言名称\n在此处键入代码...\n```",
                    detail: "Markdown代码块",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/code",
                },

                // 分隔线
                {
                    label: "***",
                    insertText: "***",
                    detail: "Markdown分隔线",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/line",
                },
                {
                    label: "---",
                    insertText: "---",
                    detail: "Markdown分隔线",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/line",
                },

                // 链接
                {
                    label: "[label](URL)",
                    insertText: "[]()",
                    detail: "Markdown插入链接",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/link",
                },

                // 图片
                {
                    label: "![label](URL)",
                    insertText: "![]()",
                    detail: "Markdown插入图片",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/img",
                },

                // 视频
                {
                    label: '![${video}:label](URL|filePath)',
                    insertText: "![${video}:]()",
                    detail: "Markdown插入视频",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/video",
                },

                // 音频
                {
                    label: '![${audio}:label](URL|filePath)',
                    insertText: "![${audio}:]()",
                    detail: "Markdown插入音频",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/audio",
                },

                // 可下载文件
                {
                    label: '![${file}:label](filePath)',
                    insertText: "![${file}:]()",
                    detail: "Markdown插入可下载文件",
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "/file",
                },
            ],
        };
    },
});
