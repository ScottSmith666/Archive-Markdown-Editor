# NAPI 导出类对象

## 简介

js调用napi的数据，对于简单的数据类型，只需要napi返回对应类型的napi_value数据即可 (详情参照napi数据类型类型与同步调用)。但是对于一些复杂的数据类型(如我们常用C++的类对象)，是不能直接返回一个napi_value数据的。这时我们需要对这些数据进行一系列操作后将其导出，这样js才能使用导出后的对象。
本文以导出类对象为例来说明napi导出对象的具体过程。<br>
类对象导出的具体过程: <br>
![类对象导出流程](./media/export_class.png)

## NAPI导出类对象具体实现

这里我们以导出person类为例说明导出一个类的实现过程

### 定义person类以及相关方法

person类主要实现了对person属性的配置以及获取，具体定义如下(NapiTest.h)：

```c++
class person {
public:    
    person() = default;
    person(uint32_t age, std::string name);
    static napi_value SayName(napi_env env, napi_callback_info info);
    static napi_value SetName(napi_env env, napi_callback_info info);
    static napi_value GetName(napi_env env, napi_callback_info info);
    static napi_value SayAge(napi_env env, napi_callback_info info);
    static napi_value Construct(napi_env env, napi_callback_info info);
    static napi_value Init(napi_env env, napi_value &exports);

    ~person() = default;

    std::string name_;
private:
    uint32_t age_;
};

```

### 将 person 定义为js类

- 在定义js类之前，需要先设置类对外导出的方法

  ```c++
  napi_property_descriptor desc[] = {
      {"SayAge", nullptr, person::SayAge, nullptr, nullptr, nullptr, napi_default, nullptr},
      {"SayName", nullptr, person::SayName, nullptr, nullptr, nullptr, napi_default, nullptr},
      {"name", nullptr, nullptr, person::GetName, person::SetName, nullptr, napi_default, nullptr}
  }
  ```

- 定义js类
  
  ```c++
  napi_define_class(env, "person", NAPI_AUTO_LENGTH, person::Construct, nullptr, sizeof(descClass) / sizeof(descClass[0]), descClass, &cons); // 将person定义为JS类
  ```

  使用到函数说明:
  
  ```c++
  napi_status napi_define_class(napi_env env,
                            const char* utf8name,
                            size_t length,
                            napi_callback constructor,
                            void* data,
                            size_t property_count,
                            const napi_property_descriptor* properties,
                            napi_value* result);
  ```

  功能：将C++类定义为js的类<br>
  参数说明：
  - [in] env: 调用api的环境
  - [in] utf8name: C++类的名字
  - [in] length: C++类名字的长度，默认自动长度使用NAPI_AUTO_LENGTH
  - [in] constructor: 处理构造类实例的回调函数
  - [in] data: 作为回调信息的数据属性传递给构造函数回调的可选数据
  - [in] property_count: 属性数组参数中的个数
  - [in] properties: 属性数组
  - [out] result: 通过类构造函数绑定类实例的napi_value对象

  返回：调用成功返回0，失败返回其他

- 实现js类的构造函数

  当js应用通过new方法获取类对象的时候，此时会调用 napi_define_class 中设置 constructor 回调函数，该函数实现方法如下：

  ```c++
  napi_value person::Constructor(napi_env env, napi_callback_info info)
  {
    size_t argc = 2;
    napi_value argv[2] = {nullptr};
    napi_value jsthis = nullptr;
    
    napi_get_cb_info(env, info, &argc, argv, &jsthis, nullptr);
    
    int32_t age;
    char buf[BUFF_SIZE] = {0};
    size_t len = 0;

    napi_get_value_int32(env, argv[0], &age);                          // 获取年龄参数
    napi_get_value_string_utf8(env, argv[1], buf, BUFF_SIZE, &len);    // 获取姓名参数
    person *ps = new person(age, std::string(buf));                    // 创建person实例
    // 绑定类实例到JS对象
    napi_wrap(env, jsthis, ps, [](napi_env env, void* finalize_data, void* finalize_hint)
                               {
                                  delete reinterpret_cast<person *>(finalize_data); 
                               }, nullptr, nullptr);    
    return jsthis;
  }
  ```

  使用到函数说明：

  ```c++
  napi_status napi_wrap(napi_env env,
                    napi_value js_object,
                    void* native_object,
                    napi_finalize finalize_cb,
                    void* finalize_hint,
                    napi_ref* result);
  ```

  功能：将C++类实例绑定到js对象，并关联对应的生命周期<br>
  参数说明：
  - [in] env: 调用api的环境
  - [in] js_object: 绑定C++类实例的js对象
  - [in] native_object: 类实例对象
  - [in] finalize_cb: 释放实例对象的回调函数
  - [in] finalize_hint: 传递给回调函数的数据
  - [out] result: 绑定js对象的引用

  返回：调用成功返回0，失败返回其他

