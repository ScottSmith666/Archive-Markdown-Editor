# Archive Markdown Editor使用指南

## 一、特色功能与AME特有语法

> [!caution]
> 
> 注意：如果您有跨软件编写Markdown的需求，请<u>不要保存为mdz文件</u>以及<u>不要使用AME特有语法</u>。将mdz文件保存为md文件即可解决大部分跨软件编写Markdown时出现的问题。

#### 1. 新格式“mdz”

> [!tip]
> 
> 传统Markdown插入多媒体的本质是插入**指定多媒体的位置信息**（包括在线网址/离线文件路径），Markdown并*未与多媒体文件强绑定*，易出现**多媒体丢失**的问题，影响Markdown文章的阅读，而且散落的多媒体文件和Markdown文件混在一起不方便归档管理。
>
> 该格式能在Markdown中有效**嵌入图片、视频、音频等多媒体文件**（包括PDF、docx、pptx、xlsx、压缩包等常见文件类型）。
>
> 该文件格式本质是7-Zip压缩包，扩展名由原来的*.7z改成了*.mdz，名称来源：Markdown + 7z。本格式能将多媒体文件和Markdown有机结合，打包在一起，以后与人共享包含多媒体的Markdown文件时，仅需共享一个文件即可，不需要为零散的多媒体文件费心。
>
> 由于微软Office的\*.docx文件过于笨重不灵活，且难以插入视频和音频，因此我们亟需一种兼顾Markdown的轻巧灵活舒适和多媒体较强归档能力的格式。因此，\*.mdz横空出世！

mdz文件结构：

```text
以“file_name.mdz”为示例文件名

file_name.mdz
    └── mdz_contents/
        ├── content.md
        └── media_src/
                 └── media.jpg
                 └── media.mp4
                 └── media.wav
                 └── media.zip
                 └── ...

```

其中，mdz_contents、media_src这两个文件夹是固定名称

内含的md文件固定命名为content.md，与外层mdz文件叫什么名字无关

media_src文件夹内部的media文件名称没有要求

> [!tip]
>
> 由于压缩包内部不再有任何条目依赖mdz文件名，你可以放心地在文件管理器里重命名.mdz文件，它依然能被正常打开。
>
> 早期版本的mdz文件（内含的md文件名与mdz文件名一致）仍然受支持：软件会直接读取那个md文件，并在下次保存时自动改写为content.md。

打开mdz文件时，Archive Markdown Editor会把它解压到mdz文件所在目录下名为 `._mdz_content.<mdz文件名>` 的隐藏文件夹中，关闭该文档标签页后此文件夹会被清除。由于这个文件夹的名字取自**当前**文件名，所以重命名mdz文件也不会弄丢包内多媒体的链接关系。

> [!caution]
>
> 注意：Archive Markdown Editor读取mdz文件时是解压读取，因此<u>会占用2倍及以上的存储空间</u>，请注意。

要想保存为mdz十分容易。只要点击“另存为”

![]($DOCUMENT_MEDIA/save-as.png)

在另存为对话框的文件格式选择下拉框中，选择“Archive MD文件（*.mdz）”即可。

![]($DOCUMENT_MEDIA/save-as-dialog.png)

另外，当你保存为mdz文件时，引入的多媒体文件（通过你的本地绝对路径）

![md.png]($DOCUMENT_MEDIA/md.png)

会自动嵌入mdz文件并转化为mdz媒体路径。所以，不用担心多媒体的管理问题，AME会自动帮你收入囊中！

![md.png]($DOCUMENT_MEDIA/mdz.png)

保存的时候，你发现下面有设置密码的输入框。没错，你可以为你的mdz文件设置密码，保护内容安全！这个下面会详细讲到。

![]($DOCUMENT_MEDIA/save-as-dialog.png)

#### 2. 为“mdz”设置密码

> [!tip]
>
> 由于传统的Markdown文件本质上是文本文件，因此可以很轻易看到文件内容，毫无隐私安全可言。

还是回到“另存为”对话框，在下方有密码输入框。当您在保存mdz文件的时候指定密码，最后保存的文件就是带密码的mdz文件。

指定密码后，mdz包内会以7z默认的AES-256加密，同时AME还开启了7z的“头部加密”：不只是正文与多媒体的内容，包内的文件名与目录结构在不输入密码时同样无法读取（用其他解压工具查看也一样需要密码）。

