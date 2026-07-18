# 开源三方库OpenHarmony交叉编译指导

## 简介

本仓库主要用于存放已经适配OpenHarmony的C/C++三方库的适配脚本和OpenHarmony三方库适配指导文档、三方库适配相关的工具。

## 入门指南

本章介绍的源码编译方案为：
* [OpenHarmony SDK 准备](#sdk_prepare_tag)
* [CMake方式编译源码](#cmake_tag)
* [configure方式编译源码](#configure_tag)
* [如何进行测试验证编译产物](#check_binary_tag)


### 编译前准备

#### OpenHarmony SDK 准备 <a id="sdk_prepare_tag"></a>

OpenHarmony提供 linux/windwos以及mac平台的几种SDK，开发者可以在linux、windwos以及mac平台上进行交叉编译。本文以linux平台为主进行交叉编译的讲解。

1. 从 OpenHarmony SDK [官方发布渠道](https://gitcode.com/openharmony/docs/blob/master/zh-cn/release-notes/OpenHarmony-v5.0.2-release.md#%E4%BB%8E%E9%95%9C%E5%83%8F%E7%AB%99%E7%82%B9%E8%8E%B7%E5%8F%96) 下载对应版本的SDK。
2. 解压SDK

   ```shell
   owner@ubuntu:~/workspace$ tar -zxvf ohos-sdk-windows_linux-public.tar.tar.gz
   ```

3. 进入到sdk的linux目录，解压对应工具包：

   ```shell
   owner@ubuntu:~/workspace$ cd ohos_sdk/linux
   owner@ubuntu:~/workspace/ohos-sdk/linux$ for i in *.zip;do unzip ${i};done                   # 通过for循环一次解压所有的工具包
   owner@ubuntu:~/workspace/ohos-sdk/linux$ ls
   total 1228400
   85988 -rw-r--r-- 1 wshi wshi  88050148 Nov 20  2024 ets-linux-x64-5.0.1.111-Release.zip             #arkts 编译工具
   56396 -rw-r--r-- 1 wshi wshi  57747481 Nov 20  2024 js-linux-x64-5.0.1.111-Release.zip              #js 编译工具
   888916 -rw-r--r-- 1 wshi wshi 910243125 Nov 20  2024 native-linux-x64-5.0.1.111-Release.zip         #c/c++ 交叉编译工具
   175084 -rw-r--r-- 1 wshi wshi 179281763 Nov 20  2024 previewer-linux-x64-5.0.1.111-Release.zip      #应用预览工具
   22008 -rw-r--r-- 1 wshi wshi  22533501 Nov 20  2024 toolchains-linux-x64-5.0.1.111-Release.zip      #实用工具，如应用签名工具，设备连接工具
   ```

### CMake 项目编译构建 <a id="cmake_tag"></a>

1. 新建编译目录

   为了不污染源码目录文件，我们推荐在三方库源码目录新建一个编译目录，用于生成需要编译的配置文件，本用例中我们在需要编译的源码(简称SRC)目录下新建一个build目录：

   ```shell
   owner@ubuntu:~/workspace$ cd {SRC}                                   # 进入SRC目录
   owner@ubuntu:~/workspace/{SRC}$ mkdir build && cd build              # 创建编译目录并进入到编译目录
   owner@ubuntu:~/workspace/{SRC}/build$
   ```

2. 配置交叉编译参数，生成Makefile，本用例中，我们采用SDK中的cmake工具以及配置文件进行编译（对应的路径为：SDKPATH=~/workspace/ohos-sdk/linux/native/build-tools/cmake），参考命令如下：

   ```shell
   owner@ubuntu:~/workspace/{SRC}/build$ {SDKPATH}/bin/cmake -DCMAKE_TOOLCHAIN_FILE={SDKPATH}/ohos.toolchain.cmake -DCMAKE_INSTALL_PREFIX={INSTALL_PATH} -DOHOS_ARCH=arm64-v8a .. -L             # 执行cmake命令,执行完cmake成功后在当前目录生成Makefile文件
   ```

   **注意这里执行的 cmake 必须是 SDK 内的 cmake，不是你自己系统上原有的 cmake 。否则会不识别参数OHOS_ARCH。**

   参数说明：
   1) CMAKE_TOOLCHAIN_FILE: 交叉编译置文件路径，必须设置成工具链中的配置文件。
   2) CMAKE_INSTALL_PREFIX: 配置安装三方库路径。
   3) OHOS_ARCH: 配置交叉编译的CPU架构，一般为arm64-v8a(编译64位的三方库)、armeabi-v7a(编译32位的三方库)，本示例中我们设置编译64位的源码库。
   4) -L: 显示cmake中可配置项目

3. 执行编译

   cmake执行成功后，在build目录下生成了Makefile，我们就可以直接执行make对源代码进行编译了：

   ```shell
   owner@ubuntu:~/workspace/{SRC}/build$ make                  # 执行make命令进行编译，执行完毕后本文件夹可以看到编译后结果
   ```

4. 查看编译后文件属性 <a id="check_binary_tag"></a>

   编译成功后我们可以通过file命令查看文件的属性，以此判断交叉编译是否成功，如下信息显示编译输出二进制为aarch64架构文件，即交叉编译成功：

   ```shell
   owner@ubuntu:~/workspace/{SRC}/build$ file {BINARY}     # 查看文件属性命令
   {BINARY}: ELF 64-bit LSB shared object, ARM aarch64, version 1 (SYSV), dynamically linked, BuildID[sha1]=c0aaff0b401feef924f074a6cb7d19b5958f74f5, with debug_info, not stripped
   ```

5. 执行安装命令

   编译成功后，我们可以执行make install将编译好的二进制文件以及头文件安装到cmake配置的安装路径下：

   ```shell
   owner@ubuntu:~/workspace/{SRC}/build$ make install                # 执行安装命令
   ```

### configure 项目编译构建 <a id="configure_tag"></a>

configure 是一个由 GNU Autoconf 提供的脚本用于自动生成 Makefile。本用例中我们用需要以configure构建方式编译的源码库(简称SRC)来演示如何在linux环境上通过`OpenHarmony SDK`进行交叉编译。

SDK和源码准备请参考上面的[SDK准备](#openharmony-sdk-准备)

1. 查看configure配置
  进入到{SRC}目录执行configure配置，如若对configure配置项不熟悉，我们可以通过运行`configure --help`查看：

   ```shell
   owner@ubuntu:~/workspace/{SRC}$ ./configure --help
   `configure` configures {SRC} to adapt to many kinds of systems.
   Usage: ./configure [OPTION]... [VAR=VALUE]...
   ...
   # 编译相关的配置安装选项
   Installation directories:
     --prefix=PREFIX         install architecture-independent files in PREFIX
                          [/usr/local]

   ...
   # 编译相关的配置编译的主机选项(--host)，默认配置为linux
   System types:
   --build=BUILD     configure for building on BUILD [guessed]
   --host=HOST       cross-compile to build programs to run on HOST [BUILD]
   --target=TARGET   configure for building compilers for TARGET [HOST]
   ...
   # 编译相关的配置编译命令(默认使用linux gcc相关配置)
   Some influential environment variables:
     CC          C compiler command
     CFLAGS      C compiler flags
     LDFLAGS     linker flags, e.g. -L<lib dir> if you have libraries in a
                 nonstandard directory <lib dir>
     LIBS        libraries to pass to the linker, e.g. -l<library>
     CPPFLAGS    (Objective) C/C++ preprocessor flags, e.g. -I<include dir> if
                 you have headers in a nonstandard directory <include dir>
     CPP         C preprocessor
     LT_SYS_LIBRARY_PATH
                 User-defined run-time library search path.

   ```

   由configure的帮助信息我们可以知道，源码交叉编译需要配置主机(编译完后需要运行的系统机器), 需要配置交叉编译命令以以及配置安装路径等选项。

3. 配置交叉编译命令,在命令行输入以下命令：
   ```shell
   export OHOS_SDK=/home/owner/tools/OHOS_SDK/ohos-sdk/linux/                   ## 配置SDK路径，此处需配置成自己的sdk解压目录
   export AS=${OHOS_SDK}/native/llvm/bin/llvm-as
   export CC="${OHOS_SDK}/native/llvm/bin/clang --target=aarch64-linux-ohos"    ## 32bit的target需要配置成 --target=arm-linux-ohos
   export CXX="${OHOS_SDK}/native/llvm/bin/clang++ --target=aarch64-linux-ohos" ## 32bit的target需要配置成 --target=arm-linux-ohos
   export LD=${OHOS_SDK}/native/llvm/bin/ld.lld
   export STRIP=${OHOS_SDK}/native/llvm/bin/llvm-strip
   export RANLIB=${OHOS_SDK}/native/llvm/bin/llvm-ranlib
   export OBJDUMP=${OHOS_SDK}/native/llvm/bin/llvm-objdump
   export OBJCOPY=${OHOS_SDK}/native/llvm/bin/llvm-objcopy
   export NM=${OHOS_SDK}/native/llvm/bin/llvm-nm
   export AR=${OHOS_SDK}/native/llvm/bin/llvm-ar
   export CFLAGS="-fPIC -D__MUSL__=1"                                            ## 32bit需要增加配置 -march=armv7a
   export CXXFLAGS="-fPIC -D__MUSL__=1"                                          ## 32bit需要增加配置 -march=armv7a
   ```

4. 执行configure命令

  安装路劲以及host配置可以在configure时执行，此处以配置arm64位为例，如若需要配置32位，将`aarch64-arm`替换成`arm-linux`即可。

   ```shell
   owner@ubuntu:~/workspace/{SRC}$ ./configure --prefix=/home/owner/workspace/{SRC} --host=aarch64-linux       # 执行configure命令配置交叉编译信息
   ```

   执行完confiure没有提示任何错误，即说明confiure配置成功，在当前目录会生成Makefile文件。

5. 执行make编译命令
  configure执行成功后，在当前目录会生成Makefile文件，直接运行make即可进行交叉编译：

   ```shell
   owner@ubuntu:~/workspace/{SRC}$ make                       # 执行make编译命令
   ```

6. 执行安装命令
   ```shell
   owner@ubuntu:~/workspace/{SRC}$ make install
   ```

