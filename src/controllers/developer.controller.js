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

const showHomePage = async function (req, res) {
  try {
    const developer = req.developer;
    res.render("developerHome", {
      developer,
    });
  } catch (e) {
    res.status(500).send();
  }
};

// const loadHome = async function (req, res) {
//   var following = Object.keys(req.user.following);

//   const documents = await Document.find({
//     $or: [
//       {
//         $and: [
//           { classRoomId: { $in: following } },
//           { teacherId: { $exists: true } },
//         ],
//       },
//       {
//         $and: [
//           { classRoomId: { $in: following } },
//           { studentId: { $nin: req.user._id } },
//         ],
//       },
//     ],
//   })
//     .populate("teacherId", "name email age")
//     .populate("studentId", "name email age");

//   documents.forEach((element) => {
//     if (element.teacherId) {
//       element.populate("teacherId", "name email age").execPopulate();
//     } else {
//       element.populate("studentId", "name email age").execPopulate();
//     }
//   });
//   res.send(documents);
// };

const Upload = multer({ storage: storage });
      const developer = req.developer
      res.render('developerHome', {
          developer
      })

const UploadDocument = async function (req, res) {
  //if want to restrict the size and dimentions uncomment below line and replace  uploadDocument.fileUpload = file with uploadDocument.fileUpload = buffer
  //const buffer = await sharp(req.file).resize({ width: 250, height: 250 }).png()
  const file = req.file;
  try {
    const teamRoom = await teamRoom.findOne({ name: req.body.name });
    const developers = Object.keys(teamRoom.developers);
    var flag = 0;

    if (developers.length > 0) {
      developers.forEach((element) => {
        if (element != req.developer._id) {
          throw new Error("developer does not belong to team");
        } else {
          flag = 1;
        }
      });
    } else {
      throw new Error("developer does not belong to team");
    }
    if (flag == 1) {
      const uploadDocument = new UploadDocuments({
        developerId: req.developer._id,
        teamRoomId: teamRoom._id,
        name: req.body.name,
        description: req.body.description,
      });
      uploadDocument.fileUpload = file;
      await uploadDocument.save();
      await uploadDocument
        .populate("managerId", "name email age")
        .populate("developerId", "name email age")
        .execPopulate();
      res.send(uploadDocument);
    }
  } catch (e) {
    if (e) {
      res.status(500).send(e);
    } else {
      res.status(500).send("Team not found");
    }
  }
};

const getDocument = async function (req, res) {
  try {
    var teamRoom = [];
    teamRoom = await Document.find({ developerId: req.developer._id });
    res.send(teamRoom);
  } catch (e) {
    res.status(500).send("somthing went wrong while getting document");
  }
};

const loadSearch = async function (req, res) {
  try {
    const developer = req.developer;

    res.render("developerSearch", { developer });
  } catch (e) {
    res.status(500).send("somthing went wrong while loading page");
  }
};

const loadTeamDetails = async function (req, res) {
  try {
    const developer = req.developer;

    res.render("developerTeamDetails", { developer });
  } catch (e) {
    res.status(500).send("somthing went wrong while loading page");
  }
};
const loadTeamRoom = async function (req, res) {
  try {
    const teamRoom = await TeamRoom.findOne({ name: req.body.name }).populate(
      "owner",
      "name email age"
    );
    //teamRoom.populate('owner', 'name email age').execPopulate()

    if (!teamRoom) {
      return alert("Team room not found");
    }

    res.send(teamRoom);
  } catch (e) {
    res.status(500).send("somthing went wrong");
  }
};
const loadHome = async function(req, res) {
  var following = Object.keys(req.developer.following)

  const documents = await Document.find({ $or: [{ $and: [{ teamRoomId: { $in: following } }, { managerId: { $exists: true } }] }, { $and: [{ teamRoomId: { $in: following } }, { developerId: { $nin: req.developer._id } }] }] }).populate('managerId', 'name email age').populate('developerId', 'name email age')

  documents.forEach(element => {
      if (element.managerId) {
          element.populate('managerId', 'name email age').execPopulate()
      } else {
          element.populate('developerId', 'name email age').execPopulate()
      }
  });
  res.send(documents)
}

const searchClassRoom = async function(req, res) {
  try {

      const classRoom = await ClassRoom.findOne({ name: req.body.name })

      if (!classRoom) {
          return alert('Class room not found')
      }

      res.send(classRoom)
  } catch (e) {
      res.status(500).send("somthing went wrong")
  }
}

const Logout = async function(req, res) {
  try {
      req.developer.tokens = req.developer.tokens.filter((token) => {
          return token.token !== req.token
      })
      await req.developer.save();

      res.render('login');
  } catch (e) {
      res.status(500).render('login')
  }
}

const UpdateProfile = async function(req, res) {
  const updates = Object.keys(req.body);
  const updatesAllowed = ['name', 'age', 'email', 'password'];
  const isValidOperation = updates.every((update) => updatesAllowed.includes(update));

  if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid Update!' })
  }

  try {
      updates.forEach((update) => req.developer[update] = req.body[update])
      await req.developer.save();
      const developer = req.developer
      res.send({ redirect: '/developer/profile', developer });
  } catch (e) {
      res.status(400).send(e)
  }
}

const Profile = async function(req, res) {
  const developer = req.developer
  res.render('developerProfile', {
      developer,
  })
}

module.exports = {
  Register: Register,
  Login: Login,
  showHomePage,
  loadHome,
  Upload,
  UploadDocument,
  getDocument,
  loadSearch,
  loadTeamRoom,
  loadTeamDetails,
  Profile: Profile,
  searchClassRoom,
  Logout: Logout,
  UpdateProfile: UpdateProfile,
}
