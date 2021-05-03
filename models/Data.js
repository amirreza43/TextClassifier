const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DataSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    gibberish: [{
        text: {
            type: String
        },
        prediction:{
            type: String
        },
        accuracy: {
            type: String
        }
    }],
    real:[{
        text: {
            type: String
        },
        prediction:{
            type: String
        },
        accuracy: {
            type: String
        }
    }],
    bot:[{
        text: {
            type: String
        },
        prediction:{
            type: String
        },
        accuracy: {
            type: String
        }
    }],
    link:{
        type: String
    },
    labelData:{
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Data = mongoose.model('data', DataSchema);