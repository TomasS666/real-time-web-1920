const mongoose = require('mongoose');
// const Band = require('../band.js');
const Schema = mongoose.Schema;

const artist = new Schema({
    firstName: {type:String, required: true},
    lastName: {type:String, required: true},
    userName: {type:String, required: true, unique: true},
    password: {type:String, required: true},
  });


module.exports = mongoose.model('Artist', artist);