# libtld集成到应用hap
本库是在RK3568开发板上基于OpenHarmony3.2 Release版本的镜像验证的，如果是从未使用过RK3568，可以先查看[润和RK3568开发板标准系统快速上手](https://gitee.com/openharmony-sig/knowledge_demo_temp/tree/master/docs/rk3568_helloworld)。
## 开发环境

- [开发环境准备](../../../docs/hap_integrate_environment.md)

## 编译三方库
- 下载本仓库
  ```
  git clone https://gitee.com/openharmony-sig/tpc_c_cplusplus.git --depth=1
  ```
  
- 三方库目录结构
  ```
    tpc_c_cplusplus/thirdparty/libtld		  #三方库libtld的目录结构如下
    ├── libtld                              #三方库libtld的目录
    │   ├── HPKBUILD						  #构建脚笨
    │   ├── HPKCHECK						  #测试脚本
    │   ├── README.OpenSource				  #说明三方库源码的下载地址，版本，license等信息
    │   ├── README_zh.md					  #libtld三方库说明
    │   └── docs                            #三方库相关文档的文件夹
    │       ├── pic
    │       │   ├── libtld_install.png
    │       │   └── libtld_test.png
    │       └── hap_integrate.md
  ```
  
- 编译三方库
  编译环境的搭建参考[准备三方库构建环境](../../../lycium/README.md#1编译环境准备)
  
  ```
  cd lycium
  ./build.sh libtld
  ```
  
- 三方库头文件及生成的库
  在lycium目录下会生成usr目录，该目录下存在已编译完成的32位和64位三方库
  
  ```
  libtld/arm64-v8a   libtld/armeabi-v7a
  ```
  
- [测试三方库](#测试三方库)

## 应用中使用三方库
- 拷贝动态库到`\\entry\libs\${OHOS_ARCH}\`目录：
  动态库需要在`\\entry\libs\${OHOS_ARCH}\`目录，才能集成到hap包中，所以需要将对应的so文件拷贝到对应CPU架构的目录
  
- 在IDE的cpp目录下新增thirdparty目录，将编译生成的库拷贝到该目录下，如下图所示

  &nbsp;![thirdparty_install_dir](pic/libtld_install.png)

- 在最外层（cpp目录下）CMakeLists.txt中添加如下语句
  ```
  target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/libtld/${OHOS_ARCH}/lib/libtld.so.2)
  #将三方库的头文件加入工程中
  include_directories(${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/libtld/${OHOS_ARCH}/include)
  ```
## 测试三方库
三方库的测试使用原库自带的测试用例来做测试，[准备三方库测试环境](../../../lycium/README.md#3ci环境准备)

  进入到构建目录（arm64-v8a-build为构建64位的目录，armeabi-v7a-build为构建32位的目录）,执行如下操作步骤:

- 配置环境变量
  执行如下命令：

  ```shell
  export LD_LIBRARY_PATH=${LYCIUM_ROOT}/usr/libtld/${ARCH}/lib:$LD_LIBRARY_PATH
  ```
  > 注意：LYCIUM_ROOT代表/data/tpc_c_cplusplus/lycium；ARCH代表当前测试架构。

- 将 BUILD/libtld/tlds.tld 文件 复制到 /data/local/tld_file/tlds.tld
 执行如下命令：

  ```shell
  hdc_std shell mount -o remount,rw /         #修改系统权限为可读写

  hdc_std file send tlds.tld /data/local/tld_file
  ```
- 执行测试项：

  ```shell
  cd tests
  ./unittest --source-dir ../../libtld-2.0.5
  ```
  &nbsp;![libtld_test](pic/libtld_test.png)


## 参考资料
- [润和RK3568开发板标准系统快速上手](https://gitee.com/openharmony-sig/knowledge_demo_temp/tree/master/docs/rk3568_helloworld)
- [OpenHarmony三方库地址](https://gitee.com/openharmony-tpc)
- [OpenHarmony知识体系](https://gitee.com/openharmony-sig/knowledge)
- [通过DevEco Studio开发一个NAPI工程](https://gitee.com/openharmony-sig/knowledge_demo_temp/blob/master/docs/napi_study/docs/hello_napi.md)
