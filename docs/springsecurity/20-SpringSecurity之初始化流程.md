## SpringSecurity之初始化流程

### SpringSecurity自动化配置类-SecurityAutoConfiguration
```js
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass(DefaultAuthenticationEventPublisher.class)
@EnableConfigurationProperties(SecurityProperties.class)
@Import({ SpringBootWebSecurityConfiguration.class, WebSecurityEnablerConfiguration.class,
		SecurityDataConfiguration.class })
public class SecurityAutoConfiguration {

	@Bean
	@ConditionalOnMissingBean(AuthenticationEventPublisher.class)
	public DefaultAuthenticationEventPublisher authenticationEventPublisher(ApplicationEventPublisher publisher) {
		return new DefaultAuthenticationEventPublisher(publisher);
	}

}
```
导入三个配置：

- SpringBootWebSecurityConfiguration
    如果开发者没有自定义WebSecurityConfigurerAdapter配置，则默认提供一个。
- WebSecurityEnablerConfiguration
    提供SpringSecurity核心配置（重点核心配置）
- SecurityDataConfiguration
    提供Spring Data的支持
    

### WebSecurityEnablerConfiguration
```js
@Configuration(proxyBeanMethods = false)
@ConditionalOnBean(WebSecurityConfigurerAdapter.class)
@ConditionalOnMissingBean(name = BeanIds.SPRING_SECURITY_FILTER_CHAIN)
@ConditionalOnWebApplication(type = ConditionalOnWebApplication.Type.SERVLET)
@EnableWebSecurity
public class WebSecurityEnablerConfiguration {

}
```
该类除了一些条件配置外，核心交给了@EnableWebSecurity -开启security

#### @EnableWebSecurity
```js
@Retention(value = java.lang.annotation.RetentionPolicy.RUNTIME)
@Target(value = { java.lang.annotation.ElementType.TYPE })
@Documented
@Import({ WebSecurityConfiguration.class,
		SpringWebMvcImportSelector.class,
		OAuth2ImportSelector.class })
@EnableGlobalAuthentication
@Configuration
public @interface EnableWebSecurity {

	/**
	 * Controls debugging support for Spring Security. Default is false.
	 * @return if true, enables debug support with Spring Security
	 */
	boolean debug() default false;
}
```
该类导入三个配置类和一个@EnableGlobalAuthentication注解
```js
WebSecurityConfiguration.class, - 重点
SpringWebMvcImportSelector.class,
OAuth2ImportSelector.class
```
- WebSecurityConfiguration
```js
springSecurityFilterChain 获取过滤器链
setFilterChainProxySecurityConfigurer 收集配置类并创建WebSecurity
```

####  @EnableGlobalAuthentication

```js
@Retention(value = java.lang.annotation.RetentionPolicy.RUNTIME)
@Target(value = { java.lang.annotation.ElementType.TYPE })
@Documented
@Import(AuthenticationConfiguration.class)
@Configuration
public @interface EnableGlobalAuthentication {
}
```
导入：AuthenticationConfiguration配置


