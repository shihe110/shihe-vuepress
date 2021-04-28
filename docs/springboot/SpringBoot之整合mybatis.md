### springboot 整合 mybatis

说明：数据库使用mysql数据库表-参考文档-【SpringBoot之整合mysql.md】

#### springboot工程引入依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
<!--mybatis springboot -->
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>2.1.3</version>
</dependency>
```

#### application.properties配置mybatis

```properties
# 数据库设置
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/databaseName?serverTimezone=UTC&useUnicode=true&characterEncoding=utf8
spring.datasource.username=root
spring.datasource.password=123456

# mybatis
# 声明mapper.xml文件位置
mybatis.mapper-locations=classpath:mapper/*.xml
# 声明实体类位置
mybatis.type-aliases-package=com.shihe.pojo
```

#### 编写实体类User

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class User {

    private long id;
    private String name;
    private String pass;
}
```

#### 新建mapper文件夹，声明接口

使用@Mapper注解，不然SpringBoot无法扫描

```java
@Mapper
public interface UserMapper {
    List<User> findAll();
}
```

#### 编写service接口及其实现类

```java
// 接口
public interface UserService {
    List<User> findAll();
}
```

```java
// 实现类
@Service
public class UserServiceImpl implements UserService{
    @Autowired
    private UserMapper userMapper;
    @Override
    public List<User> findAll() {
        return userMapper.findAll();
    }
}
```

#### 编写controller

```java
@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @RequestMapping({"/user"})
    public List<User> findAll(){
        List<User> users = userService.findAll();
        return users;
    }
}
```

#### resources新建mapper文件夹即UserMapper.xml文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.shihe.mapper.UserMapper">
    <select id="findAll" resultType="com.shihe.pojo.User">
        select * from sgd_user;
    </select>
</mapper>
```

#### 启动类配置扫描

```java
@SpringBootApplication
@MapperScan("com.shihe.mapper")
public class SgdJslApplication {
    public static void main(String[] args) {
        SpringApplication.run(SgdJslApplication.class, args);
    }
}
```

#### 测试

```json
[
    {
    "id": 1,
    "name": "zhangsan",
    "pass": "123456"
    },
    {
    "id": 2,
    "name": "lisi",
    "pass": "123456"
    }
]
```

#### pom文件相关配置

```xml
<build>
        <resources>
            <resource>
                <directory>src/main/java</directory>
                <includes>
                    <include>**/*.xml</include>
                </includes>
            </resource>
            <resource>
                <directory>src/main/resources</directory>
            </resource>
        </resources>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
```

#### 多数据源配置

```properties
spring.datasource.one.username=root
spring.datasource.one.password=123456
spring.datasource.one.url=jdbc:mysql://127.0.0.1:3306/shihe1
spring.datasource.one.type=com.alibaba.druid.pool.DruidDataSource

spring.datasource.two.username=root
spring.datasource.two.password=123456
spring.datasource.two.url=jdbc:mysql://127.0.0.1:3306/shihe2
spring.datasource.two.type=com.alibaba.druid.pool.DruidDataSource
```

#### java配置多数据源DataSource

```java
@Configuration
public class DataSourceConfig {

    @Bean
    @ConfigurationProperties(prefix = "spring.datasource.one")
    public DataSource dsOne(){
        return new DruidDataSourceBuilder().create().build();
    }

    @Bean
    @ConfigurationProperties(prefix = "spring.datasource.two")
    public DataSource dsTwo(){
        return new DruidDataSourceBuilder().create().build();
    }
}
```

#### 配置SQLSessionFactory及template

```java
@Configuration
@MapperScan(basePackages = "com.shihe.mapper1",
        sqlSessionFactoryRef = "sqlSessionFactory1",
        sqlSessionTemplateRef = "sqlSessionTemplate1")
public class MybatisConfigOne {
    @Resource(name = "dsOne")
    DataSource dsOne;

    @Bean
    SqlSessionFactory sqlSessionFactory1() {
        SqlSessionFactoryBean bean = new SqlSessionFactoryBean();
        try {
            bean.setDataSource(dsOne);
            return bean.getObject();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @Bean
    SqlSessionTemplate sqlSessionTemplate1() {
        return new SqlSessionTemplate(sqlSessionFactory1());
    }
}

@Configuration
@MapperScan(basePackages = "com.shihe.mapper2",
        sqlSessionFactoryRef = "sqlSessionFactory2", sqlSessionTemplateRef = "sqlSessionTemplate2")
public class MybatisConfigTwo {
    @Resource(name = "dsTwo")
    DataSource dsTwo;

    @Bean
    SqlSessionFactory sqlSessionFactory2() {
        SqlSessionFactoryBean bean = new SqlSessionFactoryBean();
        try {
            bean.setDataSource(dsTwo);
            return bean.getObject();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @Bean
    SqlSessionTemplate sqlSessionTemplate2() {
        return new SqlSessionTemplate(sqlSessionFactory2());
    }
}
```

#### 声明mapper接口

```java
public interface UserMapper1 {
    List<User> getAllUsers();
}

public interface UserMapper2{
    List<User> getAllUsers();
}
```

#### 配置mapper文件

```xml
...
<mapper namespace="com.shihe.mapper1.UserMapper1">
    <select id="getAllUsers" resultType="com.shihe.bean.User">
        select * from user ;
    </select>
</mapper>
...
<mapper namespace="com.shihe.mapper2.UserMapper2">
    <select id="getAllUsers" resultType="com.shihe.bean.User">
        select * from user ;
    </select>
</mapper>
```

