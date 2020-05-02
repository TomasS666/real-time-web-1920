const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Artist = require('../models/artist.js')

const Show = new Schema({ 
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist'
    },
    name : String, 
    genres : [String],
    timestamp: Date,
    date: Date,
    startTime: {
        type: String, 
        required: false
    },
    endTime: {
        type: String, required: true
    },
    room_id: {
        type: String, required: true
    }
});


module.exports = mongoose.model('Show', Show);