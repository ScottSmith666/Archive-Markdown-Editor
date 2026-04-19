# 1. 编译7-Zip

```bash
cd /path/to/7z2600-src/CPP/7zip/Bundles/Format7zF

# 这是macOS arm64命令
make -j -f ../../cmpl_mac_arm64.mak

# 这是Windows命令
nmake NEW_COMPILER=1 MY_STATIC_LINK=1  # 这是Windows的命令，MY_STATIC_LINK=1为静态编译

# 这是Linux命令
make -j -f ../../cmpl_gcc.mak
# 获取7z.so或者7z.dll
```

# 2. 编译Bit7z
```bash
cd /path/to/bit7z
mkdir build
cd build
cmake ../ -DCMAKE_BUILD_TYPE=Release -DBIT7Z_USE_NATIVE_STRING=ON -DBIT7Z_AUTO_FORMAT=ON -DBIT7Z_7ZIP_VERSION="26.00" -DBIT7Z_CUSTOM_7ZIP_PATH=/Volumes/Execute/Files/project/ame_new/archive_markdown_editor/libs/third_party/7z2600-src
cmake --build . -j --config Release
```
如果在Windows平台上编译发现下面的错误：

```text
C:\path\to\bit7z\src\internal\xxx.cpp(1,1): warning C4819: 该文件包含不能在当前代码页(936)中表示的字符。请将该文件保存为 Unicode 格式以防止数据丢失
```

则用Visual Studio打开bit7z项目中的xxx.cpp文件，导航到菜单栏`文件` > `高级保存选项`，设置文件编码为`Unicode (UTF-8 带签名) - 代码页 65001`并保存。

然后继续编译，就不会报错了。

# 3. 下载、编译、安装better-sqlite3（如果项目能跑起来不出错就不用管这条）
```bash
npm install --save-dev electron-rebuild
npm install better-sqlite3
./node_modules/.bin/electron-rebuild -f -w better-sqlite3
```
