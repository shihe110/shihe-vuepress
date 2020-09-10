## SpringMVC5中的三个HandlerMapping

HandlerMapping就做了一件事，将url地址映射到处理handler（handler可以是一个Controller也可以是一个method）。

----

- 1.SimpleUrlHandlerMapping
- 2.BeanNameUrlHandlerMapping
- 3.RequestMappingHandlerMapping(最常用*)  

### 1.SimpleUrlHandlerMapping配置

```xml
<bean id="simpleUrlHandlerMapping" class="org.springframework.web.servlet.handler.SimpleUrlHandlerMapping">
    <property name="order" value="0"/>
    <!--方法1-->
    <property name="mappings">
        <props>
            <prop key="/hello">helloController</prop>
        </props>
    </property>
    <!--方法2-->
    <property name="urlMap">
        <map>
            <entry key="/hello" value-ref="helloController"/>
        </map>
    </property>
    <!--方法3-->
    <property name="mappings">
        <bean class="org.springframework.beans.factory.config.PropertiesFactoryBean">
            <property name="location">
                <value>classpath:spring/urlMapping.properties</value>
            </property>
        </bean>
    </property>
</bean>
```



有三种方式可以配置请求url和处理handler的映射（其中第一种和第三种都是对mapping进行注入，只能同时用一个）。

第一种方法对SimpleUrlHandlerMapping的属性mappings进行注入：

```java
public void setMappings(Properties mappings) {
      CollectionUtils.mergePropertiesIntoMap(mappings, this.urlMap);
}
```

第二种方法对SimpleUrlHandlerMapping的属性urlMap进行注入：

```java
public void setUrlMap(Map<String, ?> urlMap) {
	this.urlMap.putAll(urlMap);
}
```

第三种方法和第一种方法类似，对SimpleUrlHandlerMapping的属性mapping进行注入，采用.properties文件的方式：

```java
public void setMappings(Properties mappings) {
	CollectionUtils.mergePropertiesIntoMap(mappings, this.urlMap);
}
```

```properties
# urlMapping.properties
/hello:helloController
```



写对应的HelloController

Controller必须继承AbstractController或者直接实现Controller接口。

这种方式一个Controller只能处理一个请求url，很少在实际开发中用到，属于springmvc早期版本的实现。

```java
@Controller
public class HelloController extends AbstractController {
    @Override
    protected ModelAndView handleRequestInternal(HttpServletRequest httpServletRequest, 
                                                 HttpServletResponse httpServletResponse) throws Exception {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("hello.html");
        return modelAndView;
    }
}
```

----

### 2.BeanNameUrlHandlerMapping配置

xml配置

```xml
<bean id="beanNameUrlHandlerMapping" class="org.springframework.web.servlet.handler.BeanNameUrlHandlerMapping">
	<property name="order" value="0"/>
</bean>
```

Controller写法:

```java
// 注：bean的名称前必须有'/'，否则无法正确映射。
@Controller("/hello")
public class HelloController extends AbstractController {
    @Override
    protected ModelAndView handleRequestInternal(HttpServletRequest httpServletRequest, 
                                                 HttpServletResponse httpServletResponse) throws Exception {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("hello.html");
        return modelAndView;
    }
}
```

Controller必须继承AbstractController或者直接实现Controller接口。

Controller的bean的名称，就是请求的URL（这里是/test1），相比较SimpleUrlHandlerMapping，省去了手动配置映射的过程，直接对handler的名称进行映射。

---

### 3.RequestMappingHandlerMapping配置

xml配置

```xml
<bean id="requestMappingHandlerMapping" 
      class="org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping">
    <property name="order" value="1"/>
</bean>
```

Controller配置

```java
@Controller
public class HelloController {
    @RequestMapping("/hello")
    public String hello(){
        return "hello.html";
    }
}
```

Controller不需要继承基类或实现接口，需要在方法上添加@RequestMapping注解，RequestMappingHandlerMapping会在初始化时对注解进行解析，将请求映射到方法上。这里一个handler就是一个method，不再是Controller。

这样，使用RequestMappingHandlerMapping就可以将请求URL映射到处理handler了。

---



HandlerMapping的作用就是将请求URL和handler进行一一映射，这个映射的动作是在编译期进行的，可以在**xml里进行配置**，也可以通过**注解进行配置**；

**HandlerMapping在初始化时，会将映射关系提取存储到内存map里**；当请求到来时，根据配置的order属性值的大小，排出优先顺序，从各个HandlerMapping的map里查找到对应的handler，最终交给HandlerAdapter进行调用处理。

