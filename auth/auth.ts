import * as database from "../user/database"
import * as jwt from "jsonwebtoken"
import { config } from "../config"

export const generateToken = async (email:string, password:string) => {
    if (await database.auth(email, password)) {
        const user = await database.findUserByEmail(email);
        return jwt.sign({
            exp: Math.floor(Date.now() / 1000) + config.expire,
            id: user.id
        }, config.secret);
    } else {
        return null;
    }
}

export const verifyToken = async (id:number, token:string) => {
    try {
        return jwt.verify(token, config.secret).id == id;
    } catch (err) {
        return false;
    }
}
