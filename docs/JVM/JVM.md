#### 1、JVM组成部分和其作用？

![](https://gitee.com/shihe110/imgBed/raw/master/imgBed/jvm.png)

**jvm组成**：2个子系统、2个组件

- 类加载系统（ClassLoader)：根据给定类的全限定名加载class文件到Runtime data area中的Method area。
- 执行引擎（Execution engine）：执行classes中的命令。
- 运行时数据区（Runtime data area）：JVM内存。
- 本地接口（Native Interface)：和本地库交互，是其他编程语言交互的接口。

**作用**：首先通过编译器（javac）将Java代码编译成字节码（class文件），有类加载器将字节码，加载到运行时数据区（Runtime data area）的方法区（Method area）。再通过执行引擎（Execution Engine），将字节码翻译成底层系统指令，再交给CPU执行。而这个过程中需要调用其他语言的本地方法库（Native Interface）结构来实现整个程序的功能。

#### 2、类加载是什么？

类加载器将.class文件加载到内存中，放在运行时数据区【jvm内存区】的方法区【元数据区】，并在堆空间创建一个Java.lang.Class对象，用来封装类在方法区内的数据结构。

#### 3、JVM运行时数据区（jvm内存布局）？

- 程序计数器：（记录执行到哪儿了）当前线程执行的字节码的行号指示器。【记录程序执行的】
- jvm栈：存储局部变量表，操作数栈、动态链接、方法出口等信息。【为执行java方法服务的】
- 本地方法栈：为虚拟机调用本地方法服务的操作栈。【调用本地方法服务的】
- 堆：jvm中内存最大的一块，线程共享区域。存所有对象实例的【对象实例锁存的内存区域】。
- 方法区【元数据区】：存储已被虚拟机加载的类信息、常量、静态变量、及时编译后的代码等。【存元数据】

#### 4、什么是深拷贝和浅拷贝？

```
数据类型：
1、基本数据类型【(String, Number, Boolean, Null, Undefined，Symbol)】：直接存在stack中
2、引用数据类型【对象数据类型】：将引用存在stack中【指针】，真实数据存在堆heap中。
```

**深拷贝和浅拷贝是只针对Object和Array这样的引用数据类型的**。

![img](https://gitee.com/shihe110/imgBed/raw/master/imgBed/%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_16045461268763.png)

**浅拷贝只复制指向某个对象的指针，而不复制对象本身，新旧对象还是共享同一块内存。但深拷贝会另外创造一个一模一样的对象，新对象跟原对象不共享内存，修改新对象不会改到原对象。**

浅拷贝（shallowCopy）只是增加了一个指针指向已存在的内存地址，

深拷贝（deepCopy）是增加了一个指针并且申请了一个新的内存，使这个增加的指针指向这个新的内存，

使用深拷贝的情况下，释放内存的时候不会因为出现浅拷贝时释放同一个内存的错误。

浅复制：仅仅是指向被复制的内存地址，如果原地址发生改变，那么浅复制出来的对象也会相应的改变。

深复制：在计算机中开辟一块**新的内存地址**用于存放复制的对象。

#### 5、堆和栈的区别？

堆：存对象实例和数组的内存空间，物理地址不连续。线程共享区域。

栈：存局部变量、操作数栈，动态链接、方法出口等返回结果的内存区域，物理地址连续。线程私有。

- 1、静态变量放方法区

- 2、静态对象放堆区。

#### 6、队列和栈的区别？

数据结构-存储数据的

栈：先进后出，像个桶。-栈顶操作

队列：先进先出，像个管。-首尾操作

#### 7、HotSpot虚拟机对象？

https://thinkwon.blog.csdn.net/article/details/104390752

Java创建对象的5种方式：

JVM创建对象过程：jvm遇到new指令时，先检查常量池是否加载该类，没有，就先类加载。然后分配内存。如果Java的内存是绝对规整的，使用“指针碰撞”方式分配内存；如果不规整，使用“空闲列表”分配。同时划分内存考虑并发问题，使用CAS通过处理，或使用本地线程分配缓冲。然后将分配的内存初始化，接着做一些必要设置，最后执行init方法。

jvm创建对象时2种内存分配方式：指针碰撞、空闲列表

jvm创建对象时2种处理并发方式：CAS同步（Compare And Swap比较替换）、本地线程分配缓冲

总结对象创建：检查是否类加载、分配内存、内存初始化、执行init方法。

**分配内存细节：**指针碰撞/空闲列表、同步问题（CAS/本地线程分配缓冲)

