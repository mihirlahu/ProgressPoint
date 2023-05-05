const express = require("express");
require("./src/db/mongoose");
const userRouter = require("./src/routers/developer");
const teacherRouter = require("./src/routers/manager");
const chatRoomRouter = require("./src/routers/chatRoom");
const likeRouter = require("./src/routers/likes");
const replyRouter = require("./src/routers/reply");
//const taskRouter = require('./src/routers/task')
const path = require("path");
const hbs = require("hbs");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const _ = require("lodash");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, "./public");
const viewsPath = path.join(__dirname, "./templates/views");
const partialsPath = path.join(__dirname, "./templates/partials");

app.set("view engine", "hbs");
app.set("views", viewsPath);
app.use(express.static(publicDirectoryPath));
hbs.registerPartials(partialsPath);

app.use(function (req, res, next) {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );

  next();
});

const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (socket) => {
  console.log("Connection  established");
  socket.on("Uploaded", (data) => {
    console.log(data);
    socket.broadcast.emit("sending data", data);
  });
});

app.get("", (req, res) => {
  res.render("login");
});

app.use(express.json());
app.use(cookieParser());
app.use(userRouter);
app.use(teacherRouter);
app.use(chatRoomRouter);
app.use(likeRouter);
app.use(replyRouter);
app.use(
  fileUpload({
    createParentPath: true,
  })
);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

module.exports = app;
