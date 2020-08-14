## SpringSecurity认证

### Authentication

SpringSecurity提供了专门的认证接口：org.springframework.security.core.Authentication

并提供了一些认证实现类，一旦认证成功后，Authentication对象就会自动存储在用SecurityContextHolder管理的SecurityContext上下文中。

### 认证原理

1.通过过滤器链（FilterChainProxy）来处理请求认证信息。将认证信息构造成认证对象（Authentication）交给由认证管理器（AuthenticationManager）的authenticate方法去处理。

过滤器链中的主要过滤器有：
    - UsernamePasswordAuthenticationFilter：构造的认证对象类型为UsernamePasswordAuthenticationToken；并交由认证管理器的认证方法来进行认证操作。
    - BasicAuthenticationFilter：构造对象UsernamePasswordAuthenticationToken；并交由认证管理器的认证方法来进行认证操作。
    - ExceptionTranslationFilter:处理链中异常，即认证异常AuthenticationException返回代码401认证失败代码。AccessDeniedException：授权异常，返回403状态码。
    - FilterSecurityInterceptor：它是AbstractSecurityInterceptor的子类，当认证成功后，再使用AccessDecisionManager对Web路径资源（web URI）进行授权操作。
    
2.认证管理器AuthenticationManager接口。
实现类ProviderManager，使用AuthenticationManagerBuilder来定制构建认证管理器。

3.ProviderManager（认证管理器类）：ProviderManager通过它authenticate方法将认证交给了一组顺序的AuthenticationProvider来完成认证。

4.AuthenticationProvider（认证者）：AuthenticationProvider接口包含两个方法：
    - 1.supports：是否支持认证安全过滤器缓解构造的Authentication；
    - 2.authenticate：对Authentication进行认证，若认证通过返回Authentication，若不通过则抛出异常。
    
5.DaoAuthenticationProvider：DaoAuthenticationProvider是AuthenticationProvider接口的实现，他支持认证的Authentication类型为UsernamePasswordAuthenticationToken。它在认证中主要用到了下面三个部分：
    - UserDetailsService：从指定的位置（如数据库）获得用户信息；通过比较用户信息和Authentication（UsernamePasswordAuthenticationToken）中的用户名和密码信息
    - 若认证通过则构建新的Authentication（UsernamePasswordAuthenticationToken），包含用户的权限信息。
    - PasswordEncoder：使用PasswordEncoder将请求传来的明文密码和存储的编码后的密码进行匹配比较。
    
## 配置认证管理器AuthenticationManager
新建配置类继承WebSecurityConfigurerAdapter类，并实现configure方法，使用AuthenticationManagerBuilder来构建配置认证管理器AuthenticationManager

```xml
@Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        //auth.
    }

}
```
通过配置userDetailServive或AuthenticationProvider定制认证。


