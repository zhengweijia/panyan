let qcloud = require('../../../../vendor/qcloud-weapp-client-sdk/index');
let config = require('../../../../config');
const app = getApp();
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

	onPullDownRefresh: function () {
		wx.stopPullDownRefresh();
	},
	gotoHome: function () {
		wx.redirectTo({
			url: '/pages/user/home/home'
		});
	}

	,onShareAppMessage: function (res) {
		return app.commonShareAppMessage(res);
	}
	// 用户点击返回时
	,onUnload: function () {
		app.globalData.comefrom = 'msg_success';
	},
});