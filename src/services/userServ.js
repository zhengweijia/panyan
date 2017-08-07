/**
 * @author 龙喜<xiaolong.lxl@alibaba-inc.com>
 * @description employee service
 */

'use strict';

const User = require('./models/user');

module.exports = {
  add: async function(name) {
  	let ret= null;
  	let u = await User.create({
			nick: 'nick222',
			name: name,
			email: 'my@g.com',
			openid: 'openid'
		});
  	if(!!u && !!u.dataValues) {
  		ret = u.dataValues;
		}
    return ret;
  },
  /**
   * 如何获取一个 plain object http://docs.sequelizejs.com/class/lib/model.js~Model.html#instance-method-get
   * @param workerId
   * @returns {*}
   */
  get: async function(uid) {
  	let ret = null;
  	if(!!uid) {
			let u = await User.findOne({
				where: {
					id: uid
				}
			});
			ret = u.dataValues;
		}
    return ret;
  }
};
