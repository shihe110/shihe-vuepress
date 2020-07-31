## Spring高频配置

### 配置类@Configuration

```java
@Configuration
@ComponentScan("org.shihe")
public class HelloConfig {

}

public class Main {
    public static void main(String[] args) {
        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(HelloConfig.class);
        XXX bean = context.getBean(XXX.class);
        context.close();
    }
}
```

### Bean单例还是多例之Scope

>1.Singleton:表示该Bean是单例模式，在Spring容器中共享一个Bean的实例 

>2.Prototype:每次调用都会新创建一个Bean的实例 

>3.Request:这个是使用在Web中，给每一个http request新建一个Bean实例 

>4.Session:这个同样是使用在Web中，表示给每一个http session新建一个Bean实例 

```java
@Component
@Scope("singleton") // prototype 多例
public class HelloScope {

}
```

## spring资源调用文件注入和EL取值

io工具
```java
<dependency>
    <groupId>commons-io</groupId>
    <artifactId>commons-io</artifactId>
    <version>2.5</version>
</dependency>
```

```java
@Service
public class DemoService1 {
    //注入普通字符串
    @Value("老王")
    private String author;

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }
}
```

### @PropertySource

```java
@Configuration
@ComponentScan("org.sang")
@PropertySource(value = "t.properties",encoding = "UTF-8")
public class ELConfig {
    @Value("I Love You!")
    private String normal;
    @Value("#{systemProperties['os.name']}")
    private String osName;
    @Value("#{systemEnvironment['os.arch']}")
    private String osArch;
    @Value("#{T(java.lang.Math).random()*100}")
    private double randomNumber;
    @Value("#{demoService1.author}")
    private String author;
    @Value("t.txt")
    private Resource testFile;

    @Value("http://www.baidu.com")
    private Resource testUrl;
    @Value("${sang.username}")
    private String su;
    @Value("${sang.password}")
    private String sp;
    @Value("${sang.nickname}")
    private String sn;
    @Autowired
    private Environment environment;

    public void output() {
        try {
            System.out.println(normal);
            System.out.println(osName);
            System.out.println(osArch);
            System.out.println(randomNumber);
            System.out.println(author);
            System.out.println(IOUtils.toString(testFile.getInputStream(),"UTF-8"));
            //访问网址
            System.out.println(IOUtils.toString(testUrl.getInputStream(),"UTF-8"));
            //获取网址
            System.out.println("testUrl.getURL():"+testUrl.getURL());
            System.out.println(su);
            System.out.println(sp);
            System.out.println(sn);
            System.out.println(environment.getProperty("sang.nickname"));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```
使用@PropertySource来指定文件地址，将t.properties注入。在属性上我们可以直接使用@Value来完成注入，可以注入普通的字符串，也可以执行一行Java代码，可以将某一个类的属性值注入，也可以注入一个文件


```java
@Configuration
@ComponentScan("org.sang")
public class MyConfig {
}

public class Main {
    public static void main(String[] args) {
        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(MyConfig.class);
        ELConfig bean = context.getBean(ELConfig.class);
        bean.output();
        context.close();
    }
}
```

## Bean的初始化和销毁
对于Bean的操作，很多情况下不是简单的创建，我们还需要做一些必要的初始化操作，同时，用完了，该销毁的销毁，该释放的释放，这个要怎么实现呢？
总的来说，有两种方式：

```java
1.Java配置方式，我们可以使用@Bean的注解中的initMethod和destroyMethod两个东东，这两个对应xml配置文件中的init-method和destroy-method。
2.使用JSR-250中的注解@PostConstruct和@PreDestroy.
```

```java
<dependency>
    <groupId>javax.annotation</groupId>
    <artifactId>jsr250-api</artifactId>
    <version>1.0</version>
</dependency>

public class BeanWayService {
    public void init() {
        System.out.println("BeanWayService-init()");
    }

    public BeanWayService() {
        System.out.println("BeanWayService-构造方法");
    }
    public void destroy() {
        System.out.println("BeanWayService-destroy()");
    }
}
```
jsr-250

