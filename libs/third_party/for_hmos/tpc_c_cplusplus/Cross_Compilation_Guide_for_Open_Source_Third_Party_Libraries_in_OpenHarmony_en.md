# Cross-Compilation Guide for Open-Source Third-Party Libraries in OpenHarmony

## Introduction

This repository primarily stores adaptation scripts for C/C++ third-party libraries that have been adapted to OpenHarmony, cross-compilation guidance documents, and related tools for third-party library adaptation.

## Getting Started

This chapter describes the source code compilation methods:
* [Preparing OpenHarmony SDK](#sdk_prepare_tag)
* [Compiling Source Code via CMake](#cmake_tag)
* [Compiling Source Code via configure](#configure_tag)
* [Verifying Compiled Outputs](#check_binary_tag)

### Prerequisites

#### Preparing OpenHarmony SDK <a id="sdk_prepare_tag"></a>

OpenHarmony provides SDKs for Linux, Windows, and macOS platforms, enabling cross-compilation across these systems. This guide focuses on Linux-based cross-compilation.

1. Download the SDK for your target platform from the [official release channel](https://gitcode.com/openharmony/docs/blob/master/en/release-notes/OpenHarmony-v5.0.1-release.md#acquiring-source-code-from-mirrors).
2. Extract the SDK package:
   ```shell
   owner@ubuntu:~/workspace$ tar -zxvf ohos-sdk-windows_linux-public.tar.tar.gz
   ```
3. Navigate to the SDK's Linux directory and extract all toolchain packages:
   ```shell
   owner@ubuntu:~/workspace$ cd ohos_sdk/linux
   owner@ubuntu:~/workspace/ohos-sdk/linux$ for i in *.zip;do unzip ${i};done
   owner@ubuntu:~/workspace/ohos-sdk/linux$ ls
   total 1228400
   85988 -rw-r--r-- 1 wshi wshi  88050148 Nov 20  2024 ets-linux-x64-5.0.1.111-Release.zip          # ArkTS compiler tools
   56396 -rw-r--r-- 1 wshi wshi  57747481 Nov 20  2024 js-linux-x64-5.0.1.111-Release.zip           # JS compiler tools
   888916 -rw-r--r-- 1 wshi wshi 910243125 Nov 20  2024 native-linux-x64-5.0.1.111-Release.zip      # C/C++ cross-compilation tools
   175084 -rw-r--r-- 1 wshi wshi 179281763 Nov 20  2024 previewer-linux-x64-5.0.1.111-Release.zip   # App preview tools
   22008 -rw-r--r-- 1 wshi wshi  22533501 Nov 20  2024 toolchains-linux-x64-5.0.1.111-Release.zip   # Utilities (e.g., signing tool, device connector)
   ```

### Compiling CMake Projects <a id="cmake_tag"></a>

1. Create a build directory:
   ```shell
   owner@ubuntu:~/workspace$ cd {SRC}                                  # Navigate to source directory
   owner@ubuntu:~/workspace/{SRC}$ mkdir build && cd build             # Create and enter build directory
   ```

2. Configure cross-compilation parameters to generate Makefile (replace `SDKPATH` with your SDK path):
   ```shell
   owner@ubuntu:~/workspace/{SRC}/build$ {SDKPATH}/bin/cmake -DCMAKE_TOOLCHAIN_FILE={SDKPATH}/ohos.toolchain.cmake -DCMAKE_INSTALL_PREFIX={INSTALL_PATH} -DOHOS_ARCH=arm64-v8a .. -L
   ```
   **Notes:** 
   - Use the CMake executable from the SDK, **NOT** your system's default CMake.
   - Key parameters:
     - `CMAKE_TOOLCHAIN_FILE`: Path to the cross-compilation configuration file in the SDK.
     - `CMAKE_INSTALL_PREFIX`: Installation path for compiled outputs.
     - `OHOS_ARCH`: Target architecture (`arm64-v8a` for 64-bit, `armeabi-v7a` for 32-bit).

3. Execute compilation:
   ```shell
   owner@ubuntu:~/workspace/{SRC}/build$ make
   ```

4. Verify compiled binaries <a id="check_binary_tag"></a>:
   ```shell
   owner@ubuntu:~/workspace/{SRC}/build$ file {BINARY}
   {BINARY}: ELF 64-bit LSB shared object, ARM aarch64, version 1 (SYSV), dynamically linked, BuildID[sha1]=c0aaff0b401feef924f074a6cb7d19b5958f74f5, with debug_info, not stripped
   ```

5. Install outputs:
   ```shell
   owner@ubuntu:~/workspace/{SRC}/build$ make install
   ```

### Compiling configure-Based Projects <a id="configure_tag"></a>

1. Review configuration options:
   ```shell
   owner@ubuntu:~/workspace/{SRC}$ ./configure --help
   ```

2. Set cross-compilation environment variables (for 64-bit ARM):
   ```shell
   export OHOS_SDK=/home/owner/tools/OHOS_SDK/ohos-sdk/linux/
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
   export CFLAGS="-fPIC -D__MUSL__=1"      # For 32-bit: add "-march=armv7a"
   export CXXFLAGS="-fPIC -D__MUSL__=1"    # For 32-bit: add "-march=armv7a"
   ```

3. Run configure with cross-compilation parameters:
   ```shell
   owner@ubuntu:~/workspace/{SRC}$ ./configure --prefix=/home/owner/workspace/{SRC} --host=aarch64-linux
   ```

4. Compile and install:
   ```shell
   owner@ubuntu:~/workspace/{SRC}$ make
   owner@ubuntu:~/workspace/{SRC}$ make install
   ```
