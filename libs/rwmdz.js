const AdmZip = require('adm-zip');  // （解）压缩zip库


const FORBIDDEN_FILES_FOLDERS = ['__MACOSX', '.DS_Store'];

function RwMdz() {
    /**
     * 读取/写入mdz文件
     */
    this.readMdz = (mdzPath, platform) => {
        /**
         * 读取mdz文件
         */
        let sep = (platform === 'win32') ? '\\' : '/';
        let mdzPathList = mdzPath.split(sep);
        let fullFileName = mdzPathList.pop();
        let fileNameList = fullFileName.split(".");
        fileNameList.pop();  // 去掉扩展名元素
        let fileName = fileNameList.join(".");
        let adzUncompressedPath = mdzPathList.join(sep);

        let mdz = AdmZip(mdzPath);
        mdz.extractAllTo(adzUncompressedPath, true);
        // 返回mdz文件内md核心文件的路径
        return adzUncompressedPath + sep + "._mdz_content." + fileName + sep + "mdz_contents" + sep + fileName + ".md";
    };

    this.writeMdz = (mdzPath) => {
        /**
         * 写入并保存mdz文件
         */
    }
}

module.exports = RwMdz;
