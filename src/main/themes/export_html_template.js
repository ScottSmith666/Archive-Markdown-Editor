import {contentMathjax} from "./display_js/content_mathjax";

export const exportHtmlTemplate = (rootVars, themeStyle, renderContent) => `
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
    <link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/prism/1.30.0/plugins/toolbar/prism-toolbar.min.css"/>
    <link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/prism/1.30.0/plugins/line-numbers/prism-line-numbers.min.css"/>
    <link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/prism/1.30.0/themes/prism.min.css"/>
</head>

<body>
<div id="viewer-content">
    ${renderContent}
</div>
<script>
    ${contentMathjax}
</script>
<script id="MathJax-script" async src="https://cdn.bootcdn.net/ajax/libs/mathjax/4.0.0-alpha.1/es5/tex-mml-chtml-nofont.min.js"></script>
<script src="https://cdn.bootcdn.net/ajax/libs/mermaid/11.12.0/mermaid.min.js"></script>
<script>
    mermaid.initialize({ startOnLoad: true });
</script>
<script src="https://cdn.bootcdn.net/ajax/libs/prism/1.30.0/prism.min.js"></script>
<script src="https://cdn.bootcdn.net/ajax/libs/prism/1.30.0/components/prism-clike.min.js"></script>
<script src="https://cdn.bootcdn.net/ajax/libs/prism/1.30.0/components/prism-c.min.js"></script>
<script src="https://cdn.bootcdn.net/ajax/libs/prism/1.30.0/components/prism-cpp.min.js"></script>
<script src="https://cdn.bootcdn.net/ajax/libs/prism/1.30.0/components/prism-java.min.js"></script>
<script src="https://cdn.bootcdn.net/ajax/libs/prism/1.30.0/components/prism-markup.min.js"></script>
<script src="https://cdn.bootcdn.net/ajax/libs/prism/1.30.0/components/prism-css.min.js"></script>
<script src="https://cdn.bootcdn.net/ajax/libs/prism/1.30.0/components/prism-javascript.min.js"></script>
<script src="https://cdn.bootcdn.net/ajax/libs/prism/1.30.0/components/prism-typescript.min.js"></script>
<script src="https://cdn.bootcdn.net/ajax/libs/prism/1.30.0/components/prism-python.min.js"></script>
<script src="https://cdn.bootcdn.net/ajax/libs/prism/1.30.0/components/prism-markdown.min.js"></script>
<script src="https://cdn.bootcdn.net/ajax/libs/prism/1.30.0/plugins/toolbar/prism-toolbar.min.js"></script>
<script src="https://cdn.bootcdn.net/ajax/libs/prism/1.30.0/plugins/show-language/prism-show-language.min.js"></script>
<script src="https://cdn.bootcdn.net/ajax/libs/prism/1.30.0/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js"></script>
<script src="https://cdn.bootcdn.net/ajax/libs/prism/1.30.0/plugins/line-numbers/prism-line-numbers.min.js"></script>
</body>
</html>
`;
