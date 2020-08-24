## mysql优化

- 1.主键自增，插入10条记录，后删除9，10两条记录，再插入是11还是9？
两种情况：
    1.表类型是InnoDB是9，InnoDB 表只是把自增主键的最大 ID 记录到内存中，所以重启数据库或者是对表进行OPTIMIZE 操作，都会导致最大 ID 丢失。  
    2.表的类型是 MyISAM，那么是 11，该类型表会把主键记录到数据文件里。重启mysql也不会丢失。
    
- 2.create可创建哪些对象
DATABASE
EVENT
FUNCTION
INDEX
PROCEDURE
TABLE
TRIGGER
USER
VIEW

- 3.Mysql 表中允许有多少个 TRIGGERS？
在 Mysql 表中允许有六个触发器，如下：
BEFORE INSERT
AFTER INSERT
BEFORE UPDATE
AFTER UPDATE
BEFORE DELETE
AFTER DELETE


