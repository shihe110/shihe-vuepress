## Redis学习笔记

mysql数据库引擎发展

- MyISAM - 表锁（早些年的引擎，效率低下）
- innoDB - 行级锁

本质还是一个读和写的问题，发展开始使用分库分表解决写的压力。mysql还推出过表分区技术。

热榜数据、位置数据等（量大，变化快）就不适合mysql类的关系型数据库。图形数据库、json数据。

对于大文件、图片、博客等大数据量的问题：mongo



### 目前一个基本互联网项目的架构：



用户--》企业防火墙或路由网关（负载均衡）--》app服务器

---

为什么用使用nosql

用户信息

地理位置

用户自己的数据

用户日志

---

什么是NoSql（不仅仅是sql）

泛指非关系型数据库

web2.0 视频 音乐 高并发社区、关系型数据库就不能满足需求

---

解耦

方便扩展（数据之间没有关系，方便扩展）

大数据量高性能：redis每秒可以读11万次写8万次，nosql的缓存是记录级别的，是一种细粒度的缓存

数据类型是多样的：（不需要事先设计数据库）







没有固定查询语言

键值对存储、列存储、文档存储、图形数据库

最终一致性



cap定理和base （异地多活）

高性能、高可用、高可扩展

---

大数据：3V + 3高

对问题的描述：（海量、多样、实时）

对程序的基本要求（高并发、高可扩展（动态扩展）、高性能）

```bash
# 1.基础信息
-- RDBMS

# 2.商品描述，评论（文字较多）
- mongodb

# 3.图片
- fastDFS
- TFS
- GFS
- HDFS
- oss

# 4.商品关键字
- solr
- ES
- ISearch

# 5.商品热门信息（秒杀、排行）
- redis
- tair
- memechad

# 6.商品交易，支付接口
- 三方应用
```

大型互联网应用的问题

- 数据类型太多
- 数据源太多
- 数据要改造，大面积改造



--------

Nosql的四大分类

- k-v键值对存储数据库
  - 新浪 redis
  - 美团 redis tair
  - 阿里、百度 redis memecache

- 文档数据库
  - mongodb （分布式文件存储的数据库，c++编写，处理大量文档，介于关系和非关系型数据库的中间产品，最像关系型的非关系型数据库）
  - contchDb

- 列存储数据库
  - HBase
  - 分布式文件系统

- 图关系数据库（存关系）
  - 社交数据关系拓扑
  - neo4j、infoGrid （社交网络、推荐系统、专注于构建关系图谱）

---

## Redis入门

### redis概述

Redis（Remote Dictionary Server）远程字典服务，开源免费、c编写、支持网络、可基于内存也可以持久化的日志型，key-value数据库，并提供多种语言的api。

### redis能干啥？

1、内存存储、持久化（rdb、aof）

2、效率高，高速缓存

3、发布订阅系统

4、地图信息分析

5、计时器、计数器（浏览量）

### 特性

**1、多样数据类型**

Redis支持五种数据类型：string(字符串)、hash(哈希表)、list(列表)、set(集合)、zset(sorted set有序集合)

三种特殊数据类型：bitmaps、hyperloglog、geospatial

**2、持久化**

rdb（快照持久化 redis database）、aof（append only file 日志文件持久化）

**3、集群**

主从复制、哨兵模式、

**4、事务**

---

官网：redis.io

中文网：www.redis.cn  https://www.redis.net.cn/tutorial/3505.html

github：https://github.com/redis



### window安装

下载：

解压安装

启动

测试连接：ping

### Linux安装

1、下载：http://download.redis.io/releases/redis-6.0.8.tar.gz?_ga=2.12548340.175437557.1601005182-2129720179.1597734486

或：wget http://download.redis.io/releases/redis-6.0.8.tar.gz

2、解压

```bash
tar zxvf redisxxx
```

3、基本环境安装：

```bash
cd redis-6.x.x # cd 到解压目录下

yum install gcc-c++ # 安装gcc redis是c++写的所以需要安装gcc

gcc -v #查看安装情况

make 

make install
```

4、redis默认安装路径：/usr/local/bin 

5、将解压后redis配置文件拷贝到/usr/local/bin/新建一个文件夹

6、配置redis，设置守护进程为yes

7、启动 redis.server  /xxx/redis.conf指定使用哪个配置文件配置启动

```bash
redis.server  /xxx/redis.conf
```

8、使用redis-cli连接测试

