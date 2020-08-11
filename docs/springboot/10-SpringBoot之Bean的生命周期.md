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


