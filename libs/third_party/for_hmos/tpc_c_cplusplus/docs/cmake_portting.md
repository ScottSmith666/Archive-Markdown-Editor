# CMake交叉编译构建

## 简介

CMake 是一个跨平台的构建工具，它可以生成与构建系统无关的 Makefile 或 IDE 项目文件。CMake 的配置过程是跨平台的，因此可以在不同的操作系统上运行例如 Linux、Windows 和 macOS。<br>
CMake 的配置过程包括创建一个名为 CMakeLists.txt 的脚本文件，在该文件中定义项目的配置选项、依赖项和编译规则。然后通过运行 CMake 工具它会根据 CMakeLists.txt 文件生成适用于目标平台的 Makefile 或其他构建系统的文件。如果对`CMakeLists.txt`不熟悉的话，请先阅读[从零开始编写一个cmake构建脚本](./cmake_compile.md)。

本文通过cJSON库来讲解如何将一个cmake构建方式的三方库在linux环境上通过`OpenHarmony SDK`进行交叉编译。

## 编译前准备

### OpenHarmony SDK 准备

1. 从 OpenHarmony SDK [官方发布渠道](https://gitee.com/openharmony-sig/oh-inner-release-management/blob/master/Release-Testing-Version.md) 下载对应版本的SDK。
2. 解压SDK

   ```shell
   owner@ubuntu:~/workspace$ tar -zxvf version-Master_Version-OpenHarmony_3.2.10.3-20230105_163913-ohos-sdk-full.tar.gz
   ```

3. 进入到sdk的linux目录，解压工具包：

   ```shell
   owner@ubuntu:~/workspace$ cd ohos_sdk/linux
   owner@ubuntu:~/workspace/ohos-sdk/linux$ for i in *.zip;do unzip ${i};done                   # 通过for循环一次解压所有的工具包
   owner@ubuntu:~/workspace/ohos-sdk/linux$ ls
   ets                                native                                   toolchains
   ets-linux-x64-4.0.1.2-Canary1.zip  native-linux-x64-4.0.1.2-Canary1.zip     toolchains-linux-x64-4.0.1.2-Canary1.zip
   js                                 previewer
   js-linux-x64-4.0.1.2-Canary1.zip   previewer-linux-x64-4.0.1.2-Canary1.zip
   ```

### 三方库源码准备

   适配三方库如果没有指定版本，我们一般取三方库最新版本，不建议使用master的代码，这里我们下载cJSON v1.7.15 版本的源码：

   ```shell
   owner@ubuntu:~/workspace$ git clone https://github.com/DaveGamble/cJSON.git -b v1.7.15       # 通过git下载指定版本的源码
   Cloning into 'cJSON'...
   remote: Enumerating objects: 4545, done.
   remote: Total 4545 (delta 0), reused 0 (delta 0), pack-reused 4545
   Receiving objects: 100% (4545/4545), 2.45 MiB | 1.65 MiB/s, done.
   Resolving deltas: 100% (3026/3026), done.
   Note: switching to 'd348621ca93571343a56862df7de4ff3bc9b5667'.

   You are in 'detached HEAD' state. You can look around, make experimental
   changes and commit them, and you can discard any commits you make in this
   state without impacting any branches by switching back to a branch.

   If you want to create a new branch to retain commits you create, you may
   do so (now or later) by using -c with the switch command. Example:

   git switch -c <new-branch-name>

   Or undo this operation with:

   git switch -

   Turn off this advice by setting config variable advice.detachedHead to false

   owner@ubuntu:~/workspace$
   ```

## 编译&安装

1. 新建编译目录

   为了不污染源码目录文件，我们推荐在三方库源码目录新建一个编译目录，用于生成需要编译的配置文件，本用例中我们在cJSON目录下新建一个build目录：

   ```shell
   owner@ubuntu:~/workspace$ cd sJSON                                   # 进入cJSON目录
   owner@ubuntu:~/workspace/cJSON$ mkdir build && cd build              # 创建编译目录并进入到编译目录
   owner@ubuntu:~/workspace/cJSON/build$
   ```

2. 配置交叉编译参数，生成Makefile

   ```shell
   owner@ubuntu:~/workspace/cJSON/build$ /home/owner/workspace/ohos-sdk/linux/native/build-tools/cmake/bin/cmake -DCMAKE_TOOLCHAIN_FILE=//home/owner/workspace/ohos-sdk/linux/native/build/cmake/ohos.toolchain.cmake -DCMAKE_INSTALL_PREFIX=/home/owner/workspace/usr/cJSON -DOHOS_ARCH=arm64-v8a .. -L             # 执行cmake命令
   -- The C compiler identification is Clang 12.0.1
   -- Check for working C compiler: /home/ohos/tools/OH_SDK/ohos-sdk/linux/native/llvm/bin/clang # 采用sdk内的编译器
   -- Check for working C compiler: /home/ohos/tools/OH_SDK/ohos-sdk/linux/native/llvm/bin/clang -- works
   ...
   删除大量 cmake 日志
   ...
   ENABLE_PUBLIC_SYMBOLS:BOOL=ON
   ENABLE_SAFE_STACK:BOOL=OFF
   ENABLE_SANITIZERS:BOOL=OFF
   ENABLE_TARGET_EXPORT:BOOL=ON
   ENABLE_VALGRIND:BOOL=OFF
   owner@ubuntu:~/workspace/cJSON/build$ ls                                                     # 执行完cmake成功后在当前目录生成Makefile文件
   cJSONConfig.cmake  cJSONConfigVersion.cmake  CMakeCache.txt  CMakeFiles  cmake_install.cmake  CTestTestfile.cmake  fuzzing  libcjson.pc  Makefile  tests
   ```

   **注意这里执行的 cmake 必须是 SDK 内的 cmake，不是你自己系统上原有的 cmake 。否则会不识别参数OHOS_ARCH。**

   参数说明：
   1) CMAKE_TOOLCHAIN_FILE: 交叉编译置文件路径，必须设置成工具链中的配置文件。
   2) CMAKE_INSTALL_PREFIX: 配置安装三方库路径。
   3) OHOS_ARCH: 配置交叉编译的CPU架构，一般为arm64-v8a(编译64位的三方库)、armeabi-v7a(编译32位的三方库)，本示例中我们设置编译64位的cJSON库。
   4) -L: 显示cmake中可配置项目

