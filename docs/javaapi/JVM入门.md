## JVM入门总结

jvm(Java Virtual Machine):Java虚拟机，识别Java源代码。

### 1、字节码

中间层，jvm将字节码解释执行或使用JIT编译机器码执行。

#### 字节码7种主要命令

```
1、加载存储指令
 - ILOAD ALOAD # 压栈操作
 - ISTORE ASTORE # 弹栈存储局部变量表操作
 - ICONST BIPUSH SIPUSH LDC # 常量压栈操作
 
2、运算指令
 - IADD IMUL # 弹栈 计算结果 压栈

3、类型转换指令
 - I2L D2F # 转换数值类型

4、对象创建和访问指令
 创建、初始化、方法调用
 - NEW NEWARRAY # 创建-分配内存-引用分配内存
 - GETFIELD PUTFIELD GETSTATIC # 属性访问
 - INSTANCEOF CHECKCAST # 检查实例类型指令
 
5、操作栈管理指令
 - POP POP2 # 弹栈操作
 - DUP 复制栈顶元素并压栈
6、方法调用和返回指令
 - INVOKEVIRTUAL # 调用对象的实例方法。
 - INVOKESPECIAL # 调用实例初始化方法、私有方法、父类方法等。
 - 1NVOKESTATIC # 调用类静态方法。
 - RETURN # 返回VOID类型。
7、同步指令
 - ACC_SYNCHRONIZED
```

![img](D:\jianguoyun\我的坚果云\assets\企业微信截图_16031822842760.png)

#### 字节码三种执行方式

- 解释执行
- JIT编译执行（动态编译）
- JIT编译和解释混合执行（主流jvm默认模式）

**JIT的作用**

将Java字节码动态编译成机器码

![img](D:\jianguoyun\我的坚果云\assets\企业微信截图_16031828915304.png)

### 2、类加载过程

一句话：类加载是一个将.class字节码文件实例化成Class对象并进行相关初始化的过程。

【ClassLoader器（将字节码加载到内存中）、双亲委派模型（溯源委派加载模型）】

类加载的三个阶段：

- Load加载
- Link链接
  - 验证
  - 准备
  - 解析
- Init初始化

---

#### 类加载器

类加载器：是一组上下等级类加载器：

- 第一层：Bootstrap（通常有操作系统相关本地代码实现）

  加载Java核心类，Object、System、String等

- 第二层：Platform ClassLoader（jdk9）之前是 Extension ClassLoader（平台类加载器）

  加载一些扩展系统类，如xml、加密、压缩等功能类。

- 第三层：Application ClassLoader（应用类加载器）

  加载用户定义的classpath路径下的类。

第二层第三层类加载器由Java实现。

```java
// JDK11下
// 第三层应用类加载器：AppClassLoader
ClassLoader c = TestWhoLoad.class.getClassLoader();
// 第二层平台类加载器：PlatformClassLoader
ClassLoader c1 = c.getPerent();
// 第一层Bootstrap：null
ClassLoader c2 = c1.getPerent();

// JDK8下的执行结果
AppClassLoader：应用类加载器
ExtClassLoader：扩展类加载器
null：Bootstrap系统本地类实现（由c++来实现）
```

#### 双亲委派模型

![image-20201019171410719](D:\jianguoyun\我的坚果云\assets\image-20201019171410719.png)

低层次的当前类加载器，不能覆盖高层次类加载器已经加载的类。

**低层次类加载想加载一个类的过程**

不同层次的类加载器加载的类不同所有要有一系列判断才会确定是否加载

- 1、向上级类加载器询问是否已经加载了？

- 2、上级加载器自问：1、是否加载过？2、没有加载过，则是否可以加载？
- 3、上级加载器对以上两个问题都为否时，当前加载器才可以加载

> 追加Bootstrap类加载路径：
>
> ```
> -Xbootclasspath/a : /Users/yangguanbao/book/easyCoding/byJdkl l/src
> ```
>
> 启动时观察加载的类
>
> ```
> -XX:+TraceClassLoading
> ```

