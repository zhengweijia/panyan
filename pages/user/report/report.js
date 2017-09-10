// report.js
const app = getApp();
// 引入 QCloud 小程序增强 SDK
let qcloud = require('../../../vendor/qcloud-weapp-client-sdk/index');
// 引入配置
let config = require('../../../config');
Page({

	data: {

		blockList:[
			{
				img: config.staticUrl+'/img/report/1.png',
				className: 'img1',
				title1:'你获得的总奖金',
				title2:'',
				title3:'',
			},
			{
				img: config.staticUrl+'/img/report/2.png',
				className: 'img2',

				title1:'完成的线路最高难度为',
				title2:'5.14',
				title3:'仅有 3 人完攀',
			},
			{
				img: config.staticUrl+'/img/report/3.png',
				className: 'img3',

				title1:'你一共完成了',
				title2:'15 条线路',
				title3:'',
			},
			{
				img: config.staticUrl+'/img/report/4.png',
				className: 'img4',

				title1:'最快完成线路用时',
				title2:'1小时45分56秒',
				title3:'超过 98% 的选手',
			}
		],
		showReport: false,
		indicatorDots: true,
		autoplay: false,
		duration: 100
	},


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  	let that = this;
		// 请求配置，看现在能不能提取现金
		qcloud.request({
			// 检查有没有注册
			url: config.service.URL+'user/reportinfo',
			success: (msg) => {
				if(!!msg && msg.data.code == '0' && !!msg.data.data.maxLineDifficulty && !!msg.data.data.maxLineDifficulty.id) {

					let data = msg.data.data;
					that.data.blockList[0].title2 = data.money+' 元';

					that.data.blockList[1].title2 = data.maxLineDifficulty[config.useLineDifficultyStandard];
					that.data.blockList[1].title3 = '仅有 '+data.maxDifficultyUserNum+' 人完攀';

					that.data.blockList[2].title2 = data.finishNum+' 条线路';

					//title2:'1小时45分56秒',
					// title3:'超过 98% 的选手',
					let time = data.fastTime;
					let hh = Math.floor( time / 60 / 60);
					let mm = Math.floor( time / 60 % 60);
					let ss = Math.floor( time % 60);
					that.data.blockList[3].title2 = hh+'小时'+mm+'分'+ss+'秒';
					that.data.blockList[3].title3 = '超过 '+data.fastTimeRate+' 的选手';

					that.setData({
						blockList: that.data.blockList,
						showReport: true
					});
				}
			}
		});
  },

	onPullDownRefresh: function () {
		wx.stopPullDownRefresh();
	},

	onShareAppMessage: function (res) {
		return app.commonShareAppMessage(res);
	}
})