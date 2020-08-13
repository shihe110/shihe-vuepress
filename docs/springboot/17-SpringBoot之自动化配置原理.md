## SpringBoot之自动化配置原理

### SpringBoot加载自动配

Spring Boot的入口类是一个简单的包含可执行main()方法的Java类，如：
```js
@SpringBootApplication 
public class App {
   public static void main(String[] args) {
      SpringApplication.run(App.class, args);
   }
}
```
这个类就像钥匙一样，打开自动化配置大门。
该类提供了一个类和一个注解。

- SpringApplication类

该类开启了一个容器，即springIOC容器。它在非Web环境中为我们新建一个AnnotationConfigApplicationContext，Web环境中新建AnnotationConfigServletWebServerApplicationContext，响应式Web环境中新建AnnotationConfigReactiveWebServerApplicationContext

- @SpringBootApplication注解

```js
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(
    excludeFilters = {@Filter(
    type = FilterType.CUSTOM,
    classes = {TypeExcludeFilter.class}
), @Filter(
    type = FilterType.CUSTOM,
    classes = {AutoConfigurationExcludeFilter.class}
)}
)
public @interface SpringBootApplication {
  ...
}
```
这个组合注解组合了3个注解：
```js
@SpringBootConfiguration # 配置类-也是一个组合注解，组合了@Configuration 即声明配置类
@EnableAutoConfiguration # 开启自动配注解
@ComponentScan # 提供组件扫描注册bean
```
@SpringBootConfiguration注解-也是一个组合注解，组合了@Configuration 即声明配置类。

@ComponentScan注解提供组件扫描功能。那么自动化配置就只能来自@EnableAutoConfiguration注解。

@SpringBootConfiguration注解定义如下：
```js
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@AutoConfigurationPackage
@Import({AutoConfigurationImportSelector.class})
public @interface EnableAutoConfiguration {
    String ENABLED_OVERRIDE_PROPERTY = "spring.boot.enableautoconfiguration";

    Class<?>[] exclude() default {};

    String[] excludeName() default {};
}
```
@AutoConfigurationPackage注解也是一个组合注解，导入一个注册器。

@Import({AutoConfigurationImportSelector.class})选择导入自动化配置。

AutoConfigurationImportSelector类选择导入哪些自动配置。
```js
public class AutoConfigurationImportSelector implements DeferredImportSelector, BeanClassLoaderAware, ResourceLoaderAware, BeanFactoryAware, EnvironmentAware, Ordered {
    private static final AutoConfigurationImportSelector.AutoConfigurationEntry EMPTY_ENTRY = new AutoConfigurationImportSelector.AutoConfigurationEntry();// 自动化配置列表
    private static final String[] NO_IMPORTS = new String[0];
    private static final Log logger = LogFactory.getLog(AutoConfigurationImportSelector.class);
    private static final String PROPERTY_NAME_AUTOCONFIGURE_EXCLUDE = "spring.autoconfigure.exclude";
    private ConfigurableListableBeanFactory beanFactory;
    private Environment environment;
    private ClassLoader beanClassLoader;
    private ResourceLoader resourceLoader;
    private AutoConfigurationImportSelector.ConfigurationClassFilter configurationClassFilter;//配置类的过滤器
...
```
即该类的作用是选择提供了自动化配置的列表。

