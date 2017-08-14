/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
let host = '64757925.qcloud.la';

let config = {

	useLineDifficultyStandard:'usa',//使用的难度标准

	service: {
		host,

		URL: `https://${host}/`,

		// 登录地址，用于建立会话
		loginUrl: `https://${host}/login`,

		// 测试的请求地址，用于测试会话
		requestUrl: `https://${host}/user/get`,

		userInfoUrl: `https://${host}/user`,

		// 测试的信道服务地址
		tunnelUrl: `https://${host}/tunnel`,
	},

	regExp: {
		// 正则表达式中的特殊符号，如果被包含于中括号中，则失去特殊意义，但 \ [ ] : ^ - 除外。
		isCnMobile : /^1[3|4|5|7|8]\d{9}$/,
		isMobile : /^\d{5,11}$/,
		isMobileGlobal:/^(\+\d{1,4}\s?)?\d{5,11}$/,// 带国际区号的手机号 +086136, +086 136
		isMail : /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/,
		// 密码长度 6~16位, 数字、字母和符号至少包含两种 2017-02-28
		isPassword: /^(?![a-zA-Z]+$)(?!\d+$)(?![\\\[\]\:\^\-~!@#$%&*()-+={}|;'",.\/<>?_]+$)[a-zA-Z_0-9\\\[\]\:\^\-~!@#$%&*()-+={}|;'",.\/<>?]{6,16}$/,
		isIDCard: /^(\d{18,18}|\d{15,15}|\d{17,17}x)$/i,
	},


	// 攀岩难度区间，用来设置对应的验收
	difficultyZoom: [
		{
			min: 0,
			max: 18,
			index: 1
		},
		{
			min: 18,
			max: 26,
			index: 2
		},
		{
			min: 26,
			max: 34,
			index: 3
		},
		{
			min: 34,
			max: 100,
			index: 4
		}
	]
};

module.exports = config;