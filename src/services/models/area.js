const Sequelize = require('sequelize');
const sequelize = require('../../db/connection');
let area = sequelize.define('area', {
	id: {
		type: Sequelize.INTEGER(11),
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	name: {
		type: Sequelize.STRING(200),
		allowNull: true
	},
	comment: {
		type: Sequelize.STRING(256),
		allowNull: true
	}
}, {
	timestamps: false,
	comment: '攀岩赛场区域',
	tableName: 'area'
});

module.exports = area;