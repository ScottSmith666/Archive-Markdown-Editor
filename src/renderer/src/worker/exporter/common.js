export const uniqueArray = (arr) => {
    const unique = new Set(arr.map(item => JSON.stringify(item)));
    return Array.from(unique).map(item => JSON.parse(item));
}

export const processLatex = (originContent) => {
    // 1. 处理 $$ ... $$ 块
    originContent = originContent.replaceAll(/\$\$([\s\S]*?)\$\$/g, (match, content) => {
        const newContent = content.replaceAll(/(?<!\\)\\\\(?!\\)/g, '\\\\\\\\');
        return '$$' + newContent + '$$';
    });

    // 2. 处理 \[ ... \] 块
    originContent = originContent.replaceAll(/\\\[([\s\S]*?)\\\]/g, (match, content) => {
        const newContent = content.replaceAll(/(?<!\\)\\\\(?!\\)/g, '\\\\\\\\');
        return '\\[' + newContent + '\\]';
    });

    // 3. 处理转义$
    originContent = originContent.replaceAll("\\$", "\\\\$");
    // console.log("处理后的内容：\n", originContent);
    return originContent;
};
