import * as Koa from "koa"
import * as Router from "koa-router"
import * as database from "./user/database"
import * as bodyParser from "koa-bodyparser"
import * as auth from "./auth/auth"
import { logger } from "./logger"
import { config } from "./config"

export const app = new Koa()
const router = new Router()

router.put('/api/user', async (ctx, next) => {
    try {
        ctx.body = await database.addUser(ctx.request.body)
        logger.info(`User (id=${ctx.body.id}) Sign Up`)
    } catch (err) {
        logger.error(JSON.stringify({
            type: "Database Error",
            content: err
        }))
        ctx.body = {
            err: ["email"]
        }
    }
    await next
})

router.post('/api/user/:id', async (ctx, next) => {
    const id = ctx.params["id"]
    const token = ctx.request.headers["authorization"]
    if (await auth.verifyToken(id, token)) {
        ctx.body = await database.modUser(id, ctx.request.body)
        logger.info(`User (id=${ctx.body.id}) Modified`)
    } else {
        ctx.body = {
            err: "Token Expired" //TODO: Handle More Error
        }
    }

    await next
})

router.get('/api/user/all', async (ctx, next) => {
    const token = ctx.request.headers["authorization"]
    if (token === config.adminPassword) {
        ctx.body = await database.getUserList()
    } else {
        ctx.body = {
            err: "Wrong Admin Password"
        }
    }

    await next
})

router.get('/api/user/:id', async (ctx, next) => {
    const id = ctx.params["id"]
    const token = ctx.request.headers["authorization"]
    if (await auth.verifyToken(id, token)) {
        ctx.body = await database.findUserById(ctx.params["id"])
    } else {
        ctx.body = {
            err: "Token Expired" //TODO: Handle More Error
        }
    }

    await next
})

router.delete('/api/user/:id', async (ctx, next) => {
    const token = ctx.request.headers["authorization"]
    if (token === config.adminPassword) {
        ctx.body = await database.deleteUserById(ctx.params["id"])
        logger.info(`Delete User (id=${ctx.body.id})`)
    } else {
        ctx.body = {
            err: "Wrong Admin Password"
        }
    }
    await next
})

//TODO: Handle Wrong Password
router.post('/api/auth', async (ctx, next) => {
    const req: { email: string, password: string } = ctx.request.body

    const token = await auth.generateToken(req.email, req.password)
    if (token) {
        const user = await database.findUserByEmail(req.email)
        ctx.body = {
            token: token,
            id: user.id
        }
        logger.info(`User (email=${ctx.request.body.email}) Log In Successful`)
    } else {
        ctx.body = {
            err: "Wrong Password Or Email"
        }
        logger.info(`User (email=${ctx.request.body.email}) Log In Failed`)
    }
    await next
})

app.use(bodyParser())
app.use(require('koa-convert')(require("koa-cors")()))
app.use(router.routes())
app.use(router.allowedMethods())
