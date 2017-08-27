// register.js
const app = getApp();
// 引入 QCloud 小程序增强 SDK
let qcloud = require('../../../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
let config = require('../../../../config');
let price = 0; //需要支付报名金额

Page({

  /**
   * 页面的初始数据
   */
  data: {
  	// 界面数据
		viewData: {
			submitButtonStatus: false,
			heightList: [],
			heightDefaultIndex: 0, // 默认选中下标
			heightFirst:true,

			weightList: [],
			weightDefaultIndex: 0, // 默认选中下标
			weightFirst:true,

			genderList: ['男', '女'],
			genderDefaultIndex: 0, // 默认选中下标
			genderFirst:true,

			clothesSizeList: ['XXXS', 'XXS', 'XS','S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
			clothesSizeDefaultIndex: 4, // 默认选中下标
			clothesSizeFirst:true,

			climbingTimeList: ['0-1年','1-2年','2-3年','3-4年','4-10年以上','10年以上'],
			climbingTimeDefaultIndex: 0, // 默认选中下标
			climbingTimeFirst:true,

			climbingAbilityList: ['5.9','5.10','5.11','5.12','5.13','5.14'],
			climbingAbilityDefaultIndex: 0, // 默认选中下标
			climbingAbilityFirst: true,

			userTypeMap:[{
				name: '报名套餐',
				price:'150',
				value: '1',
				checked: true
			},
				{
					name: '报名费&住宿费',
					price:'350',
					value: '2',
					checked: false
				}
			],

		},


		regUserInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 拿到数据
    if (!!app.globalData.regUserInfo) {
      this.data.regUserInfo = app.globalData.regUserInfo;
			this.data.regUserInfo.type = '1';// 默认报名第一种
			// this.data.regUserInfo.out_trade_no = '';//
    }
  	// 设置身高范围
		let heightMin = 140;
		let heightMax = 220;
		let heightDefault = 170; //默认选中
		for(let i=0; (i+heightMin)<heightMax; i++) {
			this.data.viewData.heightList.push((i+heightMin+'cm'));
			if((i+heightMin) === heightDefault) {
				this.data.viewData.heightDefaultIndex = i;
			}
		}
		this.data.regUserInfo.height = heightDefault;


		// 设置体重范围
		let wMin = 35;
		let wMax = 120;
		let wDefault = 70; //默认选中
		for(let i=0; (i+wMin)<wMax; i++) {
			this.data.viewData.weightList.push((i+wMin+'kg'));
			if((i+wMin) === wDefault) {
				this.data.viewData.weightDefaultIndex = i;
			}
		}
		this.data.regUserInfo.weight = wDefault;

		this.setData({
			viewData: this.data.viewData,
		});


		app.checkRegister(function (msg) {
			if(msg.isRegister) {
				// 0 管理员，1裁判，2参赛选手，3普通用户
				if(msg.userInfo.role == '1'){
					wx.redirectTo({
						url: '/pages/judgment/home/home'
					});
				} else if(msg.userInfo.role == '2') {
					wx.redirectTo({
						url: '/pages/user/home/home'
					});
				}
			}
		});

  },
	onShow: function () {
		if(!!app.globalData.comefrom && app.globalData.comefrom === 'msg_success') {
			wx.redirectTo({
				url: '/pages/user/home/home'
			});
		}
		// app.checkRegister(function (msg) {
		// 	if(msg.isRegister) {
		// 		// 0 管理员，1裁判，2参赛选手，3普通用户
		// 		if(msg.userInfo.role == '1'){
		// 			wx.redirectTo({
		// 				url: '/pages/judgment/home/home'
		// 			});
		// 		} else if(msg.userInfo.role == '2') {
		// 			wx.redirectTo({
		// 				url: '/pages/user/home/home'
		// 			});
		// 		}
		// 	} else {
		// 		that.setData({
		// 			showLoading: false
		// 		});
		// 	}
		// });
	},

  bindPickerChange: function(e){
    let value = parseInt(e.detail.value);
    let id = e.currentTarget.id;
    if(id === 'height') {
    	// 第一次加载，始终是 0 bug
    	// if(this.data.viewData.heightFirst) {
				// value = this.data.viewData.heightDefaultIndex;
			// }
      this.data.regUserInfo.height = this.data.viewData.heightList[value].replace(/cm/gi,'');
			this.data.viewData.heightFirst = false;
			this.data.viewData.heightDefaultIndex = value;
    } else if(id === 'weight') {
			// 第一次加载，始终是 0 bug
			// if(this.data.viewData.weightFirst) {
			// 	value = this.data.viewData.weightDefaultIndex;
			// }
			this.data.regUserInfo.weight = this.data.viewData.weightList[value].replace(/kg/gi,'');
			this.data.viewData.weightFirst = false;
			this.data.viewData.weightDefaultIndex = value;
		}else if(id === 'gender') {
			this.data.regUserInfo.gender = value+1;
			this.data.viewData.genderFirst = false;
			this.data.viewData.genderDefaultIndex = value;
		}else if(id === 'clothes_size') {
			this.data.regUserInfo.clothes_size = this.data.viewData.clothesSizeList[value];
			this.data.viewData.clothesSizeFirst = false;
			this.data.viewData.clothesSizeDefaultIndex = value;
		}

		else if(id === 'climbing_time') {
			this.data.regUserInfo.climbing_time = this.data.viewData.climbingTimeList[value];
			this.data.viewData.climbingTimeFirst = false;
			this.data.viewData.climbingTimeDefaultIndex = value;
		}else if(id === 'climbing_ability') {
			this.data.regUserInfo.climbing_ability = this.data.viewData.climbingAbilityList[value];
			this.data.viewData.climbingAbilityFirst = false;
			this.data.viewData.climbingAbilityDefaultIndex = value;
		}

		// 验证表格能不能提交
		let vaild = true;
		for (let key in this.data.viewData) {
			if(key.indexOf('First')>=0 && this.data.viewData[key]) {
				vaild = false;
			}
		}
		this.data.viewData.submitButtonStatus = vaild;

    this.setData({
			viewData: this.data.viewData
    });


  },

	typeRadioChange: function (e) {
		this.data.regUserInfo.type = e.detail.value;

		let userTypeMap = this.data.viewData.userTypeMap;
		for (let i = 0, len = userTypeMap.length; i < len; ++i) {
			userTypeMap[i].checked = userTypeMap[i].value == e.detail.value;
			if(userTypeMap[i].checked) {
				price = userTypeMap[i].price;
			}
		}

		this.setData({
			viewData: this.data.viewData
		});
	},

	formSubmit: function () {
  	let that = this;
		if(this.data.viewData.submitButtonStatus){

			if(!config.isDevelop) {
				// 请求支付信息
				qcloud.request({
					url: config.service.URL+'pay/get/config',
					method: 'POST',
					data: that.data.regUserInfo,
					success: (result) => {
						let msg ='';
						let type = '';
						if(result.data.code == '0') {
							let data = result.data.data;
							//判断支付结果
							if(!!data && !!data.prepay_id) {
								//保存一下当前的订单号，如果用户重复发起支付，使用同一个订单号，微信能帮忙处理
								// that.data.regUserInfo.out_trade_no = data.out_trade_no;
								// 发起支付
								wx.requestPayment({
									'timeStamp': data.time_stamp+'',
									'nonceStr': data.nonce_str,
									'package': 'prepay_id='+data.prepay_id,
									'signType': 'MD5',
									'paySign': data.signNew,
									'success':function(res){
										//注册
										qcloud.request({
											url: config.service.URL+'user/register',
											method: 'POST',
											data: that.data.regUserInfo,
											success: (result2) => {
												if(result2.data.code == '0') {
													wx.redirectTo({
														url: 'msg_success'
													});
												}
											},
											fail(error) {
											}
										});
									},
									'fail':function(res){
										// console.log(res);
										that.openAlert('付款失败');
									}
								})
							} else {
								that.openAlert('付款失败');
							}
							//						if(result.data.code == '0') {

						} else if(result.data.code == '-1000'){
							that.openAlert('已经注册成功', () =>{
								wx.redirectTo({
									url: '/pages/user/home/home'
								});
							});
						} else {
							that.openAlert('付款失败');
						}
					},
					fail(error) {
						that.openAlert('付款失败');
					}
				});
			} else {
				//注册
				qcloud.request({
					url: config.service.URL+'user/register',
					method: 'POST',
					data: that.data.regUserInfo,
					success: (result2) => {
						if(result2.data.code == '0') {
							wx.redirectTo({
								url: 'msg_success'
							});
						}
					},
					fail(error) {
					}
				});
			}


		} else {
			this.setData({
				viewData: this.data.viewData
			});
		}
	},
	onPullDownRefresh: function () {
		wx.stopPullDownRefresh();
	},
	openAlert: function (msg, call) {
		wx.showModal({
			content: msg,
			showCancel: false,
			success: function (res) {
				if (res.confirm) {
					if(!!call) call();
				}
			}
		});
	}

	,onShareAppMessage: function (res) {
		return app.commonShareAppMessage(res);
	}
});