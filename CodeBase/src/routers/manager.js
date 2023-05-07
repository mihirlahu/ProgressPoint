const express = require('express');
const auth = require('../middleware/auth').managerAuth
const router = new express.Router();
const managerController = require('../controllers/manager.controller')

//this is route fir manager
router.post("/register/manager", managerController.Register)
router.post("/login/manager", managerController.Login)
router.get("/manager/home", auth, managerController.showHomePage)
router.post('/manager/chatRoom/uploadDocument', auth, managerController.Upload.single('fileUpload'), managerController.uploadDocument)
router.get('/manager/chatRoom/getDocument', auth, managerController.getDocument)
router.get("/classroom/followers", auth, managerController.showAllMembers)
router.get("/manager/loadHome", auth, managerController.loadHome)
router.get("/manager/profile", auth, managerController.Profile)
router.post("/manager/search", auth, managerController.searchChatRoom)
router.get("/manager/loadSearch", auth, managerController.loadSearch)
router.get("/manager/logout", auth, managerController.Logout)
router.patch('/developer/manager/profile/update', auth, managerController.UpdateProfile)
router.post('/manager/follow', auth, managerController.chatRoomFollow)
module.exports = router;