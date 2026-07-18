#!/usr/bin/bash
# 此脚本运行在OpenHarmony环境
# 根目录
LYCIUM_ROOT=`pwd`
export LYCIUM_ROOT=$LYCIUM_ROOT
export OHOS_SDK_VER=OpenHarmony_4.0.8.1                 # 具体SDK, 版本需要用户填写
ARCH=
hpkPaths=()
successlibs=()
failedlibs=()

LYCIUM_THIRDPARTY_ROOT=${LYCIUM_ROOT}/../thirdparty
CHECK_RESULT_PATH=$LYCIUM_ROOT/check_result              # 收集测试结果(log以及生成资源)的目录
LOG_PATH=$CHECK_RESULT_PATH/check_log                     # 收集测试log的目录
export LYCIUM_FAULT_PATH=$CHECK_RESULT_PATH/check_fault          # 收集组件测试错误日志，该目录需要创建组件名，日志最终路径为 $CHECK_RESULT_PATH/check_fault/${pkgname}/fault.log
export LYCIUM__MANUAL_CONFIRM_PATH=$CHECK_RESULT_PATH/manual_confirm  # 手动确认信息(组件生成的如图片，音视频文件等),该目录需要创建组件名，文件最终路径为 $CHECK_RESULT_PATH/manual_confirm/${pkgname}/xxx.wav
export LYCIUM_THIRDPARTY_ROOT=${LYCIUM_THIRDPARTY_ROOT}

envmessage="please follow the CITools instruction: https://gitee.com/openharmony-sig/tpc_c_cplusplus/tree/master/lycium/CItools"

# 检查测试环境
checktestenv(){
    if [ ! -d $LOG_PATH ]
    then
        mkdir -p $LOG_PATH
    fi
    if [ ! -d $LYCIUM_FAULT_PATH ]
    then
        mkdir -p $LYCIUM_FAULT_PATH
    fi

    if [ ! -d $LYCIUM__MANUAL_CONFIRM_PATH ]
    then
        mkdir -p $LYCIUM__MANUAL_CONFIRM_PATH
    fi

    which cmake >/dev/null 2>&1
    if [ $? -ne 0 ]
    then
        echo "cmake command not found, "$envmessage
        exit 1
    fi

    which make >/dev/null 2>&1
    if [ $? -ne 0 ]
    then
        echo "make command not found, "$envmessage
        exit 1
    fi

    which ctest >/dev/null 2>&1
    if [ $? -ne 0 ]
    then
        echo "ctest command not found, "$envmessage
        exit 1
    fi

    which perl >/dev/null 2>&1
    if [ $? -ne 0 ]
    then
        echo "perl command not found, "$envmessage
        exit 1
    fi
}

# 获取CPU架构
getcpuarchitecture(){

    cpubits=`getconf LONG_BIT`

    if [ ${cpubits} == "64" ]
    then
        ARCH=arm64-v8a
    fi
    if [ ${cpubits} == "32" ]
    then
        ARCH=armeabi-v7a
    fi

    export ARCH
}

# 设置依赖库路径
setloaddynamiclibrarypath(){
    libdir=${LYCIUM_ROOT}/usr
    for lib in `ls $libdir`
    do
        if [ -d $libdir/$lib ]
        then
            export LD_LIBRARY_PATH=$libdir/$lib/$ARCH/lib:$LD_LIBRARY_PATH
        fi
    done
}

# 搜索已编译的库列表
findlibsdir(){
    jobs=($*)
    for job in ${jobs[@]}
    do
        tmppath=${LYCIUM_ROOT}/usr/$job     # 查找已编译的库路径
        if [ -d $tmppath ]
        then
            hpkPaths[${#hpkPaths[@]}]=${LYCIUM_THIRDPARTY_ROOT}/$job  # 记录库编译路径
        fi
    done
}

# 获取已编译的三方库列表
findbuilddir(){
    tmplibs=()
    for file in $(ls $1)
    do
        if [ -d $1/$file ]
        then
            tmplibs[${#tmplibs[@]}]=$file
        fi
    done
    findlibsdir ${tmplibs[@]}
}

# 开始测试三方库
checkhpk(){
    for libdir in ${hpkPaths[*]}
    do
        if [ ! -f $libdir/HPKCHECK ]
        then
          #  echo "${libdir##*/} no test!"
            continue;
        fi
        cd $libdir
        echo "start check ${libdir##*/}"
        source ./HPKCHECK
        f=`type -t checkprepare`
        if [ "x$f" = "xfunction" ]
        then
            checkprepare > /dev/null 2>&1       # 执行测试前准备工作
        fi
        openharmonycheck > /dev/null 2>&1   # 执行测试
        checkret=$?
        if [ $checkret -ne 0 ]
        then
            failedlibs[${#failedlibs[@]}]=${libdir##*/}
            echo -e "check ${libdir##*/} \033[31m failed \033[0m"   # 红色显示失败
        else
            successlibs[${#successlibs[@]}]=${libdir##*/}
            echo -e "check ${libdir##*/} \033[32m success \033[0m"     # 绿色显示成功
        fi
        
        if [ -f ${libdir##*/}_${ARCH}_${OHOS_SDK_VER}_test.log ]
        then
            cp ${libdir##*/}_${ARCH}_${OHOS_SDK_VER}_test.log $LOG_PATH    # 将测试的log收集到指定目录
            if [ $checkret -ne 0 ]
            then
                mkdir -p $LYCIUM_FAULT_PATH/${libdir##*/}
                cp ${libdir##*/}_${ARCH}_${OHOS_SDK_VER}_test.log $LYCIUM_FAULT_PATH/${libdir##*/}
            fi
        fi

        cd $OLDPWD
    done

    echo "################################################"
    echo "CHECK REPORT : "
    let total=${#failedlibs[*]}+${#successlibs[*]}
    echo "TEST TOTAL LIBS : $total"
    echo "TEST FAILED : ${#failedlibs[*]}"
    if [ ${#failedlibs[*]} -gt 0 ]
    then
        echo "FAILED TEST ARE:"
        for ((i=0;i<${#failedlibs[*]};i++))
        do
            echo "${failedlibs[$i]}"
        done
    fi
    echo "################################################"

    return 0
}

main(){
    mount -o remount,rw /
    # 环境检测
    checktestenv
    getcpuarchitecture
    # 动态库准备
    setloaddynamiclibrarypath

    if [ $# -ne 0 ]
    then
        findlibsdir $*
    else
        findbuilddir ${LYCIUM_ROOT}/usr
    fi
    # 运行所有发现的测试
    checkhpk

    unset LYCIUM_ROOT
    unset LD_LIBRARY_PATH
    unset OHOS_SDK_VER
    unset ARCH
}

main $*
