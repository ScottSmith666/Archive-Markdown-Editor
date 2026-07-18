# 7zip 三方库说明
## 功能简介
- 使用了 **LZMA** 与 **LZMA2** 算法的 [7z 格式](https://sparanoid.com/lab/7z/7z.html) 拥有极高的压缩比
- 支持格式：
  - 压缩 / 解压缩：7z、XZ、BZIP2、GZIP、TAR、ZIP 以及 WIM
  - 仅解压缩：AR、ARJ、CAB、CHM、CPIO、CramFS、DMG、EXT、FAT、GPT、HFS、IHEX、ISO、LZH、LZMA、MBR、MSI、NSIS、NTFS、QCOW2、RAR、RPM、SquashFS、UDF、UEFI、VDI、VHD、VMDK、WIM、XAR、Z 以及 ZSTD
- 与 ZIP 及 GZIP 格式相比，**7-Zip** 能提供比使用 PKZip 及 WinZip 高 2-10% 的压缩比
- 为 7z 与 ZIP 提供更完善的 AES-256 加密算法
- 7z 格式支持创建自释放压缩包

## 使用约束
- IDE版本：DevEco Studio 5.0.4 Release
- SDK版本：OpenHarmony SDK Ohos_sdk_public 5.0.4.150 (API Version 16 Release)
- 三方库版本：24.09
- 当前适配的功能：支持沙箱路径文件的压缩和解压，支持压缩和解压的规格参考官网[7-zip]([7-Zip](https://7-zip.org/))
## 集成方式
+ [应用hap包集成](docs/hap_integrate.md)