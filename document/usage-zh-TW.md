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
        ├── file_name.md
        └── media_src/
                 └── media.jpg
                 └── media.mp4
                 └── media.wav
                 └── media.zip
                 └── ...
```

其中，`mdz_contents`、`media_src`這兩個資料夾是固定名稱

mdz檔案名稱和內含的md檔案名稱需要一模一樣

`media_src`資料夾內部的media檔案名稱沒有要求

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

## 二、Archive Markdown Editor快速鍵表

| 操作       | Windows/Linux平台    | macOS平台         |
|:---------|:-------------------|:----------------|
| 新建文件     | `Ctrl` `N`         | `⌘` `N`         |
| 開啟文件     | `Ctrl` `O`         | `⌘` `O`         |
| 關閉頁面     | `Ctrl` `W`         | `⌘` `W`         |
| 剪下/拷貝/貼上 | `Ctrl` `X`/`C`/`V` | `⌘` `X`/`C`/`V` |
| 撤銷/重做    | `Ctrl` `Z`/`Y`     | `⌘` `Z`/`Y`     |
| 開啟使用指南   | `Ctrl` `Shift` `H` | `⌘` `Shift` `H` |
| 開啟設定     | `Ctrl` `,`         | `⌘` `,`         |
| 退出AME    | `Ctrl` `Q`         | `⌘` `Q`         |
