## NoSQL数据库

### spring对mongdb的支持

spring对mongdb的支持通过：spring data MongoDB来实现。

- 1.Object和mongo文档对象Document的映射注解支持

| 注解 | 说明 |
| ---- | ---- |
| @Document | 映射领域对象与MongoDB的一个文档 |
| @Id | 映射当前属性是ID |
| @DbRef | 当前属性将参考其他的文档 |
| @Field | 为文档的属性定义名称 |
| @Version | 将当前属性作为版本 |

- 2.MongoTemplate

像JdbcTemplate一样，mongoTemplate提供了数据访问的方法。
我们还需为：MongoClient以及MongoDbFactory来配置数据库连接属性。

- 3.同时提供对Repository的支持。
```java
public interface PersonRepository extends MongoRepository<Person,String>{}
```
配置类：@EnableMongoRepositories

### springboot对mongo的支持

自动化配置：org.springframework.boot.autoconfigure.mongo
自动化配置主要配置了：数据库连接、MongoTemplate
使用前缀：spring.data.mongodb

```java
spring.data.mongodb.host= # 数据库主机地址 默认localhost
spring.data.mongodb.port=27017 # 默认端口27017
spring.data.mongodb.uri=mongodb://localhost/test #connection URL
spring.data.mongodb.repositories.enabled=true # reposity支持是否开启，默认为开启
```

### spring对redis的支持

- 配置
spring通过Spring Data Redis来实现（只针对redis2.6 2.8版本做过测试）。spring data jpa提供了

连接:ConnectionFactory

数据库操作：RedisTemplate
```
ConnectionFactory实现redis客户端：
    - JedisConnectionFactory
    - JredisConnectionFactory
    - LettuceConnectionFactory
    - SrpConnectionFactory
```
 
- 使用

数据操作模板：

    - RedisTemplate
    
    - StringRedisTemplate
    
 访问方法
 
 |  方法   | 说明  |
 |  ----  | ----  |
 | opsForValue() | 操作只有简单属性的数据 |
 | opsForList() | 操作含有list的数据 |
 | opsForSet() | 操作含有set的数据 |
 | opsForZSet() | 操作含有有序set的数据 |
 | opsForHash() | 操作含有hash的数据 |
 
 
- 定义Serializer

当数据存储到redis时，键和值都是通过spring提供的serializer序列化到数据库。
RedisTemplate默认使用的是JdkSerializationRedisSerializer,
StringRedisTempalte默认使用StringRedisSerializer。

spring data jpa提供了一些Serializer：

GenericToStringSerializer、Jackson2JsonRedisSerializer、
JacksonJsonRedisSerializer、JDKSerializerRedisSerializer、
OxmSerializer、StringRedisSerializer

### springboot对redis的支持

包位置：org.springframework.boot.autoconfigure.redis

配置类：RedisAutoConfiguration 默认配置JedisConnectionFactory、RedisTemplate、StringRedisTemplate

RedisProperties配置前缀：spring.redis

```js
spring.redis.database=0 # 数据库名称，默认为db0
spring.redis.host=localhost # 服务器地址，默认为localhost
spring.redis.password= # 数据库密码
spring.redis.port=6379 # 默认端口6379
spring.redis.pool.max-idle=8 # 连接池设置
spring.redis.pool.min-idle=
spring.redis.pool.max-active=8
spring.redis.pool.max-wait=-1
spring.redis.sentinel.master=
spring.redis.sentinel.modes=
spring.redis.timeout=
```




   
    

