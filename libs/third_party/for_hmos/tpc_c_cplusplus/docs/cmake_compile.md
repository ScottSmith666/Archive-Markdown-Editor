# 从零开始编写一个cmake构建脚本

## 简介

本文档介绍cmake构建脚本编写，包含的一些主要元素和命名规范。

## cmake构建脚本编写步骤

### cmake构建工具版本要明确

```shell
# 命令名字要小写，这条语句要求构建工具至少需要版本为3.12或以上
cmake_minimum_required (VERSION 3.12)
```

### 工程名及库的版本号明确

在编写工程名以及版本号时有几点需要注意：

- 工程名需要大写
- 版本号需要标明主版本号,次版本号以及补丁版本号,如：

  ```shell
  project(PROJECT_NAME VERSION 0.0.0) 
  ```

  PROJECT_NAME工程的版本号时 0.0.0，该版本号会被三个cmake内置变量所继承，例如主版本号PROJECT_VERSION_MAJOR=0，次版本号PROJECT_VERSION_MINOR=0，补丁版本号PROJECT_VERSION_PATCH=0，后续可以直接使用这三个内置变量来使用库的版本号

### 配置构建语言

可以自己根据工程配置需要构建的语言，比如CXX表示可以编译C++文件；C表示可以编译c文件；ASM表示可以编译汇编文件

```shell
enable_language(CXX C ASM)
```

### 配置测试用例可选变量

配置自定义变量，默认不构建测试用例，可以由使用者通过传入参数打开测试用例构建选项。

```shell
option(BUILD_SAMPLE "Build tests" OFF) # 变量名BUILD_SAMPLE  变量说明"Build tests"  状态 OFF：表示不打开  ON：表示打开
```

### 配置打印调试信息

对于一些可能出现的错误或者警告，我们可以通过`message`函数给用户输出一些日志信息。

```shell
message(WARNING "message text")  # 构建时打印警告信息
message(FATAL_ERROR "message text") # 产生CMAKE Error时，会停止编译构建过程
message(STATUS "message text")  # 常用于查看变量值，类似于编程语言中的 DEBUG 级别信息.
```

### 配置生成动态库或者静态库

配置内置变量BUILD_SHARED_LIBS，设置脚本默认构建库的模式为动态库,用户可以通过传入参数来设置生成的是动态库还是静态库

```shell
set(BUILD_SHARED_LIBS TRUE CACHE BOOL "If TRUE, this project is built as a shared library, otherwise as a static library")
```

### 常用变量定义

配置一些后面使用比较频繁的变量，变量名需要大写，并且变量名不能以CMAKE开头

```shell
set(TARGET_NAME project)      # 定义变量存放库名
set(TARGET_SAMPLE_NAME test)      # 定义变量存放库测试用例名
set(TARGET_SRC_PATH ${CMAKE_CURRENT_SOURCE_DIR}/${TARGET_NAME})     # 定义变量存放库路径
set(TARGET_SRC ${TARGET_SRC_PATH}/source.cpp)  # 定义变量存放库源码
if(BUILD_SAMPLE)     # 判断是否需要编译测试用例
    set(TARGET_SAMPLE_SRC ${TARGET_SRC_PATH}/htmlutil.cpp ${TARGET_SRC_PATH}/main.cpp)  # 定义变量存放测试程序源码
endif()
set(TARGET_INCLUDE ${TARGET_SRC_PATH})  # 定义变量存放编译库或编译测试用例所需要的头文件的路径
set(TARGET_INSTALL_INCLUDEDIR include)  # 定义变量存放三方库安装时，头文件存放的路径
set(TARGET_INSTALL_BINDIR bin)  # 定义变量存放三方库安装时，可执行二进制文件存放的路径
set(TARGET_INSTALL_LIBDIR lib)  # 定义变量存放三方库安装时，库存放的路径
```

### 引用其他三方库

引用其他三方库的方式有2种

- 引用其他三方库的源码
  
  1. 源码有cmake构建脚本，直接通过`add_subdirectory()`引用该三方库

     ```shell
     add_subdirectory(xxx)  # xxx是需要引入的三方库源码文件夹名字
     ```

  2. 源码非cmake构建或者无法通过cmake方式构建的，可以将引用三方库的源码添加到本三方库的构建中具体方式

     ```shell
     set(SOURCE_NAME source1.cxx source2.cxx ...)  # SOURCE_NAME 引入三方库源码变量名称， source1.cxx 引入的源码文件(需要包含文件的路径) 
     add_library(${TARGET_NAME} ${SOURCE_NAME} ...)  # TARGET_NAME 本库生成的库名， 通过 add_library 添加 引入三方库源码以及本库源码等生成目标TARGET_NAME
     ```

- 引用其他三方库的二进制文件(.so)
  
  1. 通过target_link_libraries方法引入，此方法需要指定so的路径：

    ```shell
    target_link_libraries(${TARGET_NAME} PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/XXX) # 引用当前源码路径下的xxx库
    ```  

  2. 使用find_package方法来引用，此方法的使用限制参照[IDE上find_package使用分析](./ide_findpackage_problem.md),使用方法：

    ```shell
    find_package(XXX REQUIRED)  # xxx表示要引入的库名
    ```

### 编译库并配置库的属性

使用target_***的命令为库配置依赖

