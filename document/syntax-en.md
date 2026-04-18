# Markdown Learning

## I. Basic syntax

#### 1. Header <div style="color: red;">(Intelligent keyword suggestion: header)</div>

```markdown
# 等级1

这个同样表示等级1
===

## 等级2

这个同样表示等级2
---

### 等级3
#### 等级4
##### 等级5
###### 等级6
```

# 等级1

这个同样表示等级1
===

## 等级2

这个同样表示等级2
---

### 等级3
#### 等级4
##### 等级5
###### 等级6

> [!note]
> 
> There needs to be a space between the # symbol and the title content!

#### 2. Paragraph <div style="color: red;">(Intelligent keyword suggestion of line break: br)</div>

```markdown
这是一个普通段落。

这是一个\
换行段落。

这是另一个<br>换行段落。
```

这是一个普通段落。

这是一个\
换行段落。

这是另一个<br>换行段落。

#### 3. Emphasize
<h4 style="color: red;">(Intelligent keyword suggestion of font bold: strong)</h4>
<h4 style="color: red;">(Intelligent keyword suggestion of font italic: italic)</h4>
<h4 style="color: red;">(Intelligent keyword suggestion of highlight: light)</h4>
<h4 style="color: red;">(Intelligent keyword suggestion of delete line: delete)</h4>
<h4 style="color: red;">(Intelligent keyword suggestion of underline: underline)</h4>
<h4 style="color: red;">(Intelligent keyword suggestion of superscript: sup)</h4>
<h4 style="color: red;">(Intelligent keyword suggestion of subscript: sub)</h4>

```markdown
这是**粗体**、*斜体*、==高亮==、~~删除线~~、<u>下划线</u>、<sup>上标</sup>、<sub>下标</sub>
```

这是**粗体**、*斜体*、==高亮==、~~删除线~~、<u>下划线</u>、<sup>上标</sup>、<sub>下标</sub>

#### 4. Quote
<h4 style="color: red;">(Intelligent keyword suggestion: quote)</h4>

```markdown
> 这是一段普通引用

> [!tip]
> 这是一段提示引用

> [!note]
> 这是一段信息引用

> [!warning]
> 这是一段警告引用

> [!caution]
> 这是一段强烈警告引用
```

> 这是一段普通引用

> [!tip]
> 这是一段提示引用

> [!note]
> 这是一段信息引用

> [!warning]
> 这是一段警告引用

> [!caution]
> 这是一段强烈警告引用

#### 5. List
<h4 style="color: red;">(Intelligent keyword suggestion: list)</h4>

```markdown
1. 有序列表1
2. 有序列表2
   1. 子列表1
   2. 子列表2
   3. 子列表3
3. 有序列表2

+ 加号无序列表1
+ 加号无序列表2
    + 加号无序列表3
+ 加号无序列表4

- 减号无序列表1
- 减号无序列表2
    - 减号无序列表3
- 减号无序列表4

* 星号无序列表1
* 星号无序列表2
    * 星号无序列表3
* 星号无序列表4

- [ ] 任务列表1
- [x] 任务列表2
    - [ ] 任务列表3
- [ ] 任务列表4
```

1. 有序列表1
2. 有序列表2
    1. 子列表1
    2. 子列表2
    3. 子列表3
3. 有序列表2

+ 加号无序列表1
+ 加号无序列表2
  + 加号无序列表3
+ 加号无序列表4

- 减号无序列表1
- 减号无序列表2
  - 减号无序列表3
- 减号无序列表4

* 星号无序列表1
* 星号无序列表2
    * 星号无序列表3
* 星号无序列表4

- [ ] 任务列表1
- [x] 任务列表2
  - [ ] 任务列表3
- [ ] 任务列表4

#### 6. Table
<h4 style="color: red;">(Intelligent keyword suggestion: table)</h4>

```markdown
| 字段1     | 字段2    | 字段3    |
|----------|---------|----------|
| 内容1-1   | 内容1-2  | 内容1-3  |
| 内容2-1   | 内容2-2  | 内容2-2  |
| 内容3-1   | 内容3-2  | 内容3-2  |

| 居左字段1     | 居中字段2    | 居右字段3    |
|:----------|:---------:|----------:|
| 居左内容1-1   | 居中内容1-2  | 居右内容1-3  |
| 居左内容2-1   | 居中内容2-2  | 居右内容2-2  |
| 居左内容3-1   | 居中内容3-2  | 居右内容3-2  |
```

