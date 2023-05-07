const Developer = require('../models/developer')
const UploadDocuments = require('../models/documents')
const multer = require('multer');

const ClassRoom = require('../models/chatRoom')

const Document = require('../models/documents')
const path = require('path')


// The Register function is used to register a new developer. It creates a new instance of the Developer model, saves it to the database using await developer.save(), generates an authentication token using await developer.generateAuthToken(), sets the token in a cookie using res.cookie('access_token', token), and sends the response as an object containing the developer and a redirect URL to the home page.

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

// The Login function is used to log in an existing developer. It calls the findByCredentials method of the Developer model to find the developer with the given email and password. If found, it generates an authentication token using the await developer.generateAuthToken(), sets the token in a cookie using res.cookie('access_token', token), and sends the response as an object containing the developer and a redirect URL to the home page.

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

// The showHomePage function is used to render the home page of the logged-in developer. It gets the current developer using req.developer, passes it to the res.render method along with the name of the EJS view to be rendered.

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

// The Profile function is used to render the profile page of the logged-in developer. It gets the current developer using req.developer, passes it to the res.render method along with the name of the EJS view to be rendered.

const Profile = async function(req, res) {
    const developer = req.developer
    res.render('UserProfile', {
        developer,
    })
}


// The Logout function is used to log out the current developer by removing the authentication token from the tokens array of the Developer model. It gets the current developer using req.developer, filters out the token to be removed using req.token, and saves the updated developer to the database using await req.developer.save(). Finally, it renders the login page.

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


// The UpdateProfile function is used to update the profile of the current developer. It checks if the update operation is valid by checking if the keys in the req.body object are allowed. If the update operation is valid, it updates the current developer using req.developer[update] = req.body[update] and saves the updated developer to the database using await req.developer.save(). Finally, it sends the response as an object containing the developer and a redirect URL to the profile page.

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


// The DeleteProfile function is used to delete the profile of the current developer. It removes the developer from the database using await req.developer.remove() and removes the developer's ID from the following and follower objects of other developers using await Developer.updateMany(). Finally, it sends the response as the deleted 

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

//This function is used to upload the file to DB

var storage = multer.diskStorage({
    destination: './public/images/',
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
})

const Upload = multer({ storage: storage })

// This function is used to upload the documents

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

// This function is used to get the documents
const getDocument = async function(req, res) {
    try {
        var chatRoom = []
        chatRoom = await Document.find({ developerId: req.developer._id })
        res.send(chatRoom)
    } catch (e) {
        res.status(500).send("somthing went wrong while getting document");
    }
}


// This function is used to follow the chat room

const chatRoomFollow = async function(req, res) {
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

// This function is used to search the chat room

const searchChatRoom = async function(req, res) {
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

// This function is used to load the search details

const loadSearch = async function(req, res) {
    try {
        const developer = req.developer

        res.render('UserSearch', { developer })
    } catch (e) {
        res.status(500).send("somthing went wrong while loading page")
    }
}

// This function is used to load the class details

const loadClassDetails = async function(req, res) {
    try {
        const developer = req.developer

        res.render('UserClassDetails', { developer })
    } catch (e) {
        res.status(500).send("somthing went wrong while loading page")
    }
}

// This function is used to load the chat room

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

// This function is used to load the home page
const loadHome = async function(req, res) {
   
    var chatRooms = Object.keys(req.developer.following)

    const documents = await Document.find({ chatRoomId: { $in: chatRooms } }).populate('managerId', 'name email age').populate('developerId', 'name email age')
    documents.forEach(element => {
        if (element.managerId) {
            element.populate('managerId', 'name email age').execPopulate()
        } else {
            element.populate('developerId', 'name email age').execPopulate()
        }
    });
    res.send(documents)
}

module.exports = {
    Register,
    Login,
    showHomePage,
    Profile: Profile,
    Logout: Logout,
    searchChatRoom,
    UpdateProfile: UpdateProfile,
    DeleteProfile: DeleteProfile,
    Upload,
    UploadDocument,
    loadSearch,
    getDocument,
    loadClassDetails,
    loadClassRoom,
    chatRoomFollow,
    loadHome,
}