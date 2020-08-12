## SpringBoot Bean的生命周期

### bean的初始化和销毁

- 注解配置 @PostConstruct（构造完成后执行）@PreDestory（销毁前执行）
```js
@Service
public class LifeService {

    public LifeService() {
        System.out.println("正在构造");
    }

    @PostConstruct
    public void exeAfterConstruct(){
        System.out.println("在构造完成后执行");
    }

    @PreDestroy
    public void exeBeforeDestroy(){
        System.out.println("在销毁之前执行");
    }
}
```
- java配置 @Bean注解的initMethod和destroyMethod
```js
public class LifeService2 {
    public LifeService2() {
        System.out.println("LifeService2:正在构造");
    }

    public void exeAfterConstruct(){
        System.out.println("LifeService2:在构造完成后执行");
    }

    public void exeBeforeDestroy(){
        System.out.println("LifeService2:在销毁之前执行");
    }
}

@Bean(initMethod = "exeAfterConstruct", destroyMethod = "exeBeforeDestroy")
public LifeService2 lifeService2(){
    return new LifeService2();
}
```
### 延迟初始化 @Lazy

注解了@Lazy，Bean只有在被调用的时候才会被初始化。它可以和@Component类注解或@Bean一起使用

```js
@Service
@Lazy
public class LifeService {}

@Bean(initMethod = "exeAfterConstruct", destroyMethod = "exeBeforeDestroy")
@Lazy
public LifeService2 lifeService2(){}
```

### 依赖顺序 @DependsOn

被依赖bean先初始化

```js
@Bean(initMethod = "exeAfterConstruct", destroyMethod = "exeBeforeDestroy")
@DependsOn("lifeService")
public LifeService2 lifeService2(){
	return new LifeService2();
}
```
----

#### 1.Spring IOC容器可以管理bean的生命周期，Spring允许在bean生命周期内特定的时间点执行指定的任务。

#### 2.Spring IOC容器对bean的生命周期进行管理的过程：

① 通过构造器或工厂方法创建bean实例

② 为bean的属性设置值和对其他bean的引用

③ 调用bean的初始化方法

④ bean可以使用了

⑤ 当容器关闭时，调用bean的销毁方法

#### 3.在配置bean时，通过init-method和destroy-method 属性为bean指定初始化和销毁方法

#### 4.bean的后置处理器

① bean后置处理器允许在调用初始化方法前后对bean进行额外的处理

② bean后置处理器对IOC容器里的所有bean实例逐一处理，而非单一实例。其典型应用是：检查bean属性的正确性或根据特定的标准更改bean的属性。

③ bean后置处理器时需要实现接口：

org.springframework.beans.factory.config.BeanPostProcessor。在初始化方法被调用前后，Spring将把每个bean实例分别传递给上述接口的以下两个方法：

```js
postProcessBeforeInitialization(Object, String)
postProcessAfterInitialization(Object, String)
```

#### 5.添加bean后置处理器后bean的生命周期

①通过构造器或工厂方法创建bean实例

②为bean的属性设置值和对其他bean的引用

③将bean实例传递给bean后置处理器的postProcessBeforeInitialization()方法

④调用bean的初始化方法

⑤将bean实例传递给bean后置处理器的postProcessAfterInitialization()方法

⑥bean可以使用了

⑦当容器关闭时调用bean的销毁方法

## Spring手动注册bean、移除bean、获取bean

```js
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.BeanDefinitionBuilder;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.beans.factory.support.DefaultListableBeanFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * springApplicationContext工具
 */
public class SpringBeanRegisterUtil {
    private static ApplicationContext context=new
            ClassPathXmlApplicationContext("applicationContext.xml");
    private static ConfigurableApplicationContext configurableContext = (ConfigurableApplicationContext) context;
    private static BeanDefinitionRegistry beanDefinitionRegistry = (DefaultListableBeanFactory) configurableContext.getBeanFactory();

    /**
     * 注册bean
     * @param beanId 所注册bean的id
     * @param className bean的className，
     *                     三种获取方式：1、直接书写，如：com.mvc.entity.User
     *                                   2、User.class.getName
     *                                   3.user.getClass().getName()
     */
    public static void registerBean(String beanId,String className) {
        // get the BeanDefinitionBuilder
        BeanDefinitionBuilder beanDefinitionBuilder =
        BeanDefinitionBuilder.genericBeanDefinition(className);
        // get the BeanDefinition
        BeanDefinition beanDefinition=beanDefinitionBuilder.getBeanDefinition();
        // register the bean
        beanDefinitionRegistry.registerBeanDefinition(beanId,beanDefinition);
    }

    /**
     * 移除bean
     * @param beanId bean的id
     */
    public static void unregisterBean(String beanId){
        beanDefinitionRegistry.removeBeanDefinition(beanId);
    }

    /**
     * 获取bean
     * @param name bean的id
     * @param <T>
     * @return
     */
    public static <T> T getBean(String name) {
        return (T) context.getBean(name);
    }
}
```
也可以结合spring的Aware接口获取上下文进而获取bean工程实现bean的手动增删。

