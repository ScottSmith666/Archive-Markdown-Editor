# paho.mqtt.c 集成到应用hap

本库是在RK3568开发板上基于OpenHarmony3.2 Release版本的镜像验证的，如果是从未使用过RK3568，可以先查看[润和RK3568开发板标准系统快速上手](https://gitee.com/openharmony-sig/knowledge_demo_temp/tree/master/docs/rk3568_helloworld)。

## 开发环境

- [开发环境准备](../../../docs/hap_integrate_environment.md)

## 编译三方库

- 下载本仓库

  ```shell
  git clone https://gitee.com/openharmony-sig/tpc_c_cplusplus.git --depth=1
  ```

- 三方库目录结构

  ```
  tpc_c_cplusplus/thirdparty/mqtt		    #三方库libmqtt的目录结构如下
  ├── docs                                #三方库相关文档的文件夹
  ├── HPKBUILD                            #构建脚本
  ├── SHA512SUM                           #三方库校验文件
  ├── README.OpenSource                   #说明三方库源码的下载地址，版本，license等信息
  ├── README_zh.md   
  ```
  
- 在lycium目录下编译三方库

  编译环境的搭建参考[准备三方库构建环境](../../../lycium/README.md#1编译环境准备)

  ```
  cd lycium
  ./build.sh mqtt
  ```

- 三方库头文件及生成的库

  在lycium目录下会生成usr目录，该目录下存在已编译完成的32位和64位三方库

  ```
  mqtt/arm64-v8a   mqtt/armeabi-v7a
  ```

- [测试三方库](#测试三方库)

## 应用中使用三方库

- 在IDE的cpp目录下新增thirdparty目录，将编译生成的文件都拷贝到该目录下，如下图所示：

  &nbsp;![thirdparty_install_dir](pic/libmqtt_install_dir.png)

  将编译生成的三方动态库（动态库名字带版本号和不带版本号的都需要）拷贝到工程的libs目录下:

  &nbsp;![thirdparty_install_dir1](pic/libmqtt_install_dir1.png)

- 在最外层（cpp目录下）CMakeLists.txt中添加如下语句：

  ```makefile
  #将三方库加入工程中
  target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/paho.mqtt.c/${OHOS_ARCH}/lib/libpaho-mqtt3a.so)
  target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/paho.mqtt.c/${OHOS_ARCH}/lib/libpaho-mqtt3c.so)
  #将三方库及其依赖库的头文件加入工程中
  target_include_directories(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/paho.mqtt.c/${OHOS_ARCH}/include)
  ```



## 测试三方库

三方库的测试使用原库自带的测试用例来做测试，[准备三方库测试环境](../../../lycium/README.md#3ci环境准备)

进入到构建目录执行`ctest`运行测试用例（arm64-v8a-build为构建64位的目录，armeabi-v7a-build为构建32位的目录）

需要注意的是：

- 本三方库为mqtt client端，需要搭建mqtt broker端并与之连接才可以进行测试，[搭建mqtt服务器参考](https://blog.csdn.net/qq_40183977/article/details/127531651)
- 搭建broker端需要注意端口号以及用户名密码等与test文件下的测试文件里面写的保持一致（本库测试用例里的opts.username = "testuser";
  	opts.password = "testpassword";）
- 运行python ../test/mqttsas.py后面可以带参数设置broker的地址和端口号，如：python mqttsas.py 192.168.63.102 1886
- 如在windows下使用hdc forward rport进行端口映射的方式连接测试板子，需要注意每跑完一个test用例就会断开，不建议使用这种方式测试

&nbsp;![libass_test](pic/libmqtt_test.png)

## 参考资料

- [润和RK3568开发板标准系统快速上手](https://gitee.com/openharmony-sig/knowledge_demo_temp/tree/master/docs/rk3568_helloworld)
- [OpenHarmony三方库地址](https://gitee.com/openharmony-tpc)
- [OpenHarmony知识体系](https://gitee.com/openharmony-sig/knowledge)
- [通过DevEco Studio开发一个NAPI工程](https://gitee.com/openharmony-sig/knowledge_demo_temp/blob/master/docs/napi_study/docs/hello_napi.md)