**什么情况下需自定义类加载器**

- 隔离加载类：隔离中间件jar包中类加载（路径相同冲突）
- 修改类加载方式：按需加载
- 扩展加载源：db、网络、机顶盒
- 防止源码泄漏：

**实现自定义类加载器步骤**

- 1、继承ClassLoader
- 2、重写findClass()方法
- 3、调用defineClass()方法

**主流的容器类框架都会自定义类加载器，实现不同中间件之间的类隔离 有效避免了类冲突。**

### 3、内存布局

内存是硬盘和CPU的中间仓库和桥梁，承载着操作系统和应用程序的实时运行。

内存布局策略：内存的申请、分配、管理

![image-20201019174315974](D:\jianguoyun\我的坚果云\assets\image-20201019174315974.png)

**JVM内存布局**（jdk11）

- 堆区（Heap）
- 元数据区（Metaspace）

- 虚拟机栈（jvm stacks）
- 本地方法栈（native Method stacks）
- 程序计数器（Program Counter Register）

---

#### **堆区heap**

**0、堆区的实质？**

堆区的实质是一块提供了对象的新陈代谢机制内存空间。

**1、作用是什么？**

是一块内存区域，存储几乎所有实例对象，由各子线程共享使用。

**2、堆空间大小设定**

JVM运行参数设定：堆空间大小设定

```
-Xms256M -Xmx1024M
# -X表示它是 JVM 运行参数， ms memory start 的简称，
mx memory max 的简称，分别代表最小堆容量和最大堆容量。
```

**堆空间不断扩缩容，会造成不必要的系统压力，所以线上生产环境，JVM的Xms和Xmx设置成大小一样，避免GC后堆区调整带来的压力。**

**3、堆空间分块**

- 新生代
  - 1个 Eden区
  - 2个Survivor
- 老年代

配置计数器阈值

```cmd
-XX:MaxTenuringThreshold=15 #默认值15，对象在Survivor区交换14后，晋升到老年代
```

![img](D:\jianguoyun\我的坚果云\assets\企业微信截图_160315531322.png)

【新对象申请在Eden区】（主要是空间的问题，只要能放得下，就会分配对象内存）

​	【如果放得下】（开辟空间分配对象内存）

​	【如果放不下则启动YGC】（新生代垃圾回收机制）

【给新生代腾空间】（结果就是垃圾回收后能不能放下）

​	【如果能放下】（直接开辟空间分配对象内存）

​	【如果放不下】（直接放入老年代，老年代存储也要看空间是否足够）

​		【如果老年代能放下】（直接开辟空间分配对象内存）

​		【如果老年代放不下则启动FGC】（启动全垃圾回收机制，给对象腾空间）

​			【FGC结果空间足够】（老年代开辟空间存对象）

​			【如果空间不够】则内存溢出OOM

【YGC机制】

​	将Eden区老的对象或清除或移动到Survivor区（没引用则清除，有引用则移动）

​	同时判断空间--如果空间足够则移动到s0区或s1区

​	如果空间不够则晋升至老年代（同理也需要判断空间及启动相应处理机制）

​	每次YGC都会判断s0和s1区存活阈值，同时对象在这两个区做交换

每次YGC时所有的旧对象在s0和s1区相互交换，之所以要两块内存是为了判断对象存活阈值是否达到，如果达到阈值则对象晋升老年代。

---

**4、YGC新生代垃圾回收**

**5、FGC垃圾回收**

##### 堆JVM参数设定

```
-Xms256M -Xmx1024M # jvm堆内存大小参数设定，ms：memory start mx：memory max
-XX:MaxTenuringThreshold=15 # 存活区交换次数默认15  1：直接从Eden区移至Old区
-XX:+HeapDumpOnOutOfMemoryError # 内存溢出错误堆内错误信息
```

#### 元空间Metaspace

