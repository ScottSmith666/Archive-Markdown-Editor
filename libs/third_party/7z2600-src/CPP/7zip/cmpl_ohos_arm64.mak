# Compatibility entry point for the OHOS / HarmonyOS arm64 build
# (arm64-v8a). The OHOS logic now lives directly in
# Format7zF/makefile.gcc, so this file just delegates to it.
#
# Produces: CPP/7zip/Bundles/Format7zF/b/ohos_arm64/7z.so
# (the shared library consumed by bit7z; exports CreateObject,
#  GetNumberOfFormats, GetHandlerProperty, ...).
#
# Run from CPP/7zip/Bundles/Format7zF:
#   OHOS_SDK=/path/to/sdk make -j -f ../../cmpl_ohos_arm64.mak
# (equivalent to: OHOS_SDK=/path/to/sdk make -f makefile.gcc)

ifndef OHOS_SDK
$(error OHOS_SDK is not set. Please set OHOS_SDK=/path/to/ohos-sdk, or run ./build_ohos_arm64.sh from the 7z2600-src root)
endif

include makefile.gcc
