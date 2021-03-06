## SpringBoot应用监控

## SpringBoot监控和管理端点

| 端点名|	描述|
| ---- | ---- |
|actuator|所有EndPoint的列表，需加入spring HATEOAS支持|
|autoconfig|	当前应用的所有自动配置信息|
|auditevents|	审计事件|
|beans	|所有Bean的信息|
|configprops	|所有配置属性|
|dump	|线程状态信息|
|env	|当前环境信息|
|health	|应用健康状况|
|info	|当前应用信息|
|metrics	|应用的各项指标|
|mappings	|应用@RequestMapping映射路径|
|shutdown	|关闭当前应用（默认关闭）|
|trace	|追踪信息（最新的http请求）|

## Actuator

在生产环境中，需要对应用程序的状态进行监控。前面我们已经介绍了使用JMX对Java应用程序包括JVM进行监控，使用JMX需要把一些监控信息以MBean的形式暴露给JMX Server，而Spring Boot已经内置了一个监控功能，它叫Actuator。

使用非常简单，只需添加如下依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```
然后正常启动应用程序，Actuator会把它能收集到的所有信息都暴露给JMX。此外，Actuator还可以通过URL/actuator/挂载一些监控点，例如，输入http://localhost:8080/actuator/health，我们可以查看应用程序当前状态：

```xml
{
    "status": "UP"
}
```
许多网关作为反向代理需要一个URL来探测后端集群应用是否存活，这个URL就可以提供给网关使用。

Actuator默认把所有访问点暴露给JMX，但处于安全原因，只有health和info会暴露给Web。Actuator提供的所有访问点均在官方文档列出，要暴露更多的访问点给Web，需要在application.yml中加上配置：

```xml
management:
  endpoints:
    web:
      exposure:
        include: info, health, beans, env, metrics
```
要特别注意暴露的URL的安全性，例如，/actuator/env可以获取当前机器的所有环境变量，不可暴露给公网。