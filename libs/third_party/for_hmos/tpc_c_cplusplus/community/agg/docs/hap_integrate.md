# Anti-Grain Geometry 集成到应用hap

本库是在RK3568开发板上基于OpenHarmony3.2 Release版本的镜像验证的，如果是从未使用过RK3568，可以先查看[润和RK3568开发板标准系统快速上手](https://gitee.com/openharmony-sig/knowledge_demo_temp/tree/master/docs/rk3568_helloworld)。

## 开发环境
- [开发环境准备](../../../docs/hap_integrate_environment.md)

## 编译三方库

- 下载本仓库

  ```shell
  git clone https://gitee.com/openharmony-sig/tpc_c_cplusplus.git --depth=1
  ```

- 三方库目录结构

  ```shell
  tpc_c_cplusplus
  ├── docs                  # TPC_C_PLUSPLUS仓库文档目录
  ├── thirdparty/agg        # 三方库agg的目录结构如下
  |    ├── docs                              # 三方库相关文档的文件夹
  |    ├── HPKBUILD                          # 构建脚本
  |    ├── SHA512SUM                         # 三方库校验文件
  |    ├── README.OpenSource                 # 说明三方库源码的下载地址，版本，license等信息
  |    ├── README_zh.md
  ├── lycium               # 三方库编译目录 

  ```

- 进入到编译目录`lycium`并编译`agg`三方库

  ```shell
  cd tpc_c_cplusplus/lycium
  ./build.sh agg
  ```

- 三方库头文件及生成的库

  在编译目录`lycium`目录下会生成`usr`目录，该目录下存在已编译完成的32位和64位三方库

  ```shell
  agg/arm64-v8a   agg/armeabi-v7a
  ```

- [测试三方库](#测试三方库)

## 应用中使用三方库

- 在IDE的cpp目录下新增thirdparty目录，将编译生成的库拷贝到该目录下，如下图所示
  &nbsp;![thirdparty_install_dir](../../thirdparty_template/docs/pic/xxx_install_dir.png)  <br>
  其中`xxx`代表的是三方库名字`agg`
- 在最外层（cpp目录下）CMakeLists.txt中添加如下语句

  ```shell
  #将三方库加入工程中
  target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/agg/${OHOS_ARCH}/lib/libagg.a)
  #将三方库的头文件加入工程中
  target_include_directories(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/agg/${OHOS_ARCH}/include)
  ```

  ![thirdparty_usage](../../thirdparty_template/docs/pic/xxx_usage.png)

## 测试三方库

该三方库的测试依赖X11的协议，暂时无法在OH环境上进行测试。

## 参考资料

- [润和RK3568开发板标准系统快速上手](https://gitee.com/openharmony-sig/knowledge_demo_temp/tree/master/docs/rk3568_helloworld)
- [OpenHarmony三方库地址](https://gitee.com/openharmony-tpc)
- [OpenHarmony知识体系](https://gitee.com/openharmony-sig/knowledge)
