// pages/user/resultdetail/detail.js
const app = getApp();
let config = require('../../../config');
// 引入 QCloud 小程序增强 SDK
let qcloud = require('../../../vendor/qcloud-weapp-client-sdk/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
		avatar_url: '',
		blockList:[

		],
		showReport: false,
		indicatorDots: true,
		autoplay: false,
		duration: 100,
		current: 0, //当前所在index
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  	let id = options.id; //当前预览的id
		if(!!app && !!app.globalData.resultList && !!app.globalData.resultList.length > 0) {
			let blockList = [];
			for(let result of app.globalData.resultList) {
				let obj = {
					title1:'',
					title2: {
						difficult:'',
						time:''
					},
					title3:'',
				};

				obj.title1 = '已完成'+result.line.ground.area.name+' / '+result.line.ground.name+' / '+result.line.name;
				obj.title2.difficult = result.line.lineDifficulty[config.useLineDifficultyStandard];
				obj.title2.time = result.gameTime;

				obj.title3 = result.line.preMoney;

				blockList.push(obj);

				if(result.id == id) {
					this.data.current = blockList.length -1;
				}
			}
			this.setData({
				avatar_url: app.globalData.userInfo.avatar_url,
				blockList: blockList,
				current: this.data.current
			})
		} else {
			//	如果列表页面没有传送数据，则返回到 home
			wx.redirectTo({
				url: '/pages/user/home/home'
			});
		}
  },
	back: function () {
		//返回上一页
		wx.navigateBack({
			delta: 1
		});
	},

	onPullDownRefresh: function () {
		this.update(()=>{
			wx.stopPullDownRefresh();
		});
	},

	onShareAppMessage: function (res) {
		return app.commonShareAppMessage(res);
	}
});