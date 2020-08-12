## SpringBoot之意识Spring容器Aware

## 意识Spring容器 - Aware
程序员的主要工作是业务逻辑代码的编写，业务逻辑代码一般都是技术无关性的，即Spring代码不会侵入到我们的业务逻辑代码中，虽然我们使用了很多Spring的注解，但注解属于一种元数据（和XML一样），不属于代码侵入的范畴。

但是有些时候我们可能不得不让自己的代码和Spring框架耦合，我们通过实现相应的Aware接口即可注入其对应的Bean。

```js
BeanNameAware：可获得beanName，获得Bean的名称；
ResourceLoaderAware：可获得ResourceLoader，用来加载资源的Bean；
BeanFactoryAware：可获得BeanFactory，容器的父接口，用于管理Bean的相关操作；
EnvironmentAware：可获得Environment，当前应用的运行环境；
MessageSourceAware：可获得MessageSource,用来解析文本信息的Bean；
ApplicationEventPublisherAware：可获得ApplicationEventPublisher，用来发布系统时间的Bean；
ApplicationContextAware：可自动注入ApplicationContext，容器本身。
```
