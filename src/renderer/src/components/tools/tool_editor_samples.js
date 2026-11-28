/**
 * ----工具页编辑器首次打开时的示例内容----
 * 内容本身是LaTeX/Mermaid源码，与界面语言无关，因此不进i18n
 */

export const latexSample = String.raw`% LaTeX编辑器：左侧输入源码，右侧MathJax实时渲染
% 小提示：键入反斜杠 \ 即可触发命令、希腊字母与环境的智能提示

行内公式：质能方程 $E = mc^{2}$，欧拉恒等式 $e^{i\pi} + 1 = 0$

$$
\frac{\partial u}{\partial t} = \alpha \nabla^{2} u
$$

$$
\begin{aligned}
\hat{f}(\xi) &= \int_{-\infty}^{\infty} f(x)\, e^{-2\pi i x \xi}\, \mathrm{d}x \\
\mathbb{E}[X] &= \int_{-\infty}^{\infty} x\, \mathrm{d}F(x)
\end{aligned}
$$

$$
\sum_{n=1}^{\infty} \frac{1}{n^{2}} = \frac{\pi^{2}}{6}
\qquad
\lim_{x \to 0} \frac{\sin x}{x} = 1
$$
`;

export const mermaidSample = String.raw`flowchart TD
    A[Start] --> B{Is valid?}
    B -->|Yes| C[Parse source]
    B -->|No| D[Show error]
    C --> E((Render chart))
    D --> A
    E --> F[Done]
`;
