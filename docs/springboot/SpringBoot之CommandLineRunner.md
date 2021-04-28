### CommandLineRunner接口和ApplicationRunner接口

概述：在开发场景中，需要在**容器启动完成时**执行一些内容。如：读取配置文件，数据库连接等。

SpringBoot提供两个接口：CommandLineRunner和ApplicationRunner

#### CommandLineRunner接口

```java
@Component
@Order(value = 1)// 多个实现类，执行先后顺序
public class AppRunner implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(AppRunner.class);

    private final BookRepository bookRepository;

    public AppRunner(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    // 自定义业务逻辑
    @Override
    public void run(String... args) throws Exception {
        logger.info(".... Fetching books");
        logger.info("isbn-1234 -->" + bookRepository.getByIsbn("isbn-1234"));
        logger.info("isbn-4567 -->" + bookRepository.getByIsbn("isbn-4567"));
        logger.info("isbn-1234 -->" + bookRepository.getByIsbn("isbn-1234"));
        logger.info("isbn-4567 -->" + bookRepository.getByIsbn("isbn-4567"));
        logger.info("isbn-1234 -->" + bookRepository.getByIsbn("isbn-1234"));
        logger.info("isbn-1234 -->" + bookRepository.getByIsbn("isbn-1234"));
        logger.info("isbn-1234 -->" + bookRepository.getByIsbn("isbn-2345"));
    }

}
```

#### ApplicationRunner接口

```java
@Component
@Order(value = 1)
public class AppRunner2 implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(AppRunner2.class);

    private BookRepository bookRepository;

    public AppRunner2(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        log.info(".... Fetching books");
        log.info("isbn-1 -->" + bookRepository.getByIsbn("isbn-1"));
    }
}
```

