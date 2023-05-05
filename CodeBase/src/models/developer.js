const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Tasks = require('./chatRoom')
const DocumentData = require('./documents')

const developerSchema = new mongoose.Schema({
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
        minlength: 5,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('password cannot contain "Password"')
            }
        }
    },
    chatRoomCount: {
        type: Number,
        default: 0
    },
    userType: {
        type: String,
        required: true
    },
    following: {
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

developerSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

developerSchema.virtual('documentData', {
    ref: 'DocumentData',
    localField: '_id',
    foreignField: 'owner'
})

developerSchema.methods.generateAuthToken = async function() {

    const token = jwt.sign({ _id: this._id }, 'thisismynewtoken');

    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
}

developerSchema.methods.toJSON = function() {
    const userObject = this.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject
}
developerSchema.statics.findByCredentials = async(email, password) => {
    const developer = await Developer.findOne({ email });

    if (!developer) {
        throw new Error('unable to login');
    }

    const isMatch = await bcrypt.compare(password, developer.password)

    if (!isMatch) {
        throw new Error('unable to login');
    }
    return developer
}

developerSchema.pre('save', async function(next) {

    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next()
})

developerSchema.pre('remove', async function(next) {

    await Tasks.deleteMany({ owner: this._id })
    next();
})

const Developer = mongoose.model('Developer', developerSchema)

module.exports = Developer;