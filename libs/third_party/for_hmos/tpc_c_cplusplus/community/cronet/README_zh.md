# cronet三方库说明

## 功能简介

cronet是chromium,项目的网络子模块。承接了chromium网络通信相关的能力，Cronet 原生支持 HTTP、HTTP/2 和 HTTP/3 over QUIC 协议。该库支持您为请求设置优先级标签。服务器可以使用优先级标记来确定处理请求的顺序。Cronet 可以使用内存缓存或磁盘缓存来存储网络请求中检索到的资源。后续请求会自动从缓存中传送。默认情况下，使用 Cronet 库发出的网络请求是异步的。在等待请求返回时，您的工作器线程不会被阻塞。Cronet 支持使用 Brotli 压缩数据格式进行数据压缩。

## 三方库版本
- 107.0.5304.150

## 已适配功能
- 支持cronet http/https 通信能力

## 使用约束
- [IDE和SDK版本](../../docs/constraint.md)

## 使用方式
源码下载：

由于cronet属于chromium的一部分。并且我们是针对指定版本适配的因此需要下载指定TAG点的chromium源码。

```bash
# 下载google depot_tools
git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git
# 将depot_tools目录添加到环境变量PATH中
export PATH=/path/of/depot_tools/:$PATH
# 下载指定tag点的chromium源码
git clone --depth=1 -b 107.0.5304.150 https://chromium.googlesource.com/chromium/src.git src
# 同步分支依赖
# 创建 gclient config 文件 .gclient 文件与 src 同级目录
touch .gclient
# .gclient 文件内容如下
solutions = [
  {
    "name": "src",
    "url": "https://chromium.googlesource.com/chromium/src.git",
    "managed": False,
    "custom_deps": {},
    "custom_vars": {},
  },
]
# 同步源码依赖
gclient sync --nohooks
# 进入 src 目录安装编译依赖
bash ./build/install-build-deps.sh
# 同步二进制依赖
gclient runhooks

```


随后将我们的patch打入源码中,

```
# 在 src 目录下执行
git apply --check cronet_TAG_107.0.5304.150_oh_pkg.patch # 检查patch是否可用
# 如果可用打入patch，如果不可用确认下chromium分支是否切换ok
git apply cronet_TAG_107.0.5304.150_oh_pkg.patch

# 在 third_party/angle 目录下执行
git apply --check angle_COMMIT_bbf57e6db_oh_pkg.patch  # 检查patch是否可用
git apply angle_COMMIT_bbf57e6db_oh_pkg.patch

# 在 third_party/dawn 目录下执行
git apply --check dawn_COMMIT_6ab02659de_oh_pkg.patch  # 检查patch是否可用
git apply dawn_COMMIT_6ab02659de_oh_pkg.patch
```

配置 OHOS_SDK

```
# 将 SDK 的 native 目录 copy 到，chromium 源码中 third_part 目录下的 ohos_sdk 目录。
```
进入src目录,执行:

```bash
bash build.sh # 等待编译结果。
```

编译结束后可在out/cronet目录下获取libcronet.107.0.5304.150.so
