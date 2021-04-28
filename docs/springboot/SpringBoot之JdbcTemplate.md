### SpringBoot之JdbcTemplate相关配置

#### JdbcTemplate是spring提供的对jdbc的封装

```java
@Service
public class UserService {
    @Autowired
    JdbcTemplate jdbcTemplate;

    public Integer addUser(User user) {
        return jdbcTemplate.update("insert into user (username,address) values (?,?);", user.getUsername(), user.getAddress());
    }

    public Integer updateUsernameById(User user) {
        return jdbcTemplate.update("update user set username = ? where id=?;", user.getUsername(), user.getId());
    }

    public Integer deleteUserById(Integer id) {
        return jdbcTemplate.update("delete from user where id=?", id);
    }

    public List<User> getAllUsers() {
        return jdbcTemplate.query("select * from user", new RowMapper<User>() {
            @Override
            public User mapRow(ResultSet resultSet, int i) throws SQLException {
                User user = new User();
                int id = resultSet.getInt("id");
                String username = resultSet.getString("username");
                String address = resultSet.getString("address");
                user.setUsername(username);
                user.setId(id);
                user.setAddress(address);
                return user;
            }
        });
    }
    public List<User> getAllUsers2() {
        return jdbcTemplate.query("select * from user", new BeanPropertyRowMapper<>(User.class));
    }
}
```

#### JdbcTemplate多数据源配置

- 依赖

```xml
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
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>

<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency>
```

- 配置多数据源

```java
@Configuration
public class DataSourceConfig {
    @Bean
    @ConfigurationProperties(prefix = "spring.datasource.one")
    DataSource dataSourceOne(){
        return new DruidDataSourceBuilder().create().build();
    }
    @Bean
    @ConfigurationProperties(prefix = "spring.datasource.two")
    DataSource dataSourceTwo(){
        return new DruidDataSourceBuilder().create().build();
    }
}
```

- 配置多JdbcTemplate

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

- 数据源配置

```properties
spring.datasource.one.type=com.alibaba.druid.pool.DruidDataSource
spring.datasource.one.url=jdbc:mysql://127.0.0.1:3306/shihe1?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.one.username=root
spring.datasource.one.password=123456


spring.datasource.two.type=com.alibaba.druid.pool.DruidDataSource
spring.datasource.two.url=jdbc:mysql://127.0.0.1:3306/shihe2?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.two.username=root
spring.datasource.two.password=123456
```

- 测试

```java
@SpringBootTest
class ShiheSpringbootJdbctwoApplicationTests {

    @Autowired
    @Qualifier("jdbcTemplateOne")
    JdbcTemplate jdbcTemplateOne;

    @Autowired
    @Qualifier("jdbcTemplateTwo")
    JdbcTemplate jdbcTemplateTwo;

    @Test
    void contextLoads() {
        List<User> users = jdbcTemplateOne.query("select * from user", new BeanPropertyRowMapper<User>(User.class));
        for (User user : users) {
            System.out.println(user.toString()+"==================");
        }
        List<User> query = jdbcTemplateTwo.query("select * from user", new BeanPropertyRowMapper<User>(User.class));
        for (User user : query) {
            System.out.println(user.toString()+"---------------------");
        }
    }
}
```

