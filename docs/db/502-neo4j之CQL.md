## Neo4j查询语言CQL

Neo4j使用CQL“CREATE”命令

创建没有属性的节点

使用属性创建节点

在没有属性的节点之间创建关系

使用属性创建节点之间的关系

为节点或关系创建单个或多个标签

## 1. create命令语法：
```cmd
create (<node-name>:<label-name>)
```

| 元素 | 说明 |
| ---- | ---- |
| create | 创建命令 |
| &lt;node-name> | 要创建节点名称 |
| &lt;label-name | 节点标签名 |


```cmd
CREATE (
   <node-name>:<label-name>
   { 	
      <Property1-name>:<Property1-Value>
      ........
      <Propertyn-name>:<Propertyn-Value>
   }
)
```

| 元素 | 说明 |
| ---- | ---- |
| &lt;node-name> | 要创建节点名称 |
| &lt;label-name | 节点标签名 |
| &lt;Property1-name>...&lt;Propertyn-name> | 属性名 |
| &lt;Property1-value>...&lt;Propertyn-value> | 属性值 |

例：CREATE (dept:Dept { deptno:10,dname:"Accounting",location:"Hyderabad" })

## 2. Match命令语法：

```
MATCH 
(
   <node-name>:<label-name>
)
```

| 元素 | 说明 |
| ---- | ---- |
| &lt;node-name> | 要创建节点名称 |
| &lt;label-name | 节点标签名 |

注意事项 -

- Neo4j数据库服务器使用此<node-name>将此节点详细信息存储在Database.As中作为Neo4j DBA或Developer，我们不能使用它来访问节点详细信息。

- Neo4j数据库服务器创建一个<label-name>作为内部节点名称的别名。作为Neo4j DBA或Developer，我们应该使用此标签名称来访问节点详细信息。

#### 注意-我们不能单独使用MATCH Command从数据库检索数据。 如果我们单独使用它，那么我们将InvalidSyntax错误。

## 3. return子句

- 检索节点的某些属性
- 检索节点的所有属性
- 检索节点和关联关系的某些属性
- 检索节点和关联关系的所有属性

## 语法

```
RETURN 
   <node-name>.<property1-name>,
   ........
   <node-name>.<propertyn-name>
```
#### 与match命令配合使用

```
MATCH (dept: Dept)
RETURN dept.deptno,dept.dname

MATCH (dept: Dept)
RETURN dept
```

## 创建一个节点多个标签
```
CREATE (m:Movie:Cinema:Film:Picture)
```

## 单个标签到关系

```
CREATE (<node1-name>:<label1-name>)-
	[(<relationship-name>:<relationship-label-name>)]
	->(<node2-name>:<label2-name>)
```

```
CREATE (p1:Profile1)-[r1:LIKES]->(p2:Profile2)
```

## 4.where子句语法

```
简单WHERE子句语法
WHERE <condition>

复杂WHERE子句语法
WHERE <condition> <boolean-operator> <condition>
我们可以使用布尔运算符在同一命令上放置多个条件。 请参考下一节，了解Neo4j CQL中可用的布尔运算符。


<condition>语法：
<property-name> <comparison-operator> <value>
```

说明：属性名 比较运算符 值

## 关系运算符 

| 运算符 | 说明 |
| ---- | ---- |
| and | 并且 |
| or | 或者 |
| not | 非 |
| xor | 异或 |

## 比较运算符

| 符号 | 说明 |
| ---- | ---- |
| = | 等于 |
| &lt;> | 不等于 |
| &lt; | 小于 |
| > | 大于 |
| &lt;= | 小于等于 |
| >= | 大于等于 |


例:名字叫Abc等员工
```
MATCH (emp:Employee) 
WHERE emp.name = 'Abc'
RETURN emp


MATCH (emp:Employee) 
WHERE emp.name = 'Abc' OR emp.name = 'Xyz'
RETURN emp
```


## 创建客户和CreditCard节点之间的关系
```
MATCH (cust:Customer),(cc:CreditCard) 
WHERE cust.id = "1001" AND cc.id= "5001" 
CREATE (cust)-[r:DO_SHOPPING_WITH{shopdate:"12/12/2014",price:55000}]->(cc) 
RETURN r
```

## 5. delete 删除

语法：删除节点用，隔开
```
DELETE <node-name-list>
```

##### 三个命令一样
```
注意 -

MATCH (e: 'Employee') RETURN e

MATCH (e: "Employee") RETURN e

MATCH (e: Employee) RETURN e
```

删除节点
```
MATCH (e: Employee) DELETE e
```

### DELETE节点和关系子句语法

DELETE <node1-name>,<node2-name>,<relationship-name>

删除节点和关系
```
MATCH (cc: CreditCard)-[rel]-(c:Customer) 
DELETE cc,c,rel
```

## 6.remove 删除节点或关系的属性

语法：
```
remove <property-name-list>
```

删除book节点的price属性 并返回id=122的数据
```
match (book {id:122})  remove book.price return book
```

MATCH (m:Movie) RETURN m

MATCH (m:Movie)  REMOVE m:Picture


