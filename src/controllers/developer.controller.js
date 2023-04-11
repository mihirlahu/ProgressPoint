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
    res.render("DeveloperHome", {
      developer,
    });
  } catch (e) {
    res.status(500).send();
  }
};

// const loadHome = async function (req, res) {
//   var following = Object.keys(req.developer.following);

//   const documents = await Document.find({
//     $or: [
//       {
//         $and: [
//           { chatRoomId: { $in: following } },
//           { teacherId: { $exists: true } },
//         ],
//       },
//       {
//         $and: [
//           { chatRoomId: { $in: following } },
//           { studentId: { $nin: req.developer._id } },
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
const developer = req.developer;
res.render("developerHome", {
  developer,
});

const UploadDocument = async function (req, res) {
  //if want to restrict the size and dimentions uncomment below line and replace  uploadDocument.fileUpload = file with uploadDocument.fileUpload = buffer
  //const buffer = await sharp(req.file).resize({ width: 250, height: 250 }).png()
  const file = req.file;
  try {
    const chatRoom = await chatRoom.findOne({ name: req.body.name });
    const developers = Object.keys(chatRoom.developers);
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
        chatRoomId: chatRoom._id,
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
      res.status(500).send("chat room not found");
    }
  }
};

const getDocument = async function (req, res) {
  try {
    var chatRoom = [];
    chatRoom = await Document.find({ developerId: req.developer._id });
    res.send(chatRoom);
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

const loadHome = async function (req, res) {
  var following = Object.keys(req.developer.following);

  const documents = await Document.find({
    $or: [
      {
        $and: [
          { chatRoomId: { $in: following } },
          { managerId: { $exists: true } },
        ],
      },
      {
        $and: [
          { chatRoomId: { $in: following } },
          { developerId: { $nin: req.developer._id } },
        ],
      },
    ],
  })
    .populate("managerId", "name email age")
    .populate("developerId", "name email age");

  documents.forEach((element) => {
    if (element.managerId) {
      element.populate("managerId", "name email age").execPopulate();
    } else {
      element.populate("developerId", "name email age").execPopulate();
    }
  });
  res.send(documents);
};

const Logout = async function (req, res) {
  try {
    req.developer.tokens = req.developer.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.developer.save();

    res.render("login");
  } catch (e) {
    res.status(500).render("login");
  }
};

const UpdateProfile = async function (req, res) {
  const updates = Object.keys(req.body);
  const updatesAllowed = ["name", "age", "email", "password"];
  const isValidOperation = updates.every((update) =>
    updatesAllowed.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Update!" });
  }

  try {
    updates.forEach((update) => (req.developer[update] = req.body[update]));
    await req.developer.save();
    const developer = req.developer;
    res.send({ redirect: "/developer/profile", developer });
  } catch (e) {
    res.status(400).send(e);
  }
};

const Profile = async function (req, res) {
  const developer = req.developer;
  res.render("developerProfile", {
    developer,
  });
};

const developerRoomFollow = async function (req, res) {
  const developerProfile = req.developer
  const developerId = req.developer._id
  const chatRoomId = req.body.id
  try {
    const chatRoom = await chatRoom.findOne({ _id: chatRoomId })
    if (chatRoomId in developerProfile.following) {

      delete developerProfile.following[chatRoomId]
      delete chatRoom.students[developerId]

      developerProfile.chatRoomCount = developerProfile.chatRoomCount - 1
      chatRoom.studentCount = chatRoom.studentCount - 1

      developerProfile.markModified('following')
      developerProfile.markModified('chatRoomCount')
      chatRoom.markModified('students')
      chatRoom.markModified('studentCount')
      await chatRoom.save()
      await developerProfile.save()
      return res.status(201).send(developerProfile)
    }
    chatRoom.students[developerId] = developerId
    developerProfile.following[chatRoomId] = chatRoomId
    developerProfile.chatRoomCount = developerProfile.chatRoomCount + 1
    chatRoom.studentCount = chatRoom.studentCount + 1
    developerProfile.markModified('following')
    developerProfile.markModified('chatRoomCount')
    chatRoom.markModified('students')
    chatRoom.markModified('studentCount')
    await chatRoom.save()
    await developerProfile.save()
    res.send(developerProfile)

  } catch (e) {
    res.status(500).send("somthing went wrong");
  }
}

const searchchatRoom = async function (req, res) {
  try {

    const chatRoom = await chatRoom.findOne({ name: req.body.name })

    if (!chatRoom) {
      return alert('Chat room not found')
    }

    res.send(chatRoom)
  } catch (e) {
    res.status(500).send("something went wrong")
  }
}

const loadchatRoom = async function (req, res) {
  try {

    const chatRoom = await chatRoom.findOne({ name: req.body.name }).populate('owner', 'name email age')
    //chatRoom.populate('owner', 'name email age').execPopulate()

    if (!chatRoom) {
      return alert('Chat room not found')
    }

    res.send(chatRoom)
  } catch (e) {
    res.status(500).send("something went wrong")
  }
}

module.exports = {
  Register: Register,
  Login: Login,
  Profile: Profile,
  Logout: Logout,
  UpdateProfile: UpdateProfile,
  Upload,
  showHomePage,
  loadHome,
  UploadDocument,
  getDocument,
  loadSearch,
  loadchatRoom,
  loadTeamDetails,
  searchchatRoom,
  developerRoomFollow,
  loadchatRoom
};
