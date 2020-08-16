## SpringSecurity授权

### Authorization授权

web路径的安全控制，是由拦截器开始：FilterSecurityInterceptor

|表达式|	描述|
|----|----|
|hasRole([role])	|当前用户包含指定角色可访问web路径，需省略ROLE_前缀。|
|hasAnyRole([role1,role2])	|当前用户包含任意角色可访问web路径，角色之间用“,”隔开，需省略ROLE_前缀。|
|hasAuthority([authority])	|当前用户包含指定的权限可访问web路径。|
|hasAnyAuthority([authority1,authority2])	|当前用户包含任意权限可访问web路径，角色之间用“,”隔开。|
|principal	|用户信息。|
|authentication	|允许从SecurityContext中直接访问Authentication对象。|
|permitAll()	|允许所有访问|
|denyAll()	|总是不可访问指定的web路径。|
|anonymous()	|匿名用户可访问指定的web路径。|
|rememberMe()	|remember-me 用户可访问指定的web路径。|
|authenticated()	|当前用户不是匿名用户可访问指定的web路径。|
|fullyAuthenticated()	|当前用户不是匿名用户又不是remember-me用户可访问指定的web路径。|
|hasIpAddress	|只有来自指定ip（或子网）的用户可访问web路径|
|access	|可接受上面的任意的表达式，可调用Bean的方法。|


