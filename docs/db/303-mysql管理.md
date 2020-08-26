## 管理mysql常用命令

## 1.列出所有数据库
```sql
show databases;
```
## 2.创建数据库
```sql
create database test;
```

## 3.删除数据库
```sql
drop database test;
```

## 4.切换数据库
```sql
use test;
```

## 5.列出当前数据库所有表
```sql
show tables;
```

## 6.查看表结构
```sql
desc students;
```

## 7.查看建表语句
```sql
show create table students;
```

## 8.删除表
```sql
drop table students;
```

## 9.给students表增加一列
```sql
alter table students add column birth varchar(10) not null;
```

## 10.修改列
```sql
alter table students change column birth birthday varchar(20) not null; 
```

## 11.删除一列
```sql
alter table students drop column birthday;
```

## 12.退出mysql
```sql
exit;
```