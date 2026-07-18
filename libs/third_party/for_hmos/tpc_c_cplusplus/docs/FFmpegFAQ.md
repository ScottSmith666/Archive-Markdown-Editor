##### FFmpeg在MAC环境编译可能遇到的问题

以下措施sed语句请注意修改文件所在的实际路径，如果修改错误可以尝试从同名+.bak的文件中恢复内容，并且sed修改的主要目的是为了通过编译，对于实际使用可能存在影响，需要仔细分辨。

##### static declaration of 'xxx' follows non-static declaration

```
sed -i.bak 's/#define HAVE_LLRINT 0/#define HAVE_LLRINT 1/g' config.h
sed -i.bak 's/#define HAVE_LLRINTF 0/#define HAVE_LLRINTF 1/g' config.h
sed -i.bak 's/#define HAVE_LRINT 0/#define HAVE_LRINT 1/g' config.h
sed -i.bak 's/#define HAVE_LRINTF 0/#define HAVE_LRINTF 1/g' config.h
sed -i.bak 's/#define HAVE_ROUND 0/#define HAVE_ROUND 1/g' config.h
sed -i.bak 's/#define HAVE_ROUNDF 0/#define HAVE_ROUNDF 1/g' config.h
sed -i.bak 's/#define HAVE_CBRT 0/#define HAVE_CBRT 1/g' config.h
sed -i.bak 's/#define HAVE_CBRTF 0/#define HAVE_CBRTF 1/g' config.h
sed -i.bak 's/#define HAVE_COPYSIGN 0/#define HAVE_COPYSIGN 1/g' config.h
sed -i.bak 's/#define HAVE_TRUNC 0/#define HAVE_TRUNC 1/g' config.h
sed -i.bak 's/#define HAVE_TRUNCF 0/#define HAVE_TRUNCF 1/g' config.h
sed -i.bak 's/#define HAVE_RINT 0/#define HAVE_RINT 1/g' config.h
sed -i.bak 's/#define HAVE_HYPOT 0/#define HAVE_HYPOT 1/g' config.h
sed -i.bak 's/#define HAVE_ERF 0/#define HAVE_ERF 1/g' config.h
sed -i.bak 's/#define HAVE_GMTIME_R 0/#define HAVE_GMTIME_R 1/g' config.h
sed -i.bak 's/#define HAVE_LOCALTIME_R 0/#define HAVE_LOCALTIME_R 1/g' config.h
sed -i.bak 's/#define HAVE_INET_ATON 0/#define HAVE_INET_ATON 1/g' config.h
```

可以在编译编译脚本中添加对应选项的sed命令，或者执行完./configure命令后，执行make之前在终端手动执行对应选项的sed命令。脚本添加位置以及手动执行顺序参考如下示例

```
#configure检查和生成配置之后使用sed替换配置内容再编译
./configure
sed -i.bak 's/#define HAVE_LLRINT 0/#define HAVE_LLRINT 1/g' config.h
make
```

##### xxxxxxxxxx error: expected ')'

./config.h:17:19: error: expected ')' before numeric constant
\#define getenv(x) NULL

```
sed -i.bak 's|#define getenv(x) NULL||g' config.h
```

##### ld：-shared -Wl,- soname,xxxx.so unknown option

使用clang编译时需要将config.mak文件中的 **SHFLAGS=-shared -Wl,-soname** 修改为 **SHFLAGS=- shared -soname**，config.mak文件是configure后生成的文件，可以参考此语句修改

```
sed -i.bak 's|SHFLAGS=-shared -Wl,-soname|SHFLAGS=- shared -soname|g' 实际路径/config.mak
```

##### 在编译过程中出现ERROR during : prepare以及host等关键字的报错

主要因为仓库上的编译是带测试版本，使用者可以根据自己的需求裁剪掉测试，裁剪掉测试能够获得更快的编译速度以及减少对host环境的依赖，裁剪方案参考如下：

```
#改动文件为tpc_c_cplusplus/thirdparty/FFmpeg/HPKBUILD
#-为删除 +为新增
-buildhost=true
+buildhost=false

- 	 cd  $pkgname-$ARCH-build/$builddir
-    patch -p1 < ../../FFmpeg_oh_test.patch
-    cd $OLDPWD


-    --cc=${CC} --ld=${CC} --strip=${STRIP} --host-cc="${CC}" --host-ld="${CC}" --host-os=linux \
-    --host-ldflags=${ldflags} --sysroot=${OHOS_SDK}/native/sysroot > $buildlog 2>&1
+    --cc=${CC} --ld=${CC} --strip=${STRIP} --sysroot=${OHOS_SDK}/native/sysroot > $buildlog 2>&1

#checktestfiles() copyhostbin()两个函数全量删除
#check()函数中的内容只保留echo "The test must be on an OpenHarmony device!"，函数中其它内容全部删除
```

完成测试裁剪后任然报错，可能是由于缺少了必须的工具或者环境配置错误，可以参考[FAQ文档](./FAQ.md)的Q4部分查看build.log，通常能够发现问题的原因

##### 在编译FFmpeg之前，出现openssl以及rtmpdump等依赖库编译失败的情况

如果对该依赖库没有强需求，可以通过修改编译参数关闭对此库的依赖，修改方式参考如下

```
#改动文件为tpc_c_cplusplus/thirdparty/FFmpeg/HPKBUILD

在build()函数中存在着对依赖的开关配置参数 例如--enable-librtmp ，
该参数则使能了FFmpeg在编译过程中对rtmp库的依赖功能，当不需要rtmp依赖库的时候，
只需要修改成--disable-librtmp即可关闭对rtmp的依赖，openssl同理。
```

