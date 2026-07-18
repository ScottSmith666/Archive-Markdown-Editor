cmake_minimum_required (VERSION 3.12)

project(TINYXPATH VERSION 1.3.1)
enable_language(CXX C ASM)

option(BUILD_SAMPLE "Build sample" OFF)
set(BUILD_SHARED_LIBS TRUE CACHE BOOL "If TRUE, tinyxpath is built as a shared library, otherwise as a static library")

set(TARGET_NAME tinyxpath)
set(TARGET_SAMPLE_NAME tinyxpath_test)

set(TARGET_INSTALL_INCLUDEDIR include)
set(TARGET_INSTALL_BINDIR bin)
set(TARGET_INSTALL_LIBDIR lib)

set(TARGET_SRC_PATH ${CMAKE_CURRENT_SOURCE_DIR}/tinyxpath1.3.1)
set(TARGET_SRC ${TARGET_SRC_PATH}/tinystr.cpp
                    ${TARGET_SRC_PATH}/tinyxml.cpp
                    ${TARGET_SRC_PATH}/tinyxmlerror.cpp
                    ${TARGET_SRC_PATH}/tinyxmlparser.cpp
                    ${TARGET_SRC_PATH}/action_store.cpp
                    ${TARGET_SRC_PATH}/lex_util.cpp
                    ${TARGET_SRC_PATH}/node_set.cpp
                    ${TARGET_SRC_PATH}/tokenlist.cpp
                    ${TARGET_SRC_PATH}/xml_util.cpp
                    ${TARGET_SRC_PATH}/xpath_expression.cpp
                    ${TARGET_SRC_PATH}/xpath_processor.cpp
                    ${TARGET_SRC_PATH}/xpath_stack.cpp
                    ${TARGET_SRC_PATH}/xpath_stream.cpp
                    ${TARGET_SRC_PATH}/xpath_syntax.cpp
                    ${TARGET_SRC_PATH}/xpath_static.cpp)
if(BUILD_SAMPLE)
    set(TARGET_SAMPLE_SRC ${TARGET_SRC_PATH}/htmlutil.cpp ${TARGET_SRC_PATH}/main.cpp)
endif()

set(TARGET_INCLUDE ${TARGET_SRC_PATH})

add_library(${TARGET_NAME} ${TARGET_SRC})
target_include_directories(${TARGET_NAME} PRIVATE ${TARGET_INCLUDE})

if(BUILD_SHARED_LIBS)
    set_target_properties(${TARGET_NAME} PROPERTIES VERSION ${PROJECT_VERSION_MAJOR}.${PROJECT_VERSION_MINOR}.${PROJECT_VERSION_PATCH} 
                                                    SOVERSION ${PROJECT_VERSION_MAJOR})
endif()

if(BUILD_SAMPLE)
    add_executable(${TARGET_SAMPLE_NAME} ${TARGET_SAMPLE_SRC})
    target_include_directories(${TARGET_SAMPLE_NAME} PRIVATE ${TARGET_INCLUDE})
    target_link_libraries(${TARGET_SAMPLE_NAME} PUBLIC ${TARGET_NAME})
endif()

install(TARGETS ${TARGET_NAME}
        EXPORT ${TARGET_NAME}
        PUBLIC_HEADER DESTINATION ${TARGET_INSTALL_INCLUDEDIR}
        PRIVATE_HEADER DESTINATION ${TARGET_INSTALL_INCLUDEDIR}
        RUNTIME DESTINATION ${TARGET_INSTALL_BINDIR}
        LIBRARY DESTINATION ${TARGET_INSTALL_LIBDIR}
        ARCHIVE DESTINATION ${TARGET_INSTALL_LIBDIR})
        
install(FILES ${TARGET_SRC_PATH}/xpath_processor.h
            ${TARGET_SRC_PATH}/action_store.h
            ${TARGET_SRC_PATH}/byte_stream.h
            ${TARGET_SRC_PATH}/lex_token.h
            ${TARGET_SRC_PATH}/lex_util.h
            ${TARGET_SRC_PATH}/node_set.h
            ${TARGET_SRC_PATH}/tinystr.h
            ${TARGET_SRC_PATH}/tinyxml.h
            ${TARGET_SRC_PATH}/tinyxpath_conf.h
            ${TARGET_SRC_PATH}/tokenlist.h
            ${TARGET_SRC_PATH}/xml_util.h
            ${TARGET_SRC_PATH}/xpath_expression.h
            ${TARGET_SRC_PATH}/xpath_processor.h
            ${TARGET_SRC_PATH}/xpath_stack.h
            ${TARGET_SRC_PATH}/xpath_static.h
            ${TARGET_SRC_PATH}/xpath_stream.h
            ${TARGET_SRC_PATH}/xpath_syntax.h
        DESTINATION ${TARGET_INSTALL_INCLUDEDIR}/${TARGET_NAME})

#if(BUILD_SAMPLE)
#install(FILES  ${TARGET_SRC_PATH}/htmlutil.h
#        DESTINATION ${TARGET_INSTALL_INCLUDEDIR}/${TARGET_NAME})
#endif()

install(
    EXPORT ${TARGET_NAME}
    FILE ${TARGET_NAME}Targets.cmake
   # NAMESPACE ${TARGET_NAMESPACE}::
    DESTINATION ${TARGET_INSTALL_LIBDIR}/cmake/${TARGET_NAME}
)

include(CMakePackageConfigHelpers)

write_basic_package_version_file(
    ${TARGET_NAME}ConfigVersion.cmake
    VERSION ${PROJECT_VERSION_MAJOR}.${PROJECT_VERSION_MINOR}.${PROJECT_VERSION_PATCH}
    COMPATIBILITY SameMajorVersion
)

configure_package_config_file(
    cmake/PackageConfig.cmake.in ${TARGET_NAME}Config.cmake
    INSTALL_DESTINATION ${TARGET_INSTALL_LIBDIR}/cmake/${TARGET_NAME}
)

install(FILES
            ${CMAKE_CURRENT_BINARY_DIR}/${TARGET_NAME}Config.cmake
            ${CMAKE_CURRENT_BINARY_DIR}/${TARGET_NAME}ConfigVersion.cmake
        DESTINATION
            ${TARGET_INSTALL_LIBDIR}/cmake/${TARGET_NAME}
)