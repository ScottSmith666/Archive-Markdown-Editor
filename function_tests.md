# AME（Archive-Markdown-Editor）GUI 功能测试用例集

> 版本：v1.2.7 ｜ 被测构建：`electron-vite dev`（Electron 45.5 / Chromium 156）
> 平台：Linux X11（DISPLAY=:1，GNOME，2560x1440）
> 输入方式：**真实鼠标 + 键盘事件**（X11 XTEST 注入）。CDP:9222 只用于**读取 DOM 结果**做断言，不参与输入。
> 本文件同时是「可复用测试清单」：每一节都是一组可直接照做的用例，末尾附缺陷汇总与结论。

---

## 结论概览

| 维度 | 数量 |
| --- | --- |
| ✅ 通过 | 117 |
| ⚠️ 有偏差 / 需改进 | 7 |
| ❌ 失败 | 7 |
| ➖ 未执行（环境或需人工） | 6 |

- **核心链路全绿**：新建/打开/保存/另存为、mdz 口令与 `.mdzcache` 留底式就地保存、`content.md` 新命名约定、表格/代码/mermaid/LaTeX 渲染、多媒体（含进度条拖拽 seek）、LaTeX 与 Mermaid 编辑器、设置项即时生效、XSS 与外链安全加固、多语言帮助文档均正常。
- **必须优先修**：12.7（另存为默认值会导致误覆盖）、12.8（口令明文残留）、12.14（双击取消导出抛未捕获异常）、12.5（`.oga` 静默不可播）。
- **未能覆盖**：导出 HTML/PDF 的实际产物（原生保存对话框在本机会话不显示）、Linux 文件关联与 MIME、系统语言切换联动、媒体插入 mdz。

---

## 0. 环境与前置准备

### 0.1 启动被测应用

```bash
cd /home/scottsmith/project/Archive-Markdown-Editor
setsid node_modules/.bin/electron-vite dev -- --remote-debugging-port=9222 >/tmp/ame-run.log 2>&1 </dev/null &
```

- 取主窗口 XID：`xdotool search --name "Archive Markdown Editor"`（本次为 `0x1800003`）。
- 固定窗口位置/尺寸，让 DOM 坐标可预测：
  ```bash
  xdotool windowmove 0x1800003 0 1
  xdotool windowsize 0x1800003 2560 1400
  ```
  实测客户区原点 = **(0, 69)**，尺寸 2560x1297，因此 **屏幕坐标 = 页面 DOM 坐标 + (0, 69)**。
  窗口管理器会争抢位置，**每次读取几何后立刻用**，并在每次注入输入前把 AME 置顶+激活。

### 0.2 输入法（关键前置）

系统默认 IBus 拼音会把英文合成汉字（`a` → 「阿」），键盘用例全部失真。开测前必须切纯英文：

```bash
DISPLAY=:1 ibus engine xkb:us::eng
```

- 中文**不能用键盘直写**，只能通过 GTK 剪贴板持有者 + `Ctrl+V` 粘贴。
- 打字再度乱码时，重新执行上面这条命令。

### 0.3 测试素材

放在 `/home/scottsmith/Desktop/ame-uitest/`：

| 素材 | 用途 |
| --- | --- |
| `sample.md` | 表格 / 代码块 / LaTeX / mermaid / 相对路径图片 综合渲染 |
| `formula.md` | 行内与块级公式基础用例 |
| `latex-probe.md` | A~G 组 LaTeX 语法探针（physics / mathtools / gensymb） |
| `media-test.md` | 图片 + 音频 + 视频（绝对路径） |
| `audio-test.md` | `.ogg` / `.wav` / `.oga` 音频元素 |
| `mermaid.md` | flowchart / sequence 图 |
| `xss.md` | `onerror` / `<script>` / `javascript:` / `iframe` / `onclick` 注入 |
| `plain.txt` | 纯文本打开 |
| `mdz-test.mdz` | 自建行口令包，口令 `Ame#2026` |
| `legacy.mdz` | 旧版口令包（口令未知，走失败路径） |
| `save-test.md` | 保存 / 另存为 用例正文 |
| `media/` | `red.png` `clouds.jpg` `bell.oga` `click.ogg` `ding.wav` `clip.mp4`(20s) |

### 0.4 安全约定（必须遵守）

- **禁止删除任何文件。** 需要清理一律移动：`mv <目标> /home/scottsmith/Desktop/waste/`
- 桌面上属于用户的真实文件（`dsfgd.mdz`、`软件配置.mdz`、`资源分享.mdz`、`测试文件/` 等）**只读**，不要打开、不要改名、不要保存。
- 导出类用例统一输出到 `ame-uitest/export-out/`，方便整体回收。
- 「另存为」对话框会**预填上次的文件名**，直接点保存会覆盖上一次的文件，务必先核对。

