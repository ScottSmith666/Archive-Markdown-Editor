# tinyxml2如何集成到应用hap
## 准备应用工程
本库是基于DevEco Studio 3.1 Beta1版本，在RK3568开发板上验证的，如果是从未使用过RK3568，可以先查看[润和RK3568开发板标准系统快速上手](https://gitee.com/openharmony-sig/knowledge_demo_temp/tree/master/docs/rk3568_helloworld)。
### 准备应用开发环境

- [开发环境准备](../../../docs/hap_integrate_environment.md)

### 增加构建脚本及配置文件

- 下载本仓库代码  <br />
  通过[C/C++三方库TCP仓](https://gitee.com/openharmony-sig/tpc_c_cplusplus)下载本三方库代码并将其解压。
- 仓库代码库目录结构说明
  ```
  tpc_c_cplusplus/thirdparty/tinyxml2  #三方库tinyxml2 的目录结构如下
  ├── docs                  #存放三方库相关文档的文件夹
  ├── BUILD.gn                # 构建脚本，支持rom包集成
  ├── CmakeLists.txt        #构建脚本，支持hap包集成
  ├── bundle.json           #三方库组件定义文件
  ├── README.OpenSource     #说明三方库源码的下载地址，版本，license等信息
  ├── README_zh.md
  ```
- 将tinyxml2 拷贝至工程xxxx/entry/src/main/cpp/thirdparty目录下
### 准备三方库源码
- 三方库下载地址：[tinyxml2](https://github.com/leethomason/tinyxml2), 版本：v9.0.0
  解压后修改库文件名为tinyxml2，拷贝至工程xxxx/entry/src/main/cpp/thirdparty/tinyxml2目录下 
## 应用中使用三方库
- 将三方库加入工程中，目录结构如下：
  ```
  demo/entry/src/main/cpp
  ├── thirdparty              #三方库存放目录
  │   ├──tinyxml2             #三方库tinyxml2
  ├── CMakeLists.txt          #工程目录的构建脚本
  ├── .....                   #工程目录的其他文件
  ```
- 在工程顶级CMakeLists.txt中引入三方库，增加如下代码
  ```
  target_include_directories(工程库名 PRIVATE thirdparty/tinyxml2/tinyxml2)
  add_subdirectory(${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/tinyxml2)      #引入子目录下的CMakeLists.txt
  target_link_libraries(工程库名 PUBLIC tinyxml2)   #工程依赖三方库tinyxml2
  ```
## 编译工程

- 连接上设备后，DevEco Studio就会显示被发现设备。然后，点击“运行”，即可依次完成该应用“编译”和“安装”的过程，如图：
  &nbsp;![install](pic/install.png)

## 运行效果
- 在 [tinyxml2](https://gitee.com/openharmony-tpc/openharmony_tpc_samples/tree/master/tinyxml2)中，运行效果如下图
  &nbsp;![演示](pic/hap.jpeg)
## 参考资料
- [润和RK3568开发板标准系统快速上手](https://gitee.com/openharmony-sig/knowledge_demo_temp/tree/master/docs/rk3568_helloworld)
- [OpenHarmony三方库地址](https://gitee.com/openharmony-tpc)
- [OpenHarmony知识体系](https://gitee.com/openharmony-sig/knowledge)
- [通过DevEco Studio开发一个NAPI工程](https://gitee.com/openharmony-sig/knowledge_demo_temp/blob/master/docs/napi_study/docs/hello_napi.md#%E5%A6%82%E4%BD%95%E9%80%9A%E8%BF%87deveco-studio%E5%BC%80%E5%8F%91%E4%B8%80%E4%B8%AAnapi%E5%B7%A5%E7%A8%8B)

