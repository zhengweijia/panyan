const Sequelize = require('sequelize');
const sequelize = require('../../db/connection');

let code = sequelize.define('code', {
	id: {
		type: Sequelize.INTEGER(11),
		allowNull: false,
		primaryKey: true
	},
	code: {
		type: Sequelize.STRING(100),
		allowNull: false
	},
	status: {
		type: Sequelize.STRING(4),
		allowNull: true
	},
	type: {
		type: Sequelize.STRING(4),
		allowNull: true,
		defaultValue: '1'
	}
}, {
	timestamps: false,
	comment: '邀请码',
	tableName: 'code'
});

module.exports =code;