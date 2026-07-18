# the minimum version of CMake.
cmake_minimum_required(VERSION 3.4.1)
project(ConcurrentQueue)

set(NATIVERENDER_ROOT_PATH ${CMAKE_CURRENT_SOURCE_DIR})

include_directories(${NATIVERENDER_ROOT_PATH}
                    ${NATIVERENDER_ROOT_PATH}/concurrentqueue)


add_library(concurrentqueue SHARED concurrentqueue/c_api/concurrentqueue.cpp concurrentqueue/c_api/concurrentqueue.cpp)

add_executable(unittests concurrentqueue/tests/unittests/unittests.cpp concurrentqueue/tests/common/simplethread.cpp concurrentqueue/tests/common/systemtime.cpp)
add_executable(fuzztests concurrentqueue/tests/fuzztests/fuzztests.cpp concurrentqueue/tests/common/simplethread.cpp concurrentqueue/tests/common/systemtime.cpp)

target_include_directories(concurrentqueue PRIVATE ${NATIVERENDER_ROOT_PATH}
                         ${NATIVERENDER_ROOT_PATH}/concurrentqueue/tests/common
                         ${NATIVERENDER_ROOT_PATH}/concurrentqueue/tests/unittests
                         ${NATIVERENDER_ROOT_PATH}/concurrentqueue/tests/fuzztests
                         ${NATIVERENDER_ROOT_PATH}/concurrentqueue/tests/c_api)

target_link_libraries(unittests PUBLIC concurrentqueue)