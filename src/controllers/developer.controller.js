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
//           { meetingRoomId: { $in: following } },
//           { teacherId: { $exists: true } },
//         ],
//       },
//       {
//         $and: [
//           { meetingRoomId: { $in: following } },
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
    const meetingRoom = await meetingRoom.findOne({ name: req.body.name });
    const developers = Object.keys(meetingRoom.developers);
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
        meetingRoomId: meetingRoom._id,
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
      res.status(500).send("Meeting not found");
    }
  }
};

const getDocument = async function (req, res) {
  try {
    var meetingRoom = [];
    meetingRoom = await Document.find({ developerId: req.developer._id });
    res.send(meetingRoom);
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
const loadmeetingRoom = async function (req, res) {
  try {
    const meetingRoom = await meetingRoom.findOne({ name: req.body.name }).populate(
      "owner",
      "name email age"
    );
    //meetingRoom.populate('owner', 'name email age').execPopulate()

    if (!meetingRoom) {
      return alert("Team room not found");
    }

    res.send(meetingRoom);
  } catch (e) {
    res.status(500).send("somthing went wrong");
  }
};
const loadHome = async function (req, res) {
  var following = Object.keys(req.developer.following);

  const documents = await Document.find({
    $or: [
      {
        $and: [
          { meetingRoomId: { $in: following } },
          { managerId: { $exists: true } },
        ],
      },
      {
        $and: [
          { meetingRoomId: { $in: following } },
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

const searchmeetingRoom = async function (req, res) {
  try {
    const meetingRoom = await meetingRoom.findOne({ name: req.body.name });

    if (!meetingRoom) {
      return alert("Meeting room not found");
    }

    res.send(meetingRoom);
  } catch (e) {
    res.status(500).send("somthing went wrong");
  }
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

const developerRoomFollow = async function(req, res) {
  const developerProfile = req.developer
  const developerId = req.developer._id
  const meetingRoomId = req.body.id
  try {
      const meetingRoom = await meetingRoom.findOne({ _id: meetingRoomId })
      if (meetingRoomId in developerProfile.following) {

          delete developerProfile.following[meetingRoomId]
          delete meetingRoom.students[developerId]

          developerProfile.meetingRoomCount = developerProfile.meetingRoomCount - 1
          meetingRoom.studentCount = meetingRoom.studentCount - 1

          developerProfile.markModified('following')
          developerProfile.markModified('meetingRoomCount')
          meetingRoom.markModified('students')
          meetingRoom.markModified('studentCount')
          await meetingRoom.save()
          await developerProfile.save()
          return res.status(201).send(developerProfile)
      }
      meetingRoom.students[developerId] = developerId
      developerProfile.following[meetingRoomId] = meetingRoomId
      developerProfile.meetingRoomCount = developerProfile.meetingRoomCount + 1
      meetingRoom.studentCount = meetingRoom.studentCount + 1
      developerProfile.markModified('following')
      developerProfile.markModified('meetingRoomCount')
      meetingRoom.markModified('students')
      meetingRoom.markModified('studentCount')
      await meetingRoom.save()
      await developerProfile.save()
      res.send(developerProfile)

  } catch (e) {
      res.status(500).send("somthing went wrong");
  }
}

const searchMeetingRoom = async function(req, res) {
  try {

      const meetingRoom = await meetingRoom.findOne({ name: req.body.name })

      if (!meetingRoom) {
          return alert('Meeting room not found')
      }

      res.send(meetingRoom)
  } catch (e) {
      res.status(500).send("somthing went wrong")
  }
}

const loadMeetingRoom = async function(req, res) {
  try {

      const meetingRoom = await meetingRoom.findOne({ name: req.body.name }).populate('owner', 'name email age')
          //meetingRoom.populate('owner', 'name email age').execPopulate()

      if (!meetingRoom) {
          return alert('Meeting room not found')
      }

      res.send(meetingRoom)
  } catch (e) {
      res.status(500).send("somthing went wrong")
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
  loadmeetingRoom,
  loadTeamDetails,
  searchmeetingRoom,  
  developerRoomFollow,
  searchMeetingRoom,
  loadMeetingRoom
};
