/**
 * @fileOverview 微信小程序的入口文件
 */

let qcloud = require('./vendor/qcloud-weapp-client-sdk/index');
let config = require('./config');

App({
	/**
	 * 小程序初始化时执行，我们初始化客户端的登录地址，以支持所有的会话操作
	 */
	onLaunch(options) {
		qcloud.setLoginUrl(config.service.loginUrl);
	},
	globalData: {
		userInfo: null,
		isRegister: false, //有没有注册
	},

	// 检查用户有没有注册，如果没有，跳转到注册页面
	checkRegisterAndRedirectTo: function (call) {
		qcloud.request({
			// 检查有没有注册
			url: config.service.URL+'user/checkRegister',
			// 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
			login: true,
			success: (result) => {
				if(!!result.data.data && !!result.data.data.userInfo) {
					this.globalData.userInfo = result.data.data.userInfo;
					this.globalData.userInfo.avatar_url = this.globalData.userInfo.avatarUrl;
					this.globalData.userInfo.nick = this.globalData.userInfo.nickName;
					this.globalData.userInfo.openid = this.globalData.userInfo.openId;
				}

				if(!!result && !!result.data && result.data.code == '0') {
					if(!!call) call(this.globalData.userInfo);
				} else {
					//未完善信息了，则跳转到完善信息页面
					wx.redirectTo({
						url: '/pages/register/one/register'
						// url: '/pages/register/two/register'
					});
				}
			},
			fail(error) {
			}
		});
	},

	// 获得线路信息
	getAllLineInfo: function (call) {
		qcloud.request({
			// 获取所有线路数据
			url: config.service.URL+'line/allInfo',
			success: (result) => {
				let ret = {
					areaMap: {},
					groundMap: {},
					lineMap: {},
				};
				if(!!result.data && result.data.code == '0') {
					let data = result.data.data;

					let areaList = data.areaList;
					let groundList = data.groundList;
					let lineList = data.lineList;

					// 给每个难度确定区间
					for (let d of data.lineDifficultyList) {
						for (let zoom of config.difficultyZoom) {
							if(d.difficulty>=zoom.min && d.difficulty<zoom.max) {
								d.zoomIndex = zoom.index;
								break;
							}
						}
					}
					this.globalData.lineDifficultyList = data.lineDifficultyList;

					for (let area of areaList) {
						ret.areaMap[area.id] = area;
					}
					// 完善 ground 场地数据
					for (let ground of groundList) {
						for (let area of areaList) {
							if(ground.area_id === area.id) {
								ground.area = area;
								break;
							}
						}
						ret.groundMap[ground.id] = ground;
					}
					//填充line数据
					for (let line of lineList) {
						for (let ground of groundList) {
							if (line.ground_id === ground.id) {
								line.ground = ground;
								break;
							}
						}
						for (let lineDifficulty of data.lineDifficultyList) {
							if (line.line_difficulty_id === lineDifficulty.id) {
								line.lineDifficulty = lineDifficulty;
								break;
							}
						}
						if(!line.finish_num || line.finish_num === 0) {
							line.preMoney = line.bonus;
						} else {
							line.preMoney = parseFloat((line.bonus / line.finish_num).toFixed(2));
						}
						ret.lineMap[line.id] = line;
					}

					this.globalData.allLineInfo = ret;
				}
				if(!!call) call(ret);
			},
			fail(error) {
			}
		});

	},

	getAllInfoAboutMe: function (back) {
		// 检查没有注册，则跳转到注册页面
		this.checkRegisterAndRedirectTo((user)=>{
			qcloud.request({
				url: config.service.URL+'user/get/'+user.id,
				method: 'GET',
				success: (result) => {
					let ret = {
						userInfo: null,
						resultList: null,
						lineAllInfo: null,
						finishLineNum: null,
						hadMoney: null,
					};
					if(result.data.code == '0') {
						let data = result.data.data;
						ret.userInfo = data.userInfo;
						ret.resultList = data.resultList;
					}

					// 拿到所有线路信息
					this.getAllLineInfo(info=>{
						ret.lineAllInfo = info;

						// 完整已经用户已经完成的线路信息
						for(let res of ret.resultList) {
							if(!!res.line_id && !!ret.lineAllInfo.lineMap && !!ret.lineAllInfo.lineMap[res.line_id]) {
								res.line = ret.lineAllInfo.lineMap[res.line_id];
							}

							if(res.status == '1') {
								ret.finishLineNum += 1;
								if(!!res.line) {
									ret.hadMoney += res.line.preMoney;
								}
							}
						}

						if(!!back) back(ret);
					});
				},
				fail(error) {
				}
			});
		})
	},

	dateFormat : function (d, fmt) {
		console.log(d);
		let date = new Date(d);
		let o = {
			"M+": date.getMonth() + 1, //月份
			"d+": date.getDate(), //日
			"h+": date.getHours(), //小时
			"m+": date.getMinutes(), //分
			"s+": date.getSeconds(), //秒
			"q+": Math.floor((date.getMonth() + 3) / 3), //季度
			"S": date.getMilliseconds() //毫秒
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (let k in o)
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}

});