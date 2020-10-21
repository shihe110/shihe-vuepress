## Docker

学习目标

```bash
# docker安装
	# 镜像命令
	# 容器命令
	# 操作命令
# docker镜像
# 容器数据卷
# Dockerfile
# 网络原理
# idea整合docker
# docker compose
# docker swarm 集群
# docker jenkins（持续部署集成） 
```

```bash
# docker为什么会出现？
# 开发、生产环境软件版本等不一致出现的问题（环境配置的问题、跨平台的问题、开发和运维的协调费时费力）
# docker带着环境打包（镜像）上线解决问题
# 运维只需下载镜像运行就好了
# docker提供的隔离机制，将服务器压榨到极致
```

### Docker掌握目标

- docker基础
- docker原理
- docker网络
- docker服务
- docker集群
- docker日志
- docker错误排查等

### Centos下载安装

- 1、系统要求

  centos7

  ```bash
  # 环境查看
  [root@localhost ~]# uname -r
  3.10.0-514.el7.x86_64
  
  # 本机环境
  [root@localhost ~]# cat /etc/os-release 
  NAME="CentOS Linux"
  VERSION="7 (Core)"
  ID="centos"
  ID_LIKE="rhel fedora"
  VERSION_ID="7"
  PRETTY_NAME="CentOS Linux 7 (Core)"
  ANSI_COLOR="0;31"
  CPE_NAME="cpe:/o:centos:centos:7"
  HOME_URL="https://www.centos.org/"
  BUG_REPORT_URL="https://bugs.centos.org/"
  
  CENTOS_MANTISBT_PROJECT="CentOS-7"
  CENTOS_MANTISBT_PROJECT_VERSION="7"
  REDHAT_SUPPORT_PRODUCT="centos"
  REDHAT_SUPPORT_PRODUCT_VERSION="7"
  
  ```

- 2、卸载老版本docker及其依赖

```bash
$ sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
```

### 三种安装方式

- docker仓库安装（推荐）
- rpm包手动安装
- 脚本安装

**[仓库安装]**

1、安装yum-utils(提供yum-config-mamager)包并设置仓库

```bash
# 安装工具包
$ sudo yum install -y yum-utils

# 设置镜像仓库
$ sudo yum-config-manager \
	--add-repo \
	https://download.docker.com/linux/centos/docker-ce.repo # 默认国外地址
	
# 阿里云镜像
$ yum-config-manager \
	--add-repo \
	http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo # 阿里云镜像地址
```

2、安装docker引擎

```bash
# 更新yum软件包索引
yum makecache fast # 清缓存

# 安装docker ce社区版（推荐）  ee企业版
$ sudo yum install docker-ce docker-ce-cli containerd.io

# 或者安装特定版本
# 列出版本
$ yum list docker-ce --showduplicates | sort -r 
```

3、启动docker

```bash
# 启动docker服务
$ sudo systemctl start docker

# 判断是否启动成功
$ docker version 
```

4、使用hello-world镜像验证docker是否正确安装

```bash
# 测试
$ sudo docker run hello-world
```

![image-20201010220430591](C:\Users\shihe\AppData\Roaming\Typora\typora-user-images\image-20201010220430591.png)

5、查看hello-world镜像

```bash
$ docker images
```

![image-20201010220635053](C:\Users\shihe\AppData\Roaming\Typora\typora-user-images\image-20201010220635053.png)

### 卸载docker

```bash
# 卸载docker依赖
$ sudo yum remove docker-ce docker-ce-cli containerd.io
# 删除资源
$ sudo rm -rf /var/lib/docker
# /var/lib/docker docker的默认工作路径
```

### Docker工作原理

**1、docker  run 启动过程**

```bash
$ docker run hello-world
# 启动命令执行后
# docker会在本机寻找镜像-如果有则直接运行-如果没有该镜像
# 去docker hub寻找该镜像-如果找到则下载到本地运行
# 如果找不到则返回错误提示找不到该镜像
```

![image-20201010222054356](C:\Users\shihe\AppData\Roaming\Typora\typora-user-images\image-20201010222054356.png)

**2、docker是怎么工作的？**

