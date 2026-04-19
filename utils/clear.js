import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
    // recursive: true 会删除文件夹及其所有子内容
    // force: true 如果路径不存在不会报错（类似 rm -f）
    fs.rmSync(path.join(__dirname, "..", "dist"), { recursive: true, force: true });
} catch (err) {}

try {
    fs.rmSync(path.join(__dirname, "..", "out"), { recursive: true, force: true });
} catch (err) {}

try {
    fs.rmSync(path.join(__dirname, "..", "libs", "napi_cpp", "mdz_utils", "build"), { recursive: true, force: true });
} catch (err) {}

try {
    fs.rmSync(path.join(__dirname, "..", "libs", "napi_cpp", "mdz_utils",
        "bin", process.platform, process.arch, "mdz_utils.node"), { recursive: true, force: true });
} catch (err) {}

try {
    fs.rmSync(path.join(__dirname, "..", "libs", "napi_cpp", "mdz_utils",
        "lib", process.platform, process.arch, process.platform === 'win32' ? "7z.dll" : "7z.so"), { recursive: true, force: true });
} catch (err) {}

try {
    fs.rmSync(path.join(__dirname, "..", "libs", "napi_cpp", "mdz_utils",
        "lib", process.platform, process.arch, process.platform === 'win32' ? "bit7z.lib" : "libbit7z64.a"), { recursive: true, force: true });
} catch (err) {}

try {
    fs.rmSync(path.join(__dirname, "..", "libs", "third_party", "7z2600-src",
        "CPP", "7zip", "Bundles", "Format7zF", process.platform === 'win32' ? "o" : "b"), { recursive: true, force: true });
} catch (err) {}

try {
    fs.rmSync(path.join(__dirname, "..", "libs", "third_party", "bit7z", "build"), { recursive: true, force: true });
} catch (err) {}

try {
    fs.rmSync(path.join(__dirname, "..", "libs", "third_party", "bit7z", "lib"), { recursive: true, force: true });
} catch (err) {}
