# tpc_c_cplusplus

## 简介

本仓库主要用于存放已经适配OpenHarmony的C/C++三方库的适配脚本和OpenHarmony三方库适配指导文档、三方库适配相关的工具。

## 三方库适配

本仓库的三方库主要是通过[OpenHarmony SDK进行交叉编译](lycium/doc/ohos_use_sdk/OHOS_SDK-Usage.md)适配的，并集成到应用端进行使用。

在使用OpenHarmony的SDK进行交叉编译的过程中较关注的问题是：不同编译构建方式如何进行交叉编译、不同的编译构建平台如何配置交叉编译的环境、不同的交叉编译架构如何配置以及交叉编译后的产物如何进行测试验证。

![交叉编译](./docs/media/cross_compile_cpp.png)

### 编译构建方式

当前开源的C/C++三方库编译方式多样化，以下为主流的几种交叉编译方式：

- [cmake 编译构建](./docs/cmake_portting.md)。
- [configure 编译构建方式](./docs/configure_portting.md)。
- [make 编译构建](./docs/make_portting.md)。

为了帮助开发者快速便捷的完成C/C++三方库交叉编译，我们开发了一套交叉编译框架[lycium](./lycium/README.md)，其涵盖了以上三种构建方式。

### 编译构建平台

当前大部分的三方库都是在linux环境下进行交叉编译构建的，除此外，我们也可能需要在windows、MacOS等平台进行构建：

- windows平台构建

 1. [windows平台交叉编译](./docs/adapter_windows.md)
 2. [IDE通过源码方式集成C/C++三方库](./docs/adapter_thirdlib.md)。

- MacOS平台构建指导

  请参考[Mac上使用OpenHarmony SDK交叉编译指导](./docs/adapter_mac.md)

### 添加不同CPU架构

当前`lycium`交叉编译适配的CPU架构只支持arm32位和arm64位的，如若需新增其他CPU架构，请参照[lycium上面适配OpenHarmony 不同架构的构建](./docs/adpater_architecture.md)

## 三方库测试验证

### 原生库测试用例验证

业界内C/C++三方库测试框架多种多样(ctest、make check以及原生库demo用例等)，我们无法将其统一，因此为了确保原生库功能的完整性，需基于原生库的测试用例进行测试验证。详细信息请参照[三方库快速验证指导](./docs/fast_verification.md)

### 北向应用调用

请阅读[北向应用如何使用三方库二进制文件](lycium/doc/app_calls_third_lib.md)

## 应用端集成三方库知识赋能

- [应用端集成三方库知识赋能](docs/thirdparty_knowledge.md)

## 本仓库目录

```shell
tpc_c_cplusplus
├── README_zh.md            # 仓库主页
├── docs                    # 说明文档/三方库适配文档8
├── lycium                  # 三方库适配相关工具
├── thirdparty              # 已经适配OpenHarmony的三方库的构建脚本
├── LICENSE                 # 本仓库的开源license文件
......
```

## 如何贡献

- [遵守仓库目录结构](#本仓库目录)
- [通过lycium快速交叉编译C/C++三方库](./lycium/)

## FAQ

- [C/C++三方库常见FAQ](./docs/FAQ.md)。