## 手动注册bean的几种方式

```js
第一种(ClassPathXmlApplicationContext)
1.此种方式使用传统xml方式启动spring容器(xml里面没有任何配置)

public static void main(String[] args) {
       ClassPathXmlApplicationContext context = new     
      ClassPathXmlApplicationContext("spring/spring.xml");
       // 获取spring bean 工厂 手动注册bean
       context.getBeanFactory().registerSingleton("helloWord", new HelloWord());
       // 启动spring容器
       context.start();

       // 从上下文获取bean
       HelloWord helloWord = context.getBean("helloWord", HelloWord.class);
       System.out.println(helloWord.say());
   }

xml内容

<beans xmlns="http://www.springframework.org/schema/beans"

       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="
http://www.springframework.org/schema/beans
http://www.springframework.org/schema/beans/spring-beans.xsd">
</beans>

第二种(AnnotationConfigApplicationContext)
/** 方法二：AnnotationConfigApplicationContext(Bootstrap.class) **/
AnnotationConfigApplicationContext applicationContext1 = new AnnotationConfigApplicationContext(Bootstrap.class);
DefaultListableBeanFactory beanFactory = (DefaultListableBeanFactory) applicationContext1.getBeanFactory();

第三种：继承BeanDefinitionRegistryPostProcessor
1.创建一个DefinitionRegistryPostProcessor

/**
@Configuration
或
@Component
或
@Bean定义
**/
@Configuration
public class DefinitionRegistryPostProcessor implements BeanDefinitionRegistryPostProcessor {
    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory arg0) 
throws BeansException {

    }

    /**
     * 先执行postProcessBeanDefinitionRegistry方法
     * 在执行postProcessBeanFactory方法
     */
    @Override
    public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) 
        throws BeansException {
        // 第一种 ： 手动注入
        // 注册bean
        registerBean(registry, "hello", HelloWord.class);
        registerBean(registry, "helloWord", HelloWord.class);
    }
/**
注册bean
**/
 private void registerBean(BeanDefinitionRegistry registry, String name, Class<?> beanClass) {
        RootBeanDefinition bean = new RootBeanDefinition(beanClass);
        registry.registerBeanDefinition(name, bean);
    }
}

2.测试能否在spring上下文获取该bean

@SpringBootApplication
public class ApplicationBoot {
    public static void main(String[] args) {
        ApplicationContext applicationContext = SpringApplication.run(ApplicationBoot.class);
        HelloWord helloWord = applicationContext.getBean("hello", HelloWord.class);
        System.out.println(helloWord.say());
    }

第四种：继承ApplicationContextAware
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.support.DefaultListableBeanFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.ConfigurableApplicationContext;

public class SpringContextUtils implements ApplicationContextAware {

    @Override
    public void setApplicationContext(ApplicationContext applicationContext)
            throws BeansException {
    	/** 方法一：继承ApplicationContextAware：获得applicationContext **/
		// 将applicationContext转换为ConfigurableApplicationContext
		ConfigurableApplicationContext configurableApplicationContext = (ConfigurableApplicationContext) applicationContext;
		// 获取bean工厂并转换为DefaultListableBeanFactory
		DefaultListableBeanFactory defaultListableBeanFactory = (DefaultListableBeanFactory) configurableApplicationContext.getBeanFactory();
		
		//defaultListableBeanFactory.registerBeanDefinition(beanName, beanDefinition);
    }

}
```
