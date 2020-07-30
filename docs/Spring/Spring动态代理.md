## Spring静态代理

小米自营和代理商销售的例子
小米工厂自营（）
代理商销售（）

抽象一个销售接口
代理商持有一个销售接口的引用，去调用小米工厂销售方法，同时可以增加售前广告动作和售后服务动作。

静态代理的问题在于，可扩展性不行，如果新业务为卖电脑就要创建新的电脑代理类取完成卖电脑。
进而需要做动态代理：

## 动态代理 cglib和jdk

## jdk动态代理
实现步骤：
- 1.代理类需要实现InvocationHandler接口
- 2.实现invoke方法
- 3.通过Proxy类的newProxyInstance方法来创建代理对象。

```
1.定义接口

public interface MyCalculator {
    int add(int a, int b);
}
2.定义计算机接口的实现：

public class MyCalculatorImpl implements MyCalculator {
    public int add(int a, int b) {
        return a+b;
    }
}
3.定义代理类

public class CalculatorProxy {
    public static Object getInstance(final MyCalculatorImpl myCalculator) {
        return Proxy.newProxyInstance(CalculatorProxy.class.getClassLoader(), myCalculator.getClass().getInterfaces(), new InvocationHandler() {
            /**
             * @param proxy 代理对象
             * @param method 代理的方法
             * @param args 方法的参数
             * @return
             * @throws Throwable
             */
            public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                System.out.println(method.getName()+"方法开始执行啦...");
                Object invoke = method.invoke(myCalculator, args);
                System.out.println(method.getName()+"方法执行结束啦...");
                return invoke;
            }
        });
    }
}
```
