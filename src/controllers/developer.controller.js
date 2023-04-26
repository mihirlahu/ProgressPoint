const Developer = require('../models/developer')
const UploadDocuments = require('../models/documents')
const multer = require('multer');

const ClassRoom = require('../models/chatRoom')

const Document = require('../models/documents')
const path = require('path')

const Register = async function(req, res) {

    const developer = new Developer(req.body);

    try {
        await developer.save();
        const token = await developer.generateAuthToken();
        res.cookie('access_token', token)
        res.send({ developer, redirect: '/developer/home' })
    } catch (e) {
        res.status(400).send(e);
    }
}

const Login = async function(req, res) {
    try {
        const developer = await Developer.findByCredentials(req.body.email, req.body.password);
        const token = await developer.generateAuthToken();
        res.cookie('access_token', token)
        res.send({ developer, redirect: '/developer/home' })
    } catch (e) {
        res.status(400).send(e)
    }
}

const showHomePage = async function(req, res) {
    try {
        const developer = req.developer
        res.render('UserHome', {
            developer
        })

    } catch (e) {

        res.status(500).send();
    }
}

const Profile = async function(req, res) {
    const developer = req.developer
    res.render('UserProfile', {
        developer,
    })
}

const Logout = async function(req, res) {
    try {
        req.developer.tokens = req.developer.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.developer.save();

        res.render('login');
    } catch (e) {
        res.status(500).render('login')
    }
}

const UpdateProfile = async function(req, res) {
    const updates = Object.keys(req.body);
    const updatesAllowed = ['name', 'age', 'email', 'password'];
    const isValidOperation = updates.every((update) => updatesAllowed.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Update!' })
    }

    try {
        updates.forEach((update) => req.developer[update] = req.body[update])
        await req.developer.save();
        const developer = req.developer
        res.send({ redirect: '/developer/profile', developer });
    } catch (e) {
        res.status(400).send(e)
    }
}

const DeleteProfile = async function(req, res) {
    try {
        const currentUserID = req.developer._id.toString();

        await Developer.updateMany({ _id: { $in: req.developer.followingList } }, {

            $unset: {
                [`follower.${currentUserID}`]: ""
            }
        });

        await Developer.updateMany({ _id: { $in: req.developer.followerList } }, {
            $unset: {
                [`following.${currentUserID}`]: ""
            }
        });
        await req.developer.remove()
        res.send(req.developer);
    } catch (e) {
        res.status(500).send(e)
    }
}



var storage = multer.diskStorage({
    destination: './public/images/',
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
})

const Upload = multer({ storage: storage })

const UploadDocument = async function(req, res) {
    const file = req.file
    try {
        const chatRoom = await ClassRoom.findOne({ name: req.body.name })
        if(!chatRoom) {
            throw new Error("Chat room not found")
        }
        const developer = Object.keys(chatRoom.developer);
        var flag = 0

        if (developer.length > 0) {
            for(let i = 0; i < developer.length; i++) {
                if (developer[i] == req.developer._id.toString()) {
                    flag = 1
                    break;
                }
            }
            if(!flag) {
                throw new Error("Developer does not belong to chat room")
            }
        } else {
            throw new Error("Developer does not belong to chat room")
        }
        if (flag == 1) {
            const uploadDocument = new UploadDocuments({
                developerId: req.developer._id,
                chatRoomId: chatRoom._id,
                name: req.body.name,
                description: req.body.description
            })
            uploadDocument.fileUpload = file
            await uploadDocument.save()
            await uploadDocument.populate('managerId', 'name email age').populate('developerId', 'name email age').execPopulate()
            res.send(uploadDocument);
        }

    } catch (e) {
        if (e) {
            res.status(500).send(e);
        } else {
            res.status(500).send("Chat not found");
        }

    }
}

const getDocument = async function(req, res) {
    try {
        var chatRoom = []
        chatRoom = await Document.find({ developerId: req.developer._id })
        res.send(chatRoom)
    } catch (e) {
        res.status(500).send("somthing went wrong while getting document");
    }
}

const classRoomFollow = async function(req, res) {
    const userProfile = req.developer
    const userId = req.developer._id
    const chatRoomId = req.body.id
    try {
        const chatRoom = await ClassRoom.findOne({ _id: chatRoomId })
        if (chatRoomId in userProfile.following) {

            delete userProfile.following[chatRoomId]
            delete chatRoom.developer[userId]

            userProfile.chatRoomCount = userProfile.chatRoomCount - 1
            chatRoom.developerCount = chatRoom.developerCount - 1

            userProfile.markModified('following')
            userProfile.markModified('chatRoomCount')
            chatRoom.markModified('developer')
            chatRoom.markModified('developerCount')
            await chatRoom.save()
            await userProfile.save()
            return res.status(201).send(userProfile)
        }
        chatRoom.developer[userId] = userId
        userProfile.following[chatRoomId] = chatRoomId
        userProfile.chatRoomCount = userProfile.chatRoomCount + 1
        chatRoom.developerCount = chatRoom.developerCount + 1
        userProfile.markModified('following')
        userProfile.markModified('chatRoomCount')
        chatRoom.markModified('developer')
        chatRoom.markModified('developerCount')
        await chatRoom.save()
        await userProfile.save()
        res.send(userProfile)

    } catch (e) {
        res.status(500).send("somthing went wrong");
    }
}

const searchClassRoom = async function(req, res) {
    try {

        const chatRoom = await ClassRoom.findOne({ name: req.body.name })

        if (!chatRoom) {
            return alert('Chat room not found')
        }

        res.send(chatRoom)
    } catch (e) {
        res.status(500).send("somthing went wrong")
    }
}

const loadSearch = async function(req, res) {
    try {
        const developer = req.developer

        res.render('UserSearch', { developer })
    } catch (e) {
        res.status(500).send("somthing went wrong while loading page")
    }
}

const loadClassDetails = async function(req, res) {
    try {
        const developer = req.developer

        res.render('UserClassDetails', { developer })
    } catch (e) {
        res.status(500).send("somthing went wrong while loading page")
    }
}
const loadClassRoom = async function(req, res) {
        try {

            const chatRoom = await ClassRoom.findOne({ name: req.body.name }).populate('owner', 'name email age')

            if (!chatRoom) {
                return alert('Chat room not found')
            }

            res.send(chatRoom)
        } catch (e) {
            res.status(500).send("somthing went wrong")
        }
    }


const loadHome = async function(req, res) {
    var following = Object.keys(req.developer.following)

    const documents = await Document.find({ $or: [{ $and: [{ chatRoomId: { $in: following } }, { managerId: { $exists: true } }] }, { $and: [{ chatRoomId: { $in: following } }, { developerId: { $nin: req.developer._id } }] }] }).populate('managerId', 'name email age').populate('developerId', 'name email age')

    documents.forEach(element => {
        if (element.managerId) {
            element.populate('managerId', 'name email age').execPopulate()
        } else {
            element.populate('developerId', 'name email age').execPopulate()
        }
    });
    //console.log(documents);
    res.send(documents)
}

module.exports = {
    Register,
    Login,
    showHomePage,
    Profile: Profile,
    Logout: Logout,
    searchClassRoom,
    UpdateProfile: UpdateProfile,
    DeleteProfile: DeleteProfile,
    //uploadAvatar: uploadAvatar,
    Upload,
    UploadDocument,
    loadSearch,
    getDocument,
    loadClassDetails,
    loadClassRoom,
    classRoomFollow,
    loadHome,
}