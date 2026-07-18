# FFmpeg集成到应用hap

本库是在RK3568开发板上基于OpenHarmony3.2 Release版本的镜像验证的，如果是从未使用过RK3568，可以先查看[润和RK3568开发板标准系统快速上手](https://gitee.com/openharmony-sig/knowledge_demo_temp/tree/master/docs/rk3568_helloworld)。

## 开发环境
- [开发环境准备](../../../docs/hap_integrate_environment.md)

## 编译三方库

- 下载本仓库

  ```shell
  git clone https://gitee.com/openharmony-sig/tpc_c_cplusplus.git --depth=1
  ```

- 三方库目录结构

  ```shell
  tpc_c_cplusplus/thirdparty/FFmpeg     #三方库FFmpeg的目录结构如下
  ├── docs                              #三方库相关文档的文件夹
  ├── HPKBUILD                          #构建脚本
  ├── SHA512SUM                         #三方库校验文件
  ├── README.OpenSource                 #说明三方库源码的下载地址，版本，license等信息
  ├── README_zh.md   
  ```

- 在lycium目录下编译三方库

  编译环境的搭建参考[准备三方库构建环境](../../../lycium/README.md#1编译环境准备)

  ```shell
  cd lycium
  ./build.sh FFmpeg
  ```

- 三方库头文件及生成的库

  在lycium目录下会生成usr目录，该目录下存在已编译完成的32位和64位三方库

  ```shell
  FFmpeg/arm64-v8a   FFmpeg/armeabi-v7a
  ```
  
- [测试三方库](#测试三方库)

## 应用中使用三方库

- 在IDE的cpp目录下新增thirdparty目录，将编译生成的库拷贝到该目录下，如下图所示
  &nbsp;

  ![thirdparty_install_dir](pic/FFmpeg_install_dir.png)

- 在最外层（cpp目录下）CMakeLists.txt中添加如下语句，libz.a需要自己编译仓库里面的

  ```cmake
  #修改文件CMakeLists.txt
  #因为此三方库中存在汇编编译的部分，所以需要修改CFLAGS参考如下，符号不可抢占且优先使用本地符号
  set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -Wno-int-conversion -Wl,-Bsymbolic")
  set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wno-int-conversion -Wl,-Bsymbolic")
  #将三方库加入工程中
  target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/FFmpeg/${OHOS_ARCH}/lib/libavcodec.a)
  target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/FFmpeg/${OHOS_ARCH}/lib/libavdevice.a)
  target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/FFmpeg/${OHOS_ARCH}/lib/libavfilter.a)
  target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/FFmpeg/${OHOS_ARCH}/lib/libavformat.a)
  target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/FFmpeg/${OHOS_ARCH}/lib/libavutil.a)
  target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/FFmpeg/${OHOS_ARCH}/lib/libswresample.a)
  target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/FFmpeg/${OHOS_ARCH}/lib/libswscale.a)
  target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/zlib/${OHOS_ARCH}/lib/libz.a)
  
  target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/openssl_1_0_2u/${OHOS_ARCH}/lib/libcrypto.a)
  target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/openssl_1_0_2u/${OHOS_ARCH}/lib/libssl.a)
  target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/rtmpdump/${OHOS_ARCH}/lib/librtmp.a)
  #将三方库的头文件加入工程中
  target_include_directories(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/FFmpeg/${OHOS_ARCH}/include)
  ```
  
  ```cmake
  #如果自行编译libz.a遇到问题，可以尝试直接导入libz
  target_link_libraries(entry PRIVATE z)
  ```
  
- 调用三方库须知

  ```c
  #调用需注意
  #引入FFmpeg头文件时需要声明此处引入为C，参考如下
  extern "C"{
  	#include "libavcodec/ac3_parser.h"
  }
## 测试三方库

三方库的测试使用原库自带的测试用例来做测试，[准备三方库测试环境](../../../lycium/README.md#3ci环境准备)

进入到构建目录,执行如下命令make check（arm64-v8a-build/FFmpeg-n6.0为构建64位的目录，armeabi-v7a-build/FFmpeg-n6.0为构建32位的目录，其中n6.0为版本号，不同的版本对应的构建目录会不一样）


&nbsp;![FFmpeg_test](pic/FFmpeg_test_1.png)
&nbsp;![FFmpeg_test](pic/FFmpeg_test_2.png)

## 参考资料

- [润和RK3568开发板标准系统快速上手](https://gitee.com/openharmony-sig/knowledge_demo_temp/tree/master/docs/rk3568_helloworld)
- [OpenHarmony三方库地址](https://gitee.com/openharmony-tpc)
- [OpenHarmony知识体系](https://gitee.com/openharmony-sig/knowledge)
- [通过DevEco Studio开发一个NAPI工程](https://gitee.com/openharmony-sig/knowledge_demo_temp/blob/master/docs/napi_study/docs/hello_napi.md)
