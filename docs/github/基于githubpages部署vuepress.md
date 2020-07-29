## vuepress基于github pages部署

## 前提：
- 本地安装nodejs  npm
- 本地安装git
- 申请github账号  

以上可搜索引擎

## step 1 搭建项目
新建onedocs文件夹，cd到该文件夹下，初始化项目
```xml
npm init -y
```
安装vuepress
```xml
npm install -D vuepress
```
在package.json的script中添加，代码
```xml
"scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "dev": "vuepress dev docs",
        "build": "vuepress build docs",
        "deploy": "bash deploy.sh"
}
```
在项目根目录下，新建 docs 文件夹
```xml
mkdir docs
```
新建一个README.md文件写一段信息,可手动编写，也可使用命令
```xml
echo '# Hello VuePress!' > docs/README.md
```
启动，并查在浏览器中访问 http://localhost:8080/ 即可预览效果
```xml
npm run dev
```

## step 2 配置vuepress
- 在 docs 目录下新建 .vuepress 文件夹
- 接着在 .vuepress 文件夹下新建 config.js 文件,这里的 config.js 便是一个 Vuepress 网站必要的配置文件，在其中添加如下代码：
```xml
module.exports = {
    title: '合抱之木生于毫末',
	base: '/onedocs/',
	description: '合抱之木生于毫末，九层之台起于累土，千里之行始于足下',
    head: [
        ['link', {rel: 'icon', href: '/logo.png'}]
    ],
	plugins: {
		'vuepress-plugin-auto-sidebar': {}
	},
    themeConfig: {
        logo: '/logo.png',
        nav: [
			{text: '首页', link: '/'},
			{text: '导航', items: [
				{text: 'spring-boot', link: '/SpringBoot/'},
				{text: 'spring-cloud', link: '/SpringCloud/'},
				{text: 'spring', link: '/Spring/'},
				{text: 'spring-mvc', link: '/SpringMVC/'},
				{text: 'web', link: '/web/'},
				{text: 'maven', link: '/maven/'},
				{text: 'github', link: '/github/'}
			]},
			{text: 'github', link: 'https://github.com/shihe110',target:'_blank'}
			
		],
		sidebarDepth: 4,
		displayAllHeaders: false,
		search: true,
		searchMaxSuggestions: 10
    }
};
```
具体详细配置可参照vuepress官方文档[网址](https://www.vuepress.cn/guide/basic-config.html#%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6)

## step 3 部署
在根目录下新建deploy.sh并添加内容
```xml
#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages

cd -
```
[官网地址](https://www.vuepress.cn/guide/deploy.html#github-pages)

在github上新建仓库配置deploy.sh文件中的
```xml
# 如果发布到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages
```
两种方式二选一

在此我选择第二种

执行deploy.sh 

执行完毕后可去github查看上传情况和访问网址：在仓库下settings，找到github pages 

例如我的地址为： Your site is published at [https://shihe110.github.io/onedocs/](https://shihe110.github.io/onedocs/)

到此完成，是不是很简单！