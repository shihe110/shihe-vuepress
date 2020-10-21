## Memcached

### Memcached是什么？

免费的开源、高性能、分布式内存对象缓存系统，本质上是通用的，但旨在通过减轻数据库负载来加速动态web应用程序。

Memcached 官网：https://memcached.org/

### 一、Linux下载安装Memcached

### 方式一（在线安装）

- 1、安装libevent库

```bash
sudo apt-get install libevent ibevent-dev # ubuntu/Debian自动下载安装

yum install libevent libevent-devel # redhat/fedora/centos自动下载安装
```

- 2、安装Memcached

```bash
# ubuntu/debian
sudo apt-get install memcached

# redhat/fedora/centos
yum install memcached

# freeBSD
portmaster databases/memcached
```

- 3、查看命令路径

```bash
whereis memcached
```

### 方式二（源码安装）

```bash
# 下载官网最新版本
wget http://www.memcached.org/files/memcached-1.6.7.tar.gz

# 解压
tar -zxvf memcached-1.x.x.tar.gz

# 进入解压目录
cd memcached-1.x.x

# 配置
./configure --prefix=/usr/local/memcached

# 编译
make && make test

# 安装
sudo make install # 或 make install 
```

### Memcached运行

```bash
# 帮助命令
$ /usr/local/memcached/bin/memcached -h
# 注：找到安装目录的启动文件，注意自动安装启动文件命令位置/usr/local/bin/memcached

启动选项：

-d是启动一个守护进程；
-m是分配给Memcache使用的内存数量，单位是MB；
-u是运行Memcache的用户；
-l是监听的服务器IP地址，可以有多个地址；
-p是设置Memcache监听的端口，，最好是1024以上的端口；
-c是最大运行的并发连接数，默认是1024；
-P是设置保存Memcache的pid文件。

# 作为前台程序运行,监听tcp端口11211，最大内存64m
/usr/local/memcached/bin/memcached -p 11211 -m 64m -vv

# 作为后台服务运行
/usr/local/memcached/bin/memcached -p 11211 -m 64m -d
# 或
/usr/local/memcached/bin/memcached -d -m 64m -u root -l 192.168.0.200 -p 11211 -c 256 -P /tmp/memcached.pid

# 查找Memcached进程id
ps -ef|grep memcached

# 杀死进程
kill xxxx
```

### Memcached连接

**使用Telnet连接**

安装telnet

- 检查是否安装

```bash
rpm -qa|grep telnet
```

- 检查yum列表里有什么

```bash
[root@shihe ~]# yum list | grep telnet
telnet-server.x86_64                       1:0.17-48.el6                 @base  
telnet.x86_64                              1:0.17-48.el6                 base 
```

- 安装

```bash
yum install -y telnet-server.x86_64
yum install -y telnet.x86_64
```

- telnet连接Memcached并测试set、get命令

```bash
telnet 127.0.0.1 11211

[root@localhost /]# telnet 127.0.0.1 11211
Trying 127.0.0.1...
Connected to 127.0.0.1.
Escape character is '^]'.
# set key flags exptime bytes [noreply] 
# value 
# 保存key1 value为bar flag为0 exptime=0永久保存 bytes=3
set key1 0 0 3
bar
STORED
# 获取key1的值
get key1
VALUE key1 0 3
bar
END
# 退出
quit
Connection closed by foreign host.

```

### 二、Memcached存储命令

**【set命令】**

如果key存在，则更新原数据

```bash
# 语法
set key flags exptime bytes [noreply] value
```

参数说明如下：

- **key：**键值 key-value 结构中的 key，用于查找缓存值。
- **flags**：可以包括键值对的整型参数，客户机使用它存储关于键值对的额外信息 。
- **exptime**：在缓存中保存键值对的时间长度（以秒为单位，0 表示永远）
- **bytes**：在缓存中存储的字节数
- **noreply（可选）**： 该参数告知服务器不需要返回数据
- **value**：存储的值（始终位于第二行）（可直接理解为key-value结构中的value）

```bash
set key1 0 0 3 
bar
```

**[add命令]**

