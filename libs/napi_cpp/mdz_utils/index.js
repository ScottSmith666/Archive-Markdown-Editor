const platform = process.platform;  // 获取操作系统
const arch = process.arch;  // 获取架构

const path = require('path');
const mdzUtils = require(path.join(__dirname, "bin", platform, arch, "mdz_utils.node"));

const sevenZlibPth = path.join(__dirname, "lib", platform, arch, "7z.so");

const genOrDecompressMdz = (callback, inputPath, instruction, destPath, compressPassword, decompressPassword) => {
    console.log(mdzUtils.genOrDecompressMdz);
    return mdzUtils.genOrDecompressMdz(callback, inputPath, instruction, destPath, sevenZlibPth, compressPassword, decompressPassword);
};

const verifyMdzIsEncrypted = (inputPath) => {
    return mdzUtils.verifyMdzIsEncrypted(inputPath, sevenZlibPth);
};

module.exports = {
    genOrDecompressMdz,
    verifyMdzIsEncrypted,
};
