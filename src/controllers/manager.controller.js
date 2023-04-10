const Manager = require('../models/manager')
const UploadDocuments = require('../models/documents')
const multer = require('multer');

const path = require('path')

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

const Profile = async function(req, res) {
   const developer = req.manager
   res.render('managerProfile', {
       developer
   })
}

module.exports = {
   Profile: Profile,
   Logout: Logout,
   UpdateProfile: UpdateProfile,
}
