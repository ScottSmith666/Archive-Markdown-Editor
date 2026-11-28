# 导出PDF打印页所用的 Prism 素材

这份是 `node_modules/prismjs` 的 `components/*.min.js` 原样副本，只给
`src/renderer/ame-print.html`（导出PDF的打印页）用。语言集合与
`src/main/themes/export_assets.js` 里给导出HTML的那一份、以及 app 内预览
（`src/renderer/src/components/workspace/Viewer.vue`）保持同一套。

## 为什么必须拷一份进来，而不是 import npm 包

Prism 的 `components/prism-xxx.js` 是给 `<script>` 用的裸脚本，语句直接写
`Prism.languages.clike = {...}`，求值时靠的是**全局的 `Prism`**。
一旦被打包器收进图里：`prismjs` 主入口是 CommonJS，会被包成“延迟初始化”的包装，
初始化调用点被放到引用它的入口 chunk 里；而语言组件是只有副作用的普通模块，
求值语句会被摊到共享 chunk 的顶层——顶层先跑，全局 `Prism` 还没就位，
实测当场 `ReferenceError: Prism is not defined`（app 主入口因为 chunk 形状不同刚好躲过，
打印页这个新入口就正好踩上）。

改成有序的经典 `<script>` 就没有这些讲究：脚本顺序即执行顺序。
所以这里放文件，`ame-print.html` 按 core → markup → css → clike → javascript →
typescript → c → cpp → java → python → markdown 的顺序加载。

## 为什么 CSS 不在这里

`prismjs/themes/prism.css` 只是样式，没有求值顺序问题，`print.js` 直接 import npm 包，
跟着 bundle 走，不复制。

## 位置不能挪

`src/renderer/libs/` 在 dev 下由 dev server 直接以 `/libs/...` 提供，
在 prod 下和 `out/renderer/libs/` 同源（MathJax 走的是同一套，见 `utils/copy-mathjax`）。
本目录不需要 copy 脚本：它已经在渲染进程产物根目录的相对路径上了。
