## java10新增关键字var的用法

## what

java10引入了局部变量折断 var用于声明局部变量。 
如var user=new ArrayList<User>();

## why

- 避免了信息冗余
- 对齐了变量名
- 更容易阅读

## how
java10之前的变量声明：

```java
    URL codefx = new URL("http://codefx.org")
    URLConnection connection = codefx.openConnection();
    Reader reader = new BufferedReader(
    new InputStreamReader(connection.getInputStream()));
```

java10
```java
    var codefx = new URL("http://codefx.org");
    var connection = codefx.openConnection();
    var reader = new BufferedReader(
    new InputStreamReader(connection.getInputStream()));
```
- 在处理 var时，编译器先是查看表达式右边部分，也就是所谓的构造器，并将它作为变量的类型，然后将该类型写入字节码当中。

## attention

只能用于带有构造器的局部变量，以下场景不适用 
```java
- var foo; foo = "Foo";
- var ints = {0, 1, 2};
- var appendSpace = a -> a + " ";
- private var getFoo(){}
```

除了局部变量，for循环是唯一可以使用 var的地方：

```java
    var numbers = List.of("a", "b", "c");
    for (var nr : numbers)
    System.out.print(nr + " ");
    for (var i = 0; i < numbers.size(); i++)
    System.out.print(numbers.get(i) + " ");
```
