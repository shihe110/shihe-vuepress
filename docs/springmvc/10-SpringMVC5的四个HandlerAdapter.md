

## SpringMVC5的四个HandlerAdapter

SpringMVC通过HandlerMapping将Url映射到handler，再讲handler交给HandlerAdapter进行调用处理。

---

- **1.SimpleServletHandlerAdapter**
- **2.SimpleControllerHandlerAdapter**
- **3.HttpRequestHandlerAdapter**
- **4.RequestMappingHandlerAdapter     **

---

HandlerAdapter接口：

```java
public interface HandlerAdapter {
    
	// 判断当前handlerAdpter是否可以调用处理handler
	boolean supports(Object handler);
    
	// 调用handler，处理请求。
	@Nullable
	ModelAndView handle(HttpServletRequest request, 
                        HttpServletResponse response, 
                        Object handler) throws Exception;

	long getLastModified(HttpServletRequest request, Object handler);

}
```

---

### 1.SimpleServletHandlerAdapter配置

```java
public class SimpleServletHandlerAdapter implements HandlerAdapter {

	@Override
	public boolean supports(Object handler) {
		return (handler instanceof Servlet);
	}

	@Override
	@Nullable
	public ModelAndView handle(HttpServletRequest request, 
                               HttpServletResponse response, 
                               Object handler)
			throws Exception {

		((Servlet) handler).service(request, response);
		return null;
	}

	@Override
	public long getLastModified(HttpServletRequest request, Object handler) {
		return -1;
	}

}
```

SimpleServletHandlerAdapter首先通过supports判断处理类型是否为Servlet的handler，如果是则对handler的调用处理，具体是调用Servlet的service方法处理请求。

Servlet

```java
@Controller("/hello")
public class HelloServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, 
                         HttpServletResponse resp) 
        throws ServletException, IOException {
        resp.getWriter().append("hello").append(req.getContextPath());
    }

    @Override
    protected void doPost(HttpServletRequest req, 
                          HttpServletResponse resp) 
        throws ServletException, IOException {
        doGet(req, resp);
    }
}
```

---

### 2.SimpleControllerHandlerAdapter配置

```java
public class SimpleControllerHandlerAdapter implements HandlerAdapter {
    public SimpleControllerHandlerAdapter() {
    }

    public boolean supports(Object handler) {
        return handler instanceof Controller;
    }

    public ModelAndView handle(HttpServletRequest request, 
                               HttpServletResponse response, 
                               Object handler) throws Exception {
        return ((Controller)handler).handleRequest(request, response);
    }

    public long getLastModified(HttpServletRequest request, 
                                Object handler) {
        return handler instanceof LastModified ? ((LastModified)handler).getLastModified(request) : -1L;
    }
}
```

该适配器可以处理Controller类型的handler，调用Controller的handleRequest()方法。

```
org.springframework.web.servlet.mvc.Controller类型的handler
```

Controller写法:

```java
@Controller("/hello")
public class HelloController implements org.springframework.web.servlet.mvc.Controller {

    @Override
    public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
        response.getWriter().write("helloController");
        return null;
    }
}
```

通过BeanNameURLHandlerMapping映射到该Controller，使用SimpleControllerHandlerAdapter调用处理。

### 3.HttpRequestHandlerAdapter配置

```java
public class HttpRequestHandlerAdapter implements HandlerAdapter {

	@Override
	public boolean supports(Object handler) {
		return (handler instanceof HttpRequestHandler);
	}

	@Override
	@Nullable
	public ModelAndView handle(HttpServletRequest request, 
                               HttpServletResponse response, 
                               Object handler)
			throws Exception {

		((HttpRequestHandler) handler).handleRequest(request, response);
		return null;
	}

	@Override
	public long getLastModified(HttpServletRequest request, 
                                Object handler) {
		if (handler instanceof LastModified) {
			return ((LastModified) handler).getLastModified(request);
		}
		return -1L;
	}
}
```

