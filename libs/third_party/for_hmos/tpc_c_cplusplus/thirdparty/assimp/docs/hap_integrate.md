# assimp集成到应用hap
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
  tpc_c_cplusplus/thirdparty/assimp     #三方库assimp的目录结构如下
  ├── docs                              #三方库相关文档的文件夹
  ├── HPKBUILD                          #构建脚本
  ├── SHA512SUM                         #三方库校验文件
  ├── OAT.xml              			  #OAT文件
  ├── README.OpenSource                 #说明三方库源码的下载地址，版本，license等信息
  ├── README_zh.md   
  ```
  
- 在lycium目录下编译三方库
  编译环境的搭建参考[准备三方库构建环境](../../../lycium/README.md#1编译环境准备)
  
  ```
  cd lycium
  ./build.sh assimp
  ```
- 三方库头文件及生成的库
  在lycium目录下会生成usr目录，该目录下存在已编译完成的32位和64位三方库
  ```
  assimp/armeabi-v7a assimp/arm64-v8a
  ```
  
- [测试三方库](#测试三方库)

## 应用中使用三方库

-  在IDE的cpp目录下新增thirdparty目录，将编译生成的头文件拷贝到该目录下，将编译生成的三方库全部（动态库名字带版本号和不带版本号的都需要）拷贝到工程的libs目录下，如下图所示
&nbsp;![thirdparty_install_dir](pic/screen_cut.jpg)
- 在最外层（cpp目录下）CMakeLists.txt中添加如下语句
  ```
  #将三方库加入工程中
  target_link_libraries(entry PRIVATE ${CMAKE_SOURCE_DIR}/../../../libs/${OHOS_ARCH}/libassimp.so)
  #将三方库的头文件加入工程中
  target_include_directories(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/assimp/${OHOS_ARCH}/include)
  ```
  
## 测试三方库
三方库的测试使用原库自带的测试用例来做测试，[准备三方库测试环境](../../../lycium/README.md#3ci环境准备)

- 将编译生成的unit可执行文件及测试数据准备好

  unit 在 assimp/assimp-5.2.5/arm64-v8a-build/bin  

  测试数据: 

  assimp/assimp-5.2.5/test/models

  assimp/assimp-5.2.5/test/models-nonbsd      

- 将准备好的文件推送到开发板，在windows命令行进行如下操作

  ```
  hdc_std shell mount -o remount,rw /         #修改系统权限为可读写
  hdc_std file send unit /data                #将可执行文件推入开发板data目录
  hdc_std file send models/ /data             #将测试文件推入开发板data目录
  hdc_std file send models-nonbsd/ /data      #将测试文件推入开发板data目录
  hdc_std file send libassimp.so.5.2.4  /system/lib64/libassimp.so.5
  hdc_std shell                          #进入开发板
  chmod 777 unit                         #添加权限
  ./unit                                 #执行测试用例
  ```

测试用例运行结果如下：

&nbsp;![zbar_test](pic/run_screen_cut.jpg)

## 参考资料
- [润和RK3568开发板标准系统快速上手](https://gitee.com/openharmony-sig/knowledge_demo_temp/tree/master/docs/rk3568_helloworld)
- [OpenHarmony三方库地址](https://gitee.com/openharmony-tpc)
- [OpenHarmony知识体系](https://gitee.com/openharmony-sig/knowledge)
