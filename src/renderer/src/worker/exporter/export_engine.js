import MarkdownIt from "markdown-it";
// 引入mdIt插件
import markdownItRegex from "markdown-it-regex";
import MarkdownItInjectLineNumbers from 'markdown-it-inject-linenumbers';
import markdownItTextualUml from 'markdown-it-textual-uml';
import MarkdownItClass from '@toycode/markdown-it-class';
import markdownItTaskLists from 'markdown-it-task-lists';
import {full as emoji} from 'markdown-it-emoji';
import MarkdownItMark from 'markdown-it-mark';
import {alert} from "@mdit/plugin-alert";

import {rules} from "./export_render_rules";

export default () => {
    // 初始化Markdown-it
    const mdIt = new MarkdownIt({
        html: true,
        langPrefix: 'language-',
    });
    rules(mdIt);  // 自定义渲染规则
    mdIt.use(markdownItRegex, {
        name: "escape_dollar",
        regex: /(\\\$)/,
        replace: (match) => {
            return '<span>$</span>';
        },
    });
    mdIt.use(markdownItRegex, {
        name: "round_dollars",
        regex: /(\$[^\$]+\$)/,
        replace: (match) => {
            return `<span class="math">${match}</span>`;
        },
    });
    mdIt.use(MarkdownItInjectLineNumbers);
    mdIt.use(markdownItTextualUml);
    mdIt.use(MarkdownItClass, {
        h1: 'md-block',
        p: 'md-block',
        table: 'md-block md-table',
    });
    mdIt.use(markdownItTaskLists);
    mdIt.use(emoji);
    mdIt.use(MarkdownItMark);
    mdIt.use(alert);
    return mdIt;
};
