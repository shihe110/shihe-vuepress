## Spring概述

spring发展过程

- 第一阶段：xml配置 spring 1.x时代-xml配置bean
- 第二阶段：注解配置 spring 2.x bean注解（@Component @Service等）-基本数据库等配置用xml，业务配置用注解
- 第三阶段：java配置 spring 3.x 提供了java配置能力。spring 4.x和springboot推荐使用java配置。

## 安装jar到本地maven库命令

mvn install:install-file -DgroupId=com.oracle "-DartifactId=ojdbc14" "-Dversion=10.2.0.2.0" "-Dpackaging=jar" "-Dfile=D:\ojdbc14.jar"

## Spring框架四大原则

- 1.使用pojo进行轻量级和最小侵入式开发
- 2.通过依赖注入和基于接口编程实现松耦合
- 3.通过aop和默认习惯进行声明式编程
- 4.使用aop和模板减少模式化代码

## IOC

Spring IOC容器（applicationContext）负责创建bean，并通过容器将功能类bean注入到你需要的bean中。
spring提供使用xml、注解、java配置、groovy配置实现bean的创建和注入。

无论是xml配置、注解配置还是java配置，都被称为配置元数据，所谓元数据集描述数据的数据。
元数据本身不具备任何可执行能力，只能通过外界代码来对这些元数据进行解析后进行一些有意义的操作。
spring容器解析这些配置元数据进行bean的初始化、配置和管理依赖。

### 1.声明bean的注解。
- @Component组件，无明确的角色。
- @Service在service层使用。
- @Repository在dao层使用。
- @Controller在控制层使用（展现层）。

声明名称不同，作用等效，根据需要选用。

### 2.注入bean的注解，一般情况下通用。
- @Autowired：spring注解。
- @Inject：JSR-330提供的注解。
- @Resource：JSR-250提供的注解。

注入bean注解般用在set方法上或者属性上，一般用在属性上。

- @Configuration 声明配置类注解
- @ComponentScan 包扫描注解，扫描1

## java配置

java配置是spring 4.x推荐的配置方式，可以完全替代xml配置。
java配置是通过@Configuration和@Bean来实现的。
- @Configuration声明一个类为配置类，相当于spring的xml配置文件。
- @Bean注解在方法上，声明当前方法的返回值为一个Bean。

配置原则：全局配置使用java配置（数据库配置、mvc配置等），业务bean配置使用注解配置（@Controller等）。

注：只要是spring容器中有的bean，都可以作为参数注入到使用该bean的bean的声明方法参数中。

## AOP

面向切面编程-spring支持AspectJ的注解式切面编程。
- 1.@Aspect声明是一个切面
- 2.@After、@Before、@Around定义advice，可直接将拦截规则（切点）作为参数。
- 3.@After、@Before、@Around参数的拦截规则为切点（PointCut），为使切点复用，可使用@PointCut专门定义拦截规则，然后在@After、@Before、@Around的参数中调用。
- 4.其中符合条件的每一个被拦截处为连接点（joinPoint）。

### 1.基于注解拦截 2.基于方法规则拦截
能够很好的控制拦截粒度和获得更丰富的信息。

- 1.添加aop和aspectj依赖
- 2.编写拦截规则注解
- 3.编写使用注解的被拦截类
- 4.编写使用方法规则被拦截类
- 5.编写切面
- 6.配置类
- 7.运行测试

[示例代码](https://github.com/shihe110/shihe-spring-samples/tree/master/shihe-spring-aop)

### Spring本身aop注解拦截的使用体现：1.事务处理（@Transcation） 2.数据缓存（@Cacheable）