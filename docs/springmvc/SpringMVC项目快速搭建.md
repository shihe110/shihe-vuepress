## springmvc项目快速搭建

SpringMVC提供了DispatcherServlet来开发web应用。
在servlet2.5之前需web.xml配置

```java
	<servlet>
		<servlet-name>action</servlet-name>
		<servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
		<init-param>
			<param-name>contextConfigLocation</param-name>
			<param-value>classpath:conf/app-action.xml</param-value>
		</init-param>
		<load-on-startup>2</load-on-startup>
	</servlet>
```
servlet3.0后，提供了无web.xml配置，实现WebApplicationInitializer接口即可实现web.xml同等配置。


