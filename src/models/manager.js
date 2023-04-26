const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Tasks = require('./chatRoom')

const managerSchema = new mongoose.Schema({
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
    chatRoomCreatedCount: {
        type: Number,
        default: 0
    },
    chatRoomFollowedCount: {
        type: Number,
        default: 0
    },
    chatRooms: {
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

managerSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

managerSchema.virtual('documentData', {
    ref: 'DocumentData',
    localField: '_id',
    foreignField: 'owner'
})


managerSchema.methods.generateAuthToken = async function() {

    const token = jwt.sign({ _id: this._id }, 'thisismynewtoken');

    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
}

managerSchema.methods.toJSON = function() {
    const managerObject = this.toObject();

    delete managerObject.password;
    delete managerObject.tokens;
    delete managerObject.avatar;

    return managerObject
}
managerSchema.statics.findByCredentials = async(email, password) => {
    const manager = await Manager.findOne({ email });

    if (!manager) {
        throw new Error('unable to login');
    }

    const isMatch = await bcrypt.compare(password, manager.password)

    if (!isMatch) {
        throw new Error('unable to login');
    }
    return manager
}

managerSchema.pre('save', async function(next) {

    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next()
})

managerSchema.pre('remove', async function(next) {

    await Tasks.deleteMany({ owner: this._id })
    next();
})

const Manager = mongoose.model('Manager', managerSchema)

module.exports = Manager;