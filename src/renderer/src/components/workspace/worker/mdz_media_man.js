const saveAndTransform = () => {
    const model = editor.getModel();
    if (!model) return;

    // 1. 查找匹配项
    const imageRegex = /!\[([^]]*)\]\(([^)\s]+)(?:\s+["']([^"']*)["'])?\)/g;
    const matches = model.findMatches(
        IMAGE_REGEX,  // 要查找的字符串或正则表达式
        false,  // 是否只在可编辑范围内查找
        true,  // searchString 是否为正则表达式
        false,  // 是否区分大小写
        null,  // 字分隔符（如需要匹配整个单词）
        true  // 是否捕获匹配组（仅对正则有效）
    );

    if (matches.length > 0) {
        const edits = matches.map(match => {
            const [fullText, altText, oldUrl] = match.matches;

            // 执行你的转换逻辑
            const newUrl = transformLogic(oldUrl);

            return {
                range: match.range,
                text: `![${altText}](${newUrl})`,
                forceMoveMarkers: true // 确保光标和标记跟随替换移动
            };
        });

        // 使用 applyEdits 直接原地修改，不记录到撤销栈
        model.applyEdits(edits);
    }

    // 3. 执行后续保存逻辑（例如写入文件）
    const finalContent = model.getValue(); // 此时拿到的已是替换后的内容
    doSaveFile(finalContent);
};
