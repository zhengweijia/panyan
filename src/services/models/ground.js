let Sequelize = require('sequelize');
let sequelize = require('../../db/connection');
let area = require('./area');


let ground = sequelize.define('ground', {
	id: {
		type: Sequelize.INTEGER(11),
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	area_id: {
		type: Sequelize.INTEGER(11),
		allowNull: false,
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
	comment: '攀岩场地',
	tableName: 'ground'
})

ground.belongsTo(area,{
	foreignKey: 'area_id',
});

module.exports = ground;