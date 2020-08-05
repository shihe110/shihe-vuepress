## springboot使用docker部署

## 编译自己的docker镜像

代码十分简单
```java
@SpringBootApplication
@RestController
public class ShiheSpringbootDockerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShiheSpringbootDockerApplication.class, args);
    }

    @RequestMapping("/docker")
    public String helloDocker(){
        return "Hello Docker !!";
    }

}
```

### 新建目录Docker

新建目录名称任意，将编译好的jar包拖入该目录下。
在同级目录下新建一个Dockerfile文件,内容如下：

```java
FROM java:8

MAINTAINER shihe

ADD shihe-springboot-docker-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]

```
### 编译镜像

```java
docker build -t shihe/hellodocker
```
shihe/hellodocker为镜像名称，shihe作为前缀，docker镜像的一种命名习惯。
最后的“.”,用来指明Dockerfile路径的，表示Dockerfile在当前路径下。

### 运行访
```java
docker run -d --name shihe -p 8080:8080 shihe/hellodocker 
```
### 测试
```java
http://localhost:8080/docker
```


