# OpenHarmony Linux 环境 SDK 使用说明(进阶--依赖库的解决方法)

​		我们在移植三方库的时候，很多库是有依赖的。面对这种情况我们应该如何处理。下面以libzip为例讲解下如何为ohos编译带依赖的库。

## 编译libzip

### 源码准备

下载最新版本的 libzip 和 xz （libzip 是可以依赖 xz 项目中的 liblzma.so 的）

```shell
#解压源码
ohos@ubuntu20:~/openHarmony/ohos_libzip$ ls
libzip-1.9.2.tar.gz  xz-5.4.1.tar.gz
ohos@ubuntu20:~/openHarmony/ohos_libzip$
ohos@ubuntu20:~/openHarmony/ohos_libzip$ tar -zxf xz-5.4.1.tar.gz
ohos@ubuntu20:~/openHarmony/ohos_libzip$ tar -zxf libzip-1.9.2.tar.gz
ohos@ubuntu20:~/openHarmony/ohos_libzip$ ls
libzip-1.9.2  libzip-1.9.2.tar.gz  xz-5.4.1  xz-5.4.1.tar.gz
ohos@ubuntu20:~/openHarmony/ohos_libzip$
```

### 编译libzip

```
ohos@ubuntu20:~/openHarmony/ohos_libzip$
ohos@ubuntu20:~/openHarmony/ohos_libzip$ export OHOS_SDK=/home/ohos/tools/OH_SDK/ohos-sdk/linux
ohos@ubuntu20:~/openHarmony/ohos_libzip$ cd libzip-1.9.2/
ohos@ubuntu20:~/openHarmony/ohos_libzip/libzip-1.9.2$ ls
android         AUTHORS       cmake-config.h.in   examples    libzip-config.cmake.in  man        regress      THANKS
API-CHANGES.md  cmake         CMakeLists.txt      INSTALL.md  libzip.pc.in            NEWS.md    SECURITY.md  TODO.md
appveyor.yml    cmake-compat  cmake-zipconf.h.in  lib         LICENSE                 README.md  src
ohos@ubuntu20:~/openHarmony/ohos_libzip/libzip-1.9.2$ mkdir ohos64build
ohos@ubuntu20:~/openHarmony/ohos_libzip/libzip-1.9.2$ cd ohos64build/
ohos@ubuntu20:~/openHarmony/ohos_libzip/libzip-1.9.2/ohos64build$ ${OHOS_SDK}/native/build-tools/cmake/bin/cmake -DCMAKE_TOOLCHAIN_FILE=${OHOS_SDK}/native/build/cmake/ohos.toolchain.cmake  .. -L
-- The C compiler identification is Clang 12.0.1
-- Check for working C compiler: /home/ohos/tools/OH_NDK/ohos-sdk/linux/native/llvm/bin/clang
-- Check for working C compiler: /home/ohos/tools/OH_NDK/ohos-sdk/linux/native/llvm/bin/clang -- works
-- Detecting C compiler ABI info
-- Detecting C compiler ABI info - done
-- Detecting C compile features
-- Detecting C compile features - done
-- Looking for include file CommonCrypto/CommonCrypto.h
-- Looking for include file CommonCrypto/CommonCrypto.h - not found
-- Found PkgConfig: /usr/bin/pkg-config (found version "0.29.1")
-- Could NOT find Nettle (missing: Nettle_LIBRARY Nettle_INCLUDE_DIR) (Required is at least version "3.0")
-- Could NOT find GnuTLS (missing: GNUTLS_LIBRARY GNUTLS_INCLUDE_DIR)
-- Could NOT find MbedTLS (missing: MbedTLS_LIBRARY MbedTLS_INCLUDE_DIR) (Required is at least version "1.0")
# 删除大量日志
-- Check if the system is big endian - little endian
-- Found ZLIB: /home/ohos/tools/OH_NDK/ohos-sdk/linux/native/sysroot/usr/lib/aarch64-linux-ohos/libz.so (found suitable version "1.2.12", minimum required is "1.1.2")
-- Could NOT find BZip2 (missing: BZIP2_LIBRARIES BZIP2_INCLUDE_DIR)
CMake Warning at CMakeLists.txt:186 (message):
  -- bzip2 library not found; bzip2 support disabled

# 可以发现此时是无法找到 liblzma 的，这样虽然没有报错，但是编译出来的libzip是不支持 lzma 算法的。为了使我们编译出来的libzip支持lamz算法，我们希望这里能找到liblzma.so
-- Could NOT find LibLZMA (missing: LIBLZMA_LIBRARY LIBLZMA_INCLUDE_DIR LIBLZMA_HAS_AUTO_DECODER LIBLZMA_HAS_EASY_ENCODER LIBLZMA_HAS_LZMA_PRESET) (Required is at least version "5.2")
CMake Warning at CMakeLists.txt:195 (message):
  -- lzma library not found; lzma/xz support disabled


-- Could NOT find Zstd (missing: Zstd_LIBRARY Zstd_INCLUDE_DIR) (Required is at least version "1.3.6")
CMake Warning at CMakeLists.txt:204 (message):
  -- zstd library not found; zstandard support disabled


CMake Warning at CMakeLists.txt:226 (message):
  -- neither Common Crypto, GnuTLS, mbed TLS, OpenSSL, nor Windows
  Cryptography found; AES support disabled


-- Looking for getopt
-- Looking for getopt - found
-- Found Perl: /usr/local/bin/perl (found version "5.34.1")
-- Configuring done
-- Generating done
-- Build files have been written to: /home/ohos/openHarmony/ohos_libzip/libzip-1.9.2/ohos64build
-- Cache values
BUILD_DOC:BOOL=ON
BUILD_EXAMPLES:BOOL=ON
BUILD_REGRESS:BOOL=ON
BUILD_SHARED_LIBS:BOOL=ON
BUILD_TOOLS:BOOL=ON
CMAKE_ASM_FLAGS:STRING=
CMAKE_ASM_FLAGS_DEBUG:STRING=
CMAKE_ASM_FLAGS_RELEASE:STRING=
CMAKE_BUILD_TYPE:STRING=
CMAKE_CXX_FLAGS:STRING=
CMAKE_CXX_FLAGS_DEBUG:STRING=
CMAKE_CXX_FLAGS_RELEASE:STRING=
CMAKE_INSTALL_PREFIX:PATH=/usr/local
CMAKE_TOOLCHAIN_FILE:FILEPATH=/home/ohos/tools/OH_SDK/ohos-sdk/linux/native/build/cmake/ohos.toolchain.cmake
DOCUMENTATION_FORMAT:STRING=mdoc
ENABLE_BZIP2:BOOL=ON
ENABLE_COMMONCRYPTO:BOOL=ON
ENABLE_GNUTLS:BOOL=ON
ENABLE_LZMA:BOOL=ON
ENABLE_MBEDTLS:BOOL=ON
ENABLE_OPENSSL:BOOL=ON
ENABLE_WINDOWS_CRYPTO:BOOL=ON
ENABLE_ZSTD:BOOL=ON
LIBZIP_DO_INSTALL:BOOL=ON
MDOCTOOL:FILEPATH=/usr/bin/groff
SHARED_LIB_VERSIONNING:BOOL=ON
ohos@ubuntu20:~/openHarmony/ohos_libzip/libzip-1.9.2/ohos64build$
```

