## 断路器Hystrix

---

## 引言

在微服务架构中，服务之间要相互调用（RPC），在spring Cloud中可以使用Feign和RestTemplate+ribbon。服务集群经常由于网络或自身原因，导致服务不可用，容易出现线程阻塞，导致瘫痪。服务调用又可能导致故障传播，对微服务集群造成灾难性后果，即服务故障的“雪崩”效应。

于是引出断路器模式来避免雪崩事故。

## 断路器Hystrix
Netflix开源的Hystrix组件，实现了断路器模式，SpringCloud对这一组件进行了整合。
较底层的服务如果出现故障，会导致连锁故障。当对特定的服务的调用的不可用达到一个阀值（Hystric 是5秒20次） 断路器将会被打开。
断路打开后，可用避免连锁故障，fallback方法可以直接返回一个固定值。

```
 <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-hystrix</artifactId>
        </dependency>
```

```
@SpringBootApplication
@EnableEurekaClient
@EnableCircuitBreaker // 断路器
public class EurekaClientRibbonApplication {

    public static void main(String[] args) {
        SpringApplication.run(EurekaClientRibbonApplication.class, args);
    }
```

```
@HystrixCommand(fallbackMethod = "producerError")// 故障回调方法
    public String hello(String name){
        String s = restTemplate.getForObject("http://spring-cloud-producer/hello?name=" + name, String.class);
        return s;
    }

    public String producerError(String name){
        return "hello "+ name + " spring-cloud-producer service error!";
    }
```