### 0.5 驱动技巧与已知环境限制

1. **原生 GTK 文件对话框几何不可信**：`xwininfo` 报的坐标与实际渲染不符，`Ctrl+L` 被应用吞掉，直接打字会落进搜索框。优先走 welcome 页「历史记录」或应用内自绘对话框。
2. **本轮 `showSaveDialog`（导出 HTML/PDF 用）创建出的窗口 `导出为` 一直处于 Unmapped 状态**，屏幕上看不见，因此导出无法用 GUI 走完（见 §9）。同一会话里 `showOpenDialog`（打开文件）是正常可见的。
3. **不要用 Xlib `map()` / 强杀去操作原生对话框窗口**：会让应用 `.modal`(z-index 50) 遮罩残留并阻塞全窗点击，只能重启应用。正常「取消」不会残留（本轮已多次验证取消路径干净）。
4. **Monaco 补全浮层会吞掉 `Enter`**（变成接受补全）。要在编辑器里换行，先按 `Esc` 关掉浮层再按回车。
5. **设置页 / 工具页在标签切换时会被卸载重建**，切回后下拉框坐标要先重新取；设置页滚动位置不保证保持。
6. **多个同名标签**时 `document.querySelector('.monaco-editor')` 会命中隐藏标签，读结果必须按 `offsetParent` + 尺寸过滤可见性。
7. **菜单横坐标会随「视图」菜单是否出现而漂移**，菜单项必须动态定位。
8. 杀进程要按 PID 精确杀（`ps -eo pid,args | grep "[A]rchive-Markdown-Editor/node_modules/electron/dist/electron"`），避免双实例把操作打到旧窗口。

### 0.6 结论标记

✅ 通过 ｜ ⚠️ 有偏差/需改进 ｜ ❌ 失败 ｜ ➖ 未执行（附原因）

---

## 1. 启动、界面与菜单

| # | 用例 | 操作 | 实测 | 结论 |
| --- | --- | --- | --- | --- |
| 1.1 | 冷启动 | 启动 dev | 主窗口正常出现，无白屏、无错误弹层 | ✅ |
| 1.2 | 欢迎页 | 观察首屏 | 「开始」区 + 「历史记录」区 + 页脚 `Powered by` + 版本 1.2.7 齐全 | ✅ |
| 1.3 | 标签栏初态 | 观察 | 仅「欢迎」一个标签且激活 | ✅ |
| 1.4 | 菜单随上下文变化 | 分别在欢迎页 / 文档页看菜单栏 | 无文档时**没有「视图」菜单**，打开文档后出现 | ✅（设计如此） |
| 1.5 | 文件菜单 | 在 `save-test.md` 上展开 | **7 项**：新建… / 打开… / 保存 / 另存为… / 导出… / 关闭 / 退出AME | ✅ |
| 1.6 | 编辑菜单 | 展开 | **只有「设置...」**一项，无撤销/重做/查找替换入口 | ⚠️ 12.9 |
| 1.7 | 视图菜单 | 展开 | 预览模式 / 编辑模式 / 混合模式，互斥勾选正确 | ✅ |
| 1.8 | 工具菜单 | 展开 | 本地Mdz媒体管理工具… / LaTeX编辑器… / Mermaid编辑器… | ✅ |
| 1.9 | 帮助菜单 | 展开 | 欢迎… / 关于AME… / AME使用指南… / Markdown·LaTeX·Mermaid语法学习… / 打赏… / 官方网站… | ✅ |
| 1.10 | 历史记录 | 保存文件后回欢迎页 | `mdz-test.mdz` 出现在历史区（保存即记录，无需另开） | ✅ |
| 1.11 | 标签切换 | 点非激活标签 | 内容与激活样式正确迁移 | ✅ |
| 1.12 | 标签关闭按钮 | 点标签内 `×` | 关闭并清理 `._mdz_content.*` 临时目录 | ✅ |
| 1.13 | 脏标记 | 在未保存文档里敲字 | 标签上的 `×` 变为 `●` | ✅ |
| 1.14 | 已存在标签的入口行为 | 「欢迎」标签开着时点 帮助>欢迎；「设置」标签开着时按 `Ctrl+,` | 不新建标签，但**也不切到已开标签，界面无任何反馈** | ❌ 12.6 |
| 1.15 | 工具入口去重 | 「Mermaid编辑器」标签开着时再点 工具>Mermaid编辑器 | 不产生重复标签，且**会**把已开标签切到前台 | ✅ |

