## Windows下载安装配置RabbitMQ

## step 1
安装Erlang：RabbitMQ依赖Erlang环境，[下载地址](https://www.erlang.org/downloads)
- 设置环境变量ERLANG_HOME
- 配置path，%ERLANG_HOME%\bin
- 验证cmd命令>erl
成功：
```xml
Eshell V11.0 (abort with ^G)
1>
```

## step 2 
下载安装rabbitmq，官网经常打不开，可找一些国内镜像地址下载[https://www.newbe.pro/Mirrors/Mirrors-RabbitMQ/](https://www.newbe.pro/Mirrors/Mirrors-RabbitMQ/)
这里使用：rabbitmq-server-windows-3.8.3.zip版本
- 解压
- 配置环境变量：RABBITMQ_SERVER
- 配置path：%RABBITMQ_SERVER%\sbin
- sbin目录下cmd命令：rabbitmqctl status 

![rabbmitmq未启动需安装插件](https://mmbiz.qpic.cn/mmbiz_png/a2yUAKXzX0auWZU7rmmIkhAQ4QJK6L7YDKMic4K33aOB9ZicIlsWsJayticunWKoWoNR8TZnH9nichgks65qQNtayA/0?wx_fmt=png)

- 安装插件，命令：rabbitmq-plugins.bat enable rabbitmq_management
- 输入命令：rabbitmq-server.bat
- rabbitmq启动成功，浏览器中http://localhost:15672   
>username:guest
> 
>password:guest
- 打开cmd，再次输入命令验证：rabbitmqctl status

[转载地址](https://blog.csdn.net/zhm3023/article/details/82217222)

## 管理rabbitmq_management的用户
- 查看rabbitmq_management注册用户
```xml
rabbitmqctl list_users
```

- 创建用户命令
```xml
rabbitmqctl add_user [username] [password]
```
- 使用命令给rabbit设置tag，设置tag的命令格式
```xml
rabbitmqctl set_user_tags [tag1] [tag2] ...
```
例如：rabbitmqctl set_user_tags admin administrator none

有5个tag可供选择，分别是：administrator ，monitoring，policymaker，management和none 有兴趣的同学可以到这里了解各个tag的含义，其实这里的tag代表的是权限，administrator是最高权限，none表示不能访问，这里administrator和none的组合，权限应该是向高看齐，忽略none，用的是administrator的权限。我们用rabbit1/rabbit1 登录rabbitmq_management。

- 查看rabbitmq所有插件：rabbitmq-plugins list

rabbitmq_management插件，这款插件是可以可视化的方式查看RabbitMQ 服务器实例的状态，以及操控RabbitMQ服务器。

- 安装rabbitmq_management插件
rabbitmq-plugins enable rabbitmq_management