```bash
redis-cli -p 6379

ping
```

9、查看redis进程是否开启

```bash
ps -ef|grep redis
```

10、关闭redis

```
shutdown 

exit
```

11、再次查看进程

```bash
ps -ef|grep redis
```

博客：https://www.cnblogs.com/happywish/p/10944253.html

https://blog.csdn.net/weidu01/article/details/105946606

12、单机多redis集群测试

```bash
# 安装redis报错 原因gcc版本过低
# cc1: error: unrecognized command line option "-std=c11"

# 解决办法：默认gcc版本一般情况是4.4.7，更新gcc版本，本方案升级到4.8.2
# 查看gcc版本
gcc -v  # 显示4.4.7

# 下载4.8.2 解压
wget http://ftp.gnu.org/gnu/gcc/gcc-4.8.2/gcc-4.8.2.tar.gz
tar -jxvf gcc-4.8.2.tar.gz

# 下载编译需求依赖
cd gcc-4.8.2
./contrib/download_prerequisites

# 新建文件夹
mkdir gcc-build-4.8.2
cd gcc-build-4.8.2

# 生成makefile文件
../configure  -enable-checking=release -enable-languages=c,c++ -disable-multilib

# 编译安装
make && make install

# 安装完成测试
gcc -v
```

**菜鸟安装教程**

```bash
wget 下载地址
tar -zxvf redis.xxxx.tar.gz
cd redis.xxx
make
```

make完后目录下出现变异后redis服务程序redis-server，redis-cli位于src目录下

启动redis

```bash
cd src
./redis-server  # 使用默认配置启动
```

使用配置文件启动

```bash
cd src 
./redis-server  ../redis.conf # 使用配置文件 redis.conf启动，可以自定义
```

测试交互

```bash
cd src
./redis.cli

> set name zhangsan
>get name
```





---

### redis性能测试

（官方自带性能测试工具）

```bash
redis-benchmark [option] [option value]
```

redis 性能测试工具可选参数如下所示：

| 序号 | 选项      | 描述                                       | 默认值    |
| :--- | :-------- | :----------------------------------------- | :-------- |
| 1    | **-h**    | 指定服务器主机名                           | 127.0.0.1 |
| 2    | **-p**    | 指定服务器端口                             | 6379      |
| 3    | **-s**    | 指定服务器 socket                          |           |
| 4    | **-c**    | 指定并发连接数                             | 50        |
| 5    | **-n**    | 指定请求数                                 | 10000     |
| 6    | **-d**    | 以字节的形式指定 SET/GET 值的数据大小      | 2         |
| 7    | **-k**    | 1=keep alive 0=reconnect                   | 1         |
| 8    | **-r**    | SET/GET/INCR 使用随机 key, SADD 使用随机值 |           |
| 9    | **-P**    | 通过管道传输 <numreq> 请求                 | 1         |
| 10   | **-q**    | 强制退出 redis。仅显示 query/sec 值        |           |
| 11   | **--csv** | 以 CSV 格式输出                            |           |
| 12   | **-l**    | 生成循环，永久执行测试                     |           |
| 13   | **-t**    | 仅运行以逗号分隔的测试命令列表。           |           |
| 14   | **-I**    | Idle 模式。仅打开 N 个 idle 连接并等待。   |           |

示例：测试100个并发，100000个请求

```bash
redis-benchmark -c 100 -n 100000 -q
```

### 基础知识

redis默认有16个数据库，默认使用第0个，使用select num切换数据库

```bash
select 3 # 切第三个数据库

dbsize # 查看库大小  # 可以使用不同的数据库存不同的数据

keys * # 查看所有的key

flushdb  # 清空当前数据库

flushall # 清空所有数据库内容
```

> redis是单线程的，为什么还这么快？

redis是基于内存操作的，cpu不是redis性能瓶颈，redis的性能瓶颈在于机器的内存和网络带宽！所以就使用了单线程。redis是用c语言写的，官方数据qps 100000+

**为什么redis单线程，还可以如此的快？**

一般来说速度：cpu>内存>硬盘

多线程需要CPU上下文切换，是一个耗时的操作。redis将所有数据全部放在内存中，所以对于一块内存使用单线程操作效率就是最高的。多次读写都在一个CPU上。

### Redis配置

redis的配置有两种方式：配置文件配置、命令行配置config

配置文件位置：redis安装目录下 redis.conf文件（window下命名为：redis.windows.conf）