docker是一个cs结构的系统，docker的守护进程运行在主机上。通过socket客户端连接访问。

docker-server接受到docker-client的指令并执行。

![image-20201010223120936](C:\Users\shihe\AppData\Roaming\Typora\typora-user-images\image-20201010223120936.png)

**3、docker为什么比vm快？**

1、docker比虚拟机抽象层更少

2、docker利用宿主机内核，vm需要虚拟Guest OS。新建一个容器的时候，docker不需要像虚拟机一样重新加载一个操作系统内核，避免引导，虚拟机加载guest os是分钟级别的，docker直接利用宿主机不需要加载，是秒级的。

![image-20201010223228789](C:\Users\shihe\AppData\Roaming\Typora\typora-user-images\image-20201010223228789.png)

![image-20201010223614193](C:\Users\shihe\AppData\Roaming\Typora\typora-user-images\image-20201010223614193.png)

### 阿里云镜像加速器

1.登录阿里云找到容器服务

![image-20201010221228111](C:\Users\shihe\AppData\Roaming\Typora\typora-user-images\image-20201010221228111.png)

2.配置镜像加速器

![image-20201010221123022](C:\Users\shihe\AppData\Roaming\Typora\typora-user-images\image-20201010221123022.png)

3.配置镜像加速器

```bash
# 创建加速目录
sudo mkdir -p /etc/docker 
# 编写配置文件
sudo tee /etc/docker/daemon.json <<-'EOF'
{
	"registry-mirrors":["https://qiyb9988.mirror.aliyuncs.com"]
}
EOF
# 重启服务
sudo systemctl daemon-reload
# 重启docker
sudo systemctl restart docker
```

### Docker的常用命令

- 帮助命令
- 镜像命令
- 容器命令

#### 帮助命令

```shell
docker version  # docker版本信息
docker info 	# docker的系统信息，显示镜像的数据和运行情况
docker 命令 --help	# docker的帮助文档
```

帮助文档官网地址：https://docs.docker.com/engine/reference/commandline/docker/

#### 镜像命令

**docker images**

```shell
docker images # 查看本地主机所有镜像

[root@localhost docker]# docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
hello-world         latest              bf756fb1ae65        9 months ago        13.3kB

# 说明
REPOSITORY  镜像仓库源（名称）
TAG			镜像的标签
IMAGE ID	镜像的id
CREATED		镜像创建时间
SIZE		镜像大小

docker images --help # 查看帮助文档

# 可选参数
-a, --all  # 列出所有镜像
-q, --quiet # 只显示镜像的id
```

**docker search镜像搜索**

```shell
[root@localhost docker]# docker search hello-world
NAME                                       DESCRIPTION                                     STARS               OFFICIAL            AUTOMATED
hello-world                                Hello World! (an example of minimal Dockeriz鈥  1308                [OK]                
kitematic/hello-world-nginx                A light-weight nginx container that demonstr鈥  148                                     
tutum/hello-world                          Image to test docker deployments. Has Apache鈥  73                                      [OK]
dockercloud/hello-world                    Hello World!                                    19                                      [OK]
# 使用帮助文档，查看具体可选参数
docker search --help
```

**docker pull 镜像下载**

```shell
# 下载镜像
docker pull mysql
# 等价命令
docker pull docker.io/library/mysql:latest
# 选择版本
docker pull 镜像名称[:tag]

# docker镜像下载，分层下载，docker image核心联合文件系统


docker pull --help
```

#### 容器命令

### Docker Compose

一句话描述：批量服务容器编排

- Compose是用于定义和运行多容器的应用程序工具。
- 可以使用yaml文件配置docker-compose.yml
- 使用命令启动docker-compose  up

Docker Compose使用三个步骤：

- 1、Dockerfile
- 2、docker-compose.yml
- 3、docker-compose up

---

> Docker Compose是Docker官方的开源项目，需要安装！
>
> Dockerfile是让程序在任何地方运行

docker-compose.yml

```yaml
version: "3.8"
services:
  web:
    build: .
    ports:
      - "5000:5000"
    volumes:
      - .:/code
      - logvolume01:/var/log
    links:
      - redis
  redis:
    image: redis
volumes:
  logvolume01: {}
```