JDK8元空间的前身为Perm区（永久代）已经被淘汰。

**元空间的前身永久代Perm被淘汰原因**

Perm启动内存大小固定，调优困难。FGC时会移动类元信息。如果动态加载类过多，会造成Perm区内存溢出OOM。

JDK8以后Perm被元空间代替，常量池被移到堆区，其他信息如类元信息、字段、静态属性、方法、常量被移动到元空间。

##### JVM参数设定

```xml
-XX:MaxPermSize=1280m # 该参数在JDK8以后被删除，如果显示配置jvm也不会报错，但会给出提示：Java Hotspot 64Bit Server VM warning：ignoring option MaxPermSize=2560m；support was removed in 8.0。
```

#### JVM Stack（虚拟机栈）

**jvm虚拟机栈是什么？**

是表述Java方法执行的内存区域（且线程私有:是不是说明每个线程都有自己的虚拟机栈）

虚拟机栈内存储着栈帧，且只能操作栈顶栈帧。（压栈弹栈）

**栈帧组成**

- 局部变量表（存方法参数和局部变量的区域，index[0]是所属对象实例引用）
- 操作栈（初始为空的桶式结构栈）
- 动态连接（每个栈帧包含一个在常量池中对当前方法的引用）
- 方法返回地址（正常退出、异常退出

**操作栈和局部变量表交互说明**

```
// Java代码
public int add(){
	int x = 13;
	int y = 14;
	int z = x + y;
	return z;
}
```

```class
// 字节码操作顺序
public add() ; 
descriptor:() 
flags:ACC_PUBLIC 
Code:
	stack=2, locals=4, args_Size=1
		BIPUSH 13  # 压栈（操作栈）
		ISTORE_1   # 弹栈 存s1（局部变量表）

		BIPUSH 14  # 压栈
		ISTORE_2   # 弹栈 存s2
 
		ILOAD_1    # 压栈 s1值（将slot_1中的值压栈）
		ILOAD_2    # 压栈 s2值
		IADD       # 弹栈 s1 s2 CPU加和 并结果压栈
		ISTORE_3   # 弹栈 存s3
		
		ILOAD_3    # 压栈 存s3
		IRETURN    # 弹栈 s3
```

面试题：i++和++i的区别

++操作是在局部变量表进行的：iinc操作

所有有：先压栈还是先++从而影响结果。

i++是先压栈，后++，再弹栈，是非原子操作，有多线程问题，即使通过volatile修饰也会产生数据相互覆盖问题。

**方法返回地址退出的三种可能**

- 返回值压入上层调用栈帧
- 异常信息抛给能够处理的栈帧
- PC计数器指向方法调用后的下一条指令

#### 本地方法栈（native method stacks)

也是表述Java方法执行的内存区域，也是线程私有的，为调用本地方法服务。



本地方法通过JNI（Java native Interface）来访问虚拟机运行时的数据区，甚至可以调用寄存器，具有和jvm相同的权限和能力。内存不足也会造成本地方法栈内存溢出。

大量调用本地方法会架空jvm，导致jvm稳定性降低，可以使用中间框架解耦，提升jvm稳定性。如果要求高效率也可以考虑设计为JNI调用方式。

#### 程序技术寄存器PC

Program Counter Register

CPU只有把数据装载到寄存器才能够运行。

程序计数器作用：用来存放执行指令和偏移量和行号指示器等。

CPU时间片切换时使用程序计数器记录执行位置。用于线程的执行和恢复

---

堆区和元空间是线程共享的。

虚拟机栈、本地方法栈、程序计数器是线程私有的。

![img](D:\jianguoyun\我的坚果云\assets\企业微信截图_16031636889249.png)



### 4、对象实例化

```java
Object ref = new Object()
```

![img](E:\jianguoyun\我的坚果云\assets\企业微信截图_16031753593718.png)

#### 字节码对象实例化过程

