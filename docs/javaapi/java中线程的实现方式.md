## java多线程实现的两种方式

## 1.继承Thread类，复写run()方法作为线程操作主体。

```
public class CustomThread extends Thread {
    private String threadName;
    public CustomThread(String threadName) {
        this.threadName = threadName;
    }
    @Override
    public void run() {
        for (int i = 0; i < 10; i++) {
            System.out.println(threadName + "启动执行！ "+i);
        }
    }
}

public static void main(String[] args) {
        CustomThread thread = new CustomThread("线程A");
        CustomThread thread2 = new CustomThread("线程B");
        CustomThread thread3 = new CustomThread("线程C");

        thread.start();
        thread2.start();
        thread3.start();
    }
```

## 2.实现Runnable接口，复写run()方法作为线程操作主体。

```
public class CustomThreadV2 implements Runnable{
    private String threadName;
    public CustomThreadV2(String threadName) {
        this.threadName = threadName;
    }

    public void run() {
        for (int i = 0; i < 10; i++) {
            System.out.println(threadName+" 启动！ "+i);
        }
    }
}

    public static void main(String[] args) {
        CustomThreadV2 thread = new CustomThreadV2("线程A");
        CustomThreadV2 thread2 = new CustomThreadV2("线程B");
        CustomThreadV2 thread3 = new CustomThreadV2("线程C");

        Thread t1 = new Thread(thread);
        Thread t2 = new Thread(thread2);
        Thread t3 = new Thread(thread3);

        t1.start();
        t2.start();
        t3.start();
    }
```