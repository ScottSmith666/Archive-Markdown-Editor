cmake_minimum_required(VERSION 4.0)
project(7zip_process)

set(CMAKE_CXX_STANDARD 14)

add_executable(7zip_process
        rwmdz.cpp)
add_subdirectory(${CMAKE_SOURCE_DIR}/third_party/bit7z) # Path to bit7z's repository
# Here you can enable/disable bit7z's build options, e.g.:
# set(BIT7Z_USE_NATIVE_STRING ON CACHE BOOL "enable using native OS strings" FORCE)
target_link_libraries(7zip_process PRIVATE bit7z)
