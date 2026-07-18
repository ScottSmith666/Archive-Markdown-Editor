# TCMalloc 三方库说明
## 功能简介
TCMalloc 是专为高并发应用程序设计的高性能内存分配器。它旨在替代标准库（如 glibc）中的 malloc 和 new，通过减少锁竞争和优化内存布局，显著提升多线程环境下的内存分配速度和效率。

## 三方库版本
- 2.17.2

## 已适配功能
- 用于内存复用、内存限制、内存回收等。

## 使用约束
- [IDE和SDK版本](../../docs/constraint.md)

## 集成方式
+ [应用hap包集成](docs/hap_integrate.md)
