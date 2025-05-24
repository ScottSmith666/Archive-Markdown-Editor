window.MathJax = {
    tex: {
        inlineMath: [
            ['$', '$'],
            ['\\(', '\\)']
        ],
        displayMath: [
            // displayMath是一个数组，用来指定行间公式的起始符号和结束符号
            ['$$', '$$'],
            ['\\[', '\\]'],
        ],
    },
    svg: {
        fontCache: 'global'
    },
    load: [
        'input/tex-base', // 必备基础库
        'output/chtml', // 必备基础库，用来将tex转换成html
        '[tex]/action', // [tex]/action库包含了\require等宏，可以用来加载其他的宏包
        '[tex]/mhchem', // mhchem库用来输入化学方程式
        '[tex]/ams', // [tex]/ams库包含了大量的数学符号和数学环境，比如\begin{align}等
    ],
    packages: ['base', 'action', 'mhchem', 'ams'],
    PreviewHTML: {
        scale: 120,
        linebreaks: {
            automatic: true
        },
    },
    options: {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'a'],
        ignoreHtmlClass: 'code-editor',
    },
};