3. 执行编译

   cmake执行成功后，在build目录下生成了Makefile，我们就可以直接执行make对cJSON进行编译了：

   ```shell
   owner@ubuntu:~/workspace/cJSON/build$ make                  # 执行make命令进行编译
   Scanning dependencies of target cjson
   [  2%] Building C object CMakeFiles/cjson.dir/cJSON.c.o
   clang: warning: argument unused during compilation: '--gcc-toolchain=//home/owner/workspace/ohos-sdk/linux/native/llvm' [-Wunused-command-line-argument]
   /home/owner/workspace/cJSON/cJSON.c:561:9: warning: 'long long' is an extension when C99 mode is not enabled [-Wlong-long]
   ...
   删除大量 make 日志
   ...
   clang: warning: argument unused during compilation: '--gcc-toolchain=//home/owner/workspace/ohos-sdk/linux/native/llvm' [-Wunused-command-line-argument]
   [ 97%] Building C object fuzzing/CMakeFiles/fuzz_main.dir/cjson_read_fuzzer.c.o
   clang: warning: argument unused during compilation: '--gcc-toolchain=//home/owner/workspace/ohos-sdk/linux/native/llvm' [-Wunused-command-line-argument]
   [100%] Linking C executable fuzz_main
   [100%] Built target fuzz_main
   owner@ubuntu:~/workspace/cJSON/build$
   ```

4. 查看编译后文件属性

   编译成功后我们可以通过file命令查看文件的属性，以此判断交叉编译是否成功，如下信息显示libcjson.so为aarch64架构文件，即交叉编译成功：

   ```shell
   owner@ubuntu:~/workspace/cJSON/build$ file libcjson.so.1.7.15     # 查看文件属性命令
   libcjson.so.1.7.15: ELF 64-bit LSB shared object, ARM aarch64, version 1 (SYSV), dynamically linked, BuildID[sha1]=c0aaff0b401feef924f074a6cb7d19b5958f74f5, with debug_info, not stripped
   ```

5. 执行安装命令

   编译成功后，我们可以执行make install将编译好的二进制文件以及头文件安装到cmake配置的安装路径下：

   ```shell
   owner@ubuntu:~/workspace/cJSON/build$ make install                # 执行安装命令
   [  4%] Built target cjson
   [  8%] Built target cJSON_test
   ...
   删除大量make install信息
   ...
   -- Installing: /home/owner/workspace/usr/cJSON/lib/cmake/cJSON/cJSONConfig.cmake
   -- Installing: /home/owner/workspace/usr/cJSON/lib/cmake/cJSON/cJSONConfigVersion.cmake
   owner@ubuntu:~/workspace/cJSON/build$
   owner@ubuntu:~/workspace/cJSON/build$ ls /home/owner/workspace/usr/cJSON                  # 查看安装文件
   include  lib
   owner@ubuntu:~/workspace/cJSON/build$ ls /home/owner/workspace/usr/cJSON/lib/
   cmake  libcjson.so  libcjson.so.1  libcjson.so.1.7.15  pkgconfig
   ```

