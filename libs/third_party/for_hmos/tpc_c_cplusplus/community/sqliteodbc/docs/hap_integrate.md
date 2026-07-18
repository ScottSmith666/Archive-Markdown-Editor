# sqliteodbc集成到应用hap
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
  tpc_c_cplusplus/thirdparty/sqliteodbc #三方库sqliteodbc的目录结构如下
  ├── docs                              #三方库相关文档的文件夹
  ├── HPKBUILD                          #构建脚本
  ├── SHA512SUM                         #三方库校验文件
  ├── README.OpenSource                 #说明三方库源码的下载地址，版本，license等信息
  ├── README_zh.md   
  ```
  
- 在lycium目录下编译三方库
  sqliteodbc库依赖sqlite、unixODBC、libxml2、tcl、xz、zlib这6个库，所以在build时需要将依赖库一起编译进来。
  编译环境的搭建参考[准备三方库构建环境](../../../lycium/README.md#1编译环境准备)
  ```
  cd lycium
  ./build.sh sqliteodbc sqlite unixODBC libxml2 tcl xz zlib
  ```
  
- 三方库头文件及生成的库
  在lycium目录下会生成usr目录，该目录下存在已编译完成的32位和64位三方库
  ```
  sqliteodbc/arm64-v8a  sqliteodbc/armeabi-v7a
  sqlite/arm64-v8a  sqlite/armeabi-v7a
  unixODBC/arm64-v8a  unixODBC/armeabi-v7a
  libxml2/arm64-v8a  libxml2/armeabi-v7a
  tcl/arm64-v8a  tcl/armeabi-v7a
  xz/arm64-v8a  xz/armeabi-v7a
  zlib/arm64-v8a  zlib/armeabi-v7a
  ```

- [测试三方库](#测试三方库)

## 应用中使用三方库

- 在IDE的cpp目录下新增thirdparty目录，将编译生成的库拷贝到该目录下，如下图所示
&nbsp;![thirdparty_install_dir](pic/sqliteodbc_install_dir.png)
- 在最外层（cpp目录下）CMakeLists.txt中添加如下语句
  ```
  #将三方库加入工程中
  target_link_libraries(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/sqliteodbc/${OHOS_ARCH}/lib/libsqlite3odbc-0.9998.so)
  #将三方库的头文件加入工程中
  target_include_directories(entry PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/thirdparty/unixODBC/${OHOS_ARCH}/include)
  ```
## 测试三方库
sqliteodbc三方库的测试使用unixODBC库中的isql命令来做测试，步骤如下：

- 填写unixODBC安装目录下面的etc目录下的配置文件odbcinst.ini，其中Driver和Setup需要根据libsqlite3odbc.so实际路径填写（armeabi-v7a为安装32位的目录，arm64-v8a为安装64位的目录），以下经供参考
```shell
[SQL3]
Description     = unixODBC for sqlite3
Driver          = /data/local/tmp/lycium/usr/sqliteodbc/armeabi-v7a/lib/libsqlite3odbc.so
Setup           =/data/local/tmp/lycium/usr/sqliteodbc/armeabi-v7a/lib/libsqlite3odbc.so
FileUsage       = 1
```
- 填写unixODBC安装目录下面的etc目录下的配置文件odbc.ini
```shell
[myDB]
Driver  = SQL3
```
- 进入到unixODBC安装目录下面的bin目录执行命令./isql -v myDB，运行测试（usr/unixODBC/arm64-v8a为安装64位的目录，usr/unixODBC/armeabi-v7a为安装32位的目录）

&nbsp;![sqliteodbc_test_result](pic/sqliteodbc_test_result.png)

测试结果显示Connected!即表示已经连接上sqlite数据库，测试成功！

## 参考资料
- [润和RK3568开发板标准系统快速上手](https://gitee.com/openharmony-sig/knowledge_demo_temp/tree/master/docs/rk3568_helloworld)
- [OpenHarmony三方库地址](https://gitee.com/openharmony-tpc)
- [OpenHarmony知识体系](https://gitee.com/openharmony-sig/knowledge)
- [通过DevEco Studio开发一个NAPI工程](https://gitee.com/openharmony-sig/knowledge_demo_temp/blob/master/docs/napi_study/docs/hello_napi.md)
