const jwt = require('jsonwebtoken');
const Developer = require('../models/developer');
const Manager = require('../models/manager')

//This is a auth function for developer
const developerAuth = async(req, res, next) => {
    try {
        const token = req.cookies.access_token
        const decoded = jwt.verify(token, 'thisismynewtoken');
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

//This is a auth function for manager
const managerAuth = async(req, res, next) => {
    try {

        const token = req.cookies.access_token
        const decoded = jwt.verify(token, 'thisismynewtoken');
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
    managerAuth
}