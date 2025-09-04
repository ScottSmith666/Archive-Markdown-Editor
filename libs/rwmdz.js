const path = require("node:path");
const { app } = require("electron");

// 打包后动态链接库并不在原位置，需要更改为打包后的路径
let xc_mdz;
if (app.isPackaged) xc_mdz = require(path.join(process.resourcesPath, "app.asar", "libs", "rust_libraries", "xc_mdz.node"));
else xc_mdz = require(path.join(__dirname, "rust_libraries", "xc_mdz.node"));


const FORBIDDEN_FILES_FOLDERS = ['__MACOSX', '.DS_Store'];

function RwMdz() {
    /**
     * 读取/写入mdz文件
     */
    this.readMdz = (mdzPath) => {
        /**
         * 读取mdz文件
         */

        // 返回mdz文件内md核心文件的路径
        return "";
    };

    this.writeMdz = (mdzPath) => {
        /**
         * 写入并保存mdz文件
         */
    }
}

module.exports = RwMdz;
