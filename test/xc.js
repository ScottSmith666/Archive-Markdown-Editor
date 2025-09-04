const path = require("node:path");
const xc_mdz = require(path.join(__dirname, "..", "libs", "rust_libraries", "xc_mdz.node"));


xc_mdz.xcMdz("/Users/scottsmith/Desktop/haha", "/Users/scottsmith/Desktop/haha233.mdz", 1, 1, "2333");
let xx = xc_mdz.xcMdz("/Users/scottsmith/Desktop/haha233.mdz", "/Users/scottsmith/Desktop/haha233", 2, 1, "2333");
if (xx === -1) console.log("解压失败！");
else console.log("解压成功！");
