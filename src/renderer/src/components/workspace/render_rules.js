import {regExps, returnMediaElement} from "./get_media_skeleton.js";

export const rules = (md, documentPathObject, displayKind) => {
    // 保存默认的代码块渲染规则
    const defaultFence = md.renderer.rules.fence;
    // 重写 fence 规则
    md.renderer.rules.fence = function (tokens, idx, options, env, self) {
        // 先调用默认规则，获取原始的 <pre><code>...</code></pre> HTML 字符串
        const defaultHtml = defaultFence(tokens, idx, options, env, self);

        // 如果找不到原始内容，直接返回
        if (!defaultHtml) return defaultHtml;

        // 核心步骤：在 <pre> 标签内添加 class="line-numbers"
        // 使用正则替换，将 <pre> 替换为 <pre class="line-numbers">
        // 这里使用 /<pre(\s|>)/ 正则，是为了精准匹配 <pre> 标签的开始部分
        return defaultHtml.replace(/<pre(\s|>)/, '<pre class="line-numbers"$1');
    };

    md.core.ruler.push('wrap_table', function (state) {
        for (let i = 0; i < state.tokens.length; i++) {
            if (state.tokens[i].type === 'table_open') {
                // 在 table_open 之前插入一个 div_open 类型的 Token
                const open = new state.Token('html_inline', '', 0);
                open.content = '<div class="table-container">';
                state.tokens.splice(i, 0, open);
                i++; // 跳过刚插入的 token
            }
            if (state.tokens[i].type === 'table_close') {
                // 在 table_close 之后插入一个 div_close
                const close = new state.Token('html_inline', '', 0);
                close.content = '</div>';
                state.tokens.splice(i + 1, 0, close);
                i++;
            }
        }
    });

    // 多媒体标签
    md.renderer.rules.image = function (tokens, idx, options, env, self) {
        const token = tokens[idx];
        const caption = token.content;
        const regs = regExps();
        const srcIndex = token.attrIndex('src');
        const pathForbiddenChar = ["\\"];
        let url = decodeURI(token.attrs[srcIndex][1]);

        // 先判断是不是base64编码的图片
        if (regs.imageBase64.test(url)) {
            return `<img src="${encodeURI(url)}" alt="${caption}">`;
        }
        // 然后判断路径/URl的合法性
        // 这里规定：路径只支持绝对路径，不支持相对路径，且分隔符仅支持正斜杠，不支持反斜杠
        if (url.includes(pathForbiddenChar)) {
            return `<p style="color: red; font-weight: bold;">🚫错误：不支持反斜杠作为路径分割符，请换成正斜杠</p>`;
        }

        // 然后进行正则表达式判断是路径还是URL
        // 这里规定，URL前面一律需要加上http://或者https://协议
        // 以下有这几种文件路径：
        // 1. Win32系路径格式：(大写或小写字母 + 冒号 + 斜杠)开头，例如C:/Users/scottsmith/Desktop/test.jpg
        // 2. Posix系路径格式：斜杠开头，例如/Users/scottsmith/Desktop/test.jpg
        // 3. 路径开头包含“$MDZ_MEDIA”，这是mdz格式导引多媒体路径的标志，例如$MDZ_MEDIA/test.jpg
        // 4. 路径开头包含“$DOCUMENT_MEDIA”，这是document页面格式导引多媒体路径的标志，只能由软件本身进行内部调用，不对外部终端用户开放
        //    例如$DOCUMENT_MEDIA/test.jpg
        // const caption = token.content;这里面的caption是Markdown多媒体语句中方括号内的内容，即“![content](url)”中的“content”部分
        // 在这里定义AME的新语法：
        //     content的格式符合“${video}:caption”，将作为视频处理
        //     content的格式符合“${audio}:caption”，将作为音频处理
        //     content的格式符合“${file}:caption”，将作为其他类型可下载文件处理
        //     content的格式如不符合上述三种情况，将作为图片处理，即Markdown默认语法
        let matchedMediaMark = regs.mediaContentMark.exec(caption);

        // 内部调用document media路径，外部不可调用
        if (documentPathObject.isEnabled) {
            if (regs.path.document.test(url)) {
                if (matchedMediaMark !== null) {
                    let kind = matchedMediaMark[2];
                    let getCaption = matchedMediaMark[4];
                    let mediaFileName = url.split("/").pop();
                    return returnMediaElement(false, kind, documentPathObject.path + '/' + mediaFileName, getCaption);
                } else {
                    let mediaFileName = url.split("/").pop();
                    return returnMediaElement(false, "image", documentPathObject.path + '/' + mediaFileName, caption);
                }
            }
        }

        // 外部调用
        if (regs.url.test(url)) {
            if (matchedMediaMark !== null) {
                let kind = matchedMediaMark[2];
                let getCaption = matchedMediaMark[4];
                return returnMediaElement(true, kind, encodeURI(url), getCaption);
            } else {
                // 普通图片
                return returnMediaElement(true, 'image', encodeURI(url), caption);
            }
        } else {
            // 文件不能包括这些字符，而且如果路径或/和文件名包含空格，则渲染器不会解析多媒体Markdown，直接返回原字符串，因此需要以%20代替空格
            // 由于“?”可能会存在于url，因此在文件路径分支进行判断
            const fileForbiddenChars = [">", "<", ":", "\"", "'", "|", "*", "?"];
            const fileForbiddenCharsWin32 = [">", "<", "\"", "'", "|", "*", "?"];
            let fileName = url.split("/").pop();

            // 由于Windows有盘符+冒号的结构，因此，符合win32格式的路径 && 整个带文件的路径只有1个冒号 && 文件名没有禁止符号，这三个条件同时符合符合就OK
            for (let i = 0; i < fileForbiddenChars.length; i++) {
                if (regs.path.win32.test(url)) {
                    let colonNum = (url.match(/\:/g) || []).length;
                    if (colonNum !== 1) {
                        return `<p style="color: red; font-weight: bold;">🚫错误：媒体文件名或路径中有非法字符</p>`;
                    } else {
                        if (fileName.includes(fileForbiddenCharsWin32[i]) || url.includes(fileForbiddenCharsWin32[i])) {
                            return `<p style="color: red; font-weight: bold;">🚫错误：媒体文件名或路径中有非法字符</p>`;
                        }
                    }
                }
                if (regs.path.posix.test(url)) {
                    if (fileName.includes(fileForbiddenChars[i]) || url.includes(fileForbiddenChars[i])) {
                        return `<p style="color: red; font-weight: bold;">🚫错误：媒体文件名或路径中有非法字符</p>`;
                    }
                }
            }
            if (regs.path.win32.test(url) || regs.path.posix.test(url)) {
                if (matchedMediaMark !== null) {
                    let kind = matchedMediaMark[2];
                    let getCaption = matchedMediaMark[4];
                    return returnMediaElement(false, kind, url, getCaption);
                } else {
                    return returnMediaElement(false, 'image', url, caption);
                }
            } else if (regs.path.mdz.test(url)) {
                // mdz文件处理逻辑
                return `{"signal": "?MUST_RENDER_MDZ?", "url": "${url}", "caption": "${caption}"}`;  // 返回一个标记，让外面的补充规则渲染mdz media path
            } else {
                return `<p style="color: red; font-weight: bold;">🚫错误：找不到文件，请检查在线URL是否正确或采用本地绝对路径</p>`;
            }
        }
    };

    // 处理链接，点击可通过默认浏览器打开
    md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
        const token = tokens[idx];

        // 获取链接地址 (href)
        const hrefIndex = token.attrIndex('href');
        const href = token.attrs[hrefIndex][1];

        // 如果是外部链接则通过默认浏览器打开
        if (href.startsWith('http')) {
            if (displayKind === 'preview') {
                let func = `window.openURLPreload.openURL('${href}');`;
                token.attrPush(['onclick', func]);
                token.attrPush(['style', 'cursor: pointer;']);
                // 移除自带的href属性
                const idx = token.attrIndex('href');
                if (idx !== -1) token.attrs.splice(idx, 1);
            }
        }
        // 渲染该 Token 并返回 HTML 字符串
        return self.renderToken(tokens, idx, options);
    };
};
