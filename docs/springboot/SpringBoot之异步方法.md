### Springboot异步方法

```java
@SpringBootApplication
@EnableAsync
public class ShiheSpringbootAsyncApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShiheSpringbootAsyncApplication.class, args);
    }

    @Bean
    public Executor taskExecutor(){
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(2);
        executor.setQueueCapacity(500);
        executor.setThreadNamePrefix("githublookup-");
        executor.initialize();
        return executor;
    }
}
```



```java
@Service
public class GitHubLookupService {
    private static final Logger logger = LoggerFactory.getLogger(GitHubLookupService.class);

    private final RestTemplate restTemplate;

    public GitHubLookupService(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder.build();
    }

    @Async
    public CompletableFuture<User> findUser(String user) throws InterruptedException {
        logger.info("Looking up " + user);
        String url = String.format("https://api.github.com/users/%s", user);
        User results = restTemplate.getForObject(url, User.class);
        
        return CompletableFuture.completedFuture(results);
    }
}
```

