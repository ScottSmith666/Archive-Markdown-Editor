const path = require("node:path");
const xc_mdz = require(path.join(__dirname, "..", "libs", "rust_libraries", "xc_mdz.node"));


// 压缩
let cResult = xc_mdz.xcMdz("/Users/scottsmith/Desktop/ttt", "/Users/scottsmith/Desktop/ttt.zip", 1, 1, "1234");

// 解压
let xResult = xc_mdz.xcMdz("/Users/scottsmith/Desktop/ttt.zip", "/Users/scottsmith/Desktop/ttt2", 2, 1, "1234");
