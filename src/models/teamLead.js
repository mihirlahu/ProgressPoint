const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validator(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Value of email is incorrect');
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0)
                throw new Error('Age should be positive');
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('password cannot contain "Password"')
            }
        }
    },
    userType: {
        type: String,
        required: true
    },
    classRoomCreatedCount: {
        type: Number,
        default: 0
    },
    classRoomFollowedCount: {
        type: Number,
        default: 0
    },
    classRooms: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})


teacherSchema.methods.generateAuthToken = async function() {

    const token = jwt.sign({ _id: this._id }, 'thisismynewtoken');

    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
}

teacherSchema.methods.toJSON = function() {
    const teacherObject = this.toObject();

    delete teacherObject.password;
    delete teacherObject.tokens;
    delete teacherObject.avatar;

    return teacherObject
}

const Manager = mongoose.model('Manager', teacherSchema)

module.exports = Manager;