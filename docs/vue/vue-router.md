## 1.快速入门

[vue-router手册地址](https://router.vuejs.org/zh/)

## 安装
vue-router是一个插件包，需要用npm来进行安装的。如果采用vue-cli构建初始化项目会提示安装，也可以自己使用命令安装：
```xml
npm install vue-router --save
```

## 核心文件
用vue-cli构建项目后，在src/router/index.js文件
```xml
// 引入vue框架
import Vue from 'vue'
// 引入vue-router路由依赖
import Router from 'vue-router'
// 引入页面组件，命名为HelloWorld
import HelloWorld from '@/components/HelloWorld'

// Vue全局使用Router
Vue.use(Router)

// 定义路由配置
export default new Router({
  routes: [                //配置路由，这里是个数组
    {                        //每一个链接都是一个对象
      path: '/',            //链接路径
      name: 'HelloWorld',        //路由名称，
      component: HelloWorld     //对应的组件模板
    }
  ]
})
```

## 使用
在系统入口文件main.js中注入router
```xml
// 引入vue框架
import Vue from 'vue'
// 引入根组件
import App from './App'
// 引入路由配置
import router from './router'

// 关闭生产模式下给出的提示
Vue.config.productionTip = false

// 定义实例
new Vue({
  el: '#app',
  router, // 注入框架中
  components: { App },
  template: '<App/>'
})

```

## router的详细配置说明
```xml
export default new Router({
    mode: 'history', //路由模式，取值为history与hash
    base: '/', //打包路径，默认为/，可以修改
    routes: [
    {
        path: string, //路径
        ccomponent: Component; //页面组件
        name: string; // 命名路由-路由名称
        components: { [name: string]: Component }; // 命名视图组件
        redirect: string | Location | Function; // 重定向
        props: boolean | string | Function; // 路由组件传递参数
        alias: string | Array<string>; // 路由别名
        children: Array<RouteConfig>; // 嵌套子路由
        beforeEnter?: (to: Route, from: Route, next: Function) => void; // 路由单独钩子
        meta: any; // 自定义标签属性，比如：是否需要登录
        icon: any; // 图标
        // 2.6.0+
        caseSensitive: boolean; // 匹配规则是否大小写敏感？(默认值：false)
        pathToRegexpOptions: Object; // 编译正则的选项
    }
    ]
})

```
## 页面跳转
### 1.html标签跳转
```xml
<p>导航：
    <router-link to="/">首页</router-link>
    <router-link to="/hello">hello</router-link>
</p>
```
### 2.js跳转
```xml
// 注册事件
<button @click="goHome">首页</button>

// script中定义方法goHome
export default{
    name:'app',
    method:{
        goHome(){
            this.$router.push('/home');
        }
    }
}
```
### 3.其他方法
```xml
//  后退一步记录，等同于 history.back()
this.$router.go(-1)
// 在浏览器记录中前进一步，等同于 history.forward()
this.$router.go(1)
```

## 路由嵌套-子路由
子路由，也叫路由嵌套，采用在children后跟路由数组来实现，数组里和其他配置路由基本相同，需要配置path和component，然后在相应部分添加<router-view/>来展现子页面信息，相当于嵌入iframe。具体看下面的示例：

### 1.父页面src/components/Home.vue
```xml
<template>
    <div class="hello">
        <h1>
            {{msg}}
        </h1>
        <p>导航：
            <router-link to="/home">首页</router-link> |
            <router-link to="/home/one">子页面1</router-link> |
            <router-link to="/home/two">子页面2</router-link>
        </p>
        <router-view></router-view>
    </div>
</template>
<script>
    export default {
        name: 'home',    
        data(){
            return {
                msg: 'home page!'
            }
        }
    }
</script>
<style>

</style>
```


### 2.子页面1 src/components/One.vue

```xml
<template>
    <div class="hello">
        <h1>
            {{msg}}
        </h1>
    </div>
</template>
<script>
    export default {
        name: 'One',    
        data(){
            return {
                msg: 'I am one page!'
            }
        }
    }
</script>
<style>

</style>
```
### 3.子页面2 src/components/Two.vue
       
```xml
<template>
    <div class="hello">
        <h1>
            {{msg}}
        </h1>
    </div>
</template>
<script>
    export default {
        name: 'Two',    
        data(){
            return {
                msg: 'I am Two page!'
            }
        }
    }
</script>
<style>

</style>
```
### 4.路由配置 src/router/index.js

```xml
import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import One from '@/components/One' 
import Two from '@/components/Two'

Vue.use(Router)

export default new Router({
    routes: [
    {
        path: '/', // 默认页面重定向到主页
        redirect: '/home'
    },
    {
        path: '/home', // 主页路由
        name: 'Home',
        component: Home,
        children:[ // 嵌套子路由
            {
                path:'one', // 子页面1
                component:One
            },
            {
                path:'two', // 子页面2
                component:Two
            },
        ]
    }
    ]
})
```
## 路由传递参数

### 1.<router-link>传递

### 2.url传递

### 3.编程式导航-params传递参数

### 4.编程式导航-query传递参数

## 命名路由-命名视图-重定向-别名


## 模式和404

## 路由钩子
路由钩子，即导航钩子，其实就是路由拦截器，vue-router一共有三类：

- 全局钩子：最常用
- 路由单独钩子
- 组件内钩子

## 路由懒加载``