# MacOS上使用OpenHarmony SDK交叉编译指导

本文以cJSON三方库为例介绍如何通过OpenHarmony的SDK在Mac平台进行交叉编译。

## 环境准备

### SDK准备

我们可以通过 openHarmony SDK [官方发布渠道](https://gitee.com/openharmony-sig/oh-inner-release-management/blob/master/Release-Testing-Version.md)下载对应mac版本的SDK，当前OpenHarmony MAC版本的SDK有2种，一种是x86架构，另一种是arm64，我们需要根据自身设备的架构信息选择对应的版本，本示例中使用的MAC设备是m系列芯片，其架构是arm64的，因此我们选择arm64架构的SDK。

```shell
cd ~                        # 进入到用户目录
curl -L http://download.ci.openharmony.cn/version/Master_Version/OpenHarmony_4.0.10.5/20230824113825/20230824113825-L2-SDK-MAC-M1-FULL.tar.gz --output ohos-sdk.tar.gz # 通过curl命令下载工具链
```

下载完SDK后对其进行解压

```shell
tar -zxvf ohos-sdk.tar.gz                           # 解压ohos sdk
cd sdk/packages/ohos-sdk/darwin/                    # 进入到darwin目录
unzip native-darwin-arm64-4.0.10.5-Release.zip      # 因为 c/c++ 库的编译只涉及到 native 工具，因此我们只需要解压native工具即可。
```

### cmake工具准备

cJSON是通过cmake构建方式进行编译的，所以在编译前我们需要确保编译机上cmake能正常使用。

原则上我们需要使用SDK提供的cmake进行编译，但当前SDK中的cmake是X86架构，在arm架构的编译机上无法使用，因此我们需要在编译机上安装系统的cmake命令：

```shell
brew install cmake          # 通过brew包管理工具安装cmake工具
```

由于cmake官方是不支持OHOS的，在编译过程中因为无法识别OHOS而导致编译错误，因此我们需要在系统cmake中添加OHOS的配置,方法如下：

```shell
cp sdk/packages/ohos-sdk/darwin/native/build-tools/cmake/share/cmake-3.16/Modules/Platform/OHOS.cmake /opt/homebrew/Cellar/cmake/3.28.0/share/cmake/Modules/Platform/
```

### cJSON源码准备

适配三方库如果没有指定版本，我们一般取三方库最新版本，不建议使用master的代码，这里我们下载cJSON v1.7.15 版本的源码：

```shell
cd ~/Workspace
git clone https://github.com/DaveGamble/cJSON.git -b v1.7.15       # 通过git下载指定版本的源码
```

## 编译&安装

1. 新建编译目录

   为了不污染源码目录文件，我们推荐在三方库源码目录新建一个编译目录，用于生成需要编译的配置文件，本用例中我们在cJSON目录下新建一个build目录：

   ```shell
   cd sJSON                             # 进入cJSON目录
   mkdir build && cd build              # 创建编译目录并进入到编译目录
   ```

2. 配置交叉编译参数，生成Makefile

   ```shell
   cmake -DCMAKE_TOOLCHAIN_FILE=/Users/ohos/sdk/packages/ohos-sdk/darwin/native/build/cmake/ohos.toolchain.cmake -DCMAKE_INSTALL_PREFIX=/Users/ohos/Workspace/usr/cJSON -DOHOS_ARCH=arm64-v8a .. -L             # 执行cmake命令
   ```

   参数说明：
   1) CMAKE_TOOLCHAIN_FILE: 交叉编译置文件路径，必须设置成工具链中的配置文件。
   2) CMAKE_INSTALL_PREFIX: 配置安装三方库路径。
   3) OHOS_ARCH: 配置交叉编译的CPU架构，一般为arm64-v8a(编译64位的三方库)、armeabi-v7a(编译32位的三方库)，本示例中我们设置编译64位的cJSON库。
   4) -L: 显示cmake中可配置项目

