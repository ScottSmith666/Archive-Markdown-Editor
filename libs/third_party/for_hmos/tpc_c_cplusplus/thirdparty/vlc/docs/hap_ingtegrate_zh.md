# vlc集成到应用hap

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
  tpc_c_cplusplus/thirdparty/vlc  #三方库vid.stab的目录结构如下
  ├── docs                              #三方库相关文档的文件夹
  ├── HPKBUILD                          #构建脚本
  ├── HPKCHECK                          #自动化脚本
  ├── OAT.xml                           #OAT文件  
  ├── README.OpenSource                 #说明三方库源码的下载地址，版本，license等信息
  ├── README_en.md                      #英文说明文档简介
  ├── README_zh.md                      #中文说明文档简介 
  ├── SHA512SUM                         #三方库校验文件
  ```
  
- 在lycium目录下编译三方库
  编译环境的搭建参考[准备三方库构建环境](../../../lycium/README.md#1编译环境准备)

  ```
  cd lycium
  ./build.sh vlc
  ```
  注意：按需修改HPKBUILD的downloadpackage、autounpack的两个变量，可以修改代码以及更新最新的代码


- 三方库头文件及生成的库
  在lycium目录下会生成usr目录，该目录下存在已编译完成的64位三方库
  ```
  vlc/arm64-v8a
  ```

## 应用中使用三方库

- 将编译生成的库拷贝\ohos_vlc-master\entry\libs下，如下图所示
  ![thirdparty_install_dir](./pig/thirdparty.png)

- 在最外层（\src\main\cpp目录下）CMakeLists.txt中添加如下语句
  add_library(vlc SHARED IMPORTED)
  set_target_properties(vlc PROPERTIES
      IMPORTED_LOCATION "${CMAKE_CURRENT_SOURCE_DIR}/../../../libs/${OHOS_ARCH}/libvlc.so.5.6.1")



## 参考资料
- [润和RK3568开发板标准系统快速上手](https://gitee.com/openharmony-sig/knowledge_demo_temp/tree/master/docs/rk3568_helloworld)
- [OpenHarmony三方库地址](https://gitee.com/openharmony-tpc)
- [OpenHarmony知识体系](https://gitee.com/openharmony-sig/knowledge)
- [通过DevEco Studio开发一个NAPI工程](https://gitee.com/openharmony-sig/knowledge_demo_temp/blob/master/docs/napi_study/docs/hello_napi.md)