| 字段1     | 字段2    | 字段3    |
|----------|---------|----------|
| 内容1-1   | 内容1-2  | 内容1-3  |
| 内容2-1   | 内容2-2  | 内容2-2  |
| 内容3-1   | 内容3-2  | 内容3-2  |

| 居左字段1   |  居中字段2  |   居右字段3 |
|:--------|:-------:|--------:|
| 居左内容1-1 | 居中内容1-2 | 居右内容1-3 |
| 居左内容2-1 | 居中内容2-2 | 居右内容2-2 |
| 居左内容3-1 | 居中内容3-2 | 居右内容3-2 |

#### 7. Code
<h4 style="color: red;">(Intelligent keyword suggestion: code)</h4>

````markdown
这是一段内联代码`console.log("Hello World");`

```javascript
// 这是一段代码块
function method(arg) {
    console.log(arg);
}

method("Hello World");
```
````

这是一段内联代码`console.log("Hello World");`

```javascript
// 这是一段代码块
function method(arg) {
    console.log(arg);
}

method("Hello World");
```

#### 8. Separator line
<h4 style="color: red;">(Intelligent keyword suggestion: line)</h4>

```markdown
***
空隙1

---
空隙2

___
```

***
空隙1

---
空隙2

___

#### 9. Link
<h4 style="color: red;">(Intelligent keyword suggestion: link)</h4>

```markdown
[赶紧关注收藏点赞转发投币！！！关注Scott_Smith谢谢喵～](https://space.bilibili.com/435780464)
```

