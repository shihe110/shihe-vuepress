## 检查本地是否安装node
```
node -v
```
## 检查本地安装路径
```
where node 
```
## node下载
[下载地址](http://nodejs.cn/download/)
这里我下载了.zip版本

## 安装
新建一个文件夹，解压安装

将文件解压到要安装的位置，并新建两个目录

node-global :npm全局安装位置

node-cache：npm 缓存路径

## 配置环境变量

编辑环境变量-path
D:\Dev_soft\node\node-v14.6.0-win-x64
D:\Dev_soft\node\node-v14.6.0-win-x64\node-global

在命令行中输入如下命令测试

node -v

npm -v

那么node-global :npm全局安装位置，node-cache：npm 缓存路径 又是怎么与npm发生关系呢？

通过如下命令进行配置：

npm config set prefix "F:\Program Files\node-v8.11.3-win-x64\node-global"
npm config set cache "F:\Program Files\node-v8.11.3-win-x64\node-cache"

执行npm命令进行测试：npm install webpack -g

执行npm install -g npm 升级最新版本npm

会发现node-global下node_modules中多了webpack 文件夹

现在可以在命令行中任意路径下执行node/npm/webpack命令了。

 

还可以通过npm install yarn@latest -g 来安装yarn

[参考](https://www.cnblogs.com/lxg0/p/9472851.html)

## 安装yarn
```
npm install -g yarn
```
配置环境变量：D:\Dev_soft\node\node-v14.6.0-win-x64\node-global\node_modules\yarn\bin

查看版本号：
```
yarn --version  // yarn -V
```