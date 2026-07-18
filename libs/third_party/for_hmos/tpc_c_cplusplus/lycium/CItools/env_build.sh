#!/bin/sh

mount -o remount,rw /

PREFIX=/
BIN_DIR=${PREFIX}usr/bin
OHOS_NDK_BIN=/ohos-sdk/linux/native/build-tools/cmake/bin/
TAR_SUFFIX=tar.gz

CMAKE=cmake_make
BUSYBOX=busybox
PERL=perl
SHELL_CMD=shell_cmd

HOST=arm

if [ ! -d ${BIN_DIR} ]; then
    echo "create bin dir!"
    mkdir -p ${BIN_DIR}
    chmod -R 777 ${BIN_DIR}
fi
if [ ! -d ${PREFIX}/bin ]; then
    echo "create bin dir!"
    mkdir -p ${PREFIX}/bin
    chmod -R 777 ${PREFIX}/bin
fi

if [ "$1" == "aarch64" ];then
    HOST=aarch64
fi

function unpack(){
    if [ ! -f $1 ];then
        echo "no such file or directory: $1"
        exit 1
    fi

    tar -zxf $1
    if [ $? -ne 0 ];then
        echo "unpack $1 failed!"
        exit 1
    fi

    echo "unpack $1 success!"
    return 0
}

function copy_files(){
    if [ ! -d $1 ]; then
        echo "no such file or directory : $1"
        exit 1
    fi

    cp -arf $1/bin/* ${BIN_DIR}/

    if [ $? -ne 0 ]; then
        echo "cp files error!"
        exit 1
    fi

    echo "cp $1 files success"
    return 0
}

function set_busybox(){
    CMD_ARRAY=("diff" "tr" "expr" "awk")
    cp ${HOST}_${BUSYBOX}/bin/busybox ${PREFIX}/bin/
    if [ $? -ne 0 ];then
        echo "copy busybox failed!"
        exit 1
    fi

    cur_dir=`pwd`
    cd ${PREFIX}/bin

    for cmd in ${CMD_ARRAY[@]}
    do
        echo "cmd : ${cmd}"
        if [ -f $cmd ]; then
            rm ${cmd}
        fi
        ln -s busybox ${cmd}
        if [ $? -ne 0 ]; then
            echo " create ${cmd} link failed!"
            cd ${cur_dir}
            exit 1
        fi
    done

    cd ${cur_dir}

    return 0
}

function copyBinFiles(){
    BinFils=("sed" "env")
    cur_dir=`pwd`
    cd /bin/

    for bin in ${BinFils[@]}
    do
        cp ${bin} ${BIN_DIR}/
    done

    cd ${cur_dir}

    return 0
}

echo "start install the CI env tools"

CMAKE_TAR=${HOST}_${CMAKE}.${TAR_SUFFIX}
unpack ${CMAKE_TAR}
if [ $? -ne 0 ]; then
    echo "unpack cmake failed!"
    exit 1
fi
copy_files ${HOST}_${CMAKE}
if [ $? -ne 0 ];then
    echo "cp cmake files failed!"
    exit 1
fi
rm -rf ${HOST}_${CMAKE}

BUSYBOX_TAR=${HOST}_${BUSYBOX}.${TAR_SUFFIX}
unpack ${BUSYBOX_TAR}
if [ $? -ne 0 ]; then
    echo "unpack busybox failed!"
    exit 1
fi
set_busybox
rm -rf ${HOST}_${BUSYBOX}

PERL_TAR=${HOST}_${PERL}.${TAR_SUFFIX}
unpack ${PERL_TAR}
if [ $? -ne 0 ];then
    echo "unpack perl failed!"
    exit 1
fi

cp -arf ${HOST}_${PERL}/* ${PREFIX}/usr/
if [ $? -ne 0 ];then
    echo "cp perl files failed!"
    exit 1
fi

SHELL_CMD_TAR=${HOST}_${SHELL_CMD}.${TAR_SUFFIX}
unpack ${SHELL_CMD_TAR}
if [ $? -ne 0 ]; then
    echo "unpack shell cmd failed!"
    exit 1
fi
copy_files ${HOST}_${SHELL_CMD}
if [ $? -ne 0 ];then
    echo "cp cmd shell files failed!"
    exit 1
fi
rm -rf ${HOST}_${SHELL_CMD}

echo "check ohos-sdk"
if [ ! -d ${OHOS_NDK_BIN} ]; then
    mkdir -p ${OHOS_NDK_BIN}
fi
cp /usr/bin/cmake ${OHOS_NDK_BIN}
cp /usr/bin/ctest ${OHOS_NDK_BIN}

copyBinFiles

echo "set CI env success!!"
