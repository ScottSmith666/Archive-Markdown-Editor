
# Copyright (c) 2022 Huawei Device Co., Ltd.
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# the minimum version of CMake.
cmake_minimum_required(VERSION 3.4.1)
project(minizip-ng)

set(MINIZIP_DEFINITIONS
        -DHAVE_INTTYPES_H
        -DHAVE_STDINT_H
        -DLZMA_API_STATIC
        -D_POSIX_C_SOURCE=200112L
        -DOPENSSL_ARM64_PLATFORM
        -D_GNU_SOURCE
        -DHAVE_ZLIB
        -DMZ_ZIP_NO_CRYPTO
        )

set(MINIZIP_INCLUDE_DIR ${CMAKE_CURRENT_SOURCE_DIR}/minizip-ng)
set(MINIZIP_SRC "${CMAKE_CURRENT_SOURCE_DIR}/minizip-ng/mz_crypt.c"
                    "${CMAKE_CURRENT_SOURCE_DIR}/minizip-ng/mz_os.c"
                    "${CMAKE_CURRENT_SOURCE_DIR}/minizip-ng/mz_strm.c"
                    "${CMAKE_CURRENT_SOURCE_DIR}/minizip-ng/mz_strm_buf.c"
                    "${CMAKE_CURRENT_SOURCE_DIR}/minizip-ng/mz_strm_mem.c"
                    "${CMAKE_CURRENT_SOURCE_DIR}/minizip-ng/mz_strm_split.c"
                    "${CMAKE_CURRENT_SOURCE_DIR}/minizip-ng/mz_zip.c"
                    "${CMAKE_CURRENT_SOURCE_DIR}/minizip-ng/mz_zip_rw.c"
                    "${CMAKE_CURRENT_SOURCE_DIR}/minizip-ng/mz_strm_zlib.c"
                    "${CMAKE_CURRENT_SOURCE_DIR}/minizip-ng/mz_os_posix.c"
                    "${CMAKE_CURRENT_SOURCE_DIR}/minizip-ng/mz_strm_os_posix.c"
                    )

set(LinkLib libz.so)

if (EXISTS ${CMAKE_CURRENT_SOURCE_DIR}/../libiconv)
option(BUILD_ICONV "enable to build iconv" ON)
endif()

if (BUILD_ICONV)
set(ICONV_INCLUDE_DIR ${CMAKE_CURRENT_SOURCE_DIR}/../iconv/adapter)
set(ICONV_SRC ${CMAKE_CURRENT_SOURCE_DIR}/../iconv/libiconv/lib/iconv.c
    ${CMAKE_CURRENT_SOURCE_DIR}/../iconv/libiconv/lib/relocatable.c
    ${CMAKE_CURRENT_SOURCE_DIR}/../iconv/libiconv/libcharset/lib/localcharset.c
    ${CMAKE_CURRENT_SOURCE_DIR}/../iconv/libiconv/libcharset/lib/relocatable-stub.c
    )
set(ICONV_LIB_DEFINITIONS
        -DCVAPI_EXPORTS
        -D_USE_MATH_DEFINES
        -D__STDC_CONSTANT_MACROS
        -D__STDC_FORMAT_MACROS
        -D__STDC_LIMIT_MACROS
        -DHAVE_CONFIG_H
        -DENABLE_RELOCATABLE=1
        -DBUILDING_LIBICONV
        -DNO_XMALLOC)

add_library(iconv SHARED ${ICONV_SRC})
target_compile_definitions(iconv PRIVATE ${ICONV_LIB_DEFINITIONS})
target_include_directories(iconv PUBLIC ${ICONV_INCLUDE_DIR})

list(APPEND MINIZIP_DEFINITIONS -DHAVE_ICONV)
list(APPEND MINIZIP_INCLUDE_DIR ${ICONV_INCLUDE_DIR})
list(APPEND LinkLib iconv)
endif()

