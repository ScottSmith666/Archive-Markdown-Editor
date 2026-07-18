#!/bin/bash

setarm32ENV() {
    export AS=${OHOS_SDK}/native/llvm/bin/llvm-as
    export CC=${OHOS_SDK}/native/llvm/bin/arm-linux-ohos-clang
    export CXX=${OHOS_SDK}/native/llvm/bin/arm-linux-ohos-clang++
    export LD=${OHOS_SDK}/native/llvm/bin/ld.lld
    export STRIP=${OHOS_SDK}/native/llvm/bin/llvm-strip
    export RANLIB=${OHOS_SDK}/native/llvm/bin/llvm-ranlib
    export OBJDUMP=${OHOS_SDK}/native/llvm/bin/llvm-objdump
    export OBJCOPY=${OHOS_SDK}/native/llvm/bin/llvm-objcopy
    export NM=${OHOS_SDK}/native/llvm/bin/llvm-nm
    export AR=${OHOS_SDK}/native/llvm/bin/llvm-ar
    export CFLAGS="-DOHOS_NDK -fPIC -march=armv7a -D__MUSL__=1 -O3"
    export CXXFLAGS="-DOHOS_NDK -fPIC -march=armv7a -D__MUSL__=1 -O3"
    export LDFLAGS=""
}

unsetarm32ENV() {
    unset AS CC CXX LD STRIP RANLIB OBJDUMP OBJCOPY NM AR CFLAGS CXXFLAGS LDFLAGS
}

setarm64ENV() {
    export AS=${OHOS_SDK}/native/llvm/bin/llvm-as
    export CC=${OHOS_SDK}/native/llvm/bin/aarch64-linux-ohos-clang
    export CXX=${OHOS_SDK}/native/llvm/bin/aarch64-linux-ohos-clang++
    export LD=${OHOS_SDK}/native/llvm/bin/ld.lld
    export STRIP=${OHOS_SDK}/native/llvm/bin/llvm-strip
    export RANLIB=${OHOS_SDK}/native/llvm/bin/llvm-ranlib
    export OBJDUMP=${OHOS_SDK}/native/llvm/bin/llvm-objdump
    export OBJCOPY=${OHOS_SDK}/native/llvm/bin/llvm-objcopy
    export NM=${OHOS_SDK}/native/llvm/bin/llvm-nm
    export AR=${OHOS_SDK}/native/llvm/bin/llvm-ar
    export CFLAGS="-DOHOS_NDK -fPIC -D__MUSL__=1"
    export CXXFLAGS="-DOHOS_NDK -fPIC -D__MUSL__=1"
    export LDFLAGS=""
}

unsetarm64ENV() {
    unset AS CC CXX LD STRIP RANLIB OBJDUMP OBJCOPY NM AR CFLAGS CXXFLAGS LDFLAGS
}

setx86_64ENV() {
    export AS=${OHOS_SDK}/native/llvm/bin/llvm-as
    export CC=${OHOS_SDK}/native/llvm/bin/x86_64-linux-ohos-clang
    export CXX=${OHOS_SDK}/native/llvm/bin/x86_64-linux-ohos-clang++
    export LD=${OHOS_SDK}/native/llvm/bin/ld.lld
    export STRIP=${OHOS_SDK}/native/llvm/bin/llvm-strip
    export RANLIB=${OHOS_SDK}/native/llvm/bin/llvm-ranlib
    export OBJDUMP=${OHOS_SDK}/native/llvm/bin/llvm-objdump
    export OBJCOPY=${OHOS_SDK}/native/llvm/bin/llvm-objcopy
    export NM=${OHOS_SDK}/native/llvm/bin/llvm-nm
    export AR=${OHOS_SDK}/native/llvm/bin/llvm-ar
    export CFLAGS="-DOHOS_NDK -fPIC -D__MUSL__=1"
    export CXXFLAGS="-DOHOS_NDK -fPIC -D__MUSL__=1"
    export LDFLAGS=""
}

unsetx86_64ENV() {
    unset AS CC CXX LD STRIP RANLIB OBJDUMP OBJCOPY NM AR CFLAGS CXXFLAGS LDFLAGS
}
