const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Manager'
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    developer: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    developerCount: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true
})

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema)
module.exports = ChatRoom;