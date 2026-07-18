# 鸿蒙版Archive Markdown Editor用到的C/C++库编译指南

> [!caution]
> 
> 以下所有操作均要在`Ubuntu 22.04 x64`发行版Linux系统上编译，在编译之前，做好3点准备：
> 1. 下载并安装[鸿蒙命令行工具](https://developer.huawei.com/consumer/cn/download/command-line-tools-for-hmos)
> 2. 下载并安装Nodejs 20.18.1版本和npm
> 3. 在你的环境变量文件（`.bashrc`或`.zshrc`，看你用的哪种shell）中按照如下内容配置你的编译工具链：

```shell
# Nodejs settings
export PATH=$PATH:/path/to/node-v20.18.1-linux-x64/bin
# OHOS SDK settings
export OHOS_SDK=/path/to/command-line-tools/sdk/default/openharmony
export AS=${OHOS_SDK}/native/llvm/bin/llvm-as
export CC="${OHOS_SDK}/native/llvm/bin/clang --target=aarch64-linux-ohos"
export CXX="${OHOS_SDK}/native/llvm/bin/clang++ --target=aarch64-linux-ohos"
export LD=${OHOS_SDK}/native/llvm/bin/ld.lld
export STRIP=${OHOS_SDK}/native/llvm/bin/llvm-strip
export RANLIB=${OHOS_SDK}/native/llvm/bin/llvm-ranlib
export OBJDUMP=${OHOS_SDK}/native/llvm/bin/llvm-objdump
export OBJCOPY=${OHOS_SDK}/native/llvm/bin/llvm-objcopy
export NM=${OHOS_SDK}/native/llvm/bin/llvm-nm
export AR=${OHOS_SDK}/native/llvm/bin/llvm-ar
export CFLAGS="-fPIC -D__MUSL__=1"
export CXXFLAGS="-fPIC -D__MUSL__=1"
export PATH=$PATH:$OHOS_SDK/native/llvm/bin:/path/to/command-line-tools/sdk/default/openharmony/native/build-tools/cmake/bin
```

## 1. 编译p7zip

参考`./tpc_c_cplusplus/thirdparty/p7zip/docs/hap_integrate.md`。

## 2. 编译Bit7z

> [!caution]
>
> 本节的编译步骤务必采用放置在Archive Markdown Editor项目中的bit7z源码进行编译，否则可能会报错。

```bash
cd /path/to/bit7z
mkdir build
cd build
# 注意，-DBIT7Z_CUSTOM_7ZIP_PATH参数引入p7zip的源码来自第一步“编译p7zip”哦
cmake -DCMAKE_CXX_FLAGS="-Wno-error=unused-command-line-argument" -DCMAKE_TOOLCHAIN_FILE="/path/to/command-line-tools/sdk/default/openharmony/native/build/cmake/ohos.toolchain.cmake" -DBIT7Z_USE_LEGACY_IUNKNOWN=ON -DOHOS_ARCH=arm64-v8a .. -L -DCMAKE_BUILD_TYPE=Release -DBIT7Z_USE_NATIVE_STRING=ON -DBIT7Z_AUTO_FORMAT=ON -DBIT7Z_7ZIP_VERSION="22.01" -DBIT7Z_CUSTOM_7ZIP_PATH="/path/to/tpc_c_cplusplus/thirdparty/p7zip/p7zip-17.05"
make
```

## 3. 编译better-sqlite3-multiple-ciphers

参考`./编译基于V8接口开发的三方库的addon-华为开发者问答 _ 华为开发者联盟.html`

## 4. 编译“mdz_utils”

将第2部分编译出来的`libbit7z.a`放进`mdz_utils`项目根目录中的`lib/ohos/arm64`目录中，然后在`mdz_utils`项目根目录打开终端，运行`node-gyp configure`和`node-gyp build`。
