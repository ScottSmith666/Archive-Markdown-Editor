#!/usr/bin/bash

function build_busybox() {
    
#    local file=.config
#    make defconfig
#    sed -i 's/# CONFIG_STATIC is not set/CONFIG_STATIC=y/' $file

    cp ../busybox.config .config
    make -j8
    if [ $? -ne 0 ]; then
        echo "build busybox failed!"
        return 1
    fi
    
    cp ./busybox ../

    echo "build busybox success!"

    return 0
}

function download_busybox() {
    local retry=0

    while [ $retry -le 5 ]
    do
        if [ ! -z "$2" ]; then
            git clone $1 -b $2
        else
            git clone $1
        fi

        if [ $? -eq 0 ]; then
            break;
        fi
    done

    if [ $retry -eq 5 ]; then
        echo "download busybox failed!"
        return 1
    else
        echo "download busybox success!"
        return 0
    fi
}

ERR_MSG="BUILD busybox ERROR!!!!!!!!!!!!!!!!!!!!!"
target_name=busybox
curdir=`pwd`
srcdir=$1
topdir=$2
cpu=$3
url="https://github.com/mirror/busybox.git"
ver=1_36_0
CONFIG_FILE=${topdir}third_party/busybox/adapted/busybox.config
source_dir=$target_name-$ver
COMPILE_PATH=${topdir}prebuilts/gcc/linux-x86/arm/gcc-linaro-7.5.0-arm-linux-gnueabi/bin

if [ "${cpu}" == "arm" ]; then
    export CROSS_COMPILE=${topdir}prebuilts/gcc/linux-x86/arm/gcc-linaro-7.5.0-arm-linux-gnueabi/bin/arm-linux-gnueabi-
elif [ "${cpu}" == "arm64" ]; then
    export CROSS_COMPILE=${topdir}prebuilts/gcc/linux-x86/aarch64/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-
else
    echo "cant not support this cpu(${cpu}) type!!!"
    exit 1
fi

if [ -z "$srcdir" ];then
    echo "must set the param dir!"
    exit 1
fi

cp $CONFIG_FILE $srcdir/

cd $srcdir

if [ ! -d "$source_dir" ]; then
    download_busybox $url $ver
    if [ $? -ne 0 ]; then
        echo $ERR_MSG
        exit 1
    fi

    mv ./$target_name ./$source_dir
fi

cd $source_dir

build_busybox
if [ $? -ne 0 ]; then
    echo $ERR_MSG
    exit 1
fi

cd $curdir

#eof
