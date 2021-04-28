### SpringBoot之引入XML配置

#### 在resources目录下新建bean.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean class="org.javaboy.xml.SayHello" id="sayHello"/>
</beans>
```

#### 配置mvc对xml的支持

```java
@Configuration
@ImportResource(locations = "classpath:beans.xml")
public class WebMvcConfig {

}
```