---

## 2. 编辑器与 Markdown 渲染

| # | 用例 | 实测 | 结论 |
| --- | --- | --- | --- |
| 2.1 | `Ctrl+N` 新建 | 出现「无标题文档」，Monaco 可输入 | ✅ |
| 2.2 | 英文/符号键盘输入 | 逐字符进入缓冲区（需先切英文输入法） | ✅ |
| 2.3 | 中文粘贴 | 剪贴板 + `Ctrl+V`，中文显示与渲染正常 | ✅ |
| 2.4 | 表格 | `<table>` 边框、表头加粗正确 | ✅ |
| 2.5 | 代码块 | 语言标签 + 复制工具条 + 行号 + 语法高亮 | ✅ |
| 2.6 | 列表嵌套 | 有序/无序/多级缩进正确 | ✅ |
| 2.7 | 引用块 | 左边框 + 缩进样式正确 | ✅ |
| 2.8 | Mermaid 渲染 | `mermaid.md` 渲染为 SVG，无报错文本 | ✅ |
| 2.9 | 行内公式 `$…$` | MathJax 行内输出正常 | ✅ |
| 2.10 | 块级公式（`$$` 独占行） | `mjx-container[display=true]` 居中块级 | ✅ |
| 2.11 | 块级公式（`$$…$$` 同一行） | 退化成行内，且首尾残留字面 `$` | ❌ 12.1 |
| 2.12 | 数学环境内 `\\` 写在同一行 | 每个表格只出 1 行，多行被并成一行 | ❌ 12.2 |
| 2.13 | 数学环境 `\\` 分行书写 | 多行正确 | ✅ |
| 2.14 | physics 宏 `\dv \pdv \expval \abs \norm \comm \dd` | 全部正确渲染 | ✅ |
| 2.15 | `\intd{x}{0}{1}` | 显示字面 `\intd`，未渲染 | ⚠️ 12.3 |
| 2.16 | gensymb `\degree` `\celsius` | 正常 | ✅ |
| 2.17 | mathtools `\coloneqq` `\underbrace` `\overset` | 正常 | ✅ |
| 2.18 | 别名 `\micro` `\ohm` `\mu` `\Omega` | 正常 | ✅ |
| 2.19 | `\( \)` / `\[ \]` 定界符 | 原样输出，不识别 | ⚠️ 12.4 |
| 2.20 | 图片绝对路径 | `src` 为 `mdz-media-protocol://…/media?path=`，`naturalWidth>0` | ✅ |
| 2.21 | 图片相对路径 | 不加载；源码注释明确「只支持绝对路径」 | ✅（设计约定） |
| 2.22 | 链接安全路由 | 渲染为 `data-href` + `ame-custom-click`，不直接改导航 | ✅（安全设计） |
| 2.23 | `Ctrl+F` 查找 | Monaco 查找框正常弹出 | ✅ |
| 2.24 | 预览/编辑/混合切换 | 视图菜单 + 右上角图标互切无残留 | ✅ |
| 2.25 | 滚动同步 | 编辑区滚动预览跟随 | ✅ |

---

## 3. 文件新建 / 打开 / 保存 / 关闭

| # | 用例 | 实测 | 结论 |
| --- | --- | --- | --- |
| 3.1 | `Ctrl+O` 打开 `.md` | 新标签并渲染 | ✅ |
| 3.2 | 打开 `.txt` | 以纯文本进编辑器 | ✅ |
| 3.3 | 无标题首次 `Ctrl+S` | 弹出应用内「另存为」：文件名 / 类型（mdz·md·txt）/ 保存路径 + 选择… / 口令双输入 + 安全提示 | ✅ |
| 3.4 | 保存为 `.md` | 落盘成功，标签标题更名为 `save-test.md` | ✅ |
| 3.5 | 已命名文件 `Ctrl+S` | 静默就地保存，无对话框 | ✅ |
| 3.6 | 已命名文件「另存为…」 | 入口存在（文件菜单第 4 项），对话框可正常打开/取消 | ✅ |
| 3.7 | 另存为的默认值 | 对 `save-test.md` 点另存为，预填的却是**上一次**的文件名 `mdz-test`、上一次目录、上一次类型 `mdz`，与当前文档无关 | ❌ 12.7 |
| 3.8 | 口令输入框残留 | 同上场景，两个口令框被**明文预填**上次的 `Ame#2026` | ❌ 12.8 |
| 3.9 | 口令两次不一致 | 提示「保存失败，两次输入的密码不一致」，不落盘 | ✅ |
| 3.10 | `Ctrl+W` 关闭干净标签 | 直接关闭 | ✅ |
| 3.11 | `Ctrl+W` 关闭脏标签 | 弹「确认关闭 / 您计划关闭的页面内容未保存…是否继续关闭？」；`否` = 取消关闭（标签保留），`是` = 丢弃并关闭 | ✅（文案见 12.11） |
| 3.12 | `Ctrl+N` / `Ctrl+O` / `Ctrl+W` / `Ctrl+Shift+H` 快捷键 | 全部生效 | ✅ |
| 3.13 | `Ctrl+,` 打开设置 | 设置标签**不存在时**生效；**已存在时**无反应 | ⚠️ 12.6 |

