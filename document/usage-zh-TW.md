# Archive Markdown Editor使用指南

## 一、特色功能與AME特有語法

> [!caution]
> 
> 注意：如果您有跨軟體編寫Markdown的需求，請<u>不要儲存為mdz檔案</u>以及<u>不要使用AME特有語法</u>。將mdz檔案儲存為md檔案即可解決大部分跨軟體編寫Markdown時出現的問題。

#### 1. 新格式“mdz”

> [!tip]
> 
> 傳統Markdown插入多媒體的本質是插入**指定多媒體的位置資訊**（包括線上網址/離線檔案路徑），Markdown並*未與多媒體檔案強綁定*，易出現**多媒體遺失**的問題，影響Markdown文章的閱讀，而且散落的多媒體檔案和Markdown檔案混在一起不方便歸檔管理。
>
> 此格式能在Markdown有效**嵌入圖片、影片、音訊等多媒體檔案**（含PDF、docx、pptx、xlsx、壓縮檔案等常見檔案類型）。
>
> 該檔案格式本質是7-Zip壓縮包，副檔名由原來的*.7z改成了*.mdz，名稱來源：Markdown + 7z。本格式能將多媒體檔案和Markdown有機結合，打包在一起，以後與人分享包含多媒體的Markdown檔案時，只需共用一個檔案即可，不需要為零散的多媒體檔案費心。
>
> 由於微軟Office的*.docx檔案過於笨重不靈活，且難以插入影片和音訊，因此我們亟需一種兼顧Markdown的輕巧靈活舒適和多媒體較強歸檔能力的格式。因此，*.mdz橫空出世！

mdz檔案結構：

