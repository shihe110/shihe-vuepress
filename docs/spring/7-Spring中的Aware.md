## Spring中的Aware

#### Spring中的Aware相关的接口功能描述。

- 1.  Spring中提供了一些以Aware结尾的接口，实现了Aware接口的bean在被初始化之后，可以获取相应的资源。
- 2、 通过Aware接口，可以对Spring相应的资源进行操作(一定要慎重)；
- 3、 为了对Spring进行简单的扩展提供了方便的入口。

以下对Aware相关的部分接口作介绍：ApplicationContextAware和BeanNameAware等进行介绍。

①、ApplicationContextAware：

在实现了这个接口之后，他可以提供对Spring IOC容器的上下文进行操作的功能。声明应用上下文的。

②、BeanNameAware：

提供对BeanName进行操作。

③、 ApplicationEventPublisherAware:

主要用于事件的发布。

④、BeanClassLoadAware：

相关的类加载器。

⑤、BeanFactoryAware：

声明BeanFactory的。

⑥、 BootstrapContextAware：

⑦、 LoadTimeWeaverAware:

---

Spring Aware的目的是为了让bean获得spring容器的服务。

|  名称   | 说明  |
|  ----  | ----  |
| BeanNameAware  | 获得容器中的Bean的名称 |
| BeanFactoryAware  | 获取当前bean factory，这样可以调用容器的服务 |
| ApplicationContextAware*  | 当前的application context，这样可以调用容器的服务 |
| MessageSourceAware  | 获取message source，可以获取文本信息 |
| ApplicationEventPublisherAware  | 获取发布事件 |
| ResourceLoaderAware  | 获得资源加载器，可以获得外部资源文件 |