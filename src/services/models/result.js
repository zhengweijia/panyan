const Sequelize = require('sequelize');
const sequelize = require('../../db/connection');

let result = sequelize.define('result', {
	id: {
		type: Sequelize.INTEGER(11),
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	user_id: {
		type: Sequelize.INTEGER(11),
		allowNull: false
	},
	judge_id: {
		type: Sequelize.INTEGER(11),
		allowNull: false
	},
	area_id: {
		type: Sequelize.INTEGER(11),
		allowNull: false
	},
	ground_id: {
		type: Sequelize.INTEGER(11),
		allowNull: false
	},
	line_id: {
		type: Sequelize.INTEGER(11),
		allowNull: false
	},
	time: {
		type: Sequelize.INTEGER(10).UNSIGNED.ZEROFILL,
		allowNull: true
	},
	start_time: {
		type: Sequelize.DATE,
		allowNull: true
	},
	end_time: {
		type: Sequelize.DATE,
		allowNull: true
	},
	status: {
		type: Sequelize.STRING(4),
		allowNull: true
	},
	create_date: {
		type: Sequelize.DATE,
		allowNull: true,
		defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
	}
}, {
	timestamps: false,
	comment: '一次攀岩结果',
	tableName: 'result'
});

module.exports = result;