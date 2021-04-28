### SpringBoot之整合activemq

#### 引入依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-activemq</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```

#### 配置mq

```properties
spring.activemq.broker-url=tcp://127.0.0.1:61616
spring.activemq.packages.trust-all=true
spring.activemq.user=admin
spring.activemq.password=admin
```

#### 配置一个ActiveMQQueue

```java
@Bean
Queue queue(){
    return new ActiveMQQueue("hello.zhangsan");
}
```

#### 配置消息组件template即队列

```java
@Component
public class JmsComponent {
    @Autowired
    JmsMessagingTemplate jmsMessagingTemplate;
    @Autowired
    Queue queue;

    public void send(Message message) {
        jmsMessagingTemplate.convertAndSend(this.queue, message);
    }

    @JmsListener(destination = "hello.zhangsan")
    public void receive(Message msg) {
        System.out.println(msg);
    }
}
```

#### 测试

```java
 @Autowired
    JmsComponent jmsComponent;

    @Test
    public void contextLoads() {
        Message message = new Message();
        message.setContent("hello mq!");
        message.setSendDate(new Date());
        jmsComponent.send(message);
    }
```

#### springboot对activemq的配置解析

```properties
spring.activemq.broker-url=指定ActiveMQ broker的URL，默认自动生成.
spring.activemq.in-memory=是否是内存模式，默认为true.
spring.activemq.password=指定broker的密码.
spring.activemq.pooled=是否创建PooledConnectionFactory，而非ConnectionFactory，默认false
spring.activemq.user=指定broker的用户.
spring.activemq.packages.trust-all=false 信任所有的包默认false

# 如果传输的对象是Obeject 这里必须加上这句或者指定信任的包 否则会导致对象序列化失败 出现classnotfound异常 详细： http://activemq.apache.org/objectmessage.html

spring.activemq.packages.trusted= 指定信任的包,当有信任所有的包为true是无效的
spring.activemq.pool.configuration.*= 暴露pool配置
spring.activemq.pool.enabled=false 是否使用PooledConnectionFactory
spring.activemq.pool.expiry-timeout=0 连接超时时间

#spring.activemq.pool.idle-timeout=30000 空闲时间

spring.activemq.pool.max-connections=1 最大连接数
spring.jms.jndi-name=指定Connection factory JNDI 名称.
spring.jms.listener.acknowledge-mode=指定ack模式，默认自动ack.
spring.jms.listener.auto-startup=是否启动时自动启动jms，默认为: true
spring.jms.listener.concurrency=指定最小的并发消费者数量.
spring.jms.listener.max-concurrency=指定最大的并发消费者数量.
spring.jms.pub-sub-domain=是否使用默认的destination type来支持 publish/subscribe，默认: false
```



