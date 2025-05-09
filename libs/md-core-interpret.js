const commonmark = require("./third_party/commonmark/commonmark");
const marked = require("../libs/third_party/marked/marked.cjs");  // Marked


function MdCoreInterpret() {
    this.interpret = (originContent, kind) => {
        /**
         * Markdown核心处理模块
         */
        if (kind === "commonmark") {
            let reader = new commonmark.Parser();
            let writer = new commonmark.HtmlRenderer();
            let parsed = reader.parse(originContent);  // parsed is a 'Node' tree
            let result = writer.render(parsed);
            return [parsed, result];
        } else if (kind === "marked") {
            return [null, marked.parse(originContent)];
        }
    }
}

module.exports = MdCoreInterpret;
