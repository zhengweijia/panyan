// register.js
const app = getApp();
// 引入 QCloud 小程序增强 SDK
let qcloud = require('../../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
let config = require('../../../config');
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

			climbingTimeList: ['1年','2年','3年','4年','5年以上','10年以上'],
			climbingTimeDefaultIndex: 0, // 默认选中下标
			climbingTimeFirst:true,

			climbingAbilityList: ['5.9','5.10','5.11','5.12','5.13','5.14'],
			climbingAbilityDefaultIndex: 0, // 默认选中下标
			climbingAbilityFirst: true,

			userTypeMap:[{
				name: '报名套餐',
				price:'999',
				value: '1',
				checked: true
			},
				{
					name: '报名+住宿套餐',
					price:'1999',
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
  },
	onShow: function () {

	},

  bindPickerChange: function(e){
    let value = parseInt(e.detail.value);
    let id = e.currentTarget.id;
    if(id === 'height') {
    	// 第一次加载，始终是 0 bug
    	if(this.data.viewData.heightFirst) {
				value = this.data.viewData.heightDefaultIndex;
			}
      this.data.regUserInfo.height = this.data.viewData.heightList[value].replace(/cm/gi,'');
			this.data.viewData.heightFirst = false;
			this.data.viewData.heightDefaultIndex = value;
    } else if(id === 'weight') {
			// 第一次加载，始终是 0 bug
			if(this.data.viewData.weightFirst) {
				value = this.data.viewData.weightDefaultIndex;
			}
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
		if(this.data.viewData.submitButtonStatus){

			// 显示繁忙提示
			wx.showToast({
				title: '正在提交',
				icon: 'loading',
				duration: 10000
			});
			//请求线路难度表数据
			qcloud.request({
				url: config.service.URL+'user/register',
				method: 'POST',
				data: this.data.regUserInfo,
				success: (result) => {
					console.log(result);
					if(result.data.code == '0') {
						wx.showToast({
							title: '注册成功',
							icon: 'success',
							success:()=>{
								wx.redirectTo({
									url: '/pages/home/home'
								})
							}
						});
					}
				},
				fail(error) {
				}
			});


			
			
			// let nonceStr = (Math.random()+'').replace('.', '').substr(0, 20);
			// // 发起支付
			// wx.requestPayment({
			// 	'timeStamp': (new Date()).getTime(),
			// 	'nonceStr': nonceStr, // 随机串
			// 	'package': '', //统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=*
			// 	'signType': 'MD5',
			// 	'paySign': '',//签名
			// 	'success':function(res){
			// 	},
			// 	'fail':function(res){
			// 	}
			// });
		} else {
			this.setData({
				viewData: this.data.viewData
			});
		}
	}


});