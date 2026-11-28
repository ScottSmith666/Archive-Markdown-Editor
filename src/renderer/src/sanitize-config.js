import {MEDIA_PROTOCOL} from "./media-url.js";

// 渲染层 HTML 净化的统一配置。
// 背景：markdown-it 开着 html: true（src/renderer/src/components/workspace/engine.js），
// 于是 markdown 正文里的原始 HTML、以及自定义渲染规则拼出的 HTML 字符串
// （src/renderer/src/components/workspace/get_media_skeleton.js）都会原样进入 DOMPurify。
// 正文属于“文档作者可写、打开者只能看”的不可信内容，因此净化配置必须按白名单思路写。
// 旧配置同时给了 ALLOWED_URI_REGEXP 一个几乎匹配一切的 [^&?#]*[./] 分支和 ALLOW_UNKNOWN_PROTOCOLS: true，
// 实测等于关掉了 DOMPurify 对属性值的检查：file: 与 data:text/html 等载体能带着 href/src 存活，
// 配合尚未注册的 will-navigate，点一下链接就能让主窗口直接导航到本地文件。

// 协议白名单：只放行这几种，将来要加协议必须显式改这里。
// 注意必须把协议写进 ALLOWED_URI_REGEXP 本身——DOMPurify 默认的 URI 正则不认识自定义协议，
// 实测只把它们塞进 ALLOWED_PROTOCOLS 的话，mdz-media-protocol 的 <video><source src> 与 <audio src> 会被整个剥掉。
// "#" 分支给页内锚点（<a href="#小节">），"data:image/" 只放行 base64 图片而不是所有 data:。
const ALLOWED_URI_REGEXP = new RegExp(
    "^(?:"
    + "(?:https?|mailto|tel):"
    + "|data:image/"
    + "|" + MEDIA_PROTOCOL + ":\\/\\/"
    + "|#"
    + ")",
    "i"
);

// 这些属性的值永远不是 URI，但关掉 ALLOW_UNKNOWN_PROTOCOLS 之后，
// DOMPurify 会把 ALLOWED_URI_REGEXP 当成“所有属性值”的闸门，于是实测会发生：
//   type="checkbox"    被剥 → GFM 任务列表的复选框变成文本输入框
//   controls=""        被剥 → 音视频播放器失去控制条，无法播放与拖动进度
//   viewBox / d / transform / filter / offset / stdDeviation 等被剥
//                      → “帮助 > 关于AME...” 里手写的 logo SVG 大面积错乱
//                        （渐变全部塌成纯色、滤镜与 transform 失效、图形错位重叠）
//   id / width / height / colspan 等被剥 → 锚点跳转与表格排版失效
// 所以这里必须把呈现类属性逐个豁免。下面这份名单是用 document/about.md 与 document/usage.md
// 渲染出来的真实 HTML 逐个属性比对出来的（目标：与收紧前逐元素、逐属性零差异），
// 以后内置文档再引入新的 SVG 属性，若发现图形缺块，先来这里补名字。
// 刻意没有加进来的：
//   class / name / title 等本来就在 DOMPurify 内置的 URI_SAFE_ATTRIBUTES 里；
//   data-* 走 ALLOW_DATA_ATTR 分支，不受闸门影响；
//   cursor / text-decoration 虽然也是呈现属性，但它们的值可以写 url(...) 去拉远端资源，不放行；
//   href / src / srcset / poster / xlink:href / formaction 这些真存 URI 的属性名绝不能豁免，
//   否则协议白名单直接失效。
const URI_SAFE_ATTRIBUTES = [
    // 交互与排版
    "type", "controls", "id", "target", "width", "height",
    "align", "valign", "colspan", "rowspan", "start", "reversed", "span",
    "open", "disabled", "checked", "multiple", "loading", "decoding",
    // 内联 SVG 几何与路径
    "viewBox", "d", "points", "version", "preserveAspectRatio", "xml:space",
    "x", "y", "x1", "y1", "x2", "y2", "cx", "cy", "r", "rx", "ry", "dx", "dy",
    "fr", "fy", "fx", "transform",
    // 内联 SVG 填充与描边
    "fill", "fill-rule", "fill-opacity", "clip-rule", "stroke", "stroke-width",
    "stroke-miterlimit", "stroke-linecap", "stroke-linejoin", "stroke-dasharray",
    "stroke-dashoffset", "stroke-opacity", "opacity", "stop-color", "stop-opacity",
    "offset", "shape-rendering", "image-rendering", "pointer-events", "visibility",
    "display", "overflow",
    // 渐变 / 遮罩 / 裁剪
    "gradientUnits", "gradientTransform", "spreadMethod", "mask", "maskUnits",
    "maskContentUnits", "clipPathUnits", "clip-path",
    // 滤镜原语
    "filter", "filterUnits", "color-interpolation-filters", "flood-color",
    "flood-opacity", "mode", "in", "in2", "result", "stdDeviation", "seed",
    "scale", "surfaceScale", "xChannelSelector", "yChannelSelector",
    // 文字
    "font-family", "font-size", "font-weight", "font-style", "text-anchor",
    "dominant-baseline", "letter-spacing", "word-spacing",
    // 动画
    "dur", "begin", "end", "repeatCount", "values", "keyTimes", "keyPoints",
    "rotate", "path"
];

// 内容里绝对不允许出现的标签：它们才是能承载脚本或直接发起请求的载体。
// <form> 可以直接把内容里的数据发出去；<base> 能改写整页的相对地址解析；
// <link>/<meta> 可拉外部资源或重定向；<iframe>/<frame>/<object>/<embed> 是
// data:text/html 与 file: 真正能执行的地方。
// 注意：媒体预览窗口里预览 PDF 用的 <iframe> 写在 Vue 模板里
// （src/renderer/src/components/tools/media_preview/Preview.vue），不经过净化，不受这里影响。
// 两个不能禁的标签：
//   <svg>——文件卡片图标、mermaid 图形、内置文档里的 logo 都要用；
//   <style>——内置文档（document/about.md 等）里手写 SVG 的配色就写在 <style> 的
//     .st0/.st1/.s0/.s1 规则与 stop-color 里，禁掉会让所有 logo 变成一坨纯色剪影。
//     实测这个标签在收紧前也是能存活（DOMPurify 会净化 style 内容里的 URL 与 expression），
//     所以放行它不构成回退；残留风险是内容里可以用 CSS 做界面伪装/遮挡，已单独记在 REVIEW.md。
const FORBIDDEN_TAGS = [
    "form", "base", "link", "meta",
    "iframe", "frame", "frameset", "object", "embed", "portal",
    "applet", "marquee", "noscript"
];

// 交给 DOMPurify.sanitize() 的配置
// ADD_TAGS / ADD_ATTR 沿用原有的媒体标签支持：DOMPurify 默认标签表里没有 <source>，
// 而本地视频是 <video><source src></video> 的形状，缺了就放不出视频。
export const purifyConfig = {
    ADD_TAGS: ["img", "audio", "video", "source"],
    ADD_ATTR: ["src", "autoplay", "loop"],
    ADD_URI_SAFE_ATTR: URI_SAFE_ATTRIBUTES,
    ALLOWED_URI_REGEXP: ALLOWED_URI_REGEXP,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    FORBID_TAGS: FORBIDDEN_TAGS
};