- NEW:创建对象，先找Class类对象，否则先进行类加载。

  分配内存（属性分配内存，0值初始化）

  引用ref也是一个变量，占4个字节存储。

  将指向实例对象的引用变量压栈。

- DUP：在栈顶复制引用变量压栈（两个引用变量）

  如果<init>方法有参数，还需要将参数压栈，这里没有则，栈中只有两个实例引用变量。

- INVOKESPECIAL：调用实例方法，通过栈顶引用调用<init>方法。

  <clinit> 是类初始化时执行的方法 而＜init> 是对象初始化时执行的方法。

#### 程序执行步骤初始化

- 确认元信息是否存在。

  ```
  当jvm收到new指令时
  1、检查元空间Metaspace中类元信息是否存在。
  2、若不存在：双亲委派类加载类元信息并生成Class对象。（ClassLoader＋包名＋类名为 Key 进行查找对应的.class 文件。）
  3、若找不到则抛异常：ClassNotFoundException
  ```

- 分配对象内存

  ```
  Object ref = new Object()
  1、计算对象占用空间new Object()
  2、ref分配引用变量空间4字节
  3、堆区分配对象内存
  分配内存空间时必须是同步操作，方式采用：CAS、失败重试、区域加锁等保证分配操作原子性。
  ```

- 设定默认值

  ```java
  成员变量设置默认值，即零值（根据具体类型null等）
  ```

- 设置对象头

  ```java
  设置对象的：哈希码、GC信息、锁信息、对象所属的类元信息等
  ```

- 执行init方法

  ```java
  初始化成员变量、执行实例化代码、调用构造函数。
  将堆内对象的首地址赋值给引用变量
  ```

### 5、垃圾回收

Java会自动做内存管理，使上层业务更安全更无脑的使用内存-只关注程序逻辑。

**垃圾回收的目的**

清除不再使用的对象，自动释放内存。

**GC是如何判断对象是否可以被回收？**

即判断对象是否存活，jvm引入GC Roots。如果一个对象与GC Roots之间没有直接和间接引用关系，则认为可以被回收。

**什么对象可以作为GC Roots？**

类静态属性中引用的对象

常量引用的对象

虚拟机栈中引用的对象

本地方法栈中引用的对象

**垃圾回收算法**

- 标记-清除算法

  ```
  GC Roots出发，标记引用关系的对象，剩下的清除
  导致大量空间碎片，导致要分配连续大内存时，触发FGC
  ```

- 标记-整理算法

  ```
  GC Roots出发，标记存活对象，并将存活对象整理到内存空间一端，形成连续的已用空间，最后把其余的空间清理
  ```

- 标记-复制算法

  ```
  开辟两块空间，每次只激活一块，gc时将活对象复制到未激活空间并激活该空间，将原已激活空间标记未激活，
  然后清除原空间的对象。
  ```

**垃圾回收器**

是jvm垃圾回收的具体实现，版本很多。

- Serial：用于YGC，STW暂停应用回收

- CMS：并发标记扫描回收器，也会STW

  ```
  -XX :+UseCMSCompactAtFullCollection # 强制jvm在FGC后对老年代压缩，执行一次空间碎片整理，整理阶段会触发STW
  -XX +CMSFullGCsBeforeCompaction=n # 在执行n次FGC后，执行老年代空间碎片整理
  ```

- G1：自带压缩功能，避免碎片问题，STW时间可控性更高，jdk11默认回收器

  ```
  -XX:+UseG1GC 
  ```

  G1将堆空间分割成相同大小区域region，四种类型

  - Eden
  - Survivor
  - Old
  - Humongous

G1的原理是，分割整理机制，优先清理垃圾最多的区域，采用Mark-Copy算法，不会有碎片化问题，且可预测STW时间。

---

垃圾回收机制思想：主要采用分割整理思想。

整理思想：标记整理Mark-Compact

分割思想：标记复制Mark-Copy

多分割：G1回收器，任务分解后采用Mark-Copy，既加快了回收速度，又避免了碎片化触发FGC

---

