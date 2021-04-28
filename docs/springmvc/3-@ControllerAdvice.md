## @ControllerAdvice

该注解注解一个特殊的bean组件，他负责所有控制器共享的功能，如配合@ExceptionHandler做异常处理、
配合@InitBinder做数据绑定等。他通过属性指定起效控制器范围。

通过注解指定：
```js
@ControllerAdvice(annotations = RestController.class) 
public class SomeControllerAdvice{}
```
通过包名指定：
```js
@ControllerAdvice("org.shihe.controller")
public class SomeControllerAdvice{}
```
通过控制器指定：
```js
@ControllerAdvice(assignableTypes = {PeopleController.class, DemoController.class})
public class SomeControllerAdvice{}
```

## 异常处理
使用@ExceptionHandler组合@ControllerAdvice处理所有控制器的异常，当然@ExceptionHandler也可以注解在@Controller（包含@RestController）内，异常处理只对当前控制器有效。

- 1.自定义异常类  
```js
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PersonNameNotFoundException extends RuntimeException{
    private String name;
}
```
- 2.定义异常处理类 
```js
@ControllerAdvice
public class ExceptionHandlerAdvice {

    @ExceptionHandler(PersonNameNotFoundException.class) //实际处理类
    public ResponseEntity<String> customExceptionHandler(PersonNameNotFoundException exception){
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(exception.getName() + "没有找到！");
    }
    
}
``` 
- 3.使用自定义异常  
```js
// 手动抛出
@GetMapping("/exceptions")
public void exceptions(String name)  {
    throw new PersonNameNotFoundException(name);
}
```

## 初始化数据绑定
使用@InitBinder注解组合@ControllerAdvice实现初始化数据绑定。所谓出具绑定数据绑定，即在web请求在进入控制器方法处理之前，对web请求参数（不包含请求体@RequestBody，它使用下节的RequestBodyAdvice处理）进行预先的初始化处理，这个处理是通过WebDataBinder对象来做的。这些请求参数包括来自于@RequestParam、@PathVariable、ServletRequest、ServletReponse等，也就是这些参数都可以在@InitBinder注解的方法中进行先处理，该方法没有返回值。如我们将参数1-wyf-35转成一个Person对象。@InitBinder也可以用在@Controller内，只对使用的控制器有效。

我们先定义一个属性编辑器将接收到的格式为id-name-age转换成对象：
```js
public class PersonEditor extends PropertyEditorSupport {
    @Override
    public void setAsText(String text) throws IllegalArgumentException {
        String[] personStr = text.split("-"); // 将1-shihe-35分割成字符串数组
        Long id = Long.valueOf(personStr[0]);
        String name = personStr[1];
        Integer age = Integer.valueOf(personStr[2]);
        setValue(new Person(id, name, age)); //利用字符串数组建立Person对象
    }

}
```
使用@InitBinder来注册该属性编辑器
```js
@ControllerAdvice
@Slf4j
public class InitBinderAdvice {

    @InitBinder
    public void registerPersonEditor(WebDataBinder binder, @RequestBody String person){
        log.info("在InitBinder中为字符串：" + person);
        binder.registerCustomEditor(Person.class, new PersonEditor());
    }
}
```
未经WebDataBinder注册PersonEditor转换前，从请求参数里拿到的只是字符串person，此处的字符串参数只是为了大家加深理解需要，我们开发时不需要这个参数。

我们用控制器来验证：
```js
@GetMapping("/propertyEditor")
public Person propertyEditor(@RequestParam Person person){//支持的参数类型@RequetParam
    log.info("经过InitBinder注册的PropertyEditor转换后为对象：" + person);
    return person;
}
```

## 自定义Validator
我们在“参数校验”一节演示了默认的校验方式，若有特殊的校验需求，也可以通过实org.springframework.validation.Validator接口来完全控制校验行为：