Docker Compose作用

- service服务， 一系列的服务、应用（ web、mysql、redis等等）
- project项目，一组向关联的容器。

---

#### 安装Docker Compose

- 命令行安装当前稳定版docker compose

```bash
# 官方下载安装地址，可能会很慢
$ sudo curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 使用国内镜像下载安装
$ curl -L https://get.daocloud.io/docker/compose/releases/download/1.27.4/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
```

- 赋权(docker-compose操作权限)

```bash
sudo chmod +x /usr/local/bin/docker-compose
```

- 验证安装

```shell
$ docker-compose version

# 出现版本信息，表示安装成功
[root@localhost ~]# docker-compose version
docker-compose version 1.27.4, build 40524192
docker-py version: 4.3.1
CPython version: 3.7.7
OpenSSL version: OpenSSL 1.1.0l  10 Sep 2019
```

#### 体验Docker Compose

getstart地址：https://docs.docker.com/compose/gettingstarted/

**一、创建一个web服务**

- 1、创建一个工程目录

```shell
mkdir composetest
cd composetest
```

- 2、创建一个工程文件：app.py

```shell
import time

import redis
from flask import Flask

app = Flask(__name__)
cache = redis.Redis(host='redis', port=6379)

def get_hit_count():
    retries = 5
    while True:
        try:
            return cache.incr('hits')
        except redis.exceptions.ConnectionError as exc:
            if retries == 0:
                raise exc
            retries -= 1
            time.sleep(0.5)

@app.route('/')
def hello():
    count = get_hit_count()
    return 'Hello World! I have been seen {} times.\n'.format(count)
```

- 3、创建requirements.txt

```shell
flask
redis
```

**二、创建并编写Dockerfile**

```shell
# 官方示例
FROM python:3.7-alpine
WORKDIR /code
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
RUN apk add --no-cache gcc musl-dev linux-headers
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
EXPOSE 5000
COPY . .
CMD ["flask", "run"]

# 自定义
FROM python:3.7-alpine
WORKDIR /code
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
EXPOSE 5000
COPY . .
CMD ["flask", "run"]
```

**三、创建docker-compose.yml编排服务**

定义了两个服务：web服务和redis服务

```yaml
version: "3.8"
services:
  web:
    build: .
    ports:
      - "5000:5000"
  redis:
    image: "redis:alpine"
```

**四、构建启动docker-compose**

在当前文件夹下

- 构建

```shell
$ docker-compose build
```

- 启动

```shell
$ docker-compose up . # 启动docker-compose .:dockerfile目录地址
```

- 访问测试：http://localhost:5000/ 验证

```shell
$ curl http://localhost:5000 
```

- 切换终端查看镜像列表

```shell
$ docker images ls
```

- 停止compose

```shell
docker-compose down # 或者Ctrl+C
```

**五、编辑compose文件增加挂载目录**

volumes参数：修改web应用代码不用重新构建镜像

environment参数：设置开发环境，在development模式下flask run时重新加载代码。

```yaml
version: "3.8"
services:
  web:
    build: .
    ports:
      - "5000:5000"
    volumes:
      - .:/code
    environment:
      FLASK_ENV: development
  redis:
    image: "redis:alpine"
```

**六、重启docker-compose**

```
$ docker-compose up
```

**七、修改app.py应用代码访问测试**

```shell
return 'Hello from Docker! I have been seen {} times.\n'.format(count)
```

**八、其他命令**

```shell
$ docker-compose up -d # 启动并后台运行

$ docker-compose ps # 查看运行情况

$ docker-compose run web env # run 一次性命令 查看可用于web的环境变量

$ docker-compose stop # 停止服务 Ctrl+c

$ docker-compose down --volumes # 关闭移除 使用volumes移除redis使用数据

$ docker-compose --help # 查看帮助文档
```

**docker网络**

在同一个网络下，可以通过域名访问（服务挂了没关系，重启一个名称不变就没关系）

#### 卸载Docker Compose

