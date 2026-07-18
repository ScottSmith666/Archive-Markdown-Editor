# tquic  三方库说明
 ## 功能简介
tquic 是由腾讯开发的高性能、轻量级 QUIC 协议实现库，基于纯 Rust 编写。该库符合 IETF QUIC 标准（RFC 9000/RFC 9001/R 9002），针对低延迟、高吞吐量的网络通信场景进行了优化，支持连接迁移、0-RTT 握手、流多路复用等功能，适用于服务端和嵌入式设备的 QUIC 协议栈集成。
 
 ## 三方库版本
 - v0.10.0

 ## 已适配功能
 - 适用于服务端和嵌入式设备的 QUIC 通信
 
 ## 使用约束
 - [IDE和SDK版本](../../docs/constraint.md)
 
 ## 集成方式
 + [应用hap包集成](docs/hap_integrate.md) 