### SpringBoot之整合SpringSecurity

#### 两种不同的认证方式：

- 1.通过form表单来认证：默认登陆的用户名user，密码是项目启动时随机生成的，控制台会打印。
- 2.通过HttpBasic来认证

#### 对登陆的用户名、密码进行配置

三种方式：

- 1、在application.properties配置
- 2、通过java代码配置在内存中
- 3、通过java从数据库读取

方式一：application.properties配置

```properties
spring.security.user.name=shihe
spring.security.user.password=123
```

方式二：java配置

```java
/**
 * 继承WebSecurityConfigurerAdapter配置用户名密码角色信息，可以配置多个
 * 密码是加密字符串，加密字符串可使用BCryptPasswordEncoder对象加密获取
 * PasswordEncoder是必须配置的否则会报错
 */
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    /**
     * 网内存中添加一个用户
     * 用户名：shihe
     * 密码：123
     * 角色：admin
     * 也可添加多个用户信息
     */
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.inMemoryAuthentication()
                .withUser("shihe")
                .password("$2a$10$ldAa8XOwbNkpkQDQMM7xXOXGGKPLd3hmLz39CeQ1la24ktUbuO8ii")
                .roles("admin");
    }
    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
```

>注：从 Spring5 开始，强制要求密码要加密，如果非不想加密，可以使用一个过期的 PasswordEncoder 的实例 NoOpPasswordEncoder，但是不建议因不安全。
>
>Spring Security 中提供了 BCryptPasswordEncoder 密码编码工具，可以非常方便的实现密码的加密加盐，相同明文加密出来的结果总是不同，这样就不需要用户去额外保存盐的字段了，这一点比 Shiro 要方便很多。

#### 登陆跳转等配置

```java
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    VerifyCodeFilter verifyCodeFilter;
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.addFilterBefore(verifyCodeFilter, UsernamePasswordAuthenticationFilter.class);
        http
        .authorizeRequests()//开启登录配置
        .antMatchers("/hello").hasRole("admin")//表示访问 /hello 这个接口，需要具备 admin 这个角色
        .anyRequest().authenticated()//表示剩余的其他接口，登录之后就能访问
        .and()
        .formLogin()
        //定义登录页面，未登录时，访问一个需要登录之后才能访问的接口，会自动跳转到该页面
        .loginPage("/login_p")
        //登录处理接口
        .loginProcessingUrl("/doLogin")
        //定义登录时，用户名的 key，默认为 username
        .usernameParameter("uname")
        //定义登录时，用户密码的 key，默认为 password
        .passwordParameter("passwd")
        //登录成功的处理器
        .successHandler(new AuthenticationSuccessHandler() {
            @Override
            public void onAuthenticationSuccess(HttpServletRequest req, HttpServletResponse resp, Authentication authentication) throws IOException, ServletException {
                    resp.setContentType("application/json;charset=utf-8");
                    PrintWriter out = resp.getWriter();
                    out.write("success");
                    out.flush();
                }
            })
            .failureHandler(new AuthenticationFailureHandler() {
                @Override
                public void onAuthenticationFailure(HttpServletRequest req, HttpServletResponse resp, AuthenticationException exception) throws IOException, ServletException {
                    resp.setContentType("application/json;charset=utf-8");
                    PrintWriter out = resp.getWriter();
                    out.write("fail");
                    out.flush();
                }
            })
            .permitAll()//和表单登录相关的接口统统都直接通过
            .and()
            .logout()
            .logoutUrl("/logout")
            .logoutSuccessHandler(new LogoutSuccessHandler() {
                @Override
                public void onLogoutSuccess(HttpServletRequest req, HttpServletResponse resp, Authentication authentication) throws IOException, ServletException {
                    resp.setContentType("application/json;charset=utf-8");
                    PrintWriter out = resp.getWriter();
                    out.write("logout success");
                    out.flush();
                }
            })
            .permitAll()
            .and()
            .httpBasic()
            .and()
            .csrf().disable();
    }
}
```

> 登陆成功后的相应跳转等，登陆失败后的响应，都可以在WebSecurityConfigurerAdapter 实现类中配置 
>
> 可以在 successHandler 方法中，配置登录成功的回调，如果是前后端分离开发的话，登录成功后返回 JSON 即可，
>
> 同理，failureHandler 方法中配置登录失败的回调，
>
> logoutSuccessHandler 中则配置注销成功的回调。

放行拦截

请求地址放行拦截，两种方式

- 设置该地址匿名访问
- 过滤请求地址，不走SpringSecurity过滤器链

过滤请求地址，示例

```java
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().antMatchers("/loginCloud");
    }
}
```