### 解决依赖无法找到的问题

#### 先编译安装 xz

```
ohos@ubuntu20:~/openHarmony/ohos_libzip$ cd xz-5.4.1/
ohos@ubuntu20:~/openHarmony/ohos_libzip/xz-5.4.1$ mkdir ohos64build
ohos@ubuntu20:~/openHarmony/ohos_libzip/xz-5.4.1$ cd ohos64build/
ohos@ubuntu20:~/openHarmony/ohos_libzip/xz-5.4.1/ohos64build$ ${OHOS_SDK}/native/build-tools/cmake/bin/cmake -DCMAKE_TOOLCHAIN_FILE=${OHOS_SDK}/native/build/cmake/ohos.toolchain.cmake  .. -L -DCMAKE_INSTALL_PREFIX=`pwd`/../../usr/ -DBUILD_SHARED_LIBS=ON
																				 # 指定安装目录为~/openHarmony/ohos_libzip/usr
-- The C compiler identification is Clang 12.0.1
-- Check for working C compiler: /home/ohos/tools/OH_SDK/ohos-sdk/linux/native/llvm/bin/clang
-- Check for working C compiler: /home/ohos/tools/OH_SDK/ohos-sdk/linux/native/llvm/bin/clang -- works
-- Detecting C compiler ABI info
-- Detecting C compiler ABI info - done
-- Detecting C compile features
# 删除大量 cmake 日志
CMAKE_CXX_FLAGS_RELEASE:STRING=
CMAKE_INSTALL_PREFIX:PATH=/home/ohos/openHarmony/ohos_libzip/usr
CMAKE_TOOLCHAIN_FILE:FILEPATH=/home/ohos/tools/OH_SDK/ohos-sdk/linux/native/build/cmake/ohos.toolchain.cmake
CREATE_LZMA_SYMLINKS:BOOL=ON
CREATE_XZ_SYMLINKS:BOOL=ON
TUKLIB_FAST_UNALIGNED_ACCESS:BOOL=ON
TUKLIB_USE_UNSAFE_TYPE_PUNNING:BOOL=OFF
liblzma_INSTALL_CMAKEDIR:STRING=lib/cmake/liblzma
ohos@ubuntu20:~/openHarmony/ohos_libzip/xz-5.4.1/ohos64build$
ohos@ubuntu20:~/openHarmony/ohos_libzip/xz-5.4.1/ohos64build$ make -j4
Scanning dependencies of target lzcat.1
Scanning dependencies of target xzcat.1
Scanning dependencies of target unlzma.1
Scanning dependencies of target liblzma
[  0%] Built target lzcat.1
[  0%] Built target xzcat.1
#删除大量 make 日志
[100%] Built target lzma
Scanning dependencies of target unlzma
[100%] Built target unlzma
ohos@ubuntu20:~/openHarmony/ohos_libzip/xz-5.4.1/ohos64build$ make install
[ 65%] Built target liblzma
[ 66%] Built target test_vli
#删除大量 make install 日志
-- Installing: /home/ohos/openHarmony/ohos_libzip/usr/share/man/man1/lzcat.1
ohos@ubuntu20:~/openHarmony/ohos_libzip/xz-5.4.1/ohos64build$
#检查编译好的 liblzma 库
ohos@ubuntu20:~/openHarmony/ohos_libzip/xz-5.4.1/ohos64build$ ls ../../usr/
bin  include  lib  share
ohos@ubuntu20:~/openHarmony/ohos_libzip/xz-5.4.1/ohos64build$ cd ../../usr/lib/
ohos@ubuntu20:~/openHarmony/ohos_libzip/usr/lib$ file *
cmake:            directory
liblzma.a:        current ar archive
liblzma.so:       symbolic link to liblzma.so.5
liblzma.so.5:     symbolic link to liblzma.so.5.4.1
liblzma.so.5.4.1: ELF 64-bit LSB shared object, ARM aarch64, version 1 (SYSV), dynamically linked, BuildID[sha1]=709b7d1f2a5caf197f168982bf374638b8479a3e, with debug_info, not stripped
ohos@ubuntu20:~/openHarmony/ohos_libzip/usr/lib$
```

