const assert = require("chai").assert;
const chai = require("chai");
const chaiHttp = require("chai-http");
const request = require("supertest");
const app = require("../index.js"); // assuming your express app is in app.js
const Developer = require("../src/models/developer");
const expect = chai.expect;
chai.use(chaiHttp);

//Tests when the developer is registered, is it getting added in the database and redirected to homepage or not
describe("Developer Registration", function () {
  it("should register a new developer", function (done) {
    chai
      .request(app)
      .post("/register/developer")
      .send({
        name: "John Doe",
        email: "johndoe@example.com",
        password: "123456789",
        userType: "developer",
      })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("developer");
        expect(res.body.developer).to.have.property("name").equal("John Doe");
        expect(res.body.developer)
          .to.have.property("email")
          .equal("johndoe@example.com");
        expect(res.body).to.have.property("redirect").equal("/developer/home");
        done();
      });
  });

  it("should register a new manager", function (done) {
    chai
      .request(app)
      .post("/register/manager")
      .send({
        name: "John Doe Manager",
        email: "johndoeManager@example.com",
        password: "123456789",
        userType: "manager",
      })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("manager");
        expect(res.body).to.have.property("redirect").equal("/manager/home");
        done();
      });
  });
});
