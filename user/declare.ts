import * as Sequelize from "sequelize"
import { config } from "../config"

/*
  TODO: Mod this file to adapt to more flexible types.

  Maybe we have to parse TypeScript to do it well.
  Or there are some tricks.
*/

/*
  Declare for TypeScript
*/
export interface User {
    intendCom: 1 | 2 | 3 | 4 | 5,
    eatingHabit: string,
    email: string,
    myTel: string,
    emerTel: string,
    name: string,
    password: string,
    idNum: string,
    school: string
}

/*
  Declare for Response of Database
  With an Id
*/
export interface UserWithId extends User {
    id: number
}

/*
  Declare for Transform an Ins into an Object
*/
export const transformUserIns = (ins): UserWithId => {
    return {
        id: ins.get("id"),
        intendCom: ins.get("intendCom"),
        eatingHabit: ins.get("eatingHabit"),
        email: ins.get("email"),
        myTel: ins.get("myTel"),
        emerTel: ins.get("emerTel"),
        name: ins.get("name"),
        password: ins.get("password"),
        idNum: ins.get("idNum"),
        school: ins.get("school")
    }
}

/*
  Declare for Sequelize
  TODO: Smaller Type
  TODO: Validation
*/
const sequelize = new Sequelize(config.database.database, config.database.username, config.database.password, {
    host: config.database.address,
    port: config.database.port,
    logging: false
});
export const UserModel = sequelize.define('user', {
    intendCom: { type: Sequelize.INTEGER(10) },
    eatingHabit: { type: Sequelize.STRING(512) },
    email: { type: Sequelize.STRING(128), validate: { isEmail: true }, unique: 'compositeIndex' },
    myTel: { type: Sequelize.STRING(128) },
    emerTel: { type: Sequelize.STRING(128) },
    name: { type: Sequelize.STRING(128) },
    password: { type: Sequelize.STRING(128) },
    idNum: { type: Sequelize.STRING(128) },
    school: { type: Sequelize.STRING(128) }
});

UserModel.sync();
