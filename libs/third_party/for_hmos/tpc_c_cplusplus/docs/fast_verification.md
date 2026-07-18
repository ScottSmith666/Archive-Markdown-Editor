# C/C++三方库快速验证

基于原生库的单元测试用例(ctest/make check)进行快速验证C/C++三方库。

## 测试环境准备

C/C++三方库原生库的单元测试用例需要使用到make、ctest、cmake等工具，故在搭建测试环境时我们需要准备这些工具。具体请参阅[C/C++三方库测试环境准备](../lycium/CItools/README_zh.md)

## 测试资源准备

原生库的单元测试用例一般都是ctest或者make check。以ctest为例，ctest是CMake集成的⼀个测试⼯具，在使⽤CMakeLists.txt⽂件编译⼯程的时候，CTest会⾃动configure、build、test和展现测试结果。在执行ctest时，如果目标文件不存在或者有变动，会需要重新执行编译操作。因此为了在目标环境只进行测试而不在去编译，需要将编译后的源码一起打包推送到目标机上进行测试。部分测试用例在编译时可能会指定路径，故需要保证测试机上的路径与编译机的路径是一致。

以cJSON为例(/home/owner/workspace/cJSON)，我们编译完cJSON后，需要将cJSON整个文件夹打包，推送到目标机上，且需要保证其路径与编译路径一致。

## 测试方法

根据三方库原生测试用例的方式进行测试，如 cJSON三方库，其原生测试用例是ctest,则进入到其编译目录下执行 `ctest`即可。
