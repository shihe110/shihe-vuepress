## SpringSecurity的java配置

springsecurity除了可以在application.properties配置还可以使用java配置。

配置方式也很简单-即自定义配置类继承：WebSecurityConfigurerAdapter

### 配置类配置SpringSecurity
使用java配置类可以配置：用户名、密码
在配置类中我们要指定一个密码加密PasswordEncoder
配置类配置后会自动覆盖外部配置application.properties配置。


## 自定义表单登陆页

### 登陆接口问题
在 Spring Security 中，如果我们不做任何配置，默认的登录页面和登录接口的地址都是 /login，也就是说，默认会存在如下两个请求：

- GET http://localhost:8080/login
- POST http://localhost:8080/login

```js
.and()
.formLogin()
.loginPage("/login.html")
.permitAll()
.and()
```
当我们配置了 loginPage 为 /login.html 之后，这个配置从字面上理解，就是设置登录页面的地址为 /login.html。

实际上它还有一个隐藏的操作，就是登录接口地址也设置成 /login.html 了。换句话说，新的登录页面和登录接口地址都是 /login.html，现在存在如下两个请求：

- GET http://localhost:8080/login.html
- POST http://localhost:8080/login.html

### 登陆参数
配置登陆用户名密码参数名：
```js
.and()
.formLogin()
.loginPage("/login.html")
.loginProcessingUrl("/doLogin")

.usernameParameter("name")
.passwordParameter("passwd")

.permitAll()
.and()
```


### 登陆成功回调

springsecurity登陆成功后重定向url有两个方法：
- defaultSuccessUrl
- successForwardUrl
这两个方法配置的时候只需配置一个即可，实际配置按实际需求选择。

- 1.defaultSuccessUrl 有一个重载的方法，我们先说一个参数的 defaultSuccessUrl 方法。如果我们在 defaultSuccessUrl 中指定登录成功的跳转页面为 /index，此时分两种情况，如果你是直接在浏览器中输入的登录地址，登录成功后，就直接跳转到 /index，如果你是在浏览器中输入了其他地址，例如 http://localhost:8080/hello，结果因为没有登录，又重定向到登录页面，此时登录成功后，就不会来到 /index ，而是来到 /hello 页面。
- 2.defaultSuccessUrl 还有一个重载的方法，第二个参数如果不设置默认为 false，也就是我们上面的的情况，如果手动设置第二个参数为 true，则 defaultSuccessUrl 的效果和 successForwardUrl 一致。
- 3.successForwardUrl 表示不管你是从哪里来的，登录后一律跳转到 successForwardUrl 指定的地址。例如 successForwardUrl 指定的地址为 /index ，你在浏览器地址栏输入 http://localhost:8080/hello，结果因为没有登录，重定向到登录页面，当你登录成功之后，就会服务端跳转到 /index 页面；或者你直接就在浏览器输入了登录页面地址，登录成功后也是来到 /index。

```js
.and()
.formLogin()
.loginPage("/login.html")
.loginProcessingUrl("/doLogin")
.usernameParameter("name")
.passwordParameter("passwd")
.defaultSuccessUrl("/index")
.successForwardUrl("/index")
.permitAll()
.and()
```

### 登陆失败回调

登陆失败也有两个方法：
- failureForwardUrl
- failureUrl

这两个方法实际使用任选其一即可。
failureForwardUrl登陆失败后会发生服务端跳转。
failureUrl登陆失败后会发生重定向。

### 注销登陆

注销登陆的默认接口是/logout
```js
.and()
.logout()
.logoutUrl("/logout")
.logoutRequestMatcher(new AntPathRequestMatcher("/logout","POST"))
.logoutSuccessUrl("/index")
.deleteCookies()
.clearAuthentication(true)
.invalidateHttpSession(true)
.permitAll()
.and()
```

- 1.默认注销的 URL 是 /logout，是一个 GET 请求，我们可以通过 logoutUrl 方法来修改默认的注销 URL。
- 2.logoutRequestMatcher 方法不仅可以修改注销 URL，还可以修改请求方式，实际项目中，这个方法和 logoutUrl 任意设置一个即可。
- 3.logoutSuccessUrl 表示注销成功后要跳转的页面。
- 4.deleteCookies 用来清除 cookie。
- 5.clearAuthentication 和 invalidateHttpSession 分别表示清除认证信息和使 HttpSession 失效，默认可以不用配置，默认就会清除。