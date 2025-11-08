# Archive Markdown Editor

---

### 注：本教程适用于版本1.0.0 Alpha1至1.0.3 Alpha4，后续的新版本请参考[新版教程](https://github.com/ScottSmith666/Archive-Markdown-Editor/blob/main/README.md)。

![](https://archive-markdown-editor-ss.pages.dev/assets/face-C0IE5nk5.png)

## 一. 软件简介
Archive Markdown Editor是一款基于Electron的，编写与渲染分离（非所见即所得）的Markdown编辑器，相较于其他Markdown编辑器，Archive Markdown Editor具有其他编辑器所没有的特性。如：
1. 独创性推出基于Markdown的拓展格式：mdz。可方便进行多媒体归档，设置密码等操作。
2. 在遵循原有Markdown语法规范（CommonMark和GitHub Flavored Markdown）不变的情况下，支持通过Archive Markdown Editor特有的拓展语法插入视频和音频（后续版本会加入PDF、docx、pptx、xlsx等常见类型文件的支持）。
3. 智能提示，使您编写Markdown时更舒适。
4. **注意⚠️！如果您有跨编辑器编辑Markdown文档的需求，请不要在Markdown内容中使用Archive Markdown Editor特有的拓展语法，保存文件时请不要保存为mdz格式！**

## 二. 软件安装
### 1. 下载预编译好的binary file直接安装
进入Archive Markdown Editor的GitHub项目，从“Release”中下载最新版本的binary file，按照各系统的常用安装方式进行安装。

### 2. 自行编译安装
#### * 本项目使用了node的新特性（node原生sqlite读写模块node:sqlite），所以node版本不可低于`22.5.0`，推荐使用`22.21.0 LTS`版本，并且确保你的环境已安装`yarn`。
#### * 本项目使用了Rust `1.90.0`版本，请安装到位。
#### 2.1. Windows x64
##### 如果需要制作Windows Installer安装包（*.msi），那么还需要安装Visual Studio 2022、Wix 3.14和Votive2022.vsix插件（均在`.\Archive-Markdown-Editor\deploy_app\Windows-x64-msi\vs_sln`目录中）。
首先将项目克隆至本地（如桌面）
```powershell
PS C:\Users\scottsmith\Desktop> git clone https://github.com/ScottSmith666/Archive-Markdown-Editor.git
```
然后进入项目的Rust lib目录，安装lib的依赖
```powershell
PS C:\Users\scottsmith\Desktop> cd .\Archive-Markdown-Editor\libs\xc_mdz && yarn install
```
然后返回项目本体目录
```powershell
PS C:\Users\scottsmith\Desktop\Archive-Markdown-Editor\libs\xc_mdz> cd ..\..
```
安装项目本体的依赖
```powershell
PS C:\Users\scottsmith\Desktop\Archive-Markdown-Editor> npm install
```
安装额外依赖
```powershell
PS C:\Users\scottsmith\Desktop\Archive-Markdown-Editor> npm install .\libs\node-libs\exe-icon-extractor
```
额外依赖安装完成后，将`node_modules`中的`exe-icon-extractor`文件夹拷贝至`node_modules\@bitdisaster`中。

为什么要安装额外依赖呢？因为**在Windows平台上**，`npm`直接在线安装`exe-icon-extractor`会发生编译错误，原因见[moudle.cc compile fail when using vs2022 #3](https://github.com/pelayomendez/exe-icon-extractor/issues/3)。

开始编译打包本项目
```powershell
PS C:\Users\scottsmith\Desktop\Archive-Markdown-Editor> node .\distribute
```
此步骤完成后会自动启动Visual Studio 2022，在Visual Studio 2022中打开`.\Archive-Markdown-Editor\deploy_app\Windows-x64-msi\vs_sln\SetupProject1.sln`，在`SetupProject1`上右键单击“生成”，等待打包成msi。
![](https://archive-markdown-editor-ss.pages.dev/assets/vs.jpg)

打包完成后，可在`.\Archive-Markdown-Editor\deploy_app\Windows-x64-msi\vs_sln\bin`中找到打包完成的*.msi文件。

#### 2.2. macOS arm64 & Linux x64/arm64
首先将项目克隆至本地（如桌面）
```shell
git clone https://github.com/ScottSmith666/Archive-Markdown-Editor.git
```
然后进入项目的Rust lib目录，安装lib的依赖
```shell
cd ./Archive-Markdown-Editor/libs/xc_mdz && yarn install
```
然后返回项目本体目录
```shell
cd ../..
```
安装项目本体的依赖。
```shell
npm install
```

开始编译打包本项目
```shell
# macOS
./distribute
# Linux
npm run package
```

macOS平台打包完成后，可在`.\Archive-Markdown-Editor\deploy_app\macOS-arm64-dmg`中找到打包完成的*.dmg文件。

Linux平台打包完成后，可在`.\Archive-Markdown-Editor\out`中找到编译完成的应用。

#### 注意：x64 Linux端AME运行时需添加gtk3参数，否则会报错。
```shell
./ArchiveMarkdownEditor --gtk-version=3
```

#### 而arm64 Linux端AME运行时需添加--no-sandbox参数，否则会报错。
```shell
./ArchiveMarkdownEditor --no-sandbox
```

#### 2.3. Windows arm64
请参考Linux版本的编译安装方法，**不要**参考Windows x64的编译安装方法。
另：arm64 Windows在编译完Rust库时不会自动拷贝至对应位置，所以请去`.\Archive-Markdown-Editor\libs\xc_mdz`目录找到`xc_mdz-win32-arm64-msvc.node`，并将其复制到`.\Archive-Markdown-Editor\libs\rust_libraries`，并更名为`xc_mdz.node`。然后再运行`npm run package`。


## 三. 提升Markdown易用性的新格式：*.mdz

### 1. 介绍
1. 传统Markdown插入多媒体的本质是插入指定多媒体的位置信息（包括在线网址/离线文件路径），Markdown并未与多媒体文件强绑定，易出现多媒体丢失的问题，影响Markdown文章的阅读。
2. 该格式能在Markdown中有效嵌入图片、视频、音频等多媒体文件（包括PDF、docx、pptx、xlsx等常见类型，后续版本将会推出）。
3. 该文件格式本质是Zip压缩包，扩展名由原来的*.zip改成了*.mdz，名称来源：Markdown + Zip。本格式能将多媒体文件和Markdown有机结合，打包在一起，以后与人共享包含多媒体的Markdown文件时，仅需共享一个文件即可，不需要为零散的多媒体文件费心。
4. 由于微软Office的*.docx文件过于笨重不灵活，且难以插入视频和音频（\*.pptx都可以随便插入视频和音频等多媒体，且能和多媒体一起打包进文件内部，搞不懂微软内部在干啥，不给\*.docx支持一下），因此我们亟需一种兼顾Markdown的轻巧灵活舒适和pptx对多媒体较强归档能力的格式。因此，*.mdz横空出世！

### 2. 文件格式细节
1. 扩展名为*.mdz，如：file_name.mdz
2. 本质为Zip，将扩展名*.mdz改成*.zip后，可轻易用解压软件解压。而正是因为本质为zip，因此拥有zip节省文件大小、便于归档多文件、应用范围广、易于传输、可设置密码以提高安全性等特点。
3. 解压后的文件结构如下：

```text
file_name
    └── mdz_contents
        ├── file_name.md
        └── media_src
                 └── media.jpg
    
```
其中“file_name.md”是我们熟悉的Markdown文件，**该文件的名字和原来的mdz文件名一致**。media_src文件夹用于存放多媒体。

### 3. 编辑器在保存新建的*.mdz文件时的处理过程细节
保存新建的文件时，编辑器将在用户指定的保存目录生成mdz文件结构（不可见文件夹），将编辑的内容保存至这个文件结构（即文件夹）中，在该目录打包成mdz文件，最后删除文件结构。

### 4. 编辑器在打开已有的*.mdz文件时的处理过程细节
编辑器在mdz文件所在目录解压mdz文件，解压后的文件夹在系统不可见，文件夹名称格式如：._mdz_content.file_name，关闭mdz文件时，在该目录删除解压的文件夹。

### 5. 编辑器在保存/另存为更改后已有的*.mdz文件时的处理过程细节
编辑器在保存时，将更改后的内容写入第4节提到的文件夹中，然后进行打包压缩，保存至打开文件时所在的目录，并更改扩展名为mdz。另存为只是多了将Markdown文件名和文件夹名更改为用户指定文件名，并保存于用户指定目录。

### 6. 编辑器处理多媒体文件路径时的细节
#### 6.1. 在新建的文件中插入路径指定方式为绝对/相对路径的多媒体，最后保存为Markdown格式时
多媒体文件路径不改变。
#### 6.2. 在新建的文件中插入路径指定方式为绝对/相对路径的多媒体，最后保存为mdz格式时
编辑器将多媒体拷贝至用户指定的保存目录生成的mdz文件结构中，并将多媒体文件路径自动改为mdz专属多媒体文件路径，如：
```markdown
![图片](/path/to/media.png)
```
当保存为mdz格式时，内容就会变成：
```markdown
![图片]($MDZ_MEDIA/media.png)
```
#### 6.3. 打开已有的Markdown文件，插入路径指定方式为绝对/相对路径的多媒体，最后保存为Markdown文件：
同6.1。
#### 6.4. 打开已有的Markdown文件，插入路径指定方式为绝对/相对路径的多媒体，最后另存为mdz文件：
同6.2。
#### 6.5. 打开已有的mdz文件，插入路径指定方式为绝对/相对路径的多媒体，最后另存为Markdown文件：
编辑器会在原mdz目录中新建形如“file_name.media_src”文件夹，然后会将mdz文件中用专属路径引用的多媒体拷贝至“file_name.media_src”文件夹，然后将mdz文件中用专属路径改为“./file_name.media_src/media.png”相对路径。插入的绝对/相对路径不改变。
#### 6.6. 打开已有的mdz文件，插入路径指定方式为绝对/相对路径的多媒体，最后保存为mdz文件：
同6.2，且mdz文件中用专属路径不改变。
#### 6.7. 注意事项⚠️
任何通过在线URL进行标记的多媒体，无论保存为Markdown还是mdz，编辑器均不会更改其内容。