如果key已经存在则不会更新数据，原数据不变，获得NOT_STORE响应。

如果不存在则创建并添加数据。

```bash
# 保存key3-zhangsan 900秒过期 10字节
add key3 0 900 10
zhangsan

STORED
# 获取key3
get key3
VALUE key3 0 10
zhangsan

END

# 给有值的key赋值
add key3 0 900 10
lisi


NOT_STORED
```

**【replace命令】**

替换已存在key的值value，如果key不存在则替换失败，获得NOT_STORED响应。

```bash
# 替换key1的值
replace key1 0 900 10
wangwu

STORED
# 获取key1的值
get key1
VALUE key1 0 10
wangwu

END
# 给不存在的key4替换值
replace key4 0 80 7
zhaoliu
NOT_STORED
# 注意bytes值的长度，存给定长度的的值
```

**【append命令】**

在已有的key的值value的后边追加数据

```bash
append key5 0 900 9
zhangsang
STORED
get key5
VALUE key5 0 16
zhaoliuzhangsang
END
```

**【prepend命令】**

在key的值value的前边追加数据

```bash
prepend key5 0 900 3
123
STORED
get key5
VALUE key5 0 19
123zhaoliuzhangsang
END
```

**[CAS命令]**

检查并设置命令，仅在当前客户端最后一次取值后，该key对应的value没有被其他客户端修改的情况下，才能写入。通过cas_token参数进行检查，该值由Memcached给定元素的唯一的64值。

通过gets key命令获取该值，再使用cas命令。

```bash
# 命令
cas key flags exptime bytes unique_cas_token [noreply]
value

参数说明如下：

key：键值 key-value 结构中的 key，用于查找缓存值。
flags：可以包括键值对的整型参数，客户机使用它存储关于键值对的额外信息 。
exptime：在缓存中保存键值对的时间长度（以秒为单位，0 表示永远）
bytes：在缓存中存储的字节数
unique_cas_token通过 gets 命令获取的一个唯一的64位值。
noreply（可选）： 该参数告知服务器不需要返回数据
value：存储的值（始终位于第二行）（可直接理解为key-value结构中的value）

set key1 0 900 9 
memcached

gets key1
VALUE key1 0 9 1 # 最后的1表示Memcached返回的唯一64值

cas key1 0 900 5 1 # 最后的1是上一步获取的64位值，否则cas命令执行失
redis
```

- **STORED**：保存成功后输出。
- **ERROR**：保存出错或语法错误。
- **EXISTS**：在最后一次取值后另外一个用户也在更新该数据。
- **NOT_FOUND**：Memcached 服务上不存在该键值。

### 三、Memcached查找命令

- get命令

```bash
get key # 获取key的值
get key1 key2 key3 # 获取多个key1的值
```

- gets命令

```bash
# 获取带有cas令牌的value
gets key1 key2
VALUE key1 0 9 11
memcached
VALUE key2 0 9 15
memecched
END
```

- delete命令

```bash
# 删除key
delete key1

# 输出信息说明
DELETED：删除成功。
ERROR：语法错误或删除失败。
NOT_FOUND：key 不存在。
```

- incr命令和decr命令

```bash
# incr和decr命令用于对已存在的key的数字值进行自增或自减操作
# 操作的数据必须是十进制的32位无符号整数。
set key1 0 900 1
1
STORED
set key2 0 900 2
10
STORED
incr key1 2
3
decr key2 3
7

# 输出信息说明
NOT_FOUND：key 不存在。
CLIENT_ERROR：自增值不是对象。
ERROR其他错误，如语法错误等。
```

### 四、统计命令

- stats命令

获取Memcached的服务信息。具体说明：https://www.runoob.com/memcached/memcached-stats.html

- stats items 命令

用于显示各个 slab 中 item 的数目和存储时长(最后一次访问距离现在的秒数)。

- stats slabs命令

用于显示各个slab的信息，包括chunk的大小、数目、使用情况等。

- stats sizes命令

用于显示所有item的大小和个数。

- flush_all命令

清空缓存，可选参数time，在指定时间后清空。

### 五、java连接Memcached

