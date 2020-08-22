## springboot环境下spring注册bean的四种方式

- 1.组件注解+包扫描@ComponentScan

    组件注解：  
    @Controller  
    @Service  
    @Repository  
    @Component  
---

- 2.@Configuration + @Bean
使用场景：导入第三方jar包中的组件，将需要的类纳入到spring容器中。

```java
@Configuration
public class ImportConfig{
    @Bean
    public User user(){
        return new User("zhangsan","man");
    }
}
```
----

- 3.@Import导入组件到容器
三种方式：  
    - 3.1 @Import注解，id默认为全类名。
    - 3.2 ImportSelector：实现该接口并返回需要导入的组件的全类名。
    - 3.3 ImportBeanDefinitionRegistrar：实现该接口，手动注册bean到容器中。
 
```java
// @Import方式
@Configuration
@Import({XXXBean.class})
public class ImportConfig{

}
```   
```java
// ImportSelector方式 自定义实现ImportSelector接口类，并返回需要组件
public class CustomImportSelector implements ImportSelector{
    @Override
    public String[] selectImports(AnnotationMetadata importingClassMetadata){
        Set<String> annotaionTypes = importingClassMetadata.getAnnotationTypes();
        return new String[]{"org.shihe.bean.user01","org.shihe.bean.user02"}
    }
}
        

``` 

----

- 4.使用Spring的FactoryBean
    - 4.1 默认获取到的是工厂bean调用getObject创建的对象。
    - 4.2 要获取工厂bean本身，我们需要给id前面加&，&userFactoryBean

```java
public class UserFactoryBean implements FactoryBean<User> {
    @Override
    public User getObject() throws Exception {
        // TODO Auto-generated method stub
        System.out.println("UserFactoryBean...getObject...");
        return new User("User");
    }
 
    @Override
    public Class<?> getObjectType() {
        // TODO Auto-generated method stub
        return User.class;
    }
 
    //是否单例？
    //true：这个bean是单实例，在容器中保存一份
    //false：多实例，每次获取都会创建一个新的bean；
    @Override
    public boolean isSingleton() {
        // TODO Auto-generated method stub
        return true;
    }
}
 
 
public class User {
    public String username;
}
 
 
 
@Configuration
public class ImportConfig {
    /**
     、使用Spring提供的 FactoryBean（工厂Bean）;
     * 		1）、默认获取到的是工厂bean调用getObject创建的对象
     * 		2）、要获取工厂Bean本身，我们需要给id前面加一个&，&userFactoryBean
     */
    @Bean
    public UserFactoryBean userFactoryBean(){
        return new UserFactoryBean();
    }
}
 
 
@RestController
public class ImportDemoController {
 
    @Autowired
    private UserFactoryBean userFactoryBean;
 
    @RequestMapping("/import")
    public String demo() throws Exception {
        String s4 = userFactoryBean.getObject().username;
 
        return "ImportDemo@SpringBoot " + s + " " + s1 + " " + s4;
    }
}
 
 
@SpringBootApplication
public class SpringBootLearningApplication {
 
    public static void main(String[] args) {
        SpringApplication.run(SpringBootLearningApplication.class, args);
 
        AnnotationConfigApplicationContext context =
                new AnnotationConfigApplicationContext(ImportConfig.class);
        ImportDemo importDemo = context.getBean(ImportDemo.class);
        printClassName(context);
       
    }
 
    private static void printClassName(AnnotationConfigApplicationContext annotationConfigApplicationContext){
        String[] beanDefinitionNames = annotationConfigApplicationContext.getBeanDefinitionNames();
        for (int i = 0; i < beanDefinitionNames.length; i++) {
            System.out.println("匹配的类"+beanDefinitionNames[i]);
        }
    }
}
```








  