---

## 4. mdz 归档全流程

| # | 用例 | 实测 | 结论 |
| --- | --- | --- | --- |
| 4.1 | 生成 mdz | 847 B，magic `37 7a bc af 27 1c`，头部加密已开启 | ✅ |
| 4.2 | 内部主文档命名 | 解包后主文档固定为 `mdz_contents/content.md`，新约定（与外部文件名解耦）生效 | ✅ |
| 4.3 | 口令正确打开 | 解压到 `._mdz_content.mdz-test/`，标签 `mdz-test.mdz` | ✅ |
| 4.4 | 口令错误 | 提示「密码错误，请重试」，不打开 | ✅ |
| 4.5 | 口令框取消 | 关闭且不打开文件 | ✅ |
| 4.6 | 旧版包口令未知 | 明确报口令错误，不崩溃 | ✅ |
| 4.7 | **就地保存留底流程** | 保存过程中出现 `mdz-test.mdzcache`（847 B = 旧包）；新包由 32 B 增长到 879 B；打包成功后留底被删除，目录无残留 | ✅ |
| 4.8 | 外部改名后打开 | 内部固定 `content.md` 后不再因内外名不一致而失败 | ✅ |
| 4.9 | 关闭 mdz 标签 | `._mdz_content.*` 工作目录被清理 | ✅ |

---

## 5. 多媒体

| # | 用例 | 实测 | 结论 |
| --- | --- | --- | --- |
| 5.1 | 图片经自定义协议加载 | `naturalWidth > 0` | ✅ |
| 5.2 | 视频元素 `clip.mp4` | `<video controls>`，`duration≈20`，`readyState=4` | ✅ |
| 5.3 | 视频播放/暂停 | `currentTime` 正常推进 | ✅ |
| 5.4 | **视频进度条真实拖拽** | `currentTime` 1.93 → 16.59，seek 生效 | ✅ |
| 5.5 | 音频 `.ogg` | `readyState=4`，可播 | ✅ |
| 5.6 | 音频 `.wav` | `readyState=4`，可播 | ✅ |
| 5.7 | 音频进度条拖拽 | seek 生效 | ✅ |
| 5.8 | 音频 `.oga` | `readyState=0`、`duration=null`、无法播放，且界面无任何提示 | ❌ 12.5 |

---

## 6. 工具页

### 6.1 LaTeX 编辑器（工具 > LaTeX编辑器）

| # | 用例 | 实测 | 结论 |
| --- | --- | --- | --- |
| 6.1.1 | 打开 | 新标签「LaTeX编辑器」，左 Monaco 右 MathJax 预览，预置演示模板 | ✅ |
| 6.1.2 | 实时渲染 | 改公式后预览即时更新 | ✅ |
| 6.1.3 | 复制代码 | autotip「复制成功」出现；GTK 剪贴板内容与编辑器逐字符一致 | ✅ |
| 6.1.4 | 清空 | 编辑器清空，预览归零 | ✅ |
| 6.1.5 | 切标签不丢内容 | 切到欢迎页再切回，内容与预览完全一致 | ✅ |
| 6.1.6 | 布局 | 两栏下边界与 footer 保留 10px 间距 | ✅ |
| 6.1.7 | 预览区无滚动条 | 无 | ✅ |
| 6.1.8 | 补全（基础） | `\alp` `\hat` `\leq` `\textbf` `\underbrace` `\overset` `\begin` 全部命中 | ✅ |
| 6.1.9 | 补全（physics/mathtools） | `\pdv` `\dv` `\iint` `\coloneqq` `\qq` `\mq` 命中且带说明 | ✅ |
| 6.1.10 | 补全缺项 | `\genfrac`、`\symbf` 无候选 | ⚠️ 12.10 |

