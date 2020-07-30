## oracle 自定义类型 type / create type

## 一：Oracle中的类型有很多种，主要可以分为以下几类：

- 1、字符串类型。如：char、nchar、varchar2、nvarchar2。

- 2、数值类型。如：int、number(p,s)、integer、smallint。

- 3、日期类型。如：date、interval、timestamp。

- 4、PL/SQL类型。如：pls_integer、binary_integer、binary_double(10g)、binary_float(10g)、boolean。（plsql类型是不能在sql环境中使用的，比如建表时。）

- 5、自定义类型：type / create type。

## 二：type / create type 区别联系

- 相同：可用用关键字create type 或者直接用type定义自定义类型,

- 区别：create type 变量 as table of 类型

--

create type 变量 as object(

    字段1 类型1,

    字段2 类型2

);

--------------------------

与 type 变量 is table of 类型

--

type 变量 is record(

    字段1 类型1,

    字段2 类型2

);

区别是 用 create 后面用 as , 若直接用 type 后面用 is

create 是创 object , 而 type 是创 record .

另 type用在语句块中,而create 是的独立的.


一般定义object的语法:

 

用

create type 自定义表类型A as table of 自定义Object类型A

和

create type 自定义Object类型A as object(

    字段1 类型1,
    
    字段2 类型2

);

 

与

type 自定义表类型B is table of 类型

和

type 自定义Object类型B is record(

    字段1 类型1,
    
    字段2 类型2

);

 

 

自定义类型一般分为两中,object类型和table类型.object类似于一个recored，可以表示一个表的一行数据,

 

object的字段就相当与表的字段.

 

自定义的table类型需要用的已经定义好的object类型.

[文章出处](https://www.cnblogs.com/advocate/p/3729998.html)