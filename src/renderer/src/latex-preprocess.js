// LaTeX 数学片段预处理：在文本进 markdown-it 之前，把数学片段里的每个反斜杠补成两个。
//
// 【为什么需要这一步】
// markdown-it 的 escape 规则（inline 阶段）跑在自定义核心规则之前
// （engine.js 里的 escape_dollar、round_dollars 都是 md.core.ruler.push 进去的），
// 所以数学片段里的反斜杠会先被 markdown 吃掉一层：
//   \{  ->  {          \left\{ ... \right\} 当场报 "Missing or unrecognized delimiter for \left"
//   \\  ->  \          矩阵、cases、aligned 不分行了，还会连带报 Misplaced &
// MathJax 拿到的已经不是用户写的 LaTeX。
//
// 【这里怎么抵消】
// CommonMark 的还原规律是“一个反斜杠配一个可转义字符”，反斜杠连写 n 个时 markdown 会压成 ceil(n/2) 个。
// 把数学片段里每个反斜杠都写成两个，还原后正好回到一个，
// 等价于“让 markdown 别碰数学里的反斜杠”，\{ \\ \, \% \text 之类一次全解决。
// 定界符（$$ 与 \[ \]）本身在片段外，不参与补斜杠。
//
// 【谁在用】
//   - 编辑区实时预览：src/renderer/src/components/workspace/Editor.vue 的 getPlanPiece()
//   - 内置文档页：src/renderer/src/components/document/Doc.vue 的 readDocument()
// 两条路各自只在进 markdown-it 之前调用一次，Viewer.vue 不再重复处理（补两次会多出一层反斜杠）。
//
// 【刻意不动的地方】
// 围栏代码块与行内代码原样保留。否则像 document/latex-syntax.md 这种
// “代码块里贴 LaTeX 示例”的文档，代码块会被显示成 \\{ 这种双倍反斜杠。
//
// 【仍然存在的固有限制】（markdown-it 先于 MathJax 解析，改不了）
//   - 数学里的字面 \$ 会被 escape_dollar 规则截断，想写美元符号请用行内代码；
//   - 数学里的裸 * 与 __ 可能被 emphasis 规则当成强调；
//   - 表格单元格里的裸 | 会把公式从中间截断，请写 \vert。

// 围栏代码块（``` / ~~~，含 info string）与行内代码，整段原样保留
const PRESERVED_RE = /^[ \t]*(`{3,}|~{3,})[^\n]*\n[\s\S]*?^[ \t]*\1[ \t]*$|`[^`\n]*`/gm;

// 数学片段：$$...$$ 与 \[...\] 可以跨行，$...$ 只在同一行内配对。
// 行内那一路要求两个 $ 之间至少有一个字符，否则正文里落单的 $$（例如性能模式按行
// 切片把一个 $$...$$ 块从中截断）会被当成“空的行内公式”，补完变成 $$$$。
const MATH_RE = /(\$\$[\s\S]*?\$\$)|(\\\[[\s\S]*?\\\])|\$([^$\n]+?)\$/g;

const PLACEHOLDER_RE = /\u0000AME_LATEX_PRESERVED_(\d+)\u0000/g;

const doubleBackslashes = (text) => text.replace(/\\/g, '\\\\');

export const processLatex = (originContent) => {
    if (typeof originContent !== 'string' || originContent === '') {
        return originContent;
    }

    const preservedList = [];
    const preserve = (text) => {
        preservedList.push(text);
        return `\u0000AME_LATEX_PRESERVED_${preservedList.length - 1}\u0000`;
    };

    // 1. 先摘出代码，避免代码示例被补斜杠
    let content = originContent.replace(PRESERVED_RE, (matched) => preserve(matched));

    // 2. 数学片段补斜杠（定界符保持原样，只处理片段内部）
    content = content.replace(MATH_RE, (matched, display, bracket, inline) => {
        if (display !== undefined) {
            return preserve('$$' + doubleBackslashes(display.slice(2, -2)) + '$$');
        }
        if (bracket !== undefined) {
            return preserve('\\[' + doubleBackslashes(bracket.slice(2, -2)) + '\\]');
        }
        return preserve('$' + doubleBackslashes(inline) + '$');
    });

    // 3. 数学片段之外的转义$，交给 engine.js 的 escape_dollar 规则处理
    content = content.replace(/\\\$/g, () => '\\\\$');

    return content.replace(PLACEHOLDER_RE, (matched, index) => preservedList[Number(index)]);
};
