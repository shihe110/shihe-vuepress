## ThreadLocal线程本地变量

### 什么是ThreadLocal？他解决了什么问题？

ThreadLocal解决的是每个线程需要有自己的独立的实例，而且这个实例的修改不会影响到其他线程。

解决多线程 共享变量的问题.

ThreadLocal存入的对象就不该是同一个。这玩意不保证线程安全。
所谓的副本是指，A线程存入的值，对B线程并不感知，B只能拿到自己存的值，并不能拿到A存入的值。
因为一般情况下ThreadLocal 都是定义为static类型的，如果没有ThreadLocal，那么B线程就可以获取A线程所存入的值。

>ThreadLocal 提供了线程本地的实例。它与普通变量的区别在于，每个使用该变量的线程都会初始化一个完全独立的实例副本。ThreadLocal 变量通常被private static修饰。当一个线程结束时，它所使用的所有 ThreadLocal 相对的实例副本都会被回收。

ThreadLocal 非常适用于这样的场景：每个线程需要自己独立的实例且该实例需要在多个方法中使用。当然，使用其它方式也可以实现同样的效果，但是看完这篇文章，你会发现 ThreadLocal 会让实现更简洁、更优雅！


ThreadLocal 并不解决线程间共享数据的问题
ThreadLocal 通过隐式的在不同线程内创建独立实例副本避免了实例线程安全的问题
每个线程持有一个 Map 并维护了 ThreadLocal 对象与具体实例的映射，该 Map 由于只被持有它的线程访问，故不存在线程安全以及锁的问题
ThreadLocalMap 的 Entry 对 ThreadLocal 的引用为弱引用，避免了 ThreadLocal 对象无法被回收的问题
ThreadLocalMap 的 set 方法通过调用 replaceStaleEntry 方法回收键为 null 的 Entry 对象的值（即为具体实例）以及 Entry 对象本身从而防止内存泄漏
ThreadLocal 适用于变量在线程间隔离且在方法间共享的场景


