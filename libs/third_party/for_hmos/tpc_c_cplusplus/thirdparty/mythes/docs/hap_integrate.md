# mythes集成到应用hap
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
  tpc_c_cplusplus/thirdparty/mythes  #三方库mythes的目录结构如下
  ├── docs                              #三方库相关文档的文件夹
  ├── HPKBUILD                          #构建脚本
  ├── SHA512SUM                         #三方库校验文件
  ├── README.OpenSource                 #说明三方库源码的下载地址，版本，license等信息
  ├── README_zh.md   
  ```
  
- 在lycium目录下编译三方库
  编译环境的搭建参考[准备三方库构建环境](../../../lycium/README.md#1编译环境准备)
  ```
  cd lycium
  ./build.sh hunspell mythes
  ```
  
- 三方库头文件及生成的库
  在lycium目录下会生成usr目录，该目录下存在已编译完成的32位和64位三方库
  ```
  mythes/arm64-v8a   mythes/armeabi-v7a
  hunspell/arm64-v8a   hunspell/armeabi-v7a
  ```

- [测试三方库](#测试三方库)

## 应用中使用三方库

- 在IDE的cpp目录下新增thirdparty目录，将编译生成的库拷贝到该目录下，如下图所示

&nbsp;![thirdparty_install_dir](pic/mythes_install_dir.jpg)
- 在最外层（cpp目录下）CMakeLists.txt中添加如下语句
  ```
  #将三方库加入工程中
  target_link_libraries(entry PRIVATE ${CMAKE_SOURCE_DIR}/../../../libs/${OHOS_ARCH}/libmythes-1.2.so)
  #将三方库的头文件加入工程中
  target_include_directories(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/mythes/${OHOS_ARCH}/include)
  ```
## 测试三方库
三方库的测试使用原库自带的测试用例来做测试，[准备三方库测试环境](../../../lycium/README.md#3ci环境准备)

- 将编译生成的example可执行文件及测试资源文件(原库下有这些素材)th_en_US_new.idx th_en_US_new.dat checkme.lst morph.idx morph.dat morph.lst morph.aff morph.dic准备好

- 将准备好的文件推送到开发板，在windows命令行进行如下操作

  ```
  hdc_std shell mount -o remount,rw /     #修改系统权限为可读写
  hdc_std file send example /data         #将可执行文件推入开发板data目录
  hdc_std file send th_en_US_new.idx /data #将测试文件推入开发板data目录
  hdc_std file send th_en_US_new.dat /data 
  hdc_std file send checkme.lst /data  
  hdc_std file send morph.idx /data  
  hdc_std file send morph.dat /data  
  hdc_std file send morph.lst /data  
  hdc_std file send morph.aff /data  
  hdc_std file send morph.dic /data  
  hdc_std file send libc++_shared.so /system/lib64
  hdc_std file send libmythes-1.2.so /system/lib64 
  hdc_std file send libmythes-1.2.so.0 /system/lib64 
  hdc_std file send libmythes-1.2.so.0.0.0 /system/lib64 
  hdc_std file send libhunspell-1.7.so /system/lib64 
  hdc_std file send libhunspell-1.7.so.0 /system/lib64 
  hdc_std file send libhunspell-1.7.so.0.0.1 /system/lib64 
  hdc_std shell                      #进入开发板
  chmod 777 example                  #添加权限
  ./example th_en_US_new.idx th_en_US_new.dat checkme.lst #执行测试用例
  ./example morph.idx morph.dat morph.lst morph.aff morph.dic
  ```


&nbsp;![mythes_test_1](pic/mythes_test_1.jpg)
&nbsp;![mythes_test_2](pic/mythes_test_2.jpg)
&nbsp;![mythes_test_3](pic/mythes_test_3.jpg)


## 参考资料
- [润和RK3568开发板标准系统快速上手](https://gitee.com/openharmony-sig/knowledge_demo_temp/tree/master/docs/rk3568_helloworld)
- [OpenHarmony三方库地址](https://gitee.com/openharmony-tpc)
- [OpenHarmony知识体系](https://gitee.com/openharmony-sig/knowledge)
- [通过DevEco Studio开发一个NAPI工程](https://gitee.com/openharmony-sig/knowledge_demo_temp/blob/master/docs/napi_study/docs/hello_napi.md)
