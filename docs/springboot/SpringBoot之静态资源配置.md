### SpringBoot之静态资源配置

#### 传统ssm环境中的静态资源配置

- springmvc的xml配置

```xml
<mvc:resources mapping="/js/**" location="/js/"/>
<mvc:resources mapping="/css/**" location="/css/"/>
<mvc:resources mapping="/html/**" location="/html/"/>
通配简写
<mvc:resources mapping="/**" location="/"/>
```

- java配置

```java
@Configuration
public class SpringMvcConfig extends WebMvcConfigurationSupport {
    @Override
    protected void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**").addResourceLocations("/");
    }
}
```

#### SpringBoot配置

在 Spring Boot 中，默认情况下，一共有 5 个位置可以放静态资源，5个路径及优先级如下：

```xml
classpath:/META-INF/resources/
classpath:/resources/
classpath:/static/
classpath:/public/
/
```

> 注：/表示，在springboot项目中，默认是没有webapp目录的，如在需要jsp的时候可以添加，/ 就表示webapp目录中的静态资源也不拦截。springboot项目，一般将静态资源放在classpath:/static/目录下，springboot默认会在static目录下寻找静态资源如：http://localhost:8080/hello.png URL中不需要加static，加了反而会报错。springboot默认配置类似在ssm项目中的`<mvc:resources mapping="/**" location="/static/"/>`配置。

- 通过application.properties配置静态资源

  ```properties
  spring.resources.static-locations=classpath:/aaa/
  spring.mvc.static-path-pattern=/**
  ```

- 通过java配置

  ```java
  @Configuration 
  public class WebMVCConfig implements WebMvcConfigurer { 
      @Override 
      public void addResourceHandlers(ResourceHandlerRegistry registry) { 	            registry.addResourceHandler("/**").addResourceLocations("classpath:/aaa/");                                } 
  } 
  ```

  