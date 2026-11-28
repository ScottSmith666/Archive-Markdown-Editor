/**
 * ----工具页编辑器核心----
 * 为“LaTeX编辑器”与“Mermaid编辑器”提供：
 *   1. LaTeX / Mermaid 两种语言的 Monaco 注册（Monarch 词法 + 括号/缩进配置）
 *   2. 两种语言的智能提示（CompletionItemProvider）
 *   3. 编辑器实例的单例挂载与释放（切换标签页不丢内容、不泄漏实例）
 *
 * 关于单例挂载：App.vue里的<router-view>没有keep-alive，切换标签页会把工具页组件卸载再重挂，
 * 但monaco的layout()测量的是create()时传入的那个容器元素，因此这里为每种语言准备一个常驻的
 * host元素（由本模块持有），每次把它搬进当前组件的容器里，容器换成新的也不影响实例的尺寸计算。
 *
 * 说明：libs/third_party/monaco-editor 内置语言表中没有 latex 与 mermaid，
 * 因此这里必须自行 register 语言与词法器。
 */

// init monaco editor i18n
import '../../../../../libs/third_party/monaco-editor/esm/vs/nls/lang/switch-lang.js';

// init monaco editor
import * as monaco from '../../../../../libs/third_party/monaco-editor/esm/vs/editor/editor.api.js';
import '../../../../../libs/third_party/monaco-editor/esm/vs/editor/contrib/contextmenu/browser/contextmenu.js';
import '../../../../../libs/third_party/monaco-editor/esm/vs/editor/contrib/clipboard/browser/clipboard.js';
import '../../../../../libs/third_party/monaco-editor/esm/vs/editor/contrib/inlineCompletions/browser/inlineCompletions.contribution.js';
import '../../../../../libs/third_party/monaco-editor/esm/vs/editor/contrib/find/browser/findController.js';

// import monaco editor themes
import Themes from '../../../../../libs/third_party/monaco-editor-themes';

import { useSettingsManStore } from "../../store/settings-man";

// 每种语言对应一个常驻编辑器实例（标签页切换时组件会重挂，实例复用才能保留撤销栈与滚动位置）
const editorRegistry = new Map();
// 语言与主题的注册只做一次
const registeredLanguages = new Set();
let themesRegistered = false;

/**
 * HTML转义，预览区注入源码前必须调用，防止源码里的标签被当作HTML执行
 */
export const escapeHtml = (text) => {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
};

const registerThemesOnce = () => {
    if (themesRegistered) {
        return;
    }
    themesRegistered = true;
    const editorApi = monaco.editor;
    Themes.register("github-light", Themes.themes.light.github, editorApi);
    Themes.register("atom-light", Themes.themes.light.atom, editorApi);
    Themes.register("material-light", Themes.themes.light.material, editorApi);

    Themes.register("darcula", Themes.themes.dark.darcula, editorApi);
    Themes.register("material-dark", Themes.themes.dark.material, editorApi);
    Themes.register("atom-dark", Themes.themes.dark.atom, editorApi);
    Themes.register("github-dark", Themes.themes.dark.github, editorApi);
    Themes.register("one-dark-pro", Themes.themes.dark["one-dark-pro"], editorApi);
    Themes.register("monokai-pro", Themes.themes.dark["monokai-pro"], editorApi);
};

// ---------------------------------------------------------------- LaTeX 语言

