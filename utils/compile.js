import path from "path";
import pkg from '../package.json' with { type: 'json' };
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 先获取7zip编译目录
let sevenZDir = path.join(__dirname, "..", "libs", "third_party", "7z2600-src", "CPP", "7zip", "Bundles");
let mdzUtilsDir = path.join(__dirname, "..", "libs", "napi_cpp", "mdz_utils");
let mdzUtilsLibDir = path.join(__dirname, "..", "libs", "napi_cpp", "mdz_utils", "lib", process.platform, process.arch);
let bit7zDir = path.join(__dirname, "..", "libs", "third_party", "bit7z");

if (process.platform === "win32") {
    fs.rmSync(path.join(__dirname, "..", "libs", "third_party", "bit7z", "src", "internal", "fsutil.cpp"), { recursive: true, force: true });
    fs.renameSync(path.join(__dirname, "..", "libs", "third_party", "bit7z", "src", "internal", "fsutil_win32.cpp"),
        path.join(__dirname, "..", "libs", "third_party", "bit7z", "src", "internal", "fsutil.cpp"));
}

let echoGet7ZipBuildDir = `echo "Get 7-Zip build dir: ${path.join(sevenZDir, "Format7zF")}"`;
// 然后进入这个编译目录
let echoEnterSevenZBuildDir = `echo "Entering 7-Zip build dir: ${path.join(sevenZDir, "Format7zF")}"`;
let enterSevenZBuildDir = `cd "${path.join(sevenZDir, "Format7zF")}"`;
// 开始根据各自的系统平台进行编译
let echoGetOSAndArch = `echo "Get your OS & arch type: ${process.platform} ${process.arch}, Setting 7-Zip build options..."`;
let build7Zip;
if (process.platform === "win32") {
    let vsToolsPath = 'C:\\Program Files\\Microsoft Visual Studio\\2022\\Enterprise\\Common7\\Tools\\VsDevCmd.bat';
    build7Zip = `call "${vsToolsPath}" && nmake NEW_COMPILER=1 MY_STATIC_LINK=1`;
} else if (process.platform === "darwin") {
    if (process.arch === "arm64") {
        build7Zip = 'make -j -f ../../cmpl_mac_arm64.mak';
    }
} else if (process.platform === "linux") {
    build7Zip = 'make -j -f ../../cmpl_gcc.mak';
}
let echoBuild7ZipFinish = `echo "Build 7-Zip library finished."`;
let echoCopy7ZipToMdzUtilsLibDir;
// 编译完成后复制编译完成的库进入mdz_utils的lib目录中（win平台是o/7z.dll，其他平台是b/7z.so）
let doCopy7ZDyLib;
if (process.platform === "win32") {
    echoCopy7ZipToMdzUtilsLibDir = `echo "Copying 7-Zip library to: ${path.join(mdzUtilsLibDir, "7z.dll")}"`;
    doCopy7ZDyLib = `copy "${path.join(sevenZDir, "Format7zF", "o", "7z.dll")}" "${path.join(mdzUtilsLibDir, "7z.dll")}"`;
} else {
    echoCopy7ZipToMdzUtilsLibDir = `echo "Copying 7-Zip library to: ${path.join(mdzUtilsLibDir, "7z.so")}"`;
    doCopy7ZDyLib = `cp "${path.join(sevenZDir, "Format7zF", "b", "m_" + process.arch, "7z.so")}" "${path.join(mdzUtilsLibDir, "7z.so")}"`;
}
let echoCopy7ZipFinish = `echo "Copy 7-Zip library finished, leaving dir."`;
// 接下来编译bit7z库
// 先进入bit7z库根目录，然后创建build文件夹，再进入build文件夹
let echoEnterBit7zDir = `echo "Enter bit7z dir..."`;
let enterBit7zDir = `cd ${bit7zDir}`;
let makeAndEnterBit7zBuildDir = `mkdir build && cd build`;
// 开启编译
let configureBit7z = `cmake ../` +
    ` -DCMAKE_BUILD_TYPE=Release -DBIT7Z_USE_NATIVE_STRING=ON -DBIT7Z_AUTO_FORMAT=ON` +
    ` -DBIT7Z_7ZIP_VERSION="26.00" -DBIT7Z_CUSTOM_7ZIP_PATH=${path.join(__dirname, "..", "libs", "third_party", "7z2600-src")}`;
