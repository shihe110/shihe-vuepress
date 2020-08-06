## Docker的基本使用

### Docker镜像命令

- 1.检查docker版本
> docker version

- 2.检索镜像
> docker search tomcat

- 3.拉取镜像
> docker pull tomcat

- 4.查看镜像列表
> docker images

- 5.删除一个镜像
> docker rmi imageId 

- 6.删除所有镜像
> docker rmi ${docker images -q}


### Docker容器命令

- 1.根据镜像启动容器
> docker run --name container-name -d image-name
> 例：docker run --name mytomcat -d tomcat:latest

- 2.查看运行中的容器列表
> docker ps

- 3.停止运行中的容器
> docker stop containerId

- 4.查看所有容器
> docker ps -a

- 5.启动容器
> docker start 容器名称/容器id
> 例：docker start test-redis

- 6.停止容器
> docker stop container-name/container-id

- 7.端口映射
> docker run -d -p 6378:6379 --name prot-redis redis
> docker run -d -p 80:80 nginx #启动一个做了端口映射的容器(nginx) 

说明：-d：后台启动  -p：将主机的端口映射到容器的一个端口 主机端口:容器端口

- 8.删除一个容器
> docker rm 容器id

- 9.删除所有容器
> docker rm ${docker ps -a -q}

- 10.查看容器的日志
> docker logs container-name/container-id

- 11.登陆运行中的容器
> docker exec -it 容器name/id  sh/ .
> docker exec -it container-id/container-name bash

- 12.退出运行中的容器
> exit

[官方命令地址](https://docs.docker.com/engine/reference/commandline/docker)

