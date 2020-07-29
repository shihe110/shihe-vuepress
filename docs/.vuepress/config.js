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
				{text: 'github', link: '/github/'},
				{text: 'vue', link: '/vue/'}
			]},
			{text: 'github', link: 'https://github.com/shihe110',target:'_blank'}
			
		],
		sidebarDepth: 4,
		displayAllHeaders: false,
		search: true,
		searchMaxSuggestions: 10
    }
};