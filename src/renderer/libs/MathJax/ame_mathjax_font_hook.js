/*
 * AME · MathJax 离线字体地址改写钩子
 *
 * 【它解决什么问题】
 * MathJax 4 把字体拆成了独立包（@mathjax/mathjax-newcm-font、
 * @mathjax/mathjax-mhchem-font-extension）。\mathbb 这类动态字符集、\ce 化学式字体
 * 在运行时还会再拉一次组件 js，并且 @font-face 里的 woff2 地址被组件内部写死成
 * cdn.jsdelivr.net。loader.paths、pathFilters、fontURL、dynamicPrefix 这些配置项
 * 在组件加载时都会被组件自己覆盖回 jsdelivr，配置层根本改不动
 * （已逐条实测无效），只能在“写进页面的入口”上把地址改写掉。
 *
 * 【改写哪几个入口】MathJax 把外部资源写进页面只有下面这几条路，所以只改这几条：
 *   1) HTMLScriptElement 的 src        -> 动态字符集、化学式字体的组件 js（<script>）
 *   2) document.createTextNode 的文本   -> @font-face 里的 woff2
 *      （MathJax 把整块 CSS 作为文本节点塞进 <style>，创建时文本直接进构造函数，
 *        绕得过 data setter，所以创建入参也要改写一次）
 *   3) CSSStyleSheet.prototype.insertRule -> 兜底，动态字符集的字体 CSS 偶尔走这里
 *
 * 【两个必须避开的坑】
 *   - 不要去覆写 document.createElement：页面上其他库（mermaid 内部大量用
 *     createElement/d3）会出现行为差异，实测会把流程图判成 “Syntax error in text”。
 *     所以这里一律用原型覆写，并且只改 src / data / insertRule 三个写入点。
 *   - 不要去碰 Text.prototype.nodeValue：nodeValue 的属性描述符其实在
 *     CharacterData.prototype 上，读 Text.prototype 上的它得到 undefined，
 *     取它的 setter 会当场抛错，导致 MathJax 整页不渲染。
 *
 * 【生效条件】宿主页面先设置 window.__AME_MATHJAX_FONTS_BASE__（本地字体目录的 url 基址，
 * 目录结构为 <BASE><包名>/chtml/...，与本目录下 fonts/ 一致）；没设置就整段 no-op，
 * 页面行为和没有这个文件时完全一样。
 *
 * 【谁在用这一份】
 *   - app 内预览：src/renderer/index.html 用 <script src="./libs/MathJax/ame_mathjax_font_hook.js">
 *     直接加载它（本目录由 utils/copy-mathjax 整体拷进 out/renderer/libs/MathJax，随包发布）；
 *   - 导出 HTML：src/main/themes/export_assets.js 把本文件读出来内联进产物，
 *     两处共用同一份逻辑，避免两边行为漂移。
 *
 * 另外：fixCss / fixSrc 对不含 cdn.jsdelivr.net 上 @mathjax 包的内容一律原样放行，
 * 代价只是每次创建文本节点多做一次 indexOf。
 */
(function () {
    if (typeof window === "undefined" || window.__AME_MATHJAX_FONT_HOOK_INSTALLED__) {
        return;
    }
    var BASE = window.__AME_MATHJAX_FONTS_BASE__;
    if (typeof BASE !== "string" || BASE === "") {
        return;
    }
    window.__AME_MATHJAX_FONT_HOOK_INSTALLED__ = true;
    if (BASE.charAt(BASE.length - 1) !== "/") {
        BASE += "/";
    }

    // 版本号（MathJax 拼的是 @mathjax/<包名>@<版本>/js/<路径>）在这里被丢掉，
    // 本地目录不带版本号；因此 vendored 字体包的版本和 MathJax 请求的版本号不一致也能命中。
    var SRC_RE = /^(?:https?:)?\/\/cdn\.jsdelivr\.net\/npm\/@mathjax\/([^/?#]+?)(?:@[^/]+)?\/(?:js\/)?(.+)$/;
    var CSS_RE = /url\((['"])(?:https?:)?\/\/cdn\.jsdelivr\.net\/npm\/@mathjax\/([^/?#]+?)(?:@[^/]+)?\/(?:js\/)?([^'"]+?)\1\)/g;

    function local(pkg, rest) {
        return BASE + pkg + "/" + rest;
    }

    function fixCss(text) {
        if (typeof text !== "string" || text.indexOf("cdn.jsdelivr.net") < 0) {
            return text;
        }
        return text.replace(CSS_RE, function (_all, quote, pkg, rest) {
            return "url(" + quote + local(pkg, rest) + quote + ")";
        });
    }

    function fixSrc(url) {
        var matched = SRC_RE.exec(String(url === null || url === undefined ? "" : url));
        return matched ? local(matched[1], matched[2]) : url;
    }

    var srcDesc = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, "src");
    Object.defineProperty(HTMLScriptElement.prototype, "src", {
        configurable: true,
        enumerable: srcDesc.enumerable,
        set: function (value) { srcDesc.set.call(this, fixSrc(value)); },
        get: function () { return srcDesc.get.call(this); }
    });

    var dataDesc = Object.getOwnPropertyDescriptor(CharacterData.prototype, "data");
    Object.defineProperty(CharacterData.prototype, "data", {
        configurable: true,
        enumerable: dataDesc.enumerable,
        set: function (value) { dataDesc.set.call(this, fixCss(value)); }
    });
    var createTextNode = document.createTextNode.bind(document);
    document.createTextNode = function (data) {
        return createTextNode(fixCss(data));
    };

    var insertRule = CSSStyleSheet.prototype.insertRule;
    CSSStyleSheet.prototype.insertRule = function (rule, index) {
        return insertRule.call(this, fixCss(rule), index);
    };
}());