## 测试

交叉编译完后，需要对三方库进行测试验证。为了保证三方库功能的完整性，我们基于原生库的测试用例进行测试验证。为此，我们集成了一套可以在OH环境上进行make、cmake、 ctest等操作的工具，具体请阅读[OH测试环境配置](../lycium/CItools/README_zh.md)文档。cJson使用的是ctest方式进行测试的，具体步骤如下：

1. 测试环境配置

   请参考[OH测试环境配置](../lycium/CItools/README_zh.md)。

2. 准备测试资源

   使用原生库的测试用例进行测试，为了保证测试时不进行编译操作，需要把整个编译的源码作为测试资源包推送到开发板,且需要保证三方库在开发板的路径与编译时路径一致：

   ```shell
   owner@ubuntu:~/workspace$ tar -zcf cJSON.tar.gz cJSON/
   ```

   打包完资源后需要将资源通过[hdc_std](https://gitee.com/openharmony/docs/blob/master/zh-cn/device-dev/subsystems/subsys-toolchain-hdc-guide.md#%E7%8E%AF%E5%A2%83%E5%87%86%E5%A4%87)工具将资源包推送到开发板：

   ```shell
   hdc_std file send X:\workspace\cJSON.tar.gz /data/    # 推送资源到开发板
   hdc_std shell                                         # 进入开发板系统
   # mkdir -p /home/owner/                               # 设置与编译时同样的路径
   # cd /home/owner/
   # ln -s workspace /data/                              # 系统根目录空间有限，建议通过软链接配置路径
   # cd workspace
   # tar -zxf cJSON.tar.gz                               # 解压测试资源
   ```

3. 执行测试

   进入到cJSON的编译目录build，执行ctest测试命令进行测试：

   ```shell
   # cd /home/owner/workspace/cJSON/build
   # ctest                                                                    # 执行ctest测试命令，以下为测试信息
   Test project /home/owner/workspace/cJSON/build
        Start  1: cJSON_test
    1/19 Test  #1: cJSON_test .......................   Passed    0.02 sec
        Start  2: parse_examples
    2/19 Test  #2: parse_examples ...................   Passed    0.02 sec
        Start  3: parse_number
    3/19 Test  #3: parse_number .....................   Passed    0.02 sec
        Start  4: parse_hex4
    4/19 Test  #4: parse_hex4 .......................   Passed    0.10 sec
        Start  5: parse_string
    5/19 Test  #5: parse_string .....................   Passed    0.01 sec
        Start  6: parse_array
    6/19 Test  #6: parse_array ......................   Passed    0.01 sec
        Start  7: parse_object
    7/19 Test  #7: parse_object .....................   Passed    0.01 sec
        Start  8: parse_value
    8/19 Test  #8: parse_value ......................   Passed    0.01 sec
        Start  9: print_string
    9/19 Test  #9: print_string .....................   Passed    0.01 sec
        Start 10: print_number
   10/19 Test #10: print_number .....................   Passed    0.01 sec
        Start 11: print_array
   11/19 Test #11: print_array ......................   Passed    0.01 sec
        Start 12: print_object
   12/19 Test #12: print_object .....................   Passed    0.01 sec
        Start 13: print_value
   13/19 Test #13: print_value ......................   Passed    0.01 sec
        Start 14: misc_tests
   14/19 Test #14: misc_tests .......................   Passed    0.01 sec
        Start 15: parse_with_opts
   15/19 Test #15: parse_with_opts ..................   Passed    0.01 sec
        Start 16: compare_tests
   16/19 Test #16: compare_tests ....................   Passed    0.01 sec
        Start 17: cjson_add
   17/19 Test #17: cjson_add ........................   Passed    0.01 sec
        Start 18: readme_examples
   18/19 Test #18: readme_examples ..................   Passed    0.01 sec
        Start 19: minify_tests
   19/19 Test #19: minify_tests .....................   Passed    0.01 sec
  
   100% tests passed, 0 tests failed out of 19
  
   Total Test time (real) =   0.37 sec
   ```

   由以上测试结果可以看出，所有测试用例通过！