同理该适配器可以处理handler类型为：**HttpRequestHandler**类型，调用handleRequest()方法处理。

controller写法：

```java
@Controller("/hello")
public class HelloController implements HttpRequestHandler {
    @Override
    public void handleRequest(HttpServletRequest request, 
                              HttpServletResponse response) 
        throws ServletException, IOException {
        response.getWriter().write("hello");
    }
}
```

---

### 4.RequestMappingHandlerAdapter配置

```java
public class RequestMappingHandlerAdapter extends AbstractHandlerMethodAdapter
		implements BeanFactoryAware, InitializingBean {
    	@Override
	protected boolean supportsInternal(HandlerMethod handlerMethod) {
		return true;
	}
}

public abstract class AbstractHandlerMethodAdapter extends WebContentGenerator implements HandlerAdapter, Ordered {
    	@Override
	public final boolean supports(Object handler) {
        
		return (handler instanceof HandlerMethod 
                && supportsInternal((HandlerMethod) handler));
	}
}

@Override
	protected ModelAndView handleInternal(HttpServletRequest request,
			HttpServletResponse response, HandlerMethod handlerMethod) throws Exception {

		ModelAndView mav;
		checkRequest(request);

		// Execute invokeHandlerMethod in synchronized block if required.
		if (this.synchronizeOnSession) {
			HttpSession session = request.getSession(false);
			if (session != null) {
				Object mutex = WebUtils.getSessionMutex(session);
				synchronized (mutex) {
					mav = invokeHandlerMethod(request, response, handlerMethod);
				}
			}
			else {
				// No HttpSession available -> no mutex necessary
				mav = invokeHandlerMethod(request, response, handlerMethod);
			}
		}
		else {
			// No synchronization on session demanded at all...
			mav = invokeHandlerMethod(request, response, handlerMethod);
		}

		if (!response.containsHeader(HEADER_CACHE_CONTROL)) {
			if (getSessionAttributesHandler(handlerMethod).hasSessionAttributes()) {
				applyCacheSeconds(response, this.cacheSecondsForSessionAttributeHandlers);
			}
			else {
				prepareResponse(response);
			}
		}

		return mav;
	}
```

RequestMappingHandlerAdapter可以处理类型为HandlerMethod的handler，对handler的处理是调用通过java反射调用HandlerMethod的方法。

controller写法

```java
@Controller
public class HelloController {
    @RequestMapping("/hello")
    public String hello() {
        return "hello.html";
    }
}
```

只有RequestMappingHandlerAdapter有order属性，其他三个HandlerAdapter没有order属性。前三个HandlerAdapter处理的handler类型各不相同，处理也比较简单，不需要使用order区分优先级。

使用RequestMappingHandlerMapping将请求URL"/hello"的handler映射到HelloController.hello()（需在方法上添加@RequestMapping注解），使用RequestMappingHandlerAdapter调用处理。

---

前三个HandlerAdapter对handler的处理比较简单：

HttpRequestHandlerAdapter和SimpleControllerHandlerAdapter直接调用固定唯一的方法handleRequest()；

SimpleServletHandlerAdapter直接调用固定唯一的方法service()。

RequestMappingHandlerAdapter实现起来就很复杂了，处理调用的方法不唯一也不固定，需要有更多的处理。

---



在HandlerAdapter处理的返回值上，虽然统一的返回ModelAndView对象，但HttpRequestHandlerAdapter和SimpleServletHandlerAdapter实际上都是直接返回null;

SimpleControllerHandlerAdapter返回handler（Controller）处理的结果，ModelAndView对象或者null；

RequestMappingHandlerAdapter是通过反射调用获取的结果，这个结果可能是ModelAndView对象，也可能是String类型对象，还可以是一个map等，需要对返回的结果做更多的判断处理，再返回统一的ModelAndView对象。





