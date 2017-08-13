// my.js
const app = getApp();
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
		dateFormat: null

	},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		let that = this;

		app.getAllInfoAboutMe((data)=>{
			if(!!data.userInfo) that.data.userInfo = data.userInfo;
			if(!!data.userInfo) that.data.lineAllInfo  = data.lineAllInfo;
			if(!!data.userInfo) that.data.viewData.resultList = data.resultList;

			if(!!data.userInfo) that.data.viewData.money = data.hadMoney;
			if(!!data.userInfo) that.data.viewData.lineNum = data.finishLineNum;

			that.setData({
				userInfo: that.data.userInfo,
				viewData: that.data.viewData,

			});
		});

		this.data.dateFormat = app.dateFormat;
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