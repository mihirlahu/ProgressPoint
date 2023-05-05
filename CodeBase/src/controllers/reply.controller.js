const Reply = require("../models/reply");
const UploadDocuments = require("../models/documents");
const Like = require("../models/likes");

const createReply = async function (req, res) {
  const reply = new Reply({
    ...req.body,
    UserId: req.body.UserId,
    userName:req.body.username
  });
  try {
    const uploadedDocument = await UploadDocuments.findOneAndUpdate(
      { _id: req.body.postId },
      { $inc: { replyCount: 1 } },
      { new: true }
    );
    await uploadedDocument.save();
    await reply.save();
    res.status(201).send(reply);
  } catch (e) {
    res.status(400).send(e);
  }
};

const getReply = async function (req, res) {
  const reply = new Reply({
    ...req.body,
    UserId: req.query.UserId,
  });
  try {
    const uploadedDocument = await Reply.find({ postId: req.query.postId });
    res.status(201).send(uploadedDocument);
  } catch (e) {
    res.status(400).send(e);
  }
};

const deleteReply = async function (req, res) {
  try {
    console.log(req.body.id);
    const reply = await Reply.findOne({
      _id: req.body.id,
      UserId: req.user._id,
    });
    console.log(reply);

    if (!reply) {
      return res.status(404).send("No replies on this Id");
    }
    const uploadedDocument = await UploadDocuments.findOneAndUpdate(
      { _id: reply.tweetId },
      { $inc: { replyCount: -1 } },
      { new: true }
    );
    await uploadedDocument.save();
    reply.remove();
    res.send(reply);
  } catch (e) {
    res.status(500).send();
  }
};

const likeReply = async function (req, res) {
  try {
    const like = await Like.findOne({
      replyId: req.body.id,
      UserId: req.user._id,
    });
    if (!like) {
      const like = new Like({
        replyId: req.body.id,
        UserId: req.user._id,
      });
      const reply = await Reply.findById(req.body.id);
      reply.likeCount = reply.likeCount + 1;
      reply.save();
      like.save();
      res.status(201).send("successfull");
    } else {
      const reply = await Reply.findById(req.body.id);
      reply.likeCount = reply.likeCount - 1;
      reply.save();
      like.remove();
      like.save();
      res.status(201).send("successfull");
    }
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = {
  createReply,
  deleteReply,
  likeReply,
  getReply,
};
