# cppjieba集成到应用hap

本库是在RK3568开发板上基于OpenHarmony3.2 Release版本的镜像验证的，如果是从未使用过RK3568，可以先查看[润和RK3568开发板标准系统快速上手](https://gitee.com/openharmony-sig/knowledge_demo_temp/tree/master/docs/rk3568_helloworld)。

## 开发环境

- [开发环境准备](../../../docs/hap_integrate_environment.md)

## 编译三方库

*   下载本仓库

    ```shell
    git clone https://gitee.com/openharmony-sig/tpc_c_cplusplus.git --depth=1
    ```

*   三方库目录结构

    ```shell
    tpc_c_cplusplus/thirdparty/cppjieba   #三方库cppjieba的目录结构如下
    ├── docs                              #三方库相关文档的文件夹
    ├── HPKBUILD                          #构建脚本
    ├── HPKCHECK                          #测试脚本
    ├── OAT.xml                           #扫描结果文件
    ├── SHA512SUM                         #三方库校验文件
    ├── README.OpenSource                 #说明三方库源码的下载地址，版本，license等信息
    ├── README_zh.md                      #三方库简介
    ```
    
*   在lycium目录下编译三方库

    编译环境的搭建参考[准备三方库构建环境](../../../lycium/README.md#1编译环境准备)

    ```shell
    cd lycium
    ./build.sh cppjieba
    ```

*   三方库头文件及生成的库

    在lycium目录下会生成usr目录，该目录下存在已编译完成cppjieb的头文件

    ```shell
    cppjieba/arm64-v8a   cppjieba/armeabi-v7a
    ```

*   [测试三方库](#测试三方库)

## 应用中使用三方库

- 在IDE的cpp目录下新增thirdparty目录，将编译生成的头文件拷贝到该目录下；

&nbsp;![thirdparty_install_dir](pic/cppjieba-dev.png)

- 在最外层（cpp目录下）CMakeLists.txt中添加如下语句

  ```cmake
  #将三方库的头文件加入工程中
  target_include_directories(entry PRIVATE 		${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/cppjieba/${OHOS_ARCH}/include)
  ```
  

## 测试三方库

- 编译出可执行的文件进行测试，[准备三方库测试环境](../../../lycium/README.md#3ci环境准备)
- 将libc++_shared.so拷贝到开发板系统data目录。执行export LD_LIBRARY_PATH="/data/"
- 将源码的dict字典文件夹拷贝到和单元测试的同个目录下

```shell
  cp -r /data/tpc_c_cplusplus/thirdparty/cppjieba/cppjieba/dict /data/tpc_c_cplusplus/thirdparty/cppjieba/cppjieba/$ARCH-build/test/
```

- 进入到构建目录运行单元测试用例（注意arm64-v8a为构建64位的目录，armeabi-v7a为构建32位的目录），执行结果如图所示

```shell
  cd /data/tpc_c_cplusplus/thirdparty/cppjieba/cppjieba/$ARCH-build/test
  ./test.run
```

&nbsp;![libgc_test](pic/test-cmd-ret3.png)

&nbsp;![libgc_test](pic/test-cmd-ret4.png)

&nbsp;![libgc_test](pic/test-cmd-ret5.png)

## 参考资料

*   [OpenHarmony三方库地址](https://gitee.com/openharmony-tpc)
*   [OpenHarmony知识体系](https://gitee.com/openharmony-sig/knowledge)
*   [libfuse三方库地址](https://github.com/libfuse/libfuse)

