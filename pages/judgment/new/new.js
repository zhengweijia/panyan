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
		useLineDifficultyStandard: config.useLineDifficultyStandard, //难度使用什么标准

		formData: {

			area_id: '', // 区域id
			ground_id: '', // 被选中的groundid

			line_id: '', //线路id
			user_id: null, //选手 id
		},

		viewData: {
			waitGroundList:[],//选中区域后，筛出来的ground
			waitLineList:[],//选中区域后，筛出来的line
			valid:false,

		},

		lineMap: {},
		lineList: [],

		groundMap: {},
		groundList: [],
		lineDifficultyList: [], //所有难度列表
		areaMap: {},
		areaList: [],
  },

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let that = this;

		app.getAllLineInfo((data)=>{

			// 全部线路信息
			if(!!data){
				// 所有难度信息
				that.data.lineDifficultyList = data.lineDifficultyList;

				that.data.lineMap = data.lineMap;
				for(let id in data.lineMap) {
					that.data.lineList.push(data.lineMap[id]);
				}

				that.data.groundMap = data.groundMap;
				for(let id in data.groundMap) {
					that.data.groundList.push(data.groundMap[id]);
				}

				that.data.areaMap = data.areaMap;
				for(let id in data.areaMap) {
					that.data.areaList.push(data.areaMap[id]);
				}
			}

			that.setData({
				viewData: that.data.viewData,
				formData: that.data.formData,
				// groundList: that.data.groundList,
				areaList: that.data.areaList,
				// lineList: that.data.lineList,
			});
		});

	},

	selectArea: function (e) {
		let id = e.currentTarget.dataset.value;
		if(this.data.formData.area_id !== id) {
			this.data.formData.area_id = id;

			// 筛出这个区域下的所有场地
			this.data.viewData.waitGroundList = [];
			for(let g of this.data.groundList) {
				if(g.area_id == id) {
					this.data.viewData.waitGroundList.push(g);
				}
			}
			this.data.formData.ground_id = '';// 每次换了区域，则重置选中的场地
			this.data.formData.line_id = '';//

			this.data.viewData.waitLineList = [];// 每次换了区域，则重置选中的场地
			this.valdForm();
		}

	},

	selectGround: function (e) {
		let id = e.currentTarget.dataset.value;
		if(id !== this.data.formData.ground_id) {
			this.data.formData.ground_id = id;
			this.data.formData.line_id = '';//

			// 筛出这个岩场下的所有线路
			this.data.viewData.waitLineList = [];
			for(let line of this.data.lineList) {
				if(line.ground_id == id) {
					this.data.viewData.waitLineList.push(line);
				}
			}
			this.valdForm();
		}


	},

	selectLine: function (e) {
		let id = e.currentTarget.dataset.value;
		if(id !== this.data.formData.line_id) {
			this.data.formData.line_id = id;//
			this.valdForm();
		}
	},

	valdForm: function () {
		let v = true;
		for(let key in this.data.formData) {
			if(!this.data.formData[key]) {
				v = false;
				break;
			}
		}

		this.data.viewData.valid = v;
		this.setData({
			formData: this.data.formData,
			viewData: this.data.viewData
		});

		return v;
	},
	// 选手编号
	bindBlur: function(e) {
		let value = e.detail.value;
		let id = e.currentTarget.id; //user_id

		if(value ==='' && !(/^\d{1,9}$/gi).test(value)) {
			value = '';
		}
		this.data.formData.user_id = value;
		this.valdForm();
	},

	start: function (e) {
		let that = this;
	//	验证表单
		if(this.valdForm()) {
			// 弹窗确认
			let line = this.data.lineMap[this.data.formData.line_id];
			let content = '选手编号：'+this.data.formData.user_id+'\n 攀爬路线：'+line.ground.area.name+' '+line.ground.name+' '+line.name+'\n难度：'+line.lineDifficulty[this.data.useLineDifficultyStandard];
			wx.showModal({
				title: '确认开始',
				content: content,
				confirmText: "确定",
				cancelText: "取消",
				success: function (res) {
					console.log(res);
					if (res.confirm) {
						//发送请求开始
						qcloud.request({
							url: config.service.URL+'judgment/start',
							method: 'POST',
							data: that.data.formData,
							success: (result2) => {
								if(result2.data.code == '0') {
									// wx.redirectTo({
									// 	url: '/pages/judgment/status/status'
									// });
								}
							},
							fail(error) {
							}
						});
					}
				}
			});
		}
	},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
		return app.commonShareAppMessage(res);
	}
})