// 希腊字母与常用符号：[命令名, 用于detail展示的符号]
const LATEX_SYMBOLS = [
    ['alpha', 'α'], ['beta', 'β'], ['gamma', 'γ'], ['delta', 'δ'], ['epsilon', 'ε'],
    ['varepsilon', 'ε'], ['zeta', 'ζ'], ['eta', 'η'], ['theta', 'θ'], ['vartheta', 'ϑ'],
    ['iota', 'ι'], ['kappa', 'κ'], ['lambda', 'λ'], ['mu', 'μ'], ['nu', 'ν'],
    ['xi', 'ξ'], ['pi', 'π'], ['varpi', 'ϖ'], ['rho', 'ρ'], ['varrho', 'ϱ'],
    ['sigma', 'σ'], ['varsigma', 'ς'], ['tau', 'τ'], ['upsilon', 'υ'], ['phi', 'φ'],
    ['varphi', 'φ'], ['chi', 'χ'], ['psi', 'ψ'], ['omega', 'ω'],
    ['Gamma', 'Γ'], ['Delta', 'Δ'], ['Theta', 'Θ'], ['Lambda', 'Λ'], ['Xi', 'Ξ'],
    ['Pi', 'Π'], ['Sigma', 'Σ'], ['Upsilon', 'Υ'], ['Phi', 'Φ'], ['Psi', 'Ψ'], ['Omega', 'Ω'],
    ['ell', 'ℓ'], ['hbar', 'ℏ'], ['aleph', 'ℵ'], ['beth', 'ℶ'], ['gimel', 'ℷ'], ['daleth', 'ℸ'],
    ['Re', 'ℜ'], ['Im', 'ℑ'], ['wp', '℘'],
    ['infty', '∞'], ['partial', '∂'], ['nabla', '∇'], ['forall', '∀'], ['exists', '∃'],
    ['nexists', '∄'], ['neg', '¬'], ['lnot', '¬'], ['emptyset', '∅'], ['varnothing', '∅'],
    ['top', '⊤'], ['bot', '⊥'], ['angle', '∠'], ['measuredangle', '∡'], ['triangle', '△'],
    ['square', '□'], ['star', '⋆'], ['diamond', '⋄'], ['bullet', '∙'], ['checkmark', '✓'],
    ['ldots', '…'], ['cdots', '⋯'], ['vdots', '⋮'], ['ddots', '⋱'], ['dots', '…'],
    ['prime', '′'], ['backprime', 'backprime'],
    // 运算符
    ['pm', '±'], ['mp', '∓'], ['times', '×'], ['div', '÷'], ['ast', '∗'], ['circ', '∘'],
    ['cdot', '⋅'], ['star', '⋆'], ['cap', '∩'], ['cup', '∪'], ['uplus', '⊎'],
    ['vee', '∨'], ['wedge', '∧'], ['oplus', '⊕'], ['ominus', '⊖'], ['otimes', '⊗'],
    ['odot', '⊙'], ['oslash', '⊘'], ['amalg', '⨿'], ['dagger', '†'], ['ddagger', '‡'],
    ['degree', '°'], ['S', '§'], ['pounds', '£'], ['cents', '¢'],
    // 关系符
    ['leq', '≤'], ['le', '≤'], ['geq', '≥'], ['ge', '≥'], ['neq', '≠'], ['ne', '≠'],
    ['equiv', '≡'], ['approx', '≈'], ['cong', '≅'], ['sim', '∼'], ['simeq', '≃'],
    ['propto', '∝'], ['ll', '≪'], ['gg', '≫'], ['prec', '≺'], ['succ', '≻'],
    ['preceq', '⪯'], ['succeq', '⪰'], ['subset', '⊂'], ['subseteq', '⊆'],
    ['supset', '⊃'], ['supseteq', '⊇'], ['nsubseteq', '⊈'], ['in', '∈'], ['notin', '∉'],
    ['ni', '∋'], ['mid', '∣'], ['nmid', '∤'], ['parallel', '∥'], ['perp', '⊥'],
    ['vdash', '⊢'], ['dashv', '⊣'], ['models', '⊨'], ['therefore', '∴'], ['because', '∵'],
    // 箭头
    ['rightarrow', '→'], ['to', '→'], ['leftarrow', '←'], ['gets', '←'],
    ['leftrightarrow', '↔'], ['Rightarrow', '⇒'], ['Leftarrow', '⇐'],
    ['Leftrightarrow', '⇔'], ['longrightarrow', '⟶'], ['longleftarrow', '⟵'],
    ['Longrightarrow', '⟹'], ['Longleftarrow', '⟸'], ['implies', '⟹'], ['iff', '⟺'],
    ['uparrow', '↑'], ['downarrow', '↓'], ['Uparrow', '⇑'], ['Downarrow', '⇓'],
    ['nearrow', '↗'], ['searrow', '↘'], ['swarrow', '↙'], ['nwarrow', '↖'],
    ['mapsto', '↦'], ['longmapsto', '⟼'], ['hookrightarrow', '↪'], ['hookleftarrow', '↩'],
    ['rightsquigarrow', '⇝'], ['circlearrowright', '↻'], ['circlearrowleft', '↺'],
    // 定界符
    ['langle', '⟨'], ['rangle', '⟩'], ['lfloor', '⌊'], ['rfloor', '⌋'],
    ['lceil', '⌈'], ['rceil', '⌉'], ['lvert', '∣'], ['rvert', '∣'],
    ['lVert', '∥'], ['rVert', '∥'], ['vert', '∣'], ['Vert', '∥'],
    // 大型运算符
    ['sum', '∑'], ['prod', '∏'], ['coprod', '∐'], ['int', '∫'], ['iint', '∬'],
    ['iiint', '∭'], ['oint', '∮'], ['bigcup', '⋃'], ['bigcap', '⋂'],
    ['bigoplus', '⨁'], ['bigotimes', '⨂'], ['bigodot', '⨀'], ['bigsqcup', '⨆'],
    // 重音与装饰
    ['hat', '＾'], ['bar', '‾'], ['vec', '→'], ['tilde', '～'], ['dot', '˙'], ['ddot', '¨'],
    ['dddot', '…'], ['widehat', '＾'], ['widetilde', '～'], ['overline', '‾'],
    ['underline', '＿'], ['overrightarrow', '→'], ['overleftarrow', '←'],
    ['overbrace', '⏞'], ['underbrace', '⏟'], ['overgroup', '⏠'], ['undergroup', '⏡'],
    ['overbracket', '⎴'], ['underbracket', '⎵'], ['utilde', '～'], ['textcircled', '⃝'],
    // 间距
    [',', 'thin'], [';', 'thick'], [':', 'med'], ['!', 'neg'],
    ['thinspace', 'thin'], ['negthinspace', 'neg'], ['enspace', 'en'], ['quad', 'quad'],
    ['qquad', 'qquad'], ['hspace', 'hspace'], ['vspace', 'vspace'], ['strut', 'strut'],
    ['mathstrut', 'strut']
];

// 结构类命令：[命令名, detail]
const LATEX_COMMANDS = [
    ['frac', 'a/b'], ['dfrac', 'a/b'], ['tfrac', 'a/b'], ['cfrac', 'a/b'],
    ['binom', '(a b)'], ['dbinom', '(a b)'], ['tbinom', '(a b)'], ['sqrt', '√'],
    ['root', 'root'], ['text', 'text'], ['textrm', 'roman'], ['textbf', 'bold'],
    ['textit', 'italic'], ['emph', 'emph'], ['mathrm', 'roman'], ['mathbf', 'bold'],
    ['mathit', 'italic'], ['mathsf', 'sans'], ['mathtt', 'mono'], ['mathbb', 'double-struck'],
    ['mathcal', 'script'], ['mathfrak', 'fraktur'], ['mathscr', 'script'],
    ['boldsymbol', 'bold'], ['pmb', 'poor-man bold'], ['operatorname', 'name'],
    ['left', 'left'], ['right', 'right'], ['bigl', 'big'], ['bigr', 'big'],
    ['bigm', 'big'], ['Bigl', 'Big'], ['Bigr', 'Big'], ['Bigm', 'Big'],
    ['biggl', 'bigg'], ['biggr', 'bigg'], ['biggm', 'bigg'], ['Biggl', 'Bigg'],
    ['Biggr', 'Bigg'], ['Biggm', 'Bigg'], ['big', 'big'], ['Big', 'Big'],
    ['bigg', 'bigg'], ['Bigg', 'Bigg'], ['stackrel', 'stack'], ['overset', 'over'],
    ['underset', 'under'], ['overbrace', 'brace'], ['underbrace', 'brace'],
    ['substack', 'substack'], ['raisebox', 'raise'], ['boxed', 'boxed'],
    ['nonumber', 'no number'], ['tag', 'tag'], ['tag*', 'tag*'], ['notag', 'no tag'],
    ['label', 'label'], ['ref', 'ref'], ['eqref', 'eqref'], ['cref', 'cref'],
    ['autoref', 'autoref'], ['cite', 'cite'], ['newline', 'newline'], ['cr', 'cr'],
    ['noindent', 'no indent'], ['indent', 'indent'], ['centering', 'center'],
    ['raggedright', 'flush left'], ['raggedleft', 'flush right'],
    ['mathstrut', 'strut'], ['middle', 'middle'], ['displaystyle', 'display'],
    ['textstyle', 'text'], ['scriptstyle', 'script'], ['scriptscriptstyle', 'sscript'],
    ['limits', 'limits'], ['nolimits', 'nolimits'], ['sideset', 'sideset'],
    ['smash', 'smash'], ['phantom', 'phantom'], ['hphantom', 'hphantom'],
    ['vphantom', 'vphantom'], ['llap', 'llap'], ['rlap', 'rlap'], ['clap', 'clap'],
    ['usepackage', 'package'], ['documentclass', 'class'], ['newcommand', 'new command'],
    ['renewcommand', 'renew command'], ['providecommand', 'provide command'],
    ['newenvironment', 'new environment'], ['newtheorem', 'new theorem'],
    ['begin', 'begin environment'], ['end', 'end environment'],
    ['item', 'item'], ['itemize', 'itemize'], ['enumerate', 'enumerate'],
    ['section', 'section'], ['subsection', 'subsection'], ['subsubsection', 'subsubsection'],
    ['paragraph', 'paragraph'], ['title', 'title'], ['author', 'author'],
    ['date', 'date'], ['maketitle', 'maketitle'], ['footnote', 'footnote'],
    ['caption', 'caption'], ['includegraphics', 'image'], ['label', 'label']
];

