const express = require("express");
const router = new express.Router();
const auth = require('../middleware/auth').developerAuth
const developerControllers = require("../controllers/developer.controller");

router.post("/register/developer", developerControllers.Register);
router.post("/login/developer", developerControllers.Login);
router.get("/developer/home", auth, developerControllers.showHomePage);
router.get("/developer/loadHome", auth, developerControllers.loadHome);
router.post(
  "/developer/teamRoom/uploadDocument",
  auth,
  developerControllers.Upload.single("fileUpload"),
  developerControllers.UploadDocument
);
router.get(
  "/developer/classRoom/getDocument",
  auth,
  developerControllers.getDocument
);

router.post("/register/developer", developerControllers.Register);
router.post("/login/developer", developerControllers.Login);
router.get("/developer/home", auth, developerControllers.showHomePage)
router.get("/developer/loadHome", auth, developerControllers.loadHome)
router.post('/developer/chatRoom/uploadDocument', auth, developerControllers.Upload.single('fileUpload'), developerControllers.UploadDocument)
router.get('/developer/chatRoom/getDocument', auth, developerControllers.getDocument)
router.post("/search", auth, developerControllers.searchchatRoom)
router.get("/loadSearch", auth, developerControllers.loadSearch);
router.get("/developer/loadSearch", auth, developerControllers.loadTeamDetails);
router.post("/developer/loadSearch", auth, developerControllers.loadchatRoom);
router.get("/developer/profile", auth, developerControllers.Profile);
router.get("/developer/logout", auth, developerControllers.Logout);
router.patch('/developer/profile/update', auth, developerControllers.UpdateProfile);
router.post('/developer/follow', auth, developerControllers.developerRoomFollow);


module.exports = router;
