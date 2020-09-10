## SpringMVC跳转静态资源的处理逻辑

springmvc的入是DispatcherServlet，在web.xml配置请求拦截，作为http请求访问入口。

```xml
<servlet>
    <servlet-name>action</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
    <init-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>classpath:conf/springmvc.xml</param-value>
    </init-param>
    <load-on-startup>2</load-on-startup>
</servlet>

<servlet-mapping>
	<servlet-name>springmvc</servlet-name>
    <url-pattern>/</url-pattern>
</servlet-mapping>
```

springmvc.xml最简配置如下：

```xml
<beans xmlns="http://www.springframework.org/schema/beans"  
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
	xmlns:mvc="http://www.springframework.org/schema/mvc"
	 xmlns:aop="http://www.springframework.org/schema/aop">
	<context:component-scan base-package="xxx.xxx.Contorller"/>
</beans>
```

访问

```java
@Controller
public class HelloController {
    
    @RequestMapping("/hello")
    public String hello(){
        return "index.html";
    }
}
```

报404

原因：没有从HandlerMapping里找到对应的handler进行处理。DispatcherServlet拦截所有请求后，对静态资源index.html的访问也被认为是springmvc的请求，而Controller里没有对应的index.htmlRequestMapping进行处理，就报了404.

---

解决这个问题，需要在springmvc里配置mvc:default-servlet-handler：

```xml
// 增加配置
<mvc:default-servlet-handler />
```

<mvc:default-servlet-handler />配置SimpleUrlHandlerMapping和DefaultServletHttpRequestHandler，当springmvc的请求找不到对应处理时，将请求交给web容器配置的默认servlet（defaultServlet）进行处理。

---

访问还有问题：

问题应该出在：当没有配置mvc:default-servlet-handler时，springmvc.xml里没有配置任何HandlerMapping，所以springmvc会读取默认的配置：

当配置了mvc:default-servlet-handler时，会隐式的配置一个SimpleUrlHandlerMapping和DefaultServletHttpRequestHandler，这个时候就不会去读取默认的配置；

而配置了mvc:default-servlet-handler之后，所有的请求就都交给了web容器defaultServlet去处理了，相当于没有使用springmvc，Controller里的RequestMapping配置全部失效。

---

要解决这个问题，**除了配置mvc:default-servlet-handler还要显式的配置HandlerMapping：**

这里HandlerMapping和HandlerAdapter应该是对应出现的（虽然不是一对一绑定，但两者必须同时至少各有一个），如果只配置了HandlerMapping，没有配置HandlerAdapter，会报找不到HandlerAdapter的错误。

配置RequestMappingHandlerMapping，并且order属性置为1.order属性值越小，表示HandlerMapping的匹配顺序越前。

mvc:default-servlet-handler隐式配置的BeanNameUrlHandlerMapping初始化的order为Integer.MAX_SIZE，所以当配置了handlerMapping，将order置为1后，请求会先和RequestMappingHandlerMapping进行匹配处理，当找不到对应的处理时，才会和mvc:default-servlet-handler的配置匹配，交给DefaultServlet处理。

这样，不管是springmvc的映射请求，还是静态资源html的请求，都能够正确处理了：

---

这里springmvc.xml显示配置HandlerMapping和HandlerAdapter有一种便捷的方式，使用mvc:annotation-driven标签可以替代。

当配置mvc:annotation-driven标签时，隐式的配置**RequestMappingHandlerMapping、RequestMappingHandlerAdapter、ExceptionHandlerExceptionResolver，同时还提供了数据绑定支持，@NumberFormatannotation支持，@DateTimeFormat支持，@Valid支持，读写XML的支持（JAXB，读写JSON的支持（Jackson）等等。**

```xml
<mvc:annotation-driven />
```

