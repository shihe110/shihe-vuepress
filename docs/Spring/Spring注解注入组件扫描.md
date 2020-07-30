## spring中注解注入context:component-scan使用总结

- 标签
```xml
<context:component-scan base-package="com.sparta.trans" use-default-filters="false">  </context:component-scan>
```
在spring配置文件中配置该标签，spring会自动扫描base-package对应的路径或该路径的子包下的java文件，（@Service,@Component,@Repository,@Controller等）
并将这些类注册为bean
注：在注解后加上例如@Component(value=”abc”)时，注册的这个类的bean的id就是adc.

 注：如果配置了<context:component-scan>那么<context:annotation-config/>标签就可以不用在xml中再配置了，因为前者包含了后者。另外<context:annotation-config/>还提供了两个子标签 <context:include-filter>和 <context:exclude-filter>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd">

    <context:component-scan base-package="com.shihe" use-default-filters="false">
        <!--排除controller注册spring-->
        <context:exclude-filter type="annotation" expression="org.springframework.stereotype.Controller"/>
    </context:component-scan>

</beans>
```
这个配置文件中必须声明xmlns:context 这个xml命名空间，在schemaLocation中需要指定schema：

```xml
http://www.springframework.org/schema/context
http://www.springframework.org/schema/context/spring-context-3.0.xsd
```
这个文件中beans根节点下只有一个context:component-scan节点，此节点有两个属性base-package属性告诉spring要扫描的包，use-default-filters=”false”表示不要使用默认的过滤器，此处的默认过滤器，会扫描包含@Service,@Component,@Repository,@Controller注解修饰的类，use-default-filters属性的默认值为true,这就意味着会扫描指定包下标有@Service,@Component,@Repository,@Controller的注解的全部类，并注册成bean。
所以如果仅仅是在配置文件中写<context:component-scan base-package="com.sparta.trans"/> Use-default-filter此时为true时，那么会对base-package包或者子包下所有的java类进行扫描,并把匹配的java类注册成bean。

所以这用情况下可以发现扫描的力度还是挺大的，但是如果你只想扫描指定包下面的Controller，那该怎么办？此时子标签<context:incluce-filter>就可以发挥作用了。如下所示
```xml
<context:component-scan base-package="com.sparta.trans.controller">

        <context:include-filter type="regex" expression="com\.sparta\.trans\.[^.]+(Controller|Service)"/>

                 <!--  <context:include-filter type="annotation" expression="org.springframework.stereotype.Controller"/>  -->
</context:component-scan> 
```
这样就会只扫描base-package指定下的有@Controller下的Java类，并注册成bean

注： context:component-scan节点允许有两个子节点和。filter标签的type和表达式说明如下


类型  | 示例 | 说明
------------- | -------------
annotation  | org.example.SomeAnnotation | 注解类全名
assignable  | org.example.SomeClass | 指定class或interface的全名
aspectj | org.example..*Service+ | AspectJ语法
regex | org.example.Default.* | 正则表达式
custom | org.example.MyTypeFilter | Spring3新增自定义Type，称作org.springframework.core.type.TypeFilter
----

但是因为use-dafault-filter在上面并没有指定，默认就为true，所以当把上面的配置改成如下所示的时候，就会产生与你期望相悖的结果（注意base-package包值得变化）
```xml
<context:component-scan base-package="com.sparta.trans">  

<context:include-filter type="annotation" expression="org.springframework.stereotype.Controller"/>   

</context:component-scan>
```
此时，spring不仅扫描了@Controller，还扫描了指定包所在的子包service包下注解@Service的java类

此时指定的include-filter没有起到作用，只要把use-default-filter设置成false就可以了。这样就可以避免在base-packeage配置多个包名来解决这个问题了。

另外在实际项目开发中我们可以发现在base-package指定的包中有的子包是不含有注解的，所以不用扫描，此时可以指定来进行过滤，说明此包不需要被扫描。所以综上可以看出 use-dafault-filters=”false”的情况下：可以指定不需要扫描的路径来排除扫描这些文件，可以指定需要扫描的路径来进行扫描。但是由于use-dafault-filters的值默认为true，所以这一点在实际使用中还是需要注意一下的。


----

@Service告诉spring容器，这是一个Service类，标识持久层Bean组件，默认情况会自动加载它到spring容器中。
@Autowried注解告诉spring，这个字段需要自动注入
@Scope指定此spring bean的scope是单例
@Repository注解指定此类是一个容器类，是DA层类的实现。标识持久层Bean组件
@Componet：基本注解，标识一个受Spring管理的Bean组件
@Controller:标识表现层Bean组件

context.component-scan节点
base-package属性告诉spring要扫描的包
use-default-filters=”false”表示不要使用默认的过滤器，此处的默认过滤器，会扫描包含Service,Component,Responsitory,Controller注释修饰类。