### 导出js类

- 创建生命周期(生命周期相关可以参考文档[napi生命周期](./napi_life_cycle.md)) <br>
  在设置类导出前，需要先创建生命周期

  ```c++
  napi_value cons;
  napi_ref *ref = new napi_ref;
  if (napi_create_reference(env, cons , 1, ref) != napi_ok) {
      return nullptr;
  }

  // 保存当前的生命周期变量
  napi_set_instance_data(env, ref, [](napi_env env, void *data, void *hint){
    uint32_t count = 0;
    napi_ref *ref = (napi_ref *)data;
    napi_reference_unref(env, *ref, &count);      // 程序结束后进入此回调，释放生命周期变量
    napi_delete_reference(env, *ref);
    delete ref;
  }, nullptr);
  ```

  使用到函数说明：

  ```c++
  napi_status napi_set_instance_data(node_api_basic_env env,
                                   void* data,
                                   napi_finalize finalize_cb,
                                   void* finalize_hint); 
  ```
  功能：将`data`与当前正在运行的`Node.js`环境相关联。此`data`可以通过`napi_get_instance_data()`获取。<br>
  参数说明：
  - [in] env: 调用api的环境
  - [in] data: 对此实例的绑定可用的数据项。
  - [in] finalize_cb: 当环境结束时要调用的函数。该函数接收data以便释放它。
  - [in] finalize_hint: 传递给回调函数的数据。

  返回：调用成功返回0，失败返回其他

  **注意**：通过上一次调用设置的与当前正在运行的`Node.js`环境相关联的任何现有数据`napi_set_instance_data()`都将被覆盖。如果`finalize_cb`上一次调用提供了 ，则不会调用它。

- 将类导出到exports中

  将类以属性值的方式导出

  ```c++
  if (napi_set_named_property(env, exports, "person", cons)) !=  napi_ok) {
      return nullptr;
  }
  ```

