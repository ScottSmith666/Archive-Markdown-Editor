# Archive-Markdown-Editor

---

## 一. 软件简介
Archive Markdown Editor是一款基于Electron的，编写与渲染分离（非所见即所得）的Markdown编辑器，相较于其他Markdown编辑器，Archive Markdown Editor具有其他编辑器所没有的特性。如：
1. 独创性推出基于Markdown的拓展格式：mdz。可方便进行多媒体归档，设置密码等操作。
2. 在遵循原有Markdown语法规范（CommonMark和GitHub Flavored Markdown）不变的情况下，支持通过Archive Markdown Editor特有的拓展语法插入视频和音频（后续版本会加入PDF、docx、pptx、xlsx等常见类型文件的支持）。
3. 智能提示，使您编写Markdown时更舒适。
4. **注意⚠️！如果您有跨编辑器编辑Markdown文档的需求，请不要在Markdown内容中使用Archive Markdown Editor特有的拓展语法，保存文件时请不要保存为mdz格式！**

另外，通过页面局部更新，减小渲染压力，可顺利打开10000-20000行的Markdown并进行查看&编辑，性能强于Mark Text和Typora。

## 二. 软件安装
### 1. 下载编译好的binary直接安装
进入Archive Markdown Editor的GitHub项目，从“Release”中下载最新版本的binary file，按照各系统的常用安装方式进行安装。

### 2. 自行编译安装
本项目中内置macOS arm64和Windows x64版本的编译打包程序

## 三. 提升Markdown易用性的新格式：*.mdz

### 1. 介绍
1. 传统Markdown插入多媒体的本质是插入指定多媒体的位置信息（包括在线网址/离线文件路径），Markdown并未与多媒体文件强绑定，易出现多媒体丢失的问题，影响Markdown文章的阅读。
2. 该格式能在Markdown中有效嵌入图片、视频、音频等多媒体文件（包括PDF、docx、pptx、xlsx等常见类型，后续版本推出）。
3. 该文件格式本质是Zip压缩包，扩展名由原来的改成了*.mdz，名字来源：Markdown + Zip。本格式能将多媒体文件和Markdown有机结合，打包在一起，以后与人共享包含多媒体的Markdown文件时，仅需共享一个文件即可，不需要为零散的多媒体文件费心。
4. 而且，由于微软Office的*.docx文件过于笨重不灵活，且难以插入视频和音频（\*.pptx都可以随便插入视频和音频等多媒体，且能和多媒体一起打包进文件内部，搞不懂微软内部在干啥，不给\*.docx支持一下），因此我们亟需一种兼顾Markdown的轻巧灵活舒适和pptx对多媒体较强归档能力的格式。因此，*.mdz横空出世！

### 2. 文件格式细节
1. 扩展名为*.mdz，如：file_name.mdz
2. 本质为Zip，将扩展名*.mdz改成*.zip后，可轻易用解压软件解压。而正是因为本质为zip，因此拥有zip节省文件大小、便于归档多文件、应用范围广、易于传输、可设置密码以提高安全性等特点。
3. 解压后的文件结构如下：

```text
file_name
    ├── file_type.json
    └── mdz_contents
        ├── file_name.md
        └── media_src
                 └── media.jpg
    
```
其中“file_name.md”是我们熟悉的Markdown文件，要求该文件的名字和原来的mdz文件名一致。media_src文件用于存放多媒体，接下来看到“file_type.json”文件，其内容如下：

```json5
{
  /** 
   * 文件类型config，表明是自动新建的文件还是FS上已有的文件
   * 指定value有：
   *     1. "created_new_file"，代表自动新建的文件
   *     2. "exist_file"，代表FS上已有的文件
   */
  "file_type": "created_new_file"
}
```

4. 支持清理未被Markdown正文引用的多媒体文件：

本App内有多媒体清理模块，启动后，软件会匹配文本内容中的格式为"\!\[\]\(\)"的内容，即Markdown多媒体语句，然后与media_src文件夹内的多媒体文件比对，删除未被引用的多媒体文件，减少文件总大小。

### 3. 编辑器在新建*.mdz文件时的处理过程细节
新建文件时，编辑器会在临时目录（默认在用户目录，且不可见，可设置于别的目录）下创建“未命名/Untitled”文件夹，并生成mdz文件结构和必要的内容。

### 4. 编辑器在保存新建的*.mdz文件时的处理过程细节
保存新建的文件时，编辑器将在临时目录（默认在用户目录，且不可见，可设置于别的目录）下创建的“未命名/Untitled”文件夹打包成mdz文件，保存在用户指定的目录。

### 5. 编辑器在打开已有的*.mdz文件时的处理过程细节
编辑器在mdz文件所在目录解压mdz文件，解压后的文件夹在系统不可见，文件夹名称格式如：._mdz_content.file_name

### 6. 编辑器在保存/另存为更改后已有的*.mdz文件时的处理过程细节
编辑器在保存时，首先清空operate_log.txt，然后进行打包压缩，保存至打开文件时所在的目录，并更改扩展名为mdz。另存为只是多了将Markdown文件名和文件夹名更改为用户指定文件名，并保存于用户指定目录。
