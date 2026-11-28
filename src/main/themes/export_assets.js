import fs from "fs";
import path from "path";

// ===== 导出HTML所用的离线静态资源 =====
// 改动前，导出的html直接引用 cdn.bootcdn.net 上的 mermaid、prism 和 MathJax，
// 产物必须联网才能代码高亮、画流程图、渲染公式。现在改为：把这些js/css连同MathJax的
// tex扩展和字体一并复制进多媒体用的“导出文件名.media_dir”文件夹
// （和图片/音视频同一个目录，导出目录结构保持统一），产物改用相对路径引用，从而完全离线可用。
//
// MathJax比mermaid/prism麻烦的地方有三点：
// 1) 主构建 tex-mml-chtml.js 会按“自己所在目录”解析 loader.load 里的 [tex]/xxx，
//    所以 input/tex/extensions/ 必须保持原来的层级一起搬过去；
// 2) \mathbb 这类动态字符集、\ce 化学式字体在运行时还会再用 <script src> 拉一次组件js；
// 3) 字体的CDN基址被组件内部写死，loader.paths、pathFilters、fontURL、dynamicPrefix
//    这些配置在组件加载时都会被覆盖，配置层改不动，只能在写进页面的入口上改写地址，
//    改写逻辑只有一份文件：src/renderer/libs/MathJax/ame_mathjax_font_hook.js，
//    app内预览（src/renderer/index.html）直接 <script src> 用它，导出页由本文件读出来内联，
//    两边共用同一份实现，不会漂移。

const CDN = "https://cdn.bootcdn.net/ajax/libs/";
// 应用包内拿不到本地MathJax时的回落地址，和改动前模板里写死的那条完全一致
const MATHJAX_CDN = `${CDN}mathjax/4.0.0-alpha.1/es5/tex-mml-chtml-nofont.min.js`;

const PRISM_LANGUAGES = [
    "clike", "c", "cpp", "java", "markup", "css", "javascript", "typescript", "python", "markdown"
];

// 每个资源：dest = 落在 media_dir 里的文件名（全部平铺，资源之间名字互不冲突）
//          source = 该文件在应用包内的相对位置
const ASSET_GROUPS = {
    // 先 mermaid 再 prism，与改动前模板里的 <script> 顺序一致
    mermaid: {
        styles: [],
        scripts: [
            {dest: "mermaid.min.js", source: "node_modules/mermaid/dist/mermaid.min.js"}
        ],
        cdnStyles: [],
        cdnScripts: [`${CDN}mermaid/11.12.0/mermaid.min.js`]
    },
    prism: {
        styles: [
            {
                dest: "prism-toolbar.min.css",
                source: "node_modules/prismjs/plugins/toolbar/prism-toolbar.min.css"
            },
            {
                dest: "prism-line-numbers.min.css",
                source: "node_modules/prismjs/plugins/line-numbers/prism-line-numbers.min.css"
            },
            {dest: "prism.min.css", source: "node_modules/prismjs/themes/prism.min.css"}
        ],
        scripts: [
            {dest: "prism-core.min.js", source: "node_modules/prismjs/components/prism-core.min.js"},
            ...PRISM_LANGUAGES.map(
                (name) => ({
                    dest: `prism-${name}.min.js`,
                    source: `node_modules/prismjs/components/prism-${name}.min.js`
                })
            ),
            {dest: "prism-toolbar.min.js", source: "node_modules/prismjs/plugins/toolbar/prism-toolbar.min.js"},
            {
                dest: "prism-show-language.min.js",
                source: "node_modules/prismjs/plugins/show-language/prism-show-language.min.js"
            },
            {
                dest: "prism-copy-to-clipboard.min.js",
                source: "node_modules/prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js"
            },
            {
                dest: "prism-line-numbers.min.js",
                source: "node_modules/prismjs/plugins/line-numbers/prism-line-numbers.min.js"
            }
        ],
        // 万一应用包里取不到本地文件，整组退回CDN，保证导出功能不因缺文件而失败
        cdnStyles: [
            `${CDN}prism/1.30.0/plugins/toolbar/prism-toolbar.min.css`,
            `${CDN}prism/1.30.0/plugins/line-numbers/prism-line-numbers.min.css`,
            `${CDN}prism/1.30.0/themes/prism.min.css`
        ],
        cdnScripts: [
            `${CDN}prism/1.30.0/prism.min.js`,
            ...PRISM_LANGUAGES.map((name) => `${CDN}prism/1.30.0/components/prism-${name}.min.js`),
            `${CDN}prism/1.30.0/plugins/toolbar/prism-toolbar.min.js`,
            `${CDN}prism/1.30.0/plugins/show-language/prism-show-language.min.js`,
            `${CDN}prism/1.30.0/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js`,
            `${CDN}prism/1.30.0/plugins/line-numbers/prism-line-numbers.min.js`
        ]
    }
};
// MathJax的本地源有两处候选：生产包里只有 out/renderer（npm run build 时由 utils/copy-mathjax
// 从 src/renderer/libs/MathJax 拷过去），开发环境下若还没build过就退回 src/renderer
const mathjaxSources = (relative) => [
    `out/renderer/libs/MathJax/${relative}`,
    `src/renderer/libs/MathJax/${relative}`
];