```bash
##################获取配置########################
# 获取配置 config get config_setting_name
# 获取日志配置
config get loglevel

# 获取所有配置
config get *

######################修改配置#####################
# 设置配置命令： config set config_setting_name  new_config_vlaue
# 设置日志级别
config set loglevel "notice"

```

**redis.conf配置文件说 **

| 序号 | 配置项                                                       | 说明                                                         |
| :--- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| 1    | `daemonize no`                                               | Redis 默认不是以守护进程的方式运行，可以通过该配置项修改，使用 yes 启用守护进程（Windows 不支持守护线程的配置为 no ） |
| 2    | `pidfile /var/run/redis.pid`                                 | 当 Redis 以守护进程方式运行时，Redis 默认会把 pid 写入 /var/run/redis.pid 文件，可以通过 pidfile 指定 |
| 3    | `port 6379`                                                  | 指定 Redis 监听端口，默认端口为 6379，作者在自己的一篇博文中解释了为什么选用 6379 作为默认端口，因为 6379 在手机按键上 MERZ 对应的号码，而 MERZ 取自意大利歌女 Alessia Merz 的名字 |
| 4    | `bind 127.0.0.1`                                             | 绑定的主机地址                                               |
| 5    | `timeout 300`                                                | 当客户端闲置多长秒后关闭连接，如果指定为 0 ，表示关闭该功能  |
| 6    | `loglevel notice`                                            | 指定日志记录级别，Redis 总共支持四个级别：debug、verbose、notice、warning，默认为 notice |
| 7    | `logfile stdout`                                             | 日志记录方式，默认为标准输出，如果配置 Redis 为守护进程方式运行，而这里又配置为日志记录方式为标准输出，则日志将会发送给 /dev/null |
| 8    | `databases 16`                                               | 设置数据库的数量，默认数据库为0，可以使用SELECT 命令在连接上指定数据库id |
| 9    | `save <seconds> <changes>`Redis 默认配置文件中提供了三个条件：**save 900 1****save 300 10****save 60 10000**分别表示 900 秒（15 分钟）内有 1 个更改，300 秒（5 分钟）内有 10 个更改以及 60 秒内有 10000 个更改。 | 指定在多长时间内，有多少次更新操作，就将数据同步到数据文件，可以多个条件配合 |
| 10   | `rdbcompression yes`                                         | 指定存储至本地数据库时是否压缩数据，默认为 yes，Redis 采用 LZF 压缩，如果为了节省 CPU 时间，可以关闭该选项，但会导致数据库文件变的巨大 |
| 11   | `dbfilename dump.rdb`                                        | 指定本地数据库文件名，默认值为 dump.rdb                      |
| 12   | `dir ./`                                                     | 指定本地数据库存放目录                                       |
| 13   | `slaveof <masterip> <masterport>`                            | 设置当本机为 slave 服务时，设置 master 服务的 IP 地址及端口，在 Redis 启动时，它会自动从 master 进行数据同步 |
| 14   | `masterauth <master-password>`                               | 当 master 服务设置了密码保护时，slav 服务连接 master 的密码  |
| 15   | `requirepass foobared`                                       | 设置 Redis 连接密码，如果配置了连接密码，客户端在连接 Redis 时需要通过 AUTH <password> 命令提供密码，默认关闭 |
| 16   | ` maxclients 128`                                            | 设置同一时间最大客户端连接数，默认无限制，Redis 可以同时打开的客户端连接数为 Redis 进程可以打开的最大文件描述符数，如果设置 maxclients 0，表示不作限制。当客户端连接数到达限制时，Redis 会关闭新的连接并向客户端返回 max number of clients reached 错误信息 |
| 17   | `maxmemory <bytes>`                                          | 指定 Redis 最大内存限制，Redis 在启动时会把数据加载到内存中，达到最大内存后，Redis 会先尝试清除已到期或即将到期的 Key，当此方法处理 后，仍然到达最大内存设置，将无法再进行写入操作，但仍然可以进行读取操作。Redis 新的 vm 机制，会把 Key 存放内存，Value 会存放在 swap 区 |
| 18   | `appendonly no`                                              | 指定是否在每次更新操作后进行日志记录，Redis 在默认情况下是异步的把数据写入磁盘，如果不开启，可能会在断电时导致一段时间内的数据丢失。因为 redis 本身同步数据文件是按上面 save 条件来同步的，所以有的数据会在一段时间内只存在于内存中。默认为 no |
| 19   | `appendfilename appendonly.aof`                              | 指定更新日志文件名，默认为 appendonly.aof                    |
| 20   | `appendfsync everysec`                                       | 指定更新日志条件，共有 3 个可选值：**no**：表示等操作系统进行数据缓存同步到磁盘（快）**always**：表示每次更新操作后手动调用 fsync() 将数据写到磁盘（慢，安全）**everysec**：表示每秒同步一次（折中，默认值） |
| 21   | `vm-enabled no`                                              | 指定是否启用虚拟内存机制，默认值为 no，简单的介绍一下，VM 机制将数据分页存放，由 Redis 将访问量较少的页即冷数据 swap 到磁盘上，访问多的页面由磁盘自动换出到内存中（在后面的文章我会仔细分析 Redis 的 VM 机制） |
| 22   | `vm-swap-file /tmp/redis.swap`                               | 虚拟内存文件路径，默认值为 /tmp/redis.swap，不可多个 Redis 实例共享 |
| 23   | `vm-max-memory 0`                                            | 将所有大于 vm-max-memory 的数据存入虚拟内存，无论 vm-max-memory 设置多小，所有索引数据都是内存存储的(Redis 的索引数据 就是 keys)，也就是说，当 vm-max-memory 设置为 0 的时候，其实是所有 value 都存在于磁盘。默认值为 0 |
| 24   | `vm-page-size 32`                                            | Redis swap 文件分成了很多的 page，一个对象可以保存在多个 page 上面，但一个 page 上不能被多个对象共享，vm-page-size 是要根据存储的 数据大小来设定的，作者建议如果存储很多小对象，page 大小最好设置为 32 或者 64bytes；如果存储很大大对象，则可以使用更大的 page，如果不确定，就使用默认值 |
| 25   | `vm-pages 134217728`                                         | 设置 swap 文件中的 page 数量，由于页表（一种表示页面空闲或使用的 bitmap）是在放在内存中的，，在磁盘上每 8 个 pages 将消耗 1byte 的内存。 |
| 26   | `vm-max-threads 4`                                           | 设置访问swap文件的线程数,最好不要超过机器的核数,如果设置为0,那么所有对swap文件的操作都是串行的，可能会造成比较长时间的延迟。默认值为4 |
| 27   | `glueoutputbuf yes`                                          | 设置在向客户端应答时，是否把较小的包合并为一个包发送，默认为开启 |
| 28   | `hash-max-zipmap-entries 64 hash-max-zipmap-value 512`       | 指定在超过一定的数量或者最大的元素超过某一临界值时，采用一种特殊的哈希算法 |
| 29   | `activerehashing yes`                                        | 指定是否激活重置哈希，默认为开启（后面在介绍 Redis 的哈希算法时具体介绍） |
| 30   | `include /path/to/local.conf`                                | 指定包含其它的配置文件，可以在同一主机上多个Redis实例之间使用同一份配置文件，而同时各个实例又拥有自己的特定配置文件 |

