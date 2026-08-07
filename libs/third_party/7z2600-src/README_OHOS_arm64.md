# 7-Zip 26.00 —— OpenHarmony / HarmonyOS arm64 交叉编译适配

本目录对 7-Zip 26.00 源码（`libs/third_party/7z2600-src`）做了鸿蒙 arm64
适配：在 Ubuntu 22.04 x86_64 主机上，使用 OHOS Native SDK 自带的 clang
工具链，把你平时编译的 `CPP/7zip/Bundles/Format7zF` 交叉编译成
**arm64-v8a 的共享库 `7z.so`**（即 bit7z 在 Linux 上直接 dlopen 的那个库，
包含全部压缩/解压算法、格式处理器与加密算法，并导出 `CreateObject`、
`GetNumberOfFormats` 等符号）。

适配后，在 `CPP/7zip/Bundles/Format7zF` 目录里用你熟悉的 `makefile.gcc`
（甚至直接 `make`）即可完成鸿蒙 arm64 交叉编译，不再需要额外的构建入口。

## 改动文件

| 路径 | 作用 |
| --- | --- |
| `CPP/7zip/Bundles/Format7zF/makefile.gcc` | （扩展）设置 `OHOS_SDK` 时自动套用鸿蒙 arm64 编译变量与链接参数；不设置时行为与上游一致 |
| `CPP/7zip/Bundles/Format7zF/GNUmakefile` | （新增）让 Linux 下直接 `make` 等价于 `make -f makefile.gcc`（目录里原名 `makefile` 是 Windows/NMAKE 语法，GNU make 无法解析） |
| `CPP/7zip/var_ohos_arm64.mak` | OHOS arm64 编译变量：工具链路径（`aarch64-linux-ohos-clang`）、`-march=armv8-a`、开启 ARM64 汇编优化 |
| `CPP/7zip/warn_ohos.mak` | OHOS 构建告警策略：不使用上游 clang 的 `-Weverything -Wfatal-errors`，避免 musl 头文件告警打断构建 |
| `CPP/7zip/cmpl_ohos_arm64.mak` | （保留为兼容入口）旧命令 `make -f ../../cmpl_ohos_arm64.mak` 仍然可用，现委托给 `makefile.gcc` |
| `build_ohos_arm64.sh` | 一键构建脚本：SDK 检测、调用 Format7zF 目录里的 make、拷贝产物到 `out/ohos-arm64-v8a/` |
| `README_OHOS_arm64.md` | 本文档 |

> `C/`、`CPP/` 下的源码与 `Arc_gcc.mak`、`7zip_gcc.mak` 等上游文件
> **未被修改**；唯一改动的上游构建文件是 `Format7zF/makefile.gcc`
> （仅新增 OHOS 分支，原有 Linux 构建逻辑未动）。

## 工作原理

- `Format7zF/makefile.gcc` 顶部检测 `OHOS_SDK` 是否设置：
  - 已设置：`include ../../var_ohos_arm64.mak` 与 `warn_ohos.mak`，
    把 `CC`/`CXX` 指向 OHOS SDK 的 `aarch64-linux-ohos-clang` /
    `aarch64-linux-ohos-clang++` 包装脚本，输出目录变为 `b/ohos_arm64`；
  - 未设置：行为与上游完全一致（原生 Linux 构建，输出 `_o/7z.so`）。
- arm64 汇编（`Asm/arm64/7zAsm.S`、`LzmaDecOpt.S`）由 clang 的集成汇编器
  编译（`USE_ASM=1`、`IS_ARM64=1`）。
- 链接阶段（`makefile.gcc` 末尾的 OHOS 分支）去掉 `-lpthread -ldl`：
  OHOS 的 libc 是 musl，线程与 dlopen 都在 `libc.so` 中。实测 OHOS arm64
  的 `7z.so` 的 `NEEDED` 只有 `libc.so` 与 `libc++_shared.so`。
