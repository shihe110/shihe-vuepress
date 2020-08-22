## SpringBoot之注解相关注解

- @Primary 优先选择bean


- @Qualifire 预选的bean-同类型的多实现选择一个，如数据源，适配器类型的实现类


- @Autowired 自动注入的bean


- @Resource
```java
默认是按照名称来装配注入的，只有当找不到与名称匹配的bean才会按照类型来注入。
它有两个属性是比较重要的:
name: Spring 将 name 的属性值解析为 bean 的名称， 使用 byName 的自动注入策略
type: Spring 将 type的属性值解析为 bean 的类型，使用 byType 的自动注入策略
注: 如果既不指定 name 属性又不指定 type 属性，Spring这时通过反射机制使用 byName 自动注入策略

装配顺序
1. 如果同时指定了 name 属性和 type 属性，那么 Spring 将从容器中找唯一匹配的 bean 进行装配，找不到则抛出异常
2. 如果指定了 name 属性值，则从容器中查找名称匹配的 bean 进行装配，找不到则抛出异常
3. 如果指定了 type 属性值，则从容器中查找类型匹配的唯一的 bean 进行装配，找不到或者找到多个都会抛出异常
4. 如果都不指定，则会自动按照 byName 方式进行装配， 如果没有匹配，则回退一个原始类型进行匹配，如果匹配则自动装配
```

- @ConfigurationProperties和@PropertySource
读取配置文件，有3种方式

    - 1.根路径下
    ```java
    @Component 
    @PropertySource("configDemo.properties")
    @ConfigurationProperties(prefix = "demo")
    public class ConfigDemo{
    }
    ```
 
    - 2.文件夹下 新建config文件夹
    ```java
    @Component 
    @PropertySource("classpath：config/configDemo.properties")
    @ConfigurationProperties(prefix = "demo")
    public class ConfigDemo{
    }
    ```
  
    - 3.application.properties
    ```java
    @Component 
    @ConfigurationProperties(prefix = "demo")
    public class ConfigDemo{
    }
    ```