import * as Koa from "koa"
import * as Router from "koa-router"
import * as database from "./user/database"
import * as bodyParser from "koa-bodyparser"
import * as auth from "./auth/auth"
import { config } from "./config"

export const app = new Koa();
const router = new Router();

router.put('/user', async (ctx, next) => {
    ctx.body = await database.addUser(ctx.request.body);
    await next;
})

router.post('/user/:id', async (ctx, next) => {
    const id = ctx.params["id"];
    const token = ctx.request.headers["authorization"];
    if (await auth.verifyToken(id, token)) {
        ctx.body = await database.modUser(id, ctx.request.body);
    } else {
        ctx.body = {
            err: "Token Expired" //TODO: Handle More Error
        }
    }

    await next;
})

router.get('/user/all', async (ctx, next) => {
    const token = ctx.request.headers["authorization"];
    if(token === config.adminPassword) {
        ctx.body = await database.getUserList();
    } else {
        ctx.body = {
            err: "Wrong Admin Password"
        }
    }

    await next;
})

router.get('/user/:id', async (ctx, next) => {
    const id = ctx.params["id"];
    const token = ctx.request.headers["authorization"];
    if (await auth.verifyToken(id, token)) {
        ctx.body = await database.findUserById(ctx.params["id"]);
    } else {
        ctx.body = {
            err: "Token Expired" //TODO: Handle More Error
        }
    }

    await next;
})

router.delete('/user/:id', async (ctx, next) => {
    const token = ctx.request.headers["authorization"];
    if(token === config.adminPassword) {
        ctx.body = await database.deleteUserById(ctx.params["id"]);
    } else {
        ctx.body = {
            err: "Wrong Admin Password"
        }
    }
    await next;
})

//TODO: Handle Wrong Password
router.post('/auth', async (ctx, next) => {
    const req: { email: string, password: string } = ctx.request.body;
    const token = await auth.generateToken(req.email, req.password);
    if (token) {
        ctx.body = {
            token: token
        }
    } else {
        ctx.body = {
            err: "Wrong Password"
        }
    }
    await next;
})

app.use(bodyParser());
app.use(require("koa-cors")());
app.use(router.routes());
app.use(router.allowedMethods());
