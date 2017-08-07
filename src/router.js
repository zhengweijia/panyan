/**
 * @author 龙喜<xiaolong.lxl@alibaba-inc.com>
 * @description router
 */

'use strict';
let index = require('./controller/index');
let userCtr = require('./controller/user');

let gameLineServ = require('./services/gameLineServ');

const router = new (require('koa-router'))({
  throw: true
});

// router.get('/', async function(ctx, next) {
//   await ctx.render('index', {page: 'index'});
// });

router.get('/',index.index2);

/**
 * 检查用户有没有登录，如果有则返回数据
 */
router.post('/v1/check', async (ctx, next) => {
  let a = await userCtr.getUser(ctx.params.id);
  ctx.response.body = a;
});
router.get('/get/:id', async (ctx, next) => {
	let a = await gameLineServ.getAllData();
	ctx.response.body = a;
});
router.post('/api/post', async (ctx, next) => {
	// let a = await userCtr.addUser(ctx.request.body.name);
	// ctx.response.body = a;
    ctx.response.body = {back: ctx.request.body.name};
});

module.exports = router;
