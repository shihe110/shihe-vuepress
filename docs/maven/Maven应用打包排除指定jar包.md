### Maven应用打包时-如何排除指定jar包

上线项目时，每次打包都会把一些固定的文件打到war包，如：jar、样式等。如此上传时浪费时间。就需要过滤这些固定文件。
解决方案：
在配置pom文件时可通过 `<packagingIncludes>`或`<packagingExcludes>`参数对最终打包文件实现包含或过滤操作。且支持正则表达式实现过滤规则，多个过滤条件可使用`,`分隔，并支持`*`通配符过滤。
示例1
```xml
# 过滤所有jar包 <packagingExcludes>WEB-INF/lib/*.jar</packagingExcludes>
# 过滤指定jar包 <packagingExcludes>WEB-INF/lib/shihe-conn.jar</packagingExcludes>
<project>
  ...
  <build>
    <plugins>
      <plugin>
        <artifactId>maven-war-plugin</artifactId>
        <version>3.0.0</version>
        <configuration>
          <packagingExcludes>WEB-INF/lib/*.jar</packagingExcludes>
        </configuration>
      </plugin>
    </plugins>
  </build>
  ...
</project>
```
示例2
```xml
# 正则表达式和通配符过滤特定jar
<project>
  ...
  <build>
    <plugins>
      <plugin>
        <artifactId>maven-war-plugin</artifactId>
        <version>2.8.0</version>
        <configuration>
          <packagingExcludes>
            WEB-INF/lib/commons-logging-*.jar,
            %regex[WEB-INF/lib/log4j-(?!over-slf4j).*.jar]
          </packagingExcludes>
        </configuration>
      </plugin>
    </plugins>
  </build>
  ...
</project>
# 排除commons-logging-开头的jar
# 排除log4j-<version>.jar格式的所有jar包（不包括log4j-over-slf4j-<version>.jar这种格式的jar包）

```