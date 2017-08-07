module.exports = {
    index: function*(){
        yield this.render('index',{"title":"koa demo"});
    },

    detail: function*() {
        this.body = this.params.id;
    },

    index2: async function(ctx, next) {
        await ctx.render('index', {page: 'index'});
    }
}