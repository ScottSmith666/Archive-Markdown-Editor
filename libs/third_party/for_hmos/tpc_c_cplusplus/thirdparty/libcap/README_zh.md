# libcap三方库说明
## 功能简介
libcap的功能是用于管理进程的权限和权限限制。

## 三方库版本
- 2.69

## 已适配功能
- 由于权限问题只支持对本用户进程(当前进程)的操作，其他用户的进程均不能操作。本进程的操作接口cap_get_flag(部分数据)、cap_set_flag、cap_drop_bound接口由于权限问题无法支持。

## 使用约束
- [IDE和SDK版本](../../docs/constraint.md)

## 集成方式
+ [应用hap包集成](docs/hap_integrate.md)
