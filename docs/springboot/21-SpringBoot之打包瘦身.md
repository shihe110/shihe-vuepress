## SpringBoot项目打包瘦身

原理：将项目代码和jar包依赖分开打包，部署时将jar包通过命令载入

## 1.配置

```
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
    <configuration>
        <mainClass>com.warmer.kgmaker.KgmakerApplication</mainClass>
        <layout>ZIP</layout>
        <includes>
           <include>
              要打包的依赖
           </include>
        </includes>
     </configuration>
     <executions>
        <execution>
           <goals>
               <goal>repackage</goal>
           </goals>
        </execution>
     </executions>
</plugin>
```

## 2.命令

```
java -Dloader.path=./xxx/BOOT-INF/lib/ -jar xxx.jar
```

注：第一个xxx是jar包的目录，第二个是代码的可执行jar