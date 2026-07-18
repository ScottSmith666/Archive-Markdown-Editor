# make 交叉编译

## 简介

make 是一个标准的 Unix 构建工具，用于自动化编译过程。它读取 Makefile 中的规则和依赖项并根据这些规则来构建源代码。make 会检查源代码文件的时间戳，以确定哪些文件需要重新编译。它会自动解决依赖关系并按正确的顺序编译源文件。通过在终端中运行 make 命令，make 将根据 Makefile 中的指令逐步构建代码，生成最终的可执行程序或库文件。

直接通过make方式构建的三方库，其原库的Makefie文件已固定，因此如果需要交叉编译此类三方库，需要先分析原库的Makefile文件，查看其编译工具的具体配置方式。

本文通过bzip2三方库来分享如何通过OpenHarmony SDK在linux环境来交叉编译make构建方式的三方库。

## 编译前准备

### OHOS SDK准备

1. 从 openHarmony SDK [官方发布渠道](https://gitee.com/openharmony-sig/oh-inner-release-management/blob/master/Release-Testing-Version.md) 下载SDK

2. 解压SDK

   ```shell
   owner@ubuntu:~/workspace$ tar -zxvf version-Master_Version-OpenHarmony_3.2.10.3-20230105_163913-ohos-sdk-full.tar.gz
   ```

3. 进入到sdk的linux目录，解压工具(C/C++三方库主要使用到native工具)

   ```shell
   owner@ubuntu:~/workspace$ cd ohos_sdk/linux
   owner@ubuntu:~/workspace/ohos-sdk/linux$ for i in *.zip;do unzip ${i};done
   owner@ubuntu:~/workspace/ohos-sdk/linux$ ls
   ets                                native                                   toolchains
   ets-linux-x64-4.0.1.2-Canary1.zip  native-linux-x64-4.0.1.2-Canary1.zip     toolchains-linux-x64-4.0.1.2-Canary1.zip
   js                                 previewer
   js-linux-x64-4.0.1.2-Canary1.zip   previewer-linux-x64-4.0.1.2-Canary1.zip
   ```

### 三方库源码准备

1. 下载三方库代码：

   下载bzip2 v1.0.6版本的源码包

   ```shell
   owner@ubuntu:~/workspace$ wget https://sourceforge.net/projects/bzip2/files/bzip2-1.0.6.tar.gz      ## 下载指定版本的源码包
   ```

2. 解压源码包

   ```shell
   owner@ubuntu:~/workspace$ tar -zxf bzip2-1.0.6.tar.gz                     ## 解压源码包
   owner@ubuntu:~/workspace$
   owner@ubuntu:~/workspace$ cd bzip2-1.0.6/                                # 进入到bzip2源码目录
   owner@ubuntu:~/workspace/bzip2-1.0.6$
   ```

## 编译&安装

1. 分析Makefile文件

   通过分析原库的Makefile文件可知其以下几个内容需要进行重新配置

   1) 编译命令配置

   ```shell
   # To assist in cross-compiling
   CC=gcc
   AR=ar
   RANLIB=ranlib
   LDFLAGS=
   ```

   默认配置linux下gcc的编译命令，编译时我们需要配置成OpenHarmony交叉编译命令即可。

   2) 安装路径配置

    ```shell
    # Where you want it installed when you do 'make install'
    PREFIX=/usr/local
    ```

    默认配置的安装目录为系统的/usr/local/下，如果需要执行安装的话，需配置成用户目录下。

2. 配置交叉编译命令，执行交叉编译

   分析完Makefile后即可配置交叉编译命令进行编译

   ```shell
   owner@ubuntu:~/workspace/bzip2-1.0.6$ make CC="/home/owner/workspace/ohos-sdk/linux/native/llvm/bin/clang --target=aarch64-linux-ohos" AR=/home/owner/workspace/ohos-sdk/linux/native/llvm/bin/llvm-ar RANDLIB=/home/owner/workspace/ohos-sdk/linux/native/llvm/bin/llvm-ranlib -j4 libbz2.a bzip2 bzip2recover
   /home/owner/workspace/ohos-sdk/linux/native/llvm/bin/clang --target=aarch64-linux-ohos -Wall -Winline -O2 -g -D_FILE_OFFSET_BITS=64 -c huffman.c
   /home/owner/workspace/ohos-sdk/linux/native/llvm/bin/clang --target=aarch64-linux-ohos -Wall -Winline -O2 -g -D_FILE_OFFSET_BITS=64 -c crctable.c
   ...
   删除大量make信息
   ...
   /home/owner/workspace/ohos-sdk/linux/native/llvm/bin/llvm-ar cq libbz2.a blocksort.o huffman.o crctable.o randtable.o compress.o decompress.o bzlib.o
   ranlib libbz2.a
   1 warning generated.
   /home/owner/workspace/ohos-sdk/linux/native/llvm/bin/clang --target=aarch64-linux-ohos -Wall -Winline -O2 -g -D_FILE_OFFSET_BITS=64  -o bzip2 bzip2.o -L. -lbz2
   owner@ubuntu:~/workspace/bzip2-1.0.6$ 
   ```

   **特别说明：CC配置除了配置交叉编译的clang外，还需要配置target的架构，即配置成aarch64位，按此配置编译出来的文件才能在64位设备上运行，如若需要编译32位的文件，则target配置成arm-linux-ohos即可**

