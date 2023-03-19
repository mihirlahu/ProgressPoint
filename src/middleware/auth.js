const jwt = require('jsonwebtoken');
const Teacher = require('../models/teacher')

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
    teacherAuth
}