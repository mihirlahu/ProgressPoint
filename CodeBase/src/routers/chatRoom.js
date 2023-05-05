const express = require('express');
const auth = require('../middleware/auth').managerAuth;
const router = new express.Router();
const chatRoomController = require('../controllers/chatRoom.controller')


router.post('/chatRoom/create', auth, chatRoomController.createChatRoom)
router.get('/chatRoom/readAll', auth, chatRoomController.readAllChatRoom)
router.post('/chatRoom/read', auth, chatRoomController.readChatRoomById)

module.exports = router