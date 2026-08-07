#!/usr/bin/env bash
#
# Build 7-Zip 26.00 (CPP/7zip/Bundles/Format7zF) as a shared library for
# OpenHarmony / HarmonyOS arm64 (arm64-v8a) on an Ubuntu 22.04 x86_64 host.
#
# The OHOS logic is built into CPP/7zip/Bundles/Format7zF/makefile.gcc:
# with OHOS_SDK set, "make -f makefile.gcc" (or plain "make") in the
# Format7zF directory cross-compiles b/ohos_arm64/7z.so. This script is a
# convenience wrapper around that usual in-folder build.
#
# Prerequisites:
#   1. OHOS / OpenHarmony "Native" SDK (command-line tools) installed,
#      containing:
#        native/llvm/bin/aarch64-linux-ohos-clang
#        native/llvm/bin/aarch64-linux-ohos-clang++
#        native/sysroot
#      If the clang wrappers are missing, follow the approach used by
#      libs/third_party/for_hmos/tpc_c_cplusplus/lycium: extract
#      Buildtools/toolchain.tar.gz into native/llvm/bin.
#   2. bash, make, coreutils (file is used to print the result).
#
# Usage:
#   export OHOS_SDK=/path/to/ohos-sdk
#   ./build_ohos_arm64.sh
#   ./build_ohos_arm64.sh --sdk /path/to/ohos-sdk
#   ./build_ohos_arm64.sh --clean
#
# Output:
#   libs/third_party/7z2600-src/out/ohos-arm64-v8a/7z.so

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
BUNDLE_DIR="$SCRIPT_DIR/CPP/7zip/Bundles/Format7zF"
OUT_DIR="$SCRIPT_DIR/out/ohos-arm64-v8a"
MAKEFILE="makefile.gcc"
PROG="b/ohos_arm64/7z.so"

usage() {
  cat <<'EOF'
用法:
  ./build_ohos_arm64.sh [--sdk /path/to/ohos-sdk] [--clean]

  --sdk PATH   指定 OHOS SDK 根目录（含 native/ 子目录），也可用环境变量 OHOS_SDK
  --clean      清理 Format7zF/b/ohos_arm64 下的中间产物
EOF
}

SDK="${OHOS_SDK:-}"
ACTION="build"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --sdk) SDK="${2:-}"; shift 2 ;;
    --clean) ACTION="clean"; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "未知参数: $1" >&2; usage >&2; exit 1 ;;
  esac
done

if [[ -z "$SDK" ]]; then
  echo "错误：未指定 OHOS SDK。请设置环境变量 OHOS_SDK 或使用 --sdk 参数。" >&2
  usage >&2
  exit 1
fi
if [[ ! -d "$SDK" ]]; then
  echo "错误：OHOS SDK 目录不存在：$SDK" >&2
  exit 1
fi

export OHOS_SDK="$SDK"

if [[ "$ACTION" == "clean" ]]; then
  (cd "$BUNDLE_DIR" && make -f "$MAKEFILE" clean)
  echo "已清理：$BUNDLE_DIR/b/ohos_arm64"
  exit 0
fi

CLANG="$SDK/native/llvm/bin/aarch64-linux-ohos-clang"
CLANGXX="$SDK/native/llvm/bin/aarch64-linux-ohos-clang++"
if [[ ! -x "$CLANG" || ! -x "$CLANGXX" ]]; then
  echo "错误：找不到 OHOS arm64 工具链包装脚本：" >&2
  echo "  $CLANG" >&2
  echo "  $CLANGXX" >&2
  echo "请确认 SDK 完整（参考 lycium 的 Buildtools/toolchain.tar.gz 处理方式）。" >&2
  exit 1
fi

echo "OHOS_SDK = $OHOS_SDK"
echo "编译器   = $CLANG"
echo "目标目录 = $BUNDLE_DIR"

cd "$BUNDLE_DIR"
make -j"$(nproc)" -f "$MAKEFILE"

mkdir -p "$OUT_DIR"
cp -f "$PROG" "$OUT_DIR/7z.so"

echo
echo "构建成功：$OUT_DIR/7z.so"
file "$OUT_DIR/7z.so"
