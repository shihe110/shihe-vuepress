## Spring Cloud Config

随着线上项目变的日益庞大，每个项目都散落着各种配置文件，如果采用分布式的开发模式，
需要的配置文件随着服务增加而不断增多。某一个基础服务信息变更，都会引起一系列的更新和重启，
运维苦不堪言也容易出错。配置中心便是解决此类问题产生的。

### 配置服务

SpringCloud提供了config server，提供了分布式系统开发中外部配置的功能。
通过Config Server，可以集中存储所有应用的配置文件。
并且支持在git或文件系统中放置配置文件。可以使用不同的格式来区分不同的应用对应的不同配置文件。
提供了@EnableConfigServer启用配置服务


```js
/{application}/{profile}[/{label}]
/{application}-{profile}.yml
/{application}-{profile}.properties
/{label}/{application}-{profile}.yml
/{label}/{application}-{profile}.properties
```