```bash
# curl方式安装docker compose卸载
sudo rm /usr/local/bin/docker-compose

# pip方式安装docker compose卸载
pip uninstall docker-compose
```

通过Docker Compose编写配置文件，实现一键启动所有服务。

---

#### docker-compose.yaml

- 配置文件编写规则

yaml规则:https://docs.docker.com/compose/compose-file/

docker-compose.yml

```shell
# 3层
# 第一层：version版本
# 第二层：service服务
	# 服务 服务配置（环境）等
# 第三层：其他配置
```

```yaml
version: '' # 版本
services：# 服务
	服务1：web
		# 服务配置
		images
		build
		network
		....
	服务2：redis
		....
	服务3：redis
		....
# 其他配置 网络/卷、全局规则
volumes：
networks：
configs：
```

**官网docs中使用docker-compose一键部署WordPress的例子**

https://docs.docker.com/compose/wordpress/

#### Docker小结

- 1、Docker镜像，run -> 容器
- 2、Dockerfile构建镜像（服务打包）
- 3、Docker-Compose启动项目（多服务编排，环境配置）
- 4、Docker网络

#### Docker Compose实战

4部曲：

- 1、编写微服务项目
- 2、Dockerfile构建镜像
- 3、docker-compose.yml编排服务
- 4、打包上线启动：docker-compose up

```shell
# 重新打包部署
docker-compose up --build
```

### Docker Swarm

#### 集群搭建

初始化docker swarm

加入一个节点

获取管理节点

获取管理员令牌：manager worker

查看集群节点: docker node ls

#### Raft协议

​	一致性算法

集群最小要保证有3台管理节点，且必须保证大于1台的管理节点存活，才可以保证集群可用。

#### 扩缩容



### Docker stack

docker-compose 单机部署

docker stack集群部署

```shell
# 单机
docker-compose up -d wordpress.yaml

# 集群部署
docker stack deploy wordpress.yaml 
```

### Docker secret





### Docker config



### 拓展到K8S

应用上云-k8s商店-原生应用-下载云应用-配置运营

**精通K8S**

云原生

**Go语言**

​	docker

​	k8s

​	etcd

​	v8





- 入门
- 基础语法
- 高级对象
- 框架

---







---



### Docker Desktop

**是什么？**

Docker Desktop为Windows、Mac提供的一个桌面化的容器开发环境，在win10上，使用了Windows的Hyper-V虚拟化技术。

#### win10下使用

- 前提

  Windows10专业版以上系统

  打开Hyper-V功能  [打开方式](https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v)

- 下载安装

  docker desktop下载地址：https://hub.docker.com/editions/community/docker-ce-desktop-windows

那么Docker Desktop安装后使用方式和在Linux下或云服务器一毛一样。

### Docker常用命令总结

```shell
# 1.检查docker版本

docker version

# 2.搜索镜像

docker search tomcat

# 3.拉取镜像

docker pull tomcat

# 4.根据镜像启动容器

docker run --name mytomcat -d tomcat:latest

# 5.查看运行中的容器

docker ps

# 6.停止运行中的容器

docker stop containerId

# 7.查看所有容器

docker ps -a

# 8.启动容器

docker start 容器id

9.删除一个容器

docker rm 容器id

# 10.启动一个做了端口映射的容器(nginx)

docker run -d -p 80:80 nginx

# 说明：-d：后台启动 -p：将主机的端口映射到容器的一个端口 主机端口：容器端口

# 11.查看容器的日志

docker logs container-name/container-id

# 12.查看镜像列表

docker images

# 13.删除一个镜像

docker rmi imageId

# 14.进入运行中的容器

docker exec -it 容器name/id sh/ .

# 15.退出运行中的容器

exit

```

### Docker使用

#### Docker hello world

