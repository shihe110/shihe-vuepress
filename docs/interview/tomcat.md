## 1.tomcat有几种Connector运行模式及其优化？

- bio：传统的 Java I/O 操作，同步且阻塞 IO。

    - maxThreads=”150”

        Tomcat 使用线程来处理接收的每个请求。这个值表示Tomcat 可创建的最大的线程数。默认值 200。
        可以根据机器的时期性能和内存大小调整，一般可以在 400-500。最大可以在 800 左右。

    - minSpareThreads=”25”
    
        Tomcat 初始化时创建的线程数,默认值 4。如果当前没有空闲线程，且没有超过 maxThreads，一次性创建的空闲线程数量。
        Tomcat 初始化时创建的线程数量也由此值设置。
        
    - maxSpareThreads=”75”
        
        一旦创建的线程超过这个值，Tomcat 就会关闭不再需要的 socket 线程。
        默认值 50。一旦创建的线程超过此数值，Tomcat 会关闭不再需要的线程。线程数可以大致上用 “同时在线人数每秒用户操作次数系统平均操作时间” 来计算。
        
    - acceptCount=”100”
    
        指定当所有可以使用的处理请求的线程数都被使用时，可以放到处理队列中的请求数，超过这个数的请求将不予处理。默认值10。
        如果当前可用线程数为 0，则将请求放入处理队列中。这个值限定了请求队列的大小，超过这个数值的请求将不予处理。
    
    - connectionTimeout=”20000” 
    
        网络连接超时，默认值 20000，单位：毫秒。设置为 0 表示永不超时，这样设置有隐患的。通常可设置为 30000 毫秒。
        
----
- nio：JDK1.4 开始支持，同步阻塞或同步非阻塞 IO。

  指定使用 NIO 模型来接受 HTTP 请求protocol=”org.apache.coyote.http11.Http11NioProtocol” 指定使用 NIO 模型
  来接受 HTTP 请求。默认是 BlockingIO，配置为 protocol=”HTTP/1.1”
  acceptorThreadCount=”2” 使用 NIO 模型时接收线程的数目    
  
----
- aio(nio.2)：JDK7 开始支持，异步非阻塞 IO。
  
  apr：Tomcat 将以 JNI 的形式调用 Apache HTTP 服务器的核心动态链接库来
  处理文件读取或网络传输操作，从而大大地 提高 Tomcat 对静态文件的处理性
  能。
```java
<!--
 <Connector connectionTimeout="20000" port="8000"
protocol="HTTP/1.1" redirectPort="8443" uriEncoding="utf-8"/>
 -->
 <!-- protocol 启用 nio 模式，(tomcat8 默认使用的是 nio)(apr 模式利用系
统级异步 io) -->
 <!-- minProcessors 最小空闲连接线程数-->
 <!-- maxProcessors 最大连接线程数-->
 <!-- acceptCount 允许的最大连接数，应大于等于 maxProcessors-->
 <!-- enableLookups 如果为 true,requst.getRemoteHost 会执行 DNS 查
找，反向解析 ip 对应域名或主机名-->
 <Connector port="8080"
protocol="org.apache.coyote.http11.Http11NioProtocol"
 connectionTimeout="20000"
 redirectPort="8443
 maxThreads=“500”
 minSpareThreads=“100”
 maxSpareThreads=“200”
 acceptCount="200"
 enableLookups="false"
 />
其他配置
maxHttpHeaderSize="8192" http 请求头信息的最大程度，超过此长度的部分
不予处理。一般 8K。
URIEncoding="UTF-8" 指定 Tomcat 容器的 URL 编码格式。
disableUploadTimeout="true" 上传时是否使用超时机制
enableLookups="false"--是否反查域名，默认值为 true。为了提高处理能力，
应设置为 false
compression="on" 打开压缩功能
compressionMinSize="10240" 启用压缩的输出内容大小，默认为 2KB
noCompressionUserAgents="gozilla, traviata" 对于以下的浏览器，不启用
压缩
compressableMimeType="text/html,text/xml,text/javascript,text/css,text/plain"
哪些资源类型需要压缩
```

## 2.tomcat有几种部署方式？

- webapps
- server.xml <Context path="" docBase="d:\myproject"/>
- Catalina  conf/Catalina/localhost下新建xxx.xml文件，xxx为应用名称配置<Context docBase="d:\myproject"/>

## 3.tomcat容器是如何创建servlet类实例的？原理是什么？

当容器启动时，会读取在 webapps 目录下所有的 web 应用中的 web.xml 文
件，然后对 xml 文件进行解析，
并读取 servlet 注册信息。然后，将每个应用中注册的 servlet 类都进行加载，
并通过反射的方式实例化。
（有时候也是在第一次请求时实例化）在 servlet 注册时加上如果为正数，则在
一开始就实例化，
如果不写或为负数，则第一次请求实例化。


## 4.tomcat优化方式？


## 5.tomcat工作模式

## 6.tomcat请求过程

## 7.tomcat的session数目

## 8.jms远程监控

## 9.共享session处理

## 10.垃圾回收策略调优

## 11.内存调优

  
    
