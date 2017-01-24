import * as database from "../user/database";
import * as mysql from "mysql";
import {config} from "../config"
import "mocha";
import * as should from "should"

const connection = mysql.createConnection({
  host     : config.database.address,
  user     : config.database.username,
  password : config.database.password,
  port     : config.database.port,
  database : config.database.database
});

describe("Database", ()=>{
  it('#add two user', async () => {
    const user1 = await database.addUser({
      intendCom:1,
      eatingHabit:"testeatinghabit",
      email:"test1@test.com",
      myTel:"777",
      emerTel:"111",
      name:"testname",
      password:"testpassword",
      idNum:"testIdNum",
      school:"testSchool"
    });
    const user2 = await database.addUser({
      intendCom:1,
      eatingHabit:"testeatinghabit",
      email:"test2@test.com",
      myTel:"777",
      emerTel:"111",
      name:"testname",
      password:"testpassword",
      idNum:"testIdNum",
      school:"testSchool"
    });
    should(user1.id).equal(1);
    should(user2.id).equal(2);
  });

  it("#modify an user (id:1) email to test3@test.com", async () => {
    const user = await database.modUser(1,{
      email:"test3@test.com"
    })
    should(user.email).equal("test3@test.com");
  })

  it("#delete an user by Id (2)", async () => {
    const user2 = await database.deleteUserById(2);
    should(user2.id).equal(2);
  })

  it("#delete an user by email (test3@test.com)", async () => {
    const user2 = await database.deleteUserByEmail("test3@test.com");
    should(user2.id).equal(1);
  })

  it("#destroy the table", (done) => {
    connection.query('DROP TABLE users', function (error, results, fields) {
      if(error){
        throw error;
      }
      done();
    });
    connection.end();
  })
})
