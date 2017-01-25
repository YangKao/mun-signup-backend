import * as Koa from "koa"
import * as Router from "koa-router"
import * as database from "./user/database"
import * as bodyParser from "koa-bodyparser"
import { config } from "./config"

export const app = new Koa();
const router = new Router();

//TODO: Auth
router.get('/userlist', async (ctx, next) => {
    ctx.body = await database.getUserList();
    await next;
})

router.put('/user', async (ctx, next) => {
    ctx.body = await database.addUser(ctx.request.body);
    await next;
})

//TODO: Auth
router.post('/user/:id', async (ctx, next) => {
    ctx.body = await database.modUser(ctx.params["id"], ctx.request.body);
    await next;
})

//TODO: Auth
router.get('/user/all', async (ctx, next) => {
    ctx.body = await database.getUserList();
    await next;
})

//TODO: Auth
router.get('/user/:id', async (ctx, next) => {
    ctx.body = await database.findUserById(ctx.params["id"]);
    await next;
})

//TODO: Auth
router.delete('/user/:id', async (ctx, next) => {
    ctx.body = await database.deleteUserById(ctx.params["id"]);
    await next;
})

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());
