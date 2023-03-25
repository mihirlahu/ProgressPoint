const manager = require('../models/manager')

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

module.exports = {
    Register: Register,
    Login: Login,
}