## SpringBoot之应用环境

### 应用环境-Environment
Spring提供了一个接口Environment用来代表当前运行应用的环境，这个环境包含两个部分：

- Profile：指的是一组命名的、定义在一起的Bean。我们通常为不同的应用场景（生产、开发，测试等）定义。
- Property：指的是配置属性，我们可以从properties文件、JVM系统属性、操作系统环境变量等外部来获得配置属性。

### @Profile场景切换
通过使用@Profile注解实现运行环境切换，如开发环境和生产环境切换，该注解可以和@Component、
@Configuration和@Bean一起使用。
```js
@Configuration
@Profile("dev")
public class WindowsProfileConfig {
    @Bean
    CommandService commandService(){
        return new CommandService("dir");
    }
}

@Configuration
@Profile("production")
public class LinuxProfileConfig {
    @Bean
    CommandService commandService(){
        return new CommandService("ls");
    }
}
```
- 在SpringBoot配置文件application.properties中指定激活场景
```js
spring.profile.active=dev
```

- 手动配置激活方式-扫描bean并刷新
```js
AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(); context.getEnvironment().setActiveProfiles("production"); 
context.scan("org.shihe");
context.refresh();
```

### @PropertySource属性配置

Spring的Environment的属性是由PropertySource组成的，我们可以通过@PropertySource指定外部配置文件的路径，这些配置文件的属性都会以PropertySource的形式注册到Environment中，@PropertySource支持xml和properties格式，不支持Spring Boot下的YAML格式。

如我们现在添加了2个外部配置文件：

author.properties
```js
author.name=wyf
```

book.properties：
```js
book.name=spring boot in battle
```

我们可以用一个配置类来接受这两个文件的配置：
```js
@Configuration
@PropertySources({
        @PropertySource("classpath:author.properties"),
        @PropertySource("classpath:book.properties")
}) //1
public class ExternalConfig {

    Environment env;

    public ExternalConfig(Environment env) { //2
        this.env = env;
    }

    @Value("${book.name}") //3
    private String bookName;

    public void showEnv(){
        System.out.println("作者名字是：" + env.getProperty("author.name")); //4
        System.out.println("书籍名称是：" + bookName);
    }
}
```
- 多个外部配置可以用@PropertySources,若只有一个可以只使用@PropertySource("classpath:book.properties")；
- 注入Environment的Bean，因只有一个参数，可省略@Autowired；
- 可以@Value注解获得Environment中的属性，@Value的使用在Spring EL一节有更详细的讲解；
- 外部配置的属性都已经在Environment注册，可以直接获取。
