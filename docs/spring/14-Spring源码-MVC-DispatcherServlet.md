## DispatcherServlet概述

- DispatcherServlet是springMVC的前端控制器，用于拦截这个web应用的所有请求，在web.xml中配置该servlet，使用url-pattern设置为"/",来实现全部拦截。或使用servlet3.0之后的WebApplicationInitializer来配置，在web容器启动这个应用时，创建和初始化DispatcherServlet实例。
- DispatcherServlet的作用：
  	- 1.根据uri信息，找到对应的处理该请求的controller 
  	- 2.处理主题theme、本地化locale、multipart请求 
  	- 3、响应到view视图的映射。   
- 基于以上需求背景，DispatcherServlet需要定义相关的子组件来完成这些功能。由于Spring的ApplicationContext体系结构设计当中是支持层次化的，即整个spring应用包含一个root WebApplicationContext，多个子WebApplicationContext，子WebApplicationContext共享这个root WebApplicationContext。每个DispatcherServlet可以使用一个独立的，只与这个DispatcherServlet实例绑定的WebApplicationContext来创建和管理这些子组件。