当然，在您保存mdz文件的时候不填写下方的密码框，最后保存的文件当然就是不带密码的未加密mdz文件。

![]($DOCUMENT_MEDIA/save-as-dialog.png)

当Archive Markdown Editor打开加密mdz文件时，会第一时间弹出密码输入框让你输入密码。如果您输入错误的密码，文件不会打开，而是会重复弹出该窗口让你重新输入，除非您自己点击取消，输入框才会消失。

![]($DOCUMENT_MEDIA/require-password.png)

当成功打开加密mdz文件时，您会发现该文件对应标签图标是安全盾牌标志，这是专属于加密mdz文件的标志，和普通Markdown文件以及未加密mdz文件的标签图标不一样。

![]($DOCUMENT_MEDIA/encrypt-tab.png)

> [!caution]
>
> 再次提醒：为防止数据泄露，Archive Markdown Editor**不会以任何方式持久化保存您的密码**，请自行牢记密码！如因自身原因密码丢失导致加密mdz文件打不开的，**后果自负**！
> 
> 建议设置复杂度较高的密码以免被暴力破解！

#### 3. 所能嵌入的，不只是图片哦

mdz文件支持嵌入图片、视频、音频以及其他可下载文件，其中用到了Archive Markdown Editor特有语法。

当您想插入视频时，AME特有语法如下：

```AME-specific-syntax
![${video}:这里可以填写任何内容](/path/to/media.mp4)
```

如果你的多媒体文件名带空格（如“media space.mp4”）则可以用“%20”代替空格：

```AME-specific-syntax
![${video}:这里可以填写任何内容](/path/to/media%20space.mp4)
```

其中，在原来是Markdown图片语句的caption部分做了格式细分，用以支持多媒体：`${video}:这里可以填写任何内容`中，`${video}:`部分是结构固定的多媒体格式标识符（注意不要丢了英文冒号）

效果如下：

![${video}:这里可以填写任何内容]($DOCUMENT_MEDIA/media.mp4)

当您想插入音频时，AME特有语法如下：

```AME-specific-syntax
![${audio}:这里可以填写任何内容](/path/to/media.mp3)
```

效果如下：

![${audio}:这里可以填写任何内容]($DOCUMENT_MEDIA/media.mp3)

当然有人还说，我想让一个有趣的文件随mdz一同分享时，Archive Markdown Editor也是支持的。AME特有语法如下：

```AME-specific-syntax
![${file}:这里可以填写任何内容](/path/to/download.txt)
```

效果如下：

![${file}:这里可以填写任何内容]($DOCUMENT_MEDIA/download.txt)

点击即可保存至任何位置。

当然您觉得里面的音频、视频有趣，也可以把它的标识符改成file，这样就能下载啦！

```AME-specific-syntax
![${file}:这里可以填写任何内容](/path/to/media.mp4)

![${file}:这里可以填写任何内容](/path/to/media.mp3)
```

![${file}:这里可以填写任何内容]($DOCUMENT_MEDIA/media.mp4)

![${file}:这里可以填写任何内容]($DOCUMENT_MEDIA/media.mp3)

#### 4. 智能提示，编写更方便

Archive Markdown Editor具有优秀的Markdown智能提示功能。当您在编辑文档时在编辑器中键入特定关键词后，Archive Markdown Editor便会根据您键入的关键词自动匹配您想输入的Markdown语句并显示，您只需要选择就行。

智能提示关键词参见`菜单栏 > 帮助 > Markdown语法学习...`。

![]($DOCUMENT_MEDIA/suggestions.png)

#### 5. 安全模式

> [!caution]
>
> 可能会有心怀恶意的用户利用各类Markdown编辑器渲染HTML的特性，编写恶意内容，如`<script>...</script>`、`<img onclick="...">`等含有恶意脚本的内容
>
> 我们称为跨站脚本攻击（Cross Site Scripting，XSS）

当您怀疑将要打开的文件内容有问题，您可以先不要打开您认为有问题的文件，提前先进入设置

![]($DOCUMENT_MEDIA/settings.png)

将安全模式开启，然后退出设置。

![]($DOCUMENT_MEDIA/open-safe-mode.png)

安全模式开启后，编辑器和渲染器的联系将会断开，这样打开文件时渲染器就不会工作，也就不会执行恶意代码了。

接下来只需要排除恶意代码即可。

![]($DOCUMENT_MEDIA/pause-render.png)

#### 6. 导出：HTML 与 PDF

