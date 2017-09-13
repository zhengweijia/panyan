// status.js
// home.js
const app = getApp();
// 引入 QCloud 小程序增强 SDK
let qcloud = require('../../../vendor/qcloud-weapp-client-sdk/index');
// 引入配置
let config = require('../../../config');

let timeerId = null; //定时器
let freshTimerId = null; //定时刷新的
Page({

  /**
   * 页面的初始数据
   */
  data: {
		ftime: 30*1000, // 定时更新从服务端拿数据
		looptime: 1000, // 倒计时间隔


		timerStr: '',//00:14.34
		initTime: null, // 攀岩开始的时间
		result_id: null, //结果 id
		resultInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		let id = options.id;
		if(!!id && (/^\d+$/i).test(id)) {
			this.data.result_id = id;
			this.getResultInfo(this.data.result_id).then(()=>{
				this.startTimer(); // 开始倒计时
			});
		} else {
			wx.redirectTo({
			  url: '/pages/judgment/home/home'
			})
		}
		
  },

	getResultInfo: function (id) {
		let that = this;
		let promise = new Promise(resolve=>{
			qcloud.request({
				method: 'POST',
				url: config.service.URL+'judgment/get',
				data:{id: id},
				success: (msg) => {
					let ret = [];
					if(msg.data.code == '0' && !!msg.data.data) {

						let resultInfo = msg.data.data;
						if(resultInfo.status == '-1' && !!resultInfo.useTime) {
							that.data.initTime = (new Date()).getTime() - resultInfo.useTime;//设置开始时间
						} else {
							that.data.initTime = (new Date()).getTime();//设置开始时间
						}
						that.data.resultInfo = resultInfo;

						ret = resultInfo;
					}
					resolve(ret);
				}
			});
		});
		return promise;
	},

	onReady: function () {
		this.freshTimer();
	},

	// 开始倒计时
	startTimer: function () {
  	let that = this;
		if(!!timeerId) {
			clearInterval(timeerId);
			timeerId = null;
		}
		timeerId = setInterval(()=>{
			let aa = that.getTimeStr(that.data.initTime);
			that.setData({
				timerStr: aa
			});
		}, this.data.looptime);
	},
	// 停止倒计时
	endTimer: function () {
		if(!!timeerId) {
			clearInterval(timeerId);
			timeerId = null;
		}
	},

	// 获取开始时间到当前时间的时间差，精确到毫秒
	// 00:14.34
	getTimeStr: function (startStr) {
  	let start = (new Date(startStr)).getTime();
  	let now = (new Date()).getTime(); //

		let mm = Math.floor( (now-start) / 1000 / 60 );
		let ss = Math.floor( (now-start) / 1000 % 60);
		let hs = Math.floor( (now-start) % 1000);

		if((mm+'').length < 2) {
			mm = '0'+mm;
		}
		if((ss+'').length < 2) {
			ss = '0'+ss;
		}
		if((hs+'').length < 3) {
			hs = '0'+hs;
			if((hs+'').length < 3) {
				hs = '0'+hs;
			}
		}
		// return mm+':'+ss+'.'+hs;
    return mm + ':' + ss;
	},

	fail: function (e) {
		this.sendStatus('0');
	},
	success: function (e) {
		this.sendStatus('1');
	},

	sendStatus: function (status) {
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
				if (res.confirm) {
					//发送请求开始
					qcloud.request({
						url: config.service.URL+'judgment/end',
						method: 'POST',
						data: {
							id: that.data.result_id,
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


	// 每隔 30s 更正下数据（倒计时）
	freshTimer: function () {
		freshTimerId = setInterval(()=>{
			this.getResultInfo(this.data.result_id).then(()=>{
				this.startTimer(); // 开始倒计时
			});
		}, this.data.ftime)
	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {
		if(!!timeerId) clearInterval(timeerId);
		if(!!freshTimerId) clearInterval(freshTimerId);
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {
		let that = this;
		that.getResultInfo(this.data.result_id).then(()=>{
			that.startTimer(); // 开始倒计时
			wx.stopPullDownRefresh();
		});
	},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
		return app.commonShareAppMessage(res);
	}
});