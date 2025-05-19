let suggestions = (langKind) => {
    switch (langKind) {
        case 'markdown':
            return [
                // 一级标题
                {
                    label: "# 一级标题",
                    insertText: "# ",
                    detail: "Markdown一级标题",
                    sortText: `0_# 一级标题`,
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "h1",
                },
                {
                    label: "<h1>一级标题</h1>",
                    insertText: "<h1></h1>",
                    detail: "HTML一级标题",
                    sortText: `1_<h1>一级标题</h1>`,
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "h1",
                },
                // 二级标题
                {
                    label: "## 二级标题",
                    insertText: "## ",
                    detail: "Markdown二级标题",
                    sortText: `2_## 二级标题`,
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "h2",
                },
                {
                    label: "<h2>二级标题</h2>",
                    insertText: "<h2></h2>",
                    detail: "HTML二级标题",
                    sortText: `3_<h2>一级标题</h2>`,
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "h2",
                },
                // 三级标题
                {
                    label: "### 三级标题",
                    insertText: "### ",
                    detail: "Markdown三级标题",
                    sortText: `4_### 三级标题`,
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "h3",
                },
                {
                    label: "<h3>三级标题</h3>",
                    insertText: "<h3></h3>",
                    detail: "HTML三级标题",
                    sortText: `5_<h3>三级标题</h3>`,
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "h3",
                },
                // 四级标题
                {
                    label: "#### 四级标题",
                    insertText: "#### ",
                    detail: "Markdown四级标题",
                    sortText: `6_#### 四级标题`,
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "h4",
                },
                {
                    label: "<h4>四级标题</h4>",
                    insertText: "<h4></h4>",
                    detail: "HTML四级标题",
                    sortText: `7_<h4>四级标题</h4>`,
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "h4",
                },
                // 五级标题
                {
                    label: "##### 五级标题",
                    insertText: "##### ",
                    detail: "Markdown五级标题",
                    sortText: `8_##### 五级标题`,
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "h5",
                },
                {
                    label: "<h5>五级标题</h5>",
                    insertText: "<h5></h5>",
                    detail: "HTML五级标题",
                    sortText: `9_<h5>四级标题</h5>`,
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "h5",
                },
                // 六级标题
                {
                    label: "###### 六级标题",
                    insertText: "###### ",
                    detail: "Markdown六级标题",
                    sortText: `10_###### 六级标题`,
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "h6",
                },
                {
                    label: "<h6>六级标题</h6>",
                    insertText: "<h6></h6>",
                    detail: "HTML六级标题",
                    sortText: `11_<h6>六级标题</h6>`,
                    kind: monaco.languages.CompletionItemKind.Text,
                    filterText: "h6",
                },
                //
            ];
        // ...
    }
}

