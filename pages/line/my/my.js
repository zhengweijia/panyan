// my.js
const app = getApp();
let config = require('../../../config');

Page({

  /**
   * 页面的初始数据
   */
	data: {
		userInfo:{},
		lineAllInfo: {}, //所有线路
		viewData : {
			money: 0.00,
			lineNum: 0,
			resultList: [],//我已经完成的线路
		},
		useLineDifficultyStandard: config.useLineDifficultyStandard, //难度使用什么标准
	},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		let that = this;

		app.getAllInfoAboutMe((data)=>{
			if(!!data.userInfo) that.data.userInfo = data.userInfo;
			if(!!data.lineAllInfo) that.data.lineAllInfo  = data.lineAllInfo;


			if(!!data.hadMoney) that.data.viewData.money = data.hadMoney;
			if(!!data.finishLineNum) that.data.viewData.lineNum = data.finishLineNum;
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
		});

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})