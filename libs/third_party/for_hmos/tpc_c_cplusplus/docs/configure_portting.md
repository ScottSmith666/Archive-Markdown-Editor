# configure 交叉编译

## 简介

configure 是一个由 GNU Autoconf 提供的脚本用于自动生成 Makefile。Autoconf 是一个用于创建可移植的源代码包的工具，它可以检测系统的特性和能力并生成适合当前系统的配置文件。 <br>
在使用 configure 进行编译时，首先运行 configure 脚本，它会根据当前系统的特性和用户指定的选项生成一个或多个 Makefile。这些 Makefile 包含了编译该软件所需的详细规则和指令。 <br>
本文通过jpeg库来展示如何将一个configure构建方式的三方库在linux环境上通过`OpenHarmony SDK`进行交叉编译。

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

   ```shell
   owner@ubuntu:~/workspace$ wget http://www.ijg.org/files/jpegsrc.v9e.tar.gz       ## 下载指定版本的源码包
   ```

2. 解压源码包

   ```shell
   owner@ubuntu:~/workspace$ tar -zxvf jpegsrc.v9e.tar.gz                           ## 解压源码包
   ```

## 编译 & 安装

1. 查看configure配置

   进入到jpeg目录执行configure配置，如若对configure配置项不熟悉，我们可以通过运行`configure --help`查看：

   ```shell
   owner@ubuntu:~/workspace/jpeg-9e$ ./configure --help
   `configure` configures libjpeg 9.5.0 to adapt to many kinds of systems.
   Usage: ./configure [OPTION]... [VAR=VALUE]...
   ...
   # 去除大量不必要信息
   ...
   # 配置安装选项
   Installation directories:
     --prefix=PREFIX         install architecture-independent files in PREFIX
                          [/usr/local]
   ...
   # 去除大量不必要信息
   ...
   # 配置编译的主机选项(--host)，默认配置为linux
   System types:
   --build=BUILD     configure for building on BUILD [guessed]
   --host=HOST       cross-compile to build programs to run on HOST [BUILD]
   --target=TARGET   configure for building compilers for TARGET [HOST]
   # cJSON库配置可选项
   Optional Features:
   --disable-option-checking  ignore unrecognized --enable/--with options
   --disable-FEATURE       do not include FEATURE (same as --enable-FEATURE=no)
   --enable-FEATURE[=ARG]  include FEATURE [ARG=yes]
   --enable-silent-rules   less verbose build output (undo: "make V=1")
   --disable-silent-rules  verbose build output (undo: "make V=0")
   --enable-maintainer-mode
                          enable make rules and dependencies not useful (and
                          sometimes confusing) to the casual installer
   --enable-dependency-tracking
                          do not reject slow dependency extractors
   --disable-dependency-tracking
                          speeds up one-time build
   --enable-ld-version-script
                          enable linker version script (default is enabled
                          when possible)
   --enable-shared[=PKGS]  build shared libraries [default=yes]
   --enable-static[=PKGS]  build static libraries [default=yes]
   --enable-fast-install[=PKGS]
                          optimize for fast installation [default=yes]
   --disable-libtool-lock  avoid locking (might break parallel builds)
   --enable-maxmem=N     enable use of temp files, set max mem usage to N MB
   ...
   # 去除大量不必要信息
   ...
   # 配置编译命令(默认使用linux gcc相关配置)
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
   
   Use these variables to override the choices made by `configure` or to help
   it to find libraries and programs with nonstandard names/locations.
   Report bugs to the package provider.
   ```

   由configure的帮助信息我们可以知道，jpeg交叉编译需要配置主机(编译完后需要运行的系统机器), 需要配置交叉编译命令以以及配置安装路径等选项。

2. 配置交叉编译命令,在命令行输入以下命令：

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

3. 执行configure命令

   安装路劲以及host配置可以在configure时执行，此处以配置arm64位为例，如若需要配置32位，将`aarch64-arm`替换成`arm-linux`即可。

   ```shell
   owner@ubuntu:~/workspace/jpeg-9e$ ./configure --prefix=/home/owner/workspace/usr/jpeg --host=aarch64-linux       # 执行configure命令配置交叉编译信息
   checking build system type... x86_64-pc-linux-gnu
   checking host system type... x86_64-pc-linux-gnu
   checking target system type... x86_64-pc-linux-gnu
   ...
   # 删除大量configure信息
   ...
   configure: creating ./config.status
   config.status: creating Makefile
   config.status: creating libjpeg.pc
   config.status: creating jconfig.h
   config.status: executing depfiles commands
   config.status: executing libtool commands
   ```

   执行完confiure没有提示任何错误，即说明confiure配置成功，在当前目录会生成Makefile文件。

