import { app } from "../server"
import * as database from "../user/database"
import * as should from "should"
import * as fetch from "isomorphic-fetch"
import * as mysql from "mysql";
import { config } from "../config"


const connection = mysql.createConnection({
    host: config.database.address,
    user: config.database.username,
    password: config.database.password,
    port: config.database.port,
    database: config.database.database
});

app.listen(3000);

describe("#server", () => {
    let token:string = "";
    it("#add two user", async () => {
        await database.init();
        const raw1 = await fetch("http://localhost:3000/user", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "PUT",
            body: JSON.stringify({
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
        });
        const user1 = await raw1.json();

        const raw2 = await fetch("http://localhost:3000/user", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "PUT",
            body: JSON.stringify({
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
        });
        const user2 = await raw2.json();

        should(user1.id).equal(1);
        should(user2.id).equal(2);
    })

    it("#auth wrong password", async () => {
        const raw = await fetch("http://localhost:3000/auth", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method:"POST",
            body: JSON.stringify({
                id:1,
                password:"wrongpassword"
            })
        })
        const req = await raw.json();
        should(req.err).equal("Wrong Password");
    })

    it("#auth true user (id:1 password:\"testpassword\")", async () => {
        const raw = await fetch("http://localhost:3000/auth", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method:"POST",
            body: JSON.stringify({
                id:1,
                password:"testpassword"
            })
        })
        const req = await raw.json();
        should(req).not.have.keys('err');
        token = req.token;
    })

    it("#modify an user (id:1) email to test3@test.com Without Auth", async () => {
        const raw = await fetch("http://localhost:3000/user/1", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                email: "test3@test.com"
            })
        });
        const user = await raw.json();
        should(user).have.keys("err");
    })

    it("#modify an user (id:1) email to test3@test.com", async () => {
        const raw = await fetch("http://localhost:3000/user/1", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            method: "POST",
            body: JSON.stringify({
                email: "test3@test.com"
            })
        });
        const user = await raw.json();
        should(user.email).equal("test3@test.com");
    })

    it("#get user (id=1) Without Auth", async () => {
        const raw = await fetch("http://localhost:3000/user/1", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "GET"
        });
        const user = await raw.json();
        should(user).has.keys("err");
    })

    it("#get user (id=1)", async () => {
        const raw = await fetch("http://localhost:3000/user/1", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            method: "GET"
        });
        const user = await raw.json();
        should(user.email).equal("test3@test.com");
    })

    it("#get all users Without Auth", async () => {
        const raw = await fetch("http://localhost:3000/user/all", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "GET"
        });
        const users = await raw.json();
        should(users).has.keys("err");
    })

    it("#get all users", async () => {
        const raw = await fetch("http://localhost:3000/user/all", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': config.adminPassword
            },
            method: "GET"
        });
        const users = await raw.json();
        should(users[0].id).equal(1);
        should(users[1].id).equal(2);
    })

    it("#delete a user by Id (2) Without Auth", async () => {
        const raw = await fetch("http://localhost:3000/user/2", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "DELETE"
        });
        const user = await raw.json();
        should(user).has.keys("err");
    })

    it("#delete a user by Id (2)", async () => {
        const raw = await fetch("http://localhost:3000/user/2", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': config.adminPassword
            },
            method: "DELETE"
        });
        const user = await raw.json();
        should(user.id).equal(2);
    })

    it("#destroy the table", (done) => {
        connection.query('DROP TABLE users', function(error, results, fields) {
            if (error) {
                throw error;
            }
            done();
        });
        connection.end();
    })
})
