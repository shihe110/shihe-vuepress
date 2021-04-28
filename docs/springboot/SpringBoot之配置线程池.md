### SpringBoot之配置线程池

#### 四种常见线程池

- CacheThreadPool

  可缓存的线程池，该线程池中没有核心线程，非核心线程的数量为Integer.max_value，就是无限大，当有需要时创建线程来执行任务，没有需要时回收线程，适用于耗时少，任务量大的情况。

- SecudleThreadPool

  :周期性执行任务的线程池，按照某种特定的计划执行线程中的任务，有核心线程，但也有非核心线程，非核心线程的大小也为无限大。适用于执行周期性的任务。

- SingleThreadPool

  只有一条线程来执行任务，适用于有顺序的任务的应用场景。

- FixedThreadPool

  定长的线程池，有核心线程，核心线程的即为最大的线程数量，没有非核心线程

#### SpringBoot线程池配置

```java
@Configuration
@EnableAsync
public class TaskPoolConfig {

    @Bean("taskExecutor")
    public Executor taskExecutro(){
        ThreadPoolTaskExecutor taskExecutor = new ThreadPoolTaskExecutor();
        taskExecutor.setCorePoolSize(10);
        taskExecutor.setMaxPoolSize(50);
        taskExecutor.setQueueCapacity(200);
        taskExecutor.setKeepAliveSeconds(60);
        taskExecutor.setThreadNamePrefix("taskExecutor--");
        taskExecutor.setWaitForTasksToCompleteOnShutdown(true);
        taskExecutor.setAwaitTerminationSeconds(60);
        return taskExecutor;
    }
}
```

#### 使用线程池

```java
@Component
public class AsyncTask {
    @Async("taskExecutor")
    public void tesTask(int i){
        System.out.println(Thread.currentThread().getName()+"-----"+i);
    }
    @Async("taskExecutor")
    public void stringTask(String str){    System.out.println(Thread.currentThread().getName()+str);
    }
}
```

