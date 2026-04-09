let mdzUtils;

mdzUtils = require("./libs/napi_cpp/mdz_utils");

let input = "/Users/scottsmith/Desktop/tst/._mdz_content.Large12";  // 压缩的时候要带上隐藏文件夹名
let output = "/Users/scottsmith/Desktop/tst/Large12.mdz";
// let output = "/Users/scottsmith/Desktop/sm1234.mdz";

let ds = '/Users/scottsmith/Desktop/TEST';  // 解压的时候直接根目录即可

mdzUtils.genOrDecompressMdz(input, output, "compress", "12", "").then((result) => {
    console.log(result);
}).catch((e) => {
    console.error(e);
});

// mdzUtils.genOrDecompressMdz(outputPs, ds, "decompress", "", "1234").then((result) => {
//     console.log(result);
// }).catch((e) => {
//     console.error(e.message);
// });

// console.log(mdzUtils.verifyMdzIsEncrypted(output));
