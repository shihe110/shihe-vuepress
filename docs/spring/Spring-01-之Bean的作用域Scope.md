### Spring中Bean的作用域Scope

- Singleton
- Prototype
- Request
- Session
- GlobalSession

#### Scope的配置方式

- xml配置
- 注解@Scope配置

#### 注解示例

```java
// @Scope 默认值为：singleton
@Component
@Scope(value="prototype")
public class HelloScope {
}
// java注解配置
@Configuration
@ComponentScan(basePackages = "com.shihe.spring")
public class ScopeConfig {
}
// 测试
public class ScopeMain {
    public static void main(String[] args) {
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(ScopeConfig.class);
        HelloScope helloScope = (HelloScope) ctx.getBean("helloScope");
        HelloScope helloScope1 = (HelloScope) ctx.getBean("helloScope");
        System.out.println("------"+helloScope.equals(helloScope1)+"-------");
    }
}
```

#### xml配置示例

```xml
 <bean id="helloScope" class="com.shihe.spring.HelloScope"  scope="prototype"/>
```