```js
public class PersonValidator implements Validator {
    @Override
    public boolean supports(Class<?> clazz) {
        return Person.class.isAssignableFrom(clazz); //只支持Person类
    }

    @Override
    public void validate(Object target, Errors errors) {
        Person person = (Person) target;
        validateId(person, errors); //校验id
        validateName(person, errors); //校验name
        validateAge(person, errors); //校验age
    }
    private void validateId(Person person, Errors errors){
        ValidationUtils.rejectIfEmpty(errors,"id", "person.code", "id不能为空-自定义");
    }
    private void validateName(Person person, Errors errors){
        int nameLength = person.getName().length();
        if (nameLength < 3 || nameLength > 5)
            errors.rejectValue("name", "person.name", "name在3到5个字符之间-自定义");
    }
    private void validateAge(Person person, Errors errors){
        if (person.getAge() < 18)
            errors.rejectValue("age", "person.age", "age不能低于18岁-自定义");
    }
}
```
在InitBinderAdvice类中的@InitBinder方法中注册：
```js
@ControllerAdvice
public class InitBinderAdvice {
    @InitBinder
    public void setPersonValidator(WebDataBinder binder){
        binder.setValidator(new PersonValidator());
    }
}
```

## @RestControllerAdvice
该注解的功能主要用于对restful的请求体和响应体进行定制处理。

先处理请求体与后处理返回体  
对请求体定制处理实现RequestBodyAdvice接口，它会在请求体进入控制器方法之前对请求体进行先处理；对返回体进行定制处理ResponseBodyAdvice，它会在控制器方法返回值确定之后对返回值进行后处理。他们和@RestControllerAdvice一起使用。

定义注解
```js
@Target({ElementType.PARAMETER, ElementType.METHOD}) //支持注解在方法参数和方法上
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface ProcessTag {
}
```
定制请求体advice
```js
@RestControllerAdvice
public class CustomRequestBodyAdvice implements RequestBodyAdvice {
    @Override
    public boolean supports(MethodParameter methodParameter, Type targetType, Class<? extends HttpMessageConverter<?>> converterType) {
       return methodParameter.getParameterAnnotation(ProcessTag.class) != null; //1

    }

    @Override
    public HttpInputMessage beforeBodyRead(HttpInputMessage inputMessage, MethodParameter parameter, Type targetType, Class<? extends HttpMessageConverter<?>> converterType) throws IOException {
        return inputMessage; //2
    }

    @Override
    public Object afterBodyRead(Object body, HttpInputMessage inputMessage, MethodParameter parameter, Type targetType, Class<? extends HttpMessageConverter<?>> converterType) {
        if (body instanceof Person) {
            Person person = (Person) body;
            String upperCaseName = person.getName().toUpperCase();
            return new Person(person.getId(), upperCaseName, person.getAge());
        }
        return body; //3
    }

    @Override
    public Object handleEmptyBody(Object body, HttpInputMessage inputMessage, MethodParameter parameter, Type targetType, Class<? extends HttpMessageConverter<?>> converterType) {
        if(Person.class.isAssignableFrom((Class<?>) targetType)){
            return new Person(new Random().nextLong(),"Nobody",-1);
        }
        return body; //4
    }
}
```
定制相应体advice

```js
@RestControllerAdvice
public class CustomResponseBodyAdvice implements ResponseBodyAdvice {
    @Override
    public boolean supports(MethodParameter returnType, Class converterType) {
        return returnType.hasMethodAnnotation(ProcessTag.class); //1
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType, Class selectedConverterType, ServerHttpRequest request, ServerHttpResponse response) {
        if (body instanceof Person){
            Map<String, Object> map = new HashMap<>();
            map.put("person", body);
            map.put("extra-response-body", "demo-body");
            return map;
        }
        return body; //2
    }
}
```
测试
```js
@GetMapping("/modifyBodies")
@ProcessTag //标记定制返回体
public Person modifyRequestBody(@ProcessTag @RequestBody Person person){ //标记定制请求体
    return person;
}
```