```shell
# docker运行ubuntu：15.10镜像，并在容器中执行echo命令输出“hello world”。
# Docker 以 ubuntu15.10 镜像创建一个新容器，然后在容器里执行 bin/echo "Hello world"，然后输出结果。
$ docker run ubuntu:15.10 /bin/echo "hello world"

# 运行交互式容器
# Docker 以 ubuntu15.10 镜像创建一个新容器，然后进入容器并开启一个标准输入和终端进行交互。
# -i表示对容器使用标准输入进行交互。 -t表示在新容器内指定一个终端。
$ docker run -i -t ubuntu:15.10 /bin/bash
root@0123ce188bd8:/#

# 退出容器回到主机
exit 或者 ctrl+d

# 启动容器后台模式
# 后台模式启动Ubuntu容器并后台输出hello world
$ docker run -d ubuntu:15.10 /bin/sh -c "while true; do echo hello world; sleep 1; done"
2b1b7a428627c51ab8810d541d759f072b4fc75487eed05812646b8534a2fe63

# 查看容器的运行状态
$ docker ps
CONTAINER ID        IMAGE                  COMMAND              ...  
5917eac21c36        ubuntu:15.10           "/bin/sh -c 'while t…"    ...

# CONTAINER ID: 容器 ID。
# IMAGE: 使用的镜像。
# COMMAND: 启动容器时运行的命令。
# CREATED: 容器的创建时间。
# STATUS: 容器状态。7种状态：created（已创建） restarting（重启中） running（运行中） removing（迁移中） paused（暂停） exited（停止） dead（死亡）
# PORTS：端口信息和连接类型（tcp、udp）
# NAMES：自动分配的容器的名称

# 在宿主机内查看容器内标准输出：
$ docker logs 容器id

# 停止容器
$ docker stop containerid
```

#### Docker容器使用

```shell
# 查看所有命令
$ docker 
# 查看帮助文档
$ docker 命令 --help # docker run --help
# 拉取镜像
$ docker pull imagename
# 从镜像启动一个容器
$ docker run 参数 imagename 命令 # docker run -it ubuntu /bin/bash
# 退出容器
$ exit
# 停止容器
$ docker stop containerid
# 启动已停止容器
$ docker ps -a
$ docker start containerid
# 重启容器
$ docker restart containerid
# 容器后台运行
$ docker run -itd --name ubuntu-test ubuntu /bin/bash # -d表示后台运行 --name给容器起个名字ubuntu-test 
# 进入运行中的容器
$ docker exec containerid #docker exec -it 容器id /bin/bash  (推荐的方式)
$ docker attach # 进入容器

# 导出容器
$ docker export containerid > ubuntu.tar # 导出容器快照
# 导入容器快照docker import
$ cat docker/ubuntu.tar | docker import - test/ubuntu:v1 #将快照文件ubuntu.tar导入到镜像test/ubuntu:v1
$ docker import http://example.com/example.tgz example/imagepo # 从指定URL或某个目录来导入

# 删除容器
$ docker rm -f containerid

# 清理所有终止状态的容器
$ docker container prune

# 运行一个web应用
$ docker pull training/webapp # 拉取镜像
$ docker run -d -P training/webapp python app.py # -d 容器后台运行  -P:将容器内部使用的网络端口随机映射到主机上。
# 查看web容器
$ docker ps
# 通过查看PORTS信息查看端口映射 在主机访问
PORTS
0.0.0.0:32769->5000/tcp
# 容器的5000端口映射到宿主机的32769端口 http://127.0.0.1:32769访问web应用

# 自定义设置端口映射 将容器5000端口映射到宿主机5000端口
$ docker run -d -p 5000:5000 training/webapp python app.py

# 查看端口映射的快捷方式
$ docker port containerid或容器名称  # 查看容器和宿主机的端口映射

# 查看web应用日志
$ docker logs -f containerid

# 查看web应用容器的进程
$ docker top containername

# 检查web应用
$ docker inspect containername 

# 停止web应用
$ docker stop containername

# 重启web应用容器
$ docker start containername
# 重启正在运行的web应用容器
$ docker restart containername

# 查询最后一次创建的容器
$ docker ps -l

# 移除web应用容器(要删除的容器必须是停止状态的容器，否则会报错)
$ docker rm containername

```

#### Docker镜像使用

- 管理使用本地镜像
- 创建镜像

