/**
 * @author 龙喜<xiaolong.lxl@alibaba-inc.com>
 * @description db
 */

'use strict';

const Sequelize = require('sequelize');

module.exports = new Sequelize('yandian', 'root', '123', {
  host: '127.0.0.1',
  port: 3306,
  dialect: 'mysql',
  pool: {
    max: 20,
    min: 5,
    idle: 10000
  },
	dialectOptions: {
		charset: 'utf8',
		collate: 'utf8_general_ci',
	},
  // timezone: '+0800'
});

// 绑定实体关系
// require('./associations');