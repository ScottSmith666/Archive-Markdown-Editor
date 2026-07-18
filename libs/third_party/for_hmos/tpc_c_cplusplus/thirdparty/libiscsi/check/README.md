# libiscsi开发板测试说明

- 测试文件目录结构

  ```shell
  tpc_c_cplusplus/thirdparty/libiscsi/check     #三方库libiscsi测试目录结构如下
  ├── image                                     #自测流程参考文档示例图片目录
  ├── server                                    #Linux服务端测试脚本目录
  ├── client                                    #开发板客户端测试脚本目录
  ├── libiscsi_test_reference.md                #自测流程参考文档
  ├── README.md                                 #测试目录说明文档
  ```

## 测试三方库

三方库的测试使用check目录包含的测试用例来做测试，请参考[三方库测试详细步骤](./libiscsi_test_reference.md#3测试步骤)

