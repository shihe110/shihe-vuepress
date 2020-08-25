## mybatis标签

- bind标签
```js
// 使用bind标签模糊查询
<select id="selectUserByBind" resultType="com.domain.User" parameterType="com.domain.User">
   <!-- bind 中的 uname 是 com.domain.User 的属性名-->
   <bind name="paran_uname" value="'%' + uname + '%'"/>
      select * from user where uname like #{param_uname}   
</select>
```
- foreach标签
```js
<!--使用foreach元素查询用户信息-->
<select id="selectUserByForeach" resultType="com.po.MyUser" parameterType=
"List">
    select * from user where uid in
    <foreach item="item" index="index" collection="list"
    open="(" separator="," close=")">
        # {item}
    </foreach>
</select>
```
- trim标签
```js
<!--使用trim元素根据条件动态查询用户信息-->
<select id="selectUserByTrim" resultType="com.po.MyUser"parameterType="com.po.MyUser">
    select * from user
    <trim prefix="where" prefixOverrides = "and | or">
        <if test="uname!=null and uname!=''">
            and uname like concat('%',#{uname},'%')
        </if>
        <if test="usex!=null and usex!=''">
            and usex=#{usex}
        </if>
    </trim>
</select>
```
- where标签
```js
<!--使用where元素根据条件动态查询用户信息-->
<select id="selectUserByWhere" resultType="com.po.MyUser" parameterType="com.po.MyUser">
    select * from user
    <where>
        <if test="uname != null and uname ! = ''">
            and uname like concat('%',#{uname},'%')
        </if>
        <if test="usex != null and usex != '' ">
            and usex=#{usex}
        </if >
    </where>
</select>
```
- set标签
```js
// 动态update
<!--使用set元素动态修改一个用户-->
<update id="updateUserBySet" parameterType="com.po.MyUser">     
    update user
    <set>
        <if test="uname!=null">uname=#{uname}</if>
        <if test="usex!=null">usex=#{usex}</if>
    </set>
    where uid=#{uid}
</update>
```
- choose when otherwise标签
```js
<!--使用choose、when、otherwise元素根据条件动态查询用户信息-->
<select id="selectUserByChoose" resultType="com.po.MyUser" parameterType= "com.po.MyUser">
    select * from user where 1=1
    <choose>
        <when test="uname!=null and uname!=''">
            and uname like concat('%',#{uname},'%')
        </when>
        <when test="usex!=null and usex!=''">
            and usex=#{usex}
        </when>
        <otherwise>
            and uid > 10
        </otherwise>
    </choose>
</select>
```
- if标签
```js
<!--使用 if 元素根据条件动态查询用户信息-->
<select id="selectUserByIf" resultType="com.po.MyUser" parameterType="com.po.MyUser">
    select * from user where 1=1
    <if test="uname!=null and uname!=''">
        and uname like concat('%',#{uname},'%')
    </if >
    <if test="usex !=null and usex !=''">
        and usex=#{usex}
    </if >
</select>
```

