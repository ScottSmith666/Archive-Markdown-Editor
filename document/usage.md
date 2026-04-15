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
> 该文件格式本质是7-Zip压缩包，扩展名由原来的*.7z改成了*.mdz，名称来源：Markdown + 7-Zip。本格式能将多媒体文件和Markdown有机结合，打包在一起，以后与人共享包含多媒体的Markdown文件时，仅需共享一个文件即可，不需要为零散的多媒体文件费心。
>
> 由于微软Office的*.docx文件过于笨重不灵活，且难以插入视频和音频，因此我们亟需一种兼顾Markdown的轻巧灵活舒适和pptx对多媒体较强归档能力的格式。因此，*.mdz横空出世！

mdz文件结构：

```text
以“file_name.mdz”为示例文件名

file_name.mdz
    └── mdz_contents/
        ├── file_name.md
        └── media_src/
                 └── media.jpg
                 └── media.mp4
                 └── media.wav
                 └── media.zip
                 └── ...

其中，mdz_contents、media_src这两个文件夹是固定名称
mdz文件名称和内含的md文件名称需要一模一样
media_src文件夹内部的media文件名称没有要求
```

> [!caution]
>
> 注意：Archive Markdown Editor读取mdz文件时是解压读取，因此<u>会占用2倍及以上的存储空间</u>，请注意。

要想保存为mdz十分容易。只要点击“另存为”

![]($DOCUMENT_MEDIA/save-as.png)

在另存为对话框的文件格式选择下拉框中，选择“Archive md文件（*.mdz）”即可。

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
> 
> 你想说可以把这个Markdown文件加密压缩。User，你没发现这样很累嘛？要是有很多文件要看，难道要一个个解压缩吗？
> 
> 所以还是回到“既方便又安全”上来了。

还是回到“另存为”对话框，在下方有密码输入框。当您在保存mdz文件的时候指定密码，最后保存的文件就是带密码的mdz文件。

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

#### 4. 安全模式

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

## 二、Archive Markdown Editor快捷键表

| 操作       | Windows/Linux平台    | macOS平台         |
|:---------|:-------------------|:----------------|
| 新建文件     | `Ctrl` `N`         | `⌘` `N`         |
| 打开文件     | `Ctrl` `O`         | `⌘` `O`         |
| 关闭页面     | `Ctrl` `W`         | `⌘` `W`         |
| 剪切/复制/粘贴 | `Ctrl` `X`/`C`/`V` | `⌘` `X`/`C`/`V` |
| 撤销/重做    | `Ctrl` `Z`/`Y`     | `⌘` `Z`/`Y`     |
| 打开使用指南   | `Ctrl` `Shift` `H` | `⌘` `Shift` `H` |
| 打开设置     | `Ctrl` `,`         | `⌘` `,`         |
| 退出AME    | `Ctrl` `Q`         | `⌘` `Q`         |
