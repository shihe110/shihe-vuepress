## SpringBoot事务

## 声明式事务

配置类声明开启事务管理器
```
@Configuration
@EnableTransactionManagement
pulic void AppConfig{

}
```

使用事务注解@Transactional，来自org.springframework.transaction.annotation

```
@Transactional
public void saveUser(Long id,String name){
	// 数据库操作
}
```
@Transactional还可以注解在类上，声明类中的所有public方法都开启事务

## springboot对事务的支持

- 1.自动配置事务管理器-源码
在使用jdbc访问数据库时，springboot定义了PlatformTransactionManager的实现DataSourceTransactionManager的bean。

```
@Bean
@ConditionalOnMissingBean
@ConditionalOnBean(DataSource.class)
public PlatformTransactionManager transactionManager(){
	return new DataSourceTransactionManager(this.dataSource);
}
```

在使用jpa访问数据库时，springboot定义了PlatformTransactionManager的实现JpaTransactionManagerde bean
```
@Bean
@ConditionalOnMissingBean(PlatformTransactionManager.class)
public PlatformTransactionManager transactionManager(){
	return new DataSourceTransactionManager(this.dataSource);
}
```

- 2.自动开启注解事务的支持

```
@ConditionalOnMissingBean(AbstractTransactionManagementConfiguration.class)
@Configuration
@EnableTransactionManagement
protected static class TransactionManagementConfiguration{}
```


