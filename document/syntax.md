# Markdown语法学习

## 一、基础语法

#### 1. 标题 <div style="color: red;">（标题智能提示关键词：header）</div>

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
> 注意，#号和标题内容之间需要空一格！

#### 2. 段落 <div style="color: red;">（换行智能提示关键词：br）</div>

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

#### 3. 强调
<h4 style="color: red;">（粗体智能提示关键词：strong）</h4>
<h4 style="color: red;">（斜体智能提示关键词：italic）</h4>
<h4 style="color: red;">（高亮智能提示关键词：light）</h4>
<h4 style="color: red;">（删除线智能提示关键词：delete）</h4>
<h4 style="color: red;">（下划线智能提示关键词：underline）</h4>
<h4 style="color: red;">（上标智能提示关键词：sup）</h4>
<h4 style="color: red;">（下标智能提示关键词：sub）</h4>

```markdown
这是**粗体**、*斜体*、==高亮==、~~删除线~~、<u>下划线</u>、<sup>上标</sup>、<sub>下标</sub>
```

这是**粗体**、*斜体*、==高亮==、~~删除线~~、<u>下划线</u>、<sup>上标</sup>、<sub>下标</sub>

#### 4. 引用
<h4 style="color: red;">（引用智能提示关键词：quote）</h4>

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

#### 5. 列表
<h4 style="color: red;">（列表智能提示关键词：list）</h4>

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

#### 6. 表格
<h4 style="color: red;">（表格智能提示关键词：table）</h4>

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

#### 7. 代码
<h4 style="color: red;">（代码智能提示关键词：code）</h4>

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

#### 8. 分隔线
<h4 style="color: red;">（分隔线智能提示关键词：line）</h4>

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

#### 9. 链接
<h4 style="color: red;">（链接智能提示关键词：link）</h4>

```markdown
[赶紧关注收藏点赞转发投币！！！关注Scott_Smith谢谢喵～](https://space.bilibili.com/435780464)
```

[赶紧关注收藏点赞转发投币！！！关注Scott_Smith谢谢喵～](https://space.bilibili.com/435780464)

当然，也可以嵌套图片，使用户点击图片跳转链接

```markdown
[![](/path/to/media.png)](https://space.bilibili.com/435780464)
```

[![]($DOCUMENT_MEDIA/bilibili.png)](https://space.bilibili.com/435780464)

#### 10. 图片
<h4 style="color: red;">（图片智能提示关键词：img）</h4>

```markdown
![optional caption](/path/to/media.gif)
```

![]($DOCUMENT_MEDIA/WechatIMG496.gif)

## 二、进阶语法

#### 1. HTML内容

HTML内容较多，可移步至[RUNOOB](https://www.runoob.com/html/html-tutorial.html)进一步学习，它能支持Markdown渲染出更丰富复杂的效果。

举个例子，如果您想渲染更复杂的表格，比如含有合并单元格的那种，普通Markdown语句可能毫无办法。

但只要利用HTML就能渲染出来。

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

#### 2. $LaTeX$ 公式

$LaTeX$ 公式也是一块很大的内容，可移步至[LaTeX 数学公式大全](https://www.luogu.com.cn/article/1gxob6zc)进一步学习。这里只展示 $LaTeX$ 公式在Archive Markdown Editor的呈现效果。

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

剩下的Emoji，可查询[此处](https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/full.mjs)。

## 三、Archive Markdown Editor特有语法

#### 1. 视频
<h4 style="color: red;">（视频智能提示关键词：video）</h4>

```AME-specific-syntax
![${video}:这里可以填写任何内容](/path/to/media.mp4)
```

![${video}:这里可以填写任何内容]($DOCUMENT_MEDIA/media.mp4)

#### 2. 音频
<h4 style="color: red;">（音频智能提示关键词：audio）</h4>

```AME-specific-syntax
![${audio}:这里可以填写任何内容](/path/to/media.mp3)
```

![${audio}:这里可以填写任何内容]($DOCUMENT_MEDIA/media.mp3)

#### 3. 可保存文件
<h4 style="color: red;">（可保存文件智能提示关键词：file）</h4>

```AME-specific-syntax
![${file}:这里可以填写任何内容](/path/to/download.txt)
```

![${file}:这里可以填写任何内容]($DOCUMENT_MEDIA/download.txt)
