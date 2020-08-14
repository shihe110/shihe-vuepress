## SpringMVC消息转换HTTPMessageConverter

### HTTPMessageConverter

在Spring MVC中请求（@RequestBody、RequestEntity等）和返回（@Responsebody、ResponseEntity等）都是通过HttpMessageConverter来实现数据转换的。

外部的请求数据通过HttpMessageConverter转换成Java对象，而Java对象又通过HttpMessageConverter转换成外部数据到返回中。在我们前面的例子中，web请求体中的Json数据通过MappingJackson2HttpMessageConverter转换成Java对象，而Java对象也通过MappingJackson2HttpMessageConverter转换成Json到返回体中。

HttpMessageConverter会根据请求或返回的内容类型（Content-Type如application/json）来选择对应的HttpMessageConverter对数据进行转换。

Spring MVC为我们自动注册了下列的HttpMessageConverter：

```js
ByteArrayHttpMessageConverter：二进制数组转换

StringHttpMessageConverter：字符串转换，支持的媒体类型：

ResourceHttpMessageConverter：org.springframework.core.io.Resource类型转换

SourceHttpMessageConverter：javax.xml.transform.Source类型准换

各种Json库的HttpMessageConverter

    MappingJackson2HttpMessageConverter：当jackson-databind jar包在类路径时注册，当前请求体和返回体都是用它来做数据转换的
    MappingJackson2XmlHttpMessageConverter：当jackson-dataformat-xml jar包在类路径时注册
    Jaxb2RootElementHttpMessageConverter：当jaxb-api jar包在类路径时注册
    GsonHttpMessageConverter：当gson jar包在类路径时注册
    JsonbHttpMessageConverter：当javax.json.bind-api jar包在类路径时注册

```
示例：
定义实体model
```js
public class AnotherPerson {
    private Long id;
    private String name;
    private Integer age;
...

}
```
### 自定义消息转换的两种方式
- 1.实现HttpMessageConverter接口
- 2.继承AbstractHttpMessageConverter
```js
public class AnotherPersonHttpMessageConverter extends AbstractHttpMessageConverter<AnotherPerson> {
 public AnotherPersonHttpMessageConverter() {
        super(new MediaType("application","another-person", Charset.defaultCharset()));//1
    }

    @Override
    protected boolean supports(Class<?> clazz) {
        return AnotherPerson.class.isAssignableFrom(clazz); //2
    }

    @Override
    protected AnotherPerson readInternal(Class<? extends AnotherPerson> clazz, HttpInputMessage inputMessage) throws IOException, HttpMessageNotReadableException {
        String body = StreamUtils.copyToString(inputMessage.getBody(), Charset.defaultCharset());
        String[] personStr = body.split("-");
        return new AnotherPerson(Long.valueOf(personStr[0]), personStr[1], Integer.valueOf(personStr[2])); //3
    }

    @Override
    protected void writeInternal(AnotherPerson anotherPerson, HttpOutputMessage outputMessage) throws IOException, HttpMessageNotWritableException {
        String out = "Hello:" + anotherPerson.getId() + "-" +
                anotherPerson.getName() + "-" +
                anotherPerson.getAge();
        StreamUtils.copy(out, Charset.defaultCharset(), outputMessage.getBody()); //4
    }
}
```
>1.构造器中自定义我们自己的媒体类型application/another-person；  
 2.当前HttpMessageConverter支持转换的类型是AnotherPerson类；  
 3.将请求体内的字符串6-foo-28转换成AnotherPerson对象；  
 4.将AnotherPerson对象转换成对应的字符串形式。

### 定义好转换器需要注册到容器中有多种方式
- 1.直接定义@Bean
- 2.定义HttpMessageConverters的Bean，这是Spring Boot为我们专门提供的，推荐使用
- 3.重载WebMvcConfigurer中的方法configureMessageConverters
```js
// 1
@Bean
HttpMessageConverter anotherPersonHttpMessageConverter(){
    return new AnotherPersonHttpMessageConverter();
}
//2
@Bean
HttpMessageConverters httpMessageConverters(){
    return new HttpMessageConverters(new AnotherPersonHttpMessageConverter());
}
// 3
@Override
public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
    converters.add(new AnotherPersonHttpMessageConverter());
}

```
我们使用前两种注册HttpMessageConverter方式时，控制器：
```js
@GetMapping("/converter")
public AnotherPerson converter(@RequestBody AnotherPerson person){
    return person;
}
``` 
使用第三种注册方式时，因Spring MVC默认使用MappingJackson2HttpMessageConverter来对请求体和返回体进行处理，我们需指定返回体的媒体类型：
即设置Content-Type为自定义类型：another-person
```js
@GetMapping(value = "/converter", produces = {"application/another-person"})
public AnotherPerson converter(@RequestBody AnotherPerson person){
    return person;
}
``` 