## redis入门之配置

### 配置
- 1.命令配置
```js
> CONFIG GET 配置名称

// 例如
> CONFIG GET loglevel

// 通配*获取所有配置
>   CONFIG GET *
```

- 2.配置文件配置
redis.conf文件

### 配置语法
```js
> CONFIG SET 配置项 配置值
// 例如
> CONFIG SET loglevel "notice"
```

### 配置参数
[地址](https://www.runoob.com/redis/redis-conf.html)



Redis 官网：https://redis.io/

Redis 在线测试：http://try.redis.io/

Redis 命令参考：http://doc.redisfans.com/