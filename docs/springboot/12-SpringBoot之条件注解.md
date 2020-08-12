## SpringBoot之条件注解

### 条件注解 @Conditional

SpringBoot中大量使用的条件注解，即当满足特定条件（condition）时，做出相应配置。

@Conditional注解接受Condition数组作为参数，Condition即我们的特定条件，Condition只有一个方法matches，符合条件时返回true，不符合时返回false。

```js
public class OnWindowsCondition implements Condition { //1
    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) { //2 
        String osName = context.getEnvironment().getProperty("os.name"); //3
        if(osName.indexOf("win")>=0)
            return true;
        else
            return false;
    }
}
```
- 条件实现Condition接口即可；
- matches的两个参数：ConditionContext可获得容器的相关信息；AnnotatedTypeMetadata是当前被注解的方法或类的元数据（数据的描述）信息。
- 通过容器context获得运行环境Environment信息，从而获得操作系统信息。

配置
```js
@Configuration
public class SystemAutoConfig {

    @Bean
    @Conditional(OnWindowsCondition.class) // 1
    public CommandService windows(){
        return new CommandService("dir");
    }
}
```
OnWindowsCondition条件为true的情况下才会创建bean


