# lycium Docker 搭建
为了保证众多开发/测试的环境一致性，采用docker进行lycium的开发。

## docker扫盲
自行百度 OR [官方指导](https://docs.docker.com/guides/)

## 安装docker
[官方指导](https://docs.docker.com/engine/install/ubuntu/)

## 构建image
```
                     # lycium docker 环境基于ubuntu22搭建
sudo docker build -t lycium_ubuntu22 ./
```

## 查看image
```
sudo docker image ls
```

## 运行镜像
```
                # 目录映射：将主机已经下载好（linux版本）ohos sdk 与 lycium项目的目录映射到，docker环境的/data/ohos目录。
sudo docker run -v /hostdir/ohos_sdk与lycium仓目录:/data/ohos -it IMAGEID /bin/bash
```

### 进入lycium docker环境
运行镜像成功后，即可进行lycium的开发测试工作了。详细方法[参见](../README.md)。

## 推出docker
```
Ctrl+P+Q # [ 推出docker(不退出container) ]
 OR exit # [ 推出docker(退出container) ]
```

## 查看container
```
sudo docker container ls
```

## 重新进入container
```
sudo docker attach CONTAINERID
 OR sudo docker exec -it CONTAINERID /bin/bash
```

## 删除container
```
# 从container exit 退出
# OR sudo docker kill CONTAINERID
# 删除 container 前保证其状态为退出
sudo docker container rm CONTAINERID
```

## 删除image
```
# 删除 image 前保证此image无container使用
sudo docker image rm IMAGEID
```