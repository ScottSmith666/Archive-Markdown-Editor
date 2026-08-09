# Warning policy for the OHOS build.
#
# Upstream warn_clang.mak uses -Weverything -Wfatal-errors, which is tuned
# for macOS/Linux host builds. The OHOS (musl) system headers are not
# guaranteed to be warning-clean under -Weverything, so we keep a normal
# warning set here.
#
# Note: CFLAGS_WARN_WALL is assigned unconditionally inside 7zip_gcc.mak,
# so it is redefined in cmpl_ohos_arm64.mak AFTER the main makefile is
# included (recipes expand variables at execution time, so the last
# assignment wins).

CFLAGS_WARN =
CXX_WARN_FLAGS =
