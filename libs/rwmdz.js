const path = require("node:path");
const { app } = require("electron");
const GlobalVar = require(path.join(__dirname, "globalvar"));
const {exec} = require("child_process");
const fs = require("fs");
const process = require("node:process");

// 打包后动态链接库并不在原位置，需要更改为打包后的路径
// let xc_mdz;
// if (app.isPackaged) xc_mdz = require(path.join(process.resourcesPath, "app.asar", "libs", "rust_libraries", "xc_mdz.node"));
// else xc_mdz = require(path.join(__dirname, "rust_libraries", "xc_mdz.node"));


const gVar = new GlobalVar();

let cmdSep = process.platform === "win32" ? ";" : "&&"

function runCommand(command) {
    console.log(`正在执行${command}`);
    let exec = require('child_process').execSync;
    try {
        exec(command);
    } catch (err) {
        if (err.toString().includes("incorrect password")) return -1;  // 解压密码错误
        else return -2;  // 文件可能损坏
    }
    return 0;
}

function RwMdz() {
    /**
     * 读取/写入mdz文件
     */
    this.readMdz = (mdzPath, password = "") => {
        /**
         * 读取mdz文件
         */

        // 解压mdz文件
            console.log(password);
        let mdzPathList = mdzPath.split(gVar.pathSep);
        let mdzName = mdzPathList.pop();
        let mdzNameList = mdzName.split(".");
        mdzNameList.pop();
        let root = mdzPathList.join(gVar.pathSep);
        if (fs.existsSync(root + gVar.pathSep + "._mdz_content." + mdzNameList.join("."))) runCommand(`rm -rf ${root + gVar.pathSep + "._mdz_content." + mdzNameList.join(".")}`);
        if (runCommand(`unzip -P ${password === "" ? '\t' : password} ${mdzPath} -d ${root + gVar.pathSep + "._mdz_content." + mdzNameList.join(".")}`) === -1) return -1;
        // 返回mdz文件内md核心文件的路径
        else return root + gVar.pathSep + "._mdz_content." + mdzNameList.join(".") + gVar.pathSep + "mdz_contents" + gVar.pathSep + mdzNameList.join(".") + ".md";
    };

    this.writeMdz = (folderPath, password = "") => {
        /**
         * 写入并保存mdz文件
         */
        let folderPathList = folderPath.split(gVar.pathSep);
        let folderName = folderPathList.pop();

        let needPassword = password === "" ? [``, ``] : [`-e`, `-P ${password}`];
        runCommand(`cd ${folderPathList.join(gVar.pathSep) + gVar.pathSep + folderName} ${cmdSep} ${process.platform === "darwin" ? "rm -rf .DS_Store __MACOSX" : ""} ${cmdSep} zip -r ${needPassword[0]} ${".." + gVar.pathSep + folderName.replace("._mdz_content.", "") + ".mdz"} . ${needPassword[1]}`);
    }
}

module.exports = RwMdz;
