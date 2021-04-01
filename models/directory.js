const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const directorySchema = new Schema({
    name:{
        type: String,
        required: true
    },
    // top_dir:{
    //     type: String,
    //     required: false
    // },
});

const Directory = mongoose.model('Directory', directorySchema);

module.exports = Directory;