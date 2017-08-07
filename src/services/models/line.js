const Sequelize = require('sequelize');
const sequelize = require('../../db/connection');
const ground = require('./ground');
const line_difficulty = require('./line_difficulty');

let line = sequelize.define('line', {
	id: {
		type: Sequelize.INTEGER(11),
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	ground_id: {
		type: Sequelize.INTEGER(11),
		allowNull: false,
	},
	name: {
		type: Sequelize.STRING(200),
		allowNull: false
	},
	bonus: {
		type: "DOUBLE",
		allowNull: false,
		defaultValue: '0'
	},
	line_difficulty_id: {
		type: Sequelize.INTEGER(11),
		allowNull: false
	},
	point: {
		type: Sequelize.INTEGER(11),
		allowNull: true,
		defaultValue: '0'
	},
	finish_num: {
		type: Sequelize.INTEGER(11),
		allowNull: true,
		defaultValue: '0'
	},
	comment: {
		type: Sequelize.STRING(256),
		allowNull: true
	}
}, {
	timestamps: false,
	comment: '攀岩具体一条线路',
	tableName: 'line'
});

// 定义表关系
line.belongsTo(ground,{
	foreignKey: 'ground_id',
});
line.belongsTo(line_difficulty,{
	foreignKey: 'line_difficulty_id',
});
module.exports = line;

