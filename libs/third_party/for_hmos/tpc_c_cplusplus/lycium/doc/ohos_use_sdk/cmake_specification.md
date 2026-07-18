CMAKE 规范

1. CMakeLists.txt 只能作为cmake的文件名

2. add_subdirectory()只能添加当前目录子目录，不能添加当前目录的父目录，兄目录，孙目录

3. 顶层CMakeLists.txt所在的目录必须包含本工程所有的源码，不能访问该目录以外的源码

4. cmake脚本必须以 .cmake 结尾 # ***.cmake 为cmake脚本 cjsonconfigure.cmake

5. cmake脚本中不可以调用CMakeLists.txt # include(${CMAKE_CURRENT_SOURCE_DIR}/CMakeLists.txt)

6. 不可以再cmake脚本中调用add_subdirectory(),隐藏了代码的物理结构

7. 同一个代码库中相同部署关系的不同模块，使用同一个CMake工程

8. 支持通过find_package()机制访问发布件

9. cmake命令小写，属性大写

10. 自定义变量名禁止 CMAKE 开头

11. 明确写出target依赖，不要使用通配符

12. 不使用过时以及未公开的cmake命令  cmake_minimum_required(VERSION 3.4.1)

13. 路径变量采用完整路径，不要相对路径

    set(XXX ${CMAKE_CURRENT_SOURCE_DIR }/x.cpp)

    CMAKE_SOURCE_DIR 表示代码根路径，即顶层CMakeLists.txt所在路径

    CMAKE_CURRENT_SOURCE_DIR 当前CMakeLists.txt所在路径

    CMAKE_BINARY_DIR 目标文件根目录，cmake的执行目录

    CMAKE_CURRENT_BINARY_DIR 当前目标文件路径

    CMAKE_CURRENT_LIST_DIR 当前脚本文件路径

14. 优先使用target_*** 命令

    target_compile_definitions

    target_compile_features **在CMAKE_C_COMPILE_FEATURES，CMAKE_CUDA_COMPILE_FEATURES或CMAKE_CXX_COMPILE_FEATURES内**

    target_compile_options

    target_include_directories

    target_link_directories

    target_link_libraries

    target_link_options

    target_sources

15. target_link_libraries() 显示声明库的依赖关系和PRIVATE/PUBLIC/INTERFACE属性

    PRIVATE：

    PUBLIC：

    INTERFACE：

16. add_libray 函数使用

    add_libray(targetName [STATIC | SHARED | MODULE])

    add_libray(targetName INTERFACE)

    add_libray(targetName IMPORTED)

