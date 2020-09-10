## web工程中的web.xml

web工程中web.xml是web容器的配置文件，启动时读取配置信息，非必须。

- web工程中web.xml的加载顺序:ServletContext -> context-param -> listener -> filter-servlet
  - 1.启动web项目时，首先加载配置文件web.xml。读取<listener>和<context-param>
  - 2.创建容器ServletContext（servlet上下文）。
  - 3.容器将<context-param>转换为键值对，并交给servletContext。
  - 容器创建<listener>监听器实例，根据配置的class类路径<listener-class>来创建监听，在监听中会有contextInitialized(ServletContextEvent args)初始化方法，启动Web应用时，系统调用Listener的该方法。
  - 容器读取<filter>信息，实例化过滤器。
  - 到此应用启动工作完成。如果系统中有servlet，则servlet是在第一次发起请求时被实例化，一般不销毁，可以服务于多个用户请求。
  - 如果web.xml中出现了相同的元素，则按照在配置文件中出现的先后顺序来加载。

---

### web.xml详解

- **schema头文件**<web-app></web-app>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app version="2.4" 
    xmlns="http://java.sun.com/xml/ns/j2ee" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://java.sun.com/xml/ns/j2ee 
        http://java.sun.com/xml/ns/j2ee/web-app_2_4.xsd">
</web-app>
```

- **<icon>Web应用图标**

```xml
// 指出IDE和GUI工具用来表示Web应用的大图标和小图标。
<icon>
    <small-icon>/images/app_small.gif</small-icon>
    <large-icon>/images/app_large.gif</large-icon>
</icon>
```

- **<display-name>Web应用名称**

- **<disciption>Web应用描述**

- **<context-param>上下文参数** **【重点**】

  声明应用范围内的初始化参数。它用于向 ServletContext提供键值对，即应用程序上下文信息。我们的listener, filter等在初始化时会用到这些上下文中的信息。在servlet里面可以通过getServletContext().getInitParameter("context/param")得到。

- **<filter>过滤器** **【重点】**

```xml
<!--将一个名字与一个实现javaxs.servlet.Filter接口的类相关联。-->
<filter>
    <filter-name>setCharacterEncoding</filter-name>
    <filter-class>com.myTest.setCharacterEncodingFilter</filter-class>
    <init-param>
        <param-name>encoding</param-name>
        <param-value>UTF-8</param-value>
    </init-param>
</filter>
<filter-mapping>
    <filter-name>setCharacterEncoding</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
```

- **<listener>监听器** 【重点】

```xml
<listener> 
    <listerner-class>com.listener.SessionListener</listener-class> 
</listener>
```

- **<servlet>**

```
<servlet></servlet> 用来声明一个servlet的数据，主要有以下子元素：

<servlet-name></servlet-name> 指定servlet的名称
<servlet-class></servlet-class> 指定servlet的类名称
<jsp-file></jsp-file> 指定web站台中的某个JSP网页的完整路径
<init-param></init-param> 用来定义参数，可有多个init-param。在servlet类中通过getInitParamenter(String name)方法访问初始化参数
<load-on-startup></load-on-startup>指定当Web应用启动时，装载Servlet的次序。当值为正数或零时：Servlet容器先加载数值小的servlet，再依次加载其他数值大的servlet。当值为负或未定义：Servlet容器将在Web客户首次访问这个servlet时加载它。
<servlet-mapping></servlet-mapping> 用来定义servlet所对应的URL，包含两个子元素
<servlet-name></servlet-name> 指定servlet的名称
<url-pattern></url-pattern> 指定servlet所对应的URL
```

```xml
<!-- 基本配置 -->
<servlet>
    <servlet-name>snoop</servlet-name>
    <servlet-class>SnoopServlet</servlet-class>
</servlet>
<servlet-mapping>
    <servlet-name>snoop</servlet-name>
    <url-pattern>/snoop</url-pattern>
</servlet-mapping>
<!-- 高级配置 -->
<servlet>
    <servlet-name>snoop</servlet-name>
    <servlet-class>SnoopServlet</servlet-class>
    <init-param>
        <param-name>foo</param-name>
        <param-value>bar</param-value>
    </init-param>
    <run-as>
        <description>Security role for anonymous access</description>
        <role-name>tomcat</role-name>
    </run-as>
</servlet>
<servlet-mapping>
    <servlet-name>snoop</servlet-name>
    <url-pattern>/snoop</url-pattern>
</servlet-mapping>
```

- <session-config>会话超时配置

　　单位为分钟。

```
<session-config>
    <session-timeout>120</session-timeout>
</session-config>
```

- <mime-mapping>

```
<mime-mapping>
    <extension>htm</extension>
    <mime-type>text/html</mime-type>
</mime-mapping>
```

- <welcome-file-list>欢迎文件页**

```
<welcome-file-list>
    <welcome-file>index.jsp</welcome-file>
    <welcome-file>index.html</welcome-file>
    <welcome-file>index.htm</welcome-file>
</welcome-file-list>
```

- <error-page>错误页面

```
<!-- 1、通过错误码来配置error-page。当系统发生×××错误时，跳转到错误处理页面。 -->
<error-page>
    <error-code>404</error-code>
    <location>/NotFound.jsp</location>
</error-page>
<!-- 2、通过异常的类型配置error-page。当系统发生java.lang.NullException（即空指针异常）时，跳转到错误处理页面。 -->
<error-page>
    <exception-type>java.lang.NullException</exception-type>
    <location>/error.jsp</location>
</error-page>
```

- <jsp-config>设置jsp

```xml
<jsp-config> 包括 <taglib> 和 <jsp-property-group> 两个子元素。其中<taglib> 元素在JSP 1.2 时就已经存在；而<jsp-property-group> 是JSP 2.0 新增的元素。

<jsp-property-group> 元素主要有八个子元素，它们分别为：

<description>：设定的说明 
<display-name>：设定名称 
<url-pattern>：设定值所影响的范围，如： /CH2 或 /*.jsp
<el-ignored>：若为 true，表示不支持 EL 语法 
<scripting-invalid>：若为 true，表示不支持 <% scripting %>语法 
<page-encoding>：设定 JSP 网页的编码 
<include-prelude>：设置 JSP 网页的抬头，扩展名为 .jspf
<include-coda>：设置 JSP 网页的结尾，扩展名为 .jspf

<jsp-config>
    <taglib>
        <taglib-uri>Taglib</taglib-uri>
        <taglib-location>/WEB-INF/tlds/MyTaglib.tld</taglib-location>
    </taglib>
    <jsp-property-group>
        <description>Special property group for JSP Configuration JSP example.</description>
        <display-name>JSPConfiguration</display-name>
        <url-pattern>/jsp/* </url-pattern>
        <el-ignored>true</el-ignored>
        <page-encoding>GB2312</page-encoding>
        <scripting-invalid>true</scripting-invalid>
        <include-prelude>/include/prelude.jspf</include-prelude>
        <include-coda>/include/coda.jspf</include-coda>
    </jsp-property-group>
</jsp-config>
```
