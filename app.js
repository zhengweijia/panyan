/**
 * @fileOverview 微信小程序的入口文件
 */

let qcloud = require('./vendor/qcloud-weapp-client-sdk/index');
let config = require('./config');

App({
	/**
	 * 小程序初始化时执行，我们初始化客户端的登录地址，以支持所有的会话操作
	 */
	onLaunch(options) {
		qcloud.setLoginUrl(config.service.loginUrl);
		this.getRegister();
	},
	globalData: {
		userInfo: null,
		isRegister: false, //有没有注册
	},

	// 检查用户有没有注册，如果没有，跳转到注册页面
	getRegister: function () {
		qcloud.request({
			// 检查有没有注册
			url: config.service.URL+'user/checkRegister',
			// 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
			login: true,
			success: (result) => {
				if(!!result.data.data && !!result.data.data.userInfo) {
					this.globalData.userInfo = result.data.data.userInfo;
				}

				if(!!result && !!result.data && result.data.code == '0') {
					this.globalData.isRegister = true;
				} else {
					this.globalData.isRegister = false;
				}
			},
			fail(error) {
			}
		});
	},

	checRegisterAndRedirectTo: function(){
		if(!this.globalData || !this.globalData.isRegister) {
			//未完善信息了，则跳转到完善信息页面
			wx.redirectTo({
				url: '../register/register'
			});
		} else {
		}
	}
});