## 目录结构

```
tpc_c_cplusplus/thirdparty
├── README_zh.md            #仓库主页
├── common                  #仓库通用说明文档的文件夹
├── thirdparty_template     #三方库模板文件夹
│   ├──README_zh.md         #三方库简介
│   ├──README.OpenSource    #说明三方库源码的下载地址，版本，license等信息
│   ├──bundle.json           #三方库组件定义文件
│   ├──CMakeLists.txt       #构建脚本，支持hap包集成
│   ├──HPKBUILD             #交叉构建脚本，使用原库自带脚本编译，支持hap包集成
│   ├──SHA512SUM            #压缩包校验文件，和HPKBUILD一起使用
│   ├──BUILD.gn             #构建脚本，支持rom包集成
│   ├──adapted              #该目录存放三方库适配需要的代码文件
│   │   ├──config.h         #例如配置文件
│   │   ├──...              #其他适配文件
│   ├──docs                 #存放三方库相关文档的文件夹
│   │   ├──rom_integrate.md #rom集成说明文档
│   │   ├──hap_integrate.md #hap集成说明文档
│   │   ├── ...             #其他说明文档
├── thirdparty1             #三方库文件夹，内容和thirdparty_template模板的格式一样	
├── thirdparty2             #三方库文件夹，内容和thirdparty_template模板的格式一样
......
```



## 如何贡献

- [遵守仓库目录结构](#本仓库目录)
- [遵守OpenHarmony编码贡献规范](https://gitee.com/openharmony-sig/knowledge_demo_smart_home/blob/master/dev/docs/contribute/README.md)
- [三方库模板目录](thirdparty_template)
