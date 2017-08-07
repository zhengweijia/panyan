const Sequelize = require('sequelize');
const sequelize = require('../../db/connection');

let log = sequelize.define('log', {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    type: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    value: {
      type: Sequelize.STRING(50),
      allowNull: true
    },
    comment: {
      type: Sequelize.STRING(500),
      allowNull: true
    },
    date: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
		timestamps: false,
		comment: '日志',
    tableName: 'log'
  });
module.exports = log;