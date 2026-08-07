export const defaultViewerTheme = `
#viewer-content {
    max-width: 90%;
    margin: 0 auto;
}

.md-block {
    overflow-x: scroll;
    padding-top: 5px;
    padding-bottom: 5px;
}

.md-block::-webkit-scrollbar {
    display: none;
}

.table-container {
    overflow-x: scroll;
}

#viewer-content > p {
    word-spacing: 0.1rem;
    line-height: 1.9rem;
    margin: 3px;
}

#viewer-content ol li {
    padding-left: 0.5rem;
}

#viewer-content > h5.md-focus:before {
    top: 2px;
}

::-moz-selection {
    background-color: rgba(var(--main-color-R), var(--main-color-G), var(--main-color-B), 0.5);
}

::selection {
    background-color: rgba(var(--main-color-R), var(--main-color-G), var(--main-color-B), 0.5);
}

/* h1-h3 */
#viewer-content > h1,
#viewer-content > h2,
#viewer-content > h3 {
    font-style: normal;
}

#viewer-content > h1,
#viewer-content > h2 {
    /*text-align: center;*/
    text-align: left;
    margin-top: 2rem;
    margin-bottom: 1rem;
}

#viewer-content > h1 {
    font-size: 2.4rem;
    position: relative;
    overflow: hidden;
    transition: transform 0.4s ease;
    transform-origin: left;  /* 加上这条，文字就会从右往左缩小 */
}

#viewer-content > h1:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #e8f4ee, #e8f4ee30);
    transition: transform 0.4s ease;
    transform: scaleX(0);
    transform-origin: left;
    z-index: -1;
}

#viewer-content > h1:hover {
    transform: scale(1.1);
}

#viewer-content > h1:hover {  /* 修改文字放大动效 */
    transform: scale(1.1);
    transform-origin: left;  /* 设置起点 */
}

#viewer-content > h1:hover:before {
    transform: scaleX(1);
}

#viewer-content > h2 {
    font-size: 1.8rem;
    position: relative;
    padding-bottom: 0;
    font-weight: bold;
    margin-bottom: 0;
    transition: transform 0.3s ease;
    transform-origin: left;  /* 设置起点 */
}

#viewer-content > h2:after {
    content: "";
    display: block;
    /*width: 30rem;*/
    width: 100%;
    height: 2.5px;
    margin: 0.5rem auto 0;
    margin-left: 0 !important;
    background: linear-gradient(90deg, var(--main-color), #e8f4ee30);
    border-radius: 10px;
    transform: scaleX(0);
    transition: transform 0.4s ease, background 0.4s ease;
    transform-origin: left;  /* 设置起点 */
}

#viewer-content > h2:hover:after {
    transform: scaleX(1);
    transform-origin: left;  /* 设置起点 */
}

#viewer-content > h2:hover {
    transform: scale(1.1);
    transform-origin: left;  /* 设置起点 */
}

#viewer-content > h3 {
    font-size: 1.6rem;
    transform-origin: left;  /* 设置起点 */
}

#viewer-content > h4 {
    font-size: 1.4rem;
    transform-origin: left;  /* 设置起点 */
}

#viewer-content > h5 {
    font-size: 1.2rem;
    transform-origin: left;  /* 设置起点 */
}

#viewer-content > h6 {
    font-size: 1rem;
    transform-origin: left;  /* 设置起点 */
}

#viewer-content > h3,
#viewer-content > h4,
#viewer-content > h5,
#viewer-content > h6 {
    position: relative;
    margin-top: 1.0rem;
    margin-bottom: 0.5rem;
    transition: transform 0.3s ease;
    transform-origin: left;  /* 设置起点 */
}

#viewer-content > h3:hover,
#viewer-content > h4:hover,
#viewer-content > h5:hover,
#viewer-content > h6:hover {
    transform: scale(1.1);
    transform-origin: left;  /* 设置起点 */
}

/* image */
#viewer-content p img, #viewer-content p video {
    border-radius: 10px;
    max-width: 100%;
    display: block;
    margin: 1em auto;
    transition: transform 0.15s ease, border-radius 0.15s ease;
}

@media(min-width: 1200px) {
    #viewer-content p img, #viewer-content p video {
        border-radius: 10px;
        max-width: 55%;
        display: block;
        margin: 1em auto;
        transition: transform 0.15s ease, border-radius 0.15s ease;
    }
}

#viewer-content p img:hover, #viewer-content p video:hover {
    transform: scale(1.01);
    border-radius: 0;
}

/* paragraph */
#viewer-content > p {
    font-size: 1rem;
    padding: 0 0.3rem;
    transition: all 0.25s ease;
}

#viewer-content > p:not(:has(img)):hover {
    background-color: rgba(var(--main-color-R), var(--main-color-G), var(--main-color-B), 0.1);
}

#viewer-content > p.md-toc-content:hover {
    padding-left: 20px;
}

/* ul ol */
#viewer-content > ul,
#viewer-content > ol {
    padding-left: 1.5rem;
}

#viewer-content > ul:first-child,
#viewer-content > ol:first-child {
    margin-top: 0;
}

#viewer-content > ul:last-child,
#viewer-content > ol:last-child {
    margin-bottom: 0;
}

/* blockquote */
#viewer-content > blockquote {
    padding: 0.5rem 1rem;
    border-left: 8px solid var(--main-color);
    background-color: rgba(var(--main-color-R), var(--main-color-G), var(--main-color-B), 0.1);
    border-radius: 7px;
    transition: box-shadow 0.3s ease, border-radius 0.3s ease, border-left 0.3s ease;
}

#viewer-content > blockquote {
    margin-left: 0 !important;
    margin-right: 0 !important;
}

#viewer-content > blockquote:hover {
    border-left: 9px solid var(--main-color);
    box-shadow: 1px 2px 6px rgba(0, 0, 0, 0.15);
    border-radius: 15px;
}

#viewer-content blockquote table .table-container thead tr th,
#viewer-content blockquote .md-table-fig .md-table thead tr th {
    background-color: var(--main-color);
    color: white;
}

#viewer-content > blockquote .table-container::-webkit-scrollbar {
    display: none;
}

/* 四大特殊blockquote */
.markdown-alert {
  padding: 8px 16px;
  margin-bottom: 16px;
  color: inherit;
  border-left: 0.25em solid;
}
.markdown-alert > :first-child {
  margin-top: 0;
}
.markdown-alert > :last-child {
  margin-bottom: 0;
}
.markdown-alert .markdown-alert-title {
  display: flex;
  font-weight: var(--base-text-weight-medium, 500);
  align-items: center;
  position: relative;
}
.markdown-alert .markdown-alert-title:before {
  content: " ";
  width: 16px;
  height: 16px;
  margin-right: 8px;
  background-position: left;
  background-repeat: no-repeat;
}
@media print {
  .markdown-alert .markdown-alert-title:before {
    display: none;
  }
}
#viewer-content .markdown-alert.markdown-alert-note {
  border-left-color: #2f81f7;
}
#viewer-content .markdown-alert.markdown-alert-note .markdown-alert-title {
  color: #2f81f7;
}
#viewer-content .markdown-alert.markdown-alert-note .markdown-alert-title::before {
  background-image: url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%232f81f7' d='M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z'/%3E%3C/svg%3E");
}
#viewer-content .markdown-alert.markdown-alert-important {
  border-left-color: #a371f7;
}
#viewer-content .markdown-alert.markdown-alert-important .markdown-alert-title {
  color: #a371f7;
}
#viewer-content .markdown-alert.markdown-alert-important .markdown-alert-title::before {
  background-image: url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%23a371f7' d='M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H8.06l-2.573 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z'/%3E%3C/svg%3E");
}
#viewer-content .markdown-alert.markdown-alert-tip {
  border-left-color: #3fb950;
}
#viewer-content .markdown-alert.markdown-alert-tip .markdown-alert-title {
  color: #3fb950;
}
#viewer-content .markdown-alert.markdown-alert-tip .markdown-alert-title::before {
  background-image: url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%233fb950' d='M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 0 1-1.484.211c-.04-.282-.163-.547-.37-.847a8.456 8.456 0 0 0-.542-.68c-.084-.1-.173-.205-.268-.32C3.201 7.75 2.5 6.766 2.5 5.25 2.5 2.31 4.863 0 8 0s5.5 2.31 5.5 5.25c0 1.516-.701 2.5-1.328 3.259-.095.115-.184.22-.268.319-.207.245-.383.453-.541.681-.208.3-.33.565-.37.847a.751.751 0 0 1-1.485-.212c.084-.593.337-1.078.621-1.489.203-.292.45-.584.673-.848.075-.088.147-.173.213-.253.561-.679.985-1.32.985-2.304 0-2.06-1.637-3.75-4-3.75ZM5.75 12h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5ZM6 15.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z'/%3E%3C/svg%3E");
}
#viewer-content .markdown-alert.markdown-alert-warning {
  border-left-color: #d29922;
}
#viewer-content .markdown-alert.markdown-alert-warning .markdown-alert-title {
  color: #d29922;
}
#viewer-content .markdown-alert.markdown-alert-warning .markdown-alert-title::before {
  background-image: url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%23d29922' d='M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z'/%3E%3C/svg%3E");
}
#viewer-content .markdown-alert.markdown-alert-caution {
  border-left-color: #f85149;
}
#viewer-content .markdown-alert.markdown-alert-caution .markdown-alert-title {
  color: #f85149;
}
#viewer-content .markdown-alert.markdown-alert-caution .markdown-alert-title::before {
  background-image: url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%23f85149' d='M4.47.22A.749.749 0 0 1 5 0h6c.199 0 .389.079.53.22l4.25 4.25c.141.14.22.331.22.53v6a.749.749 0 0 1-.22.53l-4.25 4.25A.749.749 0 0 1 11 16H5a.749.749 0 0 1-.53-.22L.22 11.53A.749.749 0 0 1 0 11V5c0-.199.079-.389.22-.53Zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5ZM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z'/%3E%3C/svg%3E");
}

#viewer-content > .markdown-alert-note {
    background-color: var(--markdown-alert-note-bg-color);
}

#viewer-content > .markdown-alert-tip {
    background-color: var(--markdown-alert-tip-bg-color);
}

#viewer-content > .markdown-alert-important {
    background-color: var(--markdown-alert-important-bg-color);
}

#viewer-content > .markdown-alert-warning {
    background-color: var(--markdown-alert-warning-bg-color);
}

#viewer-content > .markdown-alert-caution {
    background-color: var(--markdown-alert-caution-bg-color);
}

#viewer-content .markdown-alert-note .table-container table thead tr th {
    background-color: var(--markdown-alert-note-color);
    color: white;
}

#viewer-content .markdown-alert-tip .table-container table thead tr th {
    background-color: var(--markdown-alert-tip-color);
    color: white;
}

#viewer-content .markdown-alert-important .table-container table thead tr th {
    background-color: var(--markdown-alert-important-color);
    color: white;
}

#viewer-content .markdown-alert-warning .table-container table thead tr th {
    background-color: var(--markdown-alert-warning-color);
    color: white;
}

#viewer-content .markdown-alert-caution .table-container table thead tr th {
    background-color: var(--markdown-alert-caution-color);
    color: white;
}

#viewer-content .markdown-alert-note .table-container::-webkit-scrollbar,
#viewer-content .markdown-alert-tip .table-container::-webkit-scrollbar,
#viewer-content .markdown-alert-important .table-container::-webkit-scrollbar,
#viewer-content .markdown-alert-warning .table-container::-webkit-scrollbar,
#viewer-content .markdown-alert-caution .table-container ::-webkit-scrollbar {
    display: none;
}

/* horizontal line */
#viewer-content > hr {
    position: relative;
    margin-top: 2rem;
    margin-bottom: 2rem;
    border: none;
    border-top: 0.8px solid transparent;
    background-image: linear-gradient(90deg, var(--main-color));
    height: 1.5px;
    overflow: visible;
    color: #abb2bf;
    opacity: 0.8;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
    animation: dashAnimation 0.5s ease-in-out;

    transition: transform 0.3s ease, background-position 0.3s ease, height 0.3s ease;
    background-size: 200% 100%;
    background-position: 0 0;
    background-color: var(--main-color);
}

#viewer-content > hr:hover {
    background-position: 100%, 0;
    transform: scale(1.02);
    height: 2.5px;
}

@keyframes dashAnimation {
    0% {
        width: 0;
        opacity: 0;
    }

    100% {
        width: 100%;
        opacity: 1;
    }
}

/* table */
#viewer-content > .table-container table,
#viewer-content > table,
#viewer-content .md-table-fig .md-table {
    border: 1px solid #e0e0e0;
    border-collapse: separate;
    overflow: hidden;
    width: 100%;
    padding-top: 0;
    padding-bottom: 0;
}

#viewer-content > .table-container::-webkit-scrollbar,
#viewer-content > table::-webkit-scrollbar,
#viewer-content > div table::-webkit-scrollbar {
    display: none; /* 或者高度设为0 */
}

#viewer-content .table-container table thead tr th,
#viewer-content .table-container table tbody tr td,
#viewer-content .md-table-fig .md-table thead tr th,
#viewer-content .md-table-fig .md-table tbody tr td,
#viewer-content table th,
#viewer-content table td,
#viewer-content div table th,
#viewer-content div table td {
    padding: 10px 16px;
    border: 0.5px solid #e0e0e0;
    transition: all 0.3s ease;
}

#viewer-content .table-container table thead tr th,
#viewer-content .md-table-fig .md-table thead tr th,
#viewer-content table thead tr th,
#viewer-content div table thead tr th {
    border-bottom: 1px solid #e0e0e0;
    border-top: 0;
}

#viewer-content .table-container table tbody tr td:hover,
#viewer-content .md-table-fig .md-table tbody tr td:hover,
#viewer-content table tbody tr td:hover,
#viewer-content table tr td:hover,
#viewer-content div table tbody tr td:hover,
#viewer-content div table tr td:hover {
    background: rgba(var(--main-color-R), var(--main-color-G), var(--main-color-B), 0.1);
    transition: all 0.3s ease;
}

#viewer-content .table-container table thead,
#viewer-content .md-table-fig .md-table thead,
#viewer-content table thead,
#viewer-content div table thead,
#viewer-content table tr th,
#viewer-content div table tr th {
    background-color: rgba(var(--main-color-R), var(--main-color-G), var(--main-color-B), 0.1);
    color: hsl(from var(--main-color) h s calc(l - 20));
}

/* strong */
#viewer-content strong {
    font-weight: bold;
    color: var(--main-color);
    font-size: 1.05rem;
    transition: font-size 0.3s ease, padding 0.3s ease;
    display: inline-block;
    margin: 0 2px;
}

#viewer-content strong:hover {
    font-size: 1.1rem;
    padding: 3px;
}

/* emphasis */
#viewer-content em {
    background-color: inherit;
    color: black;
    transition: all 0.3s ease;
    padding-left: 1px;
    padding-right: 1px;
}

#viewer-content em:hover {
    color: var(--main-color);
    font-weight: 600;
    padding-left: 3px;
    padding-right: 3px;
}

/* underline */
#viewer-content u {
    background-color: inherit;
    color: inherit;
    text-decoration: none;
    border-bottom: 2px solid var(--main-color);
    padding-bottom: 2.5px;
    transition: all 0.3s ease;
}

#viewer-content u:hover {
    border: 2px solid var(--main-color);
    margin: 4px;
    border-radius: 7px;
    border-bottom: 2px solid var(--main-color);
    padding: 4px 4px 3px;
}

/* strike */
#viewer-content p s {
    color: rgba(50, 100, 50, 0.5);
    text-decoration: line-through;
    text-decoration-color: rgba(76, 175, 80, 0.7);
    text-decoration-thickness: 1.5px;
    font-style: italic;
    opacity: 0.8;
    transition: color 0.3s ease, opacity 0.3s ease;
}

#viewer-content p s:hover {
    color: rgba(50, 100, 50, 1);
    opacity: 1;
    text-decoration-color: var(rgba(76, 175, 80, 1));
}

/* highlight */
#viewer-content mark {
    font-weight: 500;
    background-color: var(--main-color);
    color: white;
    margin: 0 2px;
    padding: 3px 3px 2.5px;
    border-radius: 0;
    transition: all 0.3s ease
}

#viewer-content mark:hover {
    border-radius: 7px;
    padding: 3px 3px 4px;
}

/* hyperlink */
#viewer-content a {
    background-color: inherit;
    color: var(--main-color);
    text-decoration: none;
    transition: color 0.3s ease;
}

#viewer-content a:hover {
    text-decoration: underline;
    color: hsl(from var(--main-color) h s calc(l - 20));
}

#viewer-content a img {
    border: none;
}

/* 行内代码样式（适用于 <code> 标签，且不影响 <pre><code> 代码块） */
code {
    /* 字体：优先使用等宽字体 */
    font-family: 'SF Mono', 'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Roboto Mono', monospace;

    /* 背景与文字颜色（亮色主题） */
    background-color: #f6f8fa;
    color: #e83e8c;

    /* 内边距与圆角 */
    padding: 0.2em 0.4em;
    border-radius: 6px;

    /* 字号略小于正文 */
    font-size: 0.875em;

    /* 长代码自动换行，避免溢出 */
    white-space: normal;
    word-break: break-word;

    /* 可选：平滑过渡效果（不影响功能） */
    transition: background-color 0.1s ease;
}

/* 鼠标悬停时稍微加深背景，提升交互感（可选） */
code:hover {
    background-color: #e9ecef;
}

/* 重置代码块（<pre><code>）内的样式，确保代码块保持原始格式 */
pre code {
    background-color: transparent;
    padding: 0;
    border-radius: 0;
    font-size: inherit;
    color: inherit;
    white-space: pre; /* 保留代码缩进与换行 */
    word-break: normal; /* 避免代码块内单词折断 */
}
`;