### Redis命令

redis客户端： redis-cli

连接服务器命令

```bash
$ redis-cli  # 连接本机服务器
$ redis-cli -h host -p port -a password # 连接远程服务器
# 验证是否连接成功
$ ping

$ redis-cli --raw  # 避免中文乱码
```

redis命令大全：http://www.kayooo.com/

### Redis键命令

作用：用于管理redis的键  语法：command key_name

```bash
$ set keyname value_1
$ del keyname  # 删除键名为keyname的键
$ exisis key # 检查key是否存在
$ expire key 100 # 设置过期时间，以秒为单位，键key设置100秒过期
$ move keyname 1 # 1表示当前数据库 移除当前key
$ keys pattern # 查找所有符合给定格式的key
$ persist key # 设置永久不过期
$ ttl name # 查询过期时间还剩多少
$ randomkey # 随机返回一个key
$ rename key newkey # 修改key的名称
$ renamenx key newkey # 仅当newkey不存在时，将key改名为newkey
$ type key # 返回key所存储的值的类型
$ dump key # 序列化key,并返回被序列化的值
```

### 五大数据类型

**1.string（字符串）**

使用场景：计数器（incrby）、统计数量、粉丝数、对象缓存存储

```bash
##########################################################################
$ set k1 v1 # 设置key k1值为v1
$ get k1 # 获取k1的值
$ keys * # 所有key

$ exists key1 # 是否存在
$ append key1 "hello" # 给key1的值追加拼接hello字符串，如果当前key不存在，则新建该key
$ strlen key1 # 获取字符串长度

##########################################################################
# i++ 操作
$ set views 0 # 初始浏览量为0
$ incr views # key 浏览加 1
$ decr views # key views减 1

$ incrby views 10 # 设置增加步长 加10
$ decrby views 10 # 自减10

#########################################################################
# 字符串范围 
# 截取字符串 substring
$ flushdb # 清空数据库
$ set k1 helloworld
$ get k1
$ getrange k1 0 5 # 截取前0-5的字符串 substr
$ getrange k1 0 -1 # 获取到末尾

# 替换字符串 replace
$ setrange k1 1 xx # 从1开始替换两个字符 hxxloworld

##########################################################
$ setex key seconds value # set expire 设置过期时间
$ setnx key1 value1 # 如果key不存在，设置值

$ mset k1 v1 k2 v2 # 一次性设置过个值
$ mget k1 k2 # 查看多个值

$ msetnx k1 v1 k3 v3 # 原子性操作，如果k1存在，k3不存在，也不能成功，只有所有的key都不存在时才成功

# 示例： $ mset user:1:name "zhangsan" user:1:age 22 
#############################################
$ getset k1 v1 # 获得旧值设置新值  如果不存在则返回null  可以做一些更新的操作

```