[赶紧关注收藏点赞转发投币！！！关注Scott_Smith谢谢喵～](https://space.bilibili.com/435780464)

Of course, you can also embed images so that users can click on the image to jump to a link.

```markdown
[![](/path/to/media.png)](https://space.bilibili.com/435780464)
```

[![]($DOCUMENT_MEDIA/bilibili.png)](https://space.bilibili.com/435780464)

#### 10. Image
<h4 style="color: red;">(Intelligent keyword suggestion: img)</h4>

```markdown
![optional caption](/path/to/media.gif)
```

![]($DOCUMENT_MEDIA/WechatIMG496.gif)

## II. Advanced syntax

#### 1. HTML

The HTML content is quite extensive; you can visit [RUNOOB](https://www.runoob.com/html/html-tutorial.html) for further learning, as it supports Markdown rendering to produce richer and more complex effects.

For example, if you want to render more complex tables, such as those with merged cells, ordinary Markdown statements may not be able to do it.

However, it can be rendered using HTML.

```html
<table>
    <tr>
        <th rowspan="2">序号</th>
        <th rowspan="2">监测位置</th>
        <th rowspan="2">供电通路</th>
        <th rowspan="2">供电电压</th>
        <th rowspan="2">负载电流</th>
        <th rowspan="2">雷击次数</th>
        <th rowspan="2">最近一次雷击时间</th>
        <th colspan="2">后备保护空开状态</th>
        <th rowspan="2">SPD损害数量</th>
        <th colspan="2">输出空开状态</th>
    </tr>
    <tr>
        <th>B级</th>
        <th>C级</th>
        <th>1路</th>
        <th>2路</th>
    </tr>
    <tr> <th rowspan="4">1</th>
    </tr>
    <tr>
        <td>1</td>
        <td>78</td>
        <td>96</td>
        <td>67</td>
        <td>98</td>
        <td>88</td>
        <td>75</td>
        <td>94</td>
        <td>69</td>
        <td>23 </td>
        <td>33 </td>
    </tr>
    <tr>
        <th colspan="2">提示建议</th>
        <th colspan="2">智能防雷箱状态</th>
        <th colspan="2">防雷箱型号</th>
        <th colspan="3">防雷箱序列号</th>
        <th colspan="2">防雷箱版本</th>
    </tr>
    <tr>
        <td colspan="2">建议整机按规程检测</td>
        <td colspan="2">在线</td>
        <td colspan="2">2018041201-035PF</td>
        <td colspan="3">2018041201-256</td>
        <td colspan="2">V1.0.0</td>
    </tr>
</table>
```

<table>
    <tr>
        <th rowspan="2">序号</th>
        <th rowspan="2">监测位置</th>
        <th rowspan="2">供电通路</th>
        <th rowspan="2">供电电压</th>
        <th rowspan="2">负载电流</th>
        <th rowspan="2">雷击次数</th>
        <th rowspan="2">最近一次雷击时间</th>
        <th colspan="2">后备保护空开状态</th>
        <th rowspan="2">SPD损害数量</th>
        <th colspan="2">输出空开状态</th>
    </tr>
    <tr>
        <th>B级</th>
        <th>C级</th>
        <th>1路</th>
        <th>2路</th>
    </tr>
    <tr> <th rowspan="4">1</th>
    </tr>
    <tr>
        <td>1</td>
        <td>78</td>
        <td>96</td>
        <td>67</td>
        <td>98</td>
        <td>88</td>
        <td>75</td>
        <td>94</td>
        <td>69</td>
        <td>23 </td>
        <td>33 </td>
    </tr>
    <tr>
        <th colspan="2">提示建议</th>
        <th colspan="2">智能防雷箱状态</th>
        <th colspan="2">防雷箱型号</th>
        <th colspan="3">防雷箱序列号</th>
        <th colspan="2">防雷箱版本</th>
    </tr>
    <tr>
        <td colspan="2">建议整机按规程检测</td>
        <td colspan="2">在线</td>
        <td colspan="2">2018041201-035PF</td>
        <td colspan="3">2018041201-256</td>
        <td colspan="2">V1.0.0</td>
    </tr>
</table>

#### 2. $LaTeX$ Formula

LaTeX formulas are a large topic, and you can refer to [Complete Collection of LaTeX Mathematical Formulas](https://www.luogu.com.cn/article/1gxob6zc) for further study. This section only demonstrates how LaTeX formulas are presented in the Archive Markdown Editor.

```markdown
这是内联LaTeX：$\exp_a b = a^b, \exp b = e^b, 10^m \iiint_M^Ndx\,dy\,dz$

这是LaTeX块：

$$
\boxed{\begin{aligned}
3^{6n+3}+4^{6n+3}
& \equiv (3^3)^{2n+1}+(4^3)^{2n+1}\\\\  
& \equiv 27^{2n+1}+64^{2n+1}\\\\  
& \equiv 27^{2n+1}+(-27)^{2n+1}\\\\
& \equiv 27^{2n+1}-27^{2n+1}\\\\
& \equiv 0 \pmod{91}\\\\
2\text{KMnO}_4 \xlongequal{\Delta} \text{K}_2\text{MnO}_4 + \text{MnO}_2 + \text{O}_2\uparrow
\end{aligned}}
$$
```

这是内联LaTeX：$\exp_a b = a^b, \exp b = e^b, 10^m \iiint_M^Ndx\,dy\,dz$

这是LaTeX块：

$$
\boxed{\begin{aligned}
3^{6n+3}+4^{6n+3}
& \equiv (3^3)^{2n+1}+(4^3)^{2n+1}\\\\  
& \equiv 27^{2n+1}+64^{2n+1}\\\\  
& \equiv 27^{2n+1}+(-27)^{2n+1}\\\\
& \equiv 27^{2n+1}-27^{2n+1}\\\\
& \equiv 0 \pmod{91}\\\\
2\text{KMnO}_4 \xlongequal{\Delta} \text{K}_2\text{MnO}_4 + \text{MnO}_2 + \text{O}_2\uparrow
\end{aligned}}
$$

#### 3. Emoji

| 语句       | Emoji  | 语句           | Emoji     | 语句   | Emoji | 语句        | Emoji   | 语句       | Emoji  | ...  |
|:---------|:-------|:-------------|:----------|:-----|:------|:----------|:--------|:---------|:-------| :-------|
| `:100:`  | :100:  | `:grinning:` | :grinning:     | `:smiley:` | :smiley:    | `:smile:` | :smile: | `:grin:` | :grin: | ...  |

The remaining emojis can be found [here](https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/full.mjs).

## 三、Archive Markdown Editor specific syntax

#### 1. Video
<h4 style="color: red;">(Intelligent keyword suggestion: video)</h4>

```AME-specific-syntax
![${video}:optional caption](/path/to/media.mp4)
```

![${video}:这里可以填写任何内容]($DOCUMENT_MEDIA/media.mp4)

#### 2. 音频
<h4 style="color: red;">(Intelligent keyword suggestion: audio)</h4>

```AME-specific-syntax
![${audio}:optional caption](/path/to/media.mp3)
```

![${audio}:这里可以填写任何内容]($DOCUMENT_MEDIA/media.mp3)

#### 3. 可保存文件
<h4 style="color: red;">(Intelligent keyword suggestion: file)</h4>

```AME-specific-syntax
![${file}:optional caption](/path/to/download.txt)
```

![${file}:这里可以填写任何内容]($DOCUMENT_MEDIA/download.txt)