3. 执行编译

   cmake执行成功后，在build目录下生成了Makefile，我们就可以直接执行make对cJSON进行编译了：

   ```shell
   make                  # 执行make命令进行编译
   Scanning dependencies of target cjson
   [  2%] Building C object CMakeFiles/cjson.dir/cJSON.c.o
   clang: warning: argument unused during compilation: '--gcc-toolchain=/Users/ohos/sdk/packages/ohos-sdk/darwin/native/llvm' [-Wunused-command-line-argument]
   /home/owner/workspace/cJSON/cJSON.c:561:9: warning: 'long long' is an extension when C99 mode is not enabled [-Wlong-long]
   ...
   删除大量 make 日志
   ...
   clang: warning: argument unused during compilation: '--gcc-toolchain=/Users/ohos/sdk/packages/ohos-sdk/darwin/native/llvm' [-Wunused-command-line-argument]
   [ 97%] Building C object fuzzing/CMakeFiles/fuzz_main.dir/cjson_read_fuzzer.c.o
   clang: warning: argument unused during compilation: '--gcc-toolchain=/Users/ohos/sdk/packages/ohos-sdk/darwin/native/llvm' [-Wunused-command-line-argument]
   [100%] Linking C executable fuzz_main
   [100%] Built target fuzz_main
   ```

4. 查看编译后文件属性

   编译成功后我们可以通过file命令查看文件的属性，以此判断交叉编译是否成功，如下信息显示libcjson.so为aarch64架构文件，即交叉编译成功：

   ```shell
   file libcjson.so.1.7.15     # 查看文件属性命令
   libcjson.so.1.7.15: ELF 64-bit LSB shared object, ARM aarch64, version 1 (SYSV), dynamically linked, BuildID[sha1]=c0aaff0b401feef924f074a6cb7d19b5958f74f5, with debug_info, not stripped
   ```

5. 执行安装命令

   编译成功后，我们可以执行make install将编译好的二进制文件以及头文件安装到cmake配置的安装路径下：

   ```shell
   make install                # 执行安装命令
   [  4%] Built target cjson
   [  8%] Built target cJSON_test
   ...
   删除大量make install信息
   ...
   -- Installing: /Users/ohos/Workspace/usr/cJSON/lib/cmake/cJSON/cJSONConfig.cmake
   -- Installing: /Users/ohos/Workspace/usr/cJSON/lib/cmake/cJSON/cJSONConfigVersion.cmake

   ls /Users/ohos/Workspace/usr/cJSON                  # 查看安装文件
   include  lib
   ls /Users/ohos/Workspace/usr/cJSON/lib/
   cmake  libcjson.so  libcjson.so.1  libcjson.so.1.7.15  pkgconfig
   ```

## 测试

交叉编译完后，需要对三方库进行测试验证。为了保证三方库功能的完整性，我们基于原生库的测试用例进行测试验证。为此，我们集成了一套可以在OH环境上进行make、cmake、 ctest等操作的工具，具体请阅读[OH测试环境配置](../lycium/CItools/README_zh.md)文档。cJSON使用的是ctest方式进行测试的，具体步骤如下：

1. 测试环境配置

   请参考[OH测试环境配置](../lycium/CItools/README_zh.md)。

2. 准备测试资源

   使用原生库的测试用例进行测试，为了保证测试时不进行编译操作，需要把整个编译的源码作为测试资源包推送到开发板,且需要保证三方库在开发板的路径与编译时路径一致：

   ```shell
   tar -zcvf cJSON.tar.gz cJSON/
   ```

   打包完资源后需要将资源通过[hdc](https://gitee.com/openharmony/docs/blob/master/zh-cn/device-dev/subsystems/subsys-toolchain-hdc-guide.md#hdc%E4%BD%BF%E7%94%A8%E6%8C%87%E5%AF%BC)工具将资源包推送到开发板：

   ```shell
   cd /Users/ohos/sdk/packages/ohos-sdk/darwin
   unzip toolchains-darwin-arm64-4.0.10.5-Release.zip                       # 解压toolchain，hdc工具在toolchain包中
   export PATH=/Users/ohos/sdk/packages/ohos-sdk/darwin/toolchains:$PATH    # 将hdc命令加载到环境变量中
   cd ~/Workspace                                                           # 进入到资源所在目录
   hdc file send cJSON.tar.gz /data/                                        # 推送资源到开发板,保证设备已链接到编译机
   hdc shell                                                                # 进入开发板系统
   # mkdir -p /Users/ohos                                                   # 设置与编译时同样的路径
   # cd /Users/ohos
   # ln -s Workspace /data/                                                 # 系统根目录空间有限，建议通过软链接配置路径
   # cd Workspace
   # tar -zxf cJSON.tar.gz                                                  # 解压测试资源
   ```

3. 执行测试

   进入到cJSON的编译目录build，执行ctest测试命令进行测试：

   ```shell
   # cd /Users/ohos/Workspace/cJSON/build
   # ctest                                                                    # 执行ctest测试命令，以下为测试信息
   Test project /Users/ohos/Workspace/cJSON/build
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
