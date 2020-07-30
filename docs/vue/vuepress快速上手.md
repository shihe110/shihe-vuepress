## vuepress快速上手

## 全局安装
如果你只是想尝试一下 VuePress，你可以全局安装它：

```
# 安装
yarn global add vuepress # 或者：npm install -g vuepress

# 创建项目目录
mkdir vuepress-starter && cd vuepress-starter

# 新建一个 markdown 文件
echo '# Hello VuePress!' > README.md

# 开始写作
vuepress dev .

# 构建静态文件
vuepress build .
```

## 现有项目
如果你想在一个现有项目中使用 VuePress，同时想要在该项目中管理文档，则应该将 VuePress 安装为本地依赖。作为本地依赖安装让你可以使用持续集成工具，或者一些其他服务（比如 Netlify）来帮助你在每次提交代码时自动部署。

```
# 将 VuePress 作为一个本地依赖安装
yarn add -D vuepress # 或者：npm install -D vuepress

# 新建一个 docs 文件夹
mkdir docs

# 新建一个 markdown 文件
echo '# Hello VuePress!' > docs/README.md

# 开始写作
npx vuepress dev docs
```

## 在package.json添加脚本

```
"scripts": {
	"test": "echo \"Error: no test specified\" && exit 1",
	"docs:dev": "vuepress dev docs",
	"docs:build": "vuepress build docs",
	"dev": "vuepress dev docs",
	"build": "vuepress build docs",
	"deploy": "bash deploy.sh"
},
```
## 启动
```
yarn docs:dev # 或者：npm run docs:dev
```

## 打包

```
yarn docs:build # 或者：npm run docs:build
```