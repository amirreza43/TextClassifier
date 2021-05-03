const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UniversalDataSchema = new Schema({
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
    }]
});

module.exports = UniversalData = mongoose.model('universalData', UniversalDataSchema);