## SpringBoot之@Enable*

### 开启配置 - @Enable*和@Import

通过@Enable*将会自动对相应的功能进行自动配置。如：@EnableWebMvc、@EnableCaching、@EnableScheduling、@EnableAsync、@EnableWebSocket、EnableJpaRepositories、@EnableTransactionManagement、@EnableJpaAuditing、@EnableAspectJAutoProxy等。

而这开启配置的功能时由@Import注解提供的，@Import注解支持导入如下的配置：

- 直接导入@Configuration配置类；
- 配置类选择器ImportSelector的实现；
- 动态注册器ImportBeanDefinitionRegistrar的实现。
- 混合以上三种

### 直接导入配置类@Configuration
1.定义配置类 2.定义注解并使用@Import导入配置类 3.配置开启
```js
// 定义一个配置类
@Configuration
public class AConfig {
    @Bean
    public String a(){
        return "A";
    }
}
// 定义一个@Enablexxx注解并@Import引入配置类
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(AConfig.class) //直接导入配置类AConfig.class
public @interface EnableA {
}
```
// 配置开启
```js
@EnableA
public class JavaConfig {}
```

### 配置类选择器ImportSelector的实现

1.定义选择器给定配置选择条件 2.定义注解类 3.定义选择配置类 4.配置
```js
public class BSelector implements ImportSelector { //1
    @Override
    public String[] selectImports(AnnotationMetadata importingClassMetadata) { //2 
        AnnotationAttributes attributes =
                AnnotationAttributes.fromMap(
                        importingClassMetadata.getAnnotationAttributes
                                (EnableB.class.getName(), false)); 
        boolean isUppercase = attributes.getBoolean("isUppercase"); //3
        if(isUppercase == true) 
            return new String[]{"io.github.wiselyman.config.BUppercaseConfig"}; //4
        else
            return new String[]{"io.github.wiselyman.config.BLowercaseConfig"}; //5
    }
}

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(BSelector.class) 
public @interface EnableB {

    boolean isUppercase() default true; //isUppercase是用来作为选择条件的
}
// 配置类1
@Configuration
public class BUppercaseConfig {
    @Bean
    public String b(){
        return "B"; //返回一个大写B的Bean的配置
    }
}
// 配置类2
@Configuration
public class BLowercaseConfig {
    @Bean
    public String b(){
        return "b"; //返回一个小写b的Bean的配置
    }
}

// 配置开启
@EnableB // 默认为true 
public class JavaConfig {}

@EnableB(isUppercase = false)// 配置开启条件
public class JavaConfig {}
```

- 选择器要实现ImportSelector接口；
- 实现接口的selectImports方法，参数AnnotationMetadata importClassMetadata是注解使用类（本例为JavaConfig）上@EnableB的元数据信息；
- 通过@EnableB在实际使用中的元数据，获得isUppercase的值；
- 如果isUppercase == true,此时实际使用时是@EnableB或者@EnableB(isUppercase = true)使用BUppercaseConfig提供的配置;
- 若实际使用时@EnableB(isUppercase = false)否则使用BLowercaseConfig提供的配置。

### 使用动态注册器ImportBeanDefinitionRegistrar动态注册bean到容器中

1.定义注册器 2.定义注解类 3.定义
```js
// 注册器
public class CBeanDefinitionRegistrar implements ImportBeanDefinitionRegistrar { //1
    @Override
    public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, //2
                                        BeanDefinitionRegistry registry) { //3
        BeanDefinition bd = BeanDefinitionBuilder.genericBeanDefinition(String.class) //4
                                            .addConstructorArgValue("C") //5
                                            .setScope(BeanDefinition.SCOPE_SINGLETON) //6
                                            .getBeanDefinition(); //7
       registry.registerBeanDefinition("c",bd); //8
    }
}
// 注解
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(CBeanDefinitionRegistrar.class)
public @interface EnableC {
}
// 开启注解
@EnableC
public class JavaConfig {}

``` 
- 1.注册器需实现ImportBeanDefinitionRegistrar接口；
- 2.实现registerBeanDefinitions，参数AnnotationMetadata importClassMetadata是注解使用类（本例为JavaConfig）上@EnableB的元数据信息；
- 3.参数BeanDefinitionRegistry registry是用来注册所有Bean的定义的接口；
- 4.我们可以使用BeanDefinitionBuilder来编程式实现Bean的定义（BeanDefinition），此句定义了一个类型为String的Bean；
- 5.构造String的值是C;
- 6.设置Bean的Scope是singleton；
- 7.获得Bean的定义；
- 8.将Bean注册为名称为c的Bean。

### 混合使用
@Import支持导入配置类的数组，我们可以混合上面三种配置，如我们可以定义一个注解具备上面三个的功能：
```js
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import({AConfig.class, BForABCSelector.class, CBeanDefinitionRegistrar.class})
public @interface EnableABC {
    boolean isUppercase() default true;
}
```
选择器里指定了使用的注解的类，所以要新建一个新选择器：
```js
public class BForABCSelector implements ImportSelector {
    @Override
    public String[] selectImports(AnnotationMetadata importingClassMetadata) {
        AnnotationAttributes attributes =
                AnnotationAttributes.fromMap(
                        importingClassMetadata.getAnnotationAttributes
                                (EnableABC.class.getName(), false)); // 此处使用的是@EnableABC
        boolean isUppercase = attributes.getBoolean("isUppercase");
        if(isUppercase == true)
            return new String[]{"io.github.wiselyman.config.BUppercaseConfig"};
        else
            return new String[]{"io.github.wiselyman.config.BLowercaseConfig"};
    }
}
```
我们在JavaConfig中启用@EnableABC并用CommandLineRunner检验：
```js
// 配置
@EnableABC
public class JavaConfig {}
// 验证
@Bean
CommandLineRunner enableABCClr(String a, String b, String c){
    return args -> {
        System.out.println(a);
        System.out.println(b);
        System.out.println(c);
    };
}
```
