# OpenHarmony交叉编译环境配置

## 简介

本文介绍在使用`lycium`框架快速交叉编译三方库前如何进行环境配置。

## 基本工具准备

`lycium`框架支持多种构建方式的三方库，为了保障三方库能正常编译，我们需要保证编译环境中包含以下几个基本编译命令：
`gcc`, `cmake`, `make`, `pkg-config`, `autoconf`, `autoreconf`, `automake`,
如若缺少相关命令，可通过官网下载对应版本的工具包，也可以在编译机上通过命令安装，如若`Ubuntu`系统上缺少`cmake`可以通过以下命令安装：

```shell
sudo apt install cmake
```

## 下载ohos sdk

[参考OHOS_SDK-Usage](../doc/ohos_use_sdk/OHOS_SDK-Usage.md)

## 配置环境变量

`lycium`支持的是C/C++三方库的交叉编译，SDK工具链只涉及到`native`目录下的工具，故OHOS_SDK的路径需配置成`native`工具的父目录，linux环境中配置SDK环境变量方法如下：

```shell
    export OHOS_SDK=/home/ohos/tools/OH_SDK/ohos-sdk/linux      # 此处SDK的路径使用者需配置成自己的sdk解压目录
```
