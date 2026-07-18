# ceres-solver集成到应用hap
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
  tpc_c_cplusplus/thirdparty/ceres-solver      #三方库ceres-solver的目录结构如下
  ├── docs                              #三方库相关文档的文件夹
  ├── HPKBUILD                          #构建脚本
  ├── HPKCHECK                          #自动化测试脚本
  ├── OAT.xml                           #OAT开源审查文本
  ├── README.OpenSource                 #说明三方库源码的下载地址，版本，license等信息
  ├── README_zh.md                      #三方库说明文档
  └── SHA512SUM                         #校验文档
  ```
  
- 进入lycium目录下
  ```
  cd tpc_c_cplusplus/lycium
  ```
- 在lycium目录下编译三方库 
  ceres-solver库依赖库有eigen、gflags、glog、googletest和METIS(依赖GKlib)会在本仓自动编译，所以在build时只需要编译ceres-solver库
  编译环境的搭建参考[准备三方库构建环境](../../../lycium/README.md#1编译环境准备)
  ```
  ./build.sh ceres-solver
  ```
- 三方库头文件及生成的库
  在lycium目录下会生成usr目录，该目录下存在已编译完成的32位和64位三方库
  ```
  ceres-solver/arm64-v8a   ceres-solver/armeabi-v7a
  eigen/arm64-v8a          eigen/armeabi-v7a
  gflags/arm64-v8a         gflags/armeabi-v7a
  glog/arm64-v8a           glog/armeabi-v7a
  googletest/arm64-v8a     googletest/armeabi-v7a
  METIS/arm64-v8a          METIS/armeabi-v7a
  GKlib/arm64-v8a          GKlib/armeabi-v7a
  ```

- [测试三方库](#测试三方库)

## 应用中使用三方库

- 在IDE的cpp目录下新增thirdparty目录，将编译生成的库拷贝到该目录下，如下图所示
  
&nbsp;![thirdparty_install_dir](pic/ceres-solver_install_dir.jpg)

- 在entry/src/main/cpp目录下的CMakeLists.txt中添加如下语句
  ```
  #将三方库加入工程中
  target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/ceres-solver/${OHOS_ARCH}/lib/libceres.a)
  target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/gflags/${OHOS_ARCH}/lib/libgflags_nothreads.a
                                      ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/gflags/${OHOS_ARCH}/lib/libgflags.a)
  target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/GKlib/${OHOS_ARCH}/lib/libGKlib.a)

  target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/googletest/${OHOS_ARCH}/lib/libgmock_main.a
                                      ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/googletest/${OHOS_ARCH}/lib/libgmock.a
                                      ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/googletest/${OHOS_ARCH}/lib/libgtest_main.a
                                      ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/googletest/${OHOS_ARCH}/lib/libgtest.a)

  target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/METIS/${OHOS_ARCH}/lib/libmetis.a)
  target_link_libraries(entry PRIVATE -L${CMAKE_CURRENT_SOURCE_DIR}/../../../libs/glog/${OHOS_ARCH}/libglog.so.1)

  #将三方库的头文件加入工程中
  target_include_directories(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/ceres-solver/${OHOS_ARCH}/include/ceres
                                          ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/ceres-solver/${OHOS_ARCH}/include/ceres/internal)
  target_include_directories(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/eigen/${OHOS_ARCH}/include/eigen3)
  target_include_directories(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/gflags/${OHOS_ARCH}/include/gflags)
  target_include_directories(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/GKlib/${OHOS_ARCH}/include)
  target_include_directories(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/glog/${OHOS_ARCH}/include/glog)
  target_include_directories(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/googletest/${OHOS_ARCH}/include/gmock
                                          ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/googletest/${OHOS_ARCH}/include/gmock/internal
                                          ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/googletest/${OHOS_ARCH}/include/gmock/internal/custom
                                          ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/googletest/${OHOS_ARCH}/include/gtest
                                          ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/googletest/${OHOS_ARCH}/include/gtest/internal
                                          ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/googletest/${OHOS_ARCH}/include/gtest/internal/custom)
  target_include_directories(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/METIS/${OHOS_ARCH}/include)
  ```

## 测试三方库
三方库的测试使用原库自带的测试用例来做测试，[准备三方库测试环境](../../../lycium/README.md#3ci环境准备)

- 将编译生成的可执行文件及生成的动态库准备好

- 将准备好的文件推送到开发板，进入到构建的目录thirdparty/ceres-solver/ceres-solver-2.1.0/arm64-v8a-build(64位)下执行ctest

&nbsp;![ceres-solver_test](pic/ceres-solver_test.jpg)

## 参考资料
- [润和RK3568开发板标准系统快速上手](https://gitee.com/openharmony-sig/knowledge_demo_temp/tree/master/docs/rk3568_helloworld)
- [OpenHarmony三方库地址](https://gitee.com/openharmony-tpc)
- [OpenHarmony知识体系](https://gitee.com/openharmony-sig/knowledge)
- [通过DevEco Studio开发一个NAPI工程](https://gitee.com/openharmony-sig/knowledge_demo_temp/blob/master/docs/napi_study/docs/hello_napi.md)
