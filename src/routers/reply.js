const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()
const Reply = require('../models/reply')
const UploadDocuments = require('../models/documents')
const replyController = require('../controllers/reply.controller')

router.post('/post/reply', replyController.createReply)
router.delete('/post/reply/delete', replyController.deleteReply)
router.post("/post/reply/like", replyController.likeReply)
router.get("/post/reply", replyController.getReply)

module.exports = router;