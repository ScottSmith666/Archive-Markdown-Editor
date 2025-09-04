const path = require("node:path");
let xc_mdz;
try {
    xc_mdz = require(path.join(__dirname, "/dylibs/xc_mdz.node"));  // Rust库
} catch (e) {
    // 打包后动态链接库并不在原位置，需要更改为别的路径
    xc_mdz = require(path.join(__dirname, "../../dylibs/xc_mdz.node"));
}


const FORBIDDEN_FILES_FOLDERS = ['__MACOSX', '.DS_Store'];

function RwMdz() {
    /**
     * 读取/写入mdz文件
     */
    this.readMdz = (mdzPath, platform) => {
        /**
         * 读取mdz文件
         */

        // 返回mdz文件内md核心文件的路径
        return "";
    };

    this.writeMdz = (mdzPath, platform) => {
        /**
         * 写入并保存mdz文件
         */
    }
}

module.exports = RwMdz;
