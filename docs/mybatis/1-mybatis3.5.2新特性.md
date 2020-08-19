## mybatis3.5.2新特性

时间：2019-7-15

### 新特性
- 支持limit在select、update、delete的应用

- 支持offset在select中的应用

- 支持fetch first的使用
```xml
<select id="getAllPerson" paramterType="map" resultType="map">
    select * from t_person
    <if test="num != null">
        fetch first ${num} rows only
    </if>
</select>
```

- 支持多行插入语法

- 配置数据源时，增加新的属性：defaultNetworkTimeout。

在xml配置中，你可以设置pooled或者unpooled数据源的网络连接超时时间：defaultNetworkTimeout
```xml
<dataSource type="UNPOOLED">
    
    <property name="defaultNetworkTimeout" value="10000"/>
</dataSource>
```
设置数据源池化类型：
unpooled：mybatis会为每个数据库操作创建一个新的连接，并关闭它。
pooled：mybatis会创建一个连接池，在开发或测试中常用该方式。
jndi：mybatis从在应用服务器向配置好的jndi数据源DataSource获取数据库连接。在生产中优先考虑。

- 在provider注解里增加value属性。

- ognl变量名处理问题。

