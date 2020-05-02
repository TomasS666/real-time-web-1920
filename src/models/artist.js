const mongoose = require('mongoose');
// const Band = require('../band.js');
const Schema = mongoose.Schema;

const User = require('./User_BASE')

// const Show = require('./show');

const Artist = User.discriminator('Artist', new mongoose.Schema({
    artistName: String,
    shows: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show'
    }],
    genres: [String]
  })
)


module.exports = mongoose.model('Artist');