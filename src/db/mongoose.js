const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/class-room-api', {
    useNewUrlParser: true,
    useCreateIndex: true
})