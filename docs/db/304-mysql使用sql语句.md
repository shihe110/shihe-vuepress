## mysql使用sql语句

- 插入或替换
插入一条新记录，如果有就先删除再插入，如果没有就直接插入。
```sql
replace into students (id,class_id,name,score) values (1,1,'zhagnsan',90);
```

- 插入或更新
插入一条新记录，如果有记录就做更新操作，没有就插入
```sql
insert into students (id,class_id,name,score) values (1,1,'zhagnsan',90) on duplicate key update name='zhangsan',score=90;
```

- 插入或忽略
插入一条新记录，如果有记录就不做操作，没有就插入
```sql
insert ignore into students (id,class_id,name,score) values(1,1,'zhangsan',90);
```

- 复制一个表数据（快照）
```sql
// 快照1班所有记录
create table students_of_new select * from students where class_id=1;
```

- 写入查询结果
```sql
create table table2(
    id bigint not null auto_increment,
    class_id bigint not null,
    average double not null,
    primary key (id)
);

insert into table2 (class_id,average) select class_id,avg(score) from students group by class_id;
```

- 强制使用指定索引force index
```sql
select * from students force index (idx_class_id) where class_id=1 order by id desc;
```

