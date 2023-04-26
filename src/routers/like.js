const express = require('express');
const authDev = require('./../middleware/auth').developerAuth
const authManager = require('./../middleware/auth').managerAuth
const router = new express.Router();
const likesController = require('../controllers/likes.controller')

router.post('/developer/post/likeDocument', likesController.likeDocumentController);
router.post('/manager/post/likeDocument', likesController.likeDocumentController);

module.exports = router;