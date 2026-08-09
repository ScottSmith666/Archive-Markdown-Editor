# Convenience shim: this directory's plain "makefile" is the Windows /
# NMAKE variant, which GNU make cannot parse. On Linux just run "make"
# here and it behaves exactly like "make -f makefile.gcc":
#
#   export OHOS_SDK=/path/to/ohos-sdk   # OHOS arm64 cross build
#   make                                 # -> b/ohos_arm64/7z.so
#
#   make                                 # native Linux build (no OHOS_SDK)
include makefile.gcc
