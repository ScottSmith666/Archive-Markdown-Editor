# 应用如何调用C/C++三方库

## 简介

OpenHarmony上的应用一般都是js/ets语言编写的，而js/ets语言是无法直接调用C/C++接口的，所以我们应用如果需要调用C/C++三方库的话，需要在js/ets和C/C++之间建立一个可以互通的桥梁。OpenHarmony系统中提供的napi框架正是这么一座桥梁。<br>
OpenHarmony的napi介绍请参考[Napi 系列学习课程](https://gitee.com/openharmony-sig/knowledge_demo_temp/blob/master/docs/napi_study/ReadMe.md)

## 应用调用C/C++三方库的方式

- so形式调用    <br>
通过OpenHarmony的SDK编译，将三方库编译成so，和系统固件一起打包到系统rom中。
- hap形式调用   <br>
将三方库源码和应用源码放在一起，通过IDE编译最终打包到应用hap包中。

## 应用调用C/C++三方库实战

本文通过openjpeg三方库以hap形式调用为例进行说明应用是如何调用C/C++三方库的。

### 移植适配

openjpeg三方库的移植适配参考文档[通过IDE集成C/C++三方库](./adapter_thirdlib.md).

### Napi接口开发

三方库napi的接口一般是由需求方提供的，对于无需求或需要自己定义接口的，我们可以根据三方库对外导出的API接口进行封装或是根据原生库的测试用例对外封装测试接口。本文中我们以封装2个openjpeg测试接口为例详细说明napi接口开发的具体流程。<br>
napi接口开发前提是需要创建一个napi的工程，具体步骤参考[通过Deveco Studio创建一个Napi工程](./hello_napi.md)

#### 定义napi接口

根据原生库的测试用例，我们封装2个测试用例接口

```c++
typedef struct {
   int comps_num;           // the number of components of the image.
    int comps_prec;         // number of bits per component per pixel
    int img_width;          // the image width
    int img_height;         // the image height
    int title_width;        // width of tile
    int title_height;       // height of title
    int irreversible;       // 1 : use the irreversible DWT 9-7
                            // 0 : use lossless compression (default)
    int cblockw_init;       // initial code block width, default to 64
    int cblockh_init;       // initial code block height, default to 64
    int numresolution;      // number of resolutions
    int offsetx;            // x component offset compared to the whole image
    int offsety;            // y component offset compared to the whole image
    int is_rand;            // Whether to generate data randomly
    char file[256];         // output filename
} J2K_Info;

int OpenjpegCompress(const char *input_file, char *output_file)   # 图片压缩成J2K格式
int openjpeg_create_j2k(J2K_Info *info)                           # 创建一张J2K格式图片
```

#### napi接口注册

```c++
napi_property_descriptor desc[] = {
        {"openjpeg_compress", nullptr, OpenjpegCompress, nullptr, nullptr,
          nullptr, napi_default, nullptr},
        {"openjpeg_create_j2k", nullptr, OpenjpegCreateJ2K , nullptr, nullptr,
          nullptr, napi_default, nullptr}
    };
```

#### napi接口实现

- `openjpeg_compress`接口的实现

  ```c++
  static napi_value OpenjpegCompressMethod(napi_env env, napi_callback_info info)
  {
    napi_value result = nullptr;
    napi_get_undefined(env, &result);
    napi_value value;
    size_t argc = 2;
    napi_value args[2];
    size_t size;
    char input_file[256] = {0};
    char output_file[256] = {0};
    
    if (napi_get_cb_info(env, info, &argc, args, nullptr, nullptr) != napi_ok) {  // 获取参数
        return result;
    }
    
    if (napi_get_value_string_utf8(env, args[0], input_file, sizeof(input_file),
                                   &size) != napi_ok) {                           // js类型转换成C/C++类型
        return result;
    }
    
    if (napi_get_value_string_utf8(env, args[1], output_file, sizeof(output_file),
                                   &size) != napi_ok) {                           // js类型转换成C/C++类型
        return result;
    }

    if (OpenjpegCompress(input_file, output_file) != 0) {                       // 三方库实现调用的业务逻辑接口
        return result;
    }

    if (napi_create_int64(env, 0, &result) != napi_ok) {                        // 创建返回的js类型参数
        std::cout << "napi_create_int64" << std::endl;
    }

    return result;                                                               // 返回最终结果。
  }
  ```

- `openjpeg_create_j2k`接口的实现
  
  ```c++
  static napi_value OpenjpegCreateJ2K(napi_env env, napi_callback_info info)
  {
    napi_value result = nullptr;
    napi_get_undefined(env, &result);
    napi_value value;
    size_t argc = 1;
    J2K_Info j2kInfo;

    if (napi_get_cb_info(env, info, &argc, &value, nullptr, nullptr) != napi_ok) {  // 获取参数
        return result;
    }
    
    if (OpenjpegGetJ2kInfo(env, value, &j2kInfo) < 0) {                             // 解析参数
        return result;
    }
  
    if (OpenjpegCreateJ2K(&j2kInfo) < 0) {                                          // 三方库实现调用的业务逻辑接口
        return result;
    }
    
    if (napi_create_int64(env, 0, &result) != napi_ok) {                           // 创建返回的js类型参数
        std::cout << "napi_create_int64" << std::endl;
    }
    
    return result;                                                                 // 返回最终结果。
  }
  ```

- 解析参数接口`OpenjpegGetJ2kInfo`实现：

  ```c++
  static int OpenjpegGetJ2kInfo(napi_env env, napi_value value, J2K_Info *info)
  {
    if (info == nullptr) {
        return -1;
    }
    if(GetObjectPropetry(env, value,"output_file", STRING, info->file) != napi_ok) {
        return -1;
    }
    if (GetObjectPropetry(env, value,"comps_prec", NUMBER, &info->comps_prec) !=
        napi_ok) {
        return -1;
    }
    if (GetObjectPropetry(env, value,"img_width", NUMBER, &info->img_width) !=
        napi_ok) {
        return -1;
    }
    if (GetObjectPropetry(env, value,"img_height", NUMBER, &info->img_height) !=
        napi_ok) {
        return -1;
    }
    if (GetObjectPropetry(env, value,"title_width", NUMBER, &info->title_width) !=
        napi_ok) {
        return -1;
    }
    if (GetObjectPropetry(env, value,"title_height", NUMBER, &info->title_height) !=
        napi_ok) {
        return -1;
    }
    if (GetObjectPropetry(env, value,"irreversible", NUMBER, &info->irreversible) !=
        napi_ok) {
        return -1;
    }
    GetObjectPropetry(env, value,"cblockw_init", NUMBER, &info->cblockw_init);
    GetObjectPropetry(env, value,"cblockh_init", NUMBER, &info->cblockh_init);
    GetObjectPropetry(env, value,"numresolution", NUMBER, &info->numresolution);
    GetObjectPropetry(env, value,"offsetx", NUMBER, &info->offsetx);
    GetObjectPropetry(env, value,"offsety", NUMBER, &info->offsety);
    GetObjectPropetry(env, value,"is_rand", BOOLEAN, &info->is_rand);
    
    return 0;
  }
  ```
  
  由上代码可以看出，OpenjpegGetJ2kInfo接扣调用了一个封装的接口`GetObjectPropetry`，该接口实现了通过调用napi的接口获取对应的数据：

  ```c++
  static int GetObjectPropetry(napi_env env, napi_value object, std::string key, int keyType, void *retValue) {
    napi_value property = nullptr;
    napi_value result = nullptr;
    bool flag = false;
    int ret = -1;

    if (napi_create_string_utf8(env, key.c_str(), strlen(key.c_str()), &property)
        != napi_ok) {                                                               // 通过字符串获取napi_value对象
        return ret;
    }

    if (napi_has_property(env, object, property, &flag) != napi_ok && flag == true) { // 判断该字符串是否对应由属性值
        return ret;
    }

    if (napi_get_property(env, object, property, &result) != napi_ok) {             // 获取字符串对应的属性值
        return ret;
    }
    
    if (keyType == NUMBER) {
        int64_t value = 0;
        if (napi_get_value_int64(env, result, &value) != napi_ok) {               // JS数据类型转换成C/C++的int数据类型
            return ret;
        }
        *(int *)retValue = value;
        ret = 0;
    } else if (keyType == BOOLEAN) {
        bool value = false;
        if (napi_get_value_bool(env, result, &value) != napi_ok) {              // JS数据类型转换成C/C++ 的bool数据类型
            return ret;
        }
        *(int *)retValue = (value == true ? 1 : 0);
    }else if (keyType == STRING) {
        size_t s = 0;
        char buf[256] = {0};
        if (napi_get_value_string_utf8(env, result, buf, sizeof(buf), &s) !=
            napi_ok) {                                                          // JS数据类型转换成C/C++的string数据类型
            return ret;
        }
        strncpy((char *)retValue, buf, strlen(buf));
        ret = 0;
    }

    return 0;
  }
  ```

### 应用调用napi接口

- 接口声明 <br>
  在确定需要封装的接口后，我们需要将这些接口定义在index.d.ts文件中(路径entry/src/main/cpp/types/libentry/index.d.ts)

  ```js
  export const openjpeg_compress: (srcName:string, desName:string) =>number;
  interface openjpegOption{
    comps_num:number                // the number of components of the image.
    comps_prec:number               // number of bits per component per pixel
    img_width:number                // the image width
    img_height:number               // the image height
    title_width:number              // width of tile
    title_height:number             // height of title
    irreversible:number             // 1 : use the irreversible DWT 9-7, 
                    // 0 : use lossless compression (default)
    output_file:string              // output filename
    cblockw_init?:number            // initial code block width, default to 64
    cblockh_init?:number            // initial code block height, default to 64
    numresolution?:number           // number of resolutions
    offsetx?:number                 // x component offset compared to the whole image
    offsety?:number                 // y component offset compared to the whole image
    is_rand?:boolean                // Whether to generate data randomly
  }
  export const openjpeg_create_j2k: (option:openjpegOption) => number
  ```

- 导入so文件    <br>
  
  ```ts
  import testNapi from "libentry.so"
  ```

- JS应用调用接口    <br>
  在ets工程中创建2个按钮，并通过按钮调用相关的接口，具体代码如下：
  
  ```ts
  Button(this.buttonTxt0)
  .fontSize(50)
  .margin({top:30})
  .fontWeight(FontWeight.Normal)
  .onClick(() => {
    testNapi.openjpeg_compress(this.dir + "test_pic.bmp", this.dir + "result.j2k")
  })
  Button(this.buttonTxt1)
  .fontSize(50)
  .margin({top:30})
  .fontWeight(FontWeight.Normal)
  .onClick(() => {
    testNapi.openjpeg_create_j2k({comps_num:3,comps_prec:8,
                                  img_width:2000,img_height:2000,
                                  title_width:1000,title_height:1000,
                                  irreversible:1, output_file:this.dir +
                                  "newImage.j2k"})
  })
  ```

## 参考文档

- [如何将一个C/C++三方库移植到OpenHarmony上](https://gitee.com/openharmony-sig/knowledge/blob/master/docs/openharmony_getstarted/port_thirdparty/README.md)
- [OpenHarmony编译构建](https://gitee.com/openharmony/build)
- [OpenHarmony Napi学习](https://gitee.com/openharmony-sig/knowledge_demo_temp/blob/master/docs/napi_study/ReadMe.md)
- [OpenHarmony知识体系](https://gitee.com/openharmony-sig/knowledge/tree/master)
