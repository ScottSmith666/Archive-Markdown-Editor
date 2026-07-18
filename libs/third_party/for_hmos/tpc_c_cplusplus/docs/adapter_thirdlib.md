# 如何将三方库集成到hap包中

应用在调用系统固件集成的C/C++三方库时，可能会由于系统固件集成端与IDE的NDK中libc++版本不一致导致调用失败，而且系统固件集成的C/C++三方库对于应用的调式也很不友好，需要多方编译调试，很不方便，因此我们需要能在DevEco Studio上去适配C/C++三方库。

## 构建方式移植

C/C++ 三方库原生库的构建方式多种多样，而DevEco Studio目前只支持cmake构建，因此我们需要将原生库的构建方式移植为DevEco Studio支持的构建方式。

下面以原生库的构建方式cmake以及非cmake的两种方式进行介绍如何通过DevEco Studio将C/C++三方库集成到hap包中。

- [原生库cmake方式构建集成](./adapter_thirdlib_with_cmake.md)
- [原生库非cmake方式构建集成](./adapter_thirdlib_create_cmake.md)
