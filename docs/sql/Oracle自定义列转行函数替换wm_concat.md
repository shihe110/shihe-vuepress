## Oracle实现列转行函数-两种自定义实现

在 Oracle 领域，我相信一说到列转行大部分人都会立马想到 WM_CONCAT 函数，我觉得主要是因为该函数比较实用。但事实上 WM_CONCAT 并非官方公开函数，使用会存在一定的风险；函数返回值的格式比较单一（只能用逗号分割）；返回值的长度也限制。本文接下来会介绍两个自定义函数分别来实现列转行的聚合效果。

## 版本一
- 第 1 步（创建类型 type_table_string，用于转换 COLLECT 函数的返回值）：
```sql
CREATE OR REPLACE TYPE type_table_string IS TABLE OF VARCHAR2(4000);
```

- 第 2 步（创建函数 fn_to_string，用于将 type_table_string 类型转换成普通字符串）：
```sql
CREATE OR REPLACE FUNCTION fn_to_string(
  p_str_tab IN type_table_string,
  p_separator IN VARCHAR2 DEFAULT ','
)
RETURN VARCHAR2 IS
  v_ret_str VARCHAR2(4000);
BEGIN
  FOR i IN 1..p_str_tab.COUNT LOOP
    v_ret_str:=v_ret_str||p_separator||p_str_tab(i);
  END LOOP;
  RETURN LTRIM(v_ret_str,p_separator);
END;
```

- 调用方法：
```sql
SELECT t.dept_code,fn_to_string(CAST(COLLECT(t.staff_name) AS type_table_string),'|') staff_names
FROM demo.t_staff t GROUP BY t.dept_code;
```

## 版本二（参考zh_concat）
- 第 1 步（创建类型 type_concat 的定义）：
```sql
CREATE OR REPLACE TYPE type_concat
AUTHID CURRENT_USER AS OBJECT(
  v_result_string VARCHAR2(4000),
  STATIC FUNCTION odciAggregateInitialize(
    concat IN OUT type_concat) RETURN NUMBER,
  MEMBER FUNCTION odciAggregateIterate(
    SELF IN OUT type_concat,str IN VARCHAR2) RETURN NUMBER,
  MEMBER FUNCTION odciAggregateTerminate(
    SELF IN type_concat,return_value OUT VARCHAR2,flags IN NUMBER) RETURN NUMBER,
  MEMBER FUNCTION odciAggregateMerge(
    SELF IN OUT type_concat,concat IN type_concat) RETURN NUMBER
);
```

- 第 2 步（创建类型 type_concat 的 body）：
```sql
CREATE OR REPLACE TYPE BODY type_concat
IS
  STATIC FUNCTION odciAggregateInitialize(concat IN OUT type_concat)
  RETURN NUMBER IS
  BEGIN
    concat := type_concat(NULL);
    RETURN ODCICONST.SUCCESS;
  END;
  
  MEMBER FUNCTION odciAggregateIterate(SELF IN OUT type_concat,str IN VARCHAR2)
  RETURN NUMBER IS
  BEGIN
    IF SELF.v_result_string IS NOT NULL THEN
      SELF.v_result_string := SELF.v_result_string||','||str;
    ELSE
      SELF.v_result_string := str;
    END IF;
    RETURN ODCICONST.SUCCESS;
  END;
  
  MEMBER FUNCTION odciAggregateTerminate(SELF IN type_concat,return_value OUT VARCHAR2,flags IN NUMBER)
  RETURN NUMBER IS
  BEGIN
    return_value := SELF.v_result_string;
    RETURN ODCICONST.SUCCESS;
  END;
  
  MEMBER FUNCTION odciAggregateMerge(SELF IN OUT type_concat,concat IN type_concat)
  RETURN NUMBER IS
  BEGIN
    IF concat.v_result_string IS NOT NULL THEN
      SELF.v_result_string := SELF.v_result_string||','||concat.v_result_string;
    END IF;
    RETURN ODCICONST.SUCCESS;
  END;
END;
```

- 第 3 步（创建函数 fn_concat，可替代 WM_CONCAT）：
```sql
CREATE OR REPLACE FUNCTION fn_concat(str VARCHAR2)
RETURN VARCHAR2 AGGREGATE USING type_concat;
```

- 调用方法：
```sql
SELECT t.dept_code,fn_concat(t.staff_name) staff_names FROM demo.t_staff t GROUP BY t.dept_code;
```

- ** 说明一：** 上例中的 AUTHID CURRENT_USER 是权限控制的关键字，表示调用者权限，即当前用户。默认为 AUTHID DEFINER，表示定义者权限，即模式拥有者。

- **说明二：** 将 type_concat 中 v_result_string 和 return_value 的类型改为 CLOB 类型，并将 fn_concat 的返回值类型也改为 CLOB，就成了 CLOB 版的 fn_concat 了。

	[**文章出处**](https://www.cnblogs.com/hanzongze/p/oracle-wm_concat.html)