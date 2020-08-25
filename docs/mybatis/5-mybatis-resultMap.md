## mybatis resultMap

- 标签结构
```js
<resultMap id="" type="">
    <constructor><!-- 类再实例化时用来注入结果到构造方法 -->
        <idArg/><!-- ID参数，结果为ID -->
        <arg/><!-- 注入到构造方法的一个普通结果 -->  
    </constructor>
    <id/><!-- 用于表示哪个列是主键 -->
    <result/><!-- 注入到字段或JavaBean属性的普通结果 -->
    <association property=""/><!-- 用于一对一关联 -->
    <collection property=""/><!-- 用于一对多、多对多关联 -->
    <discriminator javaType=""><!-- 使用结果值来决定使用哪个结果映射 -->
        <case value=""/><!-- 基于某些值的结果映射 -->
    </discriminator>
</resultMap>
```
- 任何select语句结果都可以用map存储。
```js
<!-- 查询所有用户信息存到Map中 -->
<select id="selectAllUserMap" resultType="map">
    select * from user
</select>

// 查询所有用户信息存到Map中
List<Map<String, Object>> lmp = userDao.selectAllUserMap();
for (Map<String, Object> map : lmp) {
    System.out.println(map);
}
上述 Map 的 key 是 select 语句查询的字段名（必须完全一样），而 Map 的 value 是查询返回结果中字段对应的值，一条记录映射到一个 Map 对象中。
```

- 使用pojo存储结果
```js
<!--使用自定义结果集类型-->
<resultMap type="com.pojo.MapUser" id="myResult">
    <!-- property 是 com.pojo.MapUser 类中的属性-->
    <!-- column是查询结果的列名，可以来自不同的表-->
    <id property="m_uid" column="uid"/>
    <result property="m_uname" column="uname"/>
    <result property="m_usex" column="usex"/>
</resultMap>

<!-- 使用自定义结果集类型查询所有用户 -->
<select id="selectResultMap" resultMap="myResult">
    select * from user
</select>

// 使用resultMap映射结果集
List<MapUser> listResultMap = userDao.selectResultMap();
for (MapUser myUser : listResultMap) {
    System.out.println(myUser);
}
```



