# OpenHarmony 应用中openssl使用指导

## 简介
OpenSSL是一个强大的、商业级的、功能齐全的用于传输层安全（TLS）协议的开源工具包，以前称为安全套接字层（SSL）协议，应用程序可以使用这个包来进行安全通信，避免窃听，同时确认另一端连接者的身份。此文主要介绍OpenHarmony项目中如何使用了openssl以及使用SSL证书常见问题的解答。

## openssl 编译构建

请参考[OpenSSL编译构建](https://gitcode.com/openharmony-sig/tpc_c_cplusplus/tree/master/thirdparty/openssl)

## 应用中使用 openssl

请参考[OpenSSlDemo](https://gitee.com/openharmony-tpc-incubate/openssl-faq/tree/master/opensslDemo)

## SSL证书疑问解答

#### 1. 在OpenHarmony中，SSL证书如何使用？系统是否自带了SSL证书？
OpenHarmony系统自带了SSL证书，开发者可以直接使用系统自带的证书。
#### 2. 在OpenHarmony中，SSL证书路径是否固定？具体路径是什么？
OpenHarmony中的证书路径是固定的，当前路径为:`/system/etc/ssl/certs/cacert.pem`
#### 3. 使用过程中如何判断错误是因为SSL证书引起的？
在使用OpenSSL时，若遇到SSL/TLS连接错误，可通过以下方法判断是否由SSL证书问题引起：

1. ##### 查看错误日志<br>
OpenSSL中证书相关错误关键词有以下几个
- `unable to get local issuer certificate` （缺少中间CA证书）
- `certificate has expired` （证书过期）
- `self signed certificate` （自签名证书不受信任）
- `hostname mismatch` （域名不匹配）
- `unable to verify the first certificate` （证书链不完整）

2. ##### 手动验证证书文件<br>
通过交叉编译出来的openssl可执行程序，可以手动检查证书有效期等信息：(需要设备有root权限)
- 检查证书有效期
```shell
openssl x509 -in /system/etc/ssl/certs/cacert.pem -noout -dates         # 执行命令
notBefore=Sep  1 12:00:00 1998 GMT                                      # 输出的信息
notAfter=Jan 28 12:00:00 2028 GMT
```

3. ##### 通过代码捕获证书错误
```C
SSL *ssl = ...; // SSL连接对象
long verify_result = SSL_get_verify_result(ssl);
if (verify_result != X509_V_OK) {
   const char *error = X509_verify_cert_error_string(verify_result);
   printf("证书验证失败: %s (错误码 %ld)\n", error, verify_result);
}
```

常见的SSL证书相关错误码如下：

- X509_V_ERR_CERT_HAS_EXPIRED(10) : 证书过期  
- X509_V_ERR_DEPTH_ZERO_SELF_SIGNED_CERT(18) : 自签名证书
- X509_V_ERR_UNABLE_TO_GET_ISSUER_CERT_LOCALLY(20) : 缺少中间CA证书
- X509_V_ERR_HOSTNAME_MISMATCH(62) : 域名不匹配
