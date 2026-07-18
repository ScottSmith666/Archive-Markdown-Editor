# libmysofa集成到应用hap
本库是在RK3568开发板上基于OpenHarmony的镜像验证的，如果是从未使用过RK3568，可以先查看[润和RK3568开发板标准系统快速上手](https://gitee.com/openharmony-sig/knowledge_demo_temp/tree/master/docs/rk3568_helloworld)。
## 开发环境
- [开发环境准备](../../../docs/hap_integrate_environment.md)
## 编译三方库
- 下载本仓库
  ```shell
  git clone https://gitee.com/openharmony-sig/tpc_c_cplusplus.git --depth=1
  ```
  
- 三方库目录结构
  ```
  tpc_c_cplusplus/thirdparty/libmysofa                    #三方库的目录结构如下
  ├── docs                                                #三方库相关文档的文件夹
  ├── HPKBUILD                                            #构建脚本
  ├── HPKCHECK                                            #测试脚本
  ├── SHA512SUM                                           #三方库校验文件
  ├── README.OpenSource                                   #说明三方库源码的下载地址，版本，license等信息
  ├── README_zh.md                                        #三方库简介
  ├── OAT.xml                                             #扫描结果文件
  ├── libmysofa_oh_pkg.patch                              #patch文件
  ```
  
- 在lycium目录下编译三方库，编译环境的搭建参考[准备三方库构建环境](../../../lycium/README.md#1编译环境准备)
  
  ```shell
  cd lycium
  ./build.sh libmysofa
  ```
  
- 三方库头文件及生成的库，在lycium目录下会生成usr目录，该目录下存在已编译完成的32位和64位三方库
  
  ```
  libmysofa/armeabi-v7a
  libmysofa/arm64-v8a
  ```
  
- [测试三方库](#测试三方库)

## 应用中使用三方库
- 在IDE的cpp目录下新增thirdparty目录，将生成的静态库文件以及头文件拷贝到该目录下，将依赖库zlib生成的静态库也拷贝到该目录下，如下图所示
  
  ![install.dir](./pic/install.dir.png)
  
- 在最外层（cpp目录下）CMakeLists.txt中添加如下语句
  ```makefile
  #将三方库加入工程中
  target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/zlib/${OHOS_ARCH}/lib/libz.a)
  target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/libmysofa/${OHOS_ARCH}/lib/libmysofa.a)
  
  #将三方库的头文件加入工程中
  target_include_directories(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/libmysofa/${OHOS_ARCH}/include)
  ```
## 测试三方库
三方库的测试使用原库提供的测试用例来做测试，[准备三方库测试环境](../../../lycium/README.md#3ci环境准备)

进入到构建目录准备测试，例如目录为arm64-v8a-build，对其中27个用例执行ctest进行测试，如下图所示

```shell
cd tpc_c_cplusplus/thirdparty/libmysofa/libmysofa-1.3.2-3.11.2/arm64-v8a-build
ctest
```

![test-pass](./pic/singletest.png)



剩余16个测试由于不支持node工具，可在执行完./test.sh libmysofa操作之后手动执行，在tpc_c_cplusplus/thirdparty/libmysofa/libmysofa-1.3.2/tests目录下，使用compare.sh和compareIgnoreNew.sh脚本，要先将两个脚本文件里的最后一行删除，保留测试文件，测试步骤为

```shell
./compareIgnoreNew.sh ./H20_44K_16bit_256tap_FIR_SOFA
./compare.sh ./MIT_KEMAR_large_pinna
./compareIgnoreNew.sh ./MIT_KEMAR_normal_pinna
./compare.sh ./MIT_KEMAR_normal_pinna.old
./compareIgnoreNew.sh ./dtf_nh2
./compareIgnoreNew.sh ./hrtf_c_nh898
./compare.sh ./CIPIC_subject_003_hrir_final
./compare.sh ./FHK_HRIR_L2354
./compare.sh ./LISTEN_1002_IRC_1002_C_HRIR
./compare.sh ./Pulse
./compare.sh ./Tester
./compare.sh ./TU-Berlin_QU_KEMAR_anechoic_radius_0.5_1_2_3_m
./compare.sh ./TU-Berlin_QU_KEMAR_anechoic_radius_0.5m
./compare.sh ./example_dummy_sofa48
./compare.sh ./example_dummy_sofa48_with_user_defined_variable
./compare.sh ./TestSOFA48_netcdf472
```

每一次测试之后将生成的tmp1.json和tmp2.json改名保存下来，后面将例如arm64-v8a-build构建目录移动至linux环境下进行测试，使用node工具进行测试，每一次测试用例为之前已改名的两个json文件，有两种测试的diff规则，json-diff.js和json-diffIgnoreNew.js，测试结果看执行命令的返回值$?，只要有一个为0则为成功，一个失败就使用另外一个测试，两个都不成功则用例执行测试失败，下方为测试用例举例

```shell
node ./json-diff.js ./CIPIC_subject_003_hrir_final1.json ./CIPIC_subject_003_hrir_final2.json
```

```shell
echo $?
```



## 参考资料
- [润和RK3568开发板标准系统快速上手](https://gitee.com/openharmony-sig/knowledge_demo_temp/tree/master/docs/rk3568_helloworld)
- [OpenHarmony三方库地址](https://gitee.com/openharmony-tpc)
- [OpenHarmony知识体系](https://gitee.com/openharmony-sig/knowledge)
- [通过DevEco Studio开发一个NAPI工程](https://gitee.com/openharmony-sig/knowledge_demo_temp/blob/master/docs/napi_study/docs/hello_napi.md)
