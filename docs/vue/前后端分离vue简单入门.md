## 前后端分离vue简单入门

## 前后端不分
- 1.后端模板：jsp、Freemarker、Velocity
- 2.前端模板：Thymeleaf

jsp是非常典型的前后端不分写法，将html和java代码结合，前端写静态html，后端工程师改造成jsp，后端不懂css等前端技术，前端又不懂jsp，结果是java后台程序猿既当爹有当妈，前端工程师则沦为css样式调整工程师。这种方式效率低下。特别是在移动互联网兴起后，公司的业务，一般除了 PC 端，还有手机端、小程序等，通常，一套后台系统需要对应多个前端，此时就不可以继续使用前后端不分的开发方式了。

在前后端不分的开发方式中，一般来说，后端可能返回一个 ModelAndView ，渲染成 HTML 之后，浏览器当然可以展示，但是对于小程序、移动端来说，并不能很好的展示 HTML（实际上移动端也支持HTML，只不过运行效率低下）。这种时候，后端和前端数据交互，主流方案就是通过 JSON 来实现。

## 前后端分离
后端只负责提供json数据接口，前端负责json数据展示（前端可以移动端、小程序、也可以是 PC 端），页面跳转等都是通过前端来实现的。前端后分离后，前端目前有三大主流框架：

- Vue
作者尤雨溪，Vue本身借鉴了 Angular，目前GitHubstar数最多，建议后端工程师使用这个，最大的原因是Vue上手容易，可以快速学会，对于后端工程师来说，能快速搭建页面解决问题即可，但是如果你是专业的前端工程师，我会推荐你三个都去学习 。就目前国内前端框架使用情况来说，Vue 算是使用最多的。而且目前来说，有大量 Vue 相关的周边产品，各种 UI 框架，开源项目，学习资料非常多。
- React 
Facebook 的产品。是一个用于构建用户界面的 js 库，React 性能较好，代码逻辑简单。
- Angular
AngularJS 是一款由 Google 维护的开源 JavaScript 库，用来协助单一页面应用程序运行。它的目标是透过 MVC 模式（MVC）功能增强基于浏览器的应用，使开发和测试变得更加容易。

## Vue简介
Vue (读音 /vjuː/，类似于 view) 是一套用于构建用户界面的渐进式框架。与其它大型框架不同的是，Vue 被设计为可以自底向上逐层应用。Vue 的核心库只关注视图层，不仅易于上手，还便于与第三方库或既有项目整合。另一方面，当与现代化的工具链以及各种支持类库结合使用时，Vue 也完全能够为复杂的单页应用提供驱动。

- 只关注视图层
- MVVM 框架

大家在使用 jQuery 过程中，掺杂了大量的 DOM 操作，修改视图或者获取 value ，都需要 DOM 操作，MVVM 是一种视图和数据模型双向绑定的框架，即数据发生变化，视图会跟着变化，视图发生变化，数据模型也会跟着变化，开发者再也不需要操作 DOM 节点。

如下一个简单的九九乘法表让大家感受一下 MVVM ：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
</head>
<body>
<div id="app">
    <input type="text" v-model="num">
    <table border="1">
        <tr v-for="i in parseInt(num)">
            <td v-for="j in i">{{j}}*{{i}}={{i*j}}</td>
        </tr>
    </table>
</div>
<script>
    var app = new Vue({
        el: "#app",
        data: {
            num:9
        }
    });
