const ChatRoom = require("../models/chatRoom")
require('express-fileupload')

// This function creates a new chat room by taking the request object (req) and response object (res) as input. The function first creates a new instance of the ChatRoom model by destructuring the request body and adding the owner field to it, which is set to the _id of the current user.
// If the save operation is successful, the function updates the chatRooms and chatRoomCreatedCount fields of the current user and saves the changes to the database. Finally, it sends a response with the status code 201 and the newly created chat room object. If there is an error during the save operation, the function sends a response with the status code 400 and the error object.

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

// This function retrieves all chat rooms created by the current user by taking the request object (req) and response object (res) as input. The function finds all chat rooms in the database where the owner field is equal to the _id of the current user.
// If the find operation is successful, the function sends a response with the retrieved chat rooms as an array. If there is an error during the find operation, the function sends a response with the status code 500 and the error object.


const readAllChatRoom = async function(req, res) {

    var allClass = []
    try {

        allClass = await ChatRoom.find({ owner: req.manager._id })

        res.send(allClass)
    } catch (e) {
        res.status(500).send(e)
    }
}


// This function retrieves all chat rooms followed by the current user by taking the request object (req) and response object (res) as input. The function finds all chat rooms in the database where the developer field is equal to the _id of the current user.
// If the find operation is successful, the function sends a response with the retrieved chat rooms as an array. If there is an error during the find operation, the function sends a response with the status code 500 and the error object.

const getAllFollowedChatRoom = async (req,res) => {
    var allClass = [];
    try {

        allClass = await ChatRoom.find({ developer : req.manager._id })
        
        res.send(allClass)
    } catch (e) {
        res.status(500).send(e)
    }
}

// This function retrieves a chat room by its ID by taking the request object (req) and response object (res) as input. The function finds a chat room in the database where the _id field is equal to the id field in the request body.
// If the find operation is successful and the chat room exists, the function sends a response with the retrieved chat room object. If the chat room does not exist, the function sends a response with the status code 404. If there is an error during the find operation, the function sends a response with the status code 500.


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