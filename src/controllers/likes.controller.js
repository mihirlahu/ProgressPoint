const path = require('path')
const Like = require('../models/likes')
const UploadDocuments = require('../models/documents')

const likeDocumentController = async function(req, res) {
    try {
        const like = await Like.findOne({ UserId: req.body.UserId, postId: req.body.postId })
        if (!like) {
            const like = new Like({
                ...req.body,
                UserId: req.body.UserId,
                postId: req.body.postId
            })
            try {
                const uploadedDocument = await UploadDocuments.findOne({ _id: req.body.postId })
                uploadedDocument.likeCount = uploadedDocument.likeCount + 1;
                uploadedDocument.likedBy.push(req.body.UserId)
                await uploadedDocument.save()
                await like.save()
                res.status(201).send({ like, UploadDocuments })
            } catch (e) {
                res.status(400).send(e)
            }
        } else {
            const uploadedDocument = await UploadDocuments.findOne({ _id: req.body.postId })
            uploadedDocument.likeCount = uploadedDocument.likeCount - '1';
            var index = uploadedDocument.likedBy.indexOf(req.body.UserId);
                if (index !== -1) {
                uploadedDocument.likedBy.splice(index, 1);
                }
                
            await uploadedDocument.save()
            await like.remove()
            res.status(201).send({ like: false })
        }
    } catch (e) {
        res.status(500).send()
    }
}

module.exports = {
    likeDocumentController
}