```text
以“file_name.mdz”為範例檔名

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

其中，`mdz_contents`、`media_src`這兩個資料夾是固定名稱

內含的md檔案固定命名為content.md，與外層mdz檔案叫什麼名字無關

`media_src`資料夾內部的media檔案名稱沒有要求

> [!tip]
>
> 由於壓縮檔內部不再有任何條目依賴mdz檔名，你可以放心地在檔案管理器裡重新命名.mdz檔案，它依然能被正常開啟。
>
> 早期版本的mdz檔案（內含的md檔名與mdz檔名一致）仍然受到支援：軟體會直接讀取那個md檔案，並在下次儲存時自動改寫為content.md。

開啟mdz檔案時，Archive Markdown Editor會把它解壓縮到mdz檔案所在目錄下名為 `._mdz_content.<mdz檔名>` 的隱藏資料夾中，關閉該文件標籤頁後此資料夾會被清除。由於這個資料夾的名稱取自**當前**檔名，所以重新命名mdz檔案也不會弄丟包內多媒體的連結關係。

> [!caution]
>
> 注意：Archive Markdown Editor讀取mdz檔案時是解壓縮讀取，因此<u>會佔用2倍及以上的儲存空間</u>，請注意。

要保存為mdz十分容易。只要點擊“儲存為”

![]($DOCUMENT_MEDIA/save-as.png)

在儲存為對話方塊的檔案格式選擇下拉方塊中，選擇「Archive MD檔（*.mdz）」即可。

![]($DOCUMENT_MEDIA/save-as-dialog.png)

另外，當你儲存為mdz檔案時，引入的多媒體檔案（透過你的本地絕對路徑）

![md.png]($DOCUMENT_MEDIA/md.png)

會自動嵌入mdz檔案並轉換為mdz媒體路徑。所以，不用擔心多媒體的管理問題，AME會自動幫你收入囊中！

![md.png]($DOCUMENT_MEDIA/mdz.png)

儲存的時候，你發現下面有設定密碼的輸入框。沒錯，你可以為你的mdz檔案設定密碼，保護內容安全！這下面會詳細講到。

![]($DOCUMENT_MEDIA/save-as-dialog.png)

#### 2. 為“mdz”設定密碼

> [!tip]
>
> 由於傳統的Markdown文檔本質上是文字檔，因此可以輕易看到文件內容，毫無隱私安全可言。

還是回到「儲存為」對話框，下方有密碼輸入框。當您在儲存mdz檔案的時候指定密碼，最後儲存的檔案就是帶有密碼的mdz檔案。

指定密碼後，mdz套件內會以7z預設的AES-256加密，同時AME還會開啟7z的「標頭加密」：不只是內文與多媒體的內容，套件內的檔名與目錄結構在未輸入密碼時同樣無法讀取（使用其他解壓工具檢視時同樣需要密碼）。

當然，在您儲存mdz檔案的時候不填寫下方的密碼框，最後儲存的檔案當然就是不含密碼的未加密mdz檔案。

![]($DOCUMENT_MEDIA/save-as-dialog.png)

當Archive Markdown Editor開啟加密mdz檔案時，會第一時間彈出密碼輸入框讓你輸入密碼。如果您輸入錯誤的密碼，檔案不會打開，而是會重複彈出該視窗讓您重新輸入，除非您自己點擊取消，輸入框才會消失。

![]($DOCUMENT_MEDIA/require-password.png)

當成功開啟加密mdz檔案時，您會發現該檔案對應標籤圖示是安全盾牌標誌，這是專屬於加密mdz檔案的標誌，和普通Markdown檔案以及未加密mdz檔案的標籤圖示不一樣。

![]($DOCUMENT_MEDIA/encrypt-tab.png)

> [!caution]
>
> 再次提醒：為防止資料洩露，Archive Markdown Editor**不會以任何方式持久化保存您的密碼**，請自行牢記密碼！如因自身原因密碼遺失導致加密mdz檔案打不開的，**後果自負**！
> 
> 建議設定複雜度較高的密碼以免被暴力破解！

#### 3. 所能嵌入的，不只是圖片哦

mdz文件支援嵌入圖片、影片、音訊以及其他可下載文件，其中用到了Archive Markdown Editor特有語法。

當您想插入影片時，AME特有語法如下：

```AME-specific-syntax
![${video}:這裡可以填寫任何內容](/path/to/media.mp4)
```

如果你的多媒體檔案名稱有空格（如「media space.mp4」）可以用「%20」取代空格：

```AME-specific-syntax
![${video}:這裡可以填寫任何內容](/path/to/media%20space.mp4)
```

其中，在原來是Markdown圖片語句的caption部分做了格式細分，用以支援多媒體：`${video}:這裡可以填入任何內容`中，`${video}:`部分是結構固定的多媒體格式識別碼（注意不要丟了英文冒號）

效果如下：

![${video}:这里可以填写任何内容]($DOCUMENT_MEDIA/media.mp4)

當您想要插入音訊時，AME特有語法如下：

```AME-specific-syntax
![${audio}:這裡可以填寫任何內容](/path/to/media.mp3)
```

效果如下：

![${audio}:这里可以填写任何内容]($DOCUMENT_MEDIA/media.mp3)

當然有人還說，我想讓一個有趣的檔案隨mdz分享時，Archive Markdown Editor也是支援的。 AME特有語法如下：

```AME-specific-syntax
![${file}:這裡可以填寫任何內容](/path/to/download.txt)
```

效果如下：

![${file}:这里可以填写任何内容]($DOCUMENT_MEDIA/download.txt)

點擊即可儲存至任何位置。

當然覺得裡面的音訊、影片有趣，也可以把它的識別碼改成file，這樣就能下載囉！

```AME-specific-syntax
![${file}:這裡可以填寫任何內容](/path/to/media.mp4)