if (EXISTS ${CMAKE_CURRENT_SOURCE_DIR}/../bzip2)
option(BUILD_BZIP "enable to build with bzip2" ON)
endif()

if (BUILD_BZIP)
set(BZIP2_INCLUDE_DIR "${CMAKE_CURRENT_SOURCE_DIR}/../bzip2")
set(BZIP2_SRC
    "${CMAKE_CURRENT_SOURCE_DIR}/../bzip2/blocksort.c"
    "${CMAKE_CURRENT_SOURCE_DIR}/../bzip2/bzlib.c"
    "${CMAKE_CURRENT_SOURCE_DIR}/../bzip2/compress.c"
    "${CMAKE_CURRENT_SOURCE_DIR}/../bzip2/crctable.c"
    "${CMAKE_CURRENT_SOURCE_DIR}/../bzip2/decompress.c"
    "${CMAKE_CURRENT_SOURCE_DIR}/../bzip2/huffman.c"
    "${CMAKE_CURRENT_SOURCE_DIR}/../bzip2/randtable.c")

add_library(bzip2 SHARED ${BZIP2_SRC})
target_include_directories(bzip2 PUBLIC ${BZIP2_INCLUDE_DIR})

list(APPEND MINIZIP_DEFINITIONS -DBZ_NO_STDIO -DHAVE_BZIP2)
list(APPEND MINIZIP_INCLUDE_DIR ${BZIP2_INCLUDE_DIR})
list(APPEND LinkLib bzip2)
list(APPEND MINIZIP_SRC ${CMAKE_CURRENT_SOURCE_DIR}/minizip-ng/mz_strm_bzip.c)
endif()

if (EXISTS ${CMAKE_CURRENT_SOURCE_DIR}/../zstd)
option(BUILD_ZSTD "enable to build with zstd" ON)
endif()
if (BUILD_ZSTD)
set(ZSTD_DEFINITIONS
        -DZSTD_BUILD_CONTRIB
        -DZSTD_BUILD_STATIC
        -DZSTD_BUILD_TESTS
        -DZSTD_ZLIB_SUPPORT
        -DZSTD_LZMA_SUPPORT
        -DZSTD_LIB_COMPRESSION
        -DZSTD_LIB_DECOMPRESSION
        -DZSTD_LIB_DICTBUILDER
        -DHAVE_LZ4
        -DZSTD_LZ4COMPRESS
        -DZSTD_LZ4DECOMPRESS
        -DHAVE_PTHREAD
        -DHAVE_THREAD
        -DZSTD_MULTITHREAD
        -DHAVE_ZLIB
        -DZSTD_GZCOMPRESS
        -DZSTD_GZDECOMPRESS
        -DHAVE_LZMA
        -DZSTD_LZMACOMPRESS
        -DZSTD_LZMADECOMPRESS)
set(ZSTD_INCLUDE_DIR ${CMAKE_CURRENT_SOURCE_DIR}/../zstd
                     ${CMAKE_CURRENT_SOURCE_DIR}/../zstd/lib
                     ${CMAKE_CURRENT_SOURCE_DIR}/../zstd/lib/common
                     ${CMAKE_CURRENT_SOURCE_DIR}/../zstd/lib/compress
                     ${CMAKE_CURRENT_SOURCE_DIR}/../zstd/lib/decompress
                     ${CMAKE_CURRENT_SOURCE_DIR}/../zstd/lib/deprecated
                     ${CMAKE_CURRENT_SOURCE_DIR}/../zstd/lib/dictBuilder
                     ${CMAKE_CURRENT_SOURCE_DIR}/../zstd/lib/legacy
                     )

set(zstd_link_lib libz.so)

if  (EXISTS ${CMAKE_CURRENT_SOURCE_DIR}/../lz4)
set(LZ4_SRC ${CMAKE_CURRENT_SOURCE_DIR}/../lz4/lib/lz4.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../lz4/lib/lz4frame.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../lz4/lib/lz4hc.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../lz4/lib/xxhash.c)
SET(LZ4_INC_IDR ${CMAKE_CURRENT_SOURCE_DIR}/../lz4 ${CMAKE_CURRENT_SOURCE_DIR}/../lz4/lib)

