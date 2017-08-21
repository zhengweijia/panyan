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
		//所有线路信息
		lineAllInfo: {
  		areaMap: {},
			groundMap: {},
			lineMap: {},
			lineDifficultyList: []
		},
		viewData : {
			resultOnList: [],//所有正在进行中的比赛
			optResult:{}, //当前正在操作的比赛
		}
  },

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		let that = this;
		app.checkRegisterAndRedirectTo(function (user) {
			that.data.userInfo = user;
			// 拿到所有正在进行中的线路
			Promise.all([that.getAllOn(), that.getAllLine()]).then(list=>{
				let resultOnList = list[0];
				that.data.lineAllInfo = list[1];
				// 填充 线路信息到 正在进行的比赛中
				for(let result of resultOnList) {
					for(let line of that.data.lineAllInfo) {
						if (result.line_id === line.id) {
							result.line = line;
							break;
						}
					}
				}


				that.data.viewData.resultOnList = resultOnList;
				that.setData({
					viewData: that.data.viewData,
					lineAllInfo: that.data.lineAllInfo,
					userInfo: user
				});
			});
		});

	},
	onReady: function () {

	},


	// 点击查看一次攀爬
	checkGame: function (e) {
		let id = e.target.dataset.id; //比赛id

	},

	changeStatus: function (e) {
		let id = e.target.dataset.id; //比赛id
		let status = e.target.dataset.status; //比赛id
		if(status == '1') {
			// 判断成功
		} else {
		  //判断失败
		}
	},

// 拿到所有正在进行中的线路
	getAllOn: function () {
		let that = this;
		let promise = new Promise(resolve=>{
				qcloud.request({
					url: config.service.URL+'judgment/all/on',
					success: (msg) => {
						let ret = [];
						if(msg.data.code == '0' && !!msg.data.data) {
							let playerList = msg.data.data.userList;
							let resultList = msg.data.data.resultList;

							for(let result of resultList) {
								for(let player of playerList) {
									if(result.user_id == player.id) {
										result.user = player;
										break;
									}
								}
							}
							ret = resultList;
						}
						resolve(ret);
					}
				});
		});

		return promise;
	},
	// 拿到所有正在进行中的线路
	/**
	 *
	 * @returns {Promise}
	 * let ret = {
					areaMap: {},
					groundMap: {},
					lineMap: {},
					lineDifficultyList: [],
				};
	 */
	getAllLine: function () {
		let that = this;
		let promise = new Promise(resolve=>{
			app.getAllLineInfo(function (data) {
				resolve(data);
			});
		});
		return promise;
	},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  }

	,onShareAppMessage: function (res) {
		return app.commonShareAppMessage(res);
	}
});