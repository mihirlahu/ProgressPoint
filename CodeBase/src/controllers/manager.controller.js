const Manager = require('../models/manager')
const UploadDocuments = require('../models/documents')
const multer = require('multer');

const ClassRoom = require('../models/chatRoom')
const Documents = require('../models/documents')

const path = require('path')

//This route is used to register a new manager. It takes the manager's details from the request body, creates a new "Manager" document in MongoDB, and returns the created document along with a JSON Web Token (JWT).

const Register = async function(req, res) {
    const manager = new Manager(req.body);
    try {
        await manager.save();
        const token = await manager.generateAuthToken();
        res.cookie('access_token', token)
        res.send({ manager, redirect: '/manager/home' })
    } catch (e) {
        res.status(400).send(e);
    }
}

//This route is used to log in a manager. It takes the manager's email and password from the request body, checks if the email and password match with an existing "Manager" document in MongoDB, and returns the document along with a JWT.

const Login = async function(req, res) {
    try {
        const manager = await Manager.findByCredentials(req.body.email, req.body.password);
        const token = await manager.generateAuthToken();
        res.cookie('access_token', token)
        res.send({ manager, redirect: '/manager/home' })
    } catch (e) {
        res.status(400).send(e)
    }
}

//This route is used to log out a manager. It takes a JWT from the request headers, removes the JWT from the "tokens" array of the corresponding "Manager" document in MongoDB, and redirects to the login page.

const Logout = async function(req, res) {
    try {
        req.manager.tokens = req.manager.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.manager.save();

        res.render('login')
    } catch (e) {
        res.status(500).send()
    }
}

//This route is used to update the manager's profile. It takes the updated profile details from the request body, checks if the update operation is valid, updates the corresponding "Manager" document in MongoDB, and returns the updated document.

const UpdateProfile = async function(req, res) {
    const updates = Object.keys(req.body);
    const updatesAllowed = ['name', 'age', 'email', 'password'];
    const isValidOperation = updates.every((update) => updatesAllowed.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Update!' })
    }

    try {
        updates.forEach((update) => req.manager[update] = req.body[update])
        await req.manager.save();

        const developer = req.manager
        res.send({ redirect: '/manager/profile', developer });
    } catch (e) {
        res.status(400).send(e)
    }
}


var storage = multer.diskStorage({
    destination: './public/images/',
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
})

const Upload = multer({ storage: storage })

//This route is used to upload a document to a chat room. It takes the chat room name, document name, description, and the file to upload from the request body and file, creates a new "UploadDocuments" document in MongoDB, and returns the created document.

const uploadDocument = async function(req, res) {
    const file = req.file
    try {
        const chatRoom = await ClassRoom.findOne({ name: req.body.name })
        if (chatRoom.owner.toString() === req.manager._id.toString()) {
            const uploadDocument = new UploadDocuments({
                managerId: req.manager._id,
                chatRoomId: chatRoom.id,
                name: req.body.name,
                description: req.body.description
            })
            uploadDocument.fileUpload = file
            await uploadDocument.save()
            await uploadDocument.populate('managerId', 'name email age').populate('developerId', 'name email age').execPopulate()
            res.send(uploadDocument);
        } else {
            const developer = Object.keys(chatRoom.developer);
            var flag = 0
            if (developer.length > 0) {
                for(let i = 0; i < developer.length; i++) {
                    if (developer[i] == req.manager._id.toString()) {
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
            if(flag == 1) {
                const uploadDocument = new UploadDocuments({
                    managerId: req.manager._id,
                    chatRoomId: chatRoom.id,
                    name: req.body.name,
                    description: req.body.description
                })
                uploadDocument.fileUpload = file
                await uploadDocument.save()
                await uploadDocument.populate('managerId', 'name email age').populate('developerId', 'name email age').execPopulate()
                res.send(uploadDocument);
            }else {
            throw new error()
            }
        }
    } catch (e) {
        if (e) {
            res.status(500).send(e);
        } else {
            res.status(500).send("Chat not found");
        }

    }
}

//This route is used to get all the documents uploaded by the manager. It fetches all the "UploadDocuments" documents in MongoDB that are uploaded by the manager and returns them.

const getDocument = async function(req, res) {
    try {
        var id = req.manager._id.toString()
        chatRoom = await UploadDocuments.find({ managerId: id })
        res.send(chatRoom)
    } catch (e) {
        res.status(500).send("Something went wrong while getting document");
    }
}

//This route is used to get all the members of a chat room. It takes the chat room name from the request body, fetches the corresponding "ClassRoom" document in MongoDB, and returns the "students" array of the document.

const showAllMembers = async function(req, res) {
    var students = []
    try {
        students = await ClassRoom.findOne({ name: req.body.name })
        res.send(students.students)
    } catch (e) {
        res.status(500).send("somthing went wrong")
    }
}

//This route is used to search for a chat room. It takes the chat room name from the request body, fetches the corresponding "ClassRoom" document in MongoDB, and returns the document.

const searchChatRoom = async function(req, res) {
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

//This route is used to load the search page for managers. It renders the "ManagerSearch" view.

const loadSearch = async function(req, res) {
    try {
        const developer = req.manager
        res.render('ManagerSearch', { developer })
    } catch (e) {
        res.status(500).send("Something went wrong while loading page")
    }
}

//This route is used to load the home page for managers. It renders the "ManagerHome" view.

const showHomePage = async function(req, res) {
    try {
        const developer = req.manager
        res.render('ManagerHome', {
            developer
        })
    } catch (e) {
        res.status(500).send();
    }
}

//This route is used to load the profile page for managers. It renders the "ManagerProfile" view.

const Profile = async function(req, res) {
    const developer = req.manager
    res.render('ManagerProfile', {
        developer
    })
}

//This route is used to load the documents uploaded by the manager. It fetches all the "Documents" documents in MongoDB that are uploaded to the chat rooms owned by the manager and returns them.

const loadHome = async function(req, res) {
    var chatRooms = Object.keys(req.manager.chatRooms)

    const documents = await Documents.find({ chatRoomId: { $in: chatRooms } }).populate('managerId', 'name email age').populate('developerId', 'name email age')
    res.send(documents)
}

//This function provides the follow functionality to the manager
const chatRoomFollow = async function(req, res) {
    const userProfile = req.manager
    const userId = req.manager._id
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

module.exports = {
    Register: Register,
    Login: Login,
    Profile: Profile,
    Logout: Logout,
    UpdateProfile: UpdateProfile,
    uploadDocument,
    Upload,
    showAllMembers,
    showHomePage,
    getDocument,
    searchChatRoom,
    loadSearch,
    loadHome,
    chatRoomFollow,
}