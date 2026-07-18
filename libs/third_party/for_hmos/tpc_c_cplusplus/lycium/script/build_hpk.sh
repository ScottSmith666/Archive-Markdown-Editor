#!/bin/bash

# 退出码检查
sure() {
    eval $*
    err=$?
    if [ "$err" != "0" ]
    then
        echo "ERROR during : $*"
        echo "ERROR during : $*: $err" > last_error
        exit 1
    fi
}

PKGBUILD_ROOT=$(cd $(dirname ${BASH_SOURCE[0]}); pwd)

# 下载库压缩包
# 参数1 链接地址
# 参数2 压缩包名
download() {
    if [ -s ${PWD}/$2 ]
    then
        echo ${PWD}/$2"，存在"
    else
        echo "Downloading "$2
        wget "$1" -O ${PWD}/$2 -o download.log
        return $?
    fi
}

# 解压库
# 参数1 压缩包名
unpack() {
    if [ -f ${PWD}/$1 ]
    then
        if [[ "$1" == *.tar.gz ]]
        then
            tar -zxvf ${PWD}/$1 > /dev/null
        elif [[ "$1" == *.tgz ]]
        then
            tar -zxvf ${PWD}/$1 > /dev/null
        
        elif [[ "$1" == *.tar.xz ]]
        then
            tar -xvJf ${PWD}/$1 > /dev/null
        elif [[ "$1" == *.tar.bz2 ]]
        then
            tar -xvjf ${PWD}/$1 > /dev/null
        elif [[ "$1" == *.zip ]]
        then
            unzip ${PWD}/$1 > /dev/null
        else
            echo "ERROR Package Format!"
            exit 2
        fi
    else
        echo "ERROR Package Not Found!"
        exit 2
    fi
}

# 加载库信息
source ${PWD}/HPKBUILD

# 库的完整性校验
checksum() {
    sha512sum -c ${PWD}/$1
    ret=$?
    return $ret
}

