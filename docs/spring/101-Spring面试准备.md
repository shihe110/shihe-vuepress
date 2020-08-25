## 1.spring是为解决什么问题产生的？
spring是为解决企业级应用开发的复杂性而创建的。

## 2.spring主要包括哪些方面？
 - IOC/DI
 - aop
 - 事务
 - jdbcTemplate
 

## 3.spring有哪些组件（20个左右）？大致是什么功能？
 - spring-aop 提供aop实现（面向切面编程）
 - spring-aspect 提供aspectj框架的整合
 - spring-bean 提供控制反转基础实现
 - spring-context 是在IOC功能上继续扩展服务
 - spring-context-support 是对spring-context的扩展，提供对三方库的整合
 - spring-core spring核心组件
 - spring-instrument 类工具和类加载器实现
 - spring-expression 对表达式语言的支持
 

## 4.什么是IOC？
控制反转，一种思想，实际上是对一个对象控制权的反转。
即一个对象的创建、初始化、销毁等操作，统统由开发者自己来完成。IOC就是将这些操作交由容器来管理。

## 5.applicationContext接口有哪些实现？
 - ClassPathXmlApplicationContext
 - FileSystemXMLApplicationContext
 - AnnotationConfigApplicationContext
 等

## 6.bean有哪些获取方式？
 - ctx.getBean(name或id)
 - ctx.getBean(class) Class获取-多实例情况下回报找到多个bean的报错

## 7.属性注入的方式？
 - 1.构造注入-通过bean的构造方法注入属性<constructor-arg index="" value=""/>
 - 2.属性注入-<constructor-arg name="" value=""/>
 - set注入-<property name="" value=""/>
 - p名称空间注入 <bean class="org.javaboy.Book" id="book4" p:id="4" p:bookName="西游记" p:price="33"></bean>
 - 外部bean注入
 静态工厂注入-针对外部bean
 ```
 public class OkHttpUtils {
    private static OkHttpClient OkHttpClient;
    public static OkHttpClient getInstance() {
        if (OkHttpClient == null) {
            OkHttpClient = new OkHttpClient.Builder().build();
        }
        return OkHttpClient;
    }
}
<bean class="org.javaboy.OkHttpUtils" factory-method="getInstance" id="okHttpClient"></bean>
 ```
 实例工厂注入-针对外部bean的注入
 ```
 public class OkHttpUtils {
    private OkHttpClient OkHttpClient;
    public OkHttpClient getInstance() {
        if (OkHttpClient == null) {
            OkHttpClient = new OkHttpClient.Builder().build();
        }
        return OkHttpClient;
    }
}
<bean class="org.javaboy.OkHttpUtils" id="okHttpUtils"/>
<bean class="okhttp3.OkHttpClient" factory-bean="okHttpUtils" factory-method="getInstance" id="okHttpClient"></bean>
 ```
 
## 8.复杂属性注入
  - 对象注入
  - 数组注入 array或list
  - map注入 
  - Properties注入-k-v对的注入
  

## 9.bean注入到容器的3种方式？
 - xml注入
 - java配置注入
 - 自动化扫描
 

## 10.java配置bean如何实现？
@Configuration + @Bean("xxx")


## 11.自动化配置如何实现？
 - 组件注解+自动化扫描
```
// 组件注解
@Component
@Repository
@Service
@Controller
// 配置包自动扫描   
@Configuration
@ComponentScan(basePackages = "org.javaboy.javaconfig.service")
public class JavaConfig {
}
// 根据注解扫描-排除了Controller注解的类
@Configuration
@ComponentScan(basePackages = "org.javaboy.javaconfig",useDefaultFilters = true,excludeFilters = {@ComponentScan.Filter(type = FilterType.ANNOTATION,classes = Controller.class)})
public class JavaConfig {
}
```
 - xml配置自动化扫描
 ```
 <context:component-scan base-package="org.javaboy.javaconfig" use-default-filters="true">
    <context:exclude-filter type="annotation" expression="org.springframework.stereotype.Controller"/>
</context:component-scan>
 ```
 - 对象注入 @Autowired
@Resources
@Injected

