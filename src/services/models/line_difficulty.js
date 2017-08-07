const Sequelize = require('sequelize');
const sequelize = require('../../db/connection');

let line_difficulty = sequelize.define('line_difficulty', {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING(50),
      allowNull: true
    },
    difficulty: {
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
		comment: '线路难度',
    tableName: 'line_difficulty'
  });
module.exports =  line_difficulty;