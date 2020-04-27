const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Show = new Schema({ 
    name : String, 
    genres : [String]
});


module.exports = mongoose.model('Show', Show);