// MathJax落在 media_dir/MathJax/ 下，主构建和字体组件js单独列（这两个位置固定，名字不能改）
const MATHJAX_FILES = [
    {dest: "MathJax/tex-mml-chtml.js", sources: mathjaxSources("tex-mml-chtml.js")},
    {
        dest: "MathJax/fonts/mathjax-mhchem-font-extension/chtml.js",
        sources: mathjaxSources("fonts/mathjax-mhchem-font-extension/chtml.js")
    }
];

// 这些目录里的文件名由MathJax自己决定，必须整目录、保持层级地复制
const MATHJAX_DIRS = [
    "input/tex/extensions",                       // loader.load 里的 [tex]/xxx
    "fonts/mathjax-newcm-font/chtml/dynamic",     // \mathbb、\mathfrak 等动态字符集
    "fonts/mathjax-newcm-font/chtml/woff2",       // 上面这些字符集的字形
    "fonts/mathjax-mhchem-font-extension/chtml/woff2"
].map((relative) => ({destDir: `MathJax/${relative}`, sources: mathjaxSources(relative)}));

// 字体地址改写脚本（与app内预览共用同一份文件）。它只内联进导出页，不复制进 media_dir
const MATHJAX_HOOK_SOURCES = mathjaxSources("ame_mathjax_font_hook.js");

// 依次探测可能的应用包根目录：
// 开发环境和鸿蒙下 __dirname 是 out/main，往上两级就是仓库/应用包根；
// 生产环境 __dirname 已经在 app.asar 内，因此再补上 resourcesPath 下的两种布局
const packageRoots = () => {
    const roots = [path.join(__dirname, "..", "..")];
    if (process.resourcesPath) {
        roots.push(path.join(process.resourcesPath, "app.asar"));
        roots.push(path.join(process.resourcesPath, "app.asar.unpacked"));
    }
    return roots;
};
// 同一个文件/目录在包内可能有多个候选位置，返回第一个真实存在的
const resolveSource = (candidates) => {
    for (const relative of candidates) {
        for (const root of packageRoots()) {
            const candidate = path.join(root, relative);
            if (fs.existsSync(candidate)) {
                return candidate;
            }
        }
    }
    return null;
};

// {dest, source} / {dest, sources} 都接受，dest 可以带子目录；只要有一个文件找不到就返回null
const resolveFiles = (files) => {
    const resolved = [];
    for (const item of files) {
        const candidates = item.sources || [item.source];
        const sourcePath = resolveSource(candidates);
        if (!sourcePath) {
            return null;
        }
        resolved.push({dest: item.dest, sourcePath});
    }
    return resolved;
};

// 整目录展开成 [{dest, sourcePath}]，readdirSync 的 recursive 选项在 asar 内同样可用
const resolveDirs = (dirs) => {
    const resolved = [];
    for (const item of dirs) {
        const sourceDir = resolveSource(item.sources);
        if (!sourceDir) {
            return null;
        }
        for (const name of fs.readdirSync(sourceDir, {recursive: true, encoding: "utf8"})) {
            const relative = name.split(path.sep).join("/");
            const sourcePath = path.join(sourceDir, name);
            if (fs.statSync(sourcePath).isFile()) {
                resolved.push({dest: `${item.destDir}/${relative}`, sourcePath});
            }
        }
    }
    return resolved;
};

const copyInto = async (folder, resolved) => {
    for (const {dest, sourcePath} of resolved) {
        const target = path.join(folder, dest);
        await fs.promises.mkdir(path.dirname(target), {recursive: true});
        // 源文件可能就在asar里面，copyFile跨asar边界不可靠，统一读出来再写
        await fs.promises.writeFile(target, await fs.promises.readFile(sourcePath));
    }
};

// media_dir 里的相对地址：目录名取自用户自己起的导出文件名，可能含空格、#、% 等字符，
// 因此落盘用原名、写进html的URL逐段 encodeURIComponent
const assetUrl = (mediaDirName, relativeDest) => `${encodeURIComponent(mediaDirName)}/${
    relativeDest.split("/").map(encodeURIComponent).join("/")
}`;

