// let mdzUtils;
//
// mdzUtils = require("./libs/napi_cpp/mdz_utils");
//
// let input = "/Users/scottsmith/Desktop/tst/gooddd";  // 压缩的时候要带上隐藏文件夹名
// let output = "/Users/scottsmith/Desktop/sample.mdz";
// let outputPs = "/Users/scottsmith/Desktop/NOPASS.7z";
//
// let ds = '/Users/scottsmith/Destop/NOPS';  // 解压的时候直接根目录即可
//
// mdzUtils.genOrDecompressMdz(ds, outputPs, "compress", "", "").then((result) => {
//     console.log(result);
// }).catch((e) => {
//     console.error(e);
//     // 包含“No such file or directory”则说明找不到文件/文件夹
// });
//
// mdzUtils.genOrDecompressMdz(output, ds, "decompress", "", "").then((result) => {
//     console.log(result);
// }).catch((e) => {
//     console.error(e.message);
//     // 包含“No such file or directory”则说明找不到文件
//     // 包含“password is required but none was provided”或“wrong password”说明密码错误
//     // 可以传空字符串密码至无密码文件，能成功打开
// });


import pkg from './package.json' with { type: 'json' };

console.log(pkg.version);
console.log(pkg.name);