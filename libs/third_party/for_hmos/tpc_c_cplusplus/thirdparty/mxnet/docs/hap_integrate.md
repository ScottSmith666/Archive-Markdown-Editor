# mxnet集成到应用hap
本库是在RK3568开发板上基于OpenHarmony3.2 Release版本的镜像验证的，如果是从未使用过RK3568，可以先查看[润和RK3568开发板标准系统快速上手](https://gitee.com/openharmony-sig/knowledge_demo_temp/tree/master/docs/rk3568_helloworld)。
## 开发环境

- [开发环境准备](../../../docs/hap_integrate_environment.md)

## 编译三方库
- 下载本仓库
  ```
  git clone https://gitee.com/openharmony-sig/tpc_c_cplusplus.git --depth=1
  ```
- 三方库目录结构
  ```
  tpc_c_cplusplus/thirdparty/mxnet  #三方库mxnet的目录结构如下
  ├── docs                          #三方库相关文档的文件夹
  ├── HPKBUILD                      #构建脚本
  ├── HPKCHECK                      #测试脚本
  ├── OAT.xml                       #OAT开源审查文本文件
  ├── README.OpenSource             #说明三方库源码的下载地址，版本，license等信息  
  ├── README_zh.md                  #三方库说明文档
  ```
  
- 在lycium目录下编译三方库
  编译环境的搭建参考[准备三方库构建环境](../../../lycium/README.md#1编译环境准备)
  
  ```shell
  cd lycium
  ./build.sh mxnet
  ```
- 三方库头文件及生成的库
  在lycium目录下会生成usr目录，该目录下存在已编译完成的32位和64位三方库
  
  ```
  mxnet/arm64-v8a
  mxnet/armeabi-v7a
  OpenBLAS_0.3.23/arm64-v8a
  OpenBLAS_0.3.23/armeabi-v7a
  opencv/arm64-v8a
  opencv/armeabi-v7a
  clapack/arm64-v8a
  clapack/armeabi-v7a
  openmp/arm64-v8a
  openmp/armeabi-v7a
  ```
  
- [测试三方库](#测试三方库)

## 应用中使用三方库

- 在IDE的cpp目录下新增thirdparty目录，将编译生成的库拷贝到该目录下，将需要的库文件拷贝到libs文件夹下，如下图所示
&nbsp;![thirdparty_install_dir](pic/mxnet_install_dir.png)
- 在最外层（cpp目录下）CMakeLists.txt中添加如下语句
```shell
# 将三方库加入工程中
target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/../../../libs/${OHOS_ARCH}/libdmlc.a)
target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/../../../libs/${OHOS_ARCH}/libmxnet.so)
# 将三方库的头文件加入工程中
target_include_directories(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/mxnet/${OHOS_ARCH}/include)
target_include_directories(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/OpenBLAS_0.3.23/${OHOS_ARCH}/include)
target_include_directories(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/opencv/${OHOS_ARCH}/include)
target_include_directories(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/clapack/${OHOS_ARCH}/include)
target_include_directories(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/openmp/${OHOS_ARCH}/include)
```

  ![DBoW2_usage1](pic/mxnet_usage.png)

## 测试三方库
三方库的测试使用原库自带的测试用例来做测试，[准备三方库测试环境](../../../lycium/README.md#3ci环境准备)

- 将编译生成的可执行文件及生成的动态库准备好,打包
- 修改系统权限为可读写
- 将准备好的文件推送到开发板
- 添加和lib库环境
- 进入到构建的目录tests文件夹执行测试程序 ctest

&nbsp;![DBoW2_test](pic/mxnet_test.png)

## 参考资料
- [润和RK3568开发板标准系统快速上手](https://gitee.com/openharmony-sig/knowledge_demo_temp/tree/master/docs/rk3568_helloworld)
- [OpenHarmony三方库地址](https://gitee.com/openharmony-tpc)
- [OpenHarmony知识体系](https://gitee.com/openharmony-sig/knowledge)
- [通过DevEco Studio开发一个NAPI工程](https://gitee.com/openharmony-sig/knowledge_demo_temp/blob/master/docs/napi_study/docs/hello_napi.md)
