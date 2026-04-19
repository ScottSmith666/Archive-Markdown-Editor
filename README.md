# Archive Markdown Editor User Guide

## I. Installation

1. You can download the installation package corresponding to your system from GitHub Release or the official website and install it.
2. Git clone this repo, and run `npm install`.
3. Install through npm. You just run `npm install -g archive-markdown-editor`. If you don't want to keep source code, you can uninstall with npm.

> The installation just cover Windows x64, macOS arm64, and Linux x64.
> 
> If you are using another system, please refer to utils/compile.js to compile it yourself.

## I. Special features and AME-specific syntax

> CAUTION: If you need to write Markdown across different software, please <u>do not save as an mdz file</u> and <u>do not use AME-specific syntax</u>. Saving the mdz file as an md file will solve most of the problems that occur when writing Markdown across different software.

#### 1. The new file format "mdz"

> The essence of inserting multimedia in traditional Markdown is to insert **the location information of the specified multimedia** (including online URLs/offline file paths). Markdown is **not strongly bound to multimedia files**, which easily leads to the problem of **multimedia loss**, affecting the readability of Markdown articles. Moreover, scattered multimedia files and Markdown files mixed together are inconvenient for archiving and management.
>
> This format can effectively **EMBED MULTIMEDIA FILES such as images, videos, and audio** in Markdown (including common file types such as PDF, docx, pptx, xlsx, and compressed files).
>
> This file format is essentially a 7-Zip compressed archive, with the extension changed from *.7z to *.mdz. The name comes from Markdown + 7z. This format can organically combine multimedia files and Markdown, packaging them together. When sharing Markdown files containing multimedia with others, only one file needs to be shared, eliminating the need to worry about separate multimedia files.
>
> Because Microsoft Office's \*.docx files are too cumbersome and inflexible, and difficult to embed video and audio, we urgently needed a format that combines the lightweight, flexible, and user-friendly nature of Markdown with the strong multimedia archiving capabilities. Therefore, \*.mdz was born!

mdz structure:

```text
Using "file_name.mdz" as an example filename

file_name.mdz
    └── mdz_contents/
        ├── file_name.md
        └── media_src/
                 └── media.jpg
                 └── media.mp4
                 └── media.wav
                 └── media.zip
                 └── ...
```

The folders `mdz_contents` and `media_src` have fixed names.

The name of the mdz file must be exactly the same as the name of the md file contained within it.

The names of the media files inside the `media_src` folder do not need to be fixed.

> ATTENTION: Archive Markdown Editor reads mdz files by decompressing them, so it will occupy 2 times or more of the storage space.

Saving as an MDZ file is very easy. Just click "Save As".

![]($DOCUMENT_MEDIA/save-as.png)

In the Save As dialog box, select "Archive MD file (*.mdz)" from the file format drop-down menu.

![]($DOCUMENT_MEDIA/save-as-dialog.png)

Additionally, when you save as an .mdz file, any imported multimedia files (via your local absolute path)

![md.png]($DOCUMENT_MEDIA/md.png)

will be automatically embedded in the .mdz file and converted to .mdz media paths. Therefore, you don't need to worry about multimedia management; AME will handle it all for you!

![md.png]($DOCUMENT_MEDIA/mdz.png)

When you save, you'll find a password input box at the bottom. That's right, you can set a password for your .mdz file to protect its content! This will be explained in detail below.

![]($DOCUMENT_MEDIA/save-as-dialog.png)

#### 2. Set a password for "mdz"

> [!tip]
>
> Since traditional Markdown files are essentially text files, their contents can be easily viewed, offering no privacy or security whatsoever.

Go back to the "Save As" dialog box, where there is a password input box at the bottom. When you specify a password when saving the .mdz file, the final saved file will be a password-protected .mdz file.

Of course, if you don't fill in the password box below when saving the .mdz file, the final saved file will be an unencrypted .mdz file without a password.

![]($DOCUMENT_MEDIA/save-as-dialog.png)

When Archive Markdown Editor opens an encrypted .mdz file, a password input box will immediately pop up for you to enter a password. If you enter an incorrect password, the file will not open; instead, the window will repeatedly pop up for you to re-enter the password. The input box will only disappear if you click "Cancel" manually.

![]($DOCUMENT_MEDIA/require-password.png)

When you successfully open an encrypted .mdz file, you will find that the corresponding label icon is a security shield. This is a unique identifier for encrypted .mdz files, and it is different from the label icons for ordinary Markdown files and unencrypted .mdz files.

