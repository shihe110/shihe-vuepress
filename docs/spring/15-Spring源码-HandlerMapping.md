### HandlerMapping

DispatcherServlet通过HandlerMapping获取某个请求的请求处理器。

- 请求处理器由两部分组成
  - 请求执行器handler：维护一个映射map
  - 拦截器链：interceptors