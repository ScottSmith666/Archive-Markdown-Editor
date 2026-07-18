# Catch2集成到应用hap

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
  tpc_c_cplusplus/thirdparty/Catch2     #三方库Catch2的目录结构如下
  ├── docs                              #三方库相关文档的文件夹
  ├── HPKBUILD                          #构建脚本
  ├── HPKCHECK                          #测试脚本
  ├── OAT.xml                           #扫描结果文件
  ├── SHA512SUM                         #三方库校验文件
  ├── README.OpenSource                 #说明三方库源码的下载地址，版本，license等信息
  ├── README_zh.md                      #三方库简介
  ```
- 在lycium目录下编译三方库 
  编译环境的搭建参考[准备三方库构建环境](../../../lycium/README.md#1编译环境准备)
  ```shell
  cd lycium
  ./build.sh Catch2
  ```
- 三方库头文件
  在lycium目录下会生成usr目录，该目录下存在Catch2的头文件
  ```shell
  Catch2/arm64-v8a   Catch2/armeabi-v7a
  ```
- [测试三方库](#测试三方库)

## 应用中使用三方库

Catch2是一个Header only库，只需要引入头文件即可使用，无需编译生成额外的库文件。

## 测试三方库

- 编译出可执行的文件进行测试，[准备三方库测试环境](../../../lycium/README.md#3ci环境准备)

- 进入到构建目录运行测试用例（注意arm64-v8a为构建64位的目录，armeabi-v7a为构建32位的目录），执行结果如图所示
```
  cd /data/tpc_c_cplusplus/thirdparty/Catch2/Catch2-2.13.8/armeabi-v7a-build/
  ctest
```

&nbsp;![Catch2_test](pic/test-cmd-ret.png)

## 参考资料

*   [OpenHarmony三方库地址](https://gitee.com/openharmony-tpc)
*   [OpenHarmony知识体系](https://gitee.com/openharmony-sig/knowledge)
*   [Catch2三方库地址](https://github.com/catchorg/Catch2)