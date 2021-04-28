### SpringBoot配置项目错误页

#### 一、新建错误页

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
 	页面走丢了404
</body>
</html>
```



#### 二、配置错误页

```java
@Configuration
public class ErrorConfig {
    @Bean
    public WebServerFactoryCustomizer<ConfigurableWebServerFactory> webServerFactoryCustomizer(){
        return new WebServerFactoryCustomizer<ConfigurableWebServerFactory>() {
            @Override
            public void customize(ConfigurableWebServerFactory factory) {
                ErrorPage errorPage400 = new ErrorPage(HttpStatus.BAD_REQUEST,"/400");
                ErrorPage errorPage404 = new ErrorPage(HttpStatus.NOT_FOUND,"/404");
                ErrorPage errorPage500 = new ErrorPage(HttpStatus.INTERNAL_SERVER_ERROR,"/500");
                factory.addErrorPages(errorPage400, errorPage404, errorPage500);
            }
        };
    }
}
// 配置路径
@Controller
public class ErrorPageController {

    @RequestMapping("/404")
    public ModelAndView notFund(){
        return new ModelAndView("/error/404");
    }
    @RequestMapping("/400")
    public ModelAndView badRequest(){
        return new ModelAndView("/error/400");
    }
    @RequestMapping("/500")
    public ModelAndView internalServerError(){
        return new ModelAndView("/error/500");
    }
}
```

