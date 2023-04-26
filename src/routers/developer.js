const express = require('express');
const auth = require('../middleware/auth').developerAuth
const router = new express.Router();
const developerControllers = require('../controllers/developer.controller')
const classRoomController = require('./../controllers/chatRoom.controller')

router.post("/register/developer", developerControllers.Register)
router.post("/login/developer", developerControllers.Login)
router.get("/developer/home", auth, developerControllers.showHomePage)
router.get("/developer/loadHome", auth, developerControllers.loadHome)
router.post('/developer/chatRoom/uploadDocument', auth, developerControllers.Upload.single('fileUpload'), developerControllers.UploadDocument)
router.get('/developer/chatRoom/getDocument', auth, developerControllers.getDocument)
router.post("/search", auth, developerControllers.searchClassRoom)
router.get("/loadSearch", auth, developerControllers.loadSearch)
router.get("/developer/loadSearch", auth, developerControllers.loadClassDetails)
router.post("/developer/loadSearch", auth, developerControllers.loadClassRoom)
router.get("/developer/profile", auth, developerControllers.Profile)
router.get("/developer/logout", auth, developerControllers.Logout)
router.patch('/developer/profile/update', auth, developerControllers.UpdateProfile)
router.post('/developer/follow', auth, developerControllers.classRoomFollow)
module.exports = router;