```shell
# 查看列出所有镜像
$ docker images
# docker run-运行 -t开启一个终端 -i标准输入交互式操作 ubuntu-镜像仓库 15.10-tag版本 /bin/bash容器运行命令
$ docker run -t -i ubuntu:15.10 /bin/bash

# 拉取镜像(层层拉取)
$ docker pull ubuntu:13.10

# 查找镜像
$ docker search ubuntu

# 启动镜像
$ docker run ubuntu

# 删除
$ docker rmi ubuntu

```

**创建镜像**

- 从已创建的容器中更新镜像，并提交这个镜像
- 使用Dockerfile指令来创建一个新镜像

```shell
# 更新镜像
# 1.开启一个容器并进入交互式终端
$ docker run -i -t ubuntu:15.10 /bin/bash
# 2.在容器中更新
apt-get update
# 3.退出容器
exit
# 4.提交容器副本
$ docker commit -m="has update" -a="shihe" containerid shihe/ubuntu:v2
# -m:提交的表述信息 -a:作者 shihe/ubuntu:v2:指定要创建的目标镜像名


```

![image-20201012103215884](C:\Users\admin\AppData\Roaming\Typora\typora-user-images\image-20201012103215884.png)

```shell
# Dockerfile
# 说明：每一个指令都必须是大写，都会在镜像上创建一个新的层。
# FROM：指定使用哪个镜像源
# RUN：告诉docker在镜像内执行命令

# 构建镜像
$ docker build -t xxx/ubuntu:v3 .
# -t:指定要创建的目标镜像名 .:Dockerfile文件所在的目录


# 设置镜像标签
docker tag containerid xxx/ubuntu:dev  # docker tag 镜像id、用户名、镜像源名：标签名

```

#### Docker容器连接（网络）

```shell
# 网络端口映射
$ docker run -d -P training/webapp python app.py 
# -P:容器内部端口随机映射到宿主机端口
# -p:指定容器内部端口映射到宿主机端口

# 指定绑定网络地址
$ docker run -d -p 127.0.0.1:5001:5000 training/webapp python app.py
# 访问http://127.0.0.1:5001 

# 默认绑定tcp端口，指定udp端口
$ docker run -d -p 127.0.0.1:5001:5000/udp training/webapp python app.py

```

**容器的互联**

```shell
# docker允许多个容器互联，共享连接信息，会创建一个父子关系，父容器可以看到子容器的信息。
# 容器命名
$ docker run -d -P --name shihe training/webapp python app.py
$ docker ps -l

# 创建网络
docker network create -d bridge test-net  # -d:指定docker网络类型，bridge、overlay（用于Swarm mode）
# 查看网络
$ docker network ls

# 连接容器
$ docker run -itd --name shihe --network test-net ubuntu /bin/bash
# 开一个新终端，运行一个新容器加入到test-net网络
$ docker run -itd --name shihe1 --network test-net ubuntu /bin/bash

# 测试网络连接
$ docker exec -it shihe /bin/bash
/# ping shihe1
$ docker exec -it shihe1 /bin/bash
/# ping shihe
```

**配置DNS**

```shell
# 在宿主机场景文件：/etc/docker/daemon.json
{
	"dns":[
		"114.114.114.114",
		"8.8.8.8"
	]
}
# 配置完成，重启docker，启动容器，查看dns是否生效
$ docker run -it --rm ubuntu cat etc/resolv.conf

# 手动指定容器的配置
# 如果只想在指定的容器设置 DNS，则可以使用以下命令：
$ docker run -it --rm -h host_ubuntu  --dns=114.114.114.114 --dns-search=test.com ubuntu
```

#### Docker仓库管理

```shell
# 注册Docker Hub
# 登陆docker hub(管理自己的镜像)
$ docker login

# 退出docker hub
$ docker logout

# 推送镜像
$ docker push dockerhubusername/ubuntu:18.05
```

#### Docker Dockerfile

**使用Dockerfile定制镜像**

```shell
# 在空目录下新建Dockerfile文件并添加内容
FROM nginx
RUN echo '这是一个本地构建的Nginx镜像' > /usr/share/nginx/html/index.html
```

**说明：**

FROM:定制的镜像基于nginx镜像

RUN:命令在/usr/share/nginx/html/下新建index.html文件，内容为“这是一个本地构建的Nginx镜像”

