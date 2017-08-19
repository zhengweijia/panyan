// register.js

const app = getApp();
// 引入 QCloud 小程序增强 SDK
let qcloud = require('../../../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
let config = require('../../../../config');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    regUserInfo: {
			openid: '',
			type: '', //账户报名类型，0没有类型，1报名，2报名+住宿
			nick: '', // 昵称，微信名
			id_card: '',//身份证
      name: '',

			height: '', //身高
			weight: '', //
			gender: '', //
			clothes_size: '', //
			climbing_ability: '', //
			climbing_time: '', //攀岩年龄

			phone: '',
			email: '',
			avatar_url: '',

			game_list:''
    },

		submitButtonStatus: false,
		// 表格错误信息
		errorMsg: {
    	name: '',
    	phone: '',
    	email: '',
			id_card: '',
		},

		gameTypeItems: [
			// {name: '自然岩壁红点大赛', value: '自然岩壁红点大赛', checked: true},
			{name: '攀石赛-专业组', value: '攀石赛-专业组', checked: false},
			{name: '攀石赛-公开组', value: '攀石赛-公开组', checked: false},
			{name: '攀石赛-青少年组', value: '攀石赛-青少年组', checked: false}
		]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		wx.setNavigationBarTitle({ title: '注册' });

		// 从本地拿目前有的用户信息
		let value = app.globalData.userInfo;
		if (value) {
			this.data.regUserInfo.openid = value.openid;
			this.data.regUserInfo.avatar_url = value.avatar_url;
			this.data.regUserInfo.gender = value.gender;
			this.data.regUserInfo.nick = value.nick;
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

		this.setData({
			gameTypeItems: gameTypeItems
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
		} else if(id === 'email') {
			if(!config.regExp.isMail.test(value)) {
				msg = '格式不正确';
			}
		} else if(id === 'phone') {
			if(!config.regExp.isCnMobile.test(value)) {
				msg = '格式不正确';
			}
		} else if(id === 'id_card') {
			// 如果是身份证，则验证还要验证年龄；否则就只做非空验证
			if(config.regExp.isIDCard.test(value)) {
				// msg = '格式不正确';
				//35052519870101888X
				//350525870101888
				let y = 0;
				if(value.length == 15) {
					//15位身份证
					y = 1900 + parseInt(value.substr(6, 2));
				} else {
					//18位身份证
					y = parseInt(value.substr(6, 4));
				}
				if(2017-y < 14) {
					msg = '必须年满 14 周岁';
				}
			} else if(value.length <= 0) {
				msg = '不能为空';
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

			let game_list = '自然岩壁红点大赛';
			for(let g of this.data.gameTypeItems) {
				if(g.checked) {
					game_list = game_list+','+g.value;
				}
			}
			this.data.regUserInfo.game_list = game_list;
			app.globalData.regUserInfo = this.data.regUserInfo; // 将信息填入全局保存
			wx.redirectTo({
        url: '/pages/user/register/two/register',
      });
		}
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
	},
});