通过以上步骤，我们基本实现了Person这个类的导出。<br>
注意：以上实现都是在类的Init方法中，我们只需要在NAPI注册的接口中调用该Init即可。完整代码可以查看[ClassDemo源码](https://gitee.com/openharmony-sig/knowledge_demo_temp/blob/master/FA/NapiStudy/ClassDemo/entry/src/main/cpp/ClassDemo.cpp)

### 创建类的实例对象

js应用除了调用new方法获取类的实例外，我们也可以提供一些方法让js应用获取对应的类的实例，如在我们的Person用例中，我们定义了一个GetPerson方法，该方法实现了person类实例的获取。具体实现如下：

```c++
//返回类对象
napi_value GetPerson(napi_env env, napi_callback_info info) {
    napi_value constructs;
    napi_status status;
    napi_ref *ref;
    // 获取初始化时保存的生命周期
    status = napi_get_instance_data(env, (void **)&ref);
    // 获取生命周期保存的JS对象
    status = napi_get_reference_value(env, *ref, &constructs);
    if (status != napi_ok) {
        OH_LOG_INFO(LOG_APP, "napi_get_reference_value falied, satus=%{public}d", status);
        return nullptr;
    }

    size_t argc = 2;
    napi_value argv[2];

    status = napi_create_int32(env, 18, &argv[0]);
    if (status != napi_ok) {
        OH_LOG_INFO(LOG_APP, "napi_create_int32 falied, satus=%{public}d", status);
        return nullptr;
    }

    status = napi_create_string_utf8(env, "xiaoli", NAPI_AUTO_LENGTH, &argv[1]);
    if (status != napi_ok) {
        OH_LOG_INFO(LOG_APP, "napi_create_string_utf8 falied, satus=%{public}d", status);
        return nullptr;
    }

    napi_value instance;
    // 创建新的JS对象，此时会触发person类的构造函数并生成person类的C++实例，argv作为实例的构造函数的参数；该C++实例与该JS对象进行绑定。
    status = napi_new_instance(env, constructs, argc, argv, &instance);
    if (status != napi_ok) {
        OH_LOG_INFO(LOG_APP, "napi_create_string_utf8 falied, satus=%{public}d", status);
        return nullptr;
    }
    
    person *ps;
    // 获取与该JS对象绑定的C++实例。
    status = napi_unwrap(env, instance, (void**)&ps);
    ps->name_ = "xiaoxiao";

    return instance;
}
```

使用到函数说明：

  ```c++
  napi_status napi_get_instance_data(node_api_basic_env env,
                                   void** data); 
  ```
  功能：将`data`与当前正在运行的`Node.js`环境相关联。此`data`可以通过`napi_get_instance_data()`获取。<br>
  参数说明：
  - [in] env: 调用api的环境
  - [out] data：先前通过调用与当前正在运行的`Node.js`环境关联的数据项`napi_set_instance_data()`。

  返回：调用成功返回0，失败返回其他

 ```c++
 napi_status napi_unwrap(napi_env env,
                        napi_value js_object,
                        void** result);
 ```
 
 功能：获取先前通过`napi_wrap()`绑定到`JS`对象的`native`实例。
 
 参数说明：
  - [in] env: 调用api的环境
  - [in] js_object：与`native`实例绑定的对象。
  - [out] result：指向绑定的`native`实例的指针。

 返回：调用成功返回0，失败返回其他

### 实现NAPI接口的注册

我们已helloworld为列，

- 新建一个hello.cpp，定义模块

  ```c++
  static napi_module demoModule = {
      .nm_version =1,
      .nm_flags = 0,
      .nm_filename = nullptr,
      .nm_register_func = Init,
      .nm_modname = "hello",
      .nm_priv = ((void*)0),
      .reserved = { 0 },
  };
  ```

- 实现模块的Init

  ```c++
  EXTERN_C_START
  static napi_value Init(napi_env env, napi_value exports)
  {
    napi_property_descriptor desc[] = {
        {"GetPerson", nullptr, GetPerson, nullptr, nullptr, nullptr, napi_default, nullptr}
    };

    napi_define_properties(env, exports, sizeof(desc) / sizeof(desc[0]), desc);     // 将GetPerson方法导出

    return person::Init(env, exports);    // 导出类以及类的方法
  }
  EXTERN_C_END
  ```

- 模块注册

  ```c++
  // 注册 hello模块
  extern "C" __attribute__((constructor)) void RegisterHelloModule(void)
  {
      napi_module_register(&demoModule);
  }
  ```

至此，我们完成了整个napi接口注册以及napi类的导出。

## 应用调用NAPI实例

### 导出接口

在使用该NAPI的时候，我们需要在ts文件(路径在\entry\src\main\cpp\types\libentry\index.d.ts)，声明以下内容:

```js
export class person {
  constructor(age : number, name : string)
  name : string
  SayAge : () => void;
  SayName : () => void;
}

export const GetPerson : () => person;
```

该文件申明了NAPI接口中导出的方法和类

### 应用调用

新建一个helloworld的ETS工程，该工程中包含一个按键,我们可以通过该按键进行数据的在native C++中存储和获取

- 导出napi对应的库(之前NAPI接口生成的库名为libentry.so)

  ```js
  import testNapi,{person} from "libentry.so";
  ```

- 使用person类

  ```js
  struct Index {
    @State message: string = 'Hello World'
    @State flag:number = 0
  
    build() {
      Row() {
        Column() {
          Text(this.message)
            .fontSize(50)
            .fontWeight(FontWeight.Bold)
            .onClick(() => {
              let ps = new person(10, 'zhangsan')
              hilog.info(0x0000, 'testTag', 'Test NAPI person name is ' + ps.name + ", age is " + ps.SayAge());
              let pps = testNapi.GetPerson();
              hilog.info(0x0000, 'testTag', 'Test NAPI person name is ' + pps.name);
            })
        }
        .width('100%')
      }
      .height('100%')
    }
  ```

  通过IDE LOG信息可以查看到，当按多次下按钮时，出现交替以下信息：

  ```js
  02200/JsApp: Test NAPI person name is zhangsan, age is 10
  02200/JsApp: Test NAPI person name is xiaoxiao, age is 18
  ```

## 参考资料

- [NapiTest源码工程](https://gitee.com/openharmony-sig/knowledge_demo_temp/blob/master/FA/NapiStudy_ObjectWrapTest)
- [通过IDE开发一个napi工程](./hello_napi.md)
- [napi生命周期](./napi_life_cycle.md)
- [OpenHarmony 知识体系](https://gitee.com/openharmony-sig/knowledge/tree/master)
