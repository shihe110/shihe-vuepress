## Spring配置文件加载

## 案例

```
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-beans</artifactId>
    <version>5.2.6.RELEASE</version>
</dependency>
```

## 新建实体

```
public class User {

    private Integer id;
    private String username;
    private String password;
...
}
```

## xml配置文件
```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean class="com.shihe.bean.User" id="user">
        <property name="id" value="123"></property>
        <property name="username" value="zhangsan"/>
        <property name="password" value="123"/>
    </bean>

</beans>
```

## test

## 文件读取

文件读取在 Spring 中很常见，也算是一个比较基本的功能，而且 Spring 提供的文件加载方式，不仅仅在 Spring 框架中可以使用，我们在项目中有其他文件加载需求也可以使用。

首先，Spring 中使用 Resource 接口来封装底层资源，Resource 接口本身实现自 InputStreamSource 接口：

```
public interface InputStreamSource {
 InputStream getInputStream() throws IOException;
}
public interface Resource extends InputStreamSource {
 boolean exists();
 default boolean isReadable() {
  return exists();
 }
 default boolean isOpen() {
  return false;
 }
 default boolean isFile() {
  return false;
 }
 URL getURL() throws IOException;
 URI getURI() throws IOException;
 File getFile() throws IOException;
 default ReadableByteChannel readableChannel() throws IOException {
  return Channels.newChannel(getInputStream());
 }
 long contentLength() throws IOException;
 long lastModified() throws IOException;
 Resource createRelative(String relativePath) throws IOException;
 @Nullable
 String getFilename();
 String getDescription();

}
```

- InputStreamSource 类只提供了一个 getInputStream 方法，该方法返回一个 InputStream，也就是说，InputStreamSource 会将传入的 File 等资源，封装成一个 InputStream 再重新返回。
- Resource 接口实现了 InputStreamSource 接口，并且封装了 Spring 内部可能会用到的底层资源，如 File、URL 以及 classpath 等。
- exists 方法用来判断资源是否存在。
- isReadable 方法用来判断资源是否可读。
- isOpen 方法用来判断资源是否打开。
- isFile 方法用来判断资源是否是一个文件。
- getURL/getURI/getFile/readableChannel 分别表示获取资源对应的 URL/URI/File 以及将资源转为 ReadableByteChannel 通道。
- contentLength 表示获取资源的大小。
- lastModified 表示获取资源的最后修改时间。
- createRelative 表示根据当前资源创建一个相对资源。
- getFilename 表示获取文件名。
- getDescription 表示在资源出错时，详细打印出出错的文件。

