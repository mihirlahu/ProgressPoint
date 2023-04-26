const express = require('express');
const Developer = require('../models/developer')
const auth = require('../middleware/auth').managerAuth
const sharp = require('sharp')
const router = new express.Router();
const multer = require('multer');
const teacherControllers = require('../controllers/manager.controller')

router.post("/register/manager", teacherControllers.Register)
router.post("/login/manager", teacherControllers.Login)
router.get("/manager/home", auth, teacherControllers.showHomePage)
router.post('/manager/chatRoom/uploadDocument', auth, teacherControllers.Upload.single('fileUpload'), teacherControllers.uploadDocument)
router.get('/manager/chatRoom/getDocument', auth, teacherControllers.getDocument)
router.get("/classroom/followers", auth, teacherControllers.showAllStudents)
router.get("/manager/loadHome", auth, teacherControllers.loadHome)
router.get("/manager/profile", auth, teacherControllers.Profile)
router.post("/manager/search", auth, teacherControllers.searchClassRoom)
router.get("/manager/loadSearch", auth, teacherControllers.loadSearch)
router.get("/manager/logout", auth, teacherControllers.Logout)
router.patch('/developer/manager/profile/update', auth, teacherControllers.UpdateProfile)

module.exports = router;