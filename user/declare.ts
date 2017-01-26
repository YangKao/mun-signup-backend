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
    dialectOptions: {
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
        supportBigNumbers: true,
        bigNumberStrings: true
    },
    logging: false
});
export const UserModel = sequelize.define('user', {
    intendCom: { type: Sequelize.INTEGER(10) },
    eatingHabit: { type: Sequelize.STRING(512) },
    email: { type: Sequelize.STRING(128), validate: { isEmail: true }, unique: 'compositeIndex' },
    myTel: { type: Sequelize.STRING(128) },
    emerTel: { type: Sequelize.STRING(128) },
    name: { type: Sequelize.STRING },
    password: { type: Sequelize.STRING(128) },
    idNum: { type: Sequelize.STRING(128) },
    school: { type: Sequelize.STRING(128) }
});

export const init = async () => {
    await UserModel.sync();
    await sequelize.query(`alter table ${config.database.database}.users convert to character set utf8mb4 collate utf8mb4_bin`);
    return true;
}

init().then((status) => {
    if(status){
        console.log("Connect Well");
    } else {
        console.log("Connect Failed");
    }
});
