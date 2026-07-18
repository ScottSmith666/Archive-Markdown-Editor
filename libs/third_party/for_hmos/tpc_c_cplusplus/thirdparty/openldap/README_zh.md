# openldap三方库说明
## 功能简介
OpenLDAP（Lightweight Directory Access Protocol）是一个开源的实现LDAP协议的软件套件。LDAP是一种用于访问和维护分布式目录信息的协议，而OpenLDAP提供了一套工具和库，使用户能够构建和管理LDAP服务器。

## 三方库版本
- 2.5.14

## 已适配功能
- 支持目录服务提供支持LDAP协议，并提供了用于管理目录树、条目和属性的API和工具。
- 用户认证和授权，支持基于LDAP的身份验证，并提供了灵活的访问控制策略，允许管理员定义谁可以访问目录中的哪些数据。
- 目录同步和复制，可以在多个OpenLDAP服务器之间实现数据复制。

## 使用约束
- [IDE和SDK版本](../../docs/constraint.md)

## 集成方式
+ [系统hap包集成](docs/hap_integrate.md)
