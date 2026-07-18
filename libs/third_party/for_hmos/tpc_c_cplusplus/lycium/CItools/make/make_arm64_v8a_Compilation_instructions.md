# make 工具arm64-v8a交叉编译说明

## 简介
GNUMake是一种工具，用于控制从程序的源文件生成程序的可执行文件和其他非源文件。

本文档主要介绍其arm64位交叉编译步骤

## 编译步骤

### 编译工具链下载

- 64位编译工具：gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu.tar.xz  [下载链接](https://releases.linaro.org/components/toolchain/binaries/7.5-2019.12/aarch64-linux-gnu/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu.tar.xz)

### 解压编译工具链

- 解压64位 tar xvJf gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu.tar.xz


- 进入解压后的文件夹，查看bin目录下就有我们编译用到的工具链

### 下载解压make源码

- 下载最新版本的make源码 https://ftp.gnu.org/gnu/make/make-4.4.1.tar.gz (以4.4.1为例)
- 通过tar命令解压源码 tar -xzvf make-4.4.1.tar.gz

### 创建编译目录

- 进入源码解压后目录 cd make-4.4.1

- 创建64位编译目录 mkdir arm64_v8a

### 设置交叉编译环境

- 设置64位交叉编译环境, xxx 是表示工具链存放的目录路径


```shell
export TOOLS=/xxx/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin
export AS=${TOOLS}/aarch64-linux-gnu-as
export CC=${TOOLS}/aarch64-linux-gnu-gcc
export CXX=${TOOLS}/aarch64-linux-gnu-g++
export LD=${TOOLS}/aarch64-linux-gnu-ld
export STRIP=${TOOLS}/aarch64-linux-gnu-strip
export RANLIB=${TOOLS}/aarch64-linux-gnu-ranlib
export OBJDUMP=${TOOLS}/aarch64-linux-gnu-objdump
export OBJCOPY=${TOOLS}/aarch64-linux-gnu-objcopy
export NM=${TOOLS}/aarch64-linux-gnu-gcc-nm
export AR=${TOOLS}/aarch64-linux-gnu-ar
```

### 生成makefile

- 进入64位编译路径 cd arm64_v8a
- 执行如下命令生成Makefile

```shell
../configure --host="aarch64-linux" --prefix="${PWD}/install" 
```

- 修改Makefile，将AM_LDFLAGS = -Wl,--export-dynamic 改成AM_LDFLAGS = 即删除后面的-Wl,--export-dynamic

### 编译make源码

在对应的编译目录执行make CFLAGS="-static" LDFLAGS="-static" VERBOSE=1，执行结果截图如下

&nbsp;![success](media/build_success_64.png)

### 安装make

在对应编译目录执行 make install，执行结果截图如下：

&nbsp;![makesuccess](media/make_64_install.png)

### 编译安装完成

查看编译目录下的install文件夹，并可通过file bin/make 看到文件属性

&nbsp;![file64](media/file_64.png)

### 运行结果

将安装目录install文件夹压缩打包，发送到OHOS开发板中

```shell
#打包对应编译目录下的install文件夹
tar -zcvf install.tar.gz install/
#发送到OHOS系统开发板上
hdc file send xxx\install.tar.gz /data   
#进入开发板/data，解压install.tar.gz
hdc shell
cd /data
tar -zxvf install.tar.gz
```

进入install/bin目录，执行./make -version 效果如下截图 

&nbsp;![run_file](./media/make_run.png)
