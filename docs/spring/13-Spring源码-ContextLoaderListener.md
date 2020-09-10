## Tomcat引导Spring容器加载

- web容器启动web应用时，会通过监听器的方式，通知ServletContextListener，web容器开始启动web应用了，ServletContextListener可以自定义初始化逻辑。ContextLoaderListener是spring对ServletContextListener接口的一个实现类，主要负责加载spring主容器相关的bean（默认WEB-INF/applicationContext.xml文件的配置信息。）

- ContextLoaderListener通过实现ServletContextListener接口，将spring容器融入web容器当中。这个可以分两个角度来理解：

  	- 1.web项目自身：接收web容器启动web应用的通知，开始自身配置的解析加载，创建bean实例。通过WebApplicationContext上下文容器来维护spring项目的主容器相关的bean，以及一些其他组件。
  	- 2.web容器：web容器使用ServletContext来维护每一个web应用。spring容器WebApplicationContext作为ServletContext的一个attribute保存到其中，从而web容器和spring项目可以通过ServletContext来交互。   

  ```java
  public WebApplicationContext initWebApplicationContext(ServletContext servletContext) {
      ...
  
          try {
              ApplicationContext parent = this.loadParentContext(servletContext);
              this.context = this.createWebApplicationContext(servletContext, parent);
              servletContext.setAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE, this.context);
              ClassLoader ccl = Thread.currentThread().getContextClassLoader();
              if (ccl == ContextLoader.class.getClassLoader()) {
                  currentContext = this.context;
              } else if (ccl != null) {
                  currentContextPerThread.put(ccl, this.context);
              }
  ```

    

- ContextLoaderListener只是作为一个中间层来建立spring容器和web容器的关联关系，而实际上实际工作是有ContextLoader来做的，即在ContextLoader中定义spring容器和Servlet容器的交互关系等。

  ```java
  public class ContextLoaderListener extends ContextLoader implements ServletContextListener {
      private ContextLoader contextLoader;
      public ContextLoaderListener() {
      }
      public void contextInitialized(ServletContextEvent event) {
          this.contextLoader = this.createContextLoader();
          if (this.contextLoader == null) {
              this.contextLoader = this;
          }
          this.contextLoader.initWebApplicationContext(event.getServletContext());
      }
      /** @deprecated */
      @Deprecated
      protected ContextLoader createContextLoader() {
          return null;
      }
      /** @deprecated */
      @Deprecated
      public ContextLoader getContextLoader() {
          return this.contextLoader;
      }
      public void contextDestroyed(ServletContextEvent event) {
          if (this.contextLoader != null) {
              this.contextLoader.closeWebApplicationContext(event.getServletContext());
          }
          ContextCleanupListener.cleanupAttributes(event.getServletContext());
      }
  }
  ```

### ContextLoader-Spring容器的加载