菜单栏 `文件 > 导出...` 可以把当前标签页的正文导出为 **HTML** 或 **PDF**。

##### 导出HTML

选好保存位置即完成。产物是 `导出名.html`；正文里用到本地多媒体时，AME 会在同目录再建一个 `导出名.media_dir` 文件夹，存放拷贝过去的图片/音视频/可下载文件，以及 Mermaid、Prism、MathJax（含全部 tex 扩展与公式字体）的离线资源。

所以导出的 HTML **完全离线可用**：断网打开依然有代码高亮、流程图和公式。在线图片URL与 base64 图片按原样保留。

##### 导出PDF

点「导出为PDF」后会先弹出参数框，确认后再选择保存位置：

| 参数 | 说明 |
|:---|:---|
| 纸张 | A3 / A4 / A5 / A6 / Letter / Legal / Tabloid |
| 方向 | 纵向 / 横向 |
| 页边距 | 无 / 窄 / 标准 / 宽。勾选页脚时会自动留出页脚所需的最小边距 |
| 页码范围 | 只接受 `1-5, 8, 11-13` 这种写法，留空表示导出全部 |
| 打印背景色与图片 | 默认开启；关掉后主题里的底色、提示块底色不会被印出来 |
| 页脚显示日期、标题与页码 | 页脚内容为「日期 标题 当前页 / 总页数」 |
| 生成PDF书签大纲 | 按正文标题生成PDF大纲（Chromium 实验特性，个别阅读器不显示） |

PDF 的排版使用你在设置里选中的**查看器主题**，与 app 内预览、导出 HTML 是同一来源。

和导出 HTML 有两点不同：

1. **PDF 不会创建 `.media_dir` 附属目录**。PDF 是一次性产物，本地图片和 mdz 内嵌图片在排版时按原始绝对路径直接读取并嵌入 PDF，所以产物只有一个 `.pdf` 文件。
2. **音频和视频在 PDF 里是「静态卡片」**（图标 + 文件名 + 说明文字）。PDF 是静态文档，播放器控件印出来也按不动，所以如实表示成卡片。

> [!note]
>
> 导出 PDF 的正文与 app 内预览走同一套 HTML 净化规则，`<script>`、`<iframe>` 一类的内容在导出前会被剥掉。HarmonyOS 平台暂不提供导出 PDF 入口。

#### 7. 内置工具：LaTeX编辑器与Mermaid编辑器

菜单栏 `工具 > LaTeX编辑器...` 与 `工具 > Mermaid编辑器...` 会各自以**独立标签页**打开一个“左写右看”的小工具。

| 区域 | 内容 |
|:---|:---|
| 左半边 | Monaco Editor，和正文编辑区同源，字号、行号、主题、自动换行等跟着设置里的编辑器设置走 |
| 右半边 | 实时预览。LaTeX 用 MathJax 排版，Mermaid 直接渲染成图。停笔约 0.3 秒自动刷新 |
| 复制代码 | 把左侧源码整份拷进剪贴板，直接粘回正文 |
| 清空 | 清空左侧编辑区，`Ctrl` `Z` 还能撤销回来 |

智能提示是这两个工具的主要用处：

