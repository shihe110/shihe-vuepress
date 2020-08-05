## Eureka服务注册和发现（注册中心）

由Netflix开源，二代注册中心还有阿里的Nocos

Eureka 采用了 C-S 的设计架构。Eureka Server 作为服务注册功能的服务器，它是服务注册中心。而系统中的其他微服务，使用 Eureka 的客户端连接到 Eureka Server，并维持心跳连接。这样系统的维护人员就可以通过 Eureka Server 来监控系统中各个微服务是否正常运行。Spring Cloud 的一些其他模块（比如Zuul）就可以通过 Eureka Server 来发现系统中的其他微服务，并执行相关的逻辑。

Eureka由两个组件组成：Eureka服务器和Eureka客户端。Eureka服务器用作服务注册服务器。Eureka客户端是一个java客户端，用来简化与服务器的交互、作为轮询负载均衡器，并提供服务的故障切换支持。Netflix在其生产环境中使用的是另外的客户端，它提供基于流量、资源利用率以及出错状态的加权负载均衡。


## 创建服务注册中心eureka server

1.创建maven工程

2.创建两个model：一个作为服务注册中心Eureka server，一个作为客户端Eureka Client。

3.启动注册中心

4.配置application.properties

eureka.client.register-with-eureka ：表示是否将自己注册到Eureka Server，默认为true。
eureka.client.fetch-registry ：表示是否从Eureka Server获取注册信息，默认为true。
eureka.client.serviceUrl.defaultZone ：设置与Eureka Server交互的地址，查询服务和注册服务都需要依赖这个地址。默认是http://localhost:8761/eureka ；多个地址可使用 , 分隔。

server.port=8080
eureka.client.register-with-eureka=false  //不注册自己
eureka.client.fetch-registry=false  // 表示自己是eureka server
eureka.client.service-url.defaultZone=http://localhost:${server.port}/eureka/

 5.浏览http://localhost:8080



## 创建eureka client

1.创建工程

2.声明eureka client

3.配置application  服务中心地址   注册服务

eureka.client.service-url.defaultZone=http://localhost:8080/eureka/
server.port=8762
spring.application.name=service-hi


## 集群

集群概念由注册中心作为关键服务，不适合单点部署，为维持注册中心得高可用，使用集群方案来解决。Eureka通过互相注册的方式来实现高可用的部署，所以我们只需要将Eureke Server配置其他可用的serviceUrl就能实现高可用部署。

## 双节点注册中心

- 1.创建application-peer1.properties,作为peer1服务中心的配置，并将serviceUrl指向peer2

```
spring.application.name=spring-cloud-eureka
server.port=8000
eureka.instance.hostname=peer1

eureka.client.serviceUrl.defaultZone=http://peer2:8001/eureka/

```
- 2.创建application-peer2.properties,作为peer2服务中心的配置，并将serviceUrl指向peer1

```
spring.application.name=spring-cloud-eureka
server.port=8001
eureka.instance.hostname=peer2

eureka.client.serviceUrl.defaultZone=http://peer1:8001/eureka/

```
- 3.host转换

在host文件中增加配置
```
127.0.0.1 peer1
127.0.0.1 peer2
```

- 4.打包启动
```
#打包
mvn clean package
# 分别以peer1和peeer2 配置信息启动eureka
java -jar spring-cloud-eureka-0.0.1-SNAPSHOT.jar --spring.profiles.active=peer1
java -jar spring-cloud-eureka-0.0.1-SNAPSHOT.jar --spring.profiles.active=peer2
```

## Eureka集群使用-比双节点更进一步

三节点application.yml配置

```
---
spring:
  application:
    name: spring-cloud-eureka
  profiles: peer1
server:
  port: 8000
eureka:
  instance:
    hostname: peer1
  client:
    serviceUrl:
      defaultZone: http://peer2:8001/eureka/,http://peer3:8002/eureka/
---
spring:
  application:
    name: spring-cloud-eureka
  profiles: peer2
server:
  port: 8001
eureka:
  instance:
    hostname: peer2
  client:
    serviceUrl:
      defaultZone: http://peer1:8000/eureka/,http://peer3:8002/eureka/
---
spring:
  application:
    name: spring-cloud-eureka
  profiles: peer3
server:
  port: 8002
eureka:
  instance:
    hostname: peer3
  client:
    serviceUrl:
      defaultZone: http://peer1:8000/eureka/,http://peer2:8001/eureka/

```

### 分别以peer1、peer2、peer3的配置参数启动eureka注册中心。
```
java -jar spring-cloud-eureka-0.0.1-SNAPSHOT.jar --spring.profiles.active=peer1
java -jar spring-cloud-eureka-0.0.1-SNAPSHOT.jar --spring.profiles.active=peer2
java -jar spring-cloud-eureka-0.0.1-SNAPSHOT.jar --spring.profiles.active=peer3
```

