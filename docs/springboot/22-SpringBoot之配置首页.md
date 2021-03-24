### SpringBoot配置项目首页

两种方式：

- #### 静态首页

  方式一：springboot默认的静态首页路径为：\resources\static\index.html

  方式二：使用自定义页面做首页如：\resources\static\login.html

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>登陆页</title>
  </head>
  <body>
  	<h2>登陆</h2>
  </body>
  </html>
  ```

  需要用控制器转发到指定页面

  ```java
  /** 注意application.properties配置中springmvc的配置
  spring.mvc.static-path-pattern=默认为：/**
  如果配置为：spring.mvc.static-path-pattern=static/**则：如果要访问静态资源，则必须加static前缀如：
  @Controller
  public class LoginController {
      @RequestMapping("/")
      public String hello(){
          return "forward:static/login.html";
      }
  }
  */
  // 方法一
  @Controller
  public class LoginController {
      @RequestMapping("/")
      public String hello(){
          return "forward:login.html";
      }
  }
  // 方式二 springmvc配置
  @Configuration
  public class WebMvcConfig implements WebMvcConfigurer {
      @Override
      public void addViewControllers(ViewControllerRegistry registry) {
          registry.addViewController("/").setViewName("forward:login.html");
      }
  }
  ```

  

- #### 动态首页
    

  ```html
  // 页面放在templates文件夹下
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>登陆页</title>
  </head>
  <body>
  	<h2>登陆</h2>
  </body>
  </html>
  ```

  

  ```java
  // 方式一
  @Controller
  public class HelloController {
       @RequestMapping("/")
       public String hello(){
           return "login";
       }
  }
  // 方式二
  @Configuration
  public class WebMvcConfig implements WebMvcConfigurer {
      @Override
      public void addViewControllers(ViewControllerRegistry registry) {
          registry.addViewController("/").setViewName("login");
      }
  }
  ```

  