</script>
</body>
</html>
```


## SPA
SPA（single page web application），单页面应用，是一种网络应用程序或网站的模型，它通过动态重写当前页面来与用户交互，而非传统的从服务器重新加载整个新页面。这种方法避免了页面之间切换打断用户体验，使应用程序更像一个桌面应用程序。在单页应用中，所有必要的代码（ HTML、JavaScript 和 CSS ）都通过单个页面的加载而检索，或者根据需要（通常是为响应用户操作）动态装载适当的资源并添加到页面。SPA 有一个缺点，因为 SPA 应用部署后只有1个页面，而且这个页面只是一堆 js 、css 引用，没有其他有效价值，因此，SPA 应用不易被搜索引擎收录，所以，一般来说，SPA 适合做大型企业后台管理系统。

Vue 使用方式大致上可以分为两大类：

- 1.直接将Vue在页面中引入，不做 SPA 应用
- 2.SPA应用

## 基本环境搭建
首先需要安装两个东西：

- NodeJS
- npm
直接搜索下载 NodeJS 即可，安装成功之后，npm 也就有了。安装成功之后，可以 在 cmd 命令哈验证是否安装成功：

>node -v
>npm -v

NodeJS 安装成功之后，接下来安装 Vue的工具：

```cmd
npm install -g vue-cli   # 只需要第一次安装时执行
vue init webpack my-project  # 使用webpack模板创建一个vue项目
cd my-project #进入到项目目录中
npm install  # 下载依赖（如果在项目创建的最后一步选择了自动执行npm install，则该步骤可以省略）
npm run dev # 启动项目
```

启动成功后，浏览器输入 http://localhost:8080 就能看到如下页面：

![](<!--StartFragment--><img src="https://www.javaboy.org/images/fe/1-1.png"/><!--EndFragment-->)

执行 npm install 命令时，默认使用的是国外的下载源 ，可以通过如下代码配置为使用淘宝的镜像：

```cmd
npm config set registry https://registry.npm.taobao.org
```

## Vue 项目结构介绍
Vue 项目创建完成后，使用 Web Storm 打开项目，项目目录如下：

1.build 文件夹，用来存放项目构建脚本
2.config 中存放项目的一些基本配置信息，最常用的就是端口转发
3.node_modules 这个目录存放的是项目的所有依赖，即 npm install 命令下载下来的文件
4.src 这个目录下存放项目的源码，即开发者写的代码放在这里
5.static 用来存放静态资源
6.index.html 则是项目的首页，入口页，也是整个项目唯一的HTML页面
7.package.json 中定义了项目的所有依赖，包括开发时依赖和发布时依赖


对于开发者来说，以后 99.99% 的工作都是在 src 中完成的，src 中的文件目录如下：

1.assets 目录用来存放资产文件
2.components 目录用来存放组件（一些可复用，非独立的页面），当然开发者也可以在 components 中直接创建完整页面。
3.推荐在 components 中存放组件，另外单独新建一个 page 文件夹，专门用来放完整页面。
4.router 目录中，存放了路由的js文件
5.App.vue 是一个Vue组件，也是项目的第一个Vue组件
6.main.js相当于Java中的main方法，是整个项目的入口js

main.js内容如下：

```js
import Vue from 'vue'
import App from './App'
import router from './router'
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
```

1.在main.js 中，首先导入 Vue 对象
2.导入 App.vue ，并且命名为 App
3.导入router，注意，由于router目录下路由默认文件名为 index.js ，因此可以省略
4.所有东西都导入成功后，创建一个Vue对象，设置要被Vue处理的节点是 ‘#app’，’#app’ 指提前在index.html 文件中定义的一个div
5.将 router 设置到 vue 对象中，这里是一个简化的写法，完整的写法是 router:router，如果 key/value 一模一样，则可以简写。
6.声明一个组件 App，App 这个组件在一开始已经导入到项目中了，但是直接导入的组件无法直接使用，必须要声明。
7.template 中定义了页面模板，即将 App 组件中的内容渲染到 ‘#app’ 这个div 中。

因此，可以猜测，项目启动成功后，看到的页面效果定义在 App.vue 中

```html
<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'App'
}
</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```

1.App.vue 是一个vue组件，这个组件中包含三部分内容：1.页面模板（template）；2.页面脚本（script）；3.页面样式（style）
2.页面模板中，定义了页面的 HTML 元素，这里定义了两个，一个是一张图片，另一个则是一个 router-view
3.页面脚本主要用来实现当前页面数据初始化、事件处理等等操作
4.页面样式就是针对 template 中 HTML 元素的页面美化操作

需要额外解释的是，router-view，这个指展示路由页面的位置，可以简单理解为一个占位符，这个占位符展示的内容将根据当前具体的 URL 地址来定。具体展示的内容，要参考路由表，即 router/index.js 文件，该文件如下：

```js
import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    }
  ]
})
```

1.这个文件中，首先导入了Vue对象、Router对象以及 HelloWorld 组件，
2.创建一个Router对象，并定义路由表
3.这里定义的路由表，path为 / ，对应的组件为 HelloWorld，即浏览器地址为 / 时，在router-view位置显示 HelloWorld 组件

## WebStorm 中启动Vue
也可以直接在 webstorm 中配置vue并启动，点击右上角进行配置：npm


## 项目编译
这么大一个前端项目，肯定没法直接发布运行，当开发者完成项目开发后，将 cmd 命令行定位到当前项目目录，然后执行如下命令对项目进行打包：
```cmd
npm run build
```

打包成功后，当前项目目录下会生成一个 dist 文件夹，这个文件夹中有两个文件，分别是 index.html 和 static ，index.html 页面就是我们 SPA 项目中唯一的 HTML 页面了，static 中则保存了编译后的 js、css等文件，项目发布时，可以使用 nginx 独立部署 dist 中的静态文件，也可以将静态文件拷贝到 Spring Boot 项目的 static 目录下，然后对 Spring Boot 项目进行编译打包发布。

