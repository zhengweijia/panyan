// detail.js
const app = getApp();
let config = require('../../../config');

Page({

  /**
   * 页面的初始数据
   */
  data: {
		viewData:{
			money: 0,
			ranking: 0,
			resultList: []
		},
		useLineDifficultyStandard: config.useLineDifficultyStandard, //难度使用什么标准

	},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		this.update();
  },

	update: function (call) {
		let that = this;

		app.getAllInfoAboutMe((data)=>{
			if(!!data.userInfo) that.data.userInfo = data.userInfo;
			if(!!data.lineAllInfo) that.data.lineAllInfo  = data.lineAllInfo;


			if(!!data.hadMoney) that.data.viewData.money = data.hadMoney;
			if(!!data.finishLineNum) that.data.viewData.ranking = data.finishLineNum;
			if(!!data.resultList){
				// 预先处理数据，时间格式之类的
				for (let res of data.resultList) {
					// 完成时间
					res.formatFinishDate = '';
					if(!!res.end_time) {
						res.formatFinishDate = app.dateFormat(res.end_time, 'yyyy.M.d h:m');
					}

					res.gameTime = '';//用时
					if(!!res.end_time && !!res.start_time) {
						res.gameTime = app.diffDate(res.start_time, res.end_time);
					}
					that.data.viewData.resultList.push(res);
				}

			}

			that.setData({
				userInfo: that.data.userInfo,
				viewData: that.data.viewData,

			});

			if(!!call) {
				call();
			}
		});
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