```shell
add_library(${TARGET_NAME} ${TARGET_SRC})  #生成库，会根据内置变量BUILD_SHARED_LIBS变量的值来生成动态库或者静态库
target_include_directories(${TARGET_NAME} PRIVATE ${TARGET_INCLUDE})  #配置构建时所依赖头文件的路径

if(BUILD_SHARED_LIBS)
 set_target_properties(${TARGET_NAME} PROPERTIES VERSION
 ${PROJECT_VERSION_MAJOR}.${PROJECT_VERSION_MINOR}.${PROJECT_VERSION_PATCH} SOVERSION ${PROJECT_VERSION_MAJOR}) 
 #生成动态库时,为库设置版本号
endif()

if(BUILD_SAMPLE)
    add_executable(${TARGET_SAMPLE_NAME} ${TARGET_SAMPLE_SRC}) #生成测试用例
    target_include_directories(${TARGET_SAMPLE_NAME} PRIVATE ${TARGET_INCLUDE}) #配置构建时所依赖的头文件路径
    target_link_libraries(${TARGET_SAMPLE_NAME} PUBLIC ${TARGET_NAME})  #配置所依赖的库
endif()
```

### 文件安装

- 支持install，库对外提供被find_package的能力
- install后，所有导出的头文件、动态库、静态库、可执行二进制、cmake文件都可以安装到指定路径下

```shell
install(TARGETS ${TARGET_NAME}   #TARGETS 安装的目标文件，可以是可执行文件、动态库、静态库
        EXPORT ${TARGET_NAME}    #需要对外导出的文件，该选项用于生成xxxConfig.cmake，便于支持find_package
        PUBLIC_HEADER DESTINATION ${TARGET_INSTALL_INCLUDEDIR}   #头文件路径
        PRIVATE_HEADER DESTINATION ${TARGET_INSTALL_INCLUDEDIR}  #头文件路径
        RUNTIME DESTINATION ${TARGET_INSTALL_BINDIR}    #可执行程序路径
        LIBRARY DESTINATION ${TARGET_INSTALL_LIBDIR}    #动态库路径
        ARCHIVE DESTINATION ${TARGET_INSTALL_LIBDIR})   #静态库路径
        
install(FILES ${TARGET_SRC_PATH}/xpath_processor.h   #FILES 安装文件，可以是头文件，配置文件等
        DESTINATION ${TARGET_INSTALL_INCLUDEDIR}/${TARGET_NAME}) #  DESTINATION 需要安装到的路径
  
install(
    EXPORT ${TARGET_NAME}
    FILE ${TARGET_NAME}Targets.cmake   #FILE 安装单个文件  ${TARGET_NAME}Targets.cmake由前面EXPORT参数生成的文件，用于find_package查找
    DESTINATION ${TARGET_INSTALL_LIBDIR}/cmake/${TARGET_NAME} #DESTINATION 需要安装到的路径
)

include(CMakePackageConfigHelpers)
write_basic_package_version_file(   #生成库版本相关文件,用于find_package时可以找到库的版本号
    ${TARGET_NAME}ConfigVersion.cmake
    VERSION ${PROJECT_VERSION_MAJOR}.${PROJECT_VERSION_MINOR}.${PROJECT_VERSION_PATCH}
    COMPATIBILITY SameMajorVersion
)
configure_package_config_file( #生成库相关文件,用于find_package时可以找到库
    cmake/PackageConfig.cmake.in ${TARGET_NAME}Config.cmake   #cmake/PackageConfig.cmake.in 该文件需要自己编写
    INSTALL_DESTINATION ${TARGET_INSTALL_LIBDIR}/cmake/${TARGET_NAME}  #指定该文件存放的路径
)

install(FILES  #将上述生成的两个文件安装到指定目录，用于find_package
            ${CMAKE_CURRENT_BINARY_DIR}/${TARGET_NAME}Config.cmake
            ${CMAKE_CURRENT_BINARY_DIR}/${TARGET_NAME}ConfigVersion.cmake DESTINATION
            ${TARGET_INSTALL_LIBDIR}/cmake/${TARGET_NAME}
)
```

- PackageConfig.cmake.in 文件放在CMakeLists.txt同一级目录下的cmake目录下

```shell
XXX
├── cmake
│   └── PackageConfig.cmake.in
├── CMakeLists.txt
```

- PackageConfig.cmake.in内容如下

```shell
@PACKAGE_INIT@   #内置宏

set(@PROJECT_NAME@_INCLUDE_DIRS ${PACKAGE_PREFIX_DIR}/include) #配置库头文件路径，对外导出变量@PROJECT_NAME@_INCLUDE_DIRS供外部引用
set(@PROJECT_NAME@_STATIC_LIBRARIES ${PACKAGE_PREFIX_DIR}/lib/lib@TARGET_NAME@.a) #配置库，对外导出变量@PROJECT_NAME@_LIBRARIES供外部引用
set(@PROJECT_NAME@SHARED_LIBRARIES ${PACKAGE_PREFIX_DIR}/lib/lib@TARGET_NAME@.so)

include(CMakeFindDependencyMacro)
include(${CMAKE_CURRENT_LIST_DIR}/@TARGET_NAME@Targets.cmake)
check_required_components(@TARGET_NAME@) #检查@TARGET_NAME@
```