let buildBit7z = `cmake --build . -j --config Release`;
// 编译完成后复制编译完成的库进入mdz_utils的lib目录中
let echoCopyBit7ZipToMdzUtilsLibDir;
let doCopyBit7ZDyLib;
if (process.platform === "win32") {
    echoCopyBit7ZipToMdzUtilsLibDir = `echo "Copying bit7z library to: ${path.join(mdzUtilsLibDir, "bit7z.lib")}"`;
    doCopyBit7ZDyLib = `copy "${path.join(bit7zDir, "lib", process.arch, "Release", "bit7z.lib")}" "${path.join(mdzUtilsLibDir, "bit7z.lib")}"`;
} else {
    echoCopyBit7ZipToMdzUtilsLibDir = `echo "Copying bit7z library to: ${path.join(mdzUtilsLibDir, "libbit7z64.a")}"`;
    doCopyBit7ZDyLib = `cp "${path.join(bit7zDir, "lib", process.arch, "libbit7z64.a")}" "${path.join(mdzUtilsLibDir, "libbit7z64.a")}"`;
}
// 开始编译mdz_utils
let echoEnterMdzUtilsDir = `echo "Enter into mdz_utils dir."`;
let buildMdzUtils = `cd ${mdzUtilsDir} && npm install`;
// 编译完成后将其拷贝至bin目录
let echoCopyMdzUtilsToMdzUtilsBinDir;
let doCopyMdzUtils;
if (process.platform === "win32") {
    echoCopyMdzUtilsToMdzUtilsBinDir = `echo "Copying mdz_utils node-addon-plugin to: ${path.join(mdzUtilsDir, "bin", process.platform, process.arch, "mdz_utils.node")}"`;
    doCopyMdzUtils = `copy "${path.join(mdzUtilsDir, "build", "Release", "mdz_utils.node")}" "${path.join(mdzUtilsDir, "bin", process.platform, process.arch, "mdz_utils.node")}"`;
} else {
    echoCopyMdzUtilsToMdzUtilsBinDir = `echo "Copying mdz_utils node-addon-plugin to: ${path.join(mdzUtilsDir, "bin", process.platform, process.arch, "mdz_utils.node")}"`;
    doCopyMdzUtils = `cp "${path.join(mdzUtilsDir, "build", "Release", "mdz_utils.node")}" "${path.join(mdzUtilsDir, "bin", process.platform, process.arch, "mdz_utils.node")}"`;
}
// 拷贝完成后，回到项目根目录，然后执行最终的打包和安装工作
let backToProjectRootDir = `cd ${path.join(__dirname, "..")}`;
let finishPackage;
let afterPackage;
if (process.platform === "win32") {
    finishPackage = `npm run build:win`;
    afterPackage = path.join(__dirname, "..", "dist", `${pkg.name}-${pkg.version}-setup.exe`);
} else if (process.platform === "darwin") {
    finishPackage = `npm run build:mac`;
    afterPackage = 'open "' + path.join(__dirname, "..", "dist", `${pkg.name}-${pkg.version}.dmg`) + '"';
} else if (process.platform === "linux") {
    finishPackage = `npm run build:linux`;
    afterPackage = `echo "Package product is in ${path.join(__dirname, "..", "dist")}"`;
}

let allShell = `${echoGet7ZipBuildDir}`
    + ` && ${echoEnterSevenZBuildDir} && ${enterSevenZBuildDir}`
    + ` && ${echoGetOSAndArch} && ${build7Zip} && ${echoBuild7ZipFinish}`
    + ` && ${echoCopy7ZipToMdzUtilsLibDir} && ${doCopy7ZDyLib} && ${echoCopy7ZipFinish}`
    + ` && ${echoEnterBit7zDir} && ${enterBit7zDir} && ${makeAndEnterBit7zBuildDir}`
    + ` && ${configureBit7z} && ${buildBit7z} && ${echoCopyBit7ZipToMdzUtilsLibDir}`
    + ` && ${doCopyBit7ZDyLib} && ${echoEnterMdzUtilsDir} && ${buildMdzUtils}`
    + ` && ${echoCopyMdzUtilsToMdzUtilsBinDir} && ${doCopyMdzUtils} && ${backToProjectRootDir}`
    + ` && ${finishPackage} && ${afterPackage}`;

const child = spawn(allShell, {
    shell: true, // Windows 下必须开启才能识别环境变量和内置命令
});

// 监听标准输出（实时打印）
child.stdout.on('data', (data) => {
    process.stdout.write(data); // 使用 process.stdout.write 不会自动换行，保持原汁原味
});

// 监听错误输出
child.stderr.on('data', (data) => {
    process.stderr.write(`${data}`);
});

child.on('close', (code) => {
    console.log(`\nExit code: ${code}`);
});