### 6.2 Mermaid 编辑器（工具 > Mermaid编辑器）

| # | 用例 | 实测 | 结论 |
| --- | --- | --- | --- |
| 6.2.1 | 打开 | 新标签「Mermaid编辑器」，左 Monaco（`Mermaid源码`）右预览（`图表预览`），预置 flowchart 已渲染为 SVG（269x547） | ✅ |
| 6.2.2 | 实时渲染 | 在编辑器追加 `F --> G[Finish]` 后，预览 `.nodeLabel` 由 6 个变 7 个（新增 Finish） | ✅ |
| 6.2.3 | 复制代码 | autotip「复制成功」；剪贴板 = `graph LR\n  X[Begin] --> Y[End]`，逐字符一致 | ✅ |
| 6.2.4 | 清空 | 编辑器清空，预览回到占位文案「在左侧输入Mermaid源码，此处将实时渲染图表」 | ✅ |
| 6.2.5 | 语法错误处理 | 显示「图表语法错误：Parse error on line 1: … Expecting 'NEWLINE', got 'NODE_STRING'」，界面不白屏不崩溃 | ✅ |
| 6.2.6 | 切换标签不丢内容 | 切到欢迎页再切回，内容与预览完全一致 | ✅ |
| 6.2.7 | 补全 | `gr`→graph/gitGraph；`seq`→sequenceDiagram；`gant`→gantt；`jou`→journey；`cla`→classDiagram/classDef；`sta`→stateDiagram/stateDiagram-v2/sankey-beta；`pie`→pie；`sub`→subgraphs | ✅ |
| 6.2.8 | 布局与滚动条 | 两栏与 footer 保留 10px；`.preview-scroll` `scrollHeight == clientHeight`（无滚动条） | ✅ |
| 6.2.9 | 入口去重与激活 | 重复点击不产生第二个标签，并把已开标签切到前台 | ✅ |

### 6.3 本地 Mdz 媒体管理工具（工具菜单）

| # | 用例 | 实测 | 结论 |
| --- | --- | --- | --- |
| 6.3.1 | 打开 | 新标签，含「选择目标mdz文件」下拉与「Mdz文件中的媒体」区 | ✅ |
| 6.3.2 | 下拉列表 | 列出当前已打开的 mdz（`mdz-test.mdz`），默认「请选择已打开的mdz文件」 | ✅ |
| 6.3.3 | 选中后列举媒体 | 显示「文件/home/scottsmith/Desktop/ame-uitest/mdz-test.mdz中的多媒体列举如下」+「+ 插入媒体至该mdz文件」；该包无媒体 → 「暂无结果」，与实际情况一致 | ✅ |
| 6.3.4 | 插入媒体到 mdz | 需要原生文件选择框，本轮未跑（见 0.5 第 2 条） | ➖ |

---

## 7. 帮助与内置文档

| # | 用例 | 实测 | 结论 |
| --- | --- | --- | --- |
| 7.1 | 帮助 > 关于AME… | 41 个 SVG 全部有尺寸（无 0 尺寸/破损），5 张图片全部 `naturalWidth>0` | ✅（SVG 渲染问题已回归修复） |
| 7.2 | 鸣谢开源软件 | 含 Pinia / vue3-zoomer / x-data-spreadsheet / xlsx / morphdom；**不含** vuex / Incremental-DOM；序号连续 | ✅ |
| 7.3 | 帮助 > 欢迎 | 重新打开欢迎页并激活（首次） | ✅ |
| 7.4 | 帮助 > Markdown语法学习… | zh-CN 版：4 个表格 / 19 个代码块 / 5 个 mjx / 3 个 svg，0 错误 | ✅ |
| 7.5 | 帮助 > LaTeX语法学习… | zh-CN 版：207 个 `mjx-container`，0 错误；矩阵/array 多行 `rows=4` 正常 | ✅ |
| 7.6 | 帮助 > Mermaid语法学习… | zh-CN 版：31 个 SVG，0 错误、0 个渲染失败的 mermaid 块；文档声明的 mermaid 版本与 `node_modules` 实际的 10.9.8 一致 | ✅ |
| 7.7 | `Ctrl+Shift+H` 打开使用指南 | 新标签「AME使用指南」 | ✅ |
| 7.8 | 打赏 / 官方网站 | 走外部浏览器且受协议白名单约束 | ✅ |
| 7.9 | 界面语言来源 | 应用**没有语言切换 UI**，语言由系统 locale 自动决定（`src/main/ipc/index.js:721` 的 `get-system-lang`：`zh/zh-Hans→zh-CN`、`zh-TW/zh-HK/zh-MO/zh-Hant→zh-TW`、`en*→en`，openharmony 走 `getPreferredSystemLanguages()`）。设置页里也没有语言项 | ✅（按设计） |
| 7.10 | 多语言文档齐备性 | `document/` 下 `about` `usage` `syntax` `latex-syntax` `mermaid-syntax` 各有 简中 / `*-zh-TW` / `*-en` 三份 | ✅（静态核对） |
| 7.11 | 切换系统语言后的界面/文档联动 | 需要改系统 locale 并重启应用，超出 GUI 自动化范围 | ➖ |

