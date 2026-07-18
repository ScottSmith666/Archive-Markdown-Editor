# cpp-httplib集成到应用hap
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
  tpc_c_cplusplus/thirdparty/cpp-httplib #三方库的目录结构如下
  ├── docs                               #三方库相关文档的文件夹
  ├── HPKBUILD                           #构建脚本
  ├── HPKCHECK                           #自动化测试脚本
  ├── SHA512SUM                          #三方库校验文件
  ├── OAT.xml                            #OAT开源审查文本
  ├── README.OpenSource                  #说明三方库源码的下载地址，版本，license等信息
  ├── cpp-httplib_oh_pkg.patch           #补丁文件
  ├── README_zh.md   
  ```
  
- 在lycium目录下编译三方库
  编译环境的搭建参考[准备三方库构建环境](../../../lycium/README.md#1编译环境准备)
  ```
  cd lycium
  ./build.sh cpp-httplib
  ```
- 三方库头文件及生成的库
  在lycium目录下会生成usr目录，该目录下存在已编译完成的32位和64位三方库和头文件
  ```
  cpp-httplib/arm64-v8a
  cpp-httplib/armeabi-v7a
  ```

- [测试三方库](#测试三方库)

## 应用中使用三方库

- 在IDE的cpp目录下新增thirdparty目录，将编译生成的三方库的静态库文件（所有的.a文件）拷贝到工程的libs目录下，如下图所示
&nbsp;![thirdparty_install_dir](pic/usage.png) 
- 在最外层（cpp目录下）CMakeLists.txt中添加如下语句
  
```
#将三方库加入工程中
target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/../../../libs/brotli/${OHOS_ARCH}/libbrotlicommon-static.a)
target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/../../../libs/brotli/${OHOS_ARCH}/libbrotlidec-static.a)
target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/../../../libs/brotli/${OHOS_ARCH}/libbrotlienc-static.a)
target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/../../../libs/cpp-httplib/${OHOS_ARCH}/libhttplib.a)
target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/../../../libs/googletest/${OHOS_ARCH}/libgmock.a)
target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/../../../libs/googletest/${OHOS_ARCH}/libgmock_main.a)
target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/../../../libs/googletest/${OHOS_ARCH}/libgtest.a)
target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/../../../libs/googletest/${OHOS_ARCH}/libgtest_main.a)
target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/../../../libs/openssl/${OHOS_ARCH}/libcrypto.a)
target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/../../../libs/openssl/${OHOS_ARCH}/libssl.a)
target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/../../../libs/zlib/${OHOS_ARCH}/libz.a)
#将三方库的头文件加入工程中
target_include_directories(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/brotli/${OHOS_ARCH}/include)
target_include_directories(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/cpp-httplib/${OHOS_ARCH}/include)
target_include_directories(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/googletest/${OHOS_ARCH}/include)
target_include_directories(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/openssl/${OHOS_ARCH}/include)
target_include_directories(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/zlib/${OHOS_ARCH}/include)
```

## 测试三方库
```
三方库的测试使用原库自带的测试用例来做测试
cd tpc_c_cplusplus/thirdparty/cpp-httplib/cpp-httplib-0.13.3/test 进入该目录配置环境变量
export LD_LIBRARY_PATH=$ARCH/:$LD_LIBRARY_PATH
export LD_LIBRARY_PATH=$LYCIUM_ROOT/usr/openssl/$ARCH/lib/:$LD_LIBRARY_PATH
export LD_LIBRARY_PATH=$LYCIUM_ROOT/usr/zlib/$ARCH/lib/:$LD_LIBRARY_PATH
export LD_LIBRARY_PATH=$LYCIUM_ROOT/usr/brotli/$ARCH/lib/:$LD_LIBRARY_PATH
进入到构建目录获取 cd/lycium/
执行./test-arm64-v8a(32位执行./test-armeabi-v7a)，运行测试用例（cpp-httplib-arm64-v8a-build为构建64位的目录，cpp-httplib-armeabi-v7a-build为构建32位的目录）
```

## 参考资料
- [润和RK3568开发板标准系统快速上手](https://gitee.com/openharmony-sig/knowledge_demo_temp/tree/master/docs/rk3568_helloworld)
- [OpenHarmony三方库地址](https://gitee.com/openharmony-tpc)
- [OpenHarmony知识体系](https://gitee.com/openharmony-sig/knowledge)
- [通过DevEco Studio开发一个NAPI工程](https://gitee.com/openharmony-sig/knowledge_demo_temp/blob/master/docs/napi_study/docs/hello_napi.md)
