# libssh2集成到应用hap

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
  tpc_c_cplusplus/thirdparty/libssh2   #三方库libssh2的目录结构如下
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
  ./build.sh libssh2
  ```
- ![thirdparty_install_dir](pic/build_libssh2.png)

- 三方库头文件及生成的库

  在lycium目录下会生成usr目录，该目录下存在已编译完成的32位和64位三方库

  ```shell
  libssh2/arm64-v8a   libssh2/armeabi-v7a
  ```
  
- [测试三方库](#测试三方库)

## 应用中使用三方库

- 需要将libssh2生成的so动态库文件下图所示拷贝到entry/libs目录下

- ![thirdparty_install_dir](pic/libssh2_so_ide.png)

- 在IDE的cpp目录下新增thirdparty目录，将编译生成的库的头文件及其依赖库头文件和依赖库静态库拷贝到该目录下，如下图所示
  
- ![thirdparty_install_dir](pic/libssh2_include_ide.png)

- 在最外层（cpp目录下）CMakeLists.txt中添加如下语句

#将三方库的头文件和库文件加入工程中
target_include_directories(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/libssh2/${OHOS_ARCH}/include)
target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/../../../libs/${OHOS_ARCH}/libssh2.so.1)

#将三方库依赖的库的头文件和库文件加入工程中
target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/openssl/${OHOS_ARCH}/lib/libssl.a)
target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/openssl/${OHOS_ARCH}/lib/libcrypto.a)
target_include_directories(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/openssl/${OHOS_ARCH}/include)

## 测试三方库

三方库的测试使用原库自带的测试用例来做测试，[准备三方库测试环境](../../../lycium/README.md#3ci环境准备)

进入到构建目录运行测试用例（注意arm64-v8a为构建64位的目录，armeabi-v7a为构建32位的目录），执行结果如图所示
```shell
  cd /data/tpc_c_cplusplus/thirdparty/libssh2/libssh2-libssh2-1.11.0/$ARCH-build/tests
  ./test_auth_keyboard_info_request
  ./test_simple
```

- 测试结果如图所示：
- ![thirdparty_install_dir](pic/test_auth_keyboard_info_request.png)
- ![thirdparty_install_dir](pic/test_simple.png)

## 参考资料

- [OpenHarmony三方库地址](https://gitee.com/openharmony-tpc)
- [OpenHarmony知识体系](https://gitee.com/openharmony-sig/knowledge)
- [通过DevEco Studio开发一个NAPI工程](https://gitee.com/openharmony-sig/knowledge_demo_temp/blob/master/docs/napi_study/docs/hello_napi.md)