---

## 8. 设置（编辑 > 设置…，或 `Ctrl+,`）

设置页为独立标签，含「主题 / 编辑器 / 渲染器」三组，页面顶部注明「设置更改后即时生效，无需重启应用」。

| # | 设置项 | 操作（真实键盘驱动原生 `<select>` / 输入框） | 生效验证 | 结论 |
| --- | --- | --- | --- | --- |
| 8.1 | 编辑区主题设置 | `vs` → `vs-dark` → 还原 | Monaco 根 class `vs` → `vs-dark`，margin 背景 `rgb(255,255,254)` → `rgb(30,30,30)` | ✅ |
| 8.2 | 字体大小（px） | `14` → `22` → 还原 `14` | `.view-line` `font-size` 14px→22px，行高 19px→30px | ✅ |
| 8.3 | 行号 | `on` → `off` → 还原 | 可见编辑器内 `.line-numbers` 元素数 12 → 0 → 12 | ✅ |
| 8.4 | 自动折行 | `on` → `off` → 还原 | 同一条 242 字符长行：折行开时渲染 123 字符 + 1 条续行（宽 1087px ≤ 1275px 编辑区）；折行关时单行渲染 242 字符、宽 2087px 溢出 | ✅ |
| 8.5 | 代码缩略图 | `1` → `0` → 还原 | `.minimap` 宽度 120px → 0（display none）→ 120px | ✅ |
| 8.6 | 预览区主题设置 | 展开下拉 | **只有 `default` 一个选项**，其余主题在模板里被注释掉；且编辑区切深色后预览区仍为白底 | ⚠️ 12.12 |
| 8.7 | 制表符缩进长度 / 代码折叠 / 自动闭合引号括号 / 垂直与水平滚动条 / 编辑器动画 / 渲染模式 | 仅确认控件与默认值可读取（默认 `4`、`1`、`always`、`visible`、`visible`、`1`、`performance`） | 未逐项做行为断言 | ➖ |
| 8.8 | 设置页滚动 | 滚轮向下 6 格 | 正常滚动，下方设置项可达 | ✅ |

---

## 9. 导出（文件 > 导出…）

| # | 用例 | 实测 | 结论 |
| --- | --- | --- | --- |
| 9.1 | 导出入口 | 弹出应用内「导出」对话框，两个卡片：导出为HTML / 导出为PDF，右上角 `×` | ✅ |
| 9.2 | 取消导出对话框 | 点 `×` 后 `.modal` 遮罩正常隐藏（`display:none`），全窗可继续点击 | ✅ |
| 9.3 | 导出为PDF → PDF 设置面板 | 面板字段与默认值：纸张 `A4`（A3/A4/A5/A6/Letter/Legal/Tabloid）、方向 `纵向`、页边距 `标准`（无/窄/标准/宽）、页码范围（文本框，空）、`打印背景色与图片`=✓、`页脚显示日期、标题与页码`=✗、`生成PDF书签大纲`=✗；按钮 取消 / 开始导出 | ✅ |
| 9.4 | PDF 设置面板取消 | 点「取消」面板关闭，无遮罩残留 | ✅ |
| 9.4b | **双击 footer「正在导出」取消导出** | 日志里连续出现 3 次 `[Unhandled error] TypeError: Cannot read properties of null (reading 'terminate')`，调用栈落在 `FooterStatusBar.vue:33` 的 `onDblclick` → `forceTerminateWorker`。原因：`prepareExport` 在 `await` 原生保存对话框**之前**就把 `displayExporting` 置 true（此时 `exportWorker` 仍是 `null`），这段等待期内双击就会空指针 | ❌ 12.14 |
| 9.5 | 导出为HTML 实际产物 | 点击后主进程创建的 `导出为` 原生保存窗口始终 Unmapped（屏幕不可见），无法完成路径选择，全盘搜索未发现任何导出产物 | ➖（见 0.5 第 2 条；需人工验证） |
| 9.6 | 导出为PDF 实际产物 | 同上，卡在原生保存对话框 | ➖ |
| 9.7 | 离线资源打包（代码级核对） | `src/main/themes/export_assets.js` 从 `node_modules` 把 mermaid、prism（core + 各语言 components + toolbar/show-language/copy-to-clipboard/line-numbers 四个插件）、MathJax（主构建 + tex 扩展 + 两套字体，落在 `media_dir/MathJax/`）全部复制进 `export.<名>.media_dir`，`cdnScripts` 仅作回退列表 | ✅（静态核对，未跑通 GUI 产物） |

