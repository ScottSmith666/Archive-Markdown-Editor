# jemalloc三方库说明
## 功能简介
jemalloc 是一款高性能、低碎片的内存分配器（memory allocator），最初由 FreeBSD 项目开发，旨在解决传统内存分配器（如 glibc 的 malloc）在高并发、长时间运行场景下的性能瓶颈和内存碎片问题。它被广泛应用于各类高性能应用（如 Redis、Firefox、MySQL、Cloudflare 服务等），尤其在多线程环境中表现突出。

## 三方库版本
- v5.3.0

## 已适配功能
- 用于高性能内存管理服务类库，可在高并发网络服务、长时间运行应用、多线程数据交换等场景下显著降低内存碎片并提升内存分配效率。

## 使用约束
- [IDE和SDK版本](../../docs/constraint.md)

## 集成方式
+ [应用hap包集成](docs/hap_integrate.md)
