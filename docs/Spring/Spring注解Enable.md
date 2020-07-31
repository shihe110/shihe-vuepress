## @Enable*注解的工作原理

@EnableScheduling开始对计划任务的支持
@EnableWebMvc开启对web mvc的支持
@EnableCaching开始注解式缓存的支持等

通过观察这些@Enable*注解的源码，我们发现所有的注解都有一个@Import注解，
@Import是用来导入配置类的，那么这些自动开启的实现是导入了一些自动配置的bean。这些导入的配置方式主要分为三种类型。

## 1.直接导入配置类

```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Import({SchedulingConfiguration.class})
@Documented
public @interface EnableScheduling {
}

@Configuration
@Role(2)
public class SchedulingConfiguration {
    public SchedulingConfiguration() {
    }
    @Bean(
        name = {"org.springframework.context.annotation.internalScheduledAnnotationProcessor"}
    )
    @Role(2)
    public ScheduledAnnotationBeanPostProcessor scheduledAnnotationProcessor() {
        return new ScheduledAnnotationBeanPostProcessor();
    }
}
```
## 2.依据条件选择配置类
```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import({AsyncConfigurationSelector.class})
public @interface EnableAsync {
    Class<? extends Annotation> annotation() default Annotation.class;

    boolean proxyTargetClass() default false;

    AdviceMode mode() default AdviceMode.PROXY;

    int order() default 2147483647;
}

public class AsyncConfigurationSelector extends AdviceModeImportSelector<EnableAsync> {
    private static final String ASYNC_EXECUTION_ASPECT_CONFIGURATION_CLASS_NAME = "org.springframework.scheduling.aspectj.AspectJAsyncConfiguration";

    public AsyncConfigurationSelector() {
    }

    @Nullable
    public String[] selectImports(AdviceMode adviceMode) {
        switch(adviceMode) {
        case PROXY:
            return new String[]{ProxyAsyncConfiguration.class.getName()};
        case ASPECTJ:
            return new String[]{"org.springframework.scheduling.aspectj.AspectJAsyncConfiguration"};
        default:
            return null;
        }
    }
}
```
AsyncConfigurationSelector通过条件来选择需要导入的配置类，该类的根接口为ImportSelector，这个接口需重写selectImports方法，
在此方法内进行条件判断。根据条件返回对应配置类xxxConfiguration。

## 3.动态注册bean

```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import({AspectJAutoProxyRegistrar.class})
public @interface EnableAspectJAutoProxy {
    boolean proxyTargetClass() default false;

    boolean exposeProxy() default false;
}

class AspectJAutoProxyRegistrar implements ImportBeanDefinitionRegistrar {
    AspectJAutoProxyRegistrar() {
    }

    public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, BeanDefinitionRegistry registry) {
        AopConfigUtils.registerAspectJAnnotationAutoProxyCreatorIfNecessary(registry);
        AnnotationAttributes enableAspectJAutoProxy = AnnotationConfigUtils.attributesFor(importingClassMetadata, EnableAspectJAutoProxy.class);
        if (enableAspectJAutoProxy != null) {
            if (enableAspectJAutoProxy.getBoolean("proxyTargetClass")) {
                AopConfigUtils.forceAutoProxyCreatorToUseClassProxying(registry);
            }

            if (enableAspectJAutoProxy.getBoolean("exposeProxy")) {
                AopConfigUtils.forceAutoProxyCreatorToExposeProxy(registry);
            }
        }

    }
}

```
AspectJAutoProxyRegistrar实现了ImportBeanDefinitionRegistrar接口，
该接口的作用是在运行时自动添加bean到已有的配置类，通过重写方法registerBeanDefinitions(AnnotationMetadata importingClassMetadata, BeanDefinitionRegistry registry)

其中，AnnotationMetadata参数用来获取当前配置类上的注解，
BeanDefinitionRegistry参数用来注册Bean。