> 待人工补测：在真实桌面环境点一次「导出为HTML」，检查产物 HTML 内是否还有 `https://cdn` 外链、`export.<名>.media_dir/` 是否齐全、双击产物离线打开是否能渲染 mermaid/prism/MathJax；PDF 需检查页脚与页码范围。

---

## 10. 安全

| # | 用例 | 实测 | 结论 |
| --- | --- | --- | --- |
| 10.1 | `<script>alert(...)</script>` | 预览 DOM 中 `script` 元素数 0，`innerHTML` 中不含 `<script` | ✅（整段剥离） |
| 10.2 | `<img src=x onerror=...>` | 预览区无任何 `on*` 属性（`onAttrs` 为空数组） | ✅ |
| 10.3 | `<div onclick=...>` | 文本「点击这块区域」正常渲染，但承载元素只有 `id=viewer-content` / `class=source-line` / `data-source-line`，无事件属性 | ✅ |
| 10.4 | `<iframe src=...>` | 预览区 `iframe` 数 0 | ✅ |
| 10.5 | `[x](javascript:alert(...))` | 生成的 `<a>` 既无 `href` 也无 `data-href`，不可点击 | ✅ |
| 10.6 | `[正常](https://example.com)` | 只有 `data-href`，点击走 `ame-custom-click` → `shell.openExternal` 白名单 | ✅ |
| 10.7 | 自定义协议边界 | 媒体仅经 `mdz-media-protocol` 的 `/media?path=` 受限入口加载 | ✅ |
| 10.8 | SQL 参数化 | 抽查 sqlite 调用均为占位符绑定，无字符串拼接 | ✅ |
| 10.9 | mdz 头部/文件名加密 | 7z magic 正确且包内文件名不可枚举（`setHeaderEncryption(true)` 生效） | ✅ |
| 10.10 | 口令持久化 | 应用声明「不以任何方式持久化保存密码」；但**会话内**另存为表单会残留上次口令（见 12.8） | ⚠️ |
| 10.11 | Linux 文件关联 / MIME `application/prs.archive-markdown-format` | 属系统级配置，非 GUI 自动化范围 | ➖ |

---

## 11. 与 `REVIEW.md` 加固项的回归对照

| 加固项 | 回归结论 |
| --- | --- |
| 关闭同源策略与沙箱 + `mdz-media-protocol` | 本轮所有图片/音视频均通过该协议加载成功，未出现跨域或空白资源 ✅ |
| SQL 注入 → 参数化 | 未见拼接 SQL ✅ |
| `shell.openExternal` 协议白名单 | 非 http(s) 链接不再生成可点击项 ✅ |
| XSS 第一层净化 | 见 §10，脚本/事件属性/iframe/javascript: 均被处理 ✅ |
| mdz 口令 + 头部加密 | 见 §4、10.9 ✅ |
| 多媒体进度条 seek | 见 5.4 / 5.7 ✅ |

---

## 12. 缺陷与改进建议汇总

