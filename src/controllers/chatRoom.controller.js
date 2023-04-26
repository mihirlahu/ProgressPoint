const ChatRoom = require("../models/chatRoom")
require('express-fileupload')


const createChatRoom = async function(req, res) {
    const chatRoom = new ChatRoom({
        ...req.body,
        owner: req.manager._id
    })
    try {

        await chatRoom.save()
        req.manager.chatRooms[chatRoom._id] = chatRoom._id
        req.manager.chatRoomCreatedCount = req.manager.chatRoomCreatedCount + 1
        req.manager.markModified('chatRooms')
        req.manager.markModified('chatRoomCreatedCount')

        await req.manager.save()
        res.status(201).send(chatRoom)
    } catch (e) {
        res.status(400).send(e)
    }
}

const readAllChatRoom = async function(req, res) {

    var allClass = []
    try {

        allClass = await ChatRoom.find({ owner: req.manager._id })

        res.send(allClass)
    } catch (e) {
        res.status(500).send(e)
    }
}

const getAllFollowedChatRoom = async (req,res) => {
    var allClass = [];
    try {

        allClass = await ChatRoom.find({ developer : req.manager._id })
        
        res.send(allClass)
    } catch (e) {
        res.status(500).send(e)
    }
}



const readChatRoomById = async function(req, res) {
    try {
        const chatRoom = await ChatRoom.findOne({ _id: req.body.id })

        if (!chatRoom) {
            return res.status(404).send()
        }
        res.send(chatRoom)
    } catch (e) {
        res.status(500).send()
    }
}


module.exports = {
    createChatRoom,
    readAllChatRoom,
    readChatRoomById,
}