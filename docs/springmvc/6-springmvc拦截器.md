## SpringMVC的拦截器interceptor

Servlet提供了filter（过滤器）来预处理和后处理每一个web请求，Spring MVC也提供了Interceptor（拦截器）来预处理和后处理每一个web请求，它的优势是能使用IoC容器的一些功能。Interceptor接口有三个方法：

- preHandle： 在handler执行前；
- postHandle：在handler执行后 ；
- afterCompletion： 在整个请求完成后。

### 自定义springmvc拦截器
自定义拦截器只需实现HandlerInterceptor接口或继承HandlerInterceptorAdapter来定义拦截器。
```js
@Slf4j
public class CustomInterceptor implements HandlerInterceptor {
    private final static String START_TIME = "startTime";
    private final static String PROCESS_TIME = "processTime";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        request.setAttribute(START_TIME, System.currentTimeMillis());
        log.info("preHandle处理中...");
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        long startTime = (long) request.getAttribute(START_TIME);
        long endTime = System.currentTimeMillis();
        request.removeAttribute(START_TIME);
        request.setAttribute(PROCESS_TIME, endTime - startTime);
        log.info("postHandle处理中...");
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        log.info("请求处理时间为：" + request.getAttribute(PROCESS_TIME) + "毫秒");
        request.removeAttribute(PROCESS_TIME);
    }
}
```
我们需要在WebConfiguration中，通过覆盖WebMvcConfigurer接口的方法：addInterceptors()，使用Spring MVC提供的InterceptorRegistry来注册Interceptor：
```js
@Configuration
public class WebConfiguration implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(customInterceptor());
    }

    @Bean
    public CustomInterceptor customInterceptor(){
        return new CustomInterceptor();
    }
}
```