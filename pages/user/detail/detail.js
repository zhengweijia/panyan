// detail.js
const app = getApp();
let config = require('../../../config');
// 引入 QCloud 小程序增强 SDK
let qcloud = require('../../../vendor/qcloud-weapp-client-sdk/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
		viewData:{
			money: 0,
			resultList: []
		},
		ranking: '',
		useLineDifficultyStandard: config.useLineDifficultyStandard, //难度使用什么标准
		canGetMonet: false, //能不能提前奖金
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
				that.data.viewData.resultList = [];
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

			// 请求配置，看现在能不能提取现金
			qcloud.request({
				// 检查有没有注册
				url: config.service.URL+'get/config',
				success: (con) => {
					if(!!con && con.data.data.can_draw == '1') {
						// 不能注册了
						that.setData({
							canGetMonet: true,
						});
					}
				}
			});

			// 请求名次
			qcloud.request({
				url: config.service.URL+'user/get/ranking/'+data.userInfo.id,
				success: (msg) => {
					if(!!msg && !!msg.data.data.ranking) {
						that.setData({
							ranking: msg.data.data.ranking
						});
					}
				}
			});

			if(!!call) {
				call();
			}
		});
	},

	// 提现
	getMoney: function () {

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