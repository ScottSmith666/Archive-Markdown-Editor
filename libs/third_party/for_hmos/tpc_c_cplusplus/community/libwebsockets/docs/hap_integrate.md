# libwebsockets在OpenHarHarmony上运行

本库是在RK3568开发板上基于OpenHarmony4.1 Release版本的镜像验证的，如果是从未使用过RK3568，可以先查看[润和RK3568开发板标准系统快速上手](https://gitee.com/openharmony-sig/knowledge_demo_temp/tree/master/docs/rk3568_helloworld)。

## 开发环境

- [开发环境准备](../../../docs/hap_integrate_environment.md)

## 编译三方库

- 下载本仓库

  ```
  git clone https://gitee.com/openharmony-sig/tpc_c_cplusplus.git --depth=1
  ```

- 三方库目录结构

  ```shell
  tpc_c_cplusplus/thirdparty/libwebsockets    #三方库libwebsockets的目录结构如下
  ├── docs                                    #三方库相关文档的文件夹
  ├── HPKBUILD                                #构建脚本
  ├── README_zh.md		                      #libwebsockets说明文档
  ├── SHA512SUM                               #三方库校验文件
  ├── OAT.xml                                 #OAT开源审查文本
  ```

- 在lycium目录下编译三方库
  编译环境的搭建参考[准备三方库构建环境](../../../lycium/README.md#1编译环境准备)

  ```
  cd lycium
  ./build.sh libwebsockets
  ```

- 三方库头文件及生成的库

  在lycium目录下会生成usr目录，该目录下存在已编译完成的32位和64位三方库和头文件

  ```shell
  libwebsockets/arm64-v8a   
  libwebsockets/armeabi-v7a
  ```
- [测试三方库](#测试三方库)


## 应用中使用三方库
- 在IDE的cpp目录下新增thirdparty目录，将编译生成的库拷贝到该目录下
  &nbsp;

![alt text](./pic/thirdparty.png)

- 在最外层（cpp目录下）CMakeLists.txt中添加如下语句

```shell
#将三方库加入工程中
target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/libwebsockets/${OHOS_ARCH}/lib/libwebsockets.a)
#将三方库的头文件加入工程中
target_include_directories(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/libwebsockets/${OHOS_ARCH}/include)
```

![alt text](./pic/target_link_libraries.png)

## 测试三方库

- 编译出可执行的文件进行测试，[准备三方库测试环境](../../../lycium/README.md#3ci环境准备)

- 将tpc_c_cplusplus发送至rk3568开发板data目录,进入到构建目录运行测试用例（注意arm64-v8a-build为构建64位的目录，armeabi-v7a-build为构建32位的目录），执行结果如图所示
```
cd data/tpc_c_cplusplus/thirdparty/libwebsockets/libwebsocketssource-v4.3.3/arm64-v8a-build/bin
./libwebsockets-test-server
```
![alt text](./pic/test.png)

## 参考资料

- [润和RK3568开发板标准系统快速上手](https://gitee.com/openharmony-sig/knowledge_demo_temp/tree/master/docs/rk3568_helloworld)
- [OpenHarmony三方库地址](https://gitee.com/openharmony-tpc)
- [OpenHarmony知识体系](https://gitee.com/openharmony-sig/knowledge)
- [通过DevEco Studio开发一个NAPI工程](https://gitee.com/openharmony-sig/knowledge_demo_temp/blob/master/docs/napi_study/docs/hello_napi.md)
