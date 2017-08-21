// about.js
var px2rpx = 2, windowWidth=375;
let config = require('../../config');
// home.js
const app = getApp();
// 引入 QCloud 小程序增强 SDK
let qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');
// 引入配置
Page({

	/**
	 * 页面的初始数据
	 */
	data:{
		imageSize:{},
		staticPath: config.staticUrl,
		showLoading: true,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let that = this;
		wx.getSystemInfo({
			success: function(res) {
				windowWidth = res.windowWidth;
				px2rpx = 750 / windowWidth;
			}
		});

		app.checkRegister(function (msg) {
			if(msg.isRegister) {

				// 0 管理员，1裁判，2参赛选手，3普通用户
				if(msg.userInfo.role == '1'){
					wx.redirectTo({
						url: '/pages/judgment/home/home'
					});
				} else if(msg.userInfo.role == '2') {
					wx.redirectTo({
						url: '/pages/user/home/home'
					});
				}
			} else {
				that.setData({
					showLoading: false
				});
			}

		});


	},

	gotoReg: function () {
		wx.navigateTo({
			url: '/pages/user/register/one/register'
		});
	},

	imageLoad:function(e){
		//单位rpx
		var originWidth = e.detail.width*px2rpx,
			originHeight = e.detail.height*px2rpx,
			ratio = originWidth/originHeight;
		var viewWidth = 750,viewHeight//设定一个初始宽度
		//当它的宽度大于初始宽度时，实际效果跟mode=widthFix一致
		if(originWidth>= viewWidth){
			//宽度等于viewWidth,只需要求出高度就能实现自适应
			viewHeight = viewWidth/ratio;
		}else{
			//如果宽度小于初始值，这时就不要缩放了
			viewWidth = originWidth;
			viewHeight = originHeight;
		}
		var imageSize = this.data.imageSize;
		imageSize[e.target.dataset.index] = {
			width:viewWidth,
			height:viewHeight
		}
		this.setData({
			imageSize:imageSize
		})
	},

	onShareAppMessage: function (res) {
		return app.commonShareAppMessage(res);
	}
});