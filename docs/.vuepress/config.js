module.exports = {
    title: '毫末之木',
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
			{text: 'Java', items: [
				{text: 'JVM', link: '/JVM/'},
				{text: 'javaapi', link: '/javaapi/'},
				{text: 'mybatis', link: '/mybatis/'},
				{text: '多线程', link: '/juc/'}
			]},
			{text: 'Spring系列', items: [
				{text: 'spring', link: '/spring/'},
				{text: 'spring-mvc', link: '/springmvc/'},
				{text: 'spring-boot', link: '/springboot/'},
				{text: 'spring-cloud', link: '/springcloud/'},
				{text: 'spring-security', link: '/springsecurity/'}
			]},
			{text: 'Database', items: [
				{text: 'db', link: '/db/'},
				{text: 'redis', link: '/redis/'}
			]},
			{text: '前端', items: [
				{text: 'vue', link: '/vue/'},
				{text: '前端', link: '/front/'}
			]},
			{text: '互联网', items: [
				{text: '消息中间件', link: '/mq/'},
				{text: '互联网', link: '/internet/'},
				{text: '面试', link: '/interview/'}
			]},
			{text: '工具集', items: [
					{text: 'web', link: '/web/'},
					{text: 'maven', link: '/maven/'},
					{text: 'github', link: '/github/'},
					{text: 'browser', link: '/browser/'},
					{text: 'docker', link: '/docker/'},
					{text: 'idea', link: '/idea/'}
			]},
			{text: 'github', link: 'https://github.com/shihe110',target:'_blank'}
			
		],
		sidebarDepth: 4,
		displayAllHeaders: false,
		search: true,
		searchMaxSuggestions: 10
    }
};