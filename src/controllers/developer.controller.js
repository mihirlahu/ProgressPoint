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

const showHomePage = async function(req, res) {
  try {
      const user = req.user
      res.render('UserHome', {
          user
      })

  } catch (e) {

      res.status(500).send();
  }
}

const loadHome = async function(req, res) {
  var following = Object.keys(req.user.following)

  const documents = await Document.find({ $or: [{ $and: [{ classRoomId: { $in: following } }, { teacherId: { $exists: true } }] }, { $and: [{ classRoomId: { $in: following } }, { studentId: { $nin: req.user._id } }] }] }).populate('teacherId', 'name email age').populate('studentId', 'name email age')

  documents.forEach(element => {
      if (element.teacherId) {
          element.populate('teacherId', 'name email age').execPopulate()
      } else {
          element.populate('studentId', 'name email age').execPopulate()
      }
  });
  res.send(documents)
}

module.exports = {
  Register: Register,
  Login: Login,
  showHomePage,
  loadHome
}
