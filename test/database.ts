import * as database from "../user/database"
import * as mysql from "mysql"
import { config } from "../config"
import "mocha"
import * as should from "should"

const connection = mysql.createConnection({
    host: config.database.address,
    user: config.database.username,
    password: config.database.password,
    port: config.database.port,
    database: config.database.database
})

describe("Database", () => {
    it('#add two user', async () => {
        await database.init()
        const user1 = await database.addUser({
            intendCom: 1,
            eatingHabit: "testeatinghabit",
            email: "test1@test.com",
            myTel: "777",
            emerTel: "111",
            name: "testname",
            password: "testpassword",
            idNum: "testIdNum",
            school: "testSchool"
        })
        const user2 = await database.addUser({
            intendCom: 1,
            eatingHabit: "testeatinghabit",
            email: "test2@test.com",
            myTel: "777",
            emerTel: "111",
            name: "testname",
            password: "testpassword",
            idNum: "testIdNum",
            school: "testSchool"
        })
        should(user1.id).equal(1)
        should(user2.id).equal(2)
    })

    it("#modify an user (id:1) email to test3@test.com", async () => {
        const user = await database.modUser(1, {
            email: "test3@test.com"
        })
        should(user.email).equal("test3@test.com")
    })

    it("#auth for user (email=\"test2@test.com\" password=\"testpassword\")", async () => {
        should(await database.auth("test2@test.com","testpassword")).equal(true)
        should(await database.auth("test2@test.com","wrongpassword")).equal(false)
    })

    it("#get all users", async () => {
        const users = await database.getUserList()
        should(users.length).equal(2)
        should(users[0].id).equal(1)
    })

    it("#get user (id=1)", async () => {
        const user = await database.findUserById(1)
        should(user.email).equal("test3@test.com")
    })

    it("#get user (email=\"test3@test.com\")", async () => {
        const user = await database.findUserByEmail("test3@test.com")
        should(user.id).equal(1)
    })

    it("#delete an user by Id (2)", async () => {
        const user2 = await database.deleteUserById(2)
        should(user2.id).equal(2)
    })

    it("#destroy the table", (done) => {
        connection.query('DROP TABLE users', function(error, results, fields) {
            if (error) {
                throw error
            }
            done()
        })
        connection.end()
    })
})
