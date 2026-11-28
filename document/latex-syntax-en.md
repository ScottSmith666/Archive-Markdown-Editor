# LaTeX Learning

> [!note]
>
> This guide covers the **math** part only. Archive Markdown Editor ships MathJax, which implements the math subset of LaTeX. It does not understand "document layout" commands such as `\documentclass`, `\section`, tables or figures.
>
> Every example below was verified to render inside Archive Markdown Editor. To edit and preview side by side, open "Tools > LaTeX Editor" from the menu bar.

---

## I. Three things to understand first

#### 1. Two delimiters: `$...$` and `$$...$$`

```markdown
Inline math: $E = mc^2$ can sit inside a sentence.

Display math (own block, centered):

$$
\int_{-\infty}^{+\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$
```

Inline math: $E = mc^2$ can sit inside a sentence.

Display math (own block, centered):

$$
\int_{-\infty}^{+\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$

> [!warning]
>
> Archive Markdown Editor only enables `$` and `$$`. The `\( ... \)` and `\[ ... \]` delimiters you may know from LaTeX are **not** recognised — they just show up as plain text.

#### 2. Backslash rules: one backslash, all the way

Before handing your Markdown to MathJax, the app runs a **math pre-pass** (`src/renderer/src/latex-preprocess.js`) that restores exactly the backslashes Markdown would otherwise escape. So **just write the single backslash LaTeX asks for** — a `.md` file and "Tools > LaTeX Editor" now expect the very same spelling:

| What MathJax should see | Write this in a `.md` file | Write this in "Tools > LaTeX Editor" |
|:---|:---|:---|
| opening brace delimiter | `\{` | `\{` |
| line break | `\\` | `\\` |
| numbering `\#1` | `\#1` | `\#1` |
| thin space | `\,` | `\,` |
| arrow | `\rightarrow` | `\rightarrow` |

Both examples below are written with single backslashes, and both render:

$$
\begin{bmatrix} a & b \\ c & d \end{bmatrix} \qquad
\left\{ \begin{array}{c|c} x & y \\ \hline 1 & 2 \end{array} \right\}
$$

> [!warning]
>
> The backslash layer is taken care of for you, but Markdown still gets in first in two places: **a bare `*` inside a formula may be read as emphasis** (spell multiplication as `\times` or `\cdot`), and **a bare pipe in a table cell cuts the formula in half** (spell absolute value as `\vert`, `\lvert` or `\mid`). The pre-pass deliberately skips code blocks and inline code — that is source text for readers, never something to render.

#### 3. Code blocks never render

`````markdown
```markdown
$\alpha$
```
`````

```markdown
$\alpha$
```

Inline code such as `` `$\alpha$` `` behaves the same way. Put it in a code block to show the source itself; keep it outside to render it.

---

## II. Basic syntax

#### 4. Super/subscripts and grouping `{}`

`^` is a superscript, `_` is a subscript. **They only apply to the single character that follows**, so anything longer must be wrapped in `{}`.

```markdown
One superscript character: $x^2$; a longer one needs braces: $x^{2n+1}$

Same for subscripts: $a_1$ vs $a_{12}$

Both at once: $\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$

Pre-fixed scripts: ${}_1^2X$, and $H_n^{(1)}$
```

One superscript character: $x^2$; a longer one needs braces: $x^{2n+1}$

Same for subscripts: $a_1$ vs $a_{12}$

Both at once: $\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$

Pre-fixed scripts: ${}_1^2X$, and $H_n^{(1)}$

> [!caution]
>
> Forgetting `{}` is the most common semantic bug: $x^2n$ means "the square of $x$, times $n$", not $x$ to the power $2n$.

#### 5. Fractions and radicals

```markdown
$\frac{1}{2}$, $\dfrac{a+b}{c+d}$, $\tfrac{1}{x}$

Continued fraction: $\cfrac{1}{1+\cfrac{1}{1+\cfrac{1}{x}}}$

Roots: $\sqrt{2}$, $\sqrt[3]{\frac{x}{y}}$

Slashes work too: $a/b$
```

$\frac{1}{2}$, $\dfrac{a+b}{c+d}$, $\tfrac{1}{x}$

Continued fraction: $\cfrac{1}{1+\cfrac{1}{1+\cfrac{1}{x}}}$

$\sqrt{2}$, $\sqrt[3]{\frac{x}{y}}$

> [!note]
>
> Inside a line, `\frac` gets squashed flat. Use `\dfrac` when you want a full-size fraction inline, or prefix the whole expression with `\displaystyle`.

#### 6. Brackets and automatic sizing with `\left` `\right`

```markdown
Plain brackets: $( \frac{a}{b} )$ get cramped

Automatic height: $\left( \frac{a}{b} \right)$, $\left[ \sum_{i=1}^{n} i \right]$

Any delimiter works, and `.` means "draw nothing on this side": $\left\{ \frac{1}{2} \right.$

Three-part delimiters use `\middle`: $\left. \frac{x^2}{2} \right|_{0}^{1}$
```

Plain brackets: $( \frac{a}{b} )$ vs automatic height: $\left( \frac{a}{b} \right)$, $\left[ \sum_{i=1}^{n} i \right]$

$\left\{ \frac{1}{2} \right.$ and $\left. \frac{x^2}{2} \right|_{0}^{1}$

> [!warning]
>
> `\left` and `\right` must appear **as a pair inside the same formula**. A missing or split pair is an immediate error.

#### 7. Greek letters

Upper case simply capitalises the first letter of the same command.

| Letter | Command | Letter | Command | Letter | Command | Letter | Command |
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
> There are only 24 Greek letters, and **upper and lower case are two different commands** (`\alpha` gives $\alpha$, while `\Alpha` does not exist). Only eleven of them have an upper-case form: $\Gamma$, $\Delta$, $\Theta$, $\Lambda$, $\Xi$, $\Pi$, $\Sigma$, $\Upsilon$, $\Phi$, $\Psi$, $\Omega$.
> Also, `\epsilon`/`\varepsilon`, `\theta`/`\vartheta`, `\phi`/`\varphi`, `\rho`/`\varrho`, `\pi`/`\varpi` and `\sigma`/`\varsigma` are two glyph variants of the same letter — pick whichever you like.

For "upright" Greek letters (common when a symbol denotes a unit rather than a variable): capital Greek letters are upright to begin with, so just write `\Gamma` or `\Omega`. The bundled `upgreek` package only adds upright **lowercase** forms such as `\upalpha`, `\upbeta` and `\uppi` ($\upalpha$, $\upbeta$, $\uppi$). There is no `\upGamma` or `\upOmega` — spelled that way they simply print as raw characters.

#### 8. Relations, operators and arrows

```markdown
Relations: $a \leq b$, $a \geq b$, $a \neq b$, $a \approx b$, $a \equiv b$, $a \sim b$, $a \cong b$, $a \propto b$

Sets: $A \subset B$, $A \subseteq B$, $A \cup B$, $A \cap B$, $x \in A$, $x \notin A$, $\varnothing$

Operators: $a \times b$, $a \div b$, $a \pm b$, $a \cdot b$, $a \ast b$, $a \circ b$, $\nabla f$

Arrows: $\rightarrow$, $\leftarrow$, $\Rightarrow$, $\Leftarrow$, $\leftrightarrow$, $\Leftrightarrow$, $\longrightarrow$, $\mapsto$

Logic: $\forall x$, $\exists y$, $\neg p$, $p \land q$, $p \lor q$, $\therefore$, $\because$

Labelled arrows: $A \xrightarrow{\text{heat}} B$, $A \xleftarrow{\text{reduce}} B$, $A \xlongequal{\Delta} B$
```

Relations: $a \leq b$, $a \geq b$, $a \neq b$, $a \approx b$, $a \equiv b$, $a \propto b$

Sets: $A \subset B$, $A \cup B$, $A \cap B$, $x \in A$, $x \notin A$, $\varnothing$

Operators: $a \times b$, $a \div b$, $a \pm b$, $a \cdot b$, $a \circ b$, $\nabla f$

Arrows: $\rightarrow$, $\Rightarrow$, $\leftrightarrow$, $\Leftrightarrow$, $\longrightarrow$, $\mapsto$

Logic: $\forall x$, $\exists y$, $\neg p$, $p \land q$, $p \lor q$, $\therefore$, $\because$

Labelled arrows: $A \xrightarrow{\text{heat}} B$, $A \xlongequal{\Delta} B$

> [!tip]
>
> The `centernot` package is bundled, so you can slash through any relation: $a \centernot\subset B$, $x \centernot\equiv y$.

#### 9. Large operators and limits

```markdown
$\sum_{i=1}^{n} i$, $\prod_{k=1}^{n} k$, $\int_0^1 x^2\,dx$, $\oint_C \vec F \cdot d\vec r$

$\lim_{x \to 0} \frac{\sin x}{x} = 1$, $\bigcup_{i \in I} A_i$, $\iiint_V \rho\,dV$

Force limits above/below with \limits, force them to the side with \nolimits: $\sum\limits_{i=1}^{n}$ vs $\sum\nolimits_{i=1}^{n}$
```

$\sum_{i=1}^{n} i$, $\prod_{k=1}^{n} k$, $\int_0^1 x^2\,dx$, $\oint_C \vec F \cdot d\vec r$

$\lim_{x \to 0} \frac{\sin x}{x} = 1$, $\bigcup_{i \in I} A_i$, $\iiint_V \rho\,dV$

In display mode limits sit above and below by default; inline they are squeezed to the side — that is exactly the difference between `$\sum\limits_{i=1}^{n}$` and `$\sum\nolimits_{i=1}^{n}$`.

#### 10. Fonts and text

```markdown
$\mathrm{abc}$ upright, $\mathbf{abc}$ bold, $\mathit{abc}$ italic, $\mathsf{abc}$ sans-serif, $\mathtt{abc}$ monospace

$\mathbb{R}$ blackboard bold (the reals), $\mathcal{O}$ calligraphic, $\mathscr{L}$ script, $\mathfrak{g}$ fraktur

Bold Greek: $\boldsymbol{\alpha}$, $\boldsymbol{\nabla} f$

Words inside math use \text: $\text{where } n \in \mathbb{N}$, $f(x) = 2x \quad \text{(a linear function)}$
```

$\mathrm{abc}$, $\mathbf{abc}$, $\mathit{abc}$, $\mathsf{abc}$, $\mathtt{abc}$

$\mathbb{R}$, $\mathcal{O}$, $\mathscr{L}$, $\mathfrak{g}$

$\boldsymbol{\alpha}$, $\boldsymbol{\nabla} f$

$\text{where } n \in \mathbb{N}$, $f(x) = 2x \quad \text{(a linear function)}$

> [!note]
>
> Math fonts come from MathJax itself. CJK characters inside `$\text{...}$` fall back to a system font, so their shapes depend on what you have installed.
>
> `\mathbb` only supports capital letters.

#### 11. Spacing and fine alignment

In math mode LaTeX **ignores ordinary spaces**, so `$a b$` and `$a    b$` look identical. To add room you need the dedicated spacing commands:

```markdown
$a\,b$, $a\:b$, $a\;b$, $a\quad b$, $a\qquad b$, negative space $a\!b$
```

From smallest to largest: $a\,b$, $a\:b$, $a\;b$, $a\quad b$, $a\qquad b$, and negative space: $a\!b$

The workhorses are `\,` (thin space; the classic use is before the `d` of a differential: $\int x\,dx$) and `\quad` (separating a condition: $x > 0 \quad \forall x \in S$).

#### 12. Accents and decorations

```markdown
$\hat{a}$, $\bar{a}$, $\vec{a}$, $\dot{a}$, $\ddot{a}$, $\tilde{a}$, $\check{a}$, $\acute{a}$, $\grave{a}$

Wide versions: $\widehat{ABC}$, $\overline{AB}$, $\underline{AB}$, $\overrightarrow{AB}$, $\widetilde{ABC}$

Braces with labels: $\overbrace{a + b + c}^{\text{three terms}}$, $\underbrace{1 + 1 + \cdots + 1}_{n\ \text{times}}$
```

$\hat{a}$, $\bar{a}$, $\vec{a}$, $\dot{a}$, $\ddot{a}$, $\tilde{a}$, $\acute{a}$

$\widehat{ABC}$, $\overline{AB}$, $\overrightarrow{AB}$

$\overbrace{a + b + c}^{\text{three terms}}$, $\underbrace{1 + 1 + \cdots + 1}_{n\ \text{times}}$

---

## III. Structure and multi-line formulas

#### 13. Matrices and determinants

````markdown
```markdown
\begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix}   round brackets
\begin{bmatrix} a & b \\ c & d \end{bmatrix}   square brackets
\begin{Bmatrix} 1 & 2 \\ 3 & 4 \end{Bmatrix}   curly braces
\begin{vmatrix} a & b \\ c & d \end{vmatrix}   determinant
\begin{Vmatrix} 1 & 2 \\ 3 & 4 \end{Vmatrix}   norm
\begin{matrix} 1 & 2 \\ 3 & 4 \end{matrix}     no delimiters
The \end command simply mirrors the \begin name
````

$$
\begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix} \quad
\begin{bmatrix} a & b \\ c & d \end{bmatrix} \quad
\begin{vmatrix} a & b \\ c & d \end{vmatrix}
$$

Ellipses and a general matrix:

$$
A = \begin{bmatrix} a_{11} & a_{12} & \cdots & a_{1n} \\ a_{21} & a_{22} & \cdots & a_{2n} \\ \vdots & \vdots & \ddots & \vdots \\ a_{m1} & a_{m2} & \cdots & a_{mn} \end{bmatrix}
$$

When you need custom column formatting (alignment, extra rules) use `array`: `{c}` centred, `{l}` left, `{r}` right, `{|c|}` with a vertical rule:

$$
\left\{ \begin{array}{c|c} x & y \\ \hline 1 & 2 \end{array} \right\}
$$

> [!caution]
>
> In a **document preview**, a bare `|` inside a matrix cell is read by Markdown as a table separator and slices your formula in half. Use the command names `\vert`, `\lvert`, `\rvert`, `\mid` instead of the `|` character.

#### 14. Piecewise functions with `cases`

```markdown
$$
f(x) = \begin{cases} x^2 & x \geq 0 \\ -x & x < 0 \end{cases}
$$
```

$$
f(x) = \begin{cases} x^2 & x \geq 0 \\ -x & x < 0 \end{cases}
$$

#### 15. Multi-line alignment

`aligned` is the everyday choice (it works inline and inside `$$`); `&` marks the alignment point and `\\` breaks the line:

$$
\begin{aligned}
(x+y)^2 &= (x+y)(x+y) \\
&= x^2 + xy + yx + y^2 \\
&= x^2 + 2xy + y^2
\end{aligned}
$$

`gathered` centres every line on its own and needs no `&`:

$$
\begin{gathered}
a + b = c \\
2x - 1 = 0 \\
y = f(x)
\end{gathered}
$$

For two alignment columns use `alignedat`, or just two `aligned` groups; wrap a block in `\boxed` to frame it:

$$
\boxed{\begin{aligned}
\nabla \cdot \vec E &= \frac{\rho}{\varepsilon_0} \\
\nabla \times \vec B &= \mu_0 \vec J + \mu_0 \varepsilon_0 \frac{\partial \vec E}{\partial t}
\end{aligned}}
$$

#### 16. Numbering formulas

MathJax does not number formulas automatically. Use `\tag` to add a number yourself:

$$
E = mc^2 \tag{1}
$$

$$
\frac{\partial u}{\partial t} + \nabla \cdot (u \vec v) = 0 \tag{2.1}
$$

> [!warning]
>
> The LaTeX habit of `\label` + `\ref` cross-references is **unreliable** in Archive Markdown Editor (each formula is typeset as an independent unit). To refer to a formula, just write the number out in words, e.g. "from (1) we get".

#### 17. Boxes, strikes and circles

```markdown
$\boxed{E=mc^2}$, $\boxed{2\sqrt{3} < 4}$

Strikethrough: $\cancel{a} + b$, $\bcancel{x}$, $\xcancel{y}$, $\cancelto{0}{\frac{1}{n}}$

Framed with padding: $\bbox[5px,border:2px solid red]{x^2 + y^2}$

Circled: $\enclose{circle}{x} + y$, boxed: $\boxed{x}$
```

$\boxed{E=mc^2}$, struck out: $\cancel{a} + b$, $\xcancel{y}$, $\cancelto{0}{\frac{1}{n}}$

$\bbox[5px,border:2px solid red]{x^2 + y^2}$, circled: $\enclose{circle}{x} + y$

#### 18. Colour

```markdown
$\color{red}{\frac{1}{2}}$, $\color{#16a34a}{\sqrt{2}}$, $\textcolor{blue}{\pi}$

Background: $\bbox[yellow]{x^2}$, with padding $\bbox[yellow,5px]{x^2}$, plus a border $\bbox[yellow,5px,border:2px solid red]{x^2}$
```

$\color{red}{\frac{1}{2}}$, $\color{#16a34a}{\sqrt{2}}$, $\textcolor{blue}{\pi}$

$\bbox[yellow]{x^2}$, with padding $\bbox[yellow,5px]{x^2}$, plus a border $\bbox[yellow,5px,border:2px solid red]{x^2}$

> [!note]
>
> Colour names such as `red`, `blue`, `green`, `yellow`, `orange`, `purple`, `gray`, `cyan`, `magenta`, `brown` are supported, as are `#rrggbb` hex codes.

> [!caution]
>
> **Never nest `$` inside `$`.** Idiomatic LaTeX would write `\colorbox{yellow}{$x^2$}` for a highlighted formula, but before the text ever reaches MathJax, delimiter matching simply stops at the next `$`, so the nesting gets chopped into two broken fragments. In a Markdown preview use the `\bbox[...]` form above; reserve `\colorbox` for wrapping **plain text**.

---

## IV. What the bundled packages give you

A batch of packages is preloaded, so the commands below **work out of the box** — no declarations needed.

#### 19. Chemical equations with `\ce` (mhchem)

```markdown
$$\ce{2H2 + O2 -> 2H2O}$$

$$\ce{CaCO3 <=> CaO + CO2 ^}$$

$$\ce{Fe^{3+} + 3OH- -> Fe(OH)3 v}$$

$$\ce{CH4 + 2O2 ->[\text{burn}] CO2 + 2H2O}$$

Ions and pH: $\ce{H2SO4 <-> H+ + HSO4-}$, $\ce{[Cu(NH3)4]^2+}$
```

$$\ce{2H2 + O2 -> 2H2O}$$

$$\ce{CaCO3 <=> CaO + CO2 ^}$$

$$\ce{Fe^{3+} + 3OH- -> Fe(OH)3 v}$$

$$\ce{CH4 + 2O2 ->[\text{burn}] CO2 + 2H2O}$$

$\ce{H2SO4 <-> H+ + HSO4-}$, $\ce{[Cu(NH3)4]^2+}$

> [!tip]
>
> Inside `\ce`, use `^` and `_` for super/subscripts, write charges directly as `3+`, and use `^` and `v` for gas and precipitate markers. It beats hand-writing `\text{H}_2\text{O}`.

#### 20. Units and degrees

```markdown
Chemical units: $\pu{343 m/s}$, $\pu{6.02e23 mol-1}$, $\pu{12.01 g/mol}$

Angles and temperature: $30\degree$, $98.6\celsius$, `\micro` gives $\micro$, `\ohm` gives $\ohm$
```

$\pu{343 m/s}$, $\pu{6.02e23 mol-1}$, $\pu{12.01 g/mol}$

$30\degree$, $98.6\celsius$, $1\,\micro m$, $5\,\ohm$

#### 21. Physics shorthand (physics)

```markdown
Derivatives: $\dv{y}{x}$, second order $\dv[2]{y}{x}$, partial $\pdv{u}{x}$, mixed $\pdv[2]{z}{x}{y}$

Definite integral: $\intd{x}{0}{1}$; expectation and norms: $\expval{A}$, $\abs{x}$, $\norm{\vec v}$, $\comm{A}{B}$
```

$\dv{y}{x}$, $\dv[2]{y}{x}$, $\pdv{u}{x}$, $\pdv[2]{z}{x}{y}$

$\abs{x}$, $\norm{\vec v}$, $\expval{A}$, $\comm{A}{B}$

> [!note]
>
> The `\qty` and `\SI` style commands in `physics` depend on `siunitx`, which is not loaded here. For units use `\pu` from section 20 above.

#### 22. Dirac notation (braket)

$\braket{\phi | \psi}$, $\braket{\psi}$, $\ket{\psi}$, $\bra{\phi}$, $\Ket{\psi}$, $\Bra{\phi}$

The commands are `\braket{\phi \vert \psi}`, `\ket{\psi}`, `\bra{\phi}`, `\Ket{\psi}`, `\Bra{\phi}` (the capitalised `\Ket`/`\Bra` stretch the bar higher).

> [!caution]
>
> The examples above use `\vert` rather than `|` to stay clear of Markdown table syntax — a bare `|` inside a table cell slices the formula in half. In ordinary prose `\braket{\phi | \psi}` renders fine.

#### 23. Commutative diagrams (amscd)

$$
\begin{CD}
A @>f>> B @>g>> C \\
@VhVV @VkVV @VmVV \\
D @>u>> E @>v>> F
\end{CD}
$$

Arrow directions: `@>>>` right, `@<<<` left, `@VVV` down, `@AAA` up; put a label above an arrow with `@>label>>` and below with `@>>label>`; `@@` is a spacer used to line things up.

#### 24. Full list of preloaded packages

`base`, `ams`, `action`, `amscd`, `bbox`, `boldsymbol`, `braket`, `bussproofs`, `cancel`, `cases`, `centernot`, `color`, `colortbl`, `empheq`, `enclose`, `extpfeil`, `gensymb`, `html`, `mathtools`, `mhchem`, `physics`, `tagformat`, `upgreek`, `verb`.

Handy ones from `mathtools`: `\coloneqq` ($A \coloneqq B$), `\mathllap`, `\smash`; `empheq` provides the `\boxed`-with-`align` idiom. `\newcommand` can define a scratch macro **inside a single formula**, but it **does not survive across formulas** — for a "global macro" you still have to copy and paste for now.

---

## V. Common errors and how to debug them

#### 25. Error lookup table

| Symptom | Cause | Fix |
|:---|:---|:---|
| Red `Missing {` under the formula | `\left` without a matching `\right` | Add the pair, or use `\left. ... \right)` |
| `\begin{xxx} ended by \end{yyy}` | The environment names differ | Make both ends identical |
| A formula suddenly has an extra blank row, backslashes come in pairs | You kept the old "double the backslashes in a `.md` file" habit; the pre-pass adds the layer for you, so you typed it twice | Go back to single backslashes inside formulas: `\\` for a line break, `\{` for a left brace |
| A command prints entirely as red raw characters | Typo, or the command belongs to a package that is not enabled (there is no capital upright Greek `\upGamma`, for instance) | Check the package list in section 24; for capital Greek letters just write `\Gamma` |
| Italics or `<em>` appear inside the formula | The two `*` in `$a*b*c$` were read as emphasis | Use `\times`, `\cdot` or `\ast` |
| Formula truncated inside a table cell | Bare `\|` clashes with table syntax | Use `\vert`, `\lvert` or `\mid` |
| Inline formula spanning lines does not work | Inline `$...$` must close on one line | Split into two formulas, or switch to `$$...$$` |
| Only half of a display formula renders | A blank line inside the `$$` block split it into two paragraphs | Remove that blank line |
| Two stray `$` paired up into a formula | Two unrecognised `$` in one paragraph | Put a literal dollar sign in inline code: `` `$5` `` |
| A command silently does nothing or prints literally | Its package is not loaded | Use an equivalent base-TeX spelling |

#### 26. Debugging advice

> [!tip]
>
> 1. **Cut the formula down to a minimum.** When `\frac{1}{2}` alone renders, add your pieces back one at a time; the step that breaks is the culprit.
> 2. **Lean on "Tools > LaTeX Editor".** It hands the source straight to MathJax without Markdown in between, which lets you separate "the LaTeX itself is wrong" from "Markdown ate something".
> 3. **Read the error text.** MathJax messages are very specific (`Missing } inserted`, `Undefined control sequence: \xxx`). `Undefined control sequence` basically means "package not loaded" or "typo".
> 4. **Swap pipes for command names, swap asterisks for `\times`, balance your brackets** — that covers nine out of ten cases of "it does not render". The backslash layer is already handled by the pre-pass, and a `.md` file and "Tools > LaTeX Editor" use the same spelling, so there is nothing left to memorise twice.

#### 27. What this app does not support

> [!caution]
>
> These belong to LaTeX document layout, which MathJax does not implement. Writing them has no effect:
>
> - Document structure and styling: `\documentclass`, `\usepackage`, `\begin{document}`, `\section`, `\maketitle`, headers/footers, `\newpage`
> - Floats and figures: `\begin{figure}`, `\includegraphics`, `\begin{tabular}` (`array` inside math is fine), `\multicol`
> - Font installation and `\fontfamily`; for hyperlinks use Markdown's `[](...)` syntax
> - Drawing packages such as TikZ, Pgfplots, Circuitikz. To draw diagrams use "Tools > Mermaid Editor" or a Mermaid code block
> - BibTeX and `\cite`

---

## VI. Further reading

- [Full list of TeX commands supported by MathJax](https://docs.mathjax.org/en/latest/input/tex/macros/index.html) — cross-check availability against the package list in section 24
- [mhchem formula syntax](https://mhchem.github.io/MathJax-mhchem/)
- [Comprehensive LaTeX Symbol List](https://tug.ctan.org/info/symbols/comprehensive/symbols-a4.pdf) — far larger than what this app supports, so treat section 24 as the source of truth
