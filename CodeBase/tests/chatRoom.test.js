const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index");
const ChatRoom = require("../src/models/chatRoom");

chai.use(chaiHttp);
const expect = chai.expect;

let managerToken = "";

describe("Manager Login", function () {
  it("should log in a manager", function (done) {
    chai
      .request(app)
      .post("/login/manager")
      .send({
        email: "johndoeManager@example.com",
        password: "123456789",
      })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);

        managerToken = res.header["set-cookie"][0];
        done();
      });
  });

  it("should return 400 for invalid manager login", function (done) {
    chai
      .request(app)
      .post("/login/manager")
      .send({
        email: "invalid@gmail.com",
        password: "invalidpassword",
      })
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
      });
  });
});

describe("Chat Room API", function () {
  describe("POST /chatRoom/create", function () {
    it("should create a new chat room", async function () {
      const chatRoom = {
        name: "Test Chat Room",
        description: "This is a test chat room",
      };

      const response = await chai
        .request(app)
        .post("/chatRoom/create")
        .set("Cookie", managerToken)
        .send(chatRoom);

      expect(response).to.have.status(201);
      expect(response.body).to.have.property("_id");
      expect(response.body).to.have.property("name", chatRoom.name);
      expect(response.body).to.have.property(
        "description",
        chatRoom.description
      );

      const savedChatRoom = await ChatRoom.findById(response.body._id);
      expect(savedChatRoom).to.exist;
      expect(savedChatRoom).to.have.property("name", chatRoom.name);
      expect(savedChatRoom).to.have.property(
        "description",
        chatRoom.description
      );
      expect(savedChatRoom).to.have.property("owner");
    });

    it("should return 401 if unauthorized", async function () {
      const chatRoom = {
        name: "Test Chat Room",
        description: "This is a test chat room",
      };

      const response = await chai
        .request(app)
        .post("/chatRoom/create")
        .send(chatRoom);

      expect(response).to.have.status(401);
    });
  });
});
