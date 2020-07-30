## 本篇主要在基于SSM的框架，深入讲解web.xml的配置
web.xml
       每个javaEE项目中都会有，web.xml文件是用来初始化配置信息：比如Welcome页面、servlet、servlet-mapping、filter、listener、启动加载级别等。

     web.xml配置文件内容如下：

 <!DOCTYPE web-app PUBLIC
 "-//Sun Microsystems, Inc.//DTD Web Application 2.3//EN"
 "http://java.sun.com/dtd/web-app_2_3.dtd" >
 
<web-app>
  <display-name>Archetype Created Web Application</display-name>
 
  <!--welcome pages-->
  <welcome-file-list>
    <welcome-file>index.jsp</welcome-file>
  </welcome-file-list>
 
  <!--applicationContext.xml是全局的，应用于多个serverlet，配合listener一起使用-->
  <!-- 如果是监听多个文件，可用‘，’隔开 -->
 
  <context-param>
    <description>配置Spring配置文件路径</description>
    <param-name>contextConfigLocation</param-name>
 
    <param-value>classpath:spring/applicationContext.xml</param-value>
  </context-param>
 
  <!-- 定义SPRING监听器，加载spring -->
  <listener>
    <listener-class>
      org.springframework.web.context.request.RequestContextListener
    </listener-class>
  </listener>
 
  <listener>
    <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
  </listener>
 
  <!--log4j配置文件加载-->
  <context-param>
    <param-name>log4jConfigLocation</param-name>
    <param-value>classpath:log4j.properties</param-value>
  </context-param>
  <!--启动一个watchdog线程每1800秒扫描一下log4j配置文件的变化-->
  <context-param>
    <param-name>log4jRefreshInterval</param-name>
    <param-value>1800000</param-value>
  </context-param>
  <context-param>
    <param-name/>
    <param-value/>
  </context-param>
 
  <!-- 配置Spring字符编码过滤器 -->
  <filter>
    <filter-name>encodingFilter</filter-name>
    <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
    <init-param>
      <param-name>encoding</param-name>
      <param-value>UTF-8</param-value>
    </init-param>
    <init-param>
      <param-name>forceEncoding</param-name>
      <param-value>true</param-value>
    </init-param>
  </filter>
  <filter-mapping>
    <filter-name>encodingFilter</filter-name>
    <url-pattern>/*</url-pattern>
  </filter-mapping>
 
  <!-- Spring MVC 核心控制器 DispatcherServlet 配置开始 -->
  <!--配置springmvc DispatcherServlet-->
  <servlet>
    <servlet-name>springMVC</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
    <init-param>
      <!--Sources标注的文件夹下需要新建一个spring文件夹-->
      <param-name>contextConfigLocation</param-name>
      <!-- 如果是监听多个文件，可用‘，’隔开 -->
      <param-value>classpath:spring/spring-mvc.xml</param-value>
    </init-param>
    <load-on-startup>1</load-on-startup>
    <async-supported>true</async-supported>
  </servlet>
 
  <!-- 拦截设置 -->
  <servlet-mapping>
    <servlet-name>springMVC</servlet-name>
    <!-- 此处可以可以配置成*.do，对应struts的后缀习惯 -->
    <url-pattern>/</url-pattern>
  </servlet-mapping>
  <!-- Spring MVC 核心配置结束 -->
 
  <!-- 激活Tomcat的defaultServlet来处理静态文件 -->
  <servlet-mapping>
    <servlet-name>default</servlet-name>
    <url-pattern>/static/*</url-pattern>
  </servlet-mapping>
 
  <!-- session 时间 -->
  <session-config>
    <session-timeout>30</session-timeout>
  </session-config>
 
</web-app>
首先介绍一下启动一个项目的整体流程：
 tomcat启动一个WEB项目的时候，WEB容器会去读取它的配置文件web.xml，读取<listener>和<context-param>两个结点。
  紧接着，容器创建一个ServletContext（servlet上下文，全局的），这个web项目的所有部分都将共享这个上下文。可以把ServletContext看成是一个Web应用的服务器端组件的共享内存，在ServletContext中可以存放共享数据。ServletContext对象是真正的一个全局对象，凡是web容器中的Servlet都可以访问
容器将<context-param>转换为键值对，并交给servletContext。
 容器创建<listener>中的类实例，创建监听器。 
 

       以上步骤，都是基于web.xml的配置文件进行操作的，现在简单说一下，web.xml文件主要的工作包括两部分：1、web.xml启动spring容器；2、DispathcheServlet的声明；3、其余工作是session过期，字符串编码等
       web.xml中标签的加载顺序：<context-param>  >  <listener> (spring的相关工作)  >  filter >servlet（springmvc的相关工作）

A、web.xml启动spring容器的加载过程：
        读取web.xml中两个节点，<context-param>  >  <listener>，创建ServletContext对象，listener中ContextLoaderListener监听器的作用就是启动Web容器时，监听servletContext对象的变化，获取servletContext对象的<context-param>，来自动装配ApplicationContext的配置信息。

     1） 当我们启动一个WEB项目容器时，容器包括(JBoss,Tomcat等)。首先会去读取web.xml配置文件里的配置，当这一步骤没有出错并且完成之后，项目才能正常的被启动起来。

     2） 启动WEB项目的时候：

       容器首先会去读取web.xml配置文件中的两个节点：

               第一个节点：<context-param> </context-param> ，<context-param>是web应用的资源配置，是wen应用的上下文参数，如数据库连接方式，spring的配置文件路径（application.xml）等，这些键值对都会加入到servletContext对象。

               第二个节点：<listener> </listener>，<listener>可以获取当前该web应用对象，即servletContext对象，获取context-param值，进而获取资源，在web应用启动前操作）  ,listener中ContextLoaderListener监听器的作用就是启动Web容器时，监听servletContext对象的变化，获取servletContext对象的<context-param>，来自动装配ApplicationContext的配置信息。因为它实现了ServletContextListener这个接口，在web.xml配置这个监听器，启动容器时，就会默认执行它实现的方法。



<context-param>元素含有一对参数名和参数值，用作应用的Servlet上下文初始化参数，参数名在整个Web应用中必须是惟一的，在web应用的整个生命周期中上下文初始化参数都存在，任意的Servlet和jsp都可以随时随地访问它。<context-param>用于向 ServletContext 提供键值对。

       监听器<Listener>，它是实现了javax.servlet.ServletContextListener 接口的服务器端程序，它也是随web应用的启动而启动，只初始化一次，随web应用的停止而销毁。主要作用是： listener中ContextLoaderListener监听器的作用就是启动Web容器时，监听servletContext对象的变化，获取servletContext对象的<context-param>，来自动装配ApplicationContext的配置信息。

     3）紧接着，容器创建一个ServletContext(application),这个web项目的所有部分都将共享这个上下文。容器以<context-param></context-param>的name作为键，value作为值，将其转化为键值对，存入ServletContext。ServletContext即代表当前web应用。

     4）容器创建<listener></listener>中的类实例,即创建监听.，listener中ContextLoaderListener监听器的作用就是启动Web容器时，监听servletContext对象的变化，获取servletContext对象的<context-param>，来自动装配ApplicationContext的配置信息。

     5） 监听器中通过contextInitialized(ServletContextEvent args)初始化方法，来获得ServletContext 对象以及context-param值。

                  ServletContext = ServletContextEvent.getServletContext();

                  context-param的值 = ServletContext.getInitParameter("context-param的键");

        6）  拿到这个context-param的值之后,可以在WEB项目还没有完全启动时，进行一些初始化工作，但是最主要的还是自动装配ApplicationContext的配置信息。

        7）   .举例.你可能想在项目启动之前就打开数据库.
           那么这里就可以在<context-param>中设置数据库的连接方式,在监听类中初始化数据库的连接.。这个监听是自己写的一个类,除了初始化方法,它还有销毁方法.用于关闭应用前释放资源.比如说数据库连接的关闭.

 

B、DispathcheServlet的声明（主要是servlet标签的配置,，主要配置springmvc）
         DispatcherServlet是前端控制器设计模式的实现，提供Spring Web MVC的集中访问点（也就是把前端请求分发到目标controller），而且与Spring IoC容器无缝集成，从而可以获得Spring的所有好处。

    DispatcherServlet主要用作职责调度工作，本身主要用于控制流程，主要职责如下：

文件上传解析，如果请求类型是multipart将通过MultipartResolver进行文件上传解析；
通过HandlerMapping，将请求映射到处理器（返回一个HandlerExecutionChain，它包括一个处理器、多个HandlerInterceptor拦截器）；
通过HandlerAdapter支持多种类型的处理器(HandlerExecutionChain中的处理器)；
通过ViewResolver解析逻辑视图名到具体视图实现；
本地化解析；
渲染具体的视图等；
如果执行过程中遇到异常将交给HandlerExceptionResolver来解析。
从以上我们可以看出DispatcherServlet主要负责流程的控制（而且在流程中的每个关键点都是很容易扩展的）。



     web.xml中spring的核心ContextLoaderListener初始化的上下文和springmvc的核心DispatcherServlet初始化的上下文关系：


从图中可以看出：

      ContextLoaderListener初始化的上下文加载的Bean是对于整个应用程序共享的，不管是使用什么表现层技术，一般如DAO层、Service层Bean；

     DispatcherServlet初始化的上下文加载的Bean是只对Spring Web MVC有效的Bean，如Controller、HandlerMapping、HandlerAdapter等等，该初始化上下文应该只加载Web相关组件。

小结：
   1、javaEE项目启动过程：首先加载Spring上下文环境配置文件，然后加载SpringMVC配置文件。
   Spring配置加载过程：
         tomcat服务器启动一个WEB项目的时候，WEB容器会去读取它的配置文件web.xml，然后会读取它的listener和context-param节点，然后紧接着会创建一个ServletContext（servlet上下文，全局的），这个web项目的所有部分都将共享这个上下文，容器将<context-param>转换为键值对，并交给servletContext，<listener>可以获取当前该web应用对象，即servletContext对象，获取context-param值，进而获取资源，在web应用启动前操作）  ,listener中ContextLoaderListener监听器的作用就是启动Web容器时，监听servletContext对象的变化，获取servletContext对象的<context-param>，来自动装配ApplicationContext的配置信息。这样spring的加载过程就完成了。

   SpringMVC配置加载过程：
                  springMVC其实和spring是一样的，但是它不用在程序开始时访问。springMVC的加载过程是通过Servlet节点 。

      Servlet介绍：

        Servlet通常称为服务端小程序，是服务端的程序，用于处理及响应客户的请求。Servlet是一个特殊的Java类，创建Servlet类自动继承HttpServlet。客户端通常只有GET和POST两种请求方式，Servlet为了响应这两种请求，必须重写doGet()和doPost()方法。大部分时候，Servlet对于所有的请求响应都是完全一样的，此时只需要重写service()方法即可响应客户端的所有请求。

       创建Servlet实例有两个时机：

客户端第一次请求某个Servlet时，系统创建该Servlet的实例，大部分Servlet都是这种Servlet；
web应用启动时立即创建Servlet实例，即<load-on-start>1</laod-on-start>
 2、监听器如何进行项目的初始化
         监听器中通过contextInitialized(ServletContextEvent args)初始化方法，来获得ServletContext 对象以及context-param值。

                              ServletContext = ServletContextEvent.getServletContext();

                              context-param的值 = ServletContext.getInitParameter("context-param的键");

       拿到这个context-param的值之后,可以在WEB项目还没有完全启动时，进行一些初始化工作，但是最主要的还是自动装配ApplicationContext的配置信息。

3、spring和springMVC整合后，可以取消掉web.xml中spring的listener配置吗？
如果只有 Spring mvc 的一个 Servlet，listener 可以不用。
 但是如果用了Shiro 等，Shiro 用到的 Spring 的配置必须在 listener 里加载。
 一般 Dao, Service 的 Spring 配置都会在 listener 里加载，因为可能会在多个 Servlet 里用到，因为父子 Context 的可见性问题，防止重复加载所以在 listener 里加载。
4、web.xml中spring的核心ContextLoaderListener初始化的上下文和springmvc的核心DispatcherServlet初始化的上下文关系
      

     ContextLoaderListener初始化的上下文加载的Bean是对于整个应用程序共享的   ：一般如DAO层、Service层Bean；
     DispatcherServlet初始化的上下文加载的Bean是只对Spring Web MVC有效的Bean，如Controller，该初始化上下文应该只加载Web相关组件。

[文章出处](https://blog.csdn.net/qq_35571554/article/details/82385838)