### Spring中Bean的初始化及销毁操作

在bean的生命周期过程操作的支持，配置方式

- xml配置
- java配置
- 注解配置

xml示例

```xml
<bean id="initBean" class="com.shihe.spring.InitBean"  init-method="init" destory-method="destory"/>
```
#### java@Bean配置

```java
public class InitBean {
    public InitBean() {
        super();
        System.out.println("InitBean的初始化构造方法");
    }
    public void init(){
        System.out.println("Bean初始化操作，init方法");
    }
    public void destory(){
        System.out.println("Bean的销毁操作，destory方法");
    }
}
// 配置类
@Configuration
@ComponentScan(basePackages = "com.shihe.spring")
public class SpringConfig {
    @Bean(initMethod = "init", destroyMethod = "destory")
    InitBean initBean(){
        return new InitBean();
    }
}
// 测试
public class Main {
    public static void main(String[] args) {
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(SpringConfig.class);
        InitBean bean = ctx.getBean(InitBean.class);
        ctx.close();
    }
}
```

#### JSR250注解配置

```java
public class AnnotationBean {
    public AnnotationBean() {
        System.out.println("Annotation Bean 构造方法");
    }
    @PostConstruct
    public void init(){
        System.out.println("@PostConstruct方法调用");
    }
    @PreDestroy
    public void destory(){
        System.out.println("@PreDestory方法调用");
    }
}
// java配置
@Configuration
@ComponentScan(basePackages = "com.shihe.spring")
public class SpringConfig {
    @Bean
    AnnotationBean annotationBean(){
        return new AnnotationBean();
    }
}
// 测试
public class Main {
    public static void main(String[] args) {
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(SpringConfig.class);
        AnnotationBean bean = ctx.getBean(AnnotationBean.class);
        ctx.close();
    }
}
```


