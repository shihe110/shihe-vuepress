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

