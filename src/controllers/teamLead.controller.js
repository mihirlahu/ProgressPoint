const Teacher = require('../models/teacher')

const Register = async function(req, res) {
    const teacher = new Teacher(req.body);
    try {
        await teacher.save();
        const token = await teacher.generateAuthToken();
        res.cookie('access_token', token)
        res.send({ teacher, redirect: '/teacher/home' })
    } catch (e) {
        res.status(400).send(e);
    }
}

const Login = async function(req, res) {
    try {
        const teacher = await Teacher.findByCredentials(req.body.email, req.body.password);
        const token = await teacher.generateAuthToken();
        res.cookie('access_token', token)
        res.send({ teacher, redirect: '/teacher/home' })
    } catch (e) {
        res.status(400).send(e)
    }
}

module.exports = {
    Register: Register,
    Login: Login,
}