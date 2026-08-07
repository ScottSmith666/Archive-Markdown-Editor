# 7-Zip build variables for OpenHarmony / HarmonyOS arm64 (arm64-v8a).
#
# Host: Ubuntu 22.04 x86_64 (cross compilation).
#
# Toolchain: OHOS Native SDK clang wrappers:
#   $OHOS_SDK/native/llvm/bin/aarch64-linux-ohos-clang
#   $OHOS_SDK/native/llvm/bin/aarch64-linux-ohos-clang++
# (the wrappers add --target=aarch64-linux-ohos and --sysroot automatically)
#
# Usage (from CPP/7zip/Bundles/Format7zF):
#   OHOS_SDK=/path/to/sdk make -j -f ../../cmpl_ohos_arm64.mak
# or simply run ./build_ohos_arm64.sh from the 7z2600-src root.

PLATFORM=ohos_arm64
O=b/ohos_arm64

IS_X64=
IS_X86=
IS_ARM64=1

CROSS_COMPILE=$(OHOS_SDK)/native/llvm/bin/aarch64-linux-ohos-

# arm64-v8a baseline: compatible with every arm64 OHOS device.
# If the target devices are known to support the crypto/crc extensions,
# you may switch to: MY_ARCH=-march=armv8-a+crc+crypto
MY_ARCH=-march=armv8-a

# Enable ARM64 optimized assembly (Asm/arm64/7zAsm.S, LzmaDecOpt.S).
# The .S files are compiled by clang's integrated assembler.
USE_ASM=1
ASM_FLAGS=-Wno-unused-macros

CC=$(CROSS_COMPILE)clang
CXX=$(CROSS_COMPILE)clang++
USE_CLANG=1
