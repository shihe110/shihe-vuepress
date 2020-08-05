## Docker的基本使用

- 1.检查docker版本
> docker version

- 2.搜索镜像
> docker search tomcat

- 3.拉取镜像
> docker pull tomcat

- 4.根据镜像启动容器
> docker run --name mytomcat -d tomcat:latest

- 5.查看运行中的容器
> docker ps

- 6.停止运行中的容器
> docker stop containerId

- 7.查看所有容器
> docker ps -a

- 8.启动容器
> docker start 容器id

- 9.删除一个容器
> docker rm 容器id

- 10.启动一个做了端口映射的容器(nginx)
> docker run -d -p 80:80 nginx

说明：-d：后台启动    -p：将主机的端口映射到容器的一个端口 主机端口：容器端口

- 11.查看容器的日志
> docker logs container-name/container-id

- 12.查看镜像列表
> docker images

- 13.删除一个镜像
> docker rmi imageId 

- 14.进入运行中的容器
> docker exec -it 容器name/id  sh/ .

- 15.退出运行中的容器
> exit


[官方命令地址](https://docs.docker.com/engine/reference/commandline/docker)
