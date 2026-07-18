# libwmf集成到应用hap

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
  tpc_c_cplusplus/thirdparty/libwmf     #三方库libwmf的目录结构如下
  ├── docs                             	#三方库相关文档的文件夹
  ├── HPKBUILD                         	#构建脚本
  ├── HPKCHECK                         	#测试脚本
  ├── SHA512SUM                        	#三方库校验文件
  ├── README.OpenSource                	#说明三方库源码的下载地址，版本、license等信息
  ├── README_zh.md
  ```
  
- 在lycium目录下编译三方库

  编译环境的搭建参考[准备三方库构建环境](../../../lycium/README.md#1编译环境准备)

  ```shell
  cd lycium
  ./build.sh libwmf
  ```
- ![thirdparty_install_dir](pic/build_libwmf.PNG)

- 三方库头文件及生成的库

  在lycium目录下会生成usr目录，该目录下存在已编译完成的32位和64位三方库

  ```shell
  libwmf/arm64-v8a   libwmf/armeabi-v7a
  ```
  
- [测试三方库](#测试三方库)

## 应用中使用三方库

- 需要将libwmf生成的so动态库文件以及依赖的动态库文件，下图所示拷贝到entry/libs目录下

- ![thirdparty_install_dir](pic/libwmf_so_ide.PNG)

- 在IDE的cpp目录下新增thirdparty目录，将生成的二进制文件以及头文件拷贝到该目录下，如下图所示
  
- ![thirdparty_install_dir](pic/libwmf_include_ide.PNG)

- 在最外层（cpp目录下）CMakeLists.txt中添加如下语句

#将三方库的头文件和库文件加入工程中
```shell
#将三方库依赖的库文件加入工程中
target_link_libraries(entry PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/freetype2/${OHOS_ARCH}/lib/libfreetype.a
    ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/libpng/${OHOS_ARCH}/lib/libpng16.so.16
    ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/brotli/${OHOS_ARCH}/lib/libbrotlidec.so.1
    ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/brotli/${OHOS_ARCH}/lib/libbrotlienc.so.1
    ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/brotli/${OHOS_ARCH}/lib/libbrotlicommon.so.1
    ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/bzip2/${OHOS_ARCH}/lib/libbz2.a
    ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/harfbuzz/${OHOS_ARCH}/lib/libharfbuzz-cairo.so.0
    ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/harfbuzz/${OHOS_ARCH}/lib/libharfbuzz.so.0
    ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/harfbuzz/${OHOS_ARCH}/lib/libharfbuzz-subset.so.0
    ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/xz/${OHOS_ARCH}/lib/liblzma.so.5
    ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/libxml2/${OHOS_ARCH}/lib/libxml2.so
    ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/libwmf/${OHOS_ARCH}/lib/libwmf.a
    ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/libwmf/${OHOS_ARCH}/lib/libwmflite.a)

#将三方库头文件加入工程中
target_include_directories(entry PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/freetype2/${OHOS_ARCH}/include/freetype2
    ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/libpng/${OHOS_ARCH}/include
    ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/brotli/${OHOS_ARCH}/include
    ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/bzip2/${OHOS_ARCH}/include
    ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/harfbuzz/${OHOS_ARCH}/include
    ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/xz/${OHOS_ARCH}/include
    ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/libxml2/${OHOS_ARCH}/include
    ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/libwmf/${OHOS_ARCH}/include)
```

## 测试三方库

三方库的测试使用原库自带的测试用例来做测试，[准备三方库测试环境](../../../lycium/README.md#3ci环境准备)

进入到构建目录运行测试用例（注意arm64-v8a为构建64位的目录，armeabi-v7a为构建32位的目录），可以查看HPKCHECK里面单独执行每条用例的方法，将生成的output.png与原图sample.wmf进行对比，查看是否一致，结果如图所示
```shell
  cd /data/tpc_c_cplusplus/thirdparty/libwmf/armeabi-v7a-build(或者cd /data/tpc_c_cplusplus/thirdparty/libwmf/arm64-v8a-build)
  ./src/convert/wmf2gd -o output.png ./examples/sample.wmf
```

测试结果如图所示：
  - ![thirdparty_install_dir](pic/run_png.PNG)
  - ![thirdparty_install_dir](pic/compare.PNG)

## 参考资料

- [OpenHarmony三方库地址](https://gitee.com/openharmony-tpc)
- [OpenHarmony知识体系](https://gitee.com/openharmony-sig/knowledge)
- [libwmf三方库地址](https://github.com/caolanm/libwmf)
