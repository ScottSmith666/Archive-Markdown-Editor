const path = require("node:path");
const { app } = require("electron");
const GlobalVar = require(path.join(__dirname, "globalvar"));

// 打包后动态链接库并不在原位置，需要更改为打包后的路径
let xc_mdz;
if (app.isPackaged) xc_mdz = require(path.join(process.resourcesPath, "app.asar", "libs", "rust_libraries", "xc_mdz.node"));
else xc_mdz = require(path.join(__dirname, "rust_libraries", "xc_mdz.node"));


const gVar = new GlobalVar();

function RwMdz() {
    /**
     * 读取/写入mdz文件
     */
    this.readMdz = (mdzPath, password = "") => {
        /**
         * 读取mdz文件
         */

        // 解压mdz文件
        let mdzPathList = mdzPath.split(gVar.pathSep);
        let mdzName = mdzPathList.pop();
        let mdzNameList = mdzName.split(".");
        mdzNameList.pop();
        let root = mdzPathList.join(gVar.pathSep);
        let xResult = xc_mdz.xcMdz(mdzPath, root + gVar.pathSep + "._mdz_content." + mdzNameList.join("."), 2, password === "" ? 2 : 1, password);
        if (xResult === -1) return -1;
        // 返回mdz文件内md核心文件的路径
        return root + gVar.pathSep + "._mdz_content." + mdzNameList.join(".") + gVar.pathSep + "mdz_contents" + gVar.pathSep + mdzNameList.join(".") + ".md";
    };

    this.writeMdz = (folderPath, password = "") => {
        /**
         * 写入并保存mdz文件
         */
        let folderPathList = folderPath.split(gVar.pathSep);
        let folderName = folderPathList.pop();
        xc_mdz.xcMdz(folderPath, folderPathList.join(gVar.pathSep) + gVar.pathSep + folderName.replace("._mdz_content.", "") + ".mdz", 1, password === "" ? 2 : 1, password);
    }
}

module.exports = RwMdz;
