# MathJax 字体（vendored）

这里放的是 MathJax 4 的**字体组件**，随应用一起发布，供两处使用：

1. 导出 HTML 时由 `src/main/themes/export_assets.js` 按原目录层级复制进
   `导出文件名.media_dir/MathJax/fonts/`，让导出的产物离线也能渲染
   `\mathbb`、`\mathfrak` 等动态字符集和 `\ce` 化学式（见该文件里的 `MATHJAX_DIRS`）。
2. `utils/copy-mathjax` 会把整个 `src/renderer/libs/MathJax` 递归拷到 `out/renderer/libs/MathJax`，
   因此这些文件会随 `out/` 进入应用包。

## 来源与版本

必须与 `src/renderer/libs/MathJax`（MathJax 4.1.1）保持同一版本，否则会出现
`uses x.y.z of MathJax; version in use is 4.1.1` 之类的告警甚至加载失败。

| 目录 | npm 包 | 版本 | 内容 |
| --- | --- | --- | --- |
| `mathjax-newcm-font/` | `@mathjax/mathjax-newcm-font` | 4.1.1 | `chtml/dynamic/`（40 个动态字符集 js）、`chtml/woff2/`（105 个 woff2） |
| `mathjax-mhchem-font-extension/` | `@mathjax/mathjax-mhchem-font-extension` | 4.1.1 | `chtml.js`、`chtml/woff2/`（2 个 woff2） |

两个包各自附带 Apache-2.0 的 `LICENSE`。MathJax 字体数据本身遵循 SIL OFL。

## 更新办法

```bash
npm pack @mathjax/mathjax-newcm-font@4.1.1
npm pack @mathjax/mathjax-mhchem-font-extension@4.1.1
# 解包后按上表把 chtml.js / chtml/dynamic / chtml/woff2 覆盖到对应目录
```

不要改名、不要平铺：MathJax 用 `@mathjax/<包名>/<路径>` 反查这些位置，
地址改写脚本（同级的 `../ame_mathjax_font_hook.js`）也按这个层级拼接本地路径。
它被两处共用：app 内预览由 `src/renderer/index.html` 直接 `<script src>` 加载，
导出 HTML 由 `src/main/themes/export_assets.js` 读出来内联进产物。
