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

		},
		useLineDifficultyStandard: config.useLineDifficultyStandard,
		showLoading: true,
		firstShow: true // 是否第一次show，主要用于onshow 时判断，不用多发请求
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
					result.line = that.data.lineAllInfo.lineMap[result.line_id];
				}


				that.data.viewData.resultOnList = resultOnList;
				that.setData({
					viewData: that.data.viewData,
					lineAllInfo: that.data.lineAllInfo,
					userInfo: that.data.userInfo,
					showLoading: false,
				});
			});
		});
	},
	onReady: function () {

	},

	onShow: function () {
		if(!this.data.firstShow) {
			this.updateOn();
		}
		this.data.firstShow = false;
	},

	updateOn:function (back) {
		this.getAllOn().then((resultOnList)=>{
			// 填充 线路信息到 正在进行的比赛中
			for(let result of resultOnList) {
				result.line = this.data.lineAllInfo.lineMap[result.line_id];
			}

			this.data.viewData.resultOnList = resultOnList;
			this.setData({
				viewData: this.data.viewData
			});

			if(!!back) back();
		});
	},
	// 点击查看一次攀爬
	checkGame: function (e) {
		let id = e.currentTarget.dataset.id; //比赛id
		wx.navigateTo({
			url: '/pages/judgment/status/status?id='+id,
		});
	},

	changeStatus: function (e) {
		let id = e.currentTarget.dataset.id; //比赛id
		let status = e.currentTarget.dataset.status; //比赛id
		if(!!status && !!id) {
			this.sendStatus(id, status);
		}
	},

	sendStatus: function (id, status) {
		let that = this;
    let content = '确认选手此次攀爬';
		if(status == '0') {
			content= content+'失败';
		} else {
			content= content+'成功';
		}
		wx.showModal({
			title: '确认',
			content: content,
			confirmText: "确定",
			cancelText: "取消",
			success: function (res) {
				console.log(res);
				if (res.confirm) {
					//发送请求开始
					qcloud.request({
						url: config.service.URL+'judgment/end',
						method: 'POST',
						data: {
							id: id,
							status: status
						},
						success: (result2) => {
							if(result2.data.code == '0') {
								wx.redirectTo({
									url: '/pages/judgment/home/home'
								});
							} else{
								wx.showToast({
									title: result2.data.message,
									icon: 'loading',
									duration: 3000
								});
							}
						},
						fail(error) {
							wx.showToast({
								title: '请稍候再试',
								icon: 'loading',
								duration: 2000
							});
						}
					});
				}
			}
		});
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

	// 新增一条攀爬
	addGame: function (e) {
    wx.navigateTo({
      url: '/pages/judgment/new/new',
    });
	},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  	let that = this;
		that.updateOn(function () {
			wx.stopPullDownRefresh();
		});
  }

	,onShareAppMessage: function (res) {
		return app.commonShareAppMessage(res);
	}
});