该类中的获取自动化配置列表的方法如下：
```js
 protected AutoConfigurationImportSelector.AutoConfigurationEntry getAutoConfigurationEntry(AnnotationMetadata annotationMetadata) {
        if (!this.isEnabled(annotationMetadata)) {
            return EMPTY_ENTRY;
        } else {
            AnnotationAttributes attributes = this.getAttributes(annotationMetadata);
            List<String> configurations = this.getCandidateConfigurations(annotationMetadata, attributes);
            configurations = this.removeDuplicates(configurations);
            Set<String> exclusions = this.getExclusions(annotationMetadata, attributes);
            this.checkExcludedClasses(configurations, exclusions);
            configurations.removeAll(exclusions);
            configurations = this.getConfigurationClassFilter().filter(configurations);
            this.fireAutoConfigurationImportEvents(configurations, exclusions);
            return new AutoConfigurationImportSelector.AutoConfigurationEntry(configurations, exclusions);
        }
    }
```
其中有一个getCandidateConfigurations方法，顾名思义-获取候选配置。
```js
    protected List<String> getCandidateConfigurations(AnnotationMetadata metadata, AnnotationAttributes attributes) {
        List<String> configurations = SpringFactoriesLoader.loadFactoryNames(this.getSpringFactoriesLoaderFactoryClass(), this.getBeanClassLoader());
        Assert.notEmpty(configurations, "No auto configuration classes found in META-INF/spring.factories. If you are using a custom packaging, make sure that file is correct.");
        return configurations;
    }
```
即使用List<String> configurations = SpringFactoriesLoader.loadFactoryNames(this.getSpringFactoriesLoaderFactoryClass(), this.getBeanClassLoader());方法获取配置列表。

而加载的路径位于：META-INF/spring.factories该文件声明了自动化配置的配置项
```js
# Auto Configure
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
...
```

### 如何自动配置[springboot提供的所有自动配置](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#auto-configuration-classes)

例:
```js
@Configuration
@ConditionalOnClass({ EnableAspectJAutoProxy.class, Aspect.class, Advice.class,
      AnnotatedElement.class }) 
@ConditionalOnProperty(prefix = "spring.aop", name = "auto", havingValue = "true", matchIfMissing = true) 
public class AopAutoConfiguration {

   @Configuration
   @EnableAspectJAutoProxy(proxyTargetClass = false)
   @ConditionalOnProperty(prefix = "spring.aop", name = "proxy-target-class", havingValue = "false", matchIfMissing = false)
   public static class JdkDynamicAutoProxyConfiguration {

   }

   @Configuration
   @EnableAspectJAutoProxy(proxyTargetClass = true)
   @ConditionalOnProperty(prefix = "spring.aop", name = "proxy-target-class", havingValue = "true", matchIfMissing = true)
   public static class CglibAutoProxyConfiguration {

   }

}
```
@ConditionalOnClass代表的是@Conditional在OnClassCondition条件下的语义。我们通过语义即可知道该注解的功能，即检测特定的一些类是否都存在于类路径中，当这些类全存在的时候，被注解的类或方法才有效，如果不符合则可视被注解的类或方法不存在。

```js
与@ConditionalOnClass同类的条件注解有如下：

@ConditionalOnBean：只有在指定的一批Bean都已存在容器中有效；
@ConditionalOnMissingBean：只有在指定的一批Bean不存在于容器中才有效；
@ConditionalOnClass：只有在指定的一批类都在当前类路径中有效；
@ConditionalOnMissingClass：只有在指定的一批类都不在当前类路径中有效；
@ConditionalOnProperty：只有当前的配置属性符合条件时有效；
@ConditionalOnResource：只有指定的一批资源在类路径中有效；
@ConditionalOnExpression：只有Spring EL运算结果为true时有效；
@ConditionalOnJava：只有满足支持的Java版本才有效；
@ConditionalOnWebApplication：只有在Web应用时才有效；
@ConditionalOnNotWebApplication：只有在非Web应用时有效；
@ConditionalOnSingleCandidate：只有在指定的一批Bean在容器中已存在且只有一个候选Bean下才有效；
@ConditionalOnCloudPlatform：只在指定的云平台下有效。
```
配置文件之间如果有先后依赖顺序的话，我们可以用@AutoConfigureAfter和@AutoConfigureBefore注解指定配置顺序，也可以通过@AutoConfigureOrder来指定优先级。

Spring Boot自带的自动配置位于spring-boot-autoconfigure-x.x.x.RELEASE.jar的org.springframework.boot.autoconfigure包下以AutoConfiguration结尾的都是自动配置类。

