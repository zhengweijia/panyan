/**
 * @description 比赛场地 service
 * 区域 =》 场地 =》 线路
 */

'use strict';

let area = require('./models/area');
let ground = require('./models/ground');
let line = require('./models/line');
let line_difficulty = require('./models/line_difficulty');

module.exports = {

	// 获得比赛线路所有信息
	getAllData: async function() {
  	let ret = {};
  	// let u = await line.findAll({ include: [ ground, line_difficulty] });
  	let u = await line.findAll({ include: [{ all: true }]});
    return u;
  }
};
