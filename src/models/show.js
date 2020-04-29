const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Artist = require('../models/artist.js')

const Show = new Schema({ 
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist'
    },
    name : String, 
    genres : [String]
});


module.exports = mongoose.model('Show', Show);