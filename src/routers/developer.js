const express = require("express");
const router = new express.Router();
const developerControllers = require("../controllers/developer.controller");

router.post("/register/developer", developerControllers.Register);
router.post("/login/developer", developerControllers.Login);

module.exports = router;
