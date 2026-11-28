# LaTeX语法学习

> [!note]
>
> 本文只讲**数学公式**部分。Archive Markdown Editor内置的是MathJax，它实现的是LaTeX的数学排版子集，不认识`\documentclass`、`\section`、表格、插图这类“文档排版”命令。
>
> 文中每一条示例都在Archive Markdown Editor里实测可渲染。想边改边看，请用菜单栏「工具 > LaTeX编辑器」。

---

## 一、先弄懂三件事

#### 1. 两种定界符：`$...$` 与 `$$...$$`

```markdown
行内公式：$E = mc^2$ 可以嵌在句子里。

独立公式（单独成块、居中）：

$$
\int_{-\infty}^{+\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$
```

行内公式：$E = mc^2$ 可以嵌在句子里。

独立公式（单独成块、居中）：

$$
\int_{-\infty}^{+\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$

> [!warning]
>
> Archive Markdown Editor只启用了`$`和`$$`。LaTeX里常见的`\( ... \)`和`\[ ... \]`**不会**被识别，写了只会显示成普通文本。

#### 2. 反斜杠规则：一个反斜杠写到底

本软件在把Markdown交给MathJax之前会先做一道**数学片段预处理**（`src/renderer/src/latex-preprocess.js`），替公式里的反斜杠补好本来会被Markdown转义掉的那一层。所以你**只管按LaTeX的习惯写一个反斜杠**，正文和「工具 > LaTeX编辑器」两处的写法完全一致：

| 你想让MathJax看到的 | 在Markdown正文里写 | 在「工具 > LaTeX编辑器」里写 |
|:---|:---|:---|
| 左花括号定界符 | `\{` | `\{` |
| 换行 | `\\` | `\\` |
| 编号`\#1` | `\#1` | `\#1` |
| 细空格 | `\,` | `\,` |
| 箭头 | `\rightarrow` | `\rightarrow` |

下面两个例子都是单反斜杠写法，也都能正常渲染：

$$
\begin{bmatrix} a & b \\ c & d \end{bmatrix} \qquad
\left\{ \begin{array}{c|c} x & y \\ \hline 1 & 2 \end{array} \right\}
$$

> [!warning]
>
> 反斜杠这一层软件替你补好了，但Markdown还有两处会先插手：**公式里的裸星号`*`可能被当成强调**（乘号请写`\times`、`\cdot`），**表格单元格里裸竖线会把公式拦腰切断**（绝对值请写`\vert`、`\lvert`、`\mid`）。此外预处理刻意不碰代码块和行内代码——那是给读者看的源码，本来就不该渲染。

#### 3. 代码块里不会渲染

`````markdown
```markdown
$\alpha$
```
`````

```markdown
$\alpha$
```

行内代码 `` `$\alpha$` `` 同理。想显示“源码本身”就放进代码块，想渲染就写在代码块外面。

---

## 二、基础语法

#### 4. 上下标与分组`{}`

`^`是上标，`_`是下标。**它们只管后面紧跟的那一个字符**，多字符必须用`{}`包起来。

```markdown
上标一个字符：$x^2$，多个字符要写括号：$x^{2n+1}$

下标同理：$a_1$ 与 $a_{12}$

同时有上下标：$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$

左右下标：$H_n^{(1)}$，前置下标：${}_1^2X$
```

上标一个字符：$x^2$，多个字符要写括号：$x^{2n+1}$

下标同理：$a_1$ 与 $a_{12}$

同时有上下标：$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$

左右下标：$H_n^{(1)}$，前置下标：${}_1^2X$

> [!caution]
>
> 忘记`{}`是最常见的语义错误：$x^2n$ 表示“$x$的平方再乘$n$”，而不是$x$的$2n$次方。

#### 5. 分数与根式

```markdown
$\frac{1}{2}$、$\dfrac{a+b}{c+d}$、$\tfrac{1}{x}$

连分数：$\cfrac{1}{1+\cfrac{1}{1+\cfrac{1}{x}}}$

根号：$\sqrt{2}$、$\sqrt[3]{\frac{x}{y}}$

也可以写成斜杠形式：$a/b$
```

$\frac{1}{2}$、$\dfrac{a+b}{c+d}$、$\tfrac{1}{x}$

连分数：$\cfrac{1}{1+\cfrac{1}{1+\cfrac{1}{x}}}$

$\sqrt{2}$、$\sqrt[3]{\frac{x}{y}}$

> [!note]
>
> 行内公式里`\frac`会被压得很扁。想让行内分数也撑开，用`\dfrac`；或者整段前面加`\displaystyle`。

#### 6. 括号与自动定界`\left` `\right`

```markdown
普通括号：$( \frac{a}{b} )$ 上下会挤

自动匹配高度：$\left( \frac{a}{b} \right)$、$\left[ \sum_{i=1}^{n} i \right]$

定界符可以是任意符号，也可以写`.`表示“这一侧不画”：$\left\{ \frac{1}{2} \right.$

三段式用`\middle`：$\left. \frac{x^2}{2} \right|_{0}^{1}$
```

普通括号：$( \frac{a}{b} )$　对比自动高度：$\left( \frac{a}{b} \right)$、$\left[ \sum_{i=1}^{n} i \right]$

$\left\{ \frac{1}{2} \right.$　和　$\left. \frac{x^2}{2} \right|_{0}^{1}$

> [!warning]
>
> `\left`和`\right`必须成对出现在**同一个公式**里，跨公式或漏写会直接报错。

#### 7. 希腊字母

大小写只差首字母大小写，其余同名。

| 字母 | 写法 | 字母 | 写法 | 字母 | 写法 | 字母 | 写法 |
|:---|:---|:---|:---|:---|:---|:---|:---|
| $\alpha$ | `\alpha` | $\beta$ | `\beta` | $\gamma$ | `\gamma` | $\delta$ | `\delta` |
| $\epsilon$ | `\epsilon` | $\varepsilon$ | `\varepsilon` | $\zeta$ | `\zeta` | $\eta$ | `\eta` |
| $\theta$ | `\theta` | $\vartheta$ | `\vartheta` | $\iota$ | `\iota` | $\kappa$ | `\kappa` |
| $\lambda$ | `\lambda` | $\mu$ | `\mu` | $\nu$ | `\nu` | $\xi$ | `\xi` |
| $\pi$ | `\pi` | $\varpi$ | `\varpi` | $\rho$ | `\rho` | $\varrho$ | `\varrho` |
| $\sigma$ | `\sigma` | $\varsigma$ | `\varsigma` | $\tau$ | `\tau` | $\upsilon$ | `\upsilon` |
| $\phi$ | `\phi` | $\varphi$ | `\varphi` | $\chi$ | `\chi` | $\psi$ | `\psi` |
| $\omega$ | `\omega` | $\Gamma$ | `\Gamma` | $\Delta$ | `\Delta` | $\Theta$ | `\Theta` |
| $\Lambda$ | `\Lambda` | $\Xi$ | `\Xi` | $\Pi$ | `\Pi` | $\Sigma$ | `\Sigma` |
| $\Phi$ | `\Phi` | $\Psi$ | `\Psi` | $\Omega$ | `\Omega` | $\Upsilon$ | `\Upsilon` |

> [!note]
>
> 只有24个希腊字母，且**大小写是两条不同的命令**（`\alpha`是$\alpha$，`\Alpha`并不存在；大写只有$\Gamma$、$\Delta$、$\Theta$、$\Lambda$、$\Xi$、$\Pi$、$\Sigma$、$\Upsilon$、$\Phi$、$\Psi$、$\Omega$这十一个，其余字母没有对应的大写形式）。
> 另外`\epsilon`和`\varepsilon`、`\theta`和`\vartheta`、`\phi`和`\varphi`、`\rho`和`\varrho`、`\pi`和`\varpi`、`\sigma`和`\varsigma`是同一字母的两种字形，可以按喜好任选。

需要“直立”的希腊字母（表示单位而非变量时常用）：大写希腊字母本来就是正体，直接写`\Gamma`、`\Omega`即可；`upgreek`宏包只提供**小写**的正体形式，如`\upalpha`、`\upbeta`、`\uppi`（$\upalpha$、$\upbeta$、$\uppi$）。**没有**`\upGamma`、`\upOmega`这种写法，写了只会显示成原样字符。

#### 8. 关系、运算符与箭头

```markdown
关系：$a \leq b$、$a \geq b$、$a \neq b$、$a \approx b$、$a \equiv b$、$a \sim b$、$a \cong b$、$a \propto b$

集合：$A \subset B$、$A \subseteq B$、$A \cup B$、$A \cap B$、$x \in A$、$x \notin A$、$\varnothing$

运算：$a \times b$、$a \div b$、$a \pm b$、$a \cdot b$、$a \ast b$、$a \circ b$、$\nabla f$

箭头：$\rightarrow$、$\leftarrow$、$\Rightarrow$、$\Leftarrow$、$\leftrightarrow$、$\Leftrightarrow$、$\longrightarrow$、$\mapsto$

逻辑：$\forall x$、$\exists y$、$\neg p$、$p \land q$、$p \lor q$、$\therefore$、$\because$

带字的箭头：$A \xrightarrow{\text{加热}} B$、$A \xleftarrow{\text{还原}} B$、$A \xlongequal{\Delta} B$
```

关系：$a \leq b$、$a \geq b$、$a \neq b$、$a \approx b$、$a \equiv b$、$a \propto b$

集合：$A \subset B$、$A \cup B$、$A \cap B$、$x \in A$、$x \notin A$、$\varnothing$

运算：$a \times b$、$a \div b$、$a \pm b$、$a \cdot b$、$a \circ b$、$\nabla f$

箭头：$\rightarrow$、$\Rightarrow$、$\leftrightarrow$、$\Leftrightarrow$、$\longrightarrow$、$\mapsto$

逻辑：$\forall x$、$\exists y$、$\neg p$、$p \land q$、$p \lor q$、$\therefore$、$\because$

带字的箭头：$A \xrightarrow{\text{加热}} B$、$A \xlongequal{\Delta} B$

> [!tip]
>
> 内置了`centernot`宏包，可以在任意关系符号上加一道斜杠：$a \centernot\subset B$、$x \centernot\equiv y$。

#### 9. 大型运算符与极限

```markdown
$\sum_{i=1}^{n} i$、$\prod_{k=1}^{n} k$、$\int_0^1 x^2\,dx$、$\oint_C \vec F \cdot d\vec r$

$\lim_{x \to 0} \frac{\sin x}{x} = 1$、$\bigcup_{i \in I} A_i$、$\iiint_V \rho\,dV$

上下限想强行放到正上/正下方用\limits，反之用\nolimits：$\sum\limits_{i=1}^{n}$ 与 $\sum\nolimits_{i=1}^{n}$
```

$\sum_{i=1}^{n} i$、$\prod_{k=1}^{n} k$、$\int_0^1 x^2\,dx$、$\oint_C \vec F \cdot d\vec r$

$\lim_{x \to 0} \frac{\sin x}{x} = 1$、$\bigcup_{i \in I} A_i$、$\iiint_V \rho\,dV$

独立公式里上下限默认就在正上下方，行内公式默认被挤到右侧——这正是`$\sum\limits_{i=1}^{n}$` 与 `$\sum\nolimits_{i=1}^{n}$` 的区别所在。

#### 10. 字体与文字

```markdown
$\mathrm{abc}$ 直立、$\mathbf{abc}$ 粗体、$\mathit{abc}$ 斜体、$\mathsf{abc}$ 无衬线、$\mathtt{abc}$ 等宽

$\mathbb{R}$ 黑板粗体（实数集）、$\mathcal{O}$ 花体、$\mathscr{L}$ 手写体、$\mathfrak{g}$ 哥特体

粗希腊字母：$\boldsymbol{\alpha}$、$\boldsymbol{\nabla} f$

公式里夹中文或单词用\text：$\text{其中 } n \in \mathbb{N}$、$f(x) = 2x \quad \text{（线性函数）}$
```

$\mathrm{abc}$、$\mathbf{abc}$、$\mathit{abc}$、$\mathsf{abc}$、$\mathtt{abc}$

$\mathbb{R}$、$\mathcal{O}$、$\mathscr{L}$、$\mathfrak{g}$

$\boldsymbol{\alpha}$、$\boldsymbol{\nabla} f$

$\text{其中 } n \in \mathbb{N}$、$f(x) = 2x \quad \text{（线性函数）}$

> [!note]
>
> 数学字体由MathJax自带的字体渲染，中文字符会回退到系统字体，所以$\text{中文}$的字形可能和你系统上装的字体有关。
>
> 另外`\mathbb`只支持大写字母。

#### 11. 空格与对齐微调

LaTeX在数学模式下**会忽略普通空格**，`$a b$`和`$a    b$`长得一样。要留白必须用专门的间距命令：

```markdown
$a\,b$、$a\:b$、$a\;b$、$a\quad b$、$a\qquad b$、负间距$a\!b$
```

由小到大：$a\,b$、$a\:b$、$a\;b$、$a\quad b$、$a\qquad b$，负间距：$a\!b$

常用的是`\,`（微空格，写在微分的`d`前面最典型：$\int x\,dx$）和`\quad`（分隔条件：$x > 0 \quad \forall x \in S$）。

#### 12. 重音与装饰

```markdown
$\hat{a}$、$\bar{a}$、$\vec{a}$、$\dot{a}$、$\ddot{a}$、$\tilde{a}$、$\check{a}$、$\acute{a}$、$\grave{a}$

宽版本：$\widehat{ABC}$、$\overline{AB}$、$\underline{AB}$、$\overrightarrow{AB}$、$\widetilde{ABC}$

上下标注：$\overbrace{a + b + c}^{\text{三项}}$、$\underbrace{1 + 1 + \cdots + 1}_{n\ \text{个}}$
```

$\hat{a}$、$\bar{a}$、$\vec{a}$、$\dot{a}$、$\ddot{a}$、$\tilde{a}$、$\acute{a}$

$\widehat{ABC}$、$\overline{AB}$、$\overrightarrow{AB}$

$\overbrace{a + b + c}^{\text{三项}}$、$\underbrace{1 + 1 + \cdots + 1}_{n\ \text{个}}$

---

## 三、结构与多行公式

#### 13. 矩阵与行列式

````markdown
```markdown
\begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix}   圆括号
\begin{bmatrix} a & b \\ c & d \end{bmatrix}   方括号
\begin{Bmatrix} 1 & 2 \\ 3 & 4 \end{Bmatrix}   花括号
\begin{vmatrix} a & b \\ c & d \end{vmatrix}   行列式
\begin{Vmatrix} 1 & 2 \\ 3 & 4 \end{Vmatrix}   范数
\begin{matrix} 1 & 2 \\ 3 & 4 \end{matrix}     不带括号
\end命令与begin同名即可
````

$$
\begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix} \quad
\begin{bmatrix} a & b \\ c & d \end{bmatrix} \quad
\begin{vmatrix} a & b \\ c & d \end{vmatrix}
$$

带省略号和分块矩阵：

$$
A = \begin{bmatrix} a_{11} & a_{12} & \cdots & a_{1n} \\ a_{21} & a_{22} & \cdots & a_{2n} \\ \vdots & \vdots & \ddots & \vdots \\ a_{m1} & a_{m2} & \cdots & a_{mn} \end{bmatrix}
$$

需要自定义列格式（对齐、加竖线）时用`array`，`{c}`居中、`{l}`左对齐、`{r}`右对齐、`{|c|}`加竖线：

$$
\left\{ \begin{array}{c|c} x & y \\ \hline 1 & 2 \end{array} \right\}
$$

> [!caution]
>
> 在**文档预览**里，矩阵单元格之间如果写裸竖线`|`，会被Markdown当成表格分隔符，公式会被拦腰截断。需要竖线时用`\vert`、`\lvert`、`\rvert`、`\mid`这些命令名，不要用`|`字符。

#### 14. 分段函数`cases`

```markdown
$$
f(x) = \begin{cases} x^2 & x \geq 0 \\ -x & x < 0 \end{cases}
$$
```

$$
f(x) = \begin{cases} x^2 & x \geq 0 \\ -x & x < 0 \end{cases}
$$

#### 15. 多行对齐

`aligned`最常用（可以在行内、也可以嵌在`$$`里），`&`标对齐位置，`\\`换行：

$$
\begin{aligned}
(x+y)^2 &= (x+y)(x+y) \\
&= x^2 + xy + yx + y^2 \\
&= x^2 + 2xy + y^2
\end{aligned}
$$

`gathered`让每行各自居中，不用`&`：

$$
\begin{gathered}
a + b = c \\
2x - 1 = 0 \\
y = f(x)
\end{gathered}
$$

两列对齐用`alignedat`或者干脆两组`aligned`；整块加方框用`\boxed`：

$$
\boxed{\begin{aligned}
\nabla \cdot \vec E &= \frac{\rho}{\varepsilon_0} \\
\nabla \times \vec B &= \mu_0 \vec J + \mu_0 \varepsilon_0 \frac{\partial \vec E}{\partial t}
\end{aligned}}
$$

#### 16. 公式编号

MathJax不会自动给公式编号。想要编号就用`\tag`手动标：

$$
E = mc^2 \tag{1}
$$

$$
\frac{\partial u}{\partial t} + \nabla \cdot (u \vec v) = 0 \tag{2.1}
$$

> [!warning]
>
> LaTeX里的`\label` + `\ref`交叉引用在Archive Markdown Editor里**不可靠**（每个公式是独立排版单元），需要引用请直接把编号写成文字，比如“由式(1)可得”。

#### 17. 方框、划线、圈注

```markdown
$\boxed{E=mc^2}$　$\boxed{2\sqrt{3} < 4}$

划掉：$\cancel{a} + b$、$\bcancel{x}$、$\xcancel{y}$、$\cancelto{0}{\frac{1}{n}}$

加边框：$\bbox[5px,border:2px solid red]{x^2 + y^2}$

圈起来：$\enclose{circle}{x} + y$，方框：$\boxed{x}$
```

$\boxed{E=mc^2}$　划掉：$\cancel{a} + b$、$\xcancel{y}$、$\cancelto{0}{\frac{1}{n}}$

$\bbox[5px,border:2px solid red]{x^2 + y^2}$　圈注：$\enclose{circle}{x} + y$

#### 18. 颜色

```markdown
$\color{red}{\frac{1}{2}}$、$\color{#16a34a}{\sqrt{2}}$、$\textcolor{blue}{\pi}$

带底色：$\bbox[yellow]{x^2}$、加内边距$\bbox[yellow,5px]{x^2}$、再加边框$\bbox[yellow,5px,border:2px solid red]{x^2}$
```

$\color{red}{\frac{1}{2}}$、$\color{#16a34a}{\sqrt{2}}$、$\textcolor{blue}{\pi}$

带底色：$\bbox[yellow]{x^2}$、加内边距$\bbox[yellow,5px]{x^2}$、再加边框$\bbox[yellow,5px,border:2px solid red]{x^2}$

> [!note]
>
> 支持`red`、`blue`、`green`、`yellow`、`orange`、`purple`、`gray`、`cyan`、`magenta`、`brown`等颜色名，也支持`#rrggbb`十六进制写法。

> [!caution]
>
> **`$`不能套`$`。** 标准LaTeX里给公式加底色常写`\colorbox{yellow}{$x^2$}`，但这段文字交给MathJax之前，定界符配对只看“遇到下一个`$`就收尾”，嵌套会被拆成两段坏公式。文档预览里请改用上面`\bbox[...]`的写法；`\colorbox`只在需要包住**纯文字**时使用。

---

## 四、内置宏包能做什么

Archive Markdown Editor已经预先加载了一批宏包，下面这些命令**可以直接用**，不需要任何声明。

#### 19. 化学方程式`\ce`（mhchem）

```markdown
$$\ce{2H2 + O2 -> 2H2O}$$

$$\ce{CaCO3 <=> CaO + CO2 ^}$$

$$\ce{Fe^{3+} + 3OH- -> Fe(OH)3 v}$$

$$\ce{CH4 + 2O2 ->[\text{点燃}] CO2 + 2H2O}$$

离子与pH：$\ce{H2SO4 <-> H+ + HSO4-}$、$\ce{[Cu(NH3)4]^2+}$
```

$$\ce{2H2 + O2 -> 2H2O}$$

$$\ce{CaCO3 <=> CaO + CO2 ^}$$

$$\ce{Fe^{3+} + 3OH- -> Fe(OH)3 v}$$

$$\ce{CH4 + 2O2 ->[\text{点燃}] CO2 + 2H2O}$$

$\ce{H2SO4 <-> H+ + HSO4-}$、$\ce{[Cu(NH3)4]^2+}$

> [!tip]
>
> 在`\ce`里，上下标用`^`和`_`，电荷直接写`3+`，气体和沉淀符号用`^`和`v`。写化学式比手写`\text{H}_2\text{O}`省事得多。

#### 20. 单位与度数

```markdown
化学式单位：$\pu{343 m/s}$、$\pu{6.02e23 mol-1}$、$\pu{12.01 g/mol}$

角度与温度：$30\degree$、$98.6\celsius$、$\mu$写作`\micro`、$\Omega$写作`\ohm`
```

$\pu{343 m/s}$、$\pu{6.02e23 mol-1}$、$\pu{12.01 g/mol}$

$30\degree$、$98.6\celsius$、$1\,\micro m$、$5\,\ohm$

#### 21. 物理速记（physics）

```markdown
导数：$\dv{y}{x}$、二阶$\dv[2]{y}{x}$、偏导$\pdv{u}{x}$、混合偏导$\pdv[2]{z}{x}{y}$

定积分：$\intd{x}{0}{1}$；期望与模：$\expval{A}$、$\abs{x}$、$\norm{\vec v}$、$\comm{A}{B}$
```

$\dv{y}{x}$、$\dv[2]{y}{x}$、$\pdv{u}{x}$、$\pdv[2]{z}{x}{y}$

$\abs{x}$、$\norm{\vec v}$、$\expval{A}$、$\comm{A}{B}$

> [!note]
>
> `physics`包里的`\qty`、`\SI`风格命令依赖`siunitx`，本软件没有加载。单位请用上面第20节的`\pu`。

#### 22. 量子力学记号（braket）

$\braket{\phi | \psi}$、$\braket{\psi}$、$\ket{\psi}$、$\bra{\phi}$、$\Ket{\psi}$、$\Bra{\phi}$

写法依次是`\braket{\phi \vert \psi}`、`\ket{\psi}`、`\bra{\phi}`、`\Ket{\psi}`、`\Bra{\phi}`（大写的`\Ket`/`\Bra`会把竖线拉得更高）。

> [!caution]
>
> 上面示例里用`\vert`而不是`|`，是为了躲开Markdown表格语法的干扰——写进表格单元格时裸`|`会把公式拦腰截断。正文里写`\braket{\phi | \psi}`同样能正常渲染。

#### 23. 交换图（amscd）

$$
\begin{CD}
A @>f>> B @>g>> C \\
@VhVV @VkVV @VmVV \\
D @>u>> E @>v>> F
\end{CD}
$$

箭头方向：`@>>>`向右、`@<<<`向左、`@VVV`向下、`@AAA`向上；想在箭头上方写文字用`@>文字>>`，下方用`@>>文字>`；`@@`是占位空格，用来撑开对齐。

#### 24. 其他已加载的宏包一览

`base`、`ams`、`action`、`amscd`、`bbox`、`boldsymbol`、`braket`、`bussproofs`、`cancel`、`cases`、`centernot`、`color`、`colortbl`、`empheq`、`enclose`、`extpfeil`、`gensymb`、`html`、`mathtools`、`mhchem`、`physics`、`tagformat`、`upgreek`、`verb`。

`mathtools`里常用的有`\coloneqq`（$A \coloneqq B$）、`\mathllap`、`\smash`；`empheq`提供`\boxed`配合`align`的写法。`\newcommand`可以在**单个公式内部**定义临时宏，但**不会跨公式保留**，想要“全局宏”目前只能复制粘贴。

---

## 五、常见报错与排查

#### 25. 错误对照表

| 现象 | 原因 | 解决办法 |
|:---|:---|:---|
| 公式下方出现红色`Missing {` | `\left`没有配对的`\right` | 补齐，或用`\left. ... \right)` |
| 出现`\begin{xxx} ended by \end{yyy}` | `begin`/`end`环境名不一致 | 两处名字改成一样 |
| 公式里凭空多出一行空行、反斜杠成对显示 | 沿用了旧版“`.md`文件里要写双反斜杠”的写法；现在渲染前会自动补，等于多打了一层 | 公式内部改回单反斜杠：换行写`\\`、左花括号写`\{` |
| 某个命令整个显示成红色原样字符 | 命令名拼错，或它属于没启用的宏包（例如大写正体希腊字母`\upGamma`本就不存在） | 对照第24节的宏包清单核对；大写希腊字母直接写`\Gamma` |
| 公式中间出现斜体或`<em>` | `$a*b*c$`里两个`*`被Markdown当成强调 | 换`\times`、`\cdot`、`\ast` |
| 公式在表格单元格里被截断 | 数学里的裸竖线`\|`与表格语法冲突 | 改用`\vert`、`\lvert`、`\mid` |
| 行内公式跨行不生效 | 行内`$...$`必须在同一行内闭合 | 拆成两个公式，或改用`$$...$$` |
| 独立公式只渲染出一半 | `$$`块中间夹了空行，被Markdown切成两段 | 去掉中间的空行 |
| 出现“半个美元符号”配对成公式 | 一段文字里有两个未被识别的`$` | 字面美元符号放进行内代码 `` `$5` `` |
| 命令完全不显示或原样输出 | 该命令属于未加载的宏包 | 换用等价的基础写法 |

#### 26. 调试建议

> [!tip]
>
> 1. **先把公式删到最小**。删到只剩`\frac{1}{2}`能渲染，再一段一段加回去，出错的那一段就是元凶。
> 2. **善用「工具 > LaTeX编辑器」**。它把源码直接交给MathJax，不经过Markdown，能帮你把“LaTeX本身写错了”和“被Markdown吃了”这两类问题分开。
> 3. **看报错文字**。MathJax的报错信息非常具体（`Missing } inserted`、`Undefined control sequence: \xxx`），`Undefined control sequence`基本就等于“这个宏包没加载或者命令拼错了”。
> 4. **竖线换命令名、星号换成`\times`、括号配平**，能解决九成的“文档里不渲染”。反斜杠那一层已经由预处理管好了，正文和「工具 > LaTeX编辑器」写法一致，不必再分两种记。

#### 27. 本软件不支持的内容

> [!caution]
>
> 下面这些是LaTeX文档排版能力，MathJax不提供，写了不会有任何效果：
>
> - 文档结构与样式：`\documentclass`、`\usepackage`、`\begin{document}`、`\section`、`\maketitle`、页眉页脚、`\newpage`
> - 版面浮动与插图：`\begin{figure}`、`\includegraphics`、`\begin{tabular}`（数学模式内的`array`可用）、`\multicol`
> - 字体安装与`\fontfamily`、`\href`超链接请用Markdown的`[]( )`语法
> - TikZ、Pgfplots、Circuitikz等绘图宏包。需要画图请用「工具 > Mermaid编辑器」或Mermaid代码块
> - BibTeX参考文献、`\cite`

---

## 六、延伸阅读

- [MathJax支持的TeX命令完整列表](https://docs.mathjax.org/en/latest/input/tex/macros/index.html)（可以按“在Archive Markdown Editor里是否可用”对照第24节的宏包清单）
- [mhchem化学式语法](https://mhchem.github.io/MathJax-mhchem/)
- [LaTeX官方符号表（Comprehensive Symbol List）](https://tug.ctan.org/info/symbols/comprehensive/symbols-a4.pdf)，内容远多于本软件支持范围，查阅时以第24节为准
