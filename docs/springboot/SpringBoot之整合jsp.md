### SpringBoot之整合jsp

#### 添加依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>javax.servlet.jsp</groupId>
    <artifactId>javax.servlet.jsp-api</artifactId>
    <version>2.3.1</version>
    <scope>provided</scope>
</dependency>
<!--使用jsp引擎，springboot内置tomcat没有此依赖-->
<dependency>
    <groupId>org.apache.tomcat.embed</groupId>
    <artifactId>tomcat-embed-jasper</artifactId>
</dependency>
```

#### 配置mvc视图解析器

方式一:application.properties配置

```properties
spring.mvc.view.prefix=/jsp/
spring.mvc.view.suffix=.jsp
```

方式二：java配置

```java
@Configuration
public class WebMvcConfig extends WebMvcConfigurationSupport {
    /**
     * java配置springmvc视图解析器
     * 也可以在application.properties配置
     *   spring.mvc.view.prefix=/jsp/
     *   spring.mvc.view.suffix=.jsp
     */
    @Override
    protected void configureViewResolvers(ViewResolverRegistry registry) {
        registry.jsp("/jsp/",".jsp");
    }
}
```

#### 建立hello.jsp视图

```jsp
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Title</title>
</head>
<body>
    ${name}: springboot 整合 jsp！！！
</body>
</html>
```

> 在java同级目录下新建webapp/jsp/hello.jsp

#### 验证

```java
@Controller
public class HelloController {
    @RequestMapping("hello")
    public String hello(Model model){
        model.addAttribute("name","zhangsan");
        return "hello";
    }
}
```

