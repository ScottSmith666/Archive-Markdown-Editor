cmake_minimum_required(VERSION 3.10)
project(mdz_utils)

# 设置标准版本
set(CMAKE_CXX_STANDARD 17)

# 设置头文件路径
set(NODE_INCLUDE_DIR "./include/node")
set(BIT7Z_INCLUDE_DIR "./include/bit7z")
set(NODE_ADDON_API_DIR "./node_modules/node-addon-api")

add_definitions(-DBIT7Z_AUTO_FORMAT)
add_definitions(-DBIT7Z_USE_NATIVE_STRING)

# 包含路径
include_directories(
        ${NODE_INCLUDE_DIR}
        ${BIT7Z_INCLUDE_DIR}
        ${NODE_ADDON_API_DIR}
        "src"
)

# 定义伪目标（让 CLion 索引源码）
add_library(${PROJECT_NAME} SHARED src/main.cpp)
