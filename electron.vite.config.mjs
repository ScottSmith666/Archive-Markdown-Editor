import {resolve} from "path";
import {defineConfig} from "electron-vite";
import vue from "@vitejs/plugin-vue";
import {contentMathjax} from "./src/main/themes/display_js/content_mathjax.js";

// 打印页占位注释，见 src/renderer/ame-print.html
const MATHJAX_CONFIG_PLACEHOLDER = "<!--AME:MATHJAX-CONFIG-->";

// MathJax配置在仓库里只有 src/main/themes/display_js/content_mathjax.js 一份来源：
// app内预览抄了一份在 src/renderer/index.html，导出HTML模板由 export_html_template.js 内联。
// 现在又多了一个导出PDF用的打印页，它必须在 MathJax 主构建之前把配置写好（只能内联），
// 所以在这里把同一份字符串塞进 ame-print.html，不再抄第三份。
const amePrintMathjax = () => ({
    name: "ame-print-mathjax",
    transformIndexHtml: {
        order: "pre",
        handler(html) {
            if (!html.includes(MATHJAX_CONFIG_PLACEHOLDER)) {
                return html;
            }
            // 必须用函数式替换：字符串式 replace 会把替换串里的 $$ 当成“一个literal $”吃掉，
            // 实测把 displayMath 的 ["$$","$$"] 变成 ["$","$"]，
            // 于是 displayMath 先于 inlineMath 匹配，页面上所有 $...$ 行内公式都被判成独立公式居中排版。
            return html.replace(MATHJAX_CONFIG_PLACEHOLDER, () => (
                "<script>\n    " + contentMathjax + "\n"
                + "    // 与 export_html_template.js 同一句话：.mermaid 里放的是图的源码，\n"
                + "    // MathJax改写它会让mermaid报“Syntax error in text”，这里按class排除。\n"
                + "    MathJax.options.ignoreHtmlClass = \"code-editor|mermaid\";\n"
                + "    // contentMathjax 是模板字符串，写在内的 \"\\\\[\" 出来只剩 \"\\[\"，\n"
                + "    // 落到页面里会被JS再解一次成 \"[\"，displayMath 就多出裸方括号这一对分隔符，\n"
                + "    // 正文里任何 [xxx] 都会被当成独立公式排掉。这里按原作者的意图补回来。\n"
                + "    // （app内预览的 src/renderer/index.html 本来就没有这一对分隔符，不受影响。）\n"
                + "    MathJax.tex.displayMath = [[\"$$\", \"$$\"], [\"\\\\[\", \"\\\\]\"]];\n"
                + "</script>"
            ));
        },
    },
});

export default defineConfig({
    main: {
        build: {
            bytecode: true,
        }
    },
    preload: {
        build: {
            // 不能开启字节码：窗口已启用 sandbox: true，沙箱化的 preload 只能 require
            // electron / events / timers / url，而 electron-vite 生成的 bytecode-loader.cjs
            // 需要 node:fs、node:vm、node:module，加载阶段就会抛错，导致所有 preload API 全部失效
            bytecode: false,
        }
    },
    renderer: {
        build: {
            minify: 'oxc',
            rolldownOptions: {
                minify: true,
                drop: ['console', 'debugger'], // 移除 console.log 和 debugger
                input: {
                    index: resolve("src/renderer/index.html"),
                    amePrint: resolve("src/renderer/ame-print.html"),
                },
            },
        },
        resolve: {
            alias: {
                "@renderer": resolve("src/renderer/src"),
            },
        },
        plugins: [vue(), amePrintMathjax()],
        worker: {
            format: "es",
        },
    },
});