jar包地址：https://www.runoob.com/try/download/spymemcached-2.10.3.jar

```java
/*java连接Memcached*/
public class MemcachedJava {
   public static void main(String[] args) {
      try{
         // 连接 Memcached 服务
         MemcachedClient mcc = new MemcachedClient(new InetSocketAddress("127.0.0.1", 11211));
         System.out.println("Connection to server sucessful.");
         // 关闭连接
         mcc.shutdown(); 
      }catch(Exception ex){
         System.out.println( ex.getMessage() );
      }
   }
}
```

**set操作**

```java
import java.net.InetSocketAddress;
import java.util.concurrent.Future;
 
import net.spy.memcached.MemcachedClient;
 
public class MemcachedJava {
   public static void main(String[] args) {
   
      try{
         // 连接的 Memcached 服务
         MemcachedClient mcc = new MemcachedClient(new InetSocketAddress("127.0.0.1", 11211));
         // 存储数据
         Future fo = mcc.set("runoob", 900, "Free Education");
          // 查看存储状态
         System.out.println("set status:" + fo.get()); 
         // 输出值
         System.out.println("runoob value in cache - " + mcc.get("runoob"));
         // 关闭连接
         mcc.shutdown();
         
      }catch(Exception ex){
         System.out.println( ex.getMessage() );
      }
   }
}
```

**cas操作**

```java
import java.net.InetSocketAddress;
import java.util.concurrent.Future;
 
import net.spy.memcached.CASValue;
import net.spy.memcached.CASResponse;
import net.spy.memcached.MemcachedClient;
 
public class MemcachedJava {
   public static void main(String[] args) {
   
      try{
   
         // 连接本地的 Memcached 服务
         MemcachedClient mcc = new MemcachedClient(new InetSocketAddress("127.0.0.1", 11211));
         System.out.println("Connection to server sucessful.");
 
         // 添加数据
         Future fo = mcc.set("runoob", 900, "Free Education");
 
         // 输出执行 set 方法后的状态
         System.out.println("set status:" + fo.get());
            
         // 使用 get 方法获取数据
         System.out.println("runoob value in cache - " + mcc.get("runoob"));
 
         // 通过 gets 方法获取 CAS token（令牌）
         CASValue casValue = mcc.gets("runoob");
 
         // 输出 CAS token（令牌） 值
         System.out.println("CAS token - " + casValue);
 
         // 尝试使用cas方法来更新数据
         CASResponse casresp = mcc.cas("runoob", casValue.getCas(), 900, "Largest Tutorials-Library");
         
         // 输出 CAS 响应信息
         System.out.println("CAS Response - " + casresp);
 
         // 输出值
         System.out.println("runoob value in cache - " + mcc.get("runoob"));
 
         // 关闭连接
         mcc.shutdown();
         
      }catch(Exception ex) {
         System.out.println(ex.getMessage());
      }
   }
}
```

**get cas操作**

```java
import java.net.InetSocketAddress;
import java.util.concurrent.Future;
 
import net.spy.memcached.CASValue;
import net.spy.memcached.CASResponse;
import net.spy.memcached.MemcachedClient;
 
public class MemcachedJava {
   public static void main(String[] args) {
   
      try{
   
         // 连接本地的 Memcached 服务
         MemcachedClient mcc = new MemcachedClient(new InetSocketAddress("127.0.0.1", 11211));
         System.out.println("Connection to server sucessful.");
 
         // 添加数据
         Future fo = mcc.set("runoob", 900, "Free Education");
 
         // 输出执行 set 方法后的状态
         System.out.println("set status:" + fo.get());
            
         // 从缓存中获取键为 runoob 的值
         System.out.println("runoob value in cache - " + mcc.get("runoob"));
 
         // 通过 gets 方法获取 CAS token（令牌）
         CASValue casValue = mcc.gets("runoob");
 
         // 输出 CAS token（令牌） 值
         System.out.println("CAS value in cache - " + casValue);
 
         // 关闭连接
         mcc.shutdown();
         
      }catch(Exception ex) {
         System.out.println(ex.getMessage());
      }
   }
}
```