**2.list（列表）**

应用场景：栈、





**hash（哈希）**

key-map

Redis hash 是一个 string 类型的 field（字段） 和 value（值） 的映射表，hash 特别适合用于存储对象。

示例

```bash
HMSET runoobkey name "redis tutorial" description "redis basic commands for caching" likes 20 visitors 23000

hgetall runoobkey

1) "name"
2) "redis tutorial"
3) "description"
4) "redis basic commands for caching"
5) "likes"
6) "20"
7) "visitors"
8) "23000"
```

**Zset(有序集合)**

在set基础上，增加一个值，用于排序

```bash
zset k1  score1  v1

zset name 1 zhangsan 2 lisi # 添加多个值

zrange name 0 -1 # 获取所有值

zrangebyscore salary -inf +inf   # 负无穷到正无穷薪水排序 
```

排行榜应用可以使用zset实现、取top10，排名等



### 三种特殊数据类型

**geospatial地理位置**

人员的定位、附近的人、打车距离计算

redis的geo在3.2版本就有了，这个功能可以推算地理位置的信息，两地之间的距离，方圆几里的人

命令：

```bash
GEOADD # 添加地理位置  可以下载城市数据使用java一次性导入
geoadd china:city 116.405285 39.904989 beijing  # 添加北京地理位置
geoadd china:city 121.472644 31.231706 shanghai 113.280637 23.125178 guangzhou # 添加上海广州

GEODIST # 计算距离
getdist china:city beijing shanghai # 计算北京上海距离

GEOHASH
GEOPOS
GEORADIUS
GEORADIUSBYMEMBER
```







### 

redis乐观锁 watch





### Jedis

**什么是Jedis？**

是redis官方推荐的连接redis的开发工具。java驱动redis的工具包。





### redis的持久化（**）

**为什么需要持久化？**

redis作为基于内存的数据库，每次重启都会导致数据消失，除非你的数据只需要在服务器运行时存在，否则就必须持久化。

**redis两种持久化方案**

- RDB（Redis DataBase）**快照**在指定时间间隔对数据进行快照保存。**（RDB是redis默认持久化配置）**
- AOF（Append Only File）记录所有写操作，当服务重启时重新执行这些命令来恢复原始数据。

---

可以同时开启两种持久化方式，这时在服务重启时会优先载入AOF文件来恢复原始数据，因为AOF文件保存的数据集要比RDB文件数据要完整。RDB在redis意外停止工作时丢失部分数据。

---

**RDB持久化（快照持久化）**

- 配置文件配置

```bash
################################ SNAPSHOTTING  ################################
#   save <seconds> <changes>

save 900 1 # 900秒 修改1次触发
save 300 10 # 300秒 修改10
save 60 10000 # 60秒 修改10000
```

- 还可以手动调用：save 或 bgsave快照保存。

```bash
save 
bgsave  # 两个命令都可以
```

**rdb工作方式**（redis保存dump.rdb文件时，服务器的操作：）

