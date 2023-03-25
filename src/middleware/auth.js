const jwt = require('jsonwebtoken');
const Manager = require('../models/Manager');
const Developer = require('../models/developer');

const developerAuth = async(req, res, next) => {
    try {
        const token = req.cookies.access_token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const developer = await Developer.findOne({ _id: decoded._id, 'tokens.token': token });
        if (!developer) {
            throw new Error()
        }
        req.token = token;
        req.developer = developer;
        next();
    } catch (e) {
        res.status(401).send({ error: 'please authenticate' });
    }
}

const teacherAuth = async(req, res, next) => {
    try {

        const token = req.cookies.access_token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const manager = await Manager.findOne({ _id: decoded._id, 'tokens.token': token });
        if (!manager) {
            throw new Error()
        }
        req.token = token;
        req.manager = manager;
        next();
    } catch (e) {
        res.status(401).send({ error: 'please authenticate' });
    }
}

module.exports = {
    developerAuth,
    teacherAuth
}