# openldap集成到应用hap
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
  tpc_c_cplusplus/thirdparty/openldap     #三方库openldap的目录结构如下
  ├── docs                              #三方库相关文档的文件夹
  ├── HPKBUILD                          #构建脚本
  ├── SHA512SUM                         #三方库校验文件
  ├── README.OpenSource                 #说明三方库源码的下载地址，版本，license等信息
  ├── OAT.xml                           #版权校验文件
  ├── openldap_oh_pkg.patch             #补丁文件
  ├── README_zh.md      
  ```


- 在lycium目录下编译三方库
  编译环境的搭建参考[准备三方库构建环境](../../../lycium/README.md#1编译环境准备)
  
  ```
  
  cd lycium
  ./build.sh openldap
  ```
- 三方库头文件及生成的库
  在lycium目录下会生成usr目录，该目录下存在已编译完成的32位和64位三方库
  
  ```
  openldap/arm64-v8a   openldap/armeabi-v7a          
  ```
  
- [测试三方库](#测试三方库)

## 应用中使用三方库
- 在IDE中将编译生成的库都拷贝到libs目录下，并且将lycuim/usr目录下面的openldap 目录拷贝到 thirdpart目录下面。 如下图所示
&nbsp;![openldap_install](pic/openldap_install.png)
- 在最外层（cpp目录下）CMakeLists.txt中添加如下语句
  ```
  
  #将三方库加入工程中
  target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/../../../libs/${OHOS_ARCH}/liblber.so)
  target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/../../../libs/${OHOS_ARCH}/libldap.so)
  
  #将三方库的头文件加入工程中
  target_include_directories(entry PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/openldap/${OHOS_ARCH}/include)
  
  ```
  ![openldap_usage](pic/openldap_usage.png)
## 测试三方库
三方库的测试使用原库自带的测试用例来做测试，[准备三方库测试环境](../../../lycium/README.md#3ci环境准备)



- 将测试资源导入到开发板
- 设置依赖服务程序路径
```
32位系统
export PATH=/data/local/tmp/lycium/usr/openldap/armeabi-v7a/bin:/data/local/tmp/lycium/usr/openldap/armeabi-v7a/sbin:/data/local/tmp/lycium/usr/openldap/armeabi-v7a/libexec:$PATH

##64位系统
export PATH=/data/local/tmp/lycium/usr/openldap/arm64-v8a/bin:/data/local/tmp/lycium/usr/openldap/arm64-v8a/sbin:/data/local/tmp/lycium/usr/openldap/arm64-v8a/libexec:$PATH
```  
- 进入到构建目录执行 make test 运行测试用例，如下截图（arm64-v8a-build为构建64位的目录，armeabi-v7a-build为构建32位的目录）



![openldap](pic/openldap_test.png)

## 参考资料
- [润和RK3568开发板标准系统快速上手](https://gitee.com/openharmony-sig/knowledge_demo_temp/tree/master/docs/rk3568_helloworld)
- [OpenHarmony三方库地址](https://gitee.com/openharmony-tpc)
- [OpenHarmony知识体系](https://gitee.com/openharmony-sig/knowledge)
- [通过DevEco Studio开发一个NAPI工程](https://gitee.com/openharmony-sig/knowledge_demo_temp/blob/master/docs/napi_study/docs/hello_napi.md)
