# ONNX Runtime三方库说明
## 功能简介
ONNX Runtime是一个跨平台的高性能推理引擎，支持Open Neural Network Exchange (ONNX) 格式的深度学习模型，可在云、桌面、移动端及边缘设备上实现高效的模型推理。

## 三方库版本
- v1.23.2

## 已适配功能
- CPU后端推理：基于CPU的高性能算子实现，支持ARM NEON/x86 SSE/AVX指令集加速
- C++原生接口：提供标准C++ API进行模型加载、推理执行和资源管理
- 多架构支持：鸿蒙OHOS平台（armv8a、armeabi-v7a、x86_64）
- 标准ONNX格式：支持标准ONNX v1.14+ 模型格式导入
- 丰富算子集：内置ONNX标准算子库（Conv、MatMul、LSTM、Attention等）
- 图优化：常量折叠、算子融合、死代码消除等模型优化Pass
- 内存优化：动态内存池管理，支持Arena内存分配器减少内存碎片
- 线程控制：支持设置Intra-op和Inter-op线程数，优化多核CPU利用率
- 动态Shape支持：支持动态输入尺寸（Dynamic Shape）推理
- 静态Shape优化：固定输入尺寸下的常量折叠和预分配优化
- 模型缓存：支持优化后的模型序列化到磁盘，加速下次加载
- 输入输出管理：支持张量数据类型自动转换、内存零拷贝（Zero-Copy）
- 量化支持：支持INT8/UINT8量化模型推理
- 错误处理：完善的错误码和异常处理机制

## 使用约束
- [IDE和SDK版本](../../docs/constraint.md)

## 集成方式
+ [应用hap包集成](docs/hap_integrate.md)