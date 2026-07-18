
# 北向应用集成三方库

## C/C++三方库的使用

### 北向应用中使用

- :tw-1f195: [通过Deveco Studio创建一个Napi工程](hello_napi.md)
- :tw-1f195: [Napi 数据类型与同步调用](napi_data_type.md)
- :tw-1f195: [Napi 异步调用](napi_asynchronous_call.md)
- :tw-1f195: [Napi 生命周期](napi_life_cycle.md)
- :tw-1f195: [Napi 对象导出](napi_export_object.md)
- :tw-1f195: [OpenHarmony北向应用如何引用C/C++三方库](./app_call_thirdlib_hap.md)
- :tw-1f195: Napi接口封装工具：[aki](https://gitee.com/openharmony-sig/aki/blob/master/README.md)

### 在应用包（hap）中集成三方库

- :tw-1f195: [什么是OH的应用包(hap)](hap.md)
- :tw-1f195: [OH应用包编译构建分析](hap_build.md)
- :tw-1f195: [如何将三方库集成到hap包中](adapter_thirdlib.md)
- :tw-1f195: [在OpenHarmony开发板上验证hap包中集成的三方库](./test_hap.md)

## C/C++ 三方库适配的关键问题点分析

### 固件集成的动态库无法在IDE上使用

- :tw-1f195: [应用集成和固件集成中C库差异化分析](rom_hap_c_cpluplus_diff.md)

### 开源三方库的cmake在IDE上直接引用的问题

- :tw-1f195: [开源三方库的cmake在IDE上直接引用的问题分析](ide_findpackage_problem.md)