1. **[中] 单行 `$$…$$` 不被识别为块级公式** — `$$x^2$$` 写成一行时退化为行内输出且首尾残留字面 `$`。官方示例都是 `$$` 独占行，属健壮性问题。建议块级定界符匹配前先归一同行写法。
2. **[中] 数学环境中同行 `\\` 换行塌缩** — `$$\begin{aligned} a&=b+c \\ d&=e \end{aligned}$$` 渲染后每个表格只有 1 行；分行书写则正常。疑与行号注入 / 换行归一化对 `\\` 的处理相互干扰。
3. **[低] `\intd`（physics 定积分简写）未渲染** — 同页 `\dv \pdv \expval \abs \norm \comm \coloneqq \degree \celsius` 均正常，仅 `\intd` 显示字面量，需补 MathJax macro。
4. **[低] 不支持 LaTeX 原生定界符 `\( \)` / `\[ \]`** — 原样输出，从外部文档粘贴公式会失败。
5. **[中] 扩展名白名单缺项导致静默失败** — `src/renderer/src/store/common-exts.js:8` 的 `audioExts` 缺 `oga`（也缺 `opus`/`aiff`），`src/renderer/src/store/common-exts.js:10` 的 `imageExts` 缺 `ico`/`avif`。用户插入 `.oga` 音频后 `<audio>` `readyState=0`、`duration=null`、无法播放，而且**没有任何提示**，排查成本高。建议补全并在识别失败时给出可见提示。
6. **[低] 目标标签已存在时「欢迎」和「设置」入口无反馈** — 「欢迎」标签已开时点 帮助>欢迎、「设置」标签已开时按 `Ctrl+,`，既不新建也不切到已开标签，用户会以为功能失效；而工具类与文档类入口实测会把已有标签切到前台，行为不一致。可疑起点是 `src/renderer/src/store/tab-man.js:59` 与 `src/renderer/src/store/tab-man.js:62` 的提前 `return 0`（未激活已有标签），但工具分支 `src/renderer/src/store/tab-man.js:65` 同样是 `return 0` 却实测会激活，差异来源需进一步确认。
7. **[高] 「另存为」对话框默认值与当前文档无关** — 对 `save-test.md` 点「另存为…」，预填的是**上一次**保存的文件名 `mdz-test`、上一次目录、上一次类型 `mdz`，直接点「保存」会**静默覆盖**已有的 `mdz-test.mdz`。建议默认取当前文档名/所在目录，并在覆盖前二次确认。
8. **[中] 「另存为」口令框残留上一次口令（明文预填）** — 上一次给 `mdz-test.mdz` 用的 `Ame#2026` 被直接填进新文档的「输入密码」「再次输入密码」两栏。用户可能没注意就在新 mdz 上复用了同一口令，与「AME 不持久化密码」的安全承诺在体验上相悖。建议每次打开对话框都清空口令。
9. **[低] 「编辑」菜单只有「设置...」** — 撤销/重做/查找/替换只存在于 Monaco 内置键位，菜单里没有入口，归类不符合常见习惯。
10. **[低] Monaco LaTeX 补全缺项** — `\genfrac`、`\symbf` 无候选，其余 mathtools/physics 宏均在列。
11. **[低] 关闭确认文案措辞** — 「如果现在关闭则失去该页面所有未保存进度」建议改为「…将**丢失**该页面所有未保存的修改」。另建议同步 README：`README.md:224` 的 Hotkey Table 缺 `Ctrl+S`（`src/renderer/src/components/main/MenuBar.vue:68` 已绑定），且未说明 `Ctrl+,` 在设置标签已开时无效。
12. **[低] 「预览区主题设置」形同虚设** — 下拉只有 `default` 一个可选项（其余主题在模板中被注释），同时编辑区切到深色主题后预览区仍是白底，明暗不一致。
13. **[待人工确认] 原生保存对话框（导出 HTML/PDF）在本机 GNOME/X11 会话下创建后保持 Unmapped**，屏幕上不出现，导致导出无法完成且没有任何错误提示。同一会话中原生**打开**对话框是正常的。需要人工在标准桌面复现确认是否为环境问题；若是应用问题，建议加超时/失败提示，避免「点了没反应」。
14. **[中] 双击「正在导出」取消导出会抛未捕获异常** — `src/renderer/src/App.vue:179` 的 `forceTerminateWorker()` 直接 `exportWorker.value.terminate()`，没有判空；而 `src/renderer/src/App.vue:163` 在 `await` 原生保存对话框之前就把 `displayExporting` 置为 `true`，于是「等待用户选路径」这段时间里 footer 的转圈提示可双击，但 worker 还没创建（`exportWorker` 为 `null`），必然抛 `TypeError: Cannot read properties of null (reading 'terminate')`（本轮日志复现 3 次，见 9.4b）。建议 `exportWorker.value?.terminate()` 并在等待对话框阶段禁用取消或标记为「可取消的选择阶段」。
15. **[观察项] 本轮应用实例在测试末段无崩溃堆栈地退出** — 日志结尾只有 XDG portal 的 `Request cancelled by user.`，无 segfault / OOM 记录（机器 121 GiB 内存，`dmesg`/`journalctl` 无 OOM）。无法归因到应用，倾向环境因素，留作人工观察项。

---

## 13. 收尾清理

```bash
# 回收测试素材（禁止 rm）
mv /home/scottsmith/Desktop/ame-uitest /home/scottsmith/Desktop/waste/
# 按 PID 关闭本轮自起的 electron
ps -eo pid,args | grep "[A]rchive-Markdown-Editor/node_modules/electron/dist/electron"
```