add_library(lz4 STATIC ${LZ4_SRC})
target_include_directories(lz4 PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/../lz4)
target_compile_definitions(lz4 PRIVATE HAVE_CONFIG_H)

list(APPEND zstd_link_lib lz4)
list(APPEND ZSTD_INCLUDE_DIR ${LZ4_INC_IDR})
endif()

if  (EXISTS ${CMAKE_CURRENT_SOURCE_DIR}/../xz)
set(XZ_INCLUDE_DIR ${CMAKE_CURRENT_SOURCE_DIR}/../xz/adapted
                    ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/common
                    ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma
                    ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/lzma
                    ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common
                    ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/lz
                    ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/rangecoder
                    ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/check
                    ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/api
                    ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/api/lzma
                    ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/delta
                    ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/simple
                    )
set(XZ_SRC
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/common/tuklib_physmem.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/common/tuklib_cpucores.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/common.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/block_util.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/easy_preset.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/filter_common.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/hardware_physmem.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/index.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/stream_flags_common.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/vli_size.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/hardware_cputhreads.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/alone_encoder.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/block_buffer_encoder.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/block_encoder.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/block_header_encoder.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/easy_buffer_encoder.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/easy_encoder.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/easy_encoder_memusage.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/filter_buffer_encoder.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/filter_encoder.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/filter_flags_encoder.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/index_encoder.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/stream_buffer_encoder.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/stream_encoder.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/stream_flags_encoder.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/stream_flags_decoder.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/vli_encoder.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/outqueue.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/stream_encoder_mt.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/alone_decoder.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/auto_decoder.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/block_buffer_decoder.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/block_decoder.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/block_header_decoder.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/easy_decoder_memusage.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/filter_buffer_decoder.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/filter_decoder.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/filter_flags_decoder.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/index_decoder.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/index_hash.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/stream_buffer_decoder.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/stream_decoder.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/common/vli_decoder.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/check/check.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/check/crc32_table.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/check/crc32_fast.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/check/crc64_table.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/check/crc64_fast.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/check/sha256.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/lz/lz_encoder.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/lz/lz_encoder_mf.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/lz/lz_decoder.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/lzma/lzma_encoder_presets.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/lzma/lzma_encoder.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/lzma/lzma_encoder_optimum_fast.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/lzma/lzma_encoder_optimum_normal.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/lzma/fastpos_table.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/lzma/lzma_decoder.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/lzma/lzma2_encoder.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/lzma/lzma2_decoder.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/rangecoder/price_table.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/delta/delta_common.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/delta/delta_encoder.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/delta/delta_decoder.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/simple/simple_coder.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/simple/simple_encoder.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/simple/simple_decoder.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/simple/x86.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/simple/powerpc.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/simple/ia64.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/simple/arm.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/simple/armthumb.c
            ${CMAKE_CURRENT_SOURCE_DIR}/../xz/libxz/src/liblzma/simple/sparc.c
            )

set(XZ_DEFINES   "-DHAVE_CONFIG_H"
                 "-DTUKLIB_SYMBOL_PREFIX=lzma_"
                 "-DPIC"
                 "-DLZMA_H_INTERNAL")

add_library(xz SHARED ${XZ_SRC})
target_include_directories(xz PUBLIC ${XZ_INCLUDE_DIR})
target_compile_definitions(xz PRIVATE ${XZ_DEFINES})

list(APPEND zstd_link_lib xz)
list(APPEND ZSTD_INCLUDE_DIR XZ_INCLUDE_DIR)
endif()

