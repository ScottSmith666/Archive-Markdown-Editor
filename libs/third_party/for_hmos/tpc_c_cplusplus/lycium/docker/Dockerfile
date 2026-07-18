# 设置系统
FROM ubuntu:22.04
LABEL authors="huabucheng"
LABEL version="0.1"
LABEL description="Lycium 编译环境"

# copy 当前目录（Dockerfile 当前目录）sources.list，到/etc/apt
COPY sources.list /etc/apt
RUN cat /etc/apt/sources.list
# 安装必要程序
# RUN timedatectl set-timezone Asia/Hong_Kong
RUN ln -snf /usr/share/zoneinfo/Asia/Hong_Kong /etc/localtime && echo "Asia/Hong_Kong" > /etc/timezone
RUN apt update
RUN apt install -y --reinstall ca-certificates
RUN apt update
RUN apt install -y curl git vim gcc g++ make pkg-config autoconf automake patch libtool autopoint gperf \
    tcl8.6-dev wget unzip gccgo-go flex bison premake4 python3 python3-pip ninja-build meson sox gfortran \
    subversion build-essential module-assistant gcc-multilib g++-multilib libltdl7-dev cabextract \
    libboost-all-dev libxml2-utils gettext libxml-libxml-perl libxml2 libxml2-dev libxml-parser-perl \
    texinfo xmlto po4a libtool-bin yasm nasm xutils-dev libx11-dev xtrans-dev

# 升级 meson
RUN pip3 install meson==1.1.1

RUN mkdir -p /data/bin
WORKDIR /data/bin
# 下载安装系统 cmake
RUN curl -L https://cmake.org/files/v3.26/cmake-3.26.4-linux-x86_64.tar.gz --output cmake-3.26.4-linux-x86_64.tar.gz
RUN tar -zxf cmake-3.26.4-linux-x86_64.tar.gz
ENV PATH=/data/bin/cmake-3.26.4-linux-x86_64/bin:$PATH
# 创建工作目录
RUN mkdir -p /data/ohos
ENV LYCIUM_BUILD_CHECK=false

WORKDIR /data
CMD /bin/bash
