## SpringBoot应用打包

```xml
<project ...>
    ...
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

无需任何配置，Spring Boot的这款插件会自动定位应用程序的入口Class，我们执行以下Maven命令即可打包：
```xml
$ mvn clean package
```

打包结果
```xml
$ ls
classes
generated-sources
maven-archiver
maven-status
springboot-exec-jar-1.0-SNAPSHOT.jar
springboot-exec-jar-1.0-SNAPSHOT.jar.original
```

其中，springboot-exec-jar-1.0-SNAPSHOT.jar.original是Maven标准打包插件打的jar包，它只包含我们自己的Class，不包含依赖，而springboot-exec-jar-1.0-SNAPSHOT.jar是Spring Boot打包插件创建的包含依赖的jar，可以直接运行：
```xml
$ java -jar springboot-exec-jar-1.0-SNAPSHOT.jar
```

这样，部署一个Spring Boot应用就非常简单，无需预装任何服务器，只需要上传jar包即可。

在打包的时候，因为打包后的Spring Boot应用不会被修改，因此，默认情况下，spring-boot-devtools这个依赖不会被打包进去。但是要注意，使用早期的Spring Boot版本时，需要配置一下才能排除spring-boot-devtools这个依赖：

```
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
    <configuration>
        <excludeDevtools>true</excludeDevtools>
    </configuration>
</plugin>
```

如果不喜欢默认的项目名+版本号作为文件名，可以加一个配置指定文件名：
```xml
<project ...>
    ...
    <build>
        <finalName>awesome-app</finalName>
        ...
    </build>
</project>
```
这样打包后的文件名就是awesome-app.jar。