#### 再次编译 libzip

```

ohos@ubuntu20:~/openHarmony/ohos_libzip/usr/lib$ cd ../../libzip-1.9.2/ohos64build/
ohos@ubuntu20:~/openHarmony/ohos_libzip/libzip-1.9.2/ohos64build$ ls
CMakeCache.txt  cmake_install.cmake    config.h             examples  libzip-config.cmake          libzip.pc             Makefile  regress  zipconf.h
CMakeFiles      compile_commands.json  CTestTestfile.cmake  lib       libzip-config-version.cmake  libzip-targets.cmake  man       src
ohos@ubuntu20:~/openHarmony/ohos_libzip/libzip-1.9.2/ohos64build$ rm * -rf
ohos@ubuntu20:~/openHarmony/ohos_libzip/libzip-1.9.2/ohos64build$ ${OHOS_SDK}/native/build-tools/cmake/bin/cmake -DCMAKE_TOOLCHAIN_FILE=${OHOS_SDK}/native/build/cmake/ohos.toolchain.cmake  .. -L -DCMAKE_INSTALL_PREFIX=`pwd`/../../usr/ -DCMAKE_FIND_ROOT_PATH=`pwd`/../../usr
#-DCMAKE_INSTALL_PREFIX= 指定了libzip编译好后的安装目录
#-DCMAKE_FIND_ROOT_PATH= 指定了cmake find package 的路径，如果有多个需要用";"隔开
-- The C compiler identification is Clang 12.0.1
-- Check for working C compiler: /home/ohos/tools/OH_SDK/ohos-sdk/linux/native/llvm/bin/clang
-- Check for working C compiler: /home/ohos/tools/OH_SDK/ohos-sdk/linux/native/llvm/bin/clang -- works
# 删除大量 cmake 日志
-- Check if the system is big endian - little endian
-- Found ZLIB: /home/ohos/tools/OH_SDK/ohos-sdk/linux/native/sysroot/usr/lib/aarch64-linux-ohos/libz.so (found suitable version "1.2.12", minimum required is "1.1.2")
-- Could NOT find BZip2 (missing: BZIP2_LIBRARIES BZIP2_INCLUDE_DIR)
CMake Warning at CMakeLists.txt:186 (message):
  -- bzip2 library not found; bzip2 support disabled
CHECK_STARTLooking for lzma_auto_decoder in /home/ohos/openHarmony/ohos_libzip/libzip-1.9.2/ohos64build/../../usr/lib/liblzma.so
CHECK_PASSfound
CHECK_STARTLooking for lzma_easy_encoder in /home/ohos/openHarmony/ohos_libzip/libzip-1.9.2/ohos64build/../../usr/lib/liblzma.so
CHECK_PASSfound
CHECK_STARTLooking for lzma_lzma_preset in /home/ohos/openHarmony/ohos_libzip/libzip-1.9.2/ohos64build/../../usr/lib/liblzma.so
CHECK_PASSfound
# 日志显示找到了 liblzma 并满足版本要求
-- Found LibLZMA: /home/ohos/openHarmony/ohos_libzip/libzip-1.9.2/ohos64build/../../usr/lib/liblzma.so (found suitable version "5.4.1", minimum required is "5.2")
-- Could NOT find Zstd (missing: Zstd_LIBRARY Zstd_INCLUDE_DIR) (Required is at least version "1.3.6")
CMake Warning at CMakeLists.txt:204 (message):
  -- zstd library not found; zstandard support disabled


CMake Warning at CMakeLists.txt:226 (message):
  -- neither Common Crypto, GnuTLS, mbed TLS, OpenSSL, nor Windows
  Cryptography found; AES support disabled


-- Looking for getopt
-- Looking for getopt - found
-- Found Perl: /usr/local/bin/perl (found version "5.34.1")
# 删除大量 cmake 日志
MDOCTOOL:FILEPATH=/usr/bin/groff
SHARED_LIB_VERSIONNING:BOOL=ON
ohos@ubuntu20:~/openHarmony/ohos_libzip/libzip-1.9.2/ohos64build$
ohos@ubuntu20:~/openHarmony/ohos_libzip/libzip-1.9.2/ohos64build$ make -j && make install
Scanning dependencies of target nonrandomopen
Scanning dependencies of target man
Scanning dependencies of target liboverride
Scanning dependencies of target testinput
Scanning dependencies of target zip
[  1%] Preparing ZIP_SOURCE_GET_ARGS.3
# 删除大量的 make && make install 日志
-- Installing: /home/ohos/openHarmony/ohos_libzip/usr/bin/zipcmp
-- Set runtime path of "/home/ohos/openHarmony/ohos_libzip/usr/bin/zipcmp" to "/home/ohos/openHarmony/ohos_libzip/usr/lib"
-- Installing: /home/ohos/openHarmony/ohos_libzip/usr/bin/zipmerge
-- Set runtime path of "/home/ohos/openHarmony/ohos_libzip/usr/bin/zipmerge" to "/home/ohos/openHarmony/ohos_libzip/usr/lib"
-- Installing: /home/ohos/openHarmony/ohos_libzip/usr/bin/ziptool
-- Set runtime path of "/home/ohos/openHarmony/ohos_libzip/usr/bin/ziptool" to "/home/ohos/openHarmony/ohos_libzip/usr/lib"
ohos@ubuntu20:~/openHarmony/ohos_libzip/libzip-1.9.2/ohos64build$
# 检查编译出的libzip
ohos@ubuntu20:~/openHarmony/ohos_libzip/libzip-1.9.2/ohos64build$ cd ../../usr/
ohos@ubuntu20:~/openHarmony/ohos_libzip/usr$ ls
bin  include  lib  share
ohos@ubuntu20:~/openHarmony/ohos_libzip/usr$ ls bin/
lzcat  lzma  unlzma  unxz  xz  xzcat  xzdec  zipcmp  zipmerge  ziptool
ohos@ubuntu20:~/openHarmony/ohos_libzip/usr$ ls lib/
cmake  liblzma.a  liblzma.so  liblzma.so.5  liblzma.so.5.4.1  libzip.so  libzip.so.5  libzip.so.5.5  pkgconfig
ohos@ubuntu20:~/openHarmony/ohos_libzip/usr$ file lib/libzip.so.5.5
lib/libzip.so.5.5: ELF 64-bit LSB shared object, ARM aarch64, version 1 (SYSV), dynamically linked, BuildID[sha1]=0a2918c4f372d034a02297310869a18d9dd2ae1a, with debug_info, not stripped
ohos@ubuntu20:~/openHarmony/ohos_libzip/usr$ readelf -d lib/libzip.so.5.5

Dynamic section at offset 0x1fff8 contains 28 entries:
  Tag        Type                         Name/Value
 0x000000000000001d (RUNPATH)            Library runpath: [/home/ohos/openHarmony/ohos_libzip/usr/lib]
 0x0000000000000001 (NEEDED)             Shared library: [liblzma.so.5] # 可以看到 liblzma.so.5 是 NEEDED
 0x0000000000000001 (NEEDED)             Shared library: [libz.so]
 0x0000000000000001 (NEEDED)             Shared library: [libc.so]
 0x000000000000000e (SONAME)             Library soname: [libzip.so.5]
 0x000000000000001e (FLAGS)              BIND_NOW
 0x000000006ffffffb (FLAGS_1)            Flags: NOW
 0x0000000000000007 (RELA)               0x28a0
 0x0000000000000008 (RELASZ)             3120 (bytes)
 0x0000000000000009 (RELAENT)            24 (bytes)
 0x000000006ffffff9 (RELACOUNT)          123
 0x0000000000000017 (JMPREL)             0x34d0
 0x0000000000000002 (PLTRELSZ)           2760 (bytes)
 0x0000000000000003 (PLTGOT)             0x22220
 0x0000000000000014 (PLTREL)             RELA
 0x0000000000000006 (SYMTAB)             0x2a8
 0x000000000000000b (SYMENT)             24 (bytes)
 0x0000000000000005 (STRTAB)             0x1ca8
 0x000000000000000a (STRSZ)              3060 (bytes)
 0x000000006ffffef5 (GNU_HASH)           0x13a0
 0x0000000000000004 (HASH)               0x16f8
 0x0000000000000019 (INIT_ARRAY)         0x21c90
 0x000000000000001b (INIT_ARRAYSZ)       8 (bytes)
 0x000000000000001a (FINI_ARRAY)         0x21c98
 0x000000000000001c (FINI_ARRAYSZ)       16 (bytes)
 0x000000000000000c (INIT)               0x2051c
 0x000000000000000d (FINI)               0x2052c
 0x0000000000000000 (NULL)               0x0
ohos@ubuntu20:~/openHarmony/ohos_libzip/usr$
```

完成。

大家可以自己试试 zstd openssl 等库的依赖实现。