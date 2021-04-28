### SpringBoot之整合Redis

#### 前提准备

- redis服务

#### 引入依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-test</artifactId>
    <scope>test</scope>
</dependency>
```

#### 配置application.properties

```properties
spring.redis.host=192.168.66.128
spring.redis.database=0
spring.redis.port=6379
spring.redis.password=123# 无pass可以不配置
```

#### 测试

```java
@Autowired
StringRedisTemplate stringRedisTemplate;

@GetMapping("/set")
public void set() {
    ValueOperations<String, String> ops = stringRedisTemplate.opsForValue();
    ops.set("name", "zhangsan");
}
@GetMapping("/get")
public void get() {
    ValueOperations<String, String> ops = stringRedisTemplate.opsForValue();
    System.out.println(ops.get("name"));
}
```

