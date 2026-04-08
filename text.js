const mdzUtils = require("./libs/napi_cpp/mdz_utils");

let input = "/Users/scottsmith/Desktop/hahaha1234.7z";
let output = "/Users/scottsmith/Desktop/fffff";

mdzUtils.genOrDecompressMdz((error, result) => {
    console.log(result);
}, input, "decompress", output, "", "1234");

// mdzUtils.genOrDecompressMdz((error, result) => {
//     console.log(result);
//     console.log(mdzUtils.verifyMdzIsEncrypted(input));
// }, output, "compress", input, "1234", "");
