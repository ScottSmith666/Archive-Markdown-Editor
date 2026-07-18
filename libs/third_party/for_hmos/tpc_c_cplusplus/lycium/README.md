# lycium 交叉编译框架

## 简介

lycium是一款协助开发者通过shell语言实现C/C++三方库快速交叉编译，并在OpenHarmony 系统上快速验证的编译框架工具。开发者只需要设置对应C/C++三方库的编译方式以及编译参数，通过lycium就能快速的构建出能在OpenHarmony 系统运行的二进制文件。

## 原则

**移植过程，不可以改源码（即不patchc/cpp文件，不patch构建脚本）。如移植必须patch，patch必须评审，给出充分理由。（不接受业务patch）**

## 目录结构介绍

```shell
lycium
├── doc                   # lycium工具相关说明文档
├── Buildtools            # 存放编译环境准备说明
├── CItools               # 测试环境搭建相关说明文档
├── script                # 项目依赖的脚本
├── template              # thirdparty 目录中库的构建/测试模板
├── build.sh              # 顶层构建脚本
├── test.sh               # 顶层测试脚本
```

## 通过lycium工具快速共建C/C++三方库

### 1.编译环境准备

请阅读 [Buildtools README](./Buildtools/README.md)

### 2.修改三方库的编译方式以及编译参数

lycium框架提供了[HPKBUILD](./template/HPKBUILD)文件供开发者对相应的C/C++三方库的编译配置。具体方法：

1. 在[thirdparty](../thirdparty/)目录下新建需要共建的三方库名字pkgname。
2. 将[HPKBUILD](./template/HPKBUILD)模板文件拷贝到新建三方库目录下。
3. 根据三方库实际情况修改[HPKBUILD](./template/HPKBUILD)模板，文件修改可参考[minizip共建](../docs/thirdparty_port.md#快速适配三方库实例)。

### 3.快速编译三方库

配置完三方库的编译方式参数后，在[lycium](./)目录执行./build.sh pkgname，进行自动编译三方库，并打包安装到当前目录的 usr/\$pkgname/$ARCH 目录

```shell
    ./build.sh # 默认编译 thirdparty 目录下的多有库
```

```shell
    ./build.sh aaa bbb ccc ... # 编译 thirdparty 目录下指定的 aaa bbb ccc ...库 当 aaa 库存在依赖时，必须保证入参中包含依赖，否则 aaa 库不会编译
```

**lycium框架是通过linux shell脚本语言编写的，如果对shell语言不熟悉的开发者可以先学习[Linux Shell编程基础教程](https://blog.51cto.com/centos5/912584)。或者查找其他linux shell编程资料**

### 4.编译后三方库在DevEco Studio上使用

请阅读[北向应用如何使用三方库二进制文件](doc/app_calls_third_lib.md)

### 5.在OpenHarmony设备上快速验证C/C++三方库

#### 3CI环境准备

 业界内C/C++三方库测试框架多种多样，我们无法将其统一，因此为了保证原生库功能完整，我们基于原生库的测试用例进行测试验证。为此，我们需要集成了一套可以在OH环境上进行cmake, ctest等操作的环境，具体请阅读 [lycium CItools](./CItools/README_zh.md)。

#### 测试脚本编写

 lycium框架提供了[HPKCHECK](./template/HPKCHECK)文件供开发者对相应的C/C++三方库的自动化测试，开发者只需在脚本中配置当前三方库需要测试的命令即可。

#### 测试运行

 由于我们运行的是原生库的测试用例，因此我们需要将原生库的源码及生成文件都作为测试资源打包到开发板进行测试(直接将tpc_c_cplusplus直接打包成一个测试资源，并且保证测试资源在开发板的测试路径与编译路径保持一致，避免部分原生库因编译时对测试文件配置了路径而导致测试不过)，然后在[lycium](./)目录下执行脚本./test.sh,自动运行thridparty目录下已编译的三方库，并在终端显示已测试三方库总数以及通过和未通过的三方库。

   ```shell
   ./test.sh # 默认测试 thirdparty 目录下的所有已编译的三方库
   ```

   ```shell
    ./test.sh aaa bbb ccc ... # 测试 thirdparty 目录下指定的 aaa bbb ccc ...库 当指定的库未编译时不会进行测试
   ```

## TODO

支持同一个库，不同版本的编译
    1.库的依赖也可添加依赖的版本，实际版本大于等于依赖时，才可以编译
