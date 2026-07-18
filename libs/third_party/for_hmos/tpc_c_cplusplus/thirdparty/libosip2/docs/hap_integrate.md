# libosip2集成到应用hap
本库是在RK3568开发板上基于OpenHarmony3.2 Release版本的镜像验证的，如果是从未使用过RK3568，可以先查看[润和RK3568开发板标准系统快速上手](https://gitee.com/openharmony-sig/knowledge_demo_temp/tree/master/docs/rk3568_helloworld)。
## 开发环境

- [开发环境准备](../../../docs/hap_integrate_environment.md)

## 编译三方库
- 下载本仓库
  ```
  wget https://ftp.gnu.org/gnu/osip/libosip2-5.3.1.tar.gz
  ```
- 三方库目录结构
  ```
  tpc_c_cplusplus/thirdparty/libosip2  #三方库libosip2的目录结构如下
  ├── docs                              #三方库相关文档的文件夹
  ├── HPKBUILD                          #构建脚本
  ├── SHA512SUM                         #三方库校验文件
  ├── README.OpenSource                 #说明三方库源码的下载地址，版本，license等信息
  ├── README_zh.md 
  ```
  
- 将libosip2拷贝至lycium/main目录下(没有main目录就手动创建一下)
  ```
  cd tpc_c_cplusplus
  cp thirdparty/libosip2 lycium/main -rf
  ```
- 在lycium目录下编译三方库 
  libosip2库不需要依赖其它库，所以在build时只需要编译libosip2库即可
  编译环境的搭建参考[准备三方库构建环境](../../../lycium/README.md#1编译环境准备)
  ```
  cd lycium
  ./build.sh libosip2
  ```
- 三方库头文件及生成的库
  在lycium目录下会生成usr目录，该目录下存在已编译完成的32位和64位三方库
  ```
  libosip2/arm64-v8a   libosip2/armeabi-v7a
  ```

- [测试三方库](#测试三方库)

## 应用中使用三方库

- 在IDE的cpp目录下新增thirdparty目录，将编译生成的库拷贝到该目录下，如下图所示
  
&nbsp;![thirdparty_install_dir](pic/osip2_install_dir.jpg)

- 在最外层（cpp目录下）CMakeLists.txt中添加如下语句
  ```
  #将三方库加入工程中
  target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/libosip2/${OHOS_ARCH}/lib/libosip2.a
                              ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/libosip2/${OHOS_ARCH}/lib/libosipparser2.a)

  #将三方库的头文件加入工程中
  target_include_directories(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/libosip2/${OHOS_ARCH}/include/osip2/
                              ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/libosip2/${OHOS_ARCH}/include/osipparser2/
                              ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/libosip2/${OHOS_ARCH}/include/osipparser2/headers)
  ```

&nbsp;![osip2_usage](pic/osip2_usage.jpg)

## 测试三方库
三方库的测试使用原库自带的测试用例来做测试，[准备三方库测试环境](../../../lycium/README.md#3ci环境准备)

- 将编译生成的可执行文件及生成的动态库准备好

- 将准备好的文件推送到开发板，进入到构建的目录$ARCH-build/src/test下执行make chech

&nbsp;![osip2_test](pic/osip2_test.jpg)

## 参考资料
- [润和RK3568开发板标准系统快速上手](https://gitee.com/openharmony-sig/knowledge_demo_temp/tree/master/docs/rk3568_helloworld)
- [OpenHarmony三方库地址](https://gitee.com/openharmony-tpc)
- [OpenHarmony知识体系](https://gitee.com/openharmony-sig/knowledge)
- [通过DevEco Studio开发一个NAPI工程](https://gitee.com/openharmony-sig/knowledge_demo_temp/blob/master/docs/napi_study/docs/hello_napi.md)
