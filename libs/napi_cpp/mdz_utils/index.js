const platform = process.platform;  // 获取操作系统
const arch = process.arch;  // 获取架构

const path = require('path');
const mdzUtils = require(path.join(__dirname, "bin", platform, arch, "mdz_utils.node"));

const sevenZlibPth = path.join(__dirname, "lib", platform, arch, arch === "win32" ? "7z.dll" : "7z.so");

const genOrDecompressMdz = (inputPath, destPath, instruction, compressPassword, decompressPassword) => {
    return mdzUtils.genOrDecompressMdz(inputPath, destPath, instruction, sevenZlibPth, compressPassword, decompressPassword);
};

module.exports = {
    genOrDecompressMdz
};
