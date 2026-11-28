# LaTeX語法學習

> [!note]
>
> 本文只講**數學公式**部分。Archive Markdown Editor內建的是MathJax，它實現的是LaTeX的數學排版子集，不認識`\documentclass`、`\section`、表格、插圖這類「文檔排版」命令。
>
> 文中每一條示例都在Archive Markdown Editor裡實測可渲染。想邊改邊看，請用菜單欄「工具 > LaTeX編輯器」。

---

## 一、先弄懂三件事

#### 1. 兩種定界符：`$...$` 與 `$$...$$`

```markdown
行內公式：$E = mc^2$ 可以嵌在句子裡。

獨立公式（單獨成塊、居中）：

$$
\int_{-\infty}^{+\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$
```

行內公式：$E = mc^2$ 可以嵌在句子裡。

獨立公式（單獨成塊、居中）：

$$
\int_{-\infty}^{+\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$

> [!warning]
>
> Archive Markdown Editor只啓用了`$`和`$$`。LaTeX裡常見的`\( ... \)`和`\[ ... \]`**不會**被識別，寫了只會顯示成普通文本。

#### 2. 反斜槓規則：一個反斜槓寫到底

本軟體在把Markdown交給MathJax之前會先做一道**數學片段預處理**（`src/renderer/src/latex-preprocess.js`），替公式裡的反斜槓補好本來會被Markdown轉義掉的那一層。所以你**只管按LaTeX的習慣寫一個反斜槓**，正文和「工具 > LaTeX編輯器」兩處的寫法完全一致：

| 你想讓MathJax看到的 | 在Markdown正文裡寫 | 在「工具 > LaTeX編輯器」裡寫 |
|:---|:---|:---|
| 左大括號定界符 | `\{` | `\{` |
| 換行 | `\\` | `\\` |
| 編號`\#1` | `\#1` | `\#1` |
| 細空格 | `\,` | `\,` |
| 箭頭 | `\rightarrow` | `\rightarrow` |

下面兩個例子都是單反斜槓寫法，也都能正常渲染：

$$
\begin{bmatrix} a & b \\ c & d \end{bmatrix} \qquad
\left\{ \begin{array}{c|c} x & y \\ \hline 1 & 2 \end{array} \right\}
$$

> [!warning]
>
> 反斜槓這一層軟體替你補好了，但Markdown還有兩處會先插手：**公式裡的裸星號`*`可能被當成強調**（乘號請寫`\times`、`\cdot`），**表格單元格裡裸豎線會把公式攔腰切斷**（絕對值請寫`\vert`、`\lvert`、`\mid`）。此外預處理刻意不碰程式碼區塊和行內程式碼——那是給讀者看的原始碼，本來就不該渲染。

#### 3. 程式碼區塊裡不會渲染

`````markdown
```markdown
$\alpha$
```
`````

```markdown
$\alpha$
```

行內程式碼 `` `$\alpha$` `` 同理。想顯示「原始碼本身」就放進程式碼區塊，想渲染就寫在程式碼區塊外面。

---

## 二、基礎語法

#### 4. 上下標與分組`{}`

`^`是上標，`_`是下標。**它們只管後面緊跟的那一個字符**，多字符必須用`{}`包起來。

```markdown
上標一個字符：$x^2$，多個字符要寫括號：$x^{2n+1}$

下標同理：$a_1$ 與 $a_{12}$

同時有上下標：$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$

左右下標：$H_n^{(1)}$，前置下標：${}_1^2X$
```

上標一個字符：$x^2$，多個字符要寫括號：$x^{2n+1}$

下標同理：$a_1$ 與 $a_{12}$

同時有上下標：$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$

左右下標：$H_n^{(1)}$，前置下標：${}_1^2X$

> [!caution]
>
> 忘記`{}`是最常見的語義錯誤：$x^2n$ 表示「$x$的平方再乘$n$」，而不是$x$的$2n$次方。

#### 5. 分數與根式

```markdown
$\frac{1}{2}$、$\dfrac{a+b}{c+d}$、$\tfrac{1}{x}$

連分數：$\cfrac{1}{1+\cfrac{1}{1+\cfrac{1}{x}}}$

根號：$\sqrt{2}$、$\sqrt[3]{\frac{x}{y}}$

也可以寫成斜槓形式：$a/b$
```

$\frac{1}{2}$、$\dfrac{a+b}{c+d}$、$\tfrac{1}{x}$

連分數：$\cfrac{1}{1+\cfrac{1}{1+\cfrac{1}{x}}}$

$\sqrt{2}$、$\sqrt[3]{\frac{x}{y}}$

> [!note]
>
> 行內公式裡`\frac`會被壓得很扁。想讓行內分數也撐開，用`\dfrac`；或者整段前面加`\displaystyle`。

#### 6. 括號與自動定界`\left` `\right`

```markdown
普通括號：$( \frac{a}{b} )$ 上下會擠

自動匹配高度：$\left( \frac{a}{b} \right)$、$\left[ \sum_{i=1}^{n} i \right]$

定界符可以是任意符號，也可以寫`.`表示「這一側不畫」：$\left\{ \frac{1}{2} \right.$

三段式用`\middle`：$\left. \frac{x^2}{2} \right|_{0}^{1}$
```

普通括號：$( \frac{a}{b} )$　對比自動高度：$\left( \frac{a}{b} \right)$、$\left[ \sum_{i=1}^{n} i \right]$

$\left\{ \frac{1}{2} \right.$　和　$\left. \frac{x^2}{2} \right|_{0}^{1}$

> [!warning]
>
> `\left`和`\right`必須成對出現在**同一個公式**裡，跨公式或漏寫會直接報錯。

#### 7. 希臘字母

大小寫只差首字母大小寫，其餘同名。

| 字母 | 寫法 | 字母 | 寫法 | 字母 | 寫法 | 字母 | 寫法 |
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
> 只有24個希臘字母，且**大小寫是兩條不同的命令**（`\alpha`是$\alpha$，`\Alpha`並不存在；大寫只有$\Gamma$、$\Delta$、$\Theta$、$\Lambda$、$\Xi$、$\Pi$、$\Sigma$、$\Upsilon$、$\Phi$、$\Psi$、$\Omega$這十一個，其餘字母沒有對應的大寫形式）。
> 另外`\epsilon`和`\varepsilon`、`\theta`和`\vartheta`、`\phi`和`\varphi`、`\rho`和`\varrho`、`\pi`和`\varpi`、`\sigma`和`\varsigma`是同一字母的兩種字形，可以按喜好任選。

需要「直立」的希臘字母（表示單位而非變數時常用）：大寫希臘字母本來就是正體，直接寫`\Gamma`、`\Omega`即可；`upgreek`宏包只提供**小寫**的正體形式，如`\upalpha`、`\upbeta`、`\uppi`（$\upalpha$、$\upbeta$、$\uppi$）。**沒有**`\upGamma`、`\upOmega`這種寫法，寫了只會顯示成原樣字元。

#### 8. 關係、運算符與箭頭

```markdown
關係：$a \leq b$、$a \geq b$、$a \neq b$、$a \approx b$、$a \equiv b$、$a \sim b$、$a \cong b$、$a \propto b$

集合：$A \subset B$、$A \subseteq B$、$A \cup B$、$A \cap B$、$x \in A$、$x \notin A$、$\varnothing$

運算：$a \times b$、$a \div b$、$a \pm b$、$a \cdot b$、$a \ast b$、$a \circ b$、$\nabla f$

箭頭：$\rightarrow$、$\leftarrow$、$\Rightarrow$、$\Leftarrow$、$\leftrightarrow$、$\Leftrightarrow$、$\longrightarrow$、$\mapsto$

邏輯：$\forall x$、$\exists y$、$\neg p$、$p \land q$、$p \lor q$、$\therefore$、$\because$

帶字的箭頭：$A \xrightarrow{\text{加熱}} B$、$A \xleftarrow{\text{還原}} B$、$A \xlongequal{\Delta} B$
```

關係：$a \leq b$、$a \geq b$、$a \neq b$、$a \approx b$、$a \equiv b$、$a \propto b$

集合：$A \subset B$、$A \cup B$、$A \cap B$、$x \in A$、$x \notin A$、$\varnothing$

運算：$a \times b$、$a \div b$、$a \pm b$、$a \cdot b$、$a \circ b$、$\nabla f$

箭頭：$\rightarrow$、$\Rightarrow$、$\leftrightarrow$、$\Leftrightarrow$、$\longrightarrow$、$\mapsto$

邏輯：$\forall x$、$\exists y$、$\neg p$、$p \land q$、$p \lor q$、$\therefore$、$\because$

帶字的箭頭：$A \xrightarrow{\text{加熱}} B$、$A \xlongequal{\Delta} B$

> [!tip]
>
> 內建了`centernot`宏包，可以在任意關係符號上加一道斜槓：$a \centernot\subset B$、$x \centernot\equiv y$。

#### 9. 大型運算符與極限

```markdown
$\sum_{i=1}^{n} i$、$\prod_{k=1}^{n} k$、$\int_0^1 x^2\,dx$、$\oint_C \vec F \cdot d\vec r$

$\lim_{x \to 0} \frac{\sin x}{x} = 1$、$\bigcup_{i \in I} A_i$、$\iiint_V \rho\,dV$

上下限想強行放到正上/正下方用\limits，反之用\nolimits：$\sum\limits_{i=1}^{n}$ 與 $\sum\nolimits_{i=1}^{n}$
```

$\sum_{i=1}^{n} i$、$\prod_{k=1}^{n} k$、$\int_0^1 x^2\,dx$、$\oint_C \vec F \cdot d\vec r$

$\lim_{x \to 0} \frac{\sin x}{x} = 1$、$\bigcup_{i \in I} A_i$、$\iiint_V \rho\,dV$

獨立公式裡上下限預設就在正上下方，行內公式預設被擠到右側——這正是`$\sum\limits_{i=1}^{n}$` 與 `$\sum\nolimits_{i=1}^{n}$` 的區別所在。

#### 10. 字體與文字

```markdown
$\mathrm{abc}$ 直立、$\mathbf{abc}$ 粗體、$\mathit{abc}$ 斜體、$\mathsf{abc}$ 無襯線、$\mathtt{abc}$ 等寬

$\mathbb{R}$ 黑板粗體（實數集）、$\mathcal{O}$ 花體、$\mathscr{L}$ 手寫體、$\mathfrak{g}$ 哥特體

粗希臘字母：$\boldsymbol{\alpha}$、$\boldsymbol{\nabla} f$

公式裡夾中文或單詞用\text：$\text{其中 } n \in \mathbb{N}$、$f(x) = 2x \quad \text{（線性函數）}$
```

$\mathrm{abc}$、$\mathbf{abc}$、$\mathit{abc}$、$\mathsf{abc}$、$\mathtt{abc}$

$\mathbb{R}$、$\mathcal{O}$、$\mathscr{L}$、$\mathfrak{g}$

$\boldsymbol{\alpha}$、$\boldsymbol{\nabla} f$

$\text{其中 } n \in \mathbb{N}$、$f(x) = 2x \quad \text{（線性函數）}$

> [!note]
>
> 數學字體由MathJax自帶的字體渲染，中文字符會回退到系統字體，所以$\text{中文}$的字形可能和你係統上裝的字體有關。
>
> 另外`\mathbb`只支援大寫字母。

#### 11. 空格與對齊微調

LaTeX在數學模式下**會忽略普通空格**，`$a b$`和`$a    b$`長得一樣。要留白必須用專門的間距命令：

```markdown
$a\,b$、$a\:b$、$a\;b$、$a\quad b$、$a\qquad b$、負間距$a\!b$
```

由小到大：$a\,b$、$a\:b$、$a\;b$、$a\quad b$、$a\qquad b$，負間距：$a\!b$

常用的是`\,`（微空格，寫在微分的`d`前面最典型：$\int x\,dx$）和`\quad`（分隔條件：$x > 0 \quad \forall x \in S$）。

#### 12. 重音與裝飾

```markdown
$\hat{a}$、$\bar{a}$、$\vec{a}$、$\dot{a}$、$\ddot{a}$、$\tilde{a}$、$\check{a}$、$\acute{a}$、$\grave{a}$

寬版本：$\widehat{ABC}$、$\overline{AB}$、$\underline{AB}$、$\overrightarrow{AB}$、$\widetilde{ABC}$

上下標註：$\overbrace{a + b + c}^{\text{三項}}$、$\underbrace{1 + 1 + \cdots + 1}_{n\ \text{個}}$
```

$\hat{a}$、$\bar{a}$、$\vec{a}$、$\dot{a}$、$\ddot{a}$、$\tilde{a}$、$\acute{a}$

$\widehat{ABC}$、$\overline{AB}$、$\overrightarrow{AB}$

$\overbrace{a + b + c}^{\text{三項}}$、$\underbrace{1 + 1 + \cdots + 1}_{n\ \text{個}}$

---

## 三、結構與多行公式

#### 13. 矩陣與行列式

````markdown
```markdown
\begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix}   圓括號
\begin{bmatrix} a & b \\ c & d \end{bmatrix}   方括號
\begin{Bmatrix} 1 & 2 \\ 3 & 4 \end{Bmatrix}   花括號
\begin{vmatrix} a & b \\ c & d \end{vmatrix}   行列式
\begin{Vmatrix} 1 & 2 \\ 3 & 4 \end{Vmatrix}   範數
\begin{matrix} 1 & 2 \\ 3 & 4 \end{matrix}     不帶括號
\end命令與begin同名即可
````

$$
\begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix} \quad
\begin{bmatrix} a & b \\ c & d \end{bmatrix} \quad
\begin{vmatrix} a & b \\ c & d \end{vmatrix}
$$

帶省略號和分塊矩陣：

$$
A = \begin{bmatrix} a_{11} & a_{12} & \cdots & a_{1n} \\ a_{21} & a_{22} & \cdots & a_{2n} \\ \vdots & \vdots & \ddots & \vdots \\ a_{m1} & a_{m2} & \cdots & a_{mn} \end{bmatrix}
$$

需要自定義列格式（對齊、加豎線）時用`array`，`{c}`居中、`{l}`左對齊、`{r}`右對齊、`{|c|}`加豎線：

$$
\left\{ \begin{array}{c|c} x & y \\ \hline 1 & 2 \end{array} \right\}
$$

> [!caution]
>
> 在**文檔預覽**裡，矩陣單元格之間如果寫裸豎線`|`，會被Markdown當成表格分隔符，公式會被攔腰截斷。需要豎線時用`\vert`、`\lvert`、`\rvert`、`\mid`這些命令名，不要用`|`字符。

#### 14. 分段函數`cases`

```markdown
$$
f(x) = \begin{cases} x^2 & x \geq 0 \\ -x & x < 0 \end{cases}
$$
```

$$
f(x) = \begin{cases} x^2 & x \geq 0 \\ -x & x < 0 \end{cases}
$$

#### 15. 多行對齊

`aligned`最常用（可以在行內、也可以嵌在`$$`裡），`&`標對齊位置，`\\`換行：

$$
\begin{aligned}
(x+y)^2 &= (x+y)(x+y) \\
&= x^2 + xy + yx + y^2 \\
&= x^2 + 2xy + y^2
\end{aligned}
$$

`gathered`讓每行各自居中，不用`&`：

$$
\begin{gathered}
a + b = c \\
2x - 1 = 0 \\
y = f(x)
\end{gathered}
$$

兩列對齊用`alignedat`或者乾脆兩組`aligned`；整塊加方框用`\boxed`：

$$
\boxed{\begin{aligned}
\nabla \cdot \vec E &= \frac{\rho}{\varepsilon_0} \\
\nabla \times \vec B &= \mu_0 \vec J + \mu_0 \varepsilon_0 \frac{\partial \vec E}{\partial t}
\end{aligned}}
$$

#### 16. 公式編號

MathJax不會自動給公式編號。想要編號就用`\tag`手動標：

$$
E = mc^2 \tag{1}
$$

$$
\frac{\partial u}{\partial t} + \nabla \cdot (u \vec v) = 0 \tag{2.1}
$$

> [!warning]
>
> LaTeX裡的`\label` + `\ref`交叉引用在Archive Markdown Editor裡**不可靠**（每個公式是獨立排版單元），需要引用請直接把編號寫成文字，比如「由式(1)可得」。

#### 17. 方框、劃線、圈注

```markdown
$\boxed{E=mc^2}$　$\boxed{2\sqrt{3} < 4}$

劃掉：$\cancel{a} + b$、$\bcancel{x}$、$\xcancel{y}$、$\cancelto{0}{\frac{1}{n}}$

加邊框：$\bbox[5px,border:2px solid red]{x^2 + y^2}$

圈起來：$\enclose{circle}{x} + y$，方框：$\boxed{x}$
```

$\boxed{E=mc^2}$　劃掉：$\cancel{a} + b$、$\xcancel{y}$、$\cancelto{0}{\frac{1}{n}}$

$\bbox[5px,border:2px solid red]{x^2 + y^2}$　圈注：$\enclose{circle}{x} + y$

#### 18. 顏色

```markdown
$\color{red}{\frac{1}{2}}$、$\color{#16a34a}{\sqrt{2}}$、$\textcolor{blue}{\pi}$

帶底色：$\bbox[yellow]{x^2}$、加內邊距$\bbox[yellow,5px]{x^2}$、再加邊框$\bbox[yellow,5px,border:2px solid red]{x^2}$
```

$\color{red}{\frac{1}{2}}$、$\color{#16a34a}{\sqrt{2}}$、$\textcolor{blue}{\pi}$

帶底色：$\bbox[yellow]{x^2}$、加內邊距$\bbox[yellow,5px]{x^2}$、再加邊框$\bbox[yellow,5px,border:2px solid red]{x^2}$

> [!note]
>
> 支援`red`、`blue`、`green`、`yellow`、`orange`、`purple`、`gray`、`cyan`、`magenta`、`brown`等顏色名，也支援`#rrggbb`十六進制寫法。

> [!caution]
>
> **`$`不能套`$`。** 標準LaTeX裡給公式加底色常寫`\colorbox{yellow}{$x^2$}`，但這段文字交給MathJax之前，定界符配對只看「遇到下一個`$`就收尾」，嵌套會被拆成兩段壞公式。文檔預覽裡請改用上面`\bbox[...]`的寫法；`\colorbox`只在需要包住**純文字**時使用。

---

## 四、內建宏包能做什麼

Archive Markdown Editor已經預先載入了一批宏包，下面這些命令**可以直接用**，不需要任何聲明。

#### 19. 化學方程式`\ce`（mhchem）

```markdown
$$\ce{2H2 + O2 -> 2H2O}$$

$$\ce{CaCO3 <=> CaO + CO2 ^}$$

$$\ce{Fe^{3+} + 3OH- -> Fe(OH)3 v}$$

$$\ce{CH4 + 2O2 ->[\text{點燃}] CO2 + 2H2O}$$

離子與pH：$\ce{H2SO4 <-> H+ + HSO4-}$、$\ce{[Cu(NH3)4]^2+}$
```

$$\ce{2H2 + O2 -> 2H2O}$$

$$\ce{CaCO3 <=> CaO + CO2 ^}$$

$$\ce{Fe^{3+} + 3OH- -> Fe(OH)3 v}$$

$$\ce{CH4 + 2O2 ->[\text{點燃}] CO2 + 2H2O}$$

$\ce{H2SO4 <-> H+ + HSO4-}$、$\ce{[Cu(NH3)4]^2+}$

> [!tip]
>
> 在`\ce`裡，上下標用`^`和`_`，電荷直接寫`3+`，氣體和沉澱符號用`^`和`v`。寫化學式比手寫`\text{H}_2\text{O}`省事得多。

#### 20. 單位與度數

```markdown
化學式單位：$\pu{343 m/s}$、$\pu{6.02e23 mol-1}$、$\pu{12.01 g/mol}$

角度與溫度：$30\degree$、$98.6\celsius$、$\mu$寫作`\micro`、$\Omega$寫作`\ohm`
```

$\pu{343 m/s}$、$\pu{6.02e23 mol-1}$、$\pu{12.01 g/mol}$

$30\degree$、$98.6\celsius$、$1\,\micro m$、$5\,\ohm$

#### 21. 物理速記（physics）

```markdown
導數：$\dv{y}{x}$、二階$\dv[2]{y}{x}$、偏導$\pdv{u}{x}$、混合偏導$\pdv[2]{z}{x}{y}$

定積分：$\intd{x}{0}{1}$；期望與模：$\expval{A}$、$\abs{x}$、$\norm{\vec v}$、$\comm{A}{B}$
```

$\dv{y}{x}$、$\dv[2]{y}{x}$、$\pdv{u}{x}$、$\pdv[2]{z}{x}{y}$

$\abs{x}$、$\norm{\vec v}$、$\expval{A}$、$\comm{A}{B}$

> [!note]
>
> `physics`包裡的`\qty`、`\SI`風格命令依賴`siunitx`，本軟體沒有載入。單位請用上面第20節的`\pu`。

#### 22. 量子力學記號（braket）

$\braket{\phi | \psi}$、$\braket{\psi}$、$\ket{\psi}$、$\bra{\phi}$、$\Ket{\psi}$、$\Bra{\phi}$

寫法依次是`\braket{\phi \vert \psi}`、`\ket{\psi}`、`\bra{\phi}`、`\Ket{\psi}`、`\Bra{\phi}`（大寫的`\Ket`/`\Bra`會把豎線拉得更高）。

> [!caution]
>
> 上面示例裡用`\vert`而不是`|`，是為了躲開Markdown表格語法的干擾——寫進表格單元格時裸`|`會把公式攔腰截斷。正文裡寫`\braket{\phi | \psi}`同樣能正常渲染。

#### 23. 交換圖（amscd）

$$
\begin{CD}
A @>f>> B @>g>> C \\
@VhVV @VkVV @VmVV \\
D @>u>> E @>v>> F
\end{CD}
$$

箭頭方向：`@>>>`向右、`@<<<`向左、`@VVV`向下、`@AAA`向上；想在箭頭上方寫文字用`@>文字>>`，下方用`@>>文字>`；`@@`是佔位空格，用來撐開對齊。

#### 24. 其他已載入的宏包一覽

`base`、`ams`、`action`、`amscd`、`bbox`、`boldsymbol`、`braket`、`bussproofs`、`cancel`、`cases`、`centernot`、`color`、`colortbl`、`empheq`、`enclose`、`extpfeil`、`gensymb`、`html`、`mathtools`、`mhchem`、`physics`、`tagformat`、`upgreek`、`verb`。

`mathtools`裡常用的有`\coloneqq`（$A \coloneqq B$）、`\mathllap`、`\smash`；`empheq`提供`\boxed`配合`align`的寫法。`\newcommand`可以在**單個公式內部**定義臨時宏，但**不會跨公式保留**，想要「全局宏」目前只能複製貼上。

---

## 五、常見報錯與排查

#### 25. 錯誤對照表

| 現象 | 原因 | 解決辦法 |
|:---|:---|:---|
| 公式下方出現紅色`Missing {` | `\left`沒有配對的`\right` | 補齊，或用`\left. ... \right)` |
| 出現`\begin{xxx} ended by \end{yyy}` | `begin`/`end`環境名不一致 | 兩處名字改成一樣 |
| 公式裡憑空多出一行空行、反斜槓成對顯示 | 沿用了舊版「`.md`檔案裡要寫雙反斜槓」的寫法；現在渲染前會自動補，等於多打了一層 | 公式內部改回單反斜槓：換行寫`\\`、左大括號寫`\{` |
| 某個命令整個顯示成紅色原樣字元 | 命令名拼錯，或它屬於沒啟用的宏包（例如大寫正體希臘字母`\upGamma`本就不存在） | 對照第24節的宏包清單核對；大寫希臘字母直接寫`\Gamma` |
| 公式中間出現斜體或`<em>` | `$a*b*c$`裡兩個`*`被Markdown當成強調 | 換`\times`、`\cdot`、`\ast` |
| 公式在表格單元格裡被截斷 | 數學裡的裸豎線`\|`與表格語法衝突 | 改用`\vert`、`\lvert`、`\mid` |
| 行內公式跨行不生效 | 行內`$...$`必須在同一行內閉合 | 拆成兩個公式，或改用`$$...$$` |
| 獨立公式只渲染出一半 | `$$`塊中間夾了空行，被Markdown切成兩段 | 去掉中間的空行 |
| 出現「半個美元符號」配對成公式 | 一段文字裡有兩個未被識別的`$` | 字面美元符號放進行內程式碼 `` `$5` `` |
| 命令完全不顯示或原樣輸出 | 該命令屬於未載入的宏包 | 換用等價的基礎寫法 |

#### 26. 除錯建議

> [!tip]
>
> 1. **先把公式刪到最小**。刪到只剩`\frac{1}{2}`能渲染，再一段一段加回去，出錯的那一段就是元兇。
> 2. **善用「工具 > LaTeX編輯器」**。它把原始碼直接交給MathJax，不經過Markdown，能幫你把「LaTeX本身寫錯了」和「被Markdown吃了」這兩類問題分開。
> 3. **看報錯文字**。MathJax的報錯資訊非常具體（`Missing } inserted`、`Undefined control sequence: \xxx`），`Undefined control sequence`基本就等於「這個宏包沒載入或者命令拼錯了」。
> 4. **豎線換命令名、星號換成`\times`、括號配平**，能解決九成的「文檔裡不渲染」。反斜槓那一層已經由預處理管好了，正文和「工具 > LaTeX編輯器」寫法一致，不必再分兩種記。

#### 27. 本軟體不支援的內容

> [!caution]
>
> 下面這些是LaTeX文檔排版能力，MathJax不提供，寫了不會有任何效果：
>
> - 文檔結構與樣式：`\documentclass`、`\usepackage`、`\begin{document}`、`\section`、`\maketitle`、頁眉頁腳、`\newpage`
> - 版面浮動與插圖：`\begin{figure}`、`\includegraphics`、`\begin{tabular}`（數學模式內的`array`可用）、`\multicol`
> - 字體安裝與`\fontfamily`、`\href`超連結請用Markdown的`[]( )`語法
> - TikZ、Pgfplots、Circuitikz等繪圖宏包。需要畫圖請用「工具 > Mermaid編輯器」或Mermaid程式碼區塊
> - BibTeX參考文獻、`\cite`

---

## 六、延伸閱讀

- [MathJax支援的TeX命令完整列表](https://docs.mathjax.org/en/latest/input/tex/macros/index.html)（可以按「在Archive Markdown Editor裡是否可用」對照第24節的宏包清單）
- [mhchem化學式語法](https://mhchem.github.io/MathJax-mhchem/)
- [LaTeX官方符號表（Comprehensive Symbol List）](https://tug.ctan.org/info/symbols/comprehensive/symbols-a4.pdf)，內容遠多於本軟體支援範圍，查閱時以第24節為準
