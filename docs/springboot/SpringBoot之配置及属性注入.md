### 前后端分离上线部署

- 方式一

  前后端一起部署，前端打包编译成静态文件后，拷贝到后端项目中，然后部署后端

- 方式二

  前后端分离部署，前后使用nginx部署，后端直接部署jar或者docker部署。

### springboot配置文件

#### application.properties配置文件

新建springboot工程，默认resources目录下包含一个application.properties文件，可以在此进行项目配置，但其实在工程中有4个默认位置可以存放该文件。

优先级依次为：

- 1.当前项目根目录下的config目录下

- 2.当前项目的根目录下

- 3.resources目录下的config目录下

- 4.resources目录下

#### application.yaml配置文件

- 1.项目根目录下的config目录中

- 2.项目根目录下

- 3.classpath下的config目录中

- 4.classpath目录下

#### 两种配置文件异同

- 1.当前yaml不支持@PropertySource注解 

- 2.yaml可以使配置有序

```yaml
shihe:
    servers:
        - dev.shihe.com
        - pro.shihe.com
# yaml注入数组，可以指定顺序
```

### SpringBoot启动自定义名称

在项目启动时指定配置文件位置,idea配置文件位置时，以/结尾 jar包启动命令：java -jar myproject.jar --spring.config.name=app

### SpringBoot系统启动任务的两种方式

>引言： 在Servlet/jsp项目中，如果涉及到系统任务，例：在项目启动阶段要做一些初始化操作，这些操作只在项目启动时进行，以后就不再执行， 例如：web三大基础组件（servlet、filter、listener）之一的Listener。这种情况下，一般定义一个ServletContextListener，监听项目的启动 和销毁，进而做出相应的数据初始化和销毁操作。

```java
public class MyListener implements ServletContextListener {
    @Override
    pulich void contextInitialized(ServletContextEvent sce){
        // 初始化操作
    }
    @Override
    pulich void contextDestroyed(ServletContextEvent sce){
        // 销毁操作
    }
}
```

SpringBoot针对系统启动任务提供了两种解决方案，分别是`CommandLineRunner`和`ApplicationRunner`

- `CommandLineRunner`
- `ApplicationRunner`

### Springboot属性注入及自定义

#### 属性注入

application.properties

```properties
user.name=zhangsan
user.age=19
user.id=1
```

定义User类

```java
public class User {
    private int id;
    private String name;
    private int age;
    // 省略get/set
}
```

spring注入

```java
@Component
public class User {
    @Value("${user.id}")
    private int id;
    @Value("${user.name}")
    private String name;
    @Value("${user.age}")
    private int age;
    // 省略get/set
}
```

> 注：一般来说，我们在 application.properties 文件中主要存放系统配置，这种自定义配置不建议放在该文件中，可以自定义 properties 文件来存在自定义配置。
>
> User 对象本身也要交给 Spring 容器去管理，如果 User 没有交给 Spring 容器，那么 User 中的属性也无法从 Spring 容器中获取到值。配置完成后，在 Controller 或者单元测试中注入 User 对象，启动项目，就可以看到属性已经注入到对象中了。
>

#### 自定义properties注入

user.properties

```properties
user.name=zhangsan
user.age=19
user.id=1
```

配置：

方式一:xml配置

```xml
<context:property-placeholder location="classpath:user.properties"/>
```

方式二：java配置

```java
@Component
@PropertySource("classpath:user.properties")
public class User {
    @Value("${user.id}")
    private int id;
    @Value("${user.name}")
    private String name;
    @Value("${uers.age}")
    private int age;
    //getter/setter
}
```

#### springboot类型安全的属性注入

```java
@Component
@PropertySource("classpath:user.properties")
@ConfigurationProperties(prefix = "user")
public class User {
    private int id;
    private String name;
    private int age;
    //省略getter/setter
}
```

> 注：这种方式设置了前缀，避免使用@Value挨个注入，减少工作量并避免出错

### Springboot单元测试报错小记

```cmd
java.lang.IllegalStateException: Unable to find a @SpringBootConfiguration, you need to use
```

问题有可能是有两个：

- 1.没有写启动类

- 2.写了启动类但是启动类所在的包和单元测试的包不在同一级根目录下。

#### springboot排除错误页

```java
@SpringBootConfiguration
@EnableAutoConfiguration(excludeName = {"org.springframework.boot.autoconfigure.web.servlet.error.ErrorMvcAutoConfiguration"})
@ComponentScan(
        excludeFilters = {@ComponentScan.Filter(
                type = FilterType.CUSTOM,
                classes = {TypeExcludeFilter.class}
        ), @ComponentScan.Filter(
                type = FilterType.CUSTOM,
                classes = {AutoConfigurationExcludeFilter.class}
        )}
)
public class WelcomeApplication {

    public static void main(String[] args) {
        SpringApplication.run(WelcomeApplication.class, args);
    }

}


@SpringBootApplication(exclude = ErrorMvcAutoConfiguration.class)
public class WelcomeApplication {

    public static void main(String[] args) {
        SpringApplication.run(WelcomeApplication.class, args);
    }

}
```

application.properties配置

```properties
spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.web.servlet.error.ErrorMvcAutoConfiguration
```

















