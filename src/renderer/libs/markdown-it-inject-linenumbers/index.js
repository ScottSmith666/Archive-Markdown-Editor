/**
 * markdown-it-inject-linenumbers —— 本仓库维护的分支副本（上游 0.3.0，MIT，见同目录 LICENSE/README.md）
 *
 * 原先由 package.json 依赖引入，因为要打补丁已移入 src/renderer/libs，
 * 由 src/renderer/src/components/workspace/engine.js 与
 * src/renderer/src/worker/exporter/export_engine.js 按相对路径引用。
 *
 * 上游只给 paragraph / heading / list_item / table 四类打行号。实测代码块（含 mermaid、
 * plantuml 围栏）、缩进代码块、裸 HTML 块、<hr>、表格行、定义列表完全没有
 * data-source-line，编辑区与预览区的同步滚动
 * （src/renderer/src/components/workspace/Viewer.vue 的 scrollCustomLineElementToCenter）
 * 在这些块上找不到锚点，滚过去就停住或跳回上一处。
 *
 * 本副本在保持上游四类行为不变的前提下扩充为 11 类，并处理两个实现层面的坑：
 *   1) fence / code_block / html_block 这类规则返回的是自己拼好的 HTML 字符串，
 *      往 token 上塞 attrs 不保证生效，所以对这几类改为把属性注入返回值的第一个开始标签；
 *   2) 规则包装的内外层由 .use() 顺序决定，而 engine.js 里 markdown-it-textual-uml
 *      在本插件之后注册并替换了 fence 规则，会把本插件的包装压到内层甚至丢掉。
 *      因此每次 render 前补一次包装，保证本插件始终位于最外层：
 *      注入时看到的是最终 HTML（class="line-numbers"、class="mermaid" 都已写好），
 *      既覆盖得到 mermaid/plantuml 围栏，也不会和 render_rules.js 拼出重复的 class 属性。
 */

const LINE_ATTR = "data-source-line";
const LINE_CLASS = "source-line";
const WRAP_FLAG = "__ameLinenumbersWrapped";
const RENDER_FLAG = "__ameLinenumbersRenderHooked";

// 这些规则的标签由 markdown-it 的 renderToken 渲染，token.attrs 会被原样渲染进去，
// 所以沿用上游做法：直接往 token 上写 class 与 data-source-line。
// 后三类（表格行、定义列表的术语与释义）是本副本补的，粒度和 list_item 一致。
const ATTR_RULES = [
    "paragraph_open",
    "heading_open",
    "list_item_open",
    "table_open",
    "tr_open",
    "dt_open",
    "dd_open"
];

// 这几条规则自己拼 HTML 字符串（fence 还被本项目 render_rules.js 与
// markdown-it-textual-uml 先后重写过），只能对返回值动手。
const HTML_RULES = ["fence", "code_block", "html_block", "hr"];

// 匹配一段 HTML 里的第一个开始标签，属性值里出现的 > 靠引号分支排除掉，避免切错位置
const FIRST_TAG_REGEXP = /<[a-zA-Z][a-zA-Z0-9-]*(?:"[^"]*"|'[^']*'|[^>"'])*/;

function markToken(token) {
    token.attrJoin("class", LINE_CLASS);
    token.attrSet(LINE_ATTR, String(token.map[0]));
}

// 把行号属性注入第一个开始标签；标签已经带 data-source-line 就原样返回，不重复打
function injectIntoFirstTag(html, line) {
    if (typeof html !== "string" || !html) {
        return html;
    }
    const matched = FIRST_TAG_REGEXP.exec(html);
    if (!matched) {
        return html;
    }
    const tagText = matched[0];
    if (/\bdata-source-line\s*=/i.test(tagText)) {
        return html;
    }
    // 自闭合写法（<hr/>、<img ... />）的结尾斜杠得留在最后，所以先把它摘出来
    const tailMatch = /(\/?)\s*$/.exec(tagText);
    const headText = tagText.slice(0, tailMatch.index);
    const tailText = tailMatch[0];
    const classMatch = /(^|\s)class\s*=\s*(?:"([^"]*)"|'([^']*)')/i.exec(headText);
    let nextHeadText = headText;
    if (classMatch) {
        const doubleQuoted = classMatch[2] !== undefined;
        const quote = doubleQuoted ? '"' : "'";
        const classValue = doubleQuoted ? classMatch[2] : classMatch[3];
        const patchedClass = "class=" + quote + (classValue ? classValue + " " + LINE_CLASS : LINE_CLASS) + quote;
        // 用函数做替换，防止 class 值里的 $ 被当成替换模式
        nextHeadText = headText.replace(classMatch[0], () => classMatch[1] + patchedClass);
    } else {
        nextHeadText = headText + ' class="' + LINE_CLASS + '"';
    }
    const attrs = " " + LINE_ATTR + '="' + line + '"';
    return html.slice(0, matched.index) + nextHeadText + attrs + tailText + html.slice(matched.index + tagText.length);
}

function wrapRule(md, type) {
    const previousRule = md.renderer.rules[type];
    const byAttrs = ATTR_RULES.indexOf(type) !== -1;
    const wrapped = function (tokens, idx, options, env, slf) {
        const token = tokens[idx];
        const line = token.map ? token.map[0] : null;
        if (line !== null && byAttrs) {
            markToken(token);
        }
        const html = previousRule
            ? previousRule.call(this, tokens, idx, options, env, slf)
            : slf.renderToken(tokens, idx, options, env, slf);
        if (line === null || byAttrs) {
            return html;
        }
        return injectIntoFirstTag(html, line);
    };
    wrapped[WRAP_FLAG] = true;
    return wrapped;
}

function ensureWrapped(md) {
    ATTR_RULES.concat(HTML_RULES).forEach((type) => {
        const currentRule = md.renderer.rules[type];
        if (currentRule && currentRule[WRAP_FLAG]) {
            return;
        }
        md.renderer.rules[type] = wrapRule(md, type);
    });
}

export default function injectLinenumbers(md) {
    ensureWrapped(md);
    const originalRender = md.renderer.render;
    if (originalRender[RENDER_FLAG]) {
        return;
    }
    const hookedRender = function (tokens, options, env) {
        ensureWrapped(md);
        return originalRender.call(this, tokens, options, env);
    };
    hookedRender[RENDER_FLAG] = true;
    md.renderer.render = hookedRender;
}