#### 8、jvm对象内存分配方式？

- 指针碰撞：如果Java堆内存是规整的，即用过的内存在一边，空闲的在另一边。分配内存时将位于中间的指针指示器向空闲内存移动一段距离（和对象大小相等），来完成内存分配工作。
- 空闲列表：如果Java堆内存不规整的，则需要有虚拟机维护一个列表来标记哪些内存是可用的，这样在分配内存时，从列表中查询到足够大的内存分配给对象，并在分配后更新列表记录。

![img](https://gitee.com/shihe110/imgBed/raw/master/imgBed/%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_160455947422.png)

#### 9、分配内存时如何处理并发安全问题？

（Compare and Swap）

- CAS：对分配内存空间的动作进行同步处理【采用CAS+失败重试来保障操作原子性】。

- TLAB：把内存分配的动作按照线程划分在不同的空间中进行，即每个线程在Java堆中预先分配一小块内存，称为本地线程分配缓冲。那个线程要分配内存，就在哪个线程的TLAB上分配。只有TLAB用完并分配新的TLAB时，才需要同步锁。

  `通过jvm参数设定虚拟机是否使用TLAB：-XX:+/-UserTLAB`

思考总结：分配内存在堆中，堆内存是线程共享的。TLAB：相当于在共享内存空间给每个线程一小块私有空间，来做对象的内存分配。CAS：在共享内存中加锁的方式来分配空闲内存，避免多线程竞争。

![image-20201105151420854](https://gitee.com/shihe110/imgBed/raw/master/imgBed/image-20201105151420854.png)

10、jvm对象的访问方式？

栈上的引用怎么访问堆中的具体对象？

根据虚拟机的不同实现方式分两种：**句柄访问**、**直接指针访问**

**句柄**：理解为指向指针的指针，维护着对象的指针。句柄不直接指向对象，而是指向对象的指针，再由对象的指针指向对象的真实内存地址。（句柄不发生变化，指向固定内存地址）。

**指针：**指向对象，代表一个对象在内存中的起始地址。

**句柄访问**：从栈引用[保存句柄地址]出发--堆中的句柄池[句柄保存实例数据指针和方法区类型数据指针并指向这两块内存]。优势：引用中存储的是**稳定**句柄地址，在对象被移动时只会改变**句柄中的实例数据指针**，而引用本身不需要修改。

**直接指针访问**：引用直接存储实例数据地址，实例数据内部存储类型数据地址-指向类型数据。少了一个句柄池指针操作，速度更快。HotSpot采用该方式。

#### 10、Java内存泄漏是什么？

简单说内存泄漏：无用的对象或变量一直被占据在内存中。

GC负责清理无用对象，但任然有内存泄漏情况。

Java内存泄漏的原因：长生命周期对象持有短生命周期对象的引用就可能发生内存泄漏。尽管短周期对象已经无用，但长生命周期对象持有他的引用，导致短周期对象无法被回收。

#### 11、内存溢出是什么？

内存不够用了溢出了，溢出的原因，可能是由于内存泄漏造成的。

#### 12、简述Java垃圾回收机制?

java中，不需要程序猿显式释放内存，由虚拟机自行执行。在JVM中，有一个垃圾回收线程，优先级比较低，在内存不足或JVM虚拟机空闲的时候，触发垃圾回收。他会扫描哪些没有引用的对象，并将它们添加到回收集合，进行回收。

#### 13、GC是什么？为什么要GC？

垃圾回收。错误或异常回收会导致系统不稳定甚至崩溃。Java提供了垃圾回收功能，自动执行垃圾回收。Java并没有提供释放已分配内存的显式操作方法。

内存是有限的，合理的利用内存空间的结果。

#### 14、System.gc会触发垃圾回收吗？

不能立即触发垃圾回收，只是建议虚拟机垃圾回收，但不一定会发生GC。



#### 15、垃圾回收的基本原理？

gc监控对象的地址，大小和使用情况。

通常，GC采用有向图的方式记录和管理堆中的所有对象。通过这种方式，确定哪些对象是“可达的”，哪些是“不可达的”。gc负责把不可达的对象回收。

#### 16、Java中的引用类型分类？

- 强引用：GC时不会被回收
- 软引用：有用但不是必须的，发生溢出前回收。
- 弱引用：有用但不是必须的，在下次GC时回收。
- 虚应用：无法通过虚引用获取对象，用PhantomReference实现虚引用，虚引用的用途是在GC时返回一个通知。--重要对象回收监听，日志统计，GC监听。

#### 17、什么是虚引用？有什么用？

"虚引用"顾名思义，就是形同虚设，与其他几种引用都不同，虚引用并不会决定对象的生命周期。如果一个对象仅持有虚引用，那么它就和没有任何引用一样，在任何时候都可能被垃圾回收。
虚引用主要用来跟踪对象被垃圾回收的活动。虚引用与软引用和弱引用的一个区别在于：虚引用必须和引用队列（ReferenceQueue）联合使用。当垃 圾回收器准备回收一个对象时，如果发现它还有虚引用，就会在回收对象的内存之前，把这个虚引用加入到与之关联的引用队列中。程序可以通过判断引用队列中是 否已经加入了虚引用，来了解
被引用的对象是否将要被垃圾回收。程序如果发现某个虚引用已经被加入到引用队列，那么就可以在所引用的对象的内存被回收之前采取必要的行动。

**作用：**深入理解JAVA虚拟机一书中有这样一句描述：**“为一个对象设置虚引用关联的唯一目的就是能在这个对象被收集器回收时收到一个系统通知”。**所以虚引用更多的是用于对象回收的监听，能做的功能如下：

重要对象回收监听 进行日志统计

系统gc监听 因为虚引用每次GC都会被回收，那么我们就可以通过虚引用来判断gc的频率，如果频率过大，内存使用可能存在问题，才导致了系统gc频繁调用

#### 18、如何判断对象是否可以被GC？

两种方法：

- 1.引用计数器法：为每个对象创建一个引用计数，有对象引用计数器+1，引用释放-1，当计数器为0时就可以被回收。**缺点**：循环引用无法解决。
- 2.可达性分析算法：从 GC Roots 开始向下搜索，搜索所走过的路径称为引用链。当一个对象到 GC Roots 没有任何引用链相连时，则证明此对象是可以被回收的。

#### 19、JVM有哪些垃圾回收算法？

- 标记清除：标记无用对象，清除回收。**缺点**：效率不高，易产生空间碎片。**优点：**实现简单，不需要移动对象。
- 复制算法：空间分等大小两份，每次只使用其中一个区域，活对象复制到一个区域，另一个区域清空。**缺点**：内存使用率只有一半，对象存活率高时会频繁复制。**优点**：按顺序分配内存，实现简单，高效，没有内存碎片问题。
- 标记-整理：标记无用对象，将活对象整理到内存一边，清除另一边。一般用在老年代-对象存活率比较高。**缺点**：对象也需要局部移动，效率降低。**优点**：没有碎片问题。
- 分代算法：根据对象生存周期将内存划分几块（新生代、老年代、永久代），新生代采用复制算法，老年代使用标记-整理算法。

#### 20、JVM有哪些垃圾回收器？

垃圾回收器就是垃圾回收算法的具体实现。

7种收集器：新生代3种、老年代3种、堆回收1种

新生代：Serial、PraNew、Scavenge

老年代：Serial Old、Parallel Old、CMS

全局堆：G1

![](https://gitee.com/shihe110/imgBed/raw/master/imgBed/gc_selector.png)

```
1、Serial收集器：（复制算法）新生代单线程收集器，标记和清理都是单线程，优点简答高效。
2、ParNew收集器：（复制算法）新生代并行收集器，实际是Serial收集器的多线程版本，在多CPU环境下比单线程版表现更好。
3、Parallel Scavenge收集器：（复制算法）新生代并行收集器，追求高吞吐量，高效利用CPU。吞吐量 = 用户线程时间/(用户线程时间+GC线程时间)，高吞吐量可以高效率的利用CPU时间，尽快完成程序的运算任务，适合后台应用等对交互相应要求不高的场景；追求速度。
4、Serial Old收集器：（标记-整理算法）老年代单线程收集器，Serial老年代版本。
5、Parallel Old收集器：（标记-整理算法）老年代并行收集器，吞吐量优先。Parallel Scavenge的老年代版本。
6、CMS收集器（Concurrent Mark Sweep标记-清除算法）：老年代并行收集器，以获取最短回收停顿时间为目标，有高并发，低停顿，追求最短GC回收停顿时间。
7、G1收集器（Garbage First标记-整理算法）：Java并行收集器，g1收集器是jdk1.7提供的新收集器，基于标记-整理算法实现，没有碎片问题。此外，G1不同于之前的收集器的一个重要特点是：G1回收范围是整个Java堆空间，前6种仅限于新生代和老年代。
```

#### 21、CMS 垃圾回收器？

CMS 是英文 Concurrent Mark-Sweep 的简称，是以牺牲吞吐量为代价来获得最短回收停顿时间的垃圾回收器。对于要求服务器响应速度的应用上，这种垃圾回收器非常适合。在启动 JVM 的参数加上“-XX:+UseConcMarkSweepGC”来指定使用 CMS 垃圾回收器。

CMS 使用的是标记-清除的算法实现的，所以在 gc 的时候回产生大量的内存碎片，当剩余内存不能满足程序运行要求时，系统将会出现 Concurrent Mode Failure，临时 CMS 会采用 Serial Old 回收器进行垃圾清除，此时的性能将会被降低。

#### 22、分代垃圾回收器是怎么工作的？

分代回收器有两个分区：新生代和老年代，新生代默认占1/3、老年代占2/3。

新生代使用的是复制算法，新生代里有 3 个分区：Eden、To Survivor、From Survivor，它们的默认占比是 8:1:1，它的执行流程如下：

- 把 Eden + From Survivor 存活的对象放入 To Survivor 区；
- 清空 Eden 和 From Survivor 分区；
- From Survivor 和 To Survivor 分区交换，From Survivor 变 To Survivor，To Survivor 变 From Survivor。

每次在 From Survivor 到 To Survivor 移动时都存活的对象，年龄就 +1，当年龄到达 15（默认配置是 15）时，升级为老生代。大对象也会直接进入老生代。

老生代当空间占用到达某个值之后就会触发全局垃圾收回，一般使用标记整理的执行算法。以上这些循环往复就构成了整个分代垃圾回收的整体执行流程。

#### 23、简述Java内存分配和回收策略及Minor GC和Major GC？

内存管理：内存分配、内存回收。

对象内存分配--堆deap，对象主要分配在**Eden区**，如果启动本地线程缓冲，按优先级在**TLAB**上分配。少数会直接在**老年代**分配。

JVM内存分配规则：

- **1.优先在Eden区分配**
- **2.大对象直接进入老年代**
- **3.长期存活对象进入老年代**

1、多数时间，对象都在Eden区分配内存。当Eden区没有足有空间，JVM会启动Minor GC（YGC）。gc过后，如果还没有足够空间，将在老年代分配内存。

2、大对象指需要连续内存的对象，频繁出现会导致频繁YGC，并触发GC来获得足够空间。新生代采用复制算法处理垃圾回收。如果大对象出现在Eden区和两个S区，会频繁触发YGC发生大量对象内存复制。所以直接放到老年代。

3、除了 大对象放入老年代，JVM还会判断哪些老对象进入老年代。于是定义了对象年龄计数器。如果对象在Eden区出生，并且能被s区容纳，被移动到S区就年龄为1，每次YGC在S区交换一次就+1，当年龄到15（默认值）时，就晋升至老年代。

#### 24、Java类加载过程？

虚拟机把将Class文件加载到内存、并进行数据校验,准备,解析 和初始化，最终形成可被虚拟机直接使用的Java类型。

总结：加载Load、链接Link、初始化init

链接：过程又分为，验证、准备、解析3个阶段

汇总：

​	加载：将class加载到内存。

​	验证：检查class文件正确性

​	准备：给类中的静态变量分配空间

​	解析：将常量池中的符号引用替换成直接引用。确保类和类间的引用正确性。

​	初始化：对静态变量和静态代码块执行初始化工作。

#### 25、JVM加载class文件原理机制？

JVM通过类加载器加载class文件

类装载方式：类加载是动态的

- 隐式：new
- 显示：Class.forname()

#### 26、类加载器？

**什么是类加载器**：类加载器是一段代码，通过类的全限定名获取该类的二进制字节流的代码块实现，叫类加载器。

类加载器：

- 根类加载器
- 平台类加载器（扩展）
- 应用类加载器
- 用户自定义类加载器：通过继承Java.lang.ClassLoader类实现。

#### 26、类加载的时机？

1. 创建类的实例，也就是new一个对象
2. 访问某个类或接口的静态变量，或者对该静态变量赋值
3. 调用类的静态方法
4. 反射（Class.forName("com.lyj.load")）
5. 初始化一个类的子类（会首先初始化子类的父类）
6. JVM启动时标明的启动类，即文件名和类名相同的那个类  

**除此之外，下面几种情形需要特别指出：**

   对于一个final类型的静态变量，如果该变量的值在编译时就可以确定下来，那么这个变量相当于“宏变量”。Java编译器会在编译时直接把这个变量出现的地方替换成它的值，因此即使程序使用该静态变量，也不会导致该类的初始化。反之，如果final类型的静态Field的值不能在编译时确定下来，则必须等到运行时才可以确定该变量的值，如果通过该类来访问它的静态变量，则会导致该类被初始化。

#### 27、类加载机制？

JVM三种类加载机制

- 1、全盘负责
- 2、双亲委托
- 3、缓存机制

#### 28、JVM有哪些调优工具？

JDK 自带了很多监控工具，都位于 JDK 的 bin 目录下，其中最常用的是 jconsole 和 jvisualvm 这两款视图监控工具。

- jconsole：用于对 JVM 中的内存、线程和类等进行监控；
- jvisualvm：JDK 自带的全能分析工具，可以分析：内存快照、线程快照、程序死锁、监控内存的变化、gc 变化等

#### 29、常用jvm调优参数有哪些？

- -Xms2g：初始化堆大小为 2g；
- -Xmx2g：堆最大内存为 2g；
- -XX:NewRatio=4：设置年轻的和老年代的内存比例为 1:4；
- -XX:SurvivorRatio=8：设置新生代 Eden 和 Survivor 比例为 8:2；
- –XX:+UseParNewGC：指定使用 ParNew + Serial Old 垃圾回收器组合；
- -XX:+UseParallelOldGC：指定使用 ParNew + ParNew Old 垃圾回收器组合；
- -XX:+UseConcMarkSweepGC：指定使用 CMS + Serial Old 垃圾回收器组合；
- -XX:+PrintGC：开启打印 gc 信息；
- -XX:+PrintGCDetails：打印 gc 详细信息。

#### **30、哪些对象可以作为 GC Roots 的对象：**

- 虚拟机栈中局部变量（也叫局部变量表）中引用的对象
- 方法区中类的静态变量、常量引用的对象
- 本地方法栈中 JNI (Native方法)引用的对象 

```java
public class GCRootDemo {
    private byte[] byteArray = new byte[100 * 1024 * 1024];
 
    private static GCRootDemo gc2;// gc2-方法区-静态变量-引用
    private static final GCRootDemo gc3 = new GCRootDemo();//gc3 方法区-常量-引用
 
    public static void m1(){
        GCRootDemo gc1 = new GCRootDemo();//gc1-虚拟机栈-局部变量表-引用对象
        System.gc();
        System.out.println("第一次GC完成");
    }
    public static void main(String[] args) {
        m1();
    }
}
```

 解释：

gc1:是虚拟机栈中的局部变量

gc2:是方法区中类的静态变量

gc3:是方法区中的常量

都可以作为**GC Roots 的对象。**

#### 31、safepoint是什么-安全点操作gc线程不会异常

比如JVM要进行GC操作，或者要做heap dump等等，这时候如果线程都在对stack或者heap进行修改，那么将不是一个稳定的状态。GC直接在这种情况下操作stack或者heap，会导致线程的异常。

怎么处理呢？

这个时候safepoint就出场了。

safepoint就是一个安全点，所有的线程执行到安全点的时候就会去检查是否需要执行safepoint操作，如果需要执行，那么所有的线程都将会等待，直到所有的线程进入safepoint。

然后JVM执行相应的操作之后，所有的线程再恢复执行。

安全点位置：

1. 循环的末尾 (防止大循环的时候一直不进入safepoint，而其他线程在等待它进入safepoint)

2. 方法返回前

3. 调用方法的call之后

4. 抛出异常的位置

#### 32、GC 收集器有哪些？CMS 收集器与 G1 收集器的特点。

串行收集器：串行收集器使用一个单独的线程进行收集，GC 时服务有停顿时间

并行收集器：次要回收中使用多线程来执行

CMS 收集器是基于**标记—清除**算法实现的，经过多次标记才会被清除【CMS(Concurrent Mark and Sweep 并发-标记-清除)】

G1 从**整体来看是基于标记-整理**算法实现的收集器，从**局部（两个** **Region** **之间）**上来看是基于复制算法实现的

#### 33、 类加载的几个过程：

加载、验证、准备、解析、初始化。然后是使用和卸载了

通过全限定名来加载生成 class 对象到内存中，然后进行验证这个 class 文件，包括文

件格式校验、元数据验证，字节码校验等。准备是对这个对象分配内存。解析是将符

号引用转化为直接引用（指针引用），初始化就是开始执行构造器的代码

#### 34、java -- JVM的符号引用和直接引用

**在JVM中类加载过程中，\**在解析阶段，Java虚拟机会把类的二级制数据中的符号引用替换为直接引用。\****

1.符号引用（Symbolic References）：

　　符号引用以一组符号来描述所引用的目标，符号可以是任何形式的字面量，只要使用时能够无歧义的定位到目标即可。例如，在Class文件中它以CONSTANT_Class_info、CONSTANT_Fieldref_info、CONSTANT_Methodref_info等类型的常量出现。符号引用与虚拟机的内存布局无关，引用的目标并不一定加载到内存中。在[Java](http://lib.csdn.net/base/javaee)中，一个java类将会编译成一个class文件。在编译时，java类并不知道所引用的类的实际地址，因此只能使用符号引用来代替。比如org.simple.People类引用了org.simple.Language类，在编译时People类并不知道Language类的实际内存地址，因此只能使用符号org.simple.Language（假设是这个，当然实际中是由类似于CONSTANT_Class_info的常量来表示的）来表示Language类的地址。各种虚拟机实现的内存布局可能有所不同，但是它们能接受的符号引用都是一致的，因为符号引用的字面量形式明确定义在Java虚拟机规范的Class文件格式中。 

2.直接引用：

 直接引用可以是

（1）直接指向目标的指针（比如，指向“类型”【Class对象】、类变量、类方法的直接引用可能是指向方法区的指针）

（2）相对偏移量（比如，指向实例变量、实例方法的直接引用都是偏移量）

（3）一个能间接定位到目标的句柄

直接引用是和虚拟机的布局相关的，同一个符号引用在不同的虚拟机实例上翻译出来的直接引用一般不会相同。如果有了直接引用，那引用的目标必定已经被加载入内存中了。

#### 35、垃圾回收算法有哪些？

- 标记-清除【1、效率低  2、内存空间碎片问题，大对象分配需连续空间，可能导致提前触发GC】
- 复制算法【1、效率高  2、内存利用率低  3、用在新生代】
- 标记-整理【1、解决了碎片问题  2、效率问题】整理活的放一边，另一边清除
- 分代回收【1、新生代-复制算法清除段生命周期对象  2、老年代是长周期对象-采用标记-整理或标记-清除算法】

#### 36、JAVA** **四中引用类型**

**强引用**

在 Java 中最常见的就是强引用，把一个对象赋给一个引用变量，这个引用变量就是一个强引

用。当一个对象被强引用变量引用时，它处于可达状态，它是不可能被垃圾回收机制回收的，即

使该对象以后永远都不会被用到 JVM 也不会回收。因此强引用是造成 Java 内存泄漏的主要原因之

一。

**软引用**

软引用需要用 SoftReference 类来实现，对于只有软引用的对象来说，当系统内存足够时它

不会被回收，当系统内存空间不足时它会被回收。软引用通常用在对内存敏感的程序中。

**弱引用**

弱引用需要用 WeakReference 类来实现，它比软引用的生存期更短，对于只有弱引用的对象

来说，只要垃圾回收机制一运行，不管 JVM 的内存空间是否足够，总会回收该对象占用的内存。

**虚引用**

虚引用需要 PhantomReference 类来实现，它不能单独使用，必须和引用队列联合使用。虚

引用的主要作用是跟踪对象被垃圾回收的状态。



#### 37、java虚拟机栈

**栈帧的组成：**

- 局部变量表：方法的参数、局部变量
- 操作数栈：操作栈，压栈、弹栈、计算
- 动态链接：指向运行时常量池的方法引用。符号引用转换成直接引用。
- 方法出口：

动态链接：

![img](https://gitee.com/shihe110/imgBed/raw/master/imgBed/20200906223738224.png)

#### 38、类加载过程-类加载器

- 加载
- 链接
- 初始化

##### 加载：加载class文件到方法区，初步校验，创建类实例。

##### 链接：验证、准备、解析，完成内存布局。

##### 初始化：构造初始化


