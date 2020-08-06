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