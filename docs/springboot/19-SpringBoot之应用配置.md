## SpringBoot之应用配置（定制配置）

### SpringApplication配置
SpringBoot自动化配置提供了大批的配置，我们还是可以通过SpringApplication类对应用启动进行配置。如下所示：

增加一个监听器
```js
public class MyListener implements ApplicationListener<ApplicationStartingEvent> {
    @Override
    public void onApplicationEvent(ApplicationStartingEvent event) {
        System.out.println("监听到应用启动事件");
    }
}
```
配置
```js
SpringApplication app = new SpringApplication(App.class);
app.setBannerMode(Banner.Mode.OFF); //设置关闭Banner
app.addListeners(new MyListener()); //增加监听器
app.run(args);
```
SpringApplication还支持很多和容器相关的配置，可以通过在SpringApplication的API中查找以set和add开头的方法。

### SpringApplicationBuilder配置

```js
new SpringApplicationBuilder()
      .bannerMode(Banner.Mode.OFF)
  	  .listeners(new MyListener())
      .sources(SpringBootInDepthApplication.class)
      .build(args)
      .run();
```
SpringApplication配置与SpringApplicationBuilder配置是等同的，前者的方法名去掉前缀（set和add）即后者的方法名，符合建造者模式的命名规则，如：setBannerMode()变为bannerMode()。具体有特殊情况请参照API文档。

### 外部配置
外部配置包括：application.properties/命令行/系统环境变量/yaml

这个能力是Environment（Profile、Property）提供的，我们可以通过三种方式来访问Environment中的属性：

- 1.使用@Value注解
- 2.注入Environment的bean
- 3.通过@ConfigurationProperties注解来访问

#### 外部配置源与Environment

Environment包含两部分的内容：Profile和Property
```js
public interface Environment extends PropertyResolver {
   String[] getActiveProfiles();
   String[] getDefaultProfiles();
   boolean acceptsProfiles(Profiles profiles);
}
```
Environment的三个接口方法负责Profile相关内容，而它继承的PropertyResolver接口负责的是对Property的查询。

```js
public interface PropertyResolver {
   boolean containsProperty(String key);
   @Nullable
   String getProperty(String key);
   String getProperty(String key, String defaultValue);
   @Nullable
   <T> T getProperty(String key, Class<T> targetType);
   <T> T getProperty(String key, Class<T> targetType, T defaultValue);
   String getRequiredProperty(String key) throws IllegalStateException;
   <T> T getRequiredProperty(String key, Class<T> targetType) throws IllegalStateException;
   String resolvePlaceholders(String text);
   String resolveRequiredPlaceholders(String text) throws IllegalArgumentException;
}
```
在Environment中每一个配置属性都是PropertySource，多个PropertySource可聚集成PropertySources。

PropertyResolver的实现类PropertySourcesPropertyResolver负责对PropertySources进行查询操作，即Environment可对PropertySources进行查询操作。

Spring不支持YAML文件作为PropertySource，Spring Boot使用YamlPropertySourceLoader来读取YAML文件并获得PropertySource。

在Spring Boot下外部配置属性的加载顺序优先级如下，先列的属性配置优先级高，先列的配置属性可覆盖后列的配置属性。

```js
命令行参数

SPRING_APPLICATION_JSON

ServletConfig 初始化参数

ServletContext 初始化参数

JNDI （java:comp/env）

Java系统属性（System.getProperties() ）

操作系统变量

RandomValuePropertySource 随机值

应用部署jar包外部的application-{profile}.properties/yml

应用部署jar包内部的application-{profile}.properties/yml

应用部署jar包外部的application.properties/yml

应用部署jar包内部的application.properties/yml

@PropertySource

SpringApplication.setDefaultProperties
```

### 容器其他的默认配置
Spring Boot除了给我们做了大量的自动配置以外，还给我们提供了一些默认的容器配置，如：

- 应用监听
```js
上面给我们一个提示：我们也可以通过相同的方法来注册监听器。在当前应用新建resources/META-INF/spring.factories文件，内容加上：
```
- 容器配置
- Environment和应用配置

    