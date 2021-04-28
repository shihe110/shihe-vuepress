### SpringBoot之整合Shiro

- 方式一：原生整合

  - 新建项目依赖

  ```xml
  <dependencies>
      <dependency>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-starter-web</artifactId>
      </dependency>
      <dependency>
          <groupId>org.apache.shiro</groupId>
          <artifactId>shiro-web</artifactId>
          <version>1.4.0</version>
      </dependency>
      <dependency>
          <groupId>org.apache.shiro</groupId>
          <artifactId>shiro-spring</artifactId>
          <version>1.4.0</version>
      </dependency>
  </dependencies>
  ```

  - 创建Realm核心类

  ```java
  public class MyRealm extends AuthorizingRealm {
      @Override
      protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
          return null;
      }
      @Override
      protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
          String username = (String) token.getPrincipal();
          if (!"zhangsan".equals(username)) {
              throw new UnknownAccountException("账户不存在!");
          }
          return new SimpleAuthenticationInfo(username, "123", getName());
      }
  }
  ```

  - 配置shiro

  ```java
  @Configuration
  public class ShiroConfig {
      @Bean
      MyRealm myRealm() {
          return new MyRealm();
      }
  
      @Bean
      SecurityManager securityManager() {
          DefaultWebSecurityManager manager = new DefaultWebSecurityManager();
          manager.setRealm(myRealm());
          return manager;
      }
  
      @Bean
      ShiroFilterFactoryBean shiroFilterFactoryBean() {
          ShiroFilterFactoryBean bean = new ShiroFilterFactoryBean();
          bean.setSecurityManager(securityManager());
          bean.setLoginUrl("/login");
          bean.setSuccessUrl("/index");
          bean.setUnauthorizedUrl("/unauthorizedurl");
          Map<String, String> map = new LinkedHashMap<>();
          map.put("/doLogin", "anon");
          map.put("/**", "authc");
          bean.setFilterChainDefinitionMap(map);
          return bean;
      }
  }
  ```

  - 测试

  ```java
  @RestController
  public class LoginController {
      @PostMapping("/doLogin")
      public void doLogin(String username, String password) {
          Subject subject = SecurityUtils.getSubject();
          try {
              subject.login(new UsernamePasswordToken(username, password));
              System.out.println("登录成功!");
          } catch (AuthenticationException e) {
              e.printStackTrace();
              System.out.println("登录失败!");
          }
      }
      @GetMapping("/hello")
      public String hello() {
          return "hello";
      }
      @GetMapping("/login")
      public String  login() {
          return "please login!";
      }
  }
  ```

- 方式二：starter整合

  - 使用shiro提供springboot的starter依赖

  ```xml
  <dependencies>
      <dependency>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-starter-web</artifactId>
      </dependency>
      <dependency>
          <groupId>org.apache.shiro</groupId>
          <artifactId>shiro-spring-boot-web-starter</artifactId>
          <version>1.4.0</version>
      </dependency>
  </dependencies>
  ```

  - 配置application.properties

  ```properties
  shiro.sessionManager.sessionIdCookieEnabled=true
  shiro.sessionManager.sessionIdUrlRewritingEnabled=true
  shiro.unauthorizedUrl=/unauthorizedurl
  shiro.web.enabled=true
  shiro.successUrl=/index
  shiro.loginUrl=/login
  ```

  - 配置

  ```java
  @Configuration
  public class ShiroConfig {
      @Bean
      MyRealm myRealm() {
          return new MyRealm();
      }
      @Bean
      DefaultWebSecurityManager securityManager() {
          DefaultWebSecurityManager manager = new DefaultWebSecurityManager();
          manager.setRealm(myRealm());
          return manager;
      }
      @Bean
      ShiroFilterChainDefinition shiroFilterChainDefinition() {
          DefaultShiroFilterChainDefinition definition = new DefaultShiroFilterChainDefinition();
          definition.addPathDefinition("/doLogin", "anon");
          definition.addPathDefinition("/**", "authc");
          return definition;
      }
  }
  ```

  - 测试

  

  