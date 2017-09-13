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
			openid: '',
			nick: '', // 昵称，微信名
			id_card: '',//身份证
			name: '',

			gender: '', //

			phone: '',
			email: '',
			avatar_url: '',
			code: ''
		},

		submitButtonStatus: false,
		// 表格错误信息
		errorMsg: {
			name: '',
			phone: '',
			code: '',
			id_card: '',
		},

		showLoading: true,
	},



	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.setNavigationBarTitle({ title: '裁判注册' });

		// 检查有没有注册过
		app.checkRegister((data)=>{
			if(!!data && data.isRegister) {
				let url = '/pages/index/index';
				// 已经注册过了，判断类型，跳转到不同主页
				app.checkUserTypeAndRedirectTo();
			} else {

				// 从本地拿目前有的用户信息
				let value = app.globalData.userInfo;
				if (value) {
					this.data.regUserInfo.openid = value.openid;
					this.data.regUserInfo.avatar_url = value.avatar_url;
					this.data.regUserInfo.gender = value.gender;
					this.data.regUserInfo.nick = value.nick;
				}
				this.setData({
					regUserInfo: this.data.regUserInfo,
					showLoading: false
				});
			}
		});
	},



	bindBlur: function(e) {
		let value = e.detail.value;
		let id = e.currentTarget.id;
		let msg = '';
		if(id === 'name') {
			if(value.length <= 0) {
				msg = '不能为空';
			}
		} else if(id === 'code') {
			if(value.length <= 0) {
				msg = '不能为空';
			}
		} else if(id === 'phone') {
			if(!config.regExp.isCnMobile.test(value)) {
				msg = '格式不正确';
			}
		} else if(id === 'id_card') {
			if(!config.regExp.isIDCard.test(value)) {
				msg = '格式不正确';
			}
		}

		this.data.errorMsg[e.currentTarget.id] = msg;
		this.data.regUserInfo[id] = value;

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
		this.setData({
			errorMsg: this.data.errorMsg,
			submitButtonStatus: this.data.submitButtonStatus
		});

	},

	// 提交表单
	formSubmit: function () {
		// 表单是否验证通过
		if(this.data.submitButtonStatus) {
			app.globalData.regUserInfo = this.data.regUserInfo; // 将信息填入全局保存

			// 显示繁忙提示
			wx.showToast({
				title: '正在提交',
				icon: 'loading',
				duration: 10000
			});
			//请求线路难度表数据
			qcloud.request({
				url: config.service.URL+'user/judgment/register',
				method: 'POST',
				data: this.data.regUserInfo,
				success: (result) => {
					if(result.data.code == '0') {
						wx.showToast({
							title: '注册成功',
							icon: 'success',
							success:()=>{
								wx.redirectTo({
									url: '/pages/judgment/home/home'
								})
							}
						});
					} else {
						wx.showToast({
							title: result.data.message,
							image:'aa'
						});
						this.data.errorMsg.code = result.data.message;
						this.setData({
							errorMsg: this.data.errorMsg,
							submitButtonStatus: false
						});
					}
				},
				fail(error) {
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