// 导出页只内联钩子的可执行部分：文件开头那段说明是写给看源码的人的，
// 全量内联会让每个产物都多出约5KB注释，注释里的举例文字还会干扰排查时的全文检索。
// 剥离条件很窄：文件开头就是块注释，且第一个 IIFE 出现在注释结束之后才剥；
// 不满足就整份原样返回——宁可啰嗦也不能截错代码。
const hookBodyOf = (text) => {
    const trimmed = text.trimStart();
    const bodyStart = trimmed.indexOf("(function");
    const commentEnd = trimmed.indexOf("*/");
    if (!trimmed.startsWith("/*") || commentEnd < 0 || bodyStart < 0 || commentEnd > bodyStart) {
        return text;
    }
    return trimmed.slice(bodyStart);
};

// 把共用的那份字体地址改写脚本内联进导出页：先设基址，再执行脚本本体。
// 读不到脚本文件就返回null，由调用方决定回落，避免出现“字体照样联网”的半离线产物
const loadMathjaxHook = (fontsBaseUrl) => {
    const hookPath = resolveSource(MATHJAX_HOOK_SOURCES);
    if (!hookPath) {
        return null;
    }
    const bootstrap = `window.__AME_MATHJAX_FONTS_BASE__ = ${JSON.stringify(fontsBaseUrl)};`;
    const body = hookBodyOf(fs.readFileSync(hookPath, "utf8"));
    const note = "<!-- MathJax 离线字体地址改写，源文件 libs/MathJax/ame_mathjax_font_hook.js -->";
    return `${note}<script>${bootstrap}\n${body}</script>`;
};

// MathJax离线化：主构建 + tex扩展 + 两套字体，全部落在 media_dir/MathJax/ 下
const prepareMathjax = async (exportHtmlMediaFolderPath, mediaDirName) => {
    const files = resolveFiles(MATHJAX_FILES);
    const dirs = resolveDirs(MATHJAX_DIRS);
    const fontsBaseUrl = `${assetUrl(mediaDirName, "MathJax/fonts")}/`;
    const hookScript = loadMathjaxHook(fontsBaseUrl);
    // 缺改写脚本时本地MathJax的字体照样会去jsdelivr，等于没离线，所以整套一起回落CDN
    if (!files || !dirs || !hookScript) {
        console.warn("[export] 应用包内未找到本地MathJax或字体地址改写脚本，公式退回CDN在线地址");
        return {src: MATHJAX_CDN, fontsBaseUrl: "", hookScript: ""};
    }
    await copyInto(exportHtmlMediaFolderPath, [...files, ...dirs]);
    return {
        src: assetUrl(mediaDirName, "MathJax/tex-mml-chtml.js"),
        fontsBaseUrl,
        hookScript
    };
};

// 把js/css/MathJax复制进多媒体的“导出文件名.media_dir”（目录位置由渲染层决定，与html同级），
// 并返回可以直接写进模板的地址（本地模式是相对路径，某个库在包内取不到时该组退回CDN）
export const prepareExportAssets = async (exportHtmlMediaFolderPath) => {
    const mediaDirName = path.basename(exportHtmlMediaFolderPath);
    const styles = [];
    const scripts = [];
    for (const [kind, group] of Object.entries(ASSET_GROUPS)) {
        const resolved = resolveFiles([...group.styles, ...group.scripts]);
        if (!resolved) {
            console.warn(`[export] 应用包内未找到 ${kind} 的本地资源，${kind} 退回CDN在线地址`);
            styles.push(...group.cdnStyles);
            scripts.push(...group.cdnScripts);
            continue;
        }
        await copyInto(exportHtmlMediaFolderPath, resolved);
        // 顺序要和模板里 <link>/<script> 的原始顺序一致，所以仍按组内各自的列表取
        styles.push(...group.styles.map((item) => assetUrl(mediaDirName, item.dest)));
        scripts.push(...group.scripts.map((item) => assetUrl(mediaDirName, item.dest)));
    }
    const mathjax = await prepareMathjax(exportHtmlMediaFolderPath, mediaDirName);
    return {styles, scripts, mathjax};
};

// MATHJAX_CDN 是应用包内拿不到本地MathJax时的回落地址，由导出模板作为默认值使用。
// 原来内联在这里的那段字体地址改写脚本已经搬去
// src/renderer/libs/MathJax/ame_mathjax_font_hook.js，
// app内预览和导出页共用同一份，见上面的 loadMathjaxHook()。
export {MATHJAX_CDN};
