const mongoose = require('mongoose')
const Like = require('./likes')

//This is model for reply schema
const replySchema = new mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Developer'
    },
    content: {
        type: String,
        maxlength: 1000
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'UploadDocuments'
    },
    likeCount: {
        type: Number,
        default: 0
    },
    userName: {
        type: String,
    }
}, {
    timestamps: true
})

replySchema.pre('remove', async function(next) {
    const reply = this
    await Like.deleteMany({ postReplyId: reply._id })
    next()
})

const Reply = mongoose.model('Reply', replySchema)

module.exports = Reply