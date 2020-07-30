## Oracle自定义无参函数

create or replace function [function name]
return [数据类型] 
is [参数名称] [参数数据类型]
begin
  [函数体]
end [函数名];
```sql
-- 无参函数
create or replace function get_user 
return varchar2 is v_user varchar2(50);
begin
  return 'zhangsan';
end get_user;
-- 测试
select get_user() from dual;
-- 删除函数
drop function get_user;

--没有参数的函数
create or replace function get_user return varchar2 is
  v_user varchar2(50);
begin
  select username into v_user from user_users;
  return v_user;
end get_user;
 
--测试
方法一
select get_user from dual;

```
## 自定义有参函数
create or replace function 函数名(参数1 模式 参数类型)  
return 返回值类型  
as  
变量1 变量类型;  
变量2 变量类型;  
begin  
    函数体;  
end 函数名;  