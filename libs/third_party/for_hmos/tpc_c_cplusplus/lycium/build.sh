#!/bin/bash

unames=`uname -s`
osname=${unames:0:5}

# 根目录
LYCIUM_ROOT=
buildcheckflag=true
if [ "$osname" == "Linux" ]
then
    echo "Build OS linux"
    LYCIUM_ROOT=$(cd $(dirname ${BASH_SOURCE[0]}); pwd)
elif [ "$osname" == "CYGWI" ] # CYGWIN
then
    echo "Build OS CYGWIN"
    lyciumroot=`cygpath -w $PWD`
    LYCIUM_ROOT=${lyciumroot//\\/\/}
    buildcheckflag=false
elif [ "$osname" == "Darwi" ] # Darwin
then
    echo "Build OS Darwin"
    LYCIUM_ROOT=$(cd $(dirname ${BASH_SOURCE[0]}); pwd)
    buildcheckflag=false
else
    echo "System cannot recognize, exiting"
    exit 0
fi
export LYCIUM_BUILD_CHECK=$buildcheckflag
export LYCIUM_BUILD_OS=$osname
export LYCIUM_ROOT=$LYCIUM_ROOT

export MAKE="make -j8"
export Ninja="ninja -j8"

if [ -z ${OHOS_SDK} ]
then
    echo "OHOS_SDK 未设置, 请先下载安装ohos SDK, 并设置OHOS_SDK环境变量. "
    exit 1
fi
echo "OHOS_SDK="${OHOS_SDK}
CLANG_VERSION_STR=$(echo __clang_version__ | $OHOS_SDK/native/llvm/bin/clang -E -xc - | tail -n 1)
CLANG_VERSION_ARR=(${CLANG_VERSION_STR//,/ })
CLANG_VERSION_1=${CLANG_VERSION_ARR[0]}
CLANG_VERSION=${CLANG_VERSION_1: 1}
echo "CLANG_VERSION="${CLANG_VERSION}
export CLANG_VERSION=${CLANG_VERSION}
jobFlag=true

# 依赖库暂存文件
while :
do
    build_time=`date +%s`
    depend_tmp_file="/tmp/$USER-lycium_deps-$build_time"
    if [ -f $depend_tmp_file ]
    then
        sleep 2 # 杜绝重复的，依赖库暂存文件
    else
        export LYCIUM_DEPEND_PKGNAMES=$depend_tmp_file
        break
    fi
done

hpksdir="../thirdparty/" # 所有 hpk 项目存放的目录
communitydir="../community"

preparetoolchain() {
    # 检查工具链，不存在则解压工具链
    if [ ! -f $OHOS_SDK/native/llvm/bin/aarch64-linux-ohos-clang ] ||
       [ ! -f $OHOS_SDK/native/llvm/bin/aarch64-linux-ohos-clang++ ] ||
       [ ! -f $OHOS_SDK/native/llvm/bin/arm-linux-ohos-clang ] ||
       [ ! -f $OHOS_SDK/native/llvm/bin/arm-linux-ohos-clang++ ] ||
       [ ! -f $OHOS_SDK/native/llvm/bin/aarch64-linux-ohos-clang.cmd ] ||
       [ ! -f $OHOS_SDK/native/llvm/bin/aarch64-linux-ohos-clang++.cmd ] ||
       [ ! -f $OHOS_SDK/native/llvm/bin/arm-linux-ohos-clang.cmd ] ||
       [ ! -f $OHOS_SDK/native/llvm/bin/arm-linux-ohos-clang++.cmd ]
    then
        tar xvf Buildtools/toolchain.tar.gz
        cp -rfa toolchain/* $OHOS_SDK/native/llvm/bin
        rm -rf toolchain
    fi
}

checkbuildenv() {
    cmdlist=("gcc" "g++" "cmake" "make" "pkg-config" "autoconf" "autoreconf" "automake" \
             "patch" "unzip" "tar" "git" "ninja" "curl" "sha512sum" "wget")
    for cmd in ${cmdlist[@]}
    do
        which $cmd >/dev/null 2>&1
        if [ $? -ne 0 ]
        then
            echo "$cmd 命令未安装, 请先安装 $cmd 命令"
            exit 1
        fi
    done

    if [ ! -d $LYCIUM_ROOT/usr ]
    then
        echo "创建 $LYCIUM_ROOT/usr 目录"
        mkdir -p $LYCIUM_ROOT/usr
    fi

}

hpkPaths=()
donelist=()
donelibs=()
communitylibs=()
readdonelibs() {
    if [ -f $1 ]
    then
        count=0
        while read line
        do
            doneflags=false
            libinfos=(${line//,/ })
            libname=${libinfos[0]}
            for lib in ${donelibs[@]}
            do
                if [ $lib == $libname ]
                then
                    doneflags=true
                fi
            done
            if ! $doneflags
            then
                donelibs[$count]=$libname
                count=$((count+1))
            fi
            
        done < $1
    fi
    donelist=(${donelibs[@]})
}

collectcommunitylibs() {
    for file in $(ls $LYCIUM_ROOT/$1)
    do
        if [ -d $1/$file ]
        then
            communitylibs[${#communitylibs[@]}]=$LYCIUM_ROOT/$1/$file
        fi
    done
}

makelibsdir() {
    jobs=($*)
    for job in ${jobs[@]}
    do
        doneflags=false
        for donelib in ${donelibs[@]}
        do
            libname=${job##*/} # 截取库名
            if [ $donelib == $libname ]
            then
                doneflags=true
            fi
        done
        if $doneflags
        then
            continue
        fi
        if [[ -d $job && -f $job/HPKBUILD ]]
        then
            hpkPaths[${#hpkPaths[@]}]=$job
        fi
    done
}

findarglibsdir() {
    libs=($*)
    tmplibs=()
    for lib in ${libs[@]}
    do
        tmplib=$LYCIUM_ROOT/$hpksdir/$lib
        if [[ -d $tmplib && -f $tmplib/HPKBUILD ]]
        then
            tmplibs[${#tmplibs[@]}]=$tmplib
        fi
    done
    if [ ${#tmplibs[@]} -eq 0 ]
    then
        echo "find libs failed!"
        return 1
    fi

    makelibsdir ${tmplibs[@]}
    return 0
}

# 找到 $1 目录下的所有目录
# 参数1 为项目根路径
findhpkdir() {
    tmplibs=()
    for file in $(ls $LYCIUM_ROOT/$1)
    do
        if [ -d $1/$file ]
        then
            tmplibs[${#tmplibs[@]}]=$LYCIUM_ROOT/$1/$file
        fi
    done
    makelibsdir ${tmplibs[@]}
}

# 进入每一个目录 将script 目录下的脚本都链接过去
prepareshell() {
    pkgPaths=($*)
    for hpkdir in ${pkgPaths[@]}
    do
        cd $hpkdir
        ln -fs $LYCIUM_ROOT/script/build_hpk.sh build_hpk.sh
        ln -fs $LYCIUM_ROOT/script/envset.sh envset.sh
        cd ${OLDPWD}
    done
}

# 恢复脚本
cleanhpkdir() {
    for hpkdir in ${hpkPaths[@]}
    do
        rmovelinkfiles $hpkdir
    done
}

rmovelinkfiles() {
    rm -rf $1/build_hpk.sh $1/envset.sh
}

# 编译库本身
nextroundlist=()
notdonelist=()
buildfalselist=()
buildhpk() {
    nextroundlist=(${hpkPaths[*]})

    lastroundfirstjob=
    while $jobFlag
    do
        lastroundlen=${#nextroundlist[*]}
        notdonelist=(${nextroundlist[*]})
        nextroundlist=()
        len=${#notdonelist[*]}
        for ((i=0; i < $len; i=i+1))
        do
            
            cd ${notdonelist[$i]}
            echo "start build ${notdonelist[$i]}" > $LYCIUM_ROOT/lycium_build_intl.log
            bash ${PWD}/build_hpk.sh "${donelist[*]}" # > blackhole.log 2>&1  #入参已经完成的list
            res=$?
            if [ $res -eq 0 ]
            then
                isdone=false
                for libname in ${donelist[@]}
                do
                    if [ ${notdonelist[$i]##*/} == $libname ]
                    then
                        isdone=true
                    fi
                done
                if ! $isdone
                then
                    rmovelinkfiles ${notdonelist[$i]}
                    donelist[${#donelist[@]}]=${notdonelist[$i]##*/}
                fi
                echo donelist:${donelist[*]} > $LYCIUM_ROOT/lycium_build_intl.log
            elif [ $res -eq 101 ]
            then
                if [ -f ${LYCIUM_DEPEND_PKGNAMES} ]
                then
                    # echo "添加依赖"
                    for deppkg in `cat ${LYCIUM_DEPEND_PKGNAMES}`
                    do
                        # find in hpksdir
                        tmppath=$LYCIUM_ROOT/$hpksdir/$deppkg
                        if [[ -d $tmppath  && -f $tmppath/HPKBUILD ]]
                        then
                            deppath=$tmppath
                        else
                            # find in communitydir
                            deppath=$LYCIUM_ROOT/$communitydir/$deppkg
                        fi

                        # 如果 deppath 合法，即将其添加到编译列表
                        if [[ -d $deppath  && -f $deppath/HPKBUILD ]]
                        then
                            doneflag=false
                            for libname in ${donelist[@]} # 不在已完成的列表中
                            do
                                if [ $deppath == $LYCIUM_ROOT/$hpksdir/$libname ]
                                then
                                    doneflag=true
                                fi
                            done
                            nextflag=false
                            for libname in ${nextroundlist[@]} # 不在待编译的列表中
                            do
                                if [ $deppath == $libname ]
                                then
                                    nextflag=true
                                fi
                            done
                            notdoneflag=false
                            for libname in ${notdonelist[@]} # 不在未完成的列表中
                            do
                                if [ $deppath == $libname ]
                                then
                                    notdoneflag=true
                                fi
                            done
                            buildfalseflag=false
                            for libname in ${buildfalselist[@]} # 不在编译失败的列表中
                            do
                                if [ $deppath == $libname ]
                                then
                                    buildfalseflag=true
                                fi
                            done
                            if ! $doneflag && ! $nextflag && ! $notdoneflag && ! $buildfalseflag # 添加到下一轮的编译中
                            then
                                nextroundlist[${#nextroundlist[@]}]=$deppath
                                hpkPaths[${#hpkPaths[@]}]=$deppath
                                prepareshell $deppath
                            fi
                            
                        fi
                    done
                    # echo "清空deps file"
                    echo > ${LYCIUM_DEPEND_PKGNAMES}
                fi
                
                roundflag=false
                for libname in ${nextroundlist[@]}
                do
                    if [ ${notdonelist[$i]} == $libname ]
                    then
                        roundflag=true
                    fi
                done
                if ! $roundflag
                then
                    nextroundlist[${#nextroundlist[@]}]=${notdonelist[$i]} # 将自己放在依赖库最后（如果有deps）
                fi
                echo nextroundlist:${nextroundlist[*]} > $LYCIUM_ROOT/lycium_build_intl.log
            else
                rmovelinkfiles ${notdonelist[$i]}
                echo "${notdonelist[$i]} build ERROR. errno: $res"
                buildfalselist[${#buildfalselist[@]}]=${notdonelist[$i]}
            fi
            cd ${OLDPWD}
        done
        if [ ${#nextroundlist[*]} -eq 0 ]
        then
            if [ ${#buildfalselist[*]} -eq 0 ]
            then
                echo "ALL JOBS DONE!!!"
            else
                echo "The follow pkg build error!"
                echo ${buildfalselist[*]}
            fi
            break
        fi
        if [[ $lastroundlen -eq ${#nextroundlist[*]} && $lastroundfirstjob == ${nextroundlist[0]} ]]
        then
            echo "Please check the dependencies of these items:"
            echo " "${nextroundlist[*]}
            if [ ${#buildfalselist[*]} -ne 0 ]
            then
                echo "The follow pkg build error!"
                echo ${buildfalselist[*]}
            fi
            jobFlag=false
        fi
        lastroundfirstjob=${nextroundlist[0]}
    done
}

main() {
    # 准备编译工具链
    preparetoolchain
    # 检查编译环境
    checkbuildenv
    # 读取编译记录
    readdonelibs "$LYCIUM_ROOT/usr/hpk_build.csv"
    # 搜集 communitydir 目录库
    collectcommunitylibs $communitydir
    # 搜集libs
    if [ $# -ne 0 ] # 参数个数不为 0
    then
        # 搜集指定的libs
        findarglibsdir $*
    else
        # 搜集所有可编译的库
        findhpkdir $hpksdir
    fi
    if [ $? -ne 0 ]
    then
        return 1
    fi
    # 准备脚本软链接
    prepareshell ${hpkPaths[@]}
    # 编译
    buildhpk
    # 清理
    cleanhpkdir
    unset LYCIUM_BUILD_OS LYCIUM_ROOT CLANG_VERSION
    return 0
}

main $*

if [ $? -ne 0 ]
then
    exit -1
fi

# 编译任务不成功, 返回-1
if [ ${#buildfalselist[*]} -ne 0 -o ${#nextroundlist[*]} -ne 0 ]
then
    exit -1
fi