- **LaTeX**：键入反斜杠 `\` 触发补全，覆盖希腊字母、运算符与关系符、箭头、定界符、大型运算符、重音与间距等命令；键入 `\begin` 会直接给出带配对 `\end{...}` 的环境脚手架；在 `\end{` 处优先提示文档里尚未闭合的那个环境。
- **Mermaid**：首行提示图类型（`flowchart`、`sequenceDiagram`、`classDiagram`、`stateDiagram-v2`、`erDiagram`、`gantt`、`pie`、`gitGraph`、`mindmap`、`timeline` 等 20 余种）；图类型确定后，接着按类型给上下文关键字（例如 `sequenceDiagram` 下的 `participant`、`activate`、`note over`、`alt`/`else`，`gantt` 下的 `dateFormat`、`section`、`crit`），非首行还会补箭头写法。

几点使用说明：

1. **首次打开自带一段示例源码**，方便立刻看到左右联动的效果；清空后不会自动补回来。
2. **切换标签页内容不会丢**。同一类工具同时只会开一个标签页，重复点菜单只是切过去，不会重复打开；LaTeX 与 Mermaid 彼此独立。
3. **关闭标签页不会弹“未保存”确认**。这两个工具是草稿板，内容不写进任何文件，想留存就点「复制代码」粘进正文再保存。
4. Mermaid 遇到语法错误时，右侧直接把报错文字显示出来，改对了就恢复。

> [!note]
>
> 预览用的是 app 内预览同一套 MathJax 与 Mermaid 离线资源，不需要联网。左侧编辑区只有源码，不会被公式排版改写。

## 二、Archive Markdown Editor快捷键表

| 操作       | Windows/Linux/HarmonyOS平台 | macOS平台         |
|:---------|:--------------------------|:----------------|
| 新建文件     | `Ctrl` `N`                | `⌘` `N`         |
| 打开文件     | `Ctrl` `O`                | `⌘` `O`         |
| 关闭页面     | `Ctrl` `W`                | `⌘` `W`         |
| 剪切/复制/粘贴 | `Ctrl` `X`/`C`/`V`        | `⌘` `X`/`C`/`V` |
| 撤销/重做    | `Ctrl` `Z`/`Y`            | `⌘` `Z`/`Y`     |
| 打开使用指南   | `Ctrl` `Shift` `H`        | `⌘` `Shift` `H` |
| 打开设置     | `Ctrl` `,`                | `⌘` `,`         |
| 退出AME    | `Ctrl` `Q`                | `⌘` `Q`         |

## 三、在Linux上把AME设为md、mdz、txt的默认打开方式

> [!note]
>
> 本节只针对Linux平台，并以deb包为准。

装好deb包后，AME 已经自动向系统登记好下面三种类型，所以 GNOME「设置 → 默认应用程序」以及文件管理器右键「打开方式」的列表里都会直接出现 Archive Markdown Editor：

| 文件 | MIME 类型 |
|:---|:---|
| `.md` | `text/markdown` |
| `.txt` | `text/plain` |
| `.mdz` | `application/prs.archive-markdown-format`（AME 私有类型，随包注册） |

把它们交给 AME 有两种做法：

1. 在文件管理器里右键 `.md`、`.mdz` 或 `.txt` 文件 → 「打开方式」→ 选中 Archive Markdown Editor（GNOME Files 需要先点「其他选项…」），并勾上「设为默认」。
2. 命令行：

```bash
xdg-mime default archive-markdown-editor.desktop text/markdown
xdg-mime default archive-markdown-editor.desktop text/plain
xdg-mime default archive-markdown-editor.desktop application/prs.archive-markdown-format
```

确认是否已经生效：

```bash
xdg-mime query default text/markdown      # 期望输出 archive-markdown-editor.desktop
xdg-mime query filetype ./示例.mdz         # 期望输出 application/prs.archive-markdown-format
```

设置完成后，双击文件即可以 AME 打开；若 AME 已经在运行，文件会被交给现有窗口，不会再多起一个实例。

> [!caution]
>
> `mdz` 是 AME 的私有格式，系统 MIME 库里原本没有它，不注册就会被识别成 `application/zip`，在「打开方式」里和压缩软件互相干扰，所以 deb 包会附带一份 `mdz` 的 MIME 声明。卸载 deb 包时这份声明会随包删除，但 MIME 缓存要等下一次 `update-mime-database /usr/share/mime` 才刷新；`$HOME/.config/mimeapps.list` 里手动设过的默认项也需要自己清理。

**AppImage 用户**：AppImage 不会自行写入任何系统登记，两种选择：

- 交给 `appimaged`、`AppImageLauncher` 这类集成工具，它会读取 AppImage 内置的 `.desktop`（里面已经带好上面的 MIME 类型和启动参数）替你登记；
- 或自己在 `$HOME/.local/share/applications/` 放一份 `.desktop`，`Exec=` 指向 AppImage 的绝对路径并**保留结尾的 `--direct-open-file=%f`**，再按下面的写法补上 `mdz` 的 MIME 声明：

```bash
mkdir -p "$HOME/.local/share/mime/packages"
cat > "$HOME/.local/share/mime/packages/archive-markdown-editor.xml" <<'EOF'
<?xml version="1.0" encoding="utf-8"?>
<mime-info xmlns="http://www.freedesktop.org/standards/shared-mime-info">
  <mime-type type="application/prs.archive-markdown-format">
    <glob pattern="*.mdz"/>
    <comment>Archive Markdown Editor archive document</comment>
    <icon name="x-office-document"/>
  </mime-type>
</mime-info>
EOF
update-mime-database "$HOME/.local/share/mime"
update-desktop-database "$HOME/.local/share/applications"
```
