import {contentMathjax} from "./display_js/content_mathjax";
import {MATHJAX_CDN} from "./export_assets";

// exportAssets 来自 src/main/themes/export_assets.js 的 prepareExportAssets()：
// {styles: [...], scripts: [...], mathjax: {src, fontsBaseUrl, hookScript}}，内容是“导出文件名.media_dir”里的
// 相对地址（离线资源）；某个库在应用包内取不到时，对应地址会退回原来的CDN链接，
// 此时 fontsBaseUrl 为空串、hookScript 为空串，不再需要那段地址改写脚本。
export const exportHtmlTemplate = (
    rootVars,
    themeStyle,
    renderContent,
    exportAssets = {
        styles: [],
        scripts: [],
        mathjax: {src: MATHJAX_CDN, fontsBaseUrl: "", hookScript: ""}
    }
) => {
    const mathjax = {
        src: MATHJAX_CDN,
        fontsBaseUrl: "",
        hookScript: "",
        ...(exportAssets.mathjax || {})
    };
    const styleTags = exportAssets.styles
        .map((href) => `    <link rel="stylesheet" href="${href}"/>`)
        .join("\n");
    const scriptTags = exportAssets.scripts
        .map((src) => `    <script src="${src}"></script>`)
        .join("\n");
    return `
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport"
          content="width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no"/>
    <title>Export Result</title>
    <style>
        ${rootVars}
        ${themeStyle}
    </style>
${styleTags}
</head>

<body>
<div id="viewer-content">
    ${renderContent}
</div>
<script>
    ${contentMathjax}
    // 导出的页面里 .mermaid 里放的是“图的源码”（mermaid按行解析它），只交给mermaid渲染。
    // 如果MathJax先整页排版、改写了这些节点里的文本，mermaid会把它判成语法错误，
    // 所以显式让MathJax跳过 .mermaid（目前渲染出的是 <pre class="mermaid">，本来就被
    // 上面 skipHtmlTags 里的 pre 跳过了，这里再补一条class规则，不依赖元素类型）。
    MathJax.options.ignoreHtmlClass = "code-editor|mermaid";
</script>
${mathjax.hookScript}
<script id="MathJax-script" async src="${mathjax.src}"></script>
${scriptTags}
<script>
    // 文档里没有mermaid图时不会引入mermaid，因此这里要判空
    if (window.mermaid) {
        mermaid.initialize({ startOnLoad: true });
    }
</script>
</body>
</html>
`;
};