4. 执行make编译命令

   configure执行成功后，在当前目录会生成Makefile文件，直接运行make即可进行交叉编译：

   ```shell
   owner@ubuntu:~/workspace/jpeg-9e$ make                       # 执行make编译命令
   make  all-am
   make[1]: Entering directory '/home/owner/workspace/jpeg-9e'
     CC       cjpeg.o
     CC       rdppm.o
     ...
     # 删除大量make信息
     ...
     CC       rdcolmap.o
     CCLD     djpeg
     CC       jpegtran.o
     CC       transupp.o
     CCLD     jpegtran
     CC       rdjpgcom.o
     CCLD     rdjpgcom
     CC       wrjpgcom.o
     CCLD     wrjpgcom
   make[1]: Leaving directory '/home/owner/workspace/jpeg-9e'
   ```

5. 执行安装命令

   ```shell
   owner@ubuntu:~/workspace/jpeg-9e$ make install
   ```

6. 执行完后对应的文件安装到prefix配置的路径`/home/owner/workspace/usr/jpeg`, 查看对应文件属性：

   ```shell
   owner@ubuntu:~/workspace/jpeg-9e$ cd /home/owner/workspace/usr/jpeg
   owner@ubuntu:~/workspace/usr/jpeg$ ls
   bin  include  lib  share
   owner@ubuntu:~/workspace/usr/jpeg$ ls lib
   libjpeg.a  libjpeg.la  libjpeg.so  libjpeg.so.9  libjpeg.so.9.5.0  pkgconfig
   owner@ubuntu:~/workspace/usr/jpeg$ ls include/
   jconfig.h  jerror.h  jmorecfg.h  jpeglib.h
   owner@ubuntu:~/workspace/usr/jpeg$ file lib/libjpeg.so.9.5.0
   lib/libjpeg.so.9.5.0: ELF 64-bit LSB shared object, ARM aarch64, version 1 (SYSV), dynamically linked, with debug_info, not stripped
   ```

## 测试

交叉编译完后，该测试验证我们的三方库。为了保证原生库功能完整，我们基于原生库的测试用例进行测试验证。为此，我们需要集成了一套可以在OH环境上进行cmake, ctest等操作的环境，具体请阅读 [lycium CItools](https://gitee.com/openharmony-sig/tpc_c_cplusplus/blob/master/lycium/CItools/README_zh.md)。

1. 测试环境配置，请参考 [lycium CItools](https://gitee.com/openharmony-sig/tpc_c_cplusplus/blob/master/lycium/CItools/README_zh.md)。

2. 打包测试资源

   使用原生库的测试用例进行测试，我们为了保证测试时不进行编译操作，我们需要把整个编译的源码作为测试资源包推送到开发板,且需要保证三方库在开发板的路径与编译时路径一致：

   ```shell
   owner@ubuntu:~/workspace$ tar -zcf jpeg-9e.tar.gz jpeg-9e/
   ```

3. 将测试资源推送到开发板 ,打开命令行工具，执行[hdc_std](https://gitee.com/openharmony/docs/blob/master/zh-cn/device-dev/subsystems/subsys-toolchain-hdc-guide.md#%E7%8E%AF%E5%A2%83%E5%87%86%E5%A4%87)命令进行文件传输：

  ```shell
  hdc_std file send X:\workspace\jpeg-9e.tar.gz /data/    ## 推送资源到开发板
  hdc_std shell                                           ## 进入开发板系统
  # mkdir -p /home/owner/                                 ## 设置与编译时同样的路径
  # cd /home/owner/
  # ln -s workspace /data/                                ## 系统根目录空间有限，建议通过软链接配置路径
  # cd workspace
  # tar -zxf jpeg-9e.tar.gz                               ## 解压测试资源
  ```

4. 执行测试

  进入到三方库编译路径,执行`make check-local`进行测试：

  ```shell
  # cd /home/owner/workspace/jpeg-9e
  #  make check-local                                                                       # 执行测试命令，以下为测试用例信息
  rm -f testout*
  ./djpeg -dct int -ppm -outfile testout.ppm ./testorig.jpg
  ./djpeg -dct int -gif -outfile testout.gif ./testorig.jpg
  ./djpeg -dct int -bmp -colors 256 -outfile testout.bmp ./testorig.jpg
  ./cjpeg -dct int -outfile testout.jpg ./testimg.ppm
  ./djpeg -dct int -ppm -outfile testoutp.ppm ./testprog.jpg
  ./cjpeg -dct int -progressive -opt -outfile testoutp.jpg ./testimg.ppm
  ./jpegtran -outfile testoutt.jpg ./testprog.jpg
  cmp ./testimg.ppm testout.ppm
  cmp ./testimg.gif testout.gif
  cmp ./testimg.bmp testout.bmp
  cmp ./testimg.jpg testout.jpg
  cmp ./testimg.ppm testoutp.ppm
  cmp ./testimgp.jpg testoutp.jpg
  cmp ./testorig.jpg testoutt.jpg
  ```

当测试结果中未出现任何错误提示，则表示当前测试成功。至此，jpeg三方库使用OpenHarmony SDK交叉编译成功。
