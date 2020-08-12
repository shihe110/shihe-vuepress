## SpringBoot之Spring注解的工作原理

### 工作原理

注解本身并没有实际功能，只是元数据，用来描述数据，如描述被注解的类、方法、属性、参数、构造函数等。

注解本身没有功能代码，但我们可以通过注解找到我们注解的类、方法、属性、参数等数据，来根据这些数据来实现相应的功能。

## BeanPostPorcessor

BeanPostPorcessor实现中有一类名称为*AnnotationBeanPostProcessor都是针对处理注解的，对容器内标注了指定注解的Bean，进行功能处理。如：

- AutowiredAnnotationBeanPostProcessor：让@Autowired、@Value、@Inject注解起效；
- CommonAnnotationBeanPostProcessor：让@PostConstruct、@PreDestroy注解起效；
- AsyncAnnotationBeanPostProcessor：让@Async或@Asynchronous注解起效；
- ScheduledAnnotationBeanPostProcessor：让@Scheduled注解起效；
- PersistenceAnnotationBeanPostProcessor：让@PersistenceUnit 、 @PersistenceContext注解起效；
- JmsListenerAnnotationBeanPostProcessor：让@JmsListener注解起效。

### 定义一个注解，向bean注入日志框架，实现系统日志

- 1.定义注解@InjectLogger
```js
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface InjectLogger {
}
```
- 2.定义注解的后置处理器InjectLoggerAnnotationBeanPostProcessor即实现BeanPostProcessor接口。
```js
@Component
public class InjectLoggerAnnotationBeanPostPorcessor implements BeanPostProcessor {
    private Class<? extends Annotation> changeAnnotationType; //1

    public InjectLoggerAnnotationBeanPostPorcessor() {
        this.changeAnnotationType = InjectLogger.class; //1
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        ReflectionUtils.doWithFields(bean.getClass(), field -> { //2
            ReflectionUtils.makeAccessible(field); //3
            if(field.isAnnotationPresent(changeAnnotationType)){ //4
                Logger logger = LoggerFactory.getLogger(bean.getClass()); //5
                field.set(bean, logger); //6
            }
        });
        return bean;
    }
}
```
>1.指明当前类处理@InjectLogger注解；  
 2.通过反射机制对类的每个属性（Field）进行处理，第一个参数是Bean的Class，第二参数是入参为Field无返回值的函数接口的Lambda实现；  
 3.通过反射机制让当前属性可访问；  
 4.新建Logger的实例logger  
 5.通过反射将logger值设置到bean实例的当前属性（field）上。  

### 使用注解
```js
@Component
public class DemoLoggerService {
    @InjectLogger
    private Logger log;

    public void doSomething(){
        log.info("通过自定义InjectLoggerAnnotationBeanPostPorcessor让注解@InjectLogger注入Logger对象");
    }
}
```

## BeanFactoryPostProcessor

BeanFactoryPostProcessor是针对Bean的配置元数据（注解等）进行处理操作，而这项工作属于BeanFactory的职责范畴。

- ConfigurationClassPostProcessor：使@PropertySource、@ComponentScan、@Component类、@Configuration、@Bean、@Import和@ImportResource注解起效；

- EventListenerMethodProcessor：使@EventListener注解起效；

我们也通过一个自定义的注解@CustomBean，来自己自动注册Bean，我们的@CustomBean的作用即是配置元数据。

自定义的注解为：

```js
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface CustomBean {
}
```
功能实现BeanFactoryPostProcessor接口：
```js
@Component
public class CustomBeanDefinitionRegistryPostProcessor implements BeanFactoryPostProcessor {

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
        ClassPathBeanDefinitionScanner scanner = new ClassPathBeanDefinitionScanner((BeanDefinitionRegistry) beanFactory); //1
        scanner.addIncludeFilter(new AnnotationTypeFilter(CustomBean.class)); //2
        scanner.scan("top.wisely.springfundamentals.custom_scan"); //3

    }
}
```
- 1.定义一个类路径Bean定义扫描器，它的入参是BeanDefinitionRegistry类型，而ConfigurableListableBeanFactory是它的子类，可强制转换使用，当然我们可以让我们的类直接实现BeanDefinitionRegistryPostProcessor接口，它的方法void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry)直接提供了BeanDefinitionRegistry的对象；
- 2.为扫描器添加包含的注解@CustomBean的过滤器；
- 3.在包top.wisely.springfundamentals.custom_scan下扫描注解；

配置类
```js
@Bean
CommandLineRunner customBeanDefinitionRegistryPostProcessorClr(CustomBeanService customBeanService){
    return args -> {
        customBeanService.doSomething();
    };
}
```

## Aop
我们还可以通过基于AOP来让注解具备功能，通过拦截标注了指定注解的方法或类，然后再建言执行功能代码。如：

- AnnotationTransactionAspect：让@Transactional注解起效；
- AnnotationCacheAspect：让@Cacheable注解起效；

## 组合元注解
Spring的大部分的元注解，我们可以使用元注解到其它的注解，即用元注解（元数据）描述注解，从而使其它的注解具备元注解的功能，一般我们认为组合注解是元注解在新的语义下的特例。

- @Component元注解：@Service、@Repository、@Controller、@Configuration：
```js
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component //组合了@Component注解，具备了声明Bean的能力
public @interface Service {}
```
- @Import元注解：大量的@Enable*注解：
```js
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(AsyncConfigurationSelector.class) //组合了@Import注解，具备了导入配置的能力
public @interface EnableAsync {}
```
- @Conditional元注解：@Profile以及Spring Boot的大量条件注解@ConditionalOn*
```js
@Target({ ElementType.TYPE, ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Conditional(OnClassCondition.class)
public @interface ConditionalOnClass {}
```

