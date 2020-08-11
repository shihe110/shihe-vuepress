## Spring Bean配置

### 注解配置
```js
@Service、@Repository、@Controller这三个注解组合了@Component注解，都是@Component语义上的特例。

@Component：被注解类是“组件”；
@Controller：被注解类是“控制器”；
@Service：被注解类是“服务”；
@Repository：被注解类是“数据仓库”。
```
spring容器通过@ComponentScan自动扫描注册成受容器管理的bean

### java配置 @Configuration和@Bean

```js
@Configuration
public class JavaConfig {

    @Bean
    public AnotherService anotherService(){
        return new AnotherService("shihe");
    }

}
```
### 依赖注入注解注入@AutoWired


- 可注解在构造函数上
```js
@Service
public class AnnotationInjectionService {
    private SomeService someService;

    private SomeService2 someService2;

    @Autowired
    public AnnotationInjectionService(SomeService someService,SomeService2 someService2) {
        this.someService = someService;
        this.someService2 = someService2;
    }

    public void doMyThing(){
        someService.doSomething();
        someService2.doSomething();
    }
}
```
- 注解在属性上

```js
@Service
public class AnnotationPropertyInjectionService {
    @Autowired
    private SomeService someService;

    @Autowired
    private SomeService2 someService2;


    public void doMyThing(){
        someService.doSomething();
        someService2.doSomething();
    }
}
```

- 注解在set方法上
```js
@Service
public class AnnotationSetterInjectionService {

    private SomeService someService;

    private SomeService2 someService2;

    @Autowired
    public void setSomeService(SomeService someService) {
        this.someService = someService;
    }

    @Autowired
    public void setSomeService2(SomeService2 someService2) {
        this.someService2 = someService2;
    }

    public void doMyThing(){
        someService.doSomething();
        someService2.doSomething();
    }
}
```
注：如果Bean只有一个构造器的话，我们可以直接省略@Autowired注解；若有多个构造器，需注解一个构造器用来注入如：
```js

@Service
public class AnnotationOneInjectionService {
    private SomeService someService;

    public AnnotationOneInjectionService(SomeService someService) {
        this.someService = someService;
    }

    public void doMyThing(){
        someService.doSomething();
    }
}

```
### 依赖注入之-配置注入
- 参数注入
- 构造注入

AnotherService已经注册成@Bean只需在参数里注入该bean即可。
```js
public class JavaConfigInjectService {
    private AnotherService anotherService;

    public JavaConfigInjectService(AnotherService anotherService) {
        this.anotherService = anotherService;
    }

    public void doMyThing(){
        anotherService.doAnotherThing();
    }
}
```


### 依赖注入之-类型注入@Primary
优先注入bean
```js
@Bean
public AnotherService anotherService(){
    return new AnotherService("wyf");
}

@Bean
@Primary
public AnotherService primaryAnotherService(){
		return new AnotherService("foo");
}
```
### 依赖注入之指定注入bean @Qualifier

```js
@Component
public class UseQualifierService {
    @Autowired
    @Qualifier("anotherService") //通过@Qualifier("anotherService")指定使用anotherService
    private AnotherService service;

    public void doSomething(){
        System.out.println("wyf".equals(service.getPerson())); //2
    }
}

@Component
public class UseQualifierService2 {
    private AnotherService service;

    public UseQualifierService2(@Qualifier("primaryAnotherService") AnotherService service) {
        this.service = service;
    }

    public void doSomething(){
        System.out.println("foo".equals(service.getPerson()));
    }

}
```

