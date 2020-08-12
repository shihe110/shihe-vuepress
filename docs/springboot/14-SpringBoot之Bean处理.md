## SpringBoot之BeanPostProcessor

我们可以通过实现BeanPostProcessor接口，对容器内所有或者部分指定Bean在构造的时候进行对其进行处理。它和@PostConstruct与@PreDestroy不同的是它针对的是IoC容器里所有的Bean。

```
@Component
public class GlobalPostProcessor implements BeanPostProcessor {
    @Override // 初始化之前的处理
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException { 
        System.out.println("----" + beanName + "----");
        System.out.println("----" + beanName.getClass() + "----");
        return bean;
    }

    @Override //初始化之后的处理
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("++++" + beanName + "++++");
        System.out.println("++++" + beanName.getClass() + "++++");
        return bean;
    }
}
```

通过重载postProcessBeforeInitialization和postProcessAfterInitialization方法，所有的Bean在初始化之前会执行postProcessBeforeInitialization里的处理逻辑，在初始化之后会执行postProcessAfterInitialization里的处理逻辑。


如果我们要缩小Processor的处理范围可以通过判断Bean类型来实现：
```js
@Override
public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
    if (bean instanceof LifeService){ //用instanceof减少处理范围
        System.out.println("++++" + beanName + "++++");
        System.out.println("++++" + beanName.getClass() + "++++");
    }
    return bean;
}
```