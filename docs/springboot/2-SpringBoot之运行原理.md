## 自动配置原理

查看项目中已启用和未启用的自动配置报告。

### 1.运行jar时增加--debug参数
```java
java -jar xx.jar --debug
```

### 2.在application.properties中设置
```java
debug=true
```

### 3.在IDE中设置
```java
Asrguments中设置VM arguments参数：-Ddebug
```

## SpringBoot运作原理
从@SpringBootApplication注解，这是个组合注解
```
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
```
@EnableAutoCofiguration注解启动自动配置功能，这也是一个组合注解。
```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@AutoConfigurationPackage
@Import({AutoConfigurationImportSelector.class})
public @interface EnableAutoConfiguration {
```
@AutoConfigurationPackage引入一个注册器
@Import({AutoConfigurationImportSelector.class})导入自动配置选择器，
通过SpringFactoryLoader.loadFactoryNames扫描META-INF/spring.factories文件中声明的自动配置类。
```java
    protected List<String> getCandidateConfigurations(AnnotationMetadata metadata, AnnotationAttributes attributes) {
        List<String> configurations = SpringFactoriesLoader.loadFactoryNames(this.getSpringFactoriesLoaderFactoryClass(), this.getBeanClassLoader());
        Assert.notEmpty(configurations, "No auto configuration classes found in META-INF/spring.factories. If you are using a custom packaging, make sure that file is correct.");
        return configurations;
    }
```
## 核心注解
以上的任意一个配置类，一般都有条件注解。
```java
@ConditionalOnBean:当容器里有指定的bean的条件下
@ConditionalOnClass:当类路径下有指定的类的条件下
@ConditionalOnExpression：基于SpringEL表达式作为判断条件
@ConditionalOnJava：基于JVM版本做判断条件
@ConditionalOnJndi：在JNDI存在条件下查找指定位置
@ConditionalOnMissingBean：当容器里没有指定bean的情形下
@ConditionalOnMissingClass：当类路径下没有指定的类的条件下
@ConditionalOnNotWebApplication:当前项目不是web项目的条件下
@ConditionalOnProperty：指定的属性是否有指定值
@ConditionalOnResource：类路径是否有指定值
@ConditionalOnSingleCandidate:当指定的bean在容器中只有一个，或者虽然有多个但是指定首选的bean
@ConditionalOnWebApplication：当前项目是web项目条件下

```

这些注解都是组合了@Conditional元注解的组合注解，使用不同的条件创建不同的bean