// 宏包扩展命令：[命令名, detail, 提供该宏的MathJax宏包]
// 这些宏包已在 src/renderer/index.html 的 MathJax 配置里启用，补全出的命令都能直接渲染
const LATEX_PACKAGE_COMMANDS = [
    // physics
    ['quantity', 'braced quantity', 'physics'], ['qty', 'braced quantity', 'physics'], ['pqty', 'parenthesised quantity', 'physics'], ['bqty', 'bracketed quantity', 'physics'],
    ['vqty', 'vertical bar quantity', 'physics'], ['Bqty', 'Big bracketed quantity', 'physics'], ['absolutevalue', 'absolute value', 'physics'], ['abs', 'absolute value', 'physics'],
    ['norm', 'norm', 'physics'], ['order', 'order of', 'physics'], ['evaluated', 'evaluation bar', 'physics'], ['eval', 'evaluation bar', 'physics'],
    ['commutator', 'commutator', 'physics'], ['comm', 'commutator', 'physics'], ['anticommutator', 'anticommutator', 'physics'], ['acomm', 'anticommutator', 'physics'],
    ['poissonbracket', 'Poisson bracket', 'physics'], ['pb', 'Poisson bracket', 'physics'], ['vectorbold', 'bold vector', 'physics'], ['vb', 'bold vector', 'physics'],
    ['vectorarrow', 'vector with arrow', 'physics'], ['va', 'vector with arrow', 'physics'], ['vectorunit', 'unit vector', 'physics'], ['vu', 'unit vector', 'physics'],
    ['vnabla', 'bold nabla', 'physics'], ['gradient', 'gradient', 'physics'], ['tr', 'trace', 'physics'], ['trace', 'trace', 'physics'],
    ['Tr', 'trace', 'physics'], ['Trace', 'trace', 'physics'], ['rank', 'rank', 'physics'], ['erf', 'error function', 'physics'],
    ['Res', 'residue', 'physics'], ['Residue', 'residue', 'physics'], ['asin', 'inverse sine', 'physics'], ['acos', 'inverse cosine', 'physics'],
    ['atan', 'inverse tangent', 'physics'], ['asec', 'inverse secant', 'physics'], ['acsc', 'inverse cosecant', 'physics'], ['acot', 'inverse cotangent', 'physics'],
    ['derivative', 'derivative', 'physics'], ['dv', 'derivative', 'physics'], ['partialderivative', 'partial derivative', 'physics'], ['pderivative', 'partial derivative', 'physics'],
    ['pdv', 'partial derivative', 'physics'], ['functionalderivative', 'functional derivative', 'physics'], ['fderivative', 'functional derivative', 'physics'], ['fdv', 'functional derivative', 'physics'],
    ['variation', 'variation', 'physics'], ['var', 'variation', 'physics'], ['diffd', 'differential d', 'physics'], ['differential', 'differential', 'physics'],
    ['dd', 'differential', 'physics'], ['flatfrac', 'flat fraction', 'physics'], ['bra', 'bra', 'physics'], ['ket', 'ket', 'physics'],
    ['innerproduct', 'inner product', 'physics'], ['ip', 'inner product', 'physics'], ['braket', 'inner product', 'physics'], ['outerproduct', 'outer product', 'physics'],
    ['dyad', 'outer product', 'physics'], ['ketbra', 'outer product', 'physics'], ['op', 'operator', 'physics'], ['expectationvalue', 'expectation value', 'physics'],
    ['expval', 'expectation value', 'physics'], ['ev', 'expectation value', 'physics'], ['matrixelement', 'matrix element', 'physics'], ['matrixel', 'matrix element', 'physics'],
    ['mel', 'matrix element', 'physics'], ['matrixquantity', 'matrix quantity', 'physics'], ['mqty', 'matrix quantity', 'physics'], ['pmqty', 'parenthesised matrix', 'physics'],
    ['Pmqty', 'Big parenthesised matrix', 'physics'], ['bmqty', 'bracketed matrix', 'physics'], ['vmqty', 'barred matrix', 'physics'], ['smallmatrixquantity', 'small matrix quantity', 'physics'],
    ['smqty', 'small matrix quantity', 'physics'], ['spmqty', 'small parenthesised matrix', 'physics'], ['sPmqty', 'small Big parenthesised matrix', 'physics'], ['sbmqty', 'small bracketed matrix', 'physics'],
    ['svmqty', 'small barred matrix', 'physics'], ['matrixdeterminant', 'determinant', 'physics'], ['mdet', 'determinant', 'physics'], ['smdet', 'small determinant', 'physics'],
    ['identitymatrix', 'identity matrix', 'physics'], ['imat', 'identity matrix', 'physics'], ['xmatrix', 'X matrix', 'physics'], ['xmat', 'X matrix', 'physics'],
    ['zeromatrix', 'zero matrix', 'physics'], ['zmat', 'zero matrix', 'physics'], ['paulimatrix', 'Pauli matrix', 'physics'], ['pmat', 'Pauli matrix', 'physics'],
    ['diagonalmatrix', 'diagonal matrix', 'physics'], ['dmat', 'diagonal matrix', 'physics'], ['antidiagonalmatrix', 'antidiagonal matrix', 'physics'], ['admat', 'antidiagonal matrix', 'physics'],
    ['qqtext', 'quick quad text', 'physics'], ['qq', 'quick quad', 'physics'], ['qcomma', 'quad comma', 'physics'], ['qc', 'quad comma', 'physics'],
    ['qcc', 'quad c.c.', 'physics'], ['qif', 'quad if', 'physics'], ['qthen', 'quad then', 'physics'], ['qelse', 'quad else', 'physics'],
    ['qotherwise', 'quad otherwise', 'physics'], ['qunless', 'quad unless', 'physics'], ['qgiven', 'quad given', 'physics'], ['qusing', 'quad using', 'physics'],
    ['qassume', 'quad assume', 'physics'], ['qsince', 'quad since', 'physics'], ['qlet', 'quad let', 'physics'], ['qfor', 'quad for', 'physics'],
    ['qall', 'quad for all', 'physics'], ['qeven', 'quad even', 'physics'], ['qodd', 'quad odd', 'physics'], ['qinteger', 'quad integer', 'physics'],
    ['qand', 'quad and', 'physics'], ['qor', 'quad or', 'physics'], ['qas', 'quad as', 'physics'], ['qin', 'quad in', 'physics'],
    // gensymb
    ['celsius', '°C', 'gensymb'], ['micro', 'µ', 'gensymb'], ['ohm', 'Ω', 'gensymb'], ['perthousand', '‰', 'gensymb'],
    // mathtools
    ['coloneqq', ':=', 'mathtools'], ['Coloneqq', '::=', 'mathtools'], ['coloneq', ':=', 'mathtools'], ['Coloneq', '::=', 'mathtools'],
    ['eqqcolon', '=:', 'mathtools'], ['Eqqcolon', '::=', 'mathtools'], ['eqcolon', '=:', 'mathtools'], ['Eqcolon', '::=', 'mathtools'],
    ['colonapprox', ':≈', 'mathtools'], ['Colonapprox', '::≈', 'mathtools'], ['colonsim', ':∼', 'mathtools'], ['Colonsim', '::∼', 'mathtools'],
    ['dblcolon', '::', 'mathtools'], ['approxcolon', '≈:', 'mathtools'], ['Approxcolon', '≈::', 'mathtools'], ['simcolon', '∼:', 'mathtools'],
    ['Simcolon', '∼::', 'mathtools'], ['colondash', ':-', 'mathtools'], ['Colondash', '::-', 'mathtools'], ['dashcolon', '-:', 'mathtools'],
    ['Dashcolon', '-::', 'mathtools'], ['vcentercolon', 'centred colon', 'mathtools'], ['ordinarycolon', 'ordinary colon', 'mathtools'], ['mathllap', 'left overlap (math)', 'mathtools'],
    ['mathrlap', 'right overlap (math)', 'mathtools'], ['mathclap', 'centre overlap (math)', 'mathtools'], ['textllap', 'left overlap (text)', 'mathtools'], ['textrlap', 'right overlap (text)', 'mathtools'],
    ['textclap', 'centre overlap (text)', 'mathtools'], ['cramped', 'cramped style', 'mathtools'], ['crampedllap', 'cramped left overlap', 'mathtools'], ['crampedrlap', 'cramped right overlap', 'mathtools'],
    ['crampedclap', 'cramped centre overlap', 'mathtools'], ['crampedsubstack', 'cramped substack', 'mathtools'], ['xleftrightarrow', 'extensible ↔', 'mathtools'], ['xLeftarrow', 'extensible ⇐', 'mathtools'],
    ['xRightarrow', 'extensible ⇒', 'mathtools'], ['xLeftrightarrow', 'extensible ⇔', 'mathtools'], ['xhookleftarrow', 'extensible ↩', 'mathtools'], ['xhookrightarrow', 'extensible ↪', 'mathtools'],
    ['xmapsto', 'extensible ↦', 'mathtools'], ['xrightharpoondown', 'extensible ⇁', 'mathtools'], ['xleftharpoondown', 'extensible ⇽', 'mathtools'], ['xrightleftharpoons', 'extensible ⇌', 'mathtools'],
    ['xrightharpoonup', 'extensible ⇀', 'mathtools'], ['xleftharpoonup', 'extensible ↼', 'mathtools'], ['xleftrightharpoons', 'extensible ⇋', 'mathtools'], ['xlongrightarrow', 'extensible ⟶', 'mathtools'],
    ['xlongleftarrow', 'extensible ⟵', 'mathtools'], ['xLongrightarrow', 'extensible ⟹', 'mathtools'], ['xLongleftarrow', 'extensible ⟸', 'mathtools'], ['shoveleft', 'flush left (multline)', 'mathtools'],
    ['shoveright', 'flush right (multline)', 'mathtools'], ['MoveEqLeft', 'shift first line left', 'mathtools'], ['Aboxed', 'box across alignment', 'mathtools'], ['ArrowBetweenLines', 'arrow between rows', 'mathtools'],
    ['vdotswithin', 'vdots aligned within', 'mathtools'], ['shortvdotswithin', 'short vdots within', 'mathtools'], ['refeq', 'reference equation', 'mathtools'], ['mathmbox', 'unbreakable box', 'mathtools'],
    ['mathmakebox', 'fixed width box', 'mathtools'], ['xmathstrut', 'strut of width n', 'mathtools'], ['prescript', 'left super/subscript', 'mathtools'], ['adjustlimits', 'adjust limit pair', 'mathtools'],
    ['nuparrow', 'up arrow of height n', 'mathtools'], ['ndownarrow', 'down arrow of depth n', 'mathtools'], ['bigtimes', 'large times', 'mathtools'], ['splitfrac', 'two-line fraction', 'mathtools'],
    ['splitdfrac', 'two-line display fraction', 'mathtools']
];

