const express = require("express");
const router = new express.Router();
const auth = require('../middleware/auth').userAuth
const developerControllers = require("../controllers/developer.controller");

router.post("/register/developer", developerControllers.Register);
router.post("/login/developer", developerControllers.Login);
router.get("/user/home", auth, userControllers.showHomePage)
router.get("/user/loadHome", auth, userControllers.loadHome)

module.exports = router;