- redis调用forks一个子进程
- 子进程将数据集写入一个临时rdb文件中
- 当子进程完成对新rdb文件的写入时，redis用新的rdb文件替换原来的rdb文件，并删除旧的rdb文件。

**RDB的优点**

- 1.设置rdb保存机制，保存数据，意外情况下根据需求恢复到不同版本的数据集。
- 2.RDB文件紧凑，适合传输到远端数据中心，适用于灾难恢复。
- 3.rdb在保存文件时会fork出一个子进程来持久化，父进程不需要参与io操作，最大化redis的性能。
- 4.和AOF相比，在恢复大的数据集的时候，RDB方式会更快一些

**RDB的缺点**

- 1.redis意外宕机会丢失部分数据。
- 2.RDB在保存文件时，要经常fork子进程，在数据集较大的时候fork过程会非常耗时，从而影响一定性能。fork子进程占用一定内存空间。

**RDB触发**

rdb触发时会产生一个dump.rdb文件

- 1.在满足配置条件的时触发（如 save 60 5 一分钟修改5次）
- 2.执行flushall命令时，也会触发rdb规则
- 3.退出redis时（关机），也会触发产生rdb文件

**如何恢复rdb文件**

- 1.只需将rdb文件，放在redis的启动目录下，redis启动时会自动检查dump.rdb文件并恢复其中的数据。
- 2.查看需要存放的目录  config get dir

---

**AOF持久化（append only file）**

aof默认是不开启的，可以手动配置。只需要配置：appendonly  yes

**如果aof文件有错误**，这时redis是启动不起来的，这时需要修复aof文件，redis提供了一个工具redis-check-aop执行：

```bash
redis-check-aof --fix
```

**优点和缺点**

```bash
appendonly no # 默认关闭
# The name of the append only file (default: "appendonly.aof")
appendfilename "appendonly.aof"  # aof文件名称

# appendfsync always # 每次都同步aof,非常慢，但非常安全
appendfsync everysec # 每秒同步一次，足够快和rdb差不多，可能会丢失1秒数据，默认配置（兼顾速度和安全）
# appendfsync no # 不开启，从不同步，效率最高，交给操作系统处理

# rewrite 重写规则设置，如果aof文件超过设置值时，会再fork一个进程，重写一个新文件
```

**优点**

- 1.每一次修改都同步appendfsync always
- 2.每一秒同步一次，最多会丢失1秒数据
- 3.从不同步设置效率最高
- 4.日志重写，aof文件过大时会触发重写，重写后新的aof文件包含了恢复当前数据集所需的最小命令集合。（而且绝对安全，重写新的aof文件时，会继续将命令追加到现有文件中，并且新建完成后自动切换到新文件追加命令）
- 5.aof文件容易被人读懂，可以对文件分析，如果不小心执行错误命令，只要aof文件没被重写，只要停止服务器，将错误命令移除，重启redis即可恢复到错误命令之前的状态。

**日志重写**除了默认配置外也可以手动调用命令：bgrewriteaof来触发日志重写

```bash
bgrewriteaof
```

**缺点**

- 1.相同的数据集aof文件要远远大于rdb文件，恢复数据时速度会比rdb慢
- 2.aof运行效率也低于rdb（aof属于IO操作），所以默认开启rdb

**AOF重写工作原理**

aof和rdb快照都利用了写时复制机制

- redis会fork一个子进程
- 子进程开始将新的aof文件内容写入到临时文件
- 重写时，同时父进程一边将写入命令累积到一个内存缓存中，一边将这些命令追加到现有的aof文件末尾（这就解释了aof为什么是安全的）
- 当子进程完成重写工作，给父进程发一个信号，父进程会将缓存中的数据追加到新aof文件末尾（从而完成新旧文件替换）



**扩展**

**如何选择使用哪种持久化配置？**

官方推荐使用默认rdb配置，如果对数据安全性要求高建议两种配置都开启，不推荐单独使用aof持久化。因为rdb定时快照便于数据库备份，且rdb的恢复数据比aof要快。



**怎样从RDB方式切换到AOF方式？**

【不重启切换1.备份dump.rdb 2.开启aof：redis-cli  config  set appendonly  yes  3.关闭rdb：redis-cli config set save "" (可选)】

在 Redis 2.2 或以上版本，可以在不重启的情况下，从 RDB 切换到 AOF ：

