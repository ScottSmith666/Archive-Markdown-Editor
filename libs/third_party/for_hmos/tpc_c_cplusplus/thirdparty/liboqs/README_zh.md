# liboqs 三方库说明
## 功能简介
liboqs（Open Quantum Safe Library）是 Open Quantum Safe（OQS）项目推出的开源量子抗性密码库，核心目标是为开发者提供 “可直接集成的后量子密码（Post-Quantum Cryptography, PQC）实现”，帮助现有系统提前应对量子计算机对传统密码（如 RSA、ECC）的威胁，同时兼顾兼容性与易用性。

## 三方库版本
- v0.14.0

## 已适配功能
- 支持算法实例的生命周期管理
- 支持密钥确定性生成，密码学随机数生成
- 支持安全工具，提供常数时间比较等安全工具函数，防止侧信道攻击

## 使用约束
- [IDE和SDK版本](../../docs/constraint.md)

## 集成方式
+ [应用hap包集成](docs/hap_integrate.md)
