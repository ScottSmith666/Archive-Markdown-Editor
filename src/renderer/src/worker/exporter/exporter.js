import engine from "./export_engine";
import {regExps, returnMediaElement} from "../../components/workspace/get_media_skeleton.js";

self.addEventListener("message", (e) => {
    if (e.data[0] === 'html') {
        console.log("Worker开始运行");
        // Markdown-It engine
        let mdIt = engine(false, "export");

        // 保留image旧渲染规则
        const defaultMediaRender
            = mdIt.renderer.rules.image || function (tokens, idx, options, env, self) {
            return self.renderToken(tokens, idx, options);
        };

        // 添加mdz media path渲染新规则
        mdIt.renderer.rules.image = function (tokens, idx, options, env, self) {
            const originalImageHTML = defaultMediaRender(tokens, idx, options, env, self);
            const regs = regExps();
            let currentPageInfo = store.state.tab.tabList.get(store.state.tab.currentOpenedPageId);
            if (originalImageHTML.includes("?MUST_RENDER_MDZ?")) {  // 开始渲染mdz
                let res = JSON.parse(originalImageHTML);
                let url = res.url;
                let caption = res.caption;
                let matchedMediaMark = regs.mediaContentMark.exec(caption);
                if (!currentPageInfo.get("isExistFile")) {  // 如果当前打开的是非已有文件的页面，则禁止渲染本规则
                    return `<p style="color: red; font-weight: bold;">🚫错误：当前打开的页面不是mdz格式的文件，请不要使用mdz媒体路径语法</p>`;
                } else {
                    // 当前打开的是已有文件的页面
                    let currentFilePathParam = currentPageInfo.get("path").split('&').pop();  // 当前打开文件的路径参数
                    let currentFilePath = currentFilePathParam.replace("filepath=", "");  // 去掉参数名和等于号，并解码为正常的路径字符串
                    let currentFileName = currentFilePath.split(/\\|\//).pop();
                    let currentFileNameArray = currentFileName.split(".");
                    currentFileNameArray.pop();
                    let currentFileNameRemoveExt = currentFileNameArray.join(".");
                    let ext = currentFilePath.split(".").pop();
                    if (ext !== "mdz") {
                        return `<p style="color: red; font-weight: bold;">🚫错误：当前打开的页面不是mdz格式的文件，请不要使用mdz媒体路径语法</p>`;
                    }
                    // 开始拼接路径
                    let currentFilePathArray = currentFilePath.split(/\\|\//);  // 同时匹配posix和win32路径分隔符
                    currentFilePathArray.pop();
                    let currentFilePathRemoveFileName = currentFilePathArray.join("/");  // 路径去掉文件名
                    let factMediaPath
                        = currentFilePathRemoveFileName
                        + `/._mdz_content.${currentFileNameRemoveExt}/mdz_contents/media_src/${url.replace("$MDZ_MEDIA/", "")}`;
                    if (matchedMediaMark !== null) {
                        let kind = matchedMediaMark[2];
                        let getCaption = matchedMediaMark[4];
                        return returnMediaElement(false, kind, factMediaPath, getCaption);
                    } else {
                        return returnMediaElement(false, 'image', factMediaPath, caption);
                    }
                }
            } else {
                // 如果不符合mdz media规则，就返回原来的旧规则
                return originalImageHTML;
            }
        };
        self.postMessage(mdIt.render(e.data[1]));
    } else if (e.data[0] === 'pdf') {
        self.postMessage("PDF");
    }
});
