## SpringBoot整合springsecurity

### 配置SpringSecurity依赖
```js
// SpringSecurity依赖
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
// web依赖
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

### 随意编码一个控制器类
添加安全依赖后，框架会自动保护所有接口。
```js
@Controller
public class controller {
    @GetMapping("/hello")
    public String hello(){
        return "Hello Spring Security!!";
    }
}
```

### 启动验证
启动后控制台会打印，springsecurity自动生成的UUID密码
```js
Using generated security password: 58d4bd1f-1aaa-4de3-bd38-f5722c41dd4e
```
默认用户名为：user

现在直接访问：
>http://localhost:8080/hello 

时请求会被SpringSecurity拦截，重定向到
>http://localhost:9000/login

被要求使用用户名密码登陆。

---
### 配置来源
springsecurity的自动化配置来自于：org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration类
并提供了外部配置选项：org.springframework.boot.autoconfigure.security.SecurityProperties类
该类提供了前缀为： prefix = "spring.security"的一系列配置。

如:可以自定义配置用户名和密码
```js
spring.security.user.name=shihe
spring.security.user.password=123456
```
同时springsecurity同时提供了oauth2、reactive、socket、saml2等的支持。可按照需求自行配置。






