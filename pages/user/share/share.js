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
  	bgImg: config.staticUrl+'/img/bg.jpg',
		show: false,
		canvasWidth: 0,
		canvasHeight: 0,

		width: 0,
		height: 0,

		textMap: {
  		t1: '谁谁谁的成绩单',
  		t2: '14',
  		t3: '3728',

  		t4: '1小时5分15秒',
  		t5: '超过98%的参赛选手',

  		t6: '5.15a',
  		t7: '仅有3人完攀',
		}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		let that = this;

		if(!!app.globalData && !!app.globalData.reportData) {
  		let data = app.globalData.reportData;

			//title2:'1小时45分56秒',
			// title3:'超过 98% 的选手',
			let time = data.fastTime;
			let hh = Math.floor( time / 60 / 60);
			let mm = Math.floor( time / 60 % 60);
			let ss = Math.floor( time % 60);

			this.data.textMap.t1 = app.globalData.userInfo.name+'的成绩单';
			this.data.textMap.t2 = data.finishNum;
			this.data.textMap.t3 = data.money;
			this.data.textMap.t4 = hh+'小时'+mm+'分'+ss+'秒';
			this.data.textMap.t5 = '超过'+data.fastTimeRate+'的选手';
			this.data.textMap.t6 = data.maxLineDifficulty[config.useLineDifficultyStandard];
			this.data.textMap.t7 = '仅有'+data.maxDifficultyUserNum+'人完攀';

			wx.getSystemInfo({
				success: function(res) {
					that.data.width = res.windowWidth;
					that.data.height = res.windowHeight;
				}
			});
			this.drawImage();

		} else {
			//返回上一页
			wx.navigateBack({
				delta: 1
			});
		}
  },

	drawImage: function () {
		let that = this;
		wx.getImageInfo({
			src: this.data.bgImg,
			success: function (res) {
				// 计算canvas宽高，刚好跟图片一样比例
				let imgWidth = res.width;
				let imgHeight = res.height;
				let imgrate = imgHeight/imgWidth;
				let sumRate = that.data.width/imgWidth;

				that.data.canvasWidth = that.data.width;
				that.data.canvasHeight = that.data.canvasWidth * imgrate;
				that.setData({
					canvasWidth: that.data.canvasWidth,
					canvasHeight: that.data.canvasHeight,
					show: true,
				});

				let textMap = that.data.textMap;
				let context = wx.createCanvasContext('share-canvas');

				context.drawImage(res.path,0,0,that.data.canvasWidth, that.data.canvasHeight);

				// 姓名
				context.setFontSize(parseInt(sumRate*36));
				context.setFillStyle('#FFFFFF');
				context.fillText(textMap.t1, parseInt(sumRate*70),parseInt(sumRate*176));

				// 完成线路数量
				context.setFontSize(parseInt(sumRate*65));
				context.setFillStyle('#F8B62D');
				context.fillText(textMap.t2, parseInt(sumRate*410),parseInt(sumRate*415));

				// 奖金
				context.setFontSize(parseInt(sumRate*60));
				context.setFillStyle('#F8B62D');
				context.fillText(textMap.t3, parseInt(sumRate*260),parseInt(sumRate*585));

				// 时间
				context.setFontSize(parseInt(sumRate*36));
				context.setFillStyle('#F8B62D');
				context.fillText(textMap.t4, parseInt(sumRate*310),parseInt(sumRate*752));
				context.setFontSize(parseInt(sumRate*20));
				context.setFillStyle('#FFFFFF');
				// context.fillText(textMap.t5, parseInt(sumRate*320),parseInt(sumRate*787));
				context.fillText(textMap.t5, parseInt(sumRate*340),parseInt(sumRate*787));

				// 难度
				context.setFontSize(parseInt(sumRate*55));
				context.setFillStyle('#F8B62D');
				context.fillText(textMap.t6, parseInt(sumRate*190),parseInt(sumRate*950));
				context.setFontSize(parseInt(sumRate*20));
				context.setFillStyle('#FFFFFF');
				context.fillText(textMap.t7, parseInt(sumRate*210),parseInt(sumRate*980));

				context.draw();
			},
			fail: function(e){
				console.log(e);
			}
		})
	},

	create : function () {
		wx.showLoading({title:'正在生成'});
		wx.canvasToTempFilePath({
			canvasId: 'share-canvas',
			success: function(res) {
				wx.saveImageToPhotosAlbum({
					filePath: res.tempFilePath,
					success: function (res1) {
						wx.hideLoading();
						wx.showToast({
							title: '已存到相册',
							icon: 'success',
							duration: 3000
						});
					},
					fail: function (res1) {
						wx.showToast({
							title: '保存失败',
							icon: '11',
							duration: 3000
						});
					}
				})
			}
		})
	},
	longpress: function () {
  	let that = this;
		wx.showModal({
			title: '保存图片',
			success: function(res) {
				if (res.confirm) {
					that.create();
				} else if (res.cancel) {
				}
			}
		})

	},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

	onPullDownRefresh: function () {
		wx.stopPullDownRefresh();
	},

	onShareAppMessage: function (res) {
		return app.commonShareAppMessage(res);
	}
});