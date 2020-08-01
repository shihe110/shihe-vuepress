## SpringBoot之关闭特定自动配置

关闭特定的自动配置应该使用@SpringBootApplication注解的exclude参数
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})

## 定制Banner
- 1.在src/main/resources下新建一个banner.txt
- 2.通过字符画生成网站，生成图案，复制到banner.txt中。

## 关闭banner
- 1.main入口修改
```java
SpringApplication app = new SpringApplication(xxxApplication.class);
app.setShowBanner(false);
app.run(args);
```
- 2.使用fluent API修改
```java
new SpringApplicationBuilder(xxxApplication.class)
    .showBanner(false)
    .run(args);
```
## starter pom

|  名称   | 描述  |
|  ----  | ----  |
| spring-boot-starter  | spring boot核心starter，包含自动配置，日志，yaml配置文件的支持 |
| spring-boot-starter-actuator  | 准生产特性，用来监控和管理应用 |
| spring-boot-starter-remote-shell  | 提供基于ssh协议的监控和管理 |
| spring-boot-starter-amqp  | 使用spring-rabbit来支持AMQP |
| spring-boot-starter-aop  | 使用spring-aop和AspectJ支持面向切面编程 |
| spring-boot-starter-batch  | 对spring Batch的支持 |
| spring-boot-starter-cache  | 对spring Cache抽象的支持 |


## 使用xml配置
通过使用@ImportResource来加载xml配置
```java
@ImportResource({"classpath:some-context.xml","classpath:another-context.xml"})
```

## 外部配置
- 1.命令行参数配置
```java
java -jar xx.jar --server.port=9090
```

## 常规属性配置
通过使用@PropertySource指明properties文件的位置，然后通过@Value注入值。

## 类型安全的配置
通过@ConfigurationProperties将properties属性和一个bean机器属性关联，从而实现类型安全的配置。

@ConfigurationProperties加载配置，通过prefix属性指定properties配置的前缀
通过locations指定文件的位置。
```java
@ConfigurationProperties(prefix="shihe", locations={"classpath:config/shihe.properties"})
```

## 日志配置
配置日志级别：
```java
loggin.level.org.springframwork.web=DEBUG
```
配置日志文件
```java
logging.file=D://mylog/log.log
```
## Profile配置
切换配置环境
application-dev.properties
application-pro.properties
```java
spring.profiles.active=dev
```