newdeps=()
builddepends() {
    donelist=($*)
    # 如果有依赖没有编译完，则跳过编译后续再次编译
    deplen=${#depends[*]}
    count=0
    for depend in ${depends[@]}
    do
        doneflag=false
        for donelib in ${donelist[@]}
        do
            if [ $depend == $donelib ]
            then
                count=$((count+1))
                doneflag=true
            fi
        done
        # 记录未编译的依赖项
        # echo $doneflag
        if ! $doneflag
        then
            # echo -----------
            newdeps[${#newdeps[@]}]=$depend
        fi
    done
    if [ $count -ne $deplen ]
    then
        return 101
    fi
    return 0
}

recordbuildlibs() {
    echo $2,$3,$1>> $LYCIUM_ROOT/usr/hpk_build.csv
}

buildargs=
pkgconfigpath=
cmakedependpath() { # 参数1为cpu type
    buildargs="-LH -DCMAKE_BUILD_TYPE=Release -DCMAKE_SKIP_RPATH=ON -DCMAKE_SKIP_INSTALL_RPATH=ON -DCMAKE_TOOLCHAIN_FILE=${OHOS_SDK}/native/build/cmake/ohos.toolchain.cmake -DCMAKE_INSTALL_PREFIX=$LYCIUM_ROOT/usr/$pkgname/$1/ -G \"Unix Makefiles\" -DOHOS_ARCH=$1 "
    pkgconfigpath=""
    if [ ${#depends[@]} -ne 0 ] 
    then
        tmppath="\""
        for depend in ${depends[@]}
        do
            dependpath=$LYCIUM_ROOT/usr/$depend/$1/
            tmppath=$tmppath"${dependpath};"

            dependpkgpath=$LYCIUM_ROOT/usr/$depend/$1/lib/pkgconfig
            if [ -d ${dependpkgpath} ]
            then
                pkgconfigpath=$pkgconfigpath"${dependpkgpath}:"
            fi
        done
        tmppath=${tmppath%;*}
        pkgconfigpath=${pkgconfigpath%:*}
        tmppath=$tmppath"\""
        buildargs=$buildargs"-DCMAKE_FIND_ROOT_PATH="$tmppath
    fi
}

configuredependpath() {
    pkgconfigpath=""
    buildargs="--prefix=$LYCIUM_ROOT/usr/$pkgname/$1/"
    if [ ${#depends[@]} -ne 0 ] 
    then
        for depend in ${depends[@]}
        do
            dependpath=$LYCIUM_ROOT/usr/$depend/$1/lib/pkgconfig
            if [ ! -d ${dependpath} ]
            then
                continue
            fi
            pkgconfigpath=$pkgconfigpath"${dependpath}:"
        done
        pkgconfigpath=${pkgconfigpath%:*}
    fi
}

checkmakedepends() {
    ismakedependready=true
    for makedepend in ${makedepends[@]}
    do
        which $makedepend >/dev/null 2>&1
        if [ $? -ne 0 ]
        then
            echo "请先安装 $makedepend 命令, 才可以编译 $1"
            ismakedependready=false
        fi
    done
    if ! $ismakedependready
    then
        echo "!!! 退出 $1 编译 !!!"
        exit 1
    fi
}

buildlog=
publicbuildlog=
builpackage() {
    donelist=($*)
    builddepends "${donelist[*]}"
    if [ $? -eq 101 ]
    then
        echo $pkgname" not ready. wait "${newdeps[*]}
        for dep in ${newdeps[@]}
        do
            echo $dep >> ${LYCIUM_DEPEND_PKGNAMES}
        done
        exit 101
    fi
    echo "Start building $pkgname $pkgver!"
    if [ ! $downloadpackage ] || [ $downloadpackage != false ]
    then
        sure download $source $packagename
        if [ -f "SHA512SUM" ]
        then
            # 判断新下载的源码压缩包正确性。如果失败退出编译，不删除，下载的压缩包
            checksum SHA512SUM
            ret=$?
            if [ $ret -ne 0 ]
            then
                echo "SHA512SUM 校验失败, 请确认 SHA512SUM 无误后, 重新编译"
                exit $ret
            fi
        fi
    fi
    if [ ! $autounpack ] || [ $autounpack != false ]
    then
        sure unpack $packagename
    fi
    
    checkmakedepends $pkgname
    for arch in ${archs[@]}
    do
        # TODO archs1 编译失败，继续编译archs2
        echo "Compileing OpenHarmony $arch $pkgname $pkgver libs..." 
        ARCH=$arch
        buildlog=$PKGBUILD_ROOT/$pkgname-$pkgver-$ARCH"-lycium_build.log"
        publicbuildlog=$PKGBUILD_ROOT/$pkgname"-public-lycium_build.log"
        sure prepare
        if [ ! $buildtools ] || [ $buildtools == "cmake" ]
        then
            sure cmakedependpath $ARCH
        elif [ $buildtools == "configure" ]
        then
            sure configuredependpath $ARCH
        else
            :
        fi
        sure build $buildargs
        sure package
        if [ -n "${LYCIUM_BUILD_CHECK}" ]
        then
            if [ ${LYCIUM_BUILD_CHECK} == "true" ]
            then
                sure check
            fi
        fi
        f=`type -t recoverpkgbuildenv`
        if [ "x$f" = "xfunction" ]
        then
            sure recoverpkgbuildenv
        fi
        sure recordbuildlibs $ARCH $pkgname $pkgver
    done
    echo "Build $pkgname $pkgver end!"
}

cleanhpk() {
    sure cleanbuild
    # 提前校验已存在的压缩包, 非法则清理. 待后续新下载
    if [ -s ${PWD}/$packagename ]
    then
        if [ -f "SHA512SUM" ]
        then
            checksum SHA512SUM
            ret=$?
            if [ $ret -ne 0 ]
            then
                rm -f ${PWD}/$packagename
            fi
        fi
    fi
    rm -rf *-lycium_build.log
}

main() {
    # 清理上次的环境
    sure cleanhpk
    # 编译 PKG
    sure builpackage $*
}

main $*
