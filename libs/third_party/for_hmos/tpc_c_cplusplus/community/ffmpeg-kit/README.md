# 编译依赖库 FFmpeg

```
# Contributor: Jeff Han <hanjinfei@foxmail.com>
# Maintainer: Jeff Han <hanjinfei@foxmail.com>

pkgname=FFmpeg
pkgver=n6.1.2
pkgrel=0
pkgdesc="FFmpeg is a collection of libraries and tools to process multimedia content such as audio, video, subtitles and related metadata."
url="https://github.com/FFmpeg/FFmpeg/"
archs=("armeabi-v7a" "arm64-v8a")
license=("GPL2" "GPL3" "LGPL3" "MIT" "X11" "BSD-styl")
depends=("libvorbis" "libogg" "libvpx" "x264" "dav1d" "lame" "x265" "xvidcore" "vid.stab")
makedepends=()

# "https://github.com/FFmpeg/$pkgname/archive/refs/tags/$pkgver.tar.gz" # 官方仓 注意 packagename 后缀
# "https://gitee.com/openharmony-tpc-incubate/FFmpeg/repository/archive/n6.1.2"  # 硬解码适配分支
source="https://gitee.com/openharmony-tpc-incubate/$pkgname/repository/archive/$pkgver"

autounpack=true
downloadpackage=true
buildtools="configure"

builddir=$pkgname-${pkgver}
packagename=$builddir.zip
source envset.sh

arch=
ldflags=
prepare() {
    cp -rf $builddir $builddir-$ARCH-build

    if [ $ARCH == "armeabi-v7a" ]
    then
        setarm32ENV
        arch=arm
        ldflags="-L${OHOS_SDK}/native/sysroot/usr/lib/arm-linux-ohos"
    elif [ $ARCH == "arm64-v8a" ]
    then
        setarm64ENV
        arch=aarch64
        ldflags="-L${OHOS_SDK}/native/sysroot/usr/lib/aarch64-linux-ohos"
    else
        echo "${ARCH} not support"
        return -1
    fi
    export LDFLAGS="$LYCIUM_ROOT/usr/libogg/$ARCH/lib/libogg.a -L$LYCIUM_ROOT/usr/lame/$ARCH/lib/ \
                    -L$LYCIUM_ROOT/usr/libvorbis/$ARCH/lib/ -lvorbis \
                    -L$LYCIUM_ROOT/usr/xvidcore/$ARCH/lib/ -lxvidcore $LDFLAGS"
    export CFLAGS="-I$LYCIUM_ROOT/usr/lame/$ARCH/include/ -I$LYCIUM_ROOT/usr/xvidcore/$ARCH/include/ $CFLAGS"

    return $ret
}

build() {
    cd $builddir-$ARCH-build
    PKG_CONFIG_LIBDIR="${pkgconfigpath}" ./configure "$@" --disable-debug \
        --enable-cross-compile --enable-neon --enable-asm  --disable-x86asm \
        --disable-vulkan --enable-static --enable-shared --enable-network \
        --enable-protocols --enable-libdav1d --enable-libx264 \
        --enable-libvpx --enable-libvorbis --enable-libx265 \
        --enable-libxvid --enable-libvidstab --enable-gpl --enable-libmp3lame \
        --disable-doc --disable-htmlpages --target-os=linux \
        --host-os=linux --arch=$arch --cc=${CC} --cxx=${CXX} --ld=${CC} --strip=${STRIP} \
        --host-cc="${CC}" --host-ld="${CC}" --host-ldflags=${ldflags} \
        --sysroot=${OHOS_SDK}/native/sysroot > $buildlog 2>&1
    $MAKE V=1 >> $buildlog 2>&1
    ret=$?
    cd $OLDPWD
    return $ret
}

package() {
    cd $builddir-$ARCH-build
    $MAKE install >> $buildlog 2>&1
    cd $OLDPWD
    unset arch
    unset ldflags
    if [ $ARCH == "armeabi-v7a" ]
    then
        unsetarm32ENV
    elif [ $ARCH == "arm64-v8a" ]
    then
        unsetarm64ENV
    else
        echo "${ARCH} not support"
        return -1
    fi
}

check() {
    echo "The test must be on an OpenHarmony device!"
}

# 清理环境
cleanbuild() {
    rm -rf ${PWD}/${builddir} ${PWD}/$builddir-arm64-v8a-build ${PWD}/$builddir-armeabi-v7a-build #${PWD}/$packagename
}

```