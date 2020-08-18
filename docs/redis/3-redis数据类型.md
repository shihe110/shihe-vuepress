## redis数据类型

Redis支持五种数据类型：string（字符串），hash（哈希），list（列表），set（集合）及zset(sorted set：有序集合)。

- String数据
使用k-v数据模型，且二进制安全，可以存储任何数据。该类型最大存储512MB。

使用set、get来存储和获取数据
例：存key为nm 值为zhangsan的数据
 》set nm "zhangsan"
// 取数据
》get nm
----

- Hash
Redis hash 是一个键值(key=>value)对集合。

Redis hash 是一个 string 类型的 field 和 value 的映射表，hash 特别适合用于存储对象。

```js
redis 127.0.0.1:6379> DEL shihe
redis 127.0.0.1:6379> HMSET shihe field1 "Hello" field2 "World"
"OK"
redis 127.0.0.1:6379> HGET shihe field1
"Hello"
redis 127.0.0.1:6379> HGET shihe field2
"World"

```
实例中我们使用了 Redis HMSET, HGET 命令，HMSET 设置了两个 field=>value 对, HGET 获取对应 field 对应的 value。

每个 hash 可以存储 232 -1 键值对（40多亿）。

- List列表

redis列表是简单字符串列表，按照插入顺序排序。可以从（头-左 尾-右）两边添加元素。

```js
redis 127.0.0.1:6379> DEL shihe
redis 127.0.0.1:6379> lpush shihe redis
(integer) 1
redis 127.0.0.1:6379> lpush shihe mongodb
(integer) 2
redis 127.0.0.1:6379> lpush shihe rabitmq
(integer) 3
redis 127.0.0.1:6379> lrange shihe 0 10
1) "rabitmq"
2) "mongodb"
3) "redis"
redis 127.0.0.1:6379>
``` 
每个列表可存 2^32 - 1 元素 (4294967295, 每个列表可存储40多亿)。

- Set集合
无序集合

sadd 命令
添加一个 string 元素到 key 对应的 set 集合中，成功返回 1，如果元素已经在集合中返回 0。

```js
redis 127.0.0.1:6379> DEL shihe
redis 127.0.0.1:6379> sadd shihe redis
(integer) 1
redis 127.0.0.1:6379> sadd shihe mongodb
(integer) 1
redis 127.0.0.1:6379> sadd shihe rabitmq
(integer) 1
redis 127.0.0.1:6379> sadd shihe rabitmq
(integer) 0
redis 127.0.0.1:6379> smembers shihe

1) "redis"
2) "rabitmq"
3) "mongodb"
```
注意：以上实例中 rabitmq 添加了两次，但根据集合内元素的唯一性，第二次插入的元素将被忽略。

集合中最大的成员数为 2^32 - 1(4294967295, 每个集合可存储40多亿个成员)。

- zset(sorted set：有序集合)
Redis zset 和 set 一样也是string类型元素的集合,且不允许重复的成员。
不同的是每个元素都会关联一个double类型的分数。redis正是通过分数来为集合中的成员进行从小到大的排序。

zset的成员是唯一的,但分数(score)却可以重复。

zadd 命令
添加元素到集合，元素在集合中存在则更新对应score

```js
redis 127.0.0.1:6379> DEL shihe
redis 127.0.0.1:6379> zadd shihe 0 redis
(integer) 1
redis 127.0.0.1:6379> zadd shihe 0 mongodb
(integer) 1
redis 127.0.0.1:6379> zadd shihe 0 rabitmq
(integer) 1
redis 127.0.0.1:6379> zadd shihe 0 rabitmq
(integer) 0
redis 127.0.0.1:6379> > ZRANGEBYSCORE shihe 0 1000
1) "mongodb"
2) "rabitmq"
3) "redis"
```