```java
public class ContextLoader {
    public static final String CONTEXT_CLASS_PARAM = "contextClass";
    public static final String CONFIG_LOCATION_PARAM = "contextConfigLocation";
    public static final String LOCATOR_FACTORY_SELECTOR_PARAM = "locatorFactorySelector";
    public static final String LOCATOR_FACTORY_KEY_PARAM = "parentContextKey";
    private static final String DEFAULT_STRATEGIES_PATH = "ContextLoader.properties";
    private static final Properties defaultStrategies;
    private static final Map<ClassLoader, WebApplicationContext> currentContextPerThread;
    private static volatile WebApplicationContext currentContext;
    private WebApplicationContext context;
    private BeanFactoryReference parentContextRef;

    static {
        try {
            ClassPathResource resource = new ClassPathResource("ContextLoader.properties", ContextLoader.class);
            defaultStrategies = PropertiesLoaderUtils.loadProperties(resource);
        } catch (IOException var1) {
            throw new IllegalStateException("Could not load 'ContextLoader.properties': " + var1.getMessage());
        }

        currentContextPerThread = new ConcurrentHashMap(1);
    }

    public ContextLoader() {
    }

    public WebApplicationContext initWebApplicationContext(ServletContext servletContext) {
        if (servletContext.getAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE) != null) {
            throw new IllegalStateException("Cannot initialize context because there is already a root application context present - check whether you have multiple ContextLoader* definitions in your web.xml!");
        } else {
            Log logger = LogFactory.getLog(ContextLoader.class);
            servletContext.log("Initializing Spring root WebApplicationContext");
            if (logger.isInfoEnabled()) {
                logger.info("Root WebApplicationContext: initialization started");
            }

            long startTime = System.currentTimeMillis();

            try {
                ApplicationContext parent = this.loadParentContext(servletContext);
                this.context = this.createWebApplicationContext(servletContext, parent);
                servletContext.setAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE, this.context);
                ClassLoader ccl = Thread.currentThread().getContextClassLoader();
                if (ccl == ContextLoader.class.getClassLoader()) {
                    currentContext = this.context;
                } else if (ccl != null) {
                    currentContextPerThread.put(ccl, this.context);
                }

                if (logger.isDebugEnabled()) {
                    logger.debug("Published root WebApplicationContext as ServletContext attribute with name [" + WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE + "]");
                }

                if (logger.isInfoEnabled()) {
                    long elapsedTime = System.currentTimeMillis() - startTime;
                    logger.info("Root WebApplicationContext: initialization completed in " + elapsedTime + " ms");
                }

                return this.context;
            } catch (RuntimeException var9) {
                logger.error("Context initialization failed", var9);
                servletContext.setAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE, var9);
                throw var9;
            } catch (Error var10) {
                logger.error("Context initialization failed", var10);
                servletContext.setAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE, var10);
                throw var10;
            }
        }
    }

    protected WebApplicationContext createWebApplicationContext(ServletContext sc, ApplicationContext parent) {
        Class<?> contextClass = this.determineContextClass(sc);
        if (!ConfigurableWebApplicationContext.class.isAssignableFrom(contextClass)) {
            throw new ApplicationContextException("Custom context class [" + contextClass.getName() + "] is not of type [" + ConfigurableWebApplicationContext.class.getName() + "]");
        } else {
            ConfigurableWebApplicationContext wac = (ConfigurableWebApplicationContext)BeanUtils.instantiateClass(contextClass);
            String contextPath;
            if (sc.getMajorVersion() == 2 && sc.getMinorVersion() < 5) {
                contextPath = sc.getServletContextName();
                wac.setId(ConfigurableWebApplicationContext.APPLICATION_CONTEXT_ID_PREFIX + ObjectUtils.getDisplayString(contextPath));
            } else {
                try {
                    contextPath = (String)ServletContext.class.getMethod("getContextPath").invoke(sc);
                    wac.setId(ConfigurableWebApplicationContext.APPLICATION_CONTEXT_ID_PREFIX + ObjectUtils.getDisplayString(contextPath));
                } catch (Exception var6) {
                    throw new IllegalStateException("Failed to invoke Servlet 2.5 getContextPath method", var6);
                }
            }

            wac.setParent(parent);
            wac.setServletContext(sc);
            wac.setConfigLocation(sc.getInitParameter("contextConfigLocation"));
            this.customizeContext(sc, wac);
            wac.refresh();
            return wac;
        }
    }

    protected Class<?> determineContextClass(ServletContext servletContext) {
        String contextClassName = servletContext.getInitParameter("contextClass");
        if (contextClassName != null) {
            try {
                return ClassUtils.forName(contextClassName, ClassUtils.getDefaultClassLoader());
            } catch (ClassNotFoundException var4) {
                throw new ApplicationContextException("Failed to load custom context class [" + contextClassName + "]", var4);
            }
        } else {
            contextClassName = defaultStrategies.getProperty(WebApplicationContext.class.getName());

            try {
                return ClassUtils.forName(contextClassName, ContextLoader.class.getClassLoader());
            } catch (ClassNotFoundException var5) {
                throw new ApplicationContextException("Failed to load default context class [" + contextClassName + "]", var5);
            }
        }
    }

    protected void customizeContext(ServletContext servletContext, ConfigurableWebApplicationContext applicationContext) {
    }

    protected ApplicationContext loadParentContext(ServletContext servletContext) {
        ApplicationContext parentContext = null;
        String locatorFactorySelector = servletContext.getInitParameter("locatorFactorySelector");
        String parentContextKey = servletContext.getInitParameter("parentContextKey");
        if (parentContextKey != null) {
            BeanFactoryLocator locator = ContextSingletonBeanFactoryLocator.getInstance(locatorFactorySelector);
            Log logger = LogFactory.getLog(ContextLoader.class);
            if (logger.isDebugEnabled()) {
                logger.debug("Getting parent context definition: using parent context key of '" + parentContextKey + "' with BeanFactoryLocator");
            }

            this.parentContextRef = locator.useBeanFactory(parentContextKey);
            parentContext = (ApplicationContext)this.parentContextRef.getFactory();
        }

        return parentContext;
    }

    public void closeWebApplicationContext(ServletContext servletContext) {
        servletContext.log("Closing Spring root WebApplicationContext");

        try {
            if (this.context instanceof ConfigurableWebApplicationContext) {
                ((ConfigurableWebApplicationContext)this.context).close();
            }
        } finally {
            ClassLoader ccl = Thread.currentThread().getContextClassLoader();
            if (ccl == ContextLoader.class.getClassLoader()) {
                currentContext = null;
            } else if (ccl != null) {
                currentContextPerThread.remove(ccl);
            }

            servletContext.removeAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE);
            if (this.parentContextRef != null) {
                this.parentContextRef.release();
            }

        }

    }

    public static WebApplicationContext getCurrentWebApplicationContext() {
        ClassLoader ccl = Thread.currentThread().getContextClassLoader();
        if (ccl != null) {
            WebApplicationContext ccpt = (WebApplicationContext)currentContextPerThread.get(ccl);
            if (ccpt != null) {
                return ccpt;
            }
        }

        return currentContext;
    }
}

```

