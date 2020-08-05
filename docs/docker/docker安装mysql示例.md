## docker安装mysql并使用Navicat连接示例

---

## 示例1

```
// 搜索mysql
docker search mysql

// 拉取mysql镜像
docker pull mysql

// 查看本地镜像
docker images

// 启动一个mysql容器并做端口映射
docker run --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 -d mysql

// 查看本地运行的容器
docker ps

// 进入正在运行的容器
docker exec -it 容器id bash

// 登陆mysql
mysql -u root -p 

输入密码

// 切数据库
use mysql 

// 查询当前库表
select host,user from user;

```
### 使用Navicat连接

打开Navicat  
```java
1.新建连接-->
2.填写：名称、ip、端口（和映射端口一致）、密码等
3.点击连接-->成功
```

## 示例2

- 1.拉取mysql镜像
> docker pull mysql:latest

- 2.启动一个mysql容器
> docker run --name shihemysql -p 3306:3306 -d -e MYSQL_ROOT_PASSWORD=root -d mysql:latest

注：如果想自定义配置，可参考docker文档自定义，把自定义的mysql配置文件放置自定义的文件夹下（/conf/mysql）,使用命令挂载到/etc/mysql/conf.d下即可。如下：
docker run --name shihemysql -v /conf/mysql:/etc/mysql/conf.d -e MYSQL_ROOT_PASSWORD=root -d mysql:latest --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci

- 3.进入启动的mysql容器
> docker exec -it shihemysql

- 4.登陆mysql
> mysql -uroot -p

- 5.输出密码root

- 6.进行授权
> GRANT ALL PRIVILEGES ON *.*  TO 'root'@'%' WITH GRANT OPTION;
> FLUSH PRIVILEGES;

- 7.更改加密规则
> ALTER USER 'root'@'localhost' IDENTIFIED BY 'password' PASSWORD EXPIRE NEVER;

- 8.更新root用户密码
> ALTER USER ''@'%' INDENTIFIED WITH mysql_native_password BY 'password';

- 9.刷新权限
> flush privileges;

- 10.使用Navicat连接