![${file}:這裡可以填寫任何內容](/path/to/media.mp3)
```

![${file}:这里可以填写任何内容]($DOCUMENT_MEDIA/media.mp4)

![${file}:这里可以填写任何内容]($DOCUMENT_MEDIA/media.mp3)

#### 4. 智慧提示，編寫更方便

Archive Markdown Editor具有優秀的Markdown智慧提示功能。當您在編輯文件時在編輯器中鍵入特定關鍵字後，Archive Markdown Editor便會根據您鍵入的關鍵字自動匹配您想輸入的Markdown語句並顯示，您只需要選擇就行。

智慧提示關鍵字請參考`選單列 > 幫助 > Markdown語法學習...`。

![]($DOCUMENT_MEDIA/suggestions.png)

#### 5. 安全模式

> [!caution]
>
> 可能會有心懷惡意的使用者利用各類Markdown編輯器渲染HTML的特性，編寫惡意內容，如`<script>...</script>`、`<img onclick="...">`等含有惡意腳本的內容
>
> 我們稱為跨站腳本攻擊（Cross Site Scripting，XSS）

當您懷疑將要開啟的文件內容有問題，您可以先不要開啟您認為有問題的文件，提前先進入設定

![]($DOCUMENT_MEDIA/settings.png)

將安全模式開啟，然後退出設定。

![]($DOCUMENT_MEDIA/open-safe-mode.png)

安全模式開啟後，編輯器和渲染器的連結將會斷開，這樣開啟檔案時渲染器就不會運作，也就不會執行惡意程式碼了。

接下來只需要排除惡意程式碼即可。

![]($DOCUMENT_MEDIA/pause-render.png)

#### 6. 匯出：HTML 與 PDF

選單列 `檔案 > 匯出...` 可以將目前頁籤的正文匯出為 **HTML** 或 **PDF**。

##### 匯出HTML

選好儲存位置即完成。產物是 `匯出名.html`；正文裡用到本地多媒體時，AME 會在同目錄再建一個 `匯出名.media_dir` 資料夾，存放複製過去的圖片/音訊影片/可下載檔案，以及 Mermaid、Prism、MathJax（含全部 tex 擴充與公式字型）的離線資源。

所以匯出的 HTML **完全離線可用**：斷網開啟依然有程式碼高亮、流程圖和公式。線上圖片URL與 base64 圖片照原樣保留。

##### 匯出PDF

點「匯出為PDF」後會先跳出參數框，確認後再選擇儲存位置：

| 參數 | 說明 |
|:---|:---|
| 紙張 | A3 / A4 / A5 / A6 / Letter / Legal / Tabloid |
| 方向 | 縱向 / 橫向 |
| 頁邊距 | 無 / 窄 / 標準 / 寬。勾選頁尾時會自動留出頁尾所需的最小邊距 |
| 頁碼範圍 | 只接受 `1-5, 8, 11-13` 這種寫法，留空表示匯出全部 |
| 列印背景色與圖片 | 預設開啟；關掉後主題裡的底色、提示塊底色不會被列印出來 |
| 頁尾顯示日期、標題與頁碼 | 頁尾內容為「日期 標題 目前頁 / 總頁數」 |
| 產生PDF書籤大綱 | 依正文標題產生PDF大綱（Chromium 實驗特性，個別閱讀器不顯示） |

PDF 的排版使用你在設定中選取的**檢視器主題**，與 app 內預覽、匯出 HTML 是同一來源。

和匯出 HTML 有兩點不同：

1. **PDF 不會建立 `.media_dir` 附屬目錄**。PDF 是一次性產物，本地圖片和 mdz 內嵌圖片在排版時依原始絕對路徑直接讀取並嵌入 PDF，所以產物只有一個 `.pdf` 檔案。
2. **音訊和影片在 PDF 裡是「靜態卡片」**（圖示 + 檔案名稱 + 說明文字）。PDF 是靜態文件，播放器控件印出來也按不動，所以如實表示成卡片。

> [!note]
>
> 匯出 PDF 的正文與 app 內預覽走同一套 HTML 淨化規則，`<script>`、`<iframe>` 一類的內容在匯出前會被剝除。HarmonyOS 平台暫不提供匯出 PDF 入口。

#### 7. 內建工具：LaTeX編輯器與Mermaid編輯器

功能表列 `工具 > LaTeX編輯器...` 與 `工具 > Mermaid編輯器...` 會各自以**獨立分頁**開啟一個「左寫右看」的小工具。

| 區域 | 內容 |
|:---|:---|
| 左半邊 | Monaco Editor，與內文編輯區同源，字型大小、行號、主題、自動換行等跟隨設定中的編輯器設定 |
| 右半邊 | 即時預覽。LaTeX 用 MathJax 排版，Mermaid 直接渲染成圖。停筆約 0.3 秒自動重新整理 |
| 拷貝原始碼 | 把左側原始碼整份拷進剪貼簿，直接貼回內文 |
| 清空 | 清空左側編輯區，`Ctrl` `Z` 還能復原回來 |

智慧提示是這兩個工具的主要用處：

- **LaTeX**：鍵入反斜線 `\` 觸發補全，涵蓋希臘字母、運算子與關係符、箭頭、定界符、大型運算子、重音與間距等指令；鍵入 `\begin` 會直接給出帶配對 `\end{...}` 的環境腳手架；在 `\end{` 處優先提示文件裡尚未閉合的那個環境。
- **Mermaid**：首行提示圖類型（`flowchart`、`sequenceDiagram`、`classDiagram`、`stateDiagram-v2`、`erDiagram`、`gantt`、`pie`、`gitGraph`、`mindmap`、`timeline` 等 20 餘種）；圖類型確定後，接著依類型給上下文關鍵字（例如 `sequenceDiagram` 下的 `participant`、`activate`、`note over`、`alt`/`else`，`gantt` 下的 `dateFormat`、`section`、`crit`），非首行還會補箭頭寫法。

幾點使用說明：

1. **首次開啟自帶一段範例原始碼**，方便立刻看到左右連動的效果；清空後不會自動補回來。
2. **切換分頁內容不會遺失**。同一類工具同時只會開一個分頁，重複點功能表只是切過去，不會重複開啟；LaTeX 與 Mermaid 彼此獨立。
3. **關閉分頁不會跳「未儲存」確認**。這兩個工具是草稿板，內容不寫進任何檔案，想留存就點「拷貝原始碼」貼進內文再儲存。
4. Mermaid 遇到語法錯誤時，右側直接把錯誤文字顯示出來，改對了就會恢復。

> [!note]
>
> 預覽用的是與 app 內預覽同一套 MathJax 與 Mermaid 離線資源，不需要聯網。左側編輯區只有原始碼，不會被公式排版改寫。

## 二、Archive Markdown Editor快速鍵表

| 操作       | Windows/Linux/HarmonyOS平台   | macOS平台         |
|:---------|:-------------------|:----------------|
| 新建文件     | `Ctrl` `N`         | `⌘` `N`         |
| 開啟文件     | `Ctrl` `O`         | `⌘` `O`         |
| 關閉頁面     | `Ctrl` `W`         | `⌘` `W`         |
| 剪下/拷貝/貼上 | `Ctrl` `X`/`C`/`V` | `⌘` `X`/`C`/`V` |
| 撤銷/重做    | `Ctrl` `Z`/`Y`     | `⌘` `Z`/`Y`     |
| 開啟使用指南   | `Ctrl` `Shift` `H` | `⌘` `Shift` `H` |
| 開啟設定     | `Ctrl` `,`         | `⌘` `,`         |
| 退出AME    | `Ctrl` `Q`         | `⌘` `Q`         |

## 三、在Linux上把AME設為md、mdz、txt的預設開啟方式

> [!note]
>
> 本節只針對Linux平台，並以deb包為準。

裝好deb包後，AME 已經自動向系統登記好下面三種類型，所以 GNOME「設定 → 預設應用程式」以及檔案管理器右鍵「開啟與」的清單裡都會直接出現 Archive Markdown Editor：

| 檔案 | MIME 類型 |
|:---|:---|
| `.md` | `text/markdown` |
| `.txt` | `text/plain` |
| `.mdz` | `application/prs.archive-markdown-format`（AME 私有類型，隨包註冊） |

把它們交給 AME 有兩種做法：

1. 在檔案管理器裡右鍵 `.md`、`.mdz` 或 `.txt` 檔案 → 「開啟與」→ 選取 Archive Markdown Editor（GNOME Files 要先點「其他選項…」），並勾選「設為預設」。
2. 命令列：

```bash
xdg-mime default archive-markdown-editor.desktop text/markdown
xdg-mime default archive-markdown-editor.desktop text/plain
xdg-mime default archive-markdown-editor.desktop application/prs.archive-markdown-format
```

確認是否已經生效：

```bash
xdg-mime query default text/markdown      # 預期輸出 archive-markdown-editor.desktop
xdg-mime query filetype ./範例.mdz         # 預期輸出 application/prs.archive-markdown-format
```

設定完成後，雙擊檔案即可以 AME 開啟；若 AME 已經在執行，檔案會被交給現有視窗，不會再多起一個實例。

> [!caution]
>
> `mdz` 是 AME 的私有格式，系統 MIME 庫裡原本沒有它，不註冊就會被識別成 `application/zip`，在「開啟與」裡和壓縮軟體互相干擾，所以 deb 包會附上一份 `mdz` 的 MIME 宣告。解除安裝 deb 包時這份宣告會隨包刪除，但 MIME 快取要等下一次 `update-mime-database /usr/share/mime` 才重新整理；`$HOME/.config/mimeapps.list` 裡手動設過的預設項目也需要自行清理。

**AppImage 使用者**：AppImage 不會自行寫入任何系統登記，兩種選擇：

- 交給 `appimaged`、`AppImageLauncher` 這類整合工具，它會讀取 AppImage 內建的 `.desktop`（裡面已經帶好上面的 MIME 類型和啟動參數）替你註冊；
- 或自己在 `$HOME/.local/share/applications/` 放一份 `.desktop`，`Exec=` 指向 AppImage 的絕對路徑並**保留結尾的 `--direct-open-file=%f`**，再按下面的寫法補上 `mdz` 的 MIME 宣告：

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