RUN命令的两种格式：

```shell
# shell格式
RUN <命令行命令>


# exec格式
RUN ["可执行文件"，"参数1"，"参数2"]
# RUN ["./test.php","dev","offline"] 等价 RUN ./test.php dev offline
```

**注意**：Dockerfile 的指令每执行一次都会在 docker 上新建一层。所以过多无意义的层，会造成镜像膨胀过大。

```shell
FROM centos
RUN yum install wget
RUN wget -O redis.tar.gz "http://download.redis.io/releases/redis-5.0.3.tar.gz"
RUN tar -xvf redis.tar.gz
以上执行会创建 3 层镜像。可简化为以下格式：
FROM centos
RUN yum install wget \
    && wget -O redis.tar.gz "http://download.redis.io/releases/redis-5.0.3.tar.gz" \
    && tar -xvf redis.tar.gz
```

**构建**

```shell
$ docker build -t nginx:v3 .
# .：表示上下文路径
```

**构建指令**

```shell
# COPY指令：从上下文目录中复制文件或目录到容器指定路径
COPY [--chown=<user>:<group>] <源路径1>...  <目标路径>
COPY [--chown=<user>:<group>] ["<源路径1>",...  "<目标路径>"]

# ADD指令：格式和COPY一致推荐使用COPY

# CMD指令：
CMD 在docker run 时运行。
RUN 是在 docker build。

CMD <shell 命令> 
CMD ["<可执行文件或命令>","<param1>","<param2>",...] 
CMD ["<param1>","<param2>",...]  # 该写法是为 ENTRYPOINT 指令指定的程序提供默认参数

# ENTRYPOINT
优点：在执行 docker run 的时候可以指定 ENTRYPOINT 运行所需的参数。
注意：如果 Dockerfile 中如果存在多个 ENTRYPOINT 指令，仅最后一个生效。

格式：
ENTRYPOINT ["<executeable>","<param1>","<param2>",...]


# ENV
设置环境变量，定义了环境变量，那么在后续的指令中，就可以使用这个环境变量。

格式：
ENV <key> <value>
ENV <key1>=<value1> <key2>=<value2>...

# ARG


# VOLUME

# EXPOSE

# WORKDIR

# USER

# HEALTHCHECK

# ONBUILD

```



#### Docker Compose

Compose 是用于定义和运行多容器 Docker 应用程序的工具。通过 Compose，您可以使用 YML 文件来配置应用程序需要的所有服务。然后，使用一个命令，就可以从 YML 文件配置中创建并启动所有服务。主要用于单机。

#### Docker Machine



#### Docker Swarm 集群管理



---

## Docker入门总结

#### 基础



#### 命令



#### Dockerfile

Dockerfile用于构建镜像的命令脚本文件

【重点】from、run、entrypoint、cmd

```shell
#基于centos镜像
FROM centos:7
#维护人的信息 下面2种选一即可
MAINTANIER www.qsm.com
LABEL maintainer="qsm.cn"
#设置环境内环境变量
ENV JAVA_HOME /usr/local/jdk1.8.0_45
#add COPY 都是拷贝，但是add会解压
ADD jdk-8u45-linux-x64.tar.gz /usr/local
ADD apache-tomcat-8.0.46.tar.gz /usr/local
COPY server.xml /usr/local/apache-tomcat-8.0.46/conf
#构建镜像时运行的Shell命令
RUN rm -f /usr/local/*.tar.gz
#工作目录，进入容器的默认目录
WORKDIR /usr/local/apache-tomcat-8.0.46
#开启8080端口
EXPOSE 8080
#类似于 CMD 指令，不会被覆盖。多个仅最后一个生效。cmd同时存在，作为entrypoint参数
ENTRYPOINT ["./bin/catalina.sh", "run"]
#当启动docker run容器时执行的命令。可覆盖。多个仅最后一个生效。
CMD ["/run.sh"]
```

