### SpringBoot之jpa构建rest接口

#### 引入依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-rest</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid-spring-boot-starter</artifactId>
    <version>1.1.10</version>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
    <version>5.1.27</version>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```

#### 配置数据源、jpa、data rest配置

```properties
spring.datasource.username=root
spring.datasource.password=123456
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/javaboy?useUnicode=true&characterEncoding=UTF-8&serverTimezone=UTC
spring.datasource.type=com.alibaba.druid.pool.DruidDataSource

spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL57Dialect
spring.jpa.show-sql=true
spring.jpa.database=mysql
spring.jpa.database-platform=mysql
spring.jpa.hibernate.ddl-auto=update

spring.data.rest.base-path=/api
```

#### 配置jpa rest类

```java
@Configuration
public class RestConfig implements RepositoryRestConfigurer {
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
        config.setDefaultPageSize(2)
                .setBasePath("/shihe");
    }
}
```

#### 实体代码

```java
@Entity(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String username;
    private String password;
```

#### 接口代码

```java
@CrossOrigin
@RepositoryRestResource(path = "bs",collectionResourceRel = "bs",itemResourceRel = "b")
public interface UserDao extends JpaRepository<User, Integer> {

    @RestResource
    List<User> findAll();
}
```

#### 测试

http://localhost:8080/shihe

