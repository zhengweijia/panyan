// about.js
var px2rpx = 2, windowWidth=375;
let config = require('../../../config');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
	data:{
		imageSize:{},
		staticPath: config.staticUrl
	},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		wx.getSystemInfo({
			success: function(res) {
				windowWidth = res.windowWidth;
				px2rpx = 750 / windowWidth;
			}
		})
  },

	onPullDownRefresh: function () {
		wx.stopPullDownRefresh();
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
	}


	,onShareAppMessage: function (res) {
		return app.commonShareAppMessage(res);
	}
});