![Dockerfile](![Dockerfile](https://img-blog.csdnimg.cn/20200612192849464.png)

## Docker进阶

### 1、进阶基础

- 虚拟化：核心是对资源的抽象。目的是为了在同一台机器上同时运行多个系统或者应用，从而提升系统资源的利用率，降低成本。

- 操作系统虚拟化（docker）、完全虚拟化（虚拟机）

  ```
  docker是虚拟化技术中的：操作系统虚拟化，直接服用宿主机的操作系统。即在宿主机内核通过创建多个虚拟的操作系统实例（内核和库）来隔离不同的进程。
  VMware等软件是完全虚拟化，即完整的底层硬件环境和特权指令的执行过程。
  ```

- 核心概念

  ```
  镜像：生成容器模本（源代码）。由多个只读层组成。与容器的唯一区别是，容器在这些只读层上面添加了一层可读写的容器层。
  容器：镜像的一个实例；由只读镜像层和可读写容器层组成。表现为一个微型操作系统和一个（组）应用。
  仓库：存放镜像的地方；实际上为Registry仓库注册服务器，仓库只是相对于某个镜像的而言的。即仓库存放mysql镜像，有为很多版本。Registry仓库注册服务器则有很多仓库，比如mysql仓库和redis仓库等。注册索引（index）则是负责维护用户的账号，权限等管理。
  
  层：联合文件系统，是一种轻量级的高性能分层文件系统，每次修改作为一次提交，并层层叠加。多个层就可以组成一个镜像，即联合文件系统是实现docker镜像的技术基础。
  ```

- 命令

  ```shell
  # 镜像
  # 镜像详情
  docker inspect mysql:7
  # 镜像分层信息
  docker history tomcat:7
  # 镜像清理，一些临时镜像文件和没有使用的镜像
  docker prune -af
  # 镜像创建，四种commit import builid，load
  docker commit -m 'add a new file' -a 'docker nb' 容器id qsmtomcat:0.1
  # 镜像上传
  docker push qsmtomcat:1.0
  
  # 容器
  # 容器run,等于create和start
  docker run -it -p 9999:8080 --name mytomcat 镜像id
  # 容器导出
  docker export -o qsm.tar ce5
  # 容器导入
  docker import qsm.tar - test/qsmtomcat:1.0
  # 容器信息，inspect详情。top进程。stats统计信息，cup内存，网络等
  docker stats 容器id
  # 容器查看变更 diff 容器内一些数据修改;
  docker diff 容器id
  # 容器，更新配置update，一些运行时资源配置。
  docker update--cpu-quota 100000 容器id/name
  
  # 仓库
  # 可以使用registry镜像搭建本地仓库
  docker run -d -p 5000:5000 registry:2
  ```

- docker数据管理

  **1、使用数据卷**容器内的数据直接映射到本地主机环境

  ```
  # 两种实现方式
  #  第一种，--mount
  docker run -d -P --name web --mount type=bind,source=/webapp,destination=/opt/webapp training/webapp python app.py
  # 第二种，在run命令的时候直接-v
  docker run -it -p 8888:8080 --name qsmtomcat2 -v /local/tomcat/webapps/ /usr/local/tomcat/webapps tomcat镜像id
  ```

  **2、使用数据卷容器**容器间数据共享

  ```shell
  # 首先创建一个容器
  docker run -it -v /dbdata --name dbdata ubuntu
  # 其他容器使用--volumes-from 来指定容器
  docker run -it --volumes-from dbdata --name db1 ubuntu
  ```

- docker容器访问

  一是使用端口映射，二是容器互联

  前者在run命令的时候使用-p指定或者-P随机指定。

  后者是创建一个容器之后，在另外一个容器–link 第一个容器名

- Dockerfile

  基础的操作系统镜像有busybox debian centos ubuntu等

### 2、实现原理

- 基本架构

  C/S架构+仓库

  ```
  C端：用户使用的Docker可执行命令就是客户端程序。
  S端：dockerd，接受请求。docker-proxy端口映射。containerd具体处理与容器相关的请求，containerd-shim，为runC容器提供支持，并且作为容器内进程的根进程。
  仓库：存放镜像
  ```

- 底层实现：namespace、cgroup，UnionFS

- docker网络

  五种网络

- docker compose

  三要素

文档地址(https://blog.csdn.net/u013541707/article/details/106768531)

---

