### Springboot 连接mysql

- 1.创建数据库

  ```sql
  CREATE DATABASE sgd CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  ```

- 2.建表、造数据

  ```sql
  DROP TABLE IF EXISTS `sgd_user`;
  CREATE TABLE `sgd_user`  (
    `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '主键',
    `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL,
    `pass` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT '123456',
    PRIMARY KEY (`id`) USING BTREE
  ) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = Compact;
  
  -- ----------------------------
  -- Records of sgd_user
  -- ----------------------------
  INSERT INTO `sgd_user` VALUES (1, 'zhangsan', '123456');
  INSERT INTO `sgd_user` VALUES (2, 'lisi', '123456');
  ```

- 3.新建springboot项目，添加依赖

  ```xml
  <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-web</artifactId>
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

- 4.配置数据源application.properties

  ```properties
  # 数据库设置
  spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
  spring.datasource.url=jdbc:mysql://localhost:3306/sgd?serverTimezone=UTC&useUnicode=true&characterEncoding=utf8
  spring.datasource.username=root
  spring.datasource.password=******
  ```

- 5.测试

  新建一个restful接口测试

  ```java
  @RestController
  public class IndexController {
      @Autowired
      private JdbcTemplate jdbcTemplate;
  
      @RequestMapping({"/","/index"})
      public List<User> fundETF() throws IOException {
          RowMapper<User> mapper = new BeanPropertyRowMapper<>(User.class);
          List<User> users = jdbcTemplate.query(sql, mapper);
          return users;
      }
  }
  ```

- 6.验证结果

  ![img](https://gitee.com/shihe110/imgBed/raw/master/imgBed/企业微信截图_16125068318763.png)