![]($DOCUMENT_MEDIA/encrypt-tab.png)

> [!caution]
>
> CAUTION: To prevent data leakage, Archive Markdown Editor **DOES NOT persistently store your password in any way**. Please remember your password! If you lose your password due to your own reasons and cannot open the encrypted .mdz file, you will be **at your own risk**!
>
> We recommend setting a strong password to prevent brute-force attacks!

#### 3. It can embed more than just images.

mdz files support embedding images, videos, audio, and other downloadable files, utilizing the unique syntax of Archive Markdown Editor.

When you want to insert a video, AME's specific syntax is as follows:

```AME-specific-syntax
![${video}:anything here](/path/to/media.mp4)
```

If your multimedia filename contains spaces (such as "media space.mp4"), you can replace the spaces with "%20":

```AME-specific-syntax
![${video}:anything here](/path/to/media%20space.mp4)
```

In this section, the caption, which was originally a Markdown image statement, has been further subdivided to support multimedia: `${video}:` can contain any content. The `${video}:` part is a fixed-structure multimedia format identifier (note the colon).

The effect is as follows:

![${video}:这里可以填写任何内容]($DOCUMENT_MEDIA/media.mp4)

When you want to insert audio, AME's specific syntax is as follows:

```AME-specific-syntax
![${audio}:anything here](/path/to/media.mp3)
```

The effect is as follows:

![${audio}:这里可以填写任何内容]($DOCUMENT_MEDIA/media.mp3)

Of course, some might also say that Archive Markdown Editor also supports sharing an interesting file along with the .mdz file. AME's unique syntax is as follows:

```AME-specific-syntax
![${file}:anything here](/path/to/download.txt)
```

The effect is as follows:

![${file}:这里可以填写任何内容]($DOCUMENT_MEDIA/download.txt)

Click to save to any location (if you can).

Of course, if you find the audio or video content interesting, you can change its identifier to "file" to download it!

```AME-specific-syntax
![${file}:anything here](/path/to/media.mp4)

![${file}:anything here](/path/to/media.mp3)
```

![${file}:这里可以填写任何内容]($DOCUMENT_MEDIA/media.mp4)

![${file}:这里可以填写任何内容]($DOCUMENT_MEDIA/media.mp3)

#### 4. Intelligent suggestions make writing easier

Archive Markdown Editor features excellent Markdown intelligent suggestions. When you type specific keywords in the editor while editing a document, Archive Markdown Editor will automatically match and display the Markdown statements you want to enter based on those keywords; you simply need to select them.

For intelligent keyword suggestions, please refer to `Menu bar > Help > Markdown Learning...`.

![]($DOCUMENT_MEDIA/suggestions.png)

#### 5. Safe Mode

> [!caution]
>
> Malicious users may exploit the HTML rendering features of various Markdown editors to write malicious content, such as `<script>...</script>` or `<img onclick="...">` containing malicious scripts.
>
> This is called a cross-site scripting (XSS) attack.

If you suspect that the content of a file you are about to open is problematic, you can refrain from opening the file beforehand and go to settings first.

![]($DOCUMENT_MEDIA/settings.png)

Enable safe mode, then exit settings.

![]($DOCUMENT_MEDIA/open-safe-mode.png)

When safe mode is enabled, the connection between the editor and the renderer will be broken, so the renderer will not work when a file is opened, and therefore malicious code will not be executed.

The next step is simply to eliminate malicious code.

![]($DOCUMENT_MEDIA/pause-render.png)

## II. Archive Markdown Editor Hotkey Table

| Operation       | Windows/Linux    | macOS         |
|:---------|:-------------------|:----------------|
| New File     | `Ctrl` `N`         | `⌘` `N`         |
| Open File     | `Ctrl` `O`         | `⌘` `O`         |
| Close Tab     | `Ctrl` `W`         | `⌘` `W`         |
| Cut/Copy/Paste | `Ctrl` `X`/`C`/`V` | `⌘` `X`/`C`/`V` |
| Undo/Redo    | `Ctrl` `Z`/`Y`     | `⌘` `Z`/`Y`     |
| Open User Guide   | `Ctrl` `Shift` `H` | `⌘` `Shift` `H` |
| Open Settings     | `Ctrl` `,`         | `⌘` `,`         |
| Exit AME    | `Ctrl` `Q`         | `⌘` `Q`         |