// 数学函数名（不需要反斜杠也能被MathJax识别，这里仍给出\command形式）
const LATEX_FUNCTIONS = [
    'sin', 'cos', 'tan', 'cot', 'sec', 'csc', 'arcsin', 'arccos', 'arctan',
    'sinh', 'cosh', 'tanh', 'coth', 'log', 'ln', 'lg', 'exp', 'lim', 'limsup',
    'liminf', 'max', 'min', 'sup', 'inf', 'deg', 'gcd', 'det', 'dim', 'ker',
    'hom', 'arg', 'Pr', 'mod', 'bmod', 'pmod'
];

// 环境名（\begin{...} / \end{...}）
const LATEX_ENVIRONMENTS = [
    'document', 'equation', 'equation*', 'align', 'align*', 'gather', 'gather*',
    'flalign', 'flalign*', 'multline', 'multline*', 'alignat', 'alignat*',
    'math', 'displaymath', 'array', 'matrix', 'pmatrix', 'bmatrix', 'Bmatrix',
    'vmatrix', 'Vmatrix', 'smallmatrix', 'cases', 'subcases', 'aligned',
    'gathered', 'split', 'rcases', 'darray', 'subarray', 'tabular', 'tabularx',
    'longtable', 'figure', 'table', 'center', 'flushleft', 'flushright',
    'quote', 'quotation', 'verbatim', 'lstlisting', 'minted', 'theorem',
    'lemma', 'corollary', 'proposition', 'definition', 'example', 'proof',
    'remark', 'abstract', 'minipage', 'columns', 'frame', 'block', 'itemize',
    'enumerate', 'description', 'list', 'tikzpicture', 'scope', 'pspicture',
    // mathtools 宏包补充的对偶环境
    'dcases', 'dcases*', 'rcases*', 'drcases', 'drcases*', 'cases*',
    'lgathered', 'rgathered', 'multlined', 'pmatrix*', 'bmatrix*', 'Bmatrix*',
    'vmatrix*', 'Vmatrix*', 'smallmatrix*'
];

