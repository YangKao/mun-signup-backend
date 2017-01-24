import * as Koa from "koa"
import * as Router from "koa-router"
import {config} from "./config"

const app = new Koa();
const router = new Router();

router.get('/',(ctx,next)=>{

})

app.listen(3000);