3. 查看编译成功后的文件

   ```shell
   owner@ubuntu:~/workspace/bzip2-1.0.6$ file bzip2             # 使用file查看生成的文件属性
   bzip2: ELF 64-bit LSB shared object, ARM aarch64, version 1 (SYSV), dynamically linked, interpreter /lib/ld-musl-aarch64.so.1, with debug_info, not stripped
   owner@ubuntu:~/workspace/bzip2-1.0.6$
   ```

   编译时配置了`aarch64-linux-ohos`，故生成的文件属性为`ARM aarch64`，交叉编译成功。

4. 执行安装

   通过之前分析Makefile知道，在安装时需要配置`PREFIX`这个安装路径的变量：

   ```shell
   owner@ubuntu:~/workspace/bzip2-1.0.6$ make install PREFIX=/home/owner/workspace/usr/bzip2/       # 执行make install安装
   owner@ubuntu:~/workspace/bzip2-1.0.6$
   owner@ubuntu:~/workspace/bzip2-1.0.6$ ls /home/owner/workspace/usr/bzip2/                        # 查看安装文件
   bin  include  lib  man
   owner@ubuntu:~/workspace/bzip2-1.0.6$
   ```

## 测试

交叉编译完后，该测试验证我们的三方库。为了保证原生库功能完整，我们基于原生库的测试用例进行测试验证。为此，我们需要集成了一套可以在OH环境上进行cmake, ctest等操作的环境，具体请阅读 [lycium CItools](https://gitee.com/openharmony-sig/tpc_c_cplusplus/blob/master/lycium/CItools/README_zh.md)。

1. 测试环境配置，请参考 [lycium CItools](https://gitee.com/openharmony-sig/tpc_c_cplusplus/blob/master/lycium/CItools/README_zh.md)。
2. 准备测试资源

   使用原生库的测试用例进行测试，我们为了保证测试时不进行编译操作，我们需要把整个编译的源码作为测试资源包通过[hdc工具](https://gitee.com/openharmony/docs/blob/master/zh-cn/device-dev/subsystems/subsys-toolchain-hdc-guide.md#%E7%8E%AF%E5%A2%83%E5%87%86%E5%A4%87)推送到开发板,且需要保证三方库在开发板的路径与编译时路径一致:

   ```shell
   owner@ubuntu:~/workspace$ tar -zcvf bzip2.tar.gz bzip2-1.0.6/
   hdc_std file send X:\workspace\bzip2.tar.gz /data/      ## 推送资源到开发板
   hdc_std shell                                           ## 进入开发板系统
   # mkdir -p /home/owner/                                 ## 设置与编译时同样的路径
   # cd /home/owner/
   # ln -s workspace /data/                                ## 系统根目录空间有限，建议通过软链接配置路径
   # cd workspace
   # tar -zxf bzip2.tar.gz                                 ## 解压测试资源
   ```

3. 执行测试

   ```shell
   hdc_std shell
   # cd /home/owner/worspace/bzip2-1.0.6
   # make check                                          ## 执行测试命令，以下为测试信息
   Doing 6 tests (3 compress, 3 uncompress) ...
   If there's a problem, things might stop at this point.
   
   ./bzip2 -1  < sample1.ref > sample1.rb2
   ./bzip2 -2  < sample2.ref > sample2.rb2
   ./bzip2 -3  < sample3.ref > sample3.rb2
   ./bzip2 -d  < sample1.bz2 > sample1.tst
   ./bzip2 -d  < sample2.bz2 > sample2.tst
   ./bzip2 -ds < sample3.bz2 > sample3.tst
   cmp sample1.bz2 sample1.rb2
   cmp sample2.bz2 sample2.rb2
   cmp sample3.bz2 sample3.rb2
   cmp sample1.tst sample1.ref
   cmp sample2.tst sample2.ref
   cmp sample3.tst sample3.ref
   ...

   # echo $?                                            ## 查看测试结果
   0
   ```

bzip2执行了6条测试用例，且未提示任何错误，说明此库测试成功。当不确定此库是否测试成功时，我们还可以在执行完测试命令后在命令行手动查看测试结果，通过输入 `echo $?`，如命令行输出`0`表示测试成功，`非0`代表测试失败。
