### SpringBoot之处理跨域问题

由于浏览器的同源策略导致跨域问题的出现。前端处理跨域问题的方式：jsonp

Springboot处理跨域问题

- 1、在方法上处理

```java
@GetMapping("/hello")
@CrossOrigin(origins = "http://localhost:8081")// 表示愿意接受origins源的请求
public String hello(){
    return "hello";
}
```

- 2、做全局配置

```java
@Configuration
public class WebMvcConfig implements WebMvcSupport {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:8081")
                .allowedMethods("*")
                .allowedHeaders("*")
                ;
    }
}
```

