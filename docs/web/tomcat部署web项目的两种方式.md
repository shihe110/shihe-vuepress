## tomcat部署web的两种方式

----

### tomcat中war包部署，webapps部署

- 1.下载tomcat解压

- 2.将war包丢到webapps下

- 3.进入bin目录启动startup(根据实际操作系统环境启动对应执行文件)

- 4.设置tomcat在conf目录server.xml中配置相关信息

### tomcat目录部署，自定义docBase部署

- 1.将解压后的war放在目标目录下如：F:/xxx/myproject

- 2.server.xml中增加配置
```
<Context path="" docBase="F:/xxx/myproject" debug="0"/>
```

- 3.启动startup测试