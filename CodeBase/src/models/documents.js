const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    developerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Developer'
    },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Manager'
    },
    chatRoomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClassRoom'
    },
    name: {
        type: String,
        required: true
    },
    fileUpload: {
        
    },
    description: {
        type: String,
        required: true
    },
    likeCount: {
        type: Number,
        default: 0
    },
    replyCount: {
        default: 0,
        type: Number
    },
    likedBy: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
})

documentSchema.pre('remove', async function(next) {
    const document = this
    await Reply.deleteMany({ postId: document._id })
    await Like.deleteMany({ postId: document._id })
    next()
})

const UploadDocuments = mongoose.model('UploadDocuments', documentSchema)
module.exports = UploadDocuments;