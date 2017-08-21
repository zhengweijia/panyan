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

		if(!!this.globalData.comefrom && this.globalData.comefrom!='') {
			this.globalData.comefrom='';
		}
	},
	globalData: {
		userInfo: null,
		isRegister: false, //有没有注册
	},

	// 检查用户有没有注册，如果没有，跳转到注册页面
	// call 回调，
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
					// 检查当前路由
					if(this.checkUserTypeAndRedirectTo()) {
						if(!!call) call(this.globalData.userInfo);
					}
				} else {
					//未完善信息了，则跳转到完善信息页面
					wx.redirectTo({
						url: '/pages/user/register/one/register'
						// url: '/pages/user/register/two/register'
					});
				}
			},
			fail(error) {
			}
		});
	},

	// 检查用户类型，如果当前访问的是选手页面，但是他的身份是裁判，则跳到裁判页面
	checkUserTypeAndRedirectTo: function () {
		let that = this;
		if(that.globalData.userInfo && !!that.globalData.userInfo.role) {
			let url='';
			let currentPages = getCurrentPages()[getCurrentPages().length-1].route;
			// 0 管理员，1裁判，2参赛选手，3普通用户
			if(that.globalData.userInfo.role === '2' && currentPages && currentPages.indexOf('judgment') >=0 ) {
				url = '/pages/user/home/home'; //选手主页
			} else if(that.globalData.userInfo.role === '1' && currentPages && currentPages.indexOf('user') >=0 ) {
				url = '/pages/judgment/home/home'; //裁判主页
			}
			if(url !== '') {
				wx.redirectTo({
					url: url
				});
				return false;
			} else {
				return true;
			}

		} else {
			return true;
		}

	},
	// 仅仅检查有没有注册
	checkRegister: function (call) {
		qcloud.request({
			// 检查有没有注册
			url: config.service.URL+'user/checkRegister',
			// 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
			login: true,
			success: (result) => {
				let ret = {
					isRegister: false,
					userInfo: {}
				};
				if(!!result.data.data && !!result.data.data.userInfo) {
					this.globalData.userInfo = result.data.data.userInfo;
					this.globalData.userInfo.avatar_url = this.globalData.userInfo.avatarUrl;
					this.globalData.userInfo.nick = this.globalData.userInfo.nickName;
					this.globalData.userInfo.openid = this.globalData.userInfo.openId;
					ret.userInfo = this.globalData.userInfo;
				}

				if(!!result && !!result.data && result.data.code == '0') {
					// 已经注册了
					ret.isRegister = true;
				} else {
					//未完善信息了，则跳转到完善信息页面
					ret.isRegister = false;
				}
				if(!!call) call(ret);
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
					lineDifficultyList: [],
				};
				if(!!result.data && result.data.code == '0') {
					let data = result.data.data;

					let areaList = data.areaList;
					let groundList = data.groundList;
					let lineList = data.lineList;

					// 给每个难度确定区间
					for (let d of data.lineDifficultyList) {
						for (let zoom of config.difficultyZoom) {
							if(d.difficulty>=zoom.min && d.difficulty<=zoom.max) {
								d.zoomIndex = zoom.index;
								break;
							}
						}
					}
					ret.lineDifficultyList = data.lineDifficultyList;

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
						finishLineNum: 0,
						hadMoney: 0,
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
								// 在所有线路列表里，标记下当前用户已经完成该线路了
								ret.lineAllInfo.lineMap[res.line_id].isFinish = true;
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

	commonShareAppMessage: function (res) {
		let that = this;
		if (res.from === 'button') {
			// 来自页面内转发按钮
			// console.log(res.target);
		}
		let nick = '岩点赛事';
		if(!!that.globalData.userInfo && !!that.globalData.userInfo.nick) {
			nick = '你的好友「'+that.globalData.userInfo.nick+'」';
		}
		let title = nick+'邀请你参加2017格凸国际攀岩节';
		return {
			title: title,
			path: '/pages/welcome/welcome',
			imageUrl:config.staticUrl+'/img/share.jpg',
			success: function(res) {
				// 转发成功
			},
			fail: function(res) {
				// 转发失败
			}
		}
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
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	},

	diffDate : function (start, end) {
		let date1=new Date(start);    //开始时间
		let date2=new Date(end);    //结束时间
		let date3=date2.getTime()-date1.getTime(); //时间差秒

		let ret = '';
//计算出相差天数
		let days=Math.floor(date3/(24*3600*1000));
		if(days>0) ret = ret+ days+'天';
//计算出小时数
		let leave1=date3%(24*3600*1000);  //计算天数后剩余的毫秒数
		let hours=Math.floor(leave1/(3600*1000));
		if(hours>0 || ret!=='') ret = ret+ hours+'小时';


//计算相差分钟数
		let leave2=leave1%(3600*1000);        //计算小时数后剩余的毫秒数
		let minutes=Math.floor(leave2/(60*1000));
		if(minutes>0 || ret!=='') ret = ret+ minutes+'分';

//计算相差秒数
		let leave3=leave2%(60*1000);     //计算分钟数后剩余的毫秒数
		let seconds=Math.round(leave3/1000);
		if(seconds>0 || ret!=='') ret = ret+ seconds+'秒';

		return ret;
	}

});