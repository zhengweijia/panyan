const userServ = require('../services/userServ');

module.exports = {



	getUser: async function(id) {
		let a = await userServ.get(id);
		let u = {};
		if(!!a && !!a.dataValues) {
			u = a.dataValues;
		}
		return u;
	},

	addUser: async function(name) {
		let a = await userServ.add(name);
		let u = {};
		if(!!a && !!a.dataValues) {
			u = a.dataValues;
		}
		return u;
	},

}