aux_source_directory(${CMAKE_CURRENT_SOURCE_DIR}/../zstd/lib/common zstd_source_common)
aux_source_directory(${CMAKE_CURRENT_SOURCE_DIR}/../zstd/lib/compress zstd_source_compress)
aux_source_directory(${CMAKE_CURRENT_SOURCE_DIR}/../zstd/lib/decompress zstd_source_decompress)
aux_source_directory(${CMAKE_CURRENT_SOURCE_DIR}/../zstd/lib/deprecated zstd_source_deprecated)
aux_source_directory(${CMAKE_CURRENT_SOURCE_DIR}/../zstd/lib/dictBuilder zstd_source_dictBuilder)
aux_source_directory(${CMAKE_CURRENT_SOURCE_DIR}/../zstd/lib/legacy zstd_source_legacy)

add_library(zstd SHARED ${zstd_source_common}
                        ${zstd_source_compress}
                        ${zstd_source_decompress}
                        ${zstd_source_deprecated}
                        ${zstd_source_dictBuilder}
                        ${zstd_source_legacy})

target_compile_definitions(zstd PRIVATE ${ZSTD_DEFINITIONS})
target_include_directories(zstd PUBLIC ${ZSTD_INCLUDE_DIR})

target_link_libraries(zstd ${zstd_link_lib})

list(APPEND MINIZIP_INCLUDE_DIR ${ZSTD_INCLUDE_DIR})
list(APPEND MINIZIP_SRC ${CMAKE_CURRENT_SOURCE_DIR}/minizip-ng/mz_strm_zstd.c)
list(APPEND MINIZIP_DEFINITIONS -DHAVE_ZSTD)
list(APPEND LinkLib zstd)
endif()

if (EXISTS ${CMAKE_CURRENT_SOURCE_DIR}/../lzma)
option(BUILD_LZMA "enable to build with zstd" ON)
endif()
if (BUILD_LZMA)
set(LZMA_INCLUDE_DIR ${CMAKE_CURRENT_SOURCE_DIR}/../lzma/lib)
aux_source_directory(${CMAKE_CURRENT_SOURCE_DIR}/../lzma/lib lzma_source)

add_library(lzma SHARED ${lzma_source})
target_compile_options(lzma PRIVATE -Wno-incompatible-pointer-types -Werror -Wimplicit-function-declaration -Wno-error=unused-command-line-argument)
target_include_directories(lzma PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})

list(APPEND MINIZIP_INCLUDE_DIR ${BZIP2_INCLUDE_DIR})
list(APPEND MINIZIP_DEFINITIONS -DHAVE_LZMA -DLZMA_API_STATIC)
list(APPEND MINIZIP_SRC {CMAKE_CURRENT_SOURCE_DIR}/minizip-ng/mz_strm_lzma.c)
endif()

set(MINIZIP_FLAG -fPIC
                 -Wno-error=implicit-function-declaration
                 -Wall
                 -Wextra
                 -Wno-error=missing-braces
                 -Wno-missing-braces
                 -Wno-error=visibility
                 -Wno-visibility
                 -Wno-error=unused-function
                 -Wno-unused-function
                 -Wno-error=unused-variable
                 -Wno-unused-variable
                 -Wno-error=undef
                 -Wno-error=deprecated-declarations
                 -Wno-deprecated-declarations
                 -Wno-error=sign-compare
                 -Wno-error=parentheses-equality
                 -Wno-parentheses-equality
                 -Wno-incompatible-pointer-types
                 -Wno-unused-command-line-argument
                 -Wno-error=unused-parameter
                 -Wno-unused-parameter
                 -Wno-error=header-hygiene
                 -frtti
                 -fexceptions
                 -std=gnu99)

add_library(minizip_shared SHARED ${MINIZIP_SRC})
target_include_directories(minizip_shared PUBLIC ${MINIZIP_SOURCE_DIR})
target_compile_options(minizip_shared PRIVATE ${MINIZIP_FLAG})
target_compile_definitions(minizip_shared PRIVATE ${MINIZIP_DEFINITIONS})

target_link_libraries(minizip_shared ${LinkLib})