- ContextLoader负责spring主容器加载，即root ApplicationContext，在设计层面主要定义了contextId，contextConfigLocation，contextClass，contextInitializerClasses。这些参数都可以在配置中指定，如web.xml的context-param标签，或者是基于Java编程方式配置的WebApplicationInitializer中定义，作为分别为：

  - contextId：当前容器的id，主要给底层所使用的BeanFactory，在进行序列化时使用。
  - contextConfigLocation：配置文件的位置，默认为WEB-INF/applicationContext.xml，可以通过在web.xml使用context-param标签来指定其他位置，其他名字或者用逗号分隔指定多个。在配置文件中通过beans作为主标签来定义bean。这样底层的BeanFactory会解析beans标签以及里面的bean，从而来创建BeanDefinitions集合，即bean的元数据内存数据库。
  - contextClass：当前所使用的WebApplicationContext的类型，如果是在WEB-INF/applicationContext.xml中指定beans，则使用XmlWebApplicationContext，如果是通过注解，如@Configuration，@Component等，则是AnnotationConfigWebApplicationContext，通过扫描basePackages指定的包来创建bean。
  - contextInitializerClasses：ApplicationContextInitializer的实现类，即在调用ApplicationContext的refresh加载beanDefinition和创建bean之前，对WebApplicationContext进行一些初始化。    

- initWebApplicationContext方法：创建和初始化spring主容器对应的WebApplicationContext，主要完成两个操作：

  ```java
  public WebApplicationContext initWebApplicationContext(ServletContext servletContext) {
      ...
          try {
              ApplicationContext parent = this.loadParentContext(servletContext);
              this.context = this.createWebApplicationContext(servletContext, parent);
              servletContext.setAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE, this.context);
              ClassLoader ccl = Thread.currentThread().getContextClassLoader();
  ```

  