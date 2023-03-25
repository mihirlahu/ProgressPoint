const express = require('express');
const auth = require('../middleware/auth').teacherAuth
const router = new express.Router();
const teacherControllers = require('../controllers/manager.controller')

router.post("/register/manager", teacherControllers.Register)
router.post("/login/manager", teacherControllers.Login)


module.exports = router;