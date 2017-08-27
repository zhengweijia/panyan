// home.js
const app = getApp();
// 引入 QCloud 小程序增强 SDK
let qcloud = require('../../../vendor/qcloud-weapp-client-sdk/index');
// 引入配置
let config = require('../../../config');

Page({

  /**
   * 页面的初始数据
   */
  data: {
  	userInfo:{},
		resultList: [],//我已经完成的线路
		lineAllInfo: {}, //所有线路
		viewData : {
  		money: 0.00,
			lineNum: 0,
		},
		icon1: config.staticUrl+'/img/home/1.png',
		icon2: config.staticUrl+'/img/home/2.png',
		icon3: config.staticUrl+'/img/home/3.png',
		icon4: config.staticUrl+'/img/home/4.png',
  },

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
    this.update();
	},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  onShow: function(){
    this.update();
  },
  update: function(call){
    let that = this;

    app.getAllInfoAboutMe((data) => {
      if (!!data.userInfo) that.data.userInfo = data.userInfo;
      if (!!data.userInfo) that.data.resultList = data.resultList;
      if (!!data.userInfo) that.data.lineAllInfo = data.lineAllInfo;

      if (!!data.userInfo) that.data.viewData.money = data.hadMoney;
      if (!!data.userInfo) that.data.viewData.lineNum = data.finishLineNum;

      that.setData({
        userInfo: that.data.userInfo,
        viewData: that.data.viewData,
      });

      if(!!call) call();
    });
  },

	onPullDownRefresh: function () {
    this.update(()=>{
      wx.stopPullDownRefresh();
    });
	},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  }
	,onShareAppMessage: function (res) {
		return app.commonShareAppMessage(res);
	}
});