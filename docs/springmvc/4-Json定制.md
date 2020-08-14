## Json定制

Json定制使用Jackson的注解@JsonView来定制返回视图，
使用Jackson提供的注解对序列化和反序列化即java对象转json及json转java对象定制细节。

## 忽略属性
我们可以@JsonIgnore忽略某个属性，或者用@JsonIgnoreProperties忽略多个属性。属性一旦忽略，无论请求和返回这个属性都不存在了。
```js
Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@JsonIgnoreProperties({"name","age"})
public class SecondPerson {
    private Long id;
    private String name;
    private Integer age;
    @JsonIgnore
    private Float height;
    @JsonIgnore
    private Date birthday;
}
```
## 定制格式
```js
// 使用@JsonFormat定制时间格式
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SecondPerson {
    private Long id;
    private String name;
    private Integer age;
    private Float height;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date birthday;
}
```
## springboot中可通过外部设置来实现全局的json数据日期格式化。
```js
spring.jackson.data-format=yyyy-MM-dd
```

## 定制key
使用@JsonProperty来给json定制key

```js
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SecondPerson {
    @JsonProperty("person-id")
    private Long id;
    @JsonProperty("person-name")
    private String name;
    @JsonProperty("person-age")
    private Integer age;
    private Float height;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date birthday;
}
```