```java
public class JSR250WayService {
    @PostConstruct//构造方法执行之后执行
    public void init() {
        System.out.println("JSR250WayService-init()");
    }

    public JSR250WayService() {
        System.out.println("JSR250WayService-构造方法");
    }
    @PreDestroy//销毁之前执行
    public void destroy() {
        System.out.println("JSR250WayService-destroy()");
    }
}
```
配置bean

```java
@Configuration
public class MyConfig {
//initMethod指定在构造方法执行完成之后执行初始化方法，destroyMethod指定在销毁之前执行destroy方法。
    @Bean(initMethod = "init",destroyMethod = "destroy")
    BeanWayService beanWayService() {
        return new BeanWayService();
    }
    @Bean
    JSR250WayService jsr250WayService() {
        return new JSR250WayService();
    }
}
```
```java
public class Main {
    public static void main(String[] args) {
        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(MyConfig.class);
        BeanWayService beanWayService = context.getBean(BeanWayService.class);
        JSR250WayService jsr250WayService = context.getBean(JSR250WayService.class);
        context.close();
    }
```

## Profile配置切换

```java
public class DemoBean {

    private String content;

    public DemoBean(String content) {
        super();
        this.content = content;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
// profile配置

@Configuration
public class ProfileConfig {
    @Bean
    @Profile("dev")
    public DemoBean devDemoBean() {
        return new DemoBean("dev");
    }

    @Bean
    @Profile("prod")
    public DemoBean prodDemoBean() {
        return new DemoBean("prod");
    }
}

```
当Profile为dev时使用devDemoBean来实例化DemoBean，当Profile为prod时，使用prodDemoBean来实例化DemoBean。

```java
public class Main {
    public static void main(String[] args) {
        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext();
        context.getEnvironment().setActiveProfiles("prod");
        context.register(ProfileConfig.class);
        context.refresh();

        DemoBean bean = context.getBean(DemoBean.class);
        System.out.println(bean.getContent());

        context.close();
    }
}
```
这里还是先获取Spring容器，这不过在获取容器时先不传入配置文件，待我们先将活动的Profile置为prod之后，再设置配置文件，设置成功之后，一定要刷新容器。

## Springboot项目Profile切换开发和生产环境配置

新建开发和生产环境配置文件
application-dev.properties
application-pro.properties
配置application.properties
```java
// 指定当前环境为dev环境
spring.profiles.active=dev
```

## Spring事件传递

有的时候，我们可能希望当一个Bean完成某一项操作的时候，能够通知到其他的Bean，其他Bean收到消息后做出相应的处理。Spring对此也提供了相应的支持，在Spring框架内我们可以很好的完成事件的发送与接收。

### 定义消息载体
```java
public class DemoEvent extends ApplicationEvent{
    private String msg;

    public DemoEvent(Object source, String msg) {
        super(source);
        this.msg = msg;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
```
### 定义事件监听
```java
@Component
public class DemoListener implements ApplicationListener<DemoEvent>{
    public void onApplicationEvent(DemoEvent demoEvent){
        System.out.println(demoEvent.getMsg+"==========");
    }
}
```
### 定义事件发布者
```java
@Component
public class DemoPublish{
    @Autowired
    ApplicationContext applicationContext;
    
    public void publish(String msg){
        applicationContext.publishEvent(new DemoEvent(this,msg));
    }
}
```
### 配置
```java
@Configuration
@ComponentScan("org.shihe")
public class EventConfig{
    
}
```
### 测试运行
```java
public class Main{
    public static void main(String[] args){
      AnnotaionConfigApplicationContext context = new AnnotaionConfigApplicationContext(EventConfig.class);
      DemoPublish demoPublish = context.getBean(DemoPulish.class);
      demoPublish.publish("hello event!!");
      context.close();
    }
}
```