const latexLanguageConfiguration = () => ({
    comments: { lineComment: '%' },
    brackets: [
        ['{', '}'], ['[', ']'], ['(', ')']
    ],
    autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '$', close: '$', not: ['comment'] },
        { open: '\\left(', close: '\\right)' },
        { open: '\\left[', close: '\\right]' }
    ],
    surroundingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '$', close: '$' },
        { open: '\\left(', close: '\\right)' }
    ],
    wordPattern: /\\[a-zA-Z@]+\*?|[a-zA-Z@]+\*?|\d*\.?\d+/g,
    indentationRules: {
        increaseIndentPattern: /^\s*\\begin\{[^{}]*\}[^%]*$/,
        decreaseIndentPattern: /^\s*\\end\{[^{}]*\}/
    },
    onEnterRules: [
        {
            beforeText: /^\s*\\begin\{[^{}]*\}\s*$/,
            afterText: /^\s*\\end\{[^{}]*\}\s*$/,
            action: { indentAction: monaco.languages.IndentAction.IndentOutdent }
        },
        {
            beforeText: /^\s*\\begin\{[^{}]*\}\s*$/,
            action: { indentAction: monaco.languages.IndentAction.Indent }
        }
    ]
});

const latexMonarch = () => {
    // 数学模式内外共用的基础规则（数学定界符在各自state里单独处理）
    const baseRules = [
        [/\\[%_#$&{}~^\\]/, 'string.escape'],
        [/%(?![a-zA-Z]).*$/, 'comment'],
        [/\\(?:begin|end)\{[^{}]*\}/, 'keyword.environment'],
        [/\\[a-zA-Z@]+\*?/, 'keyword.command'],
        [/\\/, 'keyword.command'],
        [/[{}]/, 'delimiter.bracket'],
        [/[[\]()]/, 'delimiter.parenthesis'],
        [/&/, 'delimiter'],
        [/\\\\/, 'keyword.command'],
        [/\d*\.?\d+/, 'number'],
        [/[a-zA-Z@]+/, 'identifier'],
        [/[^\s\\${}[\]()&%a-zA-Z0-9]+/, 'delimiter'],
        [/\s+/, 'white']
    ];
    return {
        tokenizer: {
            root: [
                [/\$\$/, { token: 'metatag', next: '@mathDisplay' }],
                [/\\\[/, { token: 'metatag', next: '@mathDisplay' }],
                [/\$/, { token: 'metatag', next: '@mathInline' }],
                [/\\\(/, { token: 'metatag', next: '@mathInline' }],
                ...baseRules
            ],
            mathDisplay: [
                [/\\\$/, 'string.escape'],
                [/\$\$/, { token: 'metatag', next: '@pop' }],
                [/\\\]/, { token: 'metatag', next: '@pop' }],
                ...baseRules
            ],
            mathInline: [
                [/\\\$/, 'string.escape'],
                [/\$/, { token: 'metatag', next: '@pop' }],
                [/\\\)/, { token: 'metatag', next: '@pop' }],
                ...baseRules
            ]
        }
    };
};

/**
 * 求当前光标处“待补全文本”的range
 * 对LaTeX来说待补全文本以反斜杠开头，range必须把反斜杠包含进去，
 * 否则键入“\alp”时filterText“\alpha”过滤不出来
 */
const prefixRange = (model, position, prefixRegex) => {
    const line = model.getLineContent(position.lineNumber);
    const before = line.substring(0, position.column - 1);
    const matched = before.match(prefixRegex);
    const length = matched ? matched[0].length : 0;
    return new monaco.Range(
        position.lineNumber, Math.max(1, position.column - length),
        position.lineNumber, position.column
    );
};

/**
 * 扫描全文，返回尚未闭合的环境名列表（由内向外）
 */
const unclosedEnvironments = (model) => {
    const text = model.getValue();
    const stack = [];
    const regex = /\\(begin|end)\{([^{}]*)\}/g;
    let matched = regex.exec(text);
    while (matched) {
        if (matched[1] === 'begin') {
            stack.push(matched[2]);
        } else {
            const index = stack.lastIndexOf(matched[2]);
            if (index >= 0) {
                stack.splice(index, 1);
            }
        }
        matched = regex.exec(text);
    }
    return stack.reverse();
};

const registerLatexLanguage = () => {
    const languageId = 'latex';
    if (registeredLanguages.has(languageId)) {
        return;
    }
    registeredLanguages.add(languageId);

    monaco.languages.register({ id: languageId, extensions: ['.tex', '.sty', '.cls'], aliases: ['LaTeX', 'latex'] });
    monaco.languages.setMonarchTokensProvider(languageId, latexMonarch());
    monaco.languages.setLanguageConfiguration(languageId, latexLanguageConfiguration());

    const kind = monaco.languages.CompletionItemKind;
    const snippetRule = monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;

    const symbolItems = LATEX_SYMBOLS.map((item, index) => ({
        label: `\\${item[0]}`,
        insertText: `\\${item[0]}`,
        detail: item[1],
        kind: kind.Constant,
        filterText: `\\${item[0]}`,
        sortText: `2${String(index).padStart(4, '0')}`
    }));

    const commandItems = LATEX_COMMANDS.map((item, index) => ({
        label: `\\${item[0]}`,
        insertText: `\\${item[0]}`,
        detail: item[1],
        kind: kind.Keyword,
        filterText: `\\${item[0]}`,
        sortText: `1${String(index).padStart(4, '0')}`
    }));

    const functionItems = LATEX_FUNCTIONS.map((name, index) => ({
        label: `\\${name}`,
        insertText: `\\${name}`,
        detail: 'function',
        kind: kind.Function,
        filterText: `\\${name}`,
        sortText: `3${String(index).padStart(4, '0')}`
    }));

    // 宏包扩展命令：排在基础命令/符号/函数之后，detail 里标出来源宏包
    const packageItems = LATEX_PACKAGE_COMMANDS.map((item, index) => ({
        label: `\\${item[0]}`,
        insertText: `\\${item[0]}`,
        detail: `${item[1]} (${item[2]})`,
        documentation: `\\${item[0]} is provided by the MathJax "${item[2]}" package.`,
        kind: kind.Reference,
        filterText: `\\${item[0]}`,
        sortText: `4${String(index).padStart(4, '0')}`
    }));

    // \xxx 与 Ctrl+Space 全量提示共用同一份合并列表
    const allCommandItems = [].concat(commandItems, symbolItems, functionItems, packageItems);

    // “\begin”（还没有左花括号）时给出整段环境脚手架
    const beginScaffoldItems = LATEX_ENVIRONMENTS.map((env, index) => ({
        label: `\\begin{${env}}`,
        insertText: `\\begin{${'${1:' + env + '}'}\n\t$0\n\\end{$1}`,
        detail: 'environment',
        kind: kind.Snippet,
        filterText: '\\begin',
        insertTextRules: snippetRule,
        sortText: `0${String(index).padStart(4, '0')}`
    }));

    // “\begin{ali|”时补环境名
    const beginNameItems = LATEX_ENVIRONMENTS.map((env, index) => ({
        label: `${env}}`,
        insertText: `${env}}`,
        detail: 'environment',
        kind: kind.Snippet,
        filterText: env,
        sortText: `0${String(index).padStart(4, '0')}`
    }));

    monaco.languages.registerCompletionItemProvider(languageId, {
        triggerCharacters: ['\\', '{', '_', '^', '$', '%'],
        provideCompletionItems: (model, position, context) => {
            const line = model.getLineContent(position.lineNumber);
            const before = line.substring(0, position.column - 1);

            // 1. \end{...  →  优先提示文档中尚未闭合的环境
            const endMatch = before.match(/\\end\{([^\{}]*)$/);
            if (endMatch) {
                const typed = endMatch[1];
                const range = new monaco.Range(
                    position.lineNumber, position.column - typed.length,
                    position.lineNumber, position.column
                );
                const unclosed = unclosedEnvironments(model);
                const seen = new Set();
                const names = [];
                unclosed.forEach((env) => {
                    if (!seen.has(env)) { seen.add(env); names.push(env); }
                });
                LATEX_ENVIRONMENTS.forEach((env) => {
                    if (!seen.has(env)) { seen.add(env); names.push(env); }
                });
                return {
                    range: range,
                    suggestions: names.map((env, index) => ({
                        label: `${env}}`,
                        insertText: `${env}}`,
                        detail: unclosed.includes(env) ? 'matching \\begin' : 'environment',
                        kind: kind.Snippet,
                        filterText: env,
                        sortText: String(index).padStart(4, '0')
                    }))
                };
            }

            // 2. \begin{...  →  补环境名
            const beginNameMatch = before.match(/\\begin\{([^\{\}]*)$/);
            if (beginNameMatch) {
                const typed = beginNameMatch[1];
                const range = new monaco.Range(
                    position.lineNumber, position.column - typed.length,
                    position.lineNumber, position.column
                );
                return { range: range, suggestions: beginNameItems };
            }

            // 3. \begin  →  补整段脚手架
            if (/\\begin$/.test(before)) {
                const range = prefixRange(model, position, /\\begin$/);
                return { range: range, suggestions: beginScaffoldItems };
            }

            // 4. \xxx  →  补命令、符号与宏包命令
            const commandMatch = before.match(/\\[a-zA-Z@]*\*?$/);
            if (commandMatch) {
                return {
                    range: prefixRange(model, position, /\\[a-zA-Z@]*\*?$/),
                    suggestions: allCommandItems
                };
            }

            // 5. 光标前不是反斜杠时，只在行首、空白或定界符后给出全量提示（Ctrl+Space可用）
            const previousChar = before.slice(-1);
            if (before.length === 0 || /[\s{([_$&]/.test(previousChar) || (context && context.triggerCharacter)) {
                return {
                    range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
                    suggestions: allCommandItems
                };
            }

            return { suggestions: [] };
        }
    });
};

// ------------------------------------------------------------- Mermaid 语言

const MERMAID_DIAGRAMS = [
    'flowchart', 'graph', 'sequenceDiagram', 'classDiagram', 'stateDiagram',
    'stateDiagram-v2', 'erDiagram', 'journey', 'gantt', 'pie', 'quadrantChart',
    'requirementDiagram', 'gitGraph', 'mindmap', 'timeline', 'sankey-beta',
    'xychart-beta', 'block-beta', 'packet', 'radar-beta', 'architecture-beta',
    'ishikawa-beta', 'kanban', 'treemap'
];

// 按“图类型”给出的上下文关键字
const MERMAID_CONTEXT_KEYWORDS = {
    flowchart: ['subgraph', 'end', 'direction', 'TB', 'TD', 'BT', 'RL', 'LR', 'classDef',
        'class', 'style', 'linkStyle', 'click', 'callback', 'href', 'call',
        'default', 'fill', 'stroke', 'stroke-width', 'color', 'text'],
    graph: ['subgraph', 'end', 'direction', 'TB', 'TD', 'BT', 'RL', 'LR', 'classDef',
        'class', 'style', 'linkStyle', 'click', 'default', 'fill', 'stroke', 'color'],
    sequenceDiagram: ['participant', 'actor', 'as', 'create', 'destroy', 'activate',
        'deactivate', 'note', 'over', 'left of', 'right of', 'alt', 'else', 'opt',
        'loop', 'over', 'par', 'and', 'end', 'critical', 'option', 'break',
        'rect', 'autonumber', 'box', 'link', 'links', 'properties', 'details',
        'accTitle', 'accDescr', 'title'],
    classDiagram: ['class', 'namespace', '<<interface>>', '<<abstract>>', '<<enumeration>>',
        'note', 'for', 'link', 'click', 'cssClass', 'cssClasses', 'callback',
        'title', 'direction', 'LB', 'RL'],
    'stateDiagram-v2': ['state', 'hide', 'empty', 'state', 'description', 'direction',
        'choice', 'fork', 'join', 'note', 'right of', 'left of', 'as', 'title',
        'partition', 'skinparam'],
    stateDiagram: ['state', 'hide', 'empty', 'note', 'right of', 'left of', 'as',
        'title', 'partition', 'skinparam'],
    erDiagram: ['relationship', 'entity', 'ALIAS', 'ONLY', 'ZERO_OR_ONE', 'ZERO_OR_MORE',
        'ONE_OR_MORE', 'PK', 'FK', 'UK', 'not null', 'comment', 'title'],
    journey: ['title', 'section', 'task'],
    gantt: ['title', 'dateFormat', 'axisFormat', 'todayMarker', 'tickInterval',
        'section', 'after', 'includes', 'excludes', 'done', 'active', 'crit', 'milestone'],
    pie: ['title', 'showData'],
    quadrantChart: ['quadrant-1', 'quadrant-2', 'quadrant-3', 'quadrant-4', 'x-axis',
        'y-axis', 'point', 'title'],
    requirementDiagram: ['requirement', 'functionalRequirement', 'performanceRequirement',
        'interfaceRequirement', 'physicalRequirement', 'designConstraint',
        'derive', 'satisfy', 'verify', 'trace', 'contains', 'copies'],
    gitGraph: ['commit', 'branch', 'checkout', 'merge', 'reset', 'cherry-pick',
        'importGraph', 'render', 'type', 'tag', 'id'],
    mindmap: ['root'],
    timeline: ['title', 'section'],
    'sankey-beta': ['title'],
    'xychart-beta': ['title', 'x-axis', 'y-axis', 'line', 'bar'],
    'block-beta': ['columns', 'block', 'space', 'columns'],
    packet: ['title', 'start', 'block'],
    'radar-beta': ['title', 'axis', 'curve', 'graticule', 'showLegend', 'max', 'min'],
    'architecture-beta': ['group', 'service', 'junction', 'title'],
    'ishikawa-beta': ['problem', 'category', 'cause', 'title'],
    kanban: ['todo', 'doing', 'done', 'fake'],
    treemap: ['title']
};

// 通用（所有图都可能用到的）关键字
const MERMAID_COMMON_KEYWORDS = [
    'subgraph', 'end', 'direction', 'title', 'classDef', 'class', 'style', 'linkStyle',
    'click', 'note', 'link', 'links', 'accTitle', 'accDescr', 'default', 'fill',
    'stroke', 'color', 'stroke-width', 'opacity', 'font-weight'
];

// 箭头（flowchart系）
const MERMAID_ARROWS = [
    '-->', '---', '-.->', '-.-', '==>', '===', '--x', '--o', '-.-x', '-.-o',
    '<-->', '<--', '<<<->>>', '<==>', '--o', 'o--'
];

const mermaidAllKeywords = () => {
    const set = new Set();
    Object.keys(MERMAID_CONTEXT_KEYWORDS).forEach((key) => {
        MERMAID_CONTEXT_KEYWORDS[key].forEach((word) => {
            word.split(' ').forEach((part) => set.add(part));
        });
    });
    MERMAID_COMMON_KEYWORDS.forEach((word) => set.add(word));
    return Array.from(set);
};

const mermaidLanguageConfiguration = () => ({
    comments: { lineComment: '%%' },
    brackets: [['{', '}'], ['[', ']'], ['(', ')']],
    autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' }
    ],
    surroundingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' }
    ],
    wordPattern: /[a-zA-Z_][\w-]*|"[^"]*"/g,
    indentationRules: {
        increaseIndentPattern: /^\s*(?:subgraph|alt|opt|loop|par|and|critical|box|rect|state|partition|section|block|columns|category)\b(?!.*\bend\b).*$/,
        decreaseIndentPattern: /^\s*end\b/
    }
});

const mermaidMonarch = () => ({
    keywords: mermaidAllKeywords(),
    diagrams: MERMAID_DIAGRAMS,
    tokenizer: {
        root: [
            [/%%\{[^}\n]*\}%%/, 'metatag'],
            [/%%.*$/, 'comment'],
            [/"(?:[^"\\\n]|\\.)*"/, 'string'],
            [/'(?:[^'\\\n]|\\.)*'/, 'string'],
            [/(?:-.+?>+)|(?:=+>)|(?:-+x)|(?:-+o)|(?:<=+>)|(?:=+<)|(?:-+<)|(?:\|+\|)/, 'operator'],
            [/->|=>|>>|<<|--|-->|\.\.>/, 'operator'],
            [/[;,#]/, 'delimiter'],
            [/[|]/, 'delimiter.pipe'],
            [/[{}]/, 'delimiter.bracket'],
            [/[[\]()]/, 'delimiter.parenthesis'],
            [/\d+(\.\d+)?/, 'number'],
            [/[a-zA-Z_][\w-]*/, {
                cases: {
                    '@diagrams': 'keyword.type',
                    '@keywords': 'keyword',
                    '@default': 'identifier'
                }
            }],
            [/[^\s]+/, 'identifier'],
            [/\s+/, 'white']
        ]
    }
});

const detectMermaidDiagramType = (model) => {
    const lineCount = Math.min(model.getLineCount(), 40);
    for (let i = 1; i <= lineCount; i++) {
        const text = model.getLineContent(i).trim();
        if (text === '' || text.startsWith('%%')) {
            continue;
        }
        return text.split(/[\s(;[]/)[0];
    }
    return '';
};

const firstContentLineNumber = (model) => {
    const lineCount = model.getLineCount();
    for (let i = 1; i <= lineCount; i++) {
        const text = model.getLineContent(i).trim();
        if (text !== '' && !text.startsWith('%%')) {
            return i;
        }
    }
    return lineCount + 1;
};

const registerMermaidLanguage = () => {
    const languageId = 'mermaid';
    if (registeredLanguages.has(languageId)) {
        return;
    }
    registeredLanguages.add(languageId);

    monaco.languages.register({ id: languageId, extensions: ['.mmd', '.mermaid'], aliases: ['Mermaid', 'mermaid'] });
    monaco.languages.setMonarchTokensProvider(languageId, mermaidMonarch());
    monaco.languages.setLanguageConfiguration(languageId, mermaidLanguageConfiguration());

    const kind = monaco.languages.CompletionItemKind;
    const allKeywords = mermaidAllKeywords();
    const keywordItems = allKeywords.map((word, index) => ({
        label: word,
        insertText: word,
        kind: kind.Keyword,
        filterText: word,
        sortText: `1${String(index).padStart(4, '0')}`
    }));
    const diagramItems = MERMAID_DIAGRAMS.map((name, index) => ({
        label: name,
        insertText: name,
        kind: kind.Struct,
        filterText: name,
        sortText: `0${String(index).padStart(4, '0')}`
    }));
    const arrowItems = MERMAID_ARROWS.map((arrow, index) => ({
        label: arrow,
        insertText: arrow,
        kind: kind.Operator,
        filterText: arrow,
        sortText: `2${String(index).padStart(4, '0')}`
    }));

    monaco.languages.registerCompletionItemProvider(languageId, {
        triggerCharacters: [' ', ':', '>', '-', '.', '{', '(', '"'],
        provideCompletionItems: (model, position, context) => {
            const range = prefixRange(model, position, /[a-zA-Z_][\w-]*$/);
            const typed = model.getValueInRange(range);
            const diagramType = detectMermaidDiagramType(model);

            // 上下文关键字（按当前图类型）
            let contextItems = [];
            const baseType = diagramType.replace(/-v\d+$/, '');
            const contextKeywords = [].concat(
                MERMAID_CONTEXT_KEYWORDS[diagramType] || [],
                MERMAID_CONTEXT_KEYWORDS[baseType] || [],
                MERMAID_COMMON_KEYWORDS
            );
            const seen = new Set();
            contextKeywords.forEach((word, index) => {
                if (seen.has(word)) {
                    return;
                }
                seen.add(word);
                contextItems.push({
                    label: word,
                    insertText: word,
                    detail: diagramType ? diagramType : 'keyword',
                    kind: kind.Keyword,
                    filterText: word,
                    sortText: `0${String(index).padStart(4, '0')}`
                });
            });

            // 箭头只在图类型已经确定、且不是首行时提供
            let arrows = [];
            if (diagramType && position.lineNumber > firstContentLineNumber(model)) {
                arrows = arrowItems;
            }

            // 图类型关键字只在首行（或空文档）提供
            let diagrams = [];
            if (position.lineNumber <= firstContentLineNumber(model)) {
                diagrams = diagramItems;
            }

            const suggestions = [].concat(diagrams, contextItems, arrows, keywordItems);

            if (suggestions.length === 0 && typed === '' && !(context && context.triggerCharacter)) {
                return { suggestions: [] };
            }
            return { range: range, suggestions: suggestions };
        }
    });
};

const registerToolLanguageOnce = (language) => {
    if (language === 'latex') {
        registerLatexLanguage();
    } else if (language === 'mermaid') {
        registerMermaidLanguage();
    }
};

// ------------------------------------------------------- 编辑器实例生命周期

const applyToolEditorOptions = (editor) => {
    const settingsManStore = useSettingsManStore();
    const userSettings = settingsManStore.userSettings;
    editor.updateOptions({
        contextmenu: true,
        automaticLayout: false,
        scrollBeyondLastLine: false,
        autoIndent: "advanced",
        dragAndDrop: false,

        tabSize: Number(userSettings.editor_tab_size),
        fontSize: Number(userSettings.editor_font_size),
        lineNumbers: userSettings.enable_line_num,
        folding: userSettings.enable_code_fold === 1,
        wordWrap: userSettings.enable_auto_wrap_line,
        autoClosingBrackets: userSettings.enable_auto_closure,
        autoClosingDelete: userSettings.enable_auto_closure,
        autoClosingQuotes: userSettings.enable_auto_closure,
        scrollbar: {
            "vertical": userSettings.display_vertical_scrollbar,
            "horizontal": userSettings.display_horizon_scrollbar
        },
        minimap: {
            enabled: userSettings.display_code_scale === 1
        },
        cursorSmoothCaretAnimation: userSettings.display_editor_animation === 1,
        theme: userSettings.ame_editor_theme
    });
};

const bindClipboardCommands = (editor) => {
    // 与Workspace页保持一致，避免菜单加速键吃掉这三个快捷键
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyX, () => {
        editor.trigger('source', 'editor.action.clipboardCutAction');
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC, () => {
        editor.trigger('source', 'editor.action.clipboardCopyAction');
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV, () => {
        editor.trigger('source', 'editor.action.clipboardPasteAction');
    });
};

const destroyEntry = (entry) => {
    try {
        entry.editor.dispose();
    } catch (err) {
        // model可能已经被tab-man释放，这里忽略释放顺序导致的异常
    }
};

/**
 * 挂载（或复用）某工具页的Monaco Editor实例
 *
 * @param {string} language     'latex' | 'mermaid'，同时作为实例的唯一键
 * @param {HTMLElement} container 本次挂载的容器（组件重挂后是一个新的DOM节点）
 * @param {object} model        该标签页常驻的editor model
 * @param {string} pageid       该标签页的pageid
 * @param {Function} isPageAlive (pageid) => boolean，用于判断标签页是否还开着
 * @returns {{editor: object, release: Function}}
 */
export const acquireToolEditor = ({ language, container, model, pageid, isPageAlive }) => {
    registerThemesOnce();
    registerToolLanguageOnce(language);

    let entry = editorRegistry.get(language);

    // 实例对应的标签页可能已经在后台被关掉，此时销毁旧实例重建
    if (entry && isPageAlive && !isPageAlive(entry.pageid)) {
        destroyEntry(entry);
        editorRegistry.delete(language);
        entry = null;
    }

    if (!entry) {
        // host绝对定位铺满挂载容器，避免依赖百分比高度在flex里的解析差异
        const host = document.createElement('div');
        host.className = 'tool-editor-host';
        host.style.position = 'absolute';
        host.style.top = '0';
        host.style.left = '0';
        host.style.right = '0';
        host.style.bottom = '0';
        container.appendChild(host);
        entry = { pageid: pageid, host: host, editor: monaco.editor.create(host, { automaticLayout: false }) };
        editorRegistry.set(language, entry);
        applyToolEditorOptions(entry.editor);
        bindClipboardCommands(entry.editor);
        entry.editor.setModel(model);
    } else {
        if (entry.host.parentElement !== container) {
            container.appendChild(entry.host);
        }
        if (entry.editor.getModel() !== model) {
            entry.editor.setModel(model);
            entry.pageid = pageid;
        }
        applyToolEditorOptions(entry.editor);
        // 重新挂载后尺寸是新容器的，必须显式layout一次
        entry.editor.layout();
    }
    entry.editor.focus();

    // automaticLayout关掉后由组件自己观察当前容器尺寸（实例复用时automaticLayout会盯着已销毁的旧容器）
    const observer = new ResizeObserver(() => {
        try {
            entry.editor.layout();
        } catch (err) {
            // 实例已销毁
        }
    });
    observer.observe(container);

    const release = () => {
        observer.disconnect();
        const alive = !isPageAlive || isPageAlive(entry.pageid);
        if (!alive) {
            destroyEntry(entry);
            if (editorRegistry.get(language) === entry) {
                editorRegistry.delete(language);
            }
        }
    };

    return { editor: entry.editor, release: release };
};

/**
 * 供预览区做防抖
 */
export const createDebouncer = (delay) => {
    let timer = null;
    const run = (callback) => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            timer = null;
            callback();
        }, delay);
    };
    run.cancel = () => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    };
    return run;
};
