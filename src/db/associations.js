/**
 * @author 龙喜<xiaolong.lxl@alibaba-inc.com>
 * @description 表关联关系
 * @refer http://docs.sequelizejs.com/manual/tutorial/associations.html
 */

'use strict';

let area = require('../services/models/area');
let ground = require('../services/models/ground');
let line = require('../services/models/line');
let line_difficulty = require('../services/models/line_difficulty');

let log = require('../services/models/log');

let result = require('../services/models/result');
let user = require('../services/models/user');
let code = require('../services/models/code'); //邀请码




// 攀岩场地关系
// ground.belongsTo(area, {
//   as: 'area_ground',
//   foreignKey: 'area_id',
// });

// ground.hasMany(line);
line.belongsTo(ground,{
	// foreignKey: 'ground_id',
});

// line.hasOne(line_difficulty, {
// 	foreignKey: 'line_difficulty_id',
// });

// 用户日志
// log.belongsTo(user, {
// 	as: 'user_log',
// 	foreignKey: 'user_id',
// });


// 邀请码
// user.hasOne(code, {
// 	as: 'code',
// 	foreignKey: 'code_id',
// });


// user.hasMany(result, {
// 	as: 'ground_line',
// 	foreignKey: 'user_id',
// });

