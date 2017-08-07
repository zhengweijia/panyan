'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../../db/connection');

const user = sequelize.define('user', {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
			autoIncrement: true
    },
    openid: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    unionid: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    role: {
      type: Sequelize.STRING(10),
      allowNull: true
    },
    type: {
      type: Sequelize.STRING(6),
      allowNull: true,
      defaultValue: '0'
    },
    code_id: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    active: {
      type: Sequelize.STRING(6),
      allowNull: true
    },
    nick: {
      type: Sequelize.STRING(50),
      allowNull: true
    },
    name: {
      type: Sequelize.STRING(50),
      allowNull: true
    },
    email: {
      type: Sequelize.STRING(50),
      allowNull: true
    },
    id_card: {
      type: Sequelize.STRING(30),
      allowNull: true
    },
    height: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    weight: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    gender: {
      type: Sequelize.STRING(2),
      allowNull: true,
      defaultValue: ''
    },
    clothes_size: {
      type: Sequelize.STRING(10),
      allowNull: true
    },
    climbing_ability: {
      type: Sequelize.STRING(30),
      allowNull: true
    },
    climbing_time: {
      type: Sequelize.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    money: {
      type: "DOUBLE",
      allowNull: true,
      defaultValue: '0'
    },
    point: {
      type: Sequelize.INTEGER(10).UNSIGNED,
      allowNull: true,
      defaultValue: '0'
    },
    comment: {
      type: Sequelize.STRING(256),
      allowNull: true
    }
  }, {
		timestamps: false,
		comment: '用户，裁判等',
    tableName: 'user'
  });

module.exports = user;