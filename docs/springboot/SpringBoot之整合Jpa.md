### SpringBoot之整合Jpa

#### 依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
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
```

#### 配置

```properties
spring.datasource.type=com.alibaba.druid.pool.DruidDataSource
spring.datasource.username=root
spring.datasource.password=123456
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/shihe1?useUnicode=true&characterEncoding=UTF-8&severTimezone=UTC

spring.jpa.show-sql=true
spring.jpa.database=mysql
spring.jpa.database-platform=mysql
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL57Dialect
```

#### java代码示例

实体类

```java
@Entity(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String username;
    private String password;
// 省略get set
}
```

dao接口

```java
public interface UserDao extends JpaRepository<User,Integer> {
    @Query(value = "insert into user (username,password) values (?1,?2)",nativeQuery = true)
    @Modifying
    @Transactional
    Integer addUser(String username,String password);

    @Query(value = "insert into user (username,password) values (:username,:password)", nativeQuery = true)
    @Modifying
    @Transactional
    Integer addUser2(String username,String password);

    User findUserById(Integer id);

    List<User> findUserByIdGreaterThan(Integer id);

    @Query(value = "select * from user where id=(select max(id) from user)", nativeQuery = true)
    User getMaxIdUser();
}
```

测试

```java
@SpringBootTest
class ShiheSpringbootJpaApplicationTests {
    @Autowired
    UserDao userDao;
    @Test
    void contextLoads() {
        User userById = userDao.findUserById(2);
        System.out.println(userById.toString());
    }
    @Test
    void addUser(){
        userDao.addUser("中国移动","123456");
    }

    @Test
    void addUser2(){
        userDao.addUser2("中国联通","123456");
    }
    @Test
    void findUserByIdGreaterThan(){
        List<User> uses = userDao.findUserByIdGreaterThan(3);
        System.out.println(uses.toString());
    }
    @Test
    void getMaxIdUser(){
        User maxIdUser = userDao.getMaxIdUser();
        System.out.println(maxIdUser+"===========================");
    }
}
```

#### Jpa多数据源配置

application.properties

```properties
spring.datasource.one.url=jdbc:mysql://127.0.0.1:3306/shihe1?useUnicode=true&characterEncoding=UTF-8&serverTimezone=UTC
spring.datasource.one.type=com.alibaba.druid.pool.DruidDataSource
spring.datasource.one.username=root
spring.datasource.one.password=123456

spring.datasource.two.url=jdbc:mysql://127.0.0.1:3306/shihe1?useUnicode=true&characterEncoding=UTF-8&serverTimeztwo=UTC
spring.datasource.two.type=com.alibaba.druid.pool.DruidDataSource
spring.datasource.two.username=root
spring.datasource.two.password=123456

spring.jpa.database=mysql
spring.jpa.database-platform=mysql
spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=update
```

java配置

```java
@Configuration
public class DataSourceConfig {

    @Bean
    @ConfigurationProperties(prefix = "spring.datasource.one")
    DataSource dsOne(){
        return DruidDataSourceBuilder.create().build();
    }

    @Bean
    @ConfigurationProperties(prefix = "spring.datasource.two")
    DataSource dsTwo(){
        return DruidDataSourceBuilder.create().build();
    }
}
```

template配置

```java
@Configuration
public class JdbcTemplateConfig {
    @Bean
    JdbcTemplate jdbcTemplateOne(@Qualifier("dataSourceOne") DataSource one){
        return new JdbcTemplate(one);
    }
    @Bean
    JdbcTemplate jdbcTemplateTwo(@Qualifier("dataSourceTwo") DataSource two){
        return new JdbcTemplate(two);
    }
}
```



