export const contentMathjax = `
    MathJax = {
        tex: {
            inlineMath: [  // 行内公式选择符
                ["$", "$"],
            ],
            displayMath: [  // 段内公式选择符
                ["$$", "$$"],
                ["\\[", "\\]"],
            ],
            packages: {'[+]': ['base', 'action', 'mhchem', 'ams']},
            processEscapes: true,
            processEnvironments: true // 允许识别 \\begin{aligned} 等环境
        },
        loader: {
            load: [
                'output/chtml', // 必备基础库，用来将tex转换成html
                '[tex]/action', // [tex]/action库包含了\\require等宏，可以用来加载其他的宏包
                '[tex]/mhchem', // mhchem库用来输入化学方程式
                '[tex]/amscd',
                '[tex]/bbox',
                '[tex]/boldsymbol',
                '[tex]/braket',
                '[tex]/bussproofs',
                '[tex]/cancel',
                '[tex]/cases',
                '[tex]/centernot',
                '[tex]/color',
                '[tex]/colortbl',
                '[tex]/empheq',
                '[tex]/enclose',
                '[tex]/extpfeil',
                '[tex]/gensymb',
                '[tex]/html',
                '[tex]/mathtools',
                '[tex]/physics',
                '[tex]/centernot',
                '[tex]/tagformat',
                '[tex]/upgreek',
                '[tex]/verb',
            ]
        },
        options: {
            enableMenu: false,
            renderActions: {
                addMenu: [] // 移除将菜单绑定到公式上的渲染动作
            },
            skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'a'],
            ignoreHtmlClass: 'code-editor',
            menuOptions: {
                settings: {
                    speech: false,  // 禁用语音生成
                    braille: false,  // 可选：同时禁用盲文
                }
            }
        }
    };
`;
