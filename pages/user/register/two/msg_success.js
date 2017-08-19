let qcloud = require('../../../../vendor/qcloud-weapp-client-sdk/index');
let config = require('../../../../config');

Page({

	data:{
		userInfo:{}
	},
	onLoad: function (options) {
		let that = this;
		qcloud.request({
			url: config.service.URL+'user/getcurr',
			method: 'GET',
			success: (msg) => {
				if(msg.data.code == '0') {
					that.setData({
						userInfo: msg.data.data.userInfo
					});
				}
			},
			fail(error) {
			}
		});
	},
	gotoHome: function () {
		wx.redirectTo({
			url: '/pages/user/home/home'
		})
	}
});