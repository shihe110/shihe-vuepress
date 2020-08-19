## SpringSecurity前后端分离json格式登录

### 服务端接口调整

登录时用户名密码使用UsernamePasswordAuthorizationFilter处理。
```xml
public Authentication attemptAuthentication(HttpServletRequest request,
		HttpServletResponse response) throws AuthenticationException {
	String username = obtainUsername(request);
	String password = obtainPassword(request);
    //省略
}
protected String obtainPassword(HttpServletRequest request) {
	return request.getParameter(passwordParameter);
}
protected String obtainUsername(HttpServletRequest request) {
	return request.getParameter(usernameParameter);
}
```
spring security 传递参数使用key/value形式。request.getParameter得出。

那么如果要使用json数据格式传递参数，就需要自定义一个filter取代UsernamePasswordAuthorizationFilter，获取参数时，换成从json获取。

----
### 自定义过滤器

```xml

```
