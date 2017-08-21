// all.js
const app = getApp();
let config = require('../../../../config');

Page({

  /**
   * 页面的初始数据
   */
  data: {
		useLineDifficultyStandard: config.useLineDifficultyStandard, //难度使用什么标准

		searchData: {
			notHas: '', // has 需要剔除已完成的
			difficult: '', // up 升序 down 降序
			bonus: '', // up 升序 down 降序

			//
			activeMore: false, //是否启用更多筛选
			min: 0, //最小难度
			max: 1000, //最大难度

			area: '', // 区域id
			groundList: [], // 被选中的groundid

			searchLineList: [], //最终筛选出来的线路列表
		},

		viewData: {
			minIndex: 0,
			minList: [],

			maxIndex: 0,
			maxList: [],

			waitGroundList:[],//选中区域后，筛出来的ground
		},

		lineDifficultyList: [], //所有难度列表

		lineMap: {},
		lineList: [],

		groundMap: {},
		groundList: [],

		areaMap: {},
		areaList: [],

	},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		let that = this;

		app.getAllInfoAboutMe((data)=>{

			// 全部线路信息
			if(!!data.lineAllInfo){
				// 所有难度信息
				that.data.lineDifficultyList = data.lineAllInfo.lineDifficultyList;

				that.data.lineMap = data.lineAllInfo.lineMap;
				for(let id in data.lineAllInfo.lineMap) {
					that.data.lineList.push(data.lineAllInfo.lineMap[id]);
				}
				that.data.searchData.searchLineList = that.data.lineList;

				that.data.groundMap = data.lineAllInfo.groundMap;
				for(let id in data.lineAllInfo.groundMap) {
					that.data.groundList.push(data.lineAllInfo.groundMap[id]);
				}

				that.data.areaMap = data.lineAllInfo.areaMap;
				for(let id in data.lineAllInfo.areaMap) {
					that.data.areaList.push(data.lineAllInfo.areaMap[id]);
				}

				that.data.viewData.minList= that.data.viewData.maxList = that.data.lineDifficultyList;
				that.data.viewData.maxIndex = that.data.viewData.maxList.length-1;

				// 如果用户没有完成当前路线，可能获得的钱数需要重新计算（人数+1）
				for(let line of that.data.lineList) {
					if(!line.isFinish) {
						let num = 1;
						if(!!line.finish_num) num= num+line.finish_num;
						line.preMoney = parseFloat((line.bonus / num).toFixed(2));
					}
				}

			}

			that.setData({
				viewData: that.data.viewData,
				searchData: that.data.searchData,
				groundList: that.data.groundList,
				areaList: that.data.areaList,
			});
		});

  },

	// 选择难度区间
	bindPickerChange: function (e) {
		let index = parseInt(e.detail.value);
		let id = e.currentTarget.id;

		// 设置选择的难度
		if(id === 'min') {
			this.data.viewData.minIndex = index;
			this.data.searchData.min = this.data.viewData.minList[index].difficulty;

		} else if(id === 'max') {
			this.data.viewData.maxIndex = index;
			this.data.searchData.max = this.data.viewData.maxList[index].difficulty;
		}

  	this.selectData();
	},

	search: function (e) {
		let id = e.currentTarget.id;
		if(id === 'bonus') {
			let t = 'down'; // 默认奖金从大到小
			if(this.data.searchData.bonus === 'down') {
				t = 'up';// 点第二次，则为从小到大
			}
			this.data.searchData.bonus = t;
			this.data.searchData.difficult = ''; //互斥
		} else if(id === 'difficult') {
			let t = 'up'; // 默认难度从小到大
			if(this.data.searchData.difficult === 'up') {
				t = 'down';// 点第二次，则为从大到小
			}
			this.data.searchData.difficult = t;
			this.data.searchData.bonus = ''; //互斥
		} else if(id === 'notHas') {
			this.data.searchData.notHas = (this.data.searchData.notHas !== '' ? '': 'has');
		}

		this.selectData();
	},
	showMore: function (e) {
		// activeMore: false, //是否启用更多筛选
		this.data.searchData.activeMore = !this.data.searchData.activeMore;
		this.selectData();

	},

	selectArea: function (e) {
  	let id = e.currentTarget.dataset.value;
  	if(this.data.searchData.area !== id) {
			this.data.searchData.area = id;

			// 筛出这个区域下的所有场地
			this.data.viewData.waitGroundList = [];
			for(let g of this.data.groundList) {
				if(g.area_id == id) {
					this.data.viewData.waitGroundList.push(g);
				}
			}

			this.data.searchData.groundList = [];// 每次换了区域，则重置选中的场地

			this.selectData();
		}
	},

	selectGround: function (e) {
		let id = e.currentTarget.dataset.value;
		for(let wait of this.data.viewData.waitGroundList){
			if(wait.id === id){
				if(!!wait.className && wait.className === 'on') {
					// 取消选中
					wait.className = '';
					// 删除对应的id
					for(let i =0;i< this.data.searchData.groundList.length;i++) {
						if(id === this.data.searchData.groundList[i]) {
							this.data.searchData.groundList.splice(i, 1);
						}
					}
				} else {
					// 选中
					wait.className = 'on';
					this.data.searchData.groundList.push(id);
				}
				break;
			}
		}

		this.selectData();
	},

	// 重置数据
	reset: function () {
		let searchData = this.data.searchData;
		searchData.notHas = '';
		searchData.bonus = '';
		searchData.difficult = '';
		searchData.min = 0;
		searchData.max = 1000;

		searchData.area = '';
		searchData.groundList = [];

		let viewData = this.data.viewData;
		viewData.minIndex = 0;
		viewData.maxIndex = viewData.maxList.length-1;
		viewData.waitGroundList = [];

		this.selectData();
	},

	// 筛选数据
	selectData: function () {
		let searchData = this.data.searchData;
		searchData.searchLineList = this.data.lineList;
		// 查询没有完成过的
		if(!!searchData.notHas && searchData.notHas==='has') {
			let tmp = [];
			for(let line of searchData.searchLineList) {
				if(!line.isFinish) {
					tmp.push(line);
				}
			}
			searchData.searchLineList = tmp;
		}

		// ground 所属
		if(!!searchData.groundList && searchData.groundList.length > 0) {
			let tmp = [];
			for(let line of searchData.searchLineList) {
				for(let groundid of searchData.groundList) {
					if(line.ground.id === groundid) {
						tmp.push(line);
						break;
					}
				}
			}
			searchData.searchLineList = tmp;
		}

		// 排序
		if(!!searchData.difficult && searchData.difficult !== '') {
			searchData.searchLineList.sort((a, b) =>{
				if(searchData.difficult === 'up') {
					return a.lineDifficulty.difficulty-b.lineDifficulty.difficulty;
				} else {
					return b.lineDifficulty.difficulty-a.lineDifficulty.difficulty;
				}
			});
		} else if(!!searchData.bonus && searchData.bonus !== '') {
			searchData.searchLineList.sort((a, b) =>{
				if(searchData.bonus === 'up') {
					return a.bonus-b.bonus;
				} else {
					return b.bonus-a.bonus;
				}
			});
		}

		//难度区间筛选
		if( searchData.min <= searchData.max) {
			let tmp = [];
			for(let line of searchData.searchLineList) {
				let d = line.lineDifficulty.difficulty;
				if(d >= searchData.min && d <= searchData.max) {
					tmp.push(line);
				}
			}
			searchData.searchLineList = tmp;
		}

  	this.setData({
			viewData: this.data.viewData,
			searchData: this.data.searchData,
		});
	}

	,onShareAppMessage: function (res) {
	return app.commonShareAppMessage(res);
}
});