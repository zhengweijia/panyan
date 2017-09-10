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
			phone: '',
			game_list:'自然岩壁红点大赛'
		},

		submitButtonStatus: false,
		// 表格错误信息
		errorMsg: {
			phone: '',
			game_list: '',
		},

		gameTypeItems: [
			{name: '自然岩壁红点大赛', value: '自然岩壁红点大赛', checked: true},
			{name: '攀石赛-专业组', value: '攀石赛-专业组', checked: false},
			{name: '攀石赛-公开组', value: '攀石赛-公开组', checked: false},
			{name: '攀石赛-青少年组', value: '攀石赛-青少年组', checked: false}
		]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

		// 从本地拿目前有的用户信息
		let value = app.globalData.userInfo;
		if (value) {
			this.data.regUserInfo.avatar_url = value.avatar_url;
		}

		this.setData({
			regUserInfo: this.data.regUserInfo
		});

	},

	checkboxChange: function (e) {
		let gameTypeItems = this.data.gameTypeItems, values = e.detail.value;
		for (let i = 0, lenI = gameTypeItems.length; i < lenI; ++i) {
			gameTypeItems[i].checked = false;

			for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
				if(gameTypeItems[i].value == values[j]){
					gameTypeItems[i].checked = true;
					break;
				}
			}
		}


		let game_list = '';
		for(let g of this.data.gameTypeItems) {
			if(g.checked) {
				if(game_list === '') {game_list= g.value;}
				else {game_list = game_list+','+g.value;}
			}
		}
		this.data.regUserInfo.game_list = game_list;

		if(game_list === '') {
			this.data.errorMsg[e.currentTarget.id] = '请选择';
		} else {
			this.data.errorMsg[e.currentTarget.id] = '';
		}

		this.vaildForm();

		this.setData({
			errorMsg: this.data.errorMsg,
			gameTypeItems: gameTypeItems,
			submitButtonStatus: this.data.submitButtonStatus
		});
	},

	bindBlur: function(e) {
		let value = e.detail.value;
		let id = e.currentTarget.id;
		let msg = '';
		if(id === 'phone') {
			if(!config.regExp.isCnMobile.test(value)) {
				msg = '格式不正确';
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
			//注册
			qcloud.request({
				url: config.service.URL+'user/modify/phone',
				method: 'POST',
				data: that.data.regUserInfo,
				success: (result2) => {
					if(result2.data.code == '0') {
						wx.redirectTo({
							url: '/pages/user/home/home'
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