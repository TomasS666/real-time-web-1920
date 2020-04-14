const mongoose = require('mongoose');
// const Band = require('../band.js');
const Schema = mongoose.Schema;

const msgSchema = new Schema({ name : String, message : String});


module.exports = mongoose.model('Message', msgSchema);