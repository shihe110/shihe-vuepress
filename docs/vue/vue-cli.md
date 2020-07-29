## 前提是要安装npm

## 安装npm-下载安装
[node下载]( http://nodejs.cn/download/)
```xml
npm -v
```

## 安装vue-cli
全局安装
```xml
npm install vue-cli -g
```
查看版本
```xml
vue -V
```
## 项目初始化命令 vue init <template-name> <project-name>

note:<template-name>：表示模板名称，vue-cli官方提供的5种模板：
>webpack：一个全面的webpack+vue-loader的模板，功能包括热加载，linting,检测和CSS扩展。
webpack-simple：一个简单webpack+vue-loader的模板，不包含其他功能，让你快速的搭建vue的开发环境。
browserify：一个全面的Browserify+vueify 的模板，功能包括热加载，linting,单元检测。
browserify-simple：一个简单Browserify+vueify的模板，不包含其他功能，让你快速的搭建vue的开发环境。
simple：一个最简单的单页应用模板。
     
><project-name>：标识项目名称，用户根据自己的项目来起名字。

```xml
vue init webpack myproject
```

## 运行项目
```xml
npm run dev
```
运行完毕可浏览器查看

## 项目打包
```xml
npm run build
```

