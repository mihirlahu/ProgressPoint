const mongoose = require("mongoose");

//This function is used to connect to DB
mongoose.connect("mongodb://127.0.0.1:27017/progressPoint", {
  useNewUrlParser: true,
  useCreateIndex: true,
});