@Autowired 是根据类型去查找，然后赋值，这就有一个要求，这个类型只可以有一个对象，否则就会报错。@Resources 是根据名称去查找，默认情况下，定义的变量名，就是查找的名称，当然开发者也可以在 @Resources 注解中手动指定。所以，如果一个类存在多个实例，那么就应该使用 @Resources 去注入，如果非常使用 @Autowired，也是可以的，此时需要配合另外一个注解，@Qualifier，在 @Qualifier 中可以指定变量名，两个一起用（@Qualifier 和 @Autowired）就可以实现通过变量名查找到变量。
 
##  12.条件注解@Conditional如何定义条件及使用
 - 实现Condition接口，实现matches方法。
 - 配合@Conditional(xxx.class)

## 13.使用条件注解实现多环境切换？
 - 使用@Profile
 ```
 public class JavaMain {
    public static void main(String[] args) {
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();
        ctx.getEnvironment().setActiveProfiles("dev");
        ctx.register(JavaConfig.class);
        ctx.refresh();
        DataSource ds = (DataSource) ctx.getBean("ds");
        System.out.println(ds);
    }
}
 ```
 
## 14.bean的作用域？
spring容器默认单例模式，可以通过xml设置scope属性或java配置通过@Scope来设置。
scope有四种取值：
singleton（默认）、prototype、request、session 后两个值在web环境下有效。


## 15.bean xml配置中id和name的区别？
指定bean的唯一标识，区别是name可以指定多个用逗号隔开
```
<bean class="org.javaboy.User" name="user,user1,user2,user3" scope="prototype"/>
```

## 16.java和xml混合配置
```
@Configuration
@ImportResource("classpath:applicationContext.xml")
public class JavaConfig {
}
```

## 17.Aware接口的作用？有哪些特点？
感知接口，能够获取感知接口提供的服务和能力。Aware接口是个空接口，有许多实现类，他们的共同特征：1.都以Aware结尾 2.都继承Aware接口 3.都定义了一个set方法。该set方法参数提供感知内容。

## 18.Aware接口有哪些？
 - ApplicationContextAware 获取ApplicationContext容器的能力。
 - BeanClassLoaderAware
 - BeanFactoryAware
 - BeanNameAware
 - EnvirenmentAware
 

## 19.什么是aop?
aop即面向切面编程，是oop思想的一种补充。aop可以在不改变原代码的情况下，动态增强方法的功能。
aop包括几个常见概念：切点、通知、切面、连接点

## 20.aop的实现？
java中aop的实现主要基于动态代理，有两种具体实现即cglib、jdk

## 21.jdk动态代理？
 - 实现InvocationHandler
 - 实现invoke方法
 - Proxy.newProxyInstancec创建代理对象

## 22.spring中aop的通知类型有几种？
5种类型的通知
 - 前置
 - 后置
 - 异常
 - 返回
 - 环绕
 

## 23.xml配置aop
```
<bean class="org.javaboy.aop.LogAspect" id="logAspect"/>
<aop:config>
    <aop:pointcut id="pc1" expression="execution(* org.javaboy.aop.commons.*.*(..))"/>
    <aop:aspect ref="logAspect">
        <aop:before method="before" pointcut-ref="pc1"/>
        <aop:after method="after" pointcut-ref="pc1"/>
        <aop:after-returning method="returing" pointcut-ref="pc1" returning="r"/>
        <aop:after-throwing method="afterThrowing" pointcut-ref="pc1" throwing="e"/>
        <aop:around method="around" pointcut-ref="pc1"/>
    </aop:aspect>
</aop:config>
```

## 24.jdbcTemplate
aop思想封装的jdbc操作工具。
```
@Configuration
public class JdbcConfig(){
    
    @Bean
    DataSource dataSource(){
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        dataSource.setUsername("root");
        dataSource.setPassword("123456")
        dataSource.setUrl("jdbc:mysql://localhost:3306/test01");
        
        return dataSource;
    }
    
    @Bean
    JdbcTemplate jdbcTemplate(){
        return new JdbcTemplate(dataSource());
    }
    
}
```
xml配置
```
<bean class="org.springframework.jdbc.datasource.DriverManagerDataSource" id="dataSource">
    <property name="username" value="root"/>
    <property name="password" value="123"/>
    <property name="url" value="jdbc:mysql:///test01?serverTimezone=Asia/Shanghai"/>
    <property name="driverClassName" value="com.mysql.cj.jdbc.Driver"/>
</bean>
<bean class="org.springframework.jdbc.core.JdbcTemplate" id="jdbcTemplate">
    <property name="dataSource" ref="dataSource"/>
</bean>
```

## 25.事务