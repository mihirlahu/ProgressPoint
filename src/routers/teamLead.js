const express = require('express');
const auth = require('../middleware/auth').teacherAuth
const router = new express.Router();
const teacherControllers = require('../controllers/teacher.controller')

router.post("/register/teacher", teacherControllers.Register)
router.post("/login/teacher", teacherControllers.Login)


module.exports = router;