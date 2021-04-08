const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const directorySchema = new Schema({
    name:{
        type: String,
        required: true
    }, 
}, {timestamps: true});

const Directory = mongoose.model('Directory', directorySchema);
module.exports = Directory;