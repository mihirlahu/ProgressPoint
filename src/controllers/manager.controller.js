const Manager = require('../models/manager')
const UploadDocuments = require('../models/documents')
const multer = require('multer');

const ClassRoom = require('../models/chatRoom')
const Documents = require('../models/documents')

const path = require('path')

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

const uploadDocument = async function(req, res) {
    //if want to restrict the size and dimentions uncomment below line and replace  uploadDocument.fileUpload = file with uploadDocument.fileUpload = buffer
    //const buffer = await sharp(req.file).resize({ width: 250, height: 250 }).png()
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
            throw new error()
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
        var id = req.manager._id.toString()
        chatRoom = await UploadDocuments.find({ managerId: id })
        res.send(chatRoom)
    } catch (e) {
        res.status(500).send("Something went wrong while getting document");
    }
}

const showAllStudents = async function(req, res) {
    var students = []
    try {
        students = await ClassRoom.findOne({ name: req.body.name })
        res.send(students.students)
    } catch (e) {
        res.status(500).send("somthing went wrong")
    }
}

const searchClassRoom = async function(req, res) {
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

const loadSearch = async function(req, res) {
    try {
        const developer = req.manager
        res.render('ManagerSearch', { developer })
    } catch (e) {
        res.status(500).send("Something went wrong while loading page")
    }
}

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

const Profile = async function(req, res) {
    const developer = req.manager
    res.render('ManagerProfile', {
        developer
    })
}



const loadHome = async function(req, res) {
    var chatRooms = Object.keys(req.manager.chatRooms)

    const documents = await Documents.find({ chatRoomId: { $in: chatRooms } }).populate('managerId', 'name email age').populate('developerId', 'name email age')
    res.send(documents)
}



module.exports = {
    Register: Register,
    Login: Login,
    Profile: Profile,
    Logout: Logout,
    UpdateProfile: UpdateProfile,
    uploadDocument,
    Upload,
    showAllStudents,
    showHomePage,
    getDocument,
    searchClassRoom,
    loadSearch,
    loadHome,
}