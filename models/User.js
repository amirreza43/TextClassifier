const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    link:[{
        text: {
            type: String
        },
        name:{
            type: String
        }
    }]
    
});

module.exports = User = mongoose.model('user', UserSchema);