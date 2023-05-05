const mongoose = require('mongoose')

const likeSchema = new mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Developer'
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UploadDocuments'
    },
    postReplyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reply'
    }
}, {
    timestamps: true
})


const Like = mongoose.model('Like', likeSchema)

module.exports = Like