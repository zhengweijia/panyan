// register.js

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
		regUserInfo: {
			avatar_url: '',
			wechat_id: '',
		},

		hasId : '',

		submitButtonStatus: false,
		// 表格错误信息
		errorMsg: {
			wechat_id: '',
		},
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

		// 从本地拿目前有的用户信息
		let value = app.globalData.userInfo;
		if (value) {
			this.data.regUserInfo.avatar_url = value.avatar_url;
			if(!!value.wechat_id) {
				this.data.hasId = value.wechat_id;
			}
		}

		this.setData({
			regUserInfo: this.data.regUserInfo,
			hasId: this.data.hasId
		});

		wx.setNavigationBarTitle({ title: '确认微信号' });

	},

	bindBlur: function(e) {
		let value = e.detail.value;
		let id = e.currentTarget.id;
		let msg = '';
		if(id === 'wechat_id') {
			if(!value || value === '') {
				msg = '请输入';
			}
		}

		this.data.errorMsg[e.currentTarget.id] = msg;
		this.data.regUserInfo[id] = value;

		this.vaildForm();
		this.setData({
			errorMsg: this.data.errorMsg,
			submitButtonStatus: this.data.submitButtonStatus
		});

	},

	vaildForm: function () {
		let vaild = true;
		for(let i in this.data.errorMsg) {
			if(this.data.errorMsg[i] !== '' || this.data.regUserInfo[i] === '') {
				vaild = false;
				break;
			}
		}

		if(vaild) {
			this.data.submitButtonStatus = true;
		} else {
			this.data.submitButtonStatus = false;
		}
	},

	// 提交表单
	formSubmit: function () {
		let that = this;
		// 表单是否验证通过
		if(this.data.submitButtonStatus) {
			// 提交
			qcloud.request({
				method: 'POST',
				data: {wechat_id:this.data.regUserInfo.wechat_id},
				url: config.service.URL+'user/modify/wechatid',
				success: (msg) => {
					if(!!msg && msg.data.code == 0) {
						wx.showModal({
							content: '保存成功',
							showCancel: false,
							success: function (res) {
								if (res.confirm) {
									wx.redirectTo({
										url: '/pages/user/home/home'
									});
								}
							}
						});
					} else {
						wx.showToast({
							title: '保存失败，请稍后再试',
							success:()=>{
							}
						});
					}
				}
			});
		}
	},

	onPullDownRefresh: function () {
		wx.stopPullDownRefresh();
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
	}

	,onShareAppMessage: function (res) {
		return app.commonShareAppMessage(res);
	}
});