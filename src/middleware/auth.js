const jwt = require('jsonwebtoken');
const Teacher = require('../models/teamLead');
const User = require('../models/user');

const userAuth = async(req, res, next) => {
    try {
        const token = req.cookies.access_token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
        if (!user) {
            throw new Error()
        }
        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        res.status(401).send({ error: 'please authenticate' });
    }
}

const teacherAuth = async(req, res, next) => {
    try {

        const token = req.cookies.access_token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const teacher = await Teacher.findOne({ _id: decoded._id, 'tokens.token': token });
        if (!teacher) {
            throw new Error()
        }
        req.token = token;
        req.teacher = teacher;
        next();
    } catch (e) {
        res.status(401).send({ error: 'please authenticate' });
    }
}

module.exports = {
    userAuth,
    teacherAuth
}