const Developer = require("../models/developer");

const Register = async function (req, res) {
  const developer = new developer(req.body);

  try {
    await developer.save();
    const token = await developer.generateAuthToken();
    res.cookie("access_token", token);
    res.send({ developer, redirect: "/developer/home" });
  } catch (e) {
    res.status(400).send(e);
  }
};

const Login = async function (req, res) {
  try {
    const developer = await Developer.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await developer.generateAuthToken();
    res.cookie("access_token", token);
    res.send({ developer, redirect: "/developer/home" });
  } catch (e) {
    res.status(400).send(e);
  }
};
