# markdown-it-inject-linenumbers

> Insert line numbers to support sync scrolling for the [markdown-it](https://github.com/markdown-it/markdown-it) markdown parser.

Inject the source line numbers into the final HTML.  This gives you the anchor points to implement synchronized scrolling.

`lorem` => `<p class="line" data-source-line="0">lorem</p>`

Inline elements are not supported. Only the following block level elements are currently supported:

- headings
- paragraphs
- list items
- tables

_This plugin was built using the [markdown-it demo](https://github.com/markdown-it/markdown-it/tree/master/support/demo_template) sync scrolling as a starting point._

## Install

node.js, browser:

```bash
npm install markdown-it-inject-linenumbers --save
bower install markdown-it-inject-linenumbers --save
```

## Use

```js
var md = require('markdown-it')()
            .use(require('markdown-it-inject-linenumbers'));

md.render('lorem') // => '<p class="source-line" data-source-line="0">lorem</p>'
```

_Differences in browser._ If you load script directly into the page, without
package system, module will add itself globally as `window.markdownitInjectLinenumbers`.


## License

[MIT](https://github.com/digitalmoksha/markdown-it-inject-linenumbers/blob/master/LICENSE)


---

## 本仓库维护的分支副本（AME fork）

本目录是 `markdown-it-inject-linenumbers@0.3.0` 的 vendored 分支副本，原先由 `package.json` 依赖引入，
因需要打补丁已移入 `src/renderer/libs/`，由以下两处按相对路径直接引用：

- `src/renderer/src/components/workspace/engine.js`（预览渲染管线）
- `src/renderer/src/worker/exporter/export_engine.js`（导出渲染管线）

与上游的差异（详见 `index.js` 文件头注释）：

1. 打标记的块级规则由 4 类扩到 11 类，补上代码块（含 `mermaid`/`plantuml` 围栏）、缩进代码块、
   裸 HTML 块、`<hr>`、表格行 `<tr>`、定义列表 `<dt>`/`<dd>`。
2. 对自行拼 HTML 字符串的规则（`fence`/`code_block`/`html_block`/`hr`）改为把属性注入规则返回值
   的第一个开始标签，不再依赖 `token.attrs`。
3. 每次 `render()` 前重新检查规则包装关系，保证本插件的包装位于最外层，
   不会被之后 `.use()` 的插件（如 `markdown-it-textual-uml` 会替换 `fence` 规则）压到内层或覆盖。
