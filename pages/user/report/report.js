// report.js
const app = getApp();
// 引入 QCloud 小程序增强 SDK
let qcloud = require('../../../vendor/qcloud-weapp-client-sdk/index');
// 引入配置
let config = require('../../../config');
Page({

	data: {

		blockList:[
			{
				img: config.staticUrl+'/img/report/1.png',
				className: 'img1',
				title1:'你获得的总奖金',
				title2:'4321 元',
				title3:'',
			},
			{
				img: config.staticUrl+'/img/report/2.png',
				className: 'img2',

				title1:'完成的线路最高难度为',
				title2:'5.14',
				title3:'仅有 3 人完攀',
			},
			{
				img: config.staticUrl+'/img/report/3.png',
				className: 'img3',

				title1:'你一共完成了',
				title2:'15 条线路',
				title3:'',
			},
			{
				img: config.staticUrl+'/img/report/4.png',
				className: 'img4',

				title1:'最快完成线路用时',
				title2:'1小时45分56秒',
				title3:'超过 98% 的选手',
			}
		],
		indicatorDots: true,
		autoplay: false,
		duration: 600
	},


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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

	onPullDownRefresh: function () {
		wx.stopPullDownRefresh();
	},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  }

	,onShareAppMessage: function (res) {
		return app.commonShareAppMessage(res);
	}
})