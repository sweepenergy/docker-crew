const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// schema -> model -> collection

const streamSchema = new Schema({
    var_name: String,
    display_name: String,
    description: String,
    units: String,
    type: String
}, {timestamps: true});

// so we can use directory throughout the project
const Stream = mongoose.model("Stream", streamSchema);
module.exports = Stream;