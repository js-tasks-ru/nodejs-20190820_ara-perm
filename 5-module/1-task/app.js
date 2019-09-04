const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

router.get('/subscribe', async (ctx, next) => {
    next();
});

router.post('/publish', async (ctx, next) => {
    console.log(ctx.request.body);
    next();
});

app.use(router.routes());

module.exports = app;
