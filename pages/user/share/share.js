// pages/user/resultdetail/detail.js
const app = getApp();
let config = require('../../../config');
// 引入 QCloud 小程序增强 SDK
let qcloud = require('../../../vendor/qcloud-weapp-client-sdk/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  	bgImg: config.staticUrl+'/img/page-01.jpg',
		show: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  	if(!!app.globalData && !!app.globalData.reportData) {
  		let data = app.globalData.reportData;
			let money = data.money+' 元';

			let difficulty = data.maxLineDifficulty[config.useLineDifficultyStandard];
			let num = '仅有 '+data.maxDifficultyUserNum+' 人完攀';

			let finishNum = data.finishNum+' 条线路';

			//title2:'1小时45分56秒',
			// title3:'超过 98% 的选手',
			let time = data.fastTime;
			let hh = Math.floor( time / 60 / 60);
			let mm = Math.floor( time / 60 % 60);
			let ss = Math.floor( time % 60);
			let fastTime = hh+'小时'+mm+'分'+ss+'秒';
			let rate = '超过 '+data.fastTimeRate+' 的选手';


			// 使用 wx.createContext 获取绘图上下文 context
			// let context = wx.createCanvasContext('share-canvas')

			// context.setStrokeStyle("#00ff00");
			// context.setLineWidth(5);
			// context.rect(0, 0, 200, 200);
			// context.stroke();
			// context.setStrokeStyle("#ff0000");
			// context.setLineWidth(2);
			// context.moveTo(160, 100);
			// context.arc(100, 100, 60, 0, 2 * Math.PI, true);
			// context.moveTo(140, 100);
			// context.arc(100, 100, 40, 0, Math.PI, false);
			// context.moveTo(85, 80);
			// context.arc(80, 80, 5, 0, 2 * Math.PI, true);
			// context.moveTo(125, 80);
			// context.arc(120, 80, 5, 0, 2 * Math.PI, true);
			// context.stroke();
			// context.draw();

			this.setData({
				show: true
			})
		} else {
			//返回上一页
			wx.navigateBack({
				delta: 1
			});
		}
  },


	imageLoad:function(e){
		let context = wx.createCanvasContext('share-canvas')
		let img = e.currentTarget;
		context.drawImage(img,10,10,240,160);
		context.draw();
	},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

	onPullDownRefresh: function () {
		this.update(()=>{
			wx.stopPullDownRefresh();
		});
	},

	onShareAppMessage: function (res) {
		return app.commonShareAppMessage(res);
	}
});