# Windows上使用OpenHarmony SDK交叉编译指导

OpenHarmony SDK提供了windwos下的cmake以及ninja工具，故我们可以在windows上通过OpenHarmony SDK交叉编译cmake构建的c/c++三方库。<br>
**此方法针对一些编译时依赖类unix系统命令的三方库不适用!**

本文以cJSON三方库为例介绍如何通过OpenHarmony的SDK在Windows平台进行交叉编译。

## 环境准备

### SDK准备

我们可以通过 openHarmony SDK [官方发布渠道](https://gitee.com/openharmony-sig/oh-inner-release-management/blob/master/Release-Testing-Version.md)下载对应版本的SDK，也可以通过IDE进行下载对应的SDK。

1. 官方渠道获取SDK方法：

   [get windows sdk](media/windwos_SDK.png)

2. IDE获取SDK方法:

  [ide sdk](media/ide_sdk.png)

本文将采取IDE下的SDK为例来说明使用方法

### cJSON源码准备

适配三方库如果没有指定版本，我们一般取三方库最新版本，不建议使用master的代码，这里我们下载cJSON v1.7.17 版本的源码：

[download cjson](media/download_cjson.png)

## 编译&安装

1. 预编译
  
  通过IDE的Terminal终端进入到cJSON目录

  [cjson dir](media/command_line.png)

  执行以下命令：

  ```shell
  D:\OpenHarmony\SDK\10\native\build-tools\cmake\bin\cmake -G Ninja -B out -DCMAKE_TOOLCHAIN_FILE=D:\OpenHarmony\SDK\10\native\build\cmake\ohos.toolchain.cmake -DCMAKE_MAKE_PROGRAM=D:\OpenHarmony\SDK\10\native\build-tools\cmake\bin\ninja.exe -DCMAKE_BUILD_WITH_INSTALL_RPATH=true
  ```
  
  [prebuild cjson](media/pre_cmake.png)

  - `D:\OpenHarmony\SDK\10\`为SDK路径，用户需要根据自己SDK目录进行配置(**注意：此处路径必须是绝对路径！**)；
  - `-G Ninja` 配置cmake使用ninja编译；
  - `-B out` 在源码目录用 -B 直接创建 out 目录并生成 out/Makefile；
  - `-DCMAKE_TOOLCHAIN_FILE` 配置交叉编译的toolchain文件；
  - `-DCMAKE_MAKE_PROGRAM` 配置编译命令为ninja
  - `-DCMAKE_BUILD_WITH_INSTALL_RPATH=true` 解决预编译时的错误"cjson目标的安装需要从构建中更改RPATH树，但Ninja生成器不支持这一点"的问题
  - `-DOHOS_ARCH=arm64-v8a` 配置交叉编译架构为arm64（默认编译的是arm64），如需要编译32位的需配置：`-DOHOS_ARCH=armeabi-v7a`。

2. 编译

  cmake预编译完后执行cmake --build进行编译：

   ```shell
   D:\OpenHarmony\SDK\10\native\build-tools\cmake\bin\cmake --build out
   ```

  &nbsp;[build cjson](media/cmake_build.png)

3. 编译结果

  &nbsp;[build result](media/cjson_result.png)

## 测试

交叉编译完后，需要对三方库进行测试验证。为了保证三方库功能的完整性，我们基于原生库的测试用例进行测试验证。为此，我们集成了一套可以在OH环境上进行make、cmake、 ctest等操作的工具，具体请阅读[OH测试环境配置](../lycium/CItools/README_zh.md)文档。cJSON使用的是ctest方式进行测试的，具体步骤如下：

1. 测试环境配置

   请参考[OH测试环境配置](../lycium/CItools/README_zh.md)。

2. 准备测试资源

   使用原生库的测试用例进行测试，为了保证测试时不进行编译操作，需要把整个编译的源码作为测试资源包推送到开发板：

   ```shell
   tar -zcvf cJSON-1.7.17.tar.gz cJSON-1.7.17/    # OH系统不支持zip解压，因此需要将测试包压缩成gz格式
   ```

   打包完资源后需要将资源通过[hdc](https://gitee.com/openharmony/docs/blob/master/zh-cn/device-dev/subsystems/subsys-toolchain-hdc-guide.md#hdc%E4%BD%BF%E7%94%A8%E6%8C%87%E5%AF%BC)工具将资源包推送到开发板：

   ```shell
   hdc file send cJSON-1.7.17.tar.gz /data/                                 # 推送资源到开发板,保证设备已链接到编译机
   hdc shell                                                                # 进入开发板系统
   # mkdir -p /data/thirdparty                                              # 设置与编译时同样的路径
   # cd /data
   # mv cJSON-1.7.17.tar.gz thirdparty
   # cd thirdparty
   # tar -zxf cJSON.tar.gz                                                  # 解压测试资源
   # cd cJSON-1.7.17/out                                                    # 进入到编译目录
   # mkdir D:                                                               # 为了保持和原生库路径一致，需在编译目录创建windwos上的磁盘目录，并在其中创建一个软链接
   # cd D\:
   # ln -s /data/thirdparty thirdparty
   ```

3. 执行测试

   进入到cJSON的输出目录out，执行ctest测试命令进行测试：

   ```shell
   # cd /data/thirdparty/cJSON-1.7.17/out/
   # export LD_LIBRARY_PATH=/data/thirdparty/cJSON-1.7.17/out/              # 配置链接库环境变量
   # ctest                                                                  # 执行ctest测试命令，以下为测试信息
   
   &nbsp[cjson test](./media/cjson_test_result.png)

   由以上测试结果可以看出，所有测试用例通过！
