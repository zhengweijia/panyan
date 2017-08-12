// register.js
const app = getApp();
// 引入 QCloud 小程序增强 SDK
let qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
let config = require('../../config');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    regUserInfo: {
			openid: '',
			type: '', //账户报名类型，0没有类型，1报名，2报名+住宿
			nick: '', // 昵称，微信名
			idCard: '',//身份证
      name: '',

			height: '', //身高
			weight: '', //
			gender: '', //
			clothes_size: '', //
			climbing_ability: '', //
			climbing_time: '', //攀岩年龄

			phone: '',
			email: '',
			avatarUrl: ''
    },

		submitButtonStatus: false,
		submitButtonClass: 'disabled',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		// 从本地拿目前有的用户信息
		let value = app.globalData.userInfo;
		if (value) {
			this.data.regUserInfo.openid = value.openId;
			this.data.regUserInfo.avatarUrl = value.avatarUrl;
			this.data.regUserInfo.gender = value.gender;
			this.data.regUserInfo.nick = value.nickName;
		}

		this.setData({
			regUserInfo: this.data.regUserInfo
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
});