## 获取容器ApplicationContext的几种方式

### 方法一.在初始化时保存bean
```java
ApplicationContext context = new ClassPathXmlApplicationContext("application.xml");
        ApplicationContext con = new FileSystemXmlApplicationContext("application.xml");
```

### 方法二.使用spring提供的工具类获取
```java
// 前提是要获取servletContext
ApplicationContext c = WebApplicationContextUtils.getWebApplicationContext(ServletContext sc);
ApplicationContext ac1 = WebApplicationContextUtils.getRequiredWebApplicationContext(ServletContext sc);
```

### 方法三：继承自抽象类ApplicationObjectSupport
说明：抽象类ApplicationObjectSupport提供getApplicationContext()方法，可以方便的获取到ApplicationContext。
Spring初始化时，会通过该抽象类的setApplicationContext(ApplicationContext context)方法将ApplicationContext 对象注入。

### 方法四：继承自抽象类WebApplicationObjectSupport
说明：类似上面方法，调用getWebApplicationContext()获取WebApplicationContext

### 方法五：实现接口ApplicationContextAware
说明：实现该接口的setApplicationContext(ApplicationContext context)方法，并保存ApplicationContext 对象。
Spring初始化时，会通过该方法将ApplicationContext对象注入。

虽 然，spring提供了后三种方法可以实现在普通的类中继承或实现相应的类或接口来获取spring 的ApplicationContext对象，但是在使用是一定要注意实现了这些类或接口的普通java类一定要在Spring 的配置文件application-context.xml文件中进行配置。否则获取的ApplicationContext对象将为null。

### 方法六:注意一点，在服务器启动时，Spring容器初始化时，不能通过以下方法获取Spring 容器
```
WebApplicationContext wac = ContextLoader.getCurrentWebApplicationContext();
```