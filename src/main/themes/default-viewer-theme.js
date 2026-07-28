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
}`;