- 关闭 `-Werror`，避免 musl 系统头文件的告警把构建打断。

## 前置条件

1. Ubuntu 22.04 x86_64 主机（构建实际使用 SDK 自带的 clang，与宿主机 gcc 版本无关）。
2. OHOS / OpenHarmony “Native” SDK（命令行工具版），解压后应包含：

   ```text
   native/llvm/bin/aarch64-linux-ohos-clang
   native/llvm/bin/aarch64-linux-ohos-clang++
   native/sysroot
   ```

   若缺少 clang 包装脚本，可参考同仓库
   `libs/third_party/for_hmos/tpc_c_cplusplus/lycium` 的做法：把
   `Buildtools/toolchain.tar.gz` 解压进 `native/llvm/bin`。
3. 基础工具：`bash`、`make`、coreutils（`file` 仅用于打印产物信息）。

## 构建

### 方式一：在 Format7zF 目录里直接编译（推荐）

```bash
cd libs/third_party/7z2600-src/CPP/7zip/Bundles/Format7zF
export OHOS_SDK=/path/to/ohos-sdk      # 指向含 native/ 的 SDK 根目录
make -f makefile.gcc -j$(nproc)        # 或直接 make -j$(nproc)
```

产物：

```text
libs/third_party/7z2600-src/CPP/7zip/Bundles/Format7zF/b/ohos_arm64/7z.so
```

### 方式二：一键脚本（自动拷贝到 out/）

```bash
cd libs/third_party/7z2600-src
export OHOS_SDK=/path/to/ohos-sdk
./build_ohos_arm64.sh
```

产物：

```text
libs/third_party/7z2600-src/out/ohos-arm64-v8a/7z.so
```

### 兼容旧入口

```bash
cd libs/third_party/7z2600-src/CPP/7zip/Bundles/Format7zF
OHOS_SDK=/path/to/ohos-sdk make -j$(nproc) -f ../../cmpl_ohos_arm64.mak
```

## 校验

```bash
file CPP/7zip/Bundles/Format7zF/b/ohos_arm64/7z.so
# 应为: ELF 64-bit LSB shared object, ARM aarch64, ...

readelf -d CPP/7zip/Bundles/Format7zF/b/ohos_arm64/7z.so | grep NEEDED
# 应仅含 libc++_shared.so 与 libc.so

readelf -Ws CPP/7zip/Bundles/Format7zF/b/ohos_arm64/7z.so | grep -E 'CreateObject|GetNumberOfFormats'
# bit7z 需要的导出符号
```

## 清理

```bash
# Format7zF 目录里：
cd CPP/7zip/Bundles/Format7zF
make -f makefile.gcc clean             # 清除 b/ohos_arm64/

# 或顶层脚本：
./build_ohos_arm64.sh --clean
```

## 其他说明

- 产物命名与 bit7z 兼容：Linux 上 bit7z 默认加载 `7z.so`。
- 默认 `-march=armv8-a`，兼容全部 arm64 设备；若确认目标设备支持
  crc/crypto 扩展，可把 `CPP/7zip/var_ohos_arm64.mak` 中的 `MY_ARCH` 改为
  `-march=armv8-a+crc+crypto`。
- 默认开启 ARM64 汇编优化（`USE_ASM=1`）。
- 是否进入鸿蒙分支只取决于环境变量 `OHOS_SDK` 是否存在。注意：如果 shell
  里全局导出了 `CC`/`CXX`（例如 lycium 环境把
  `clang --target=aarch64-linux-ohos` 写进了 `~/.bashrc`），未设置
  `OHOS_SDK` 的原生分支也会使用这些变量；想编纯原生 x86-64 时需
  `unset OHOS_SDK CC CXX`。
- 在 OHOS 应用中使用时，把 `7z.so`（连同 `libc++_shared.so`）放入应用的
  native 库目录（arm64-v8a），并让 bit7z 以对应路径加载。