- 为最新的 dump.rdb 文件创建一个备份。
- 将备份放到一个安全的地方。
- 执行以下两条命令:
- redis-cli config set appendonly yes
- redis-cli config set save “”
- 确保写命令会被正确地追加到 AOF 文件的末尾。
- 执行的第一条命令开启了 AOF 功能： Redis 会阻塞直到初始 AOF 文件创建完成为止， 之后 Redis 会继续处理命令请求， 并开始将写入命令追加到 AOF 文件末尾。

执行的第二条命令用于关闭 RDB 功能。 这一步是可选的， 如果你愿意的话， 也可以同时使用 RDB 和 AOF 这两种持久化功能。

重要:别忘了在 redis.conf 中打开 AOF 功能！ 否则的话， 服务器重启之后， 之前通过 CONFIG SET 设置的配置就会被遗忘， 程序会按原来的配置来启动服务器。

**AOF和RDB之间的相互作用**

版本号大于2.4的redis，快照（bgsave）和日志重写（bgrewriteaof）不能同时执行。原因这两个操作都会对磁盘进行大量IO操作。总之就是为了一个字-快



**备份redis数据**

任何时候，复制rdb文件都是绝对安全的。

- 创建一个定期任务（cron job）， 每小时将一个 RDB 文件备份到一个文件夹， 并且每天将一个 RDB 文件备份到另一个文件夹。
- 确保快照的备份都带有相应的日期和时间信息， 每次执行定期任务脚本时， 使用 find 命令来删除过期的快照： 比如说， 你可以保留最近 48 小时内的每小时快照， 还可以保留最近一两个月的每日快照。
- 至少每天一次， 将 RDB 备份到你的数据中心之外， 或者至少是备份到你运行 Redis 服务器的物理机器之外。

**容灾备份**

Redis 的容灾备份基本上就是对数据进行备份， 并将这些备份传送到多个不同的外部数据中心。容灾备份可以在 Redis 运行并产生快照的主数据中心发生严重的问题时， 仍然让数据处于安全状态。

因为很多 Redis 用户都是创业者， 他们没有大把大把的钱可以浪费， 所以下面介绍的都是一些实用又便宜的容灾备份方法：

- Amazon S3 ，以及其他类似 S3 的服务，是一个构建灾难备份系统的好地方。 最简单的方法就是将你的每小时或者每日 RDB 备份加密并传送到 S3 。 对数据的加密可以通过 gpg -c 命令来完成（对称加密模式）。 记得把你的密码放到几个不同的、安全的地方去（比如你可以把密码复制给你组织里最重要的人物）。 同时使用多个储存服务来保存数据文件，可以提升数据的安全性。
- 传送快照可以使用 SCP 来完成（SSH 的组件）。 以下是简单并且安全的传送方法： 买一个离你的数据中心非常远的 VPS ， 装上 SSH ， 创建一个无口令的 SSH 客户端 key ， 并将这个 key 添加到 VPS 的 authorized_keys 文件中， 这样就可以向这个 VPS 传送快照备份文件了。 为了达到最好的数据安全性，至少要从两个不同的提供商那里各购买一个 VPS 来进行数据容灾备份。
- 需要注意的是， 这类容灾系统如果没有小心地进行处理的话， 是很容易失效的。最低限度下， 你应该在文件传送完毕之后， 检查所传送备份文件的体积和原始快照文件的体积是否相同。 如果你使用的是 VPS ， 那么还可以通过比对文件的 SHA1 校验和来确认文件是否传送完整。

另外， 你还需要一个独立的警报系统， 让它在负责传送备份文件的传送器（transfer）失灵时通知你。

- 只做缓存的话，不需要持久化
- 5.性能建议
  - rdb文件只做备份，建议在slave机器上持久化rdb文件，没15分钟备份一次，值保留save 900 1设置
  - 如果开启aof，日志重写过程中产生的新数据在追加到新aof文件时，几乎不可避免会造成阻塞。64m的默认设置太小，建议只要磁盘允许设置到5G以上，默认超过原始大小100%重写可改到适当的数据。
  - 如果不开启aof，依靠主从复制也可以实现高可用性，节省大笔io，减少rewrite过程造成的系统波动。代价是主从机同时宕机，会损失十几分钟的数据，启动时要比较主从机rdb文件，载入比较新的那个。（断电）异地多活，主从复制保证安全。

---

### Redis发布订阅



缓存穿透（mysql查不到）-布隆过滤器



缓存击穿（mysql有数据，热点数据，缓存过期）-加锁



缓存雪崩（缓存服务器宕机）





















