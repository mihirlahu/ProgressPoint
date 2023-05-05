const request = require("supertest");
const app = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");

const ChatRoom = require("../src/models/chatRoom");

chai.use(chaiHttp);
const expect = chai.expect;

let managerToken = "";

describe("GET /developer/loadHome", () => {
  it("should log in a developer", function (done) {
    chai
      .request(app)
      .post("/login/developer")
      .send({
        email: "johndoe@example.com",
        password: "123456789",
      })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);

        managerToken = res.header["set-cookie"][0];
        done();
      });
  });

  it("should return a 200 status code if the user is authenticated", async () => {
    // Mock an authenticated user
    const token = "insert_valid_access_token_here";

    // Make the request to the endpoint
    const response = await request(app)
      .get("/developer/loadHome")
      .set("Cookie", managerToken);

    // Assert that the response has a 200 status code
    expect(response).to.have.status(200);
  });

  it("should return a 401 status code if the user is not authenticated", async () => {
    // Make the request to the endpoint without setting an authorization header
    const response = await request(app).get("/developer/loadHome");

    // Assert that the response has a 401 status code
    expect(response).to.have.status(401);
  });
});
