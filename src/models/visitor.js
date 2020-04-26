const mongoose = require('mongoose');
// const Band = require('../band.js');
const Schema = mongoose.Schema;

const User = require('./User_BASE')

const Show = require('./show');

const Visitor = User.discriminator('Visitor', new mongoose.Schema({
  shows: {
      visited: [Show],
      upcoming: {
          type: Array, 
          required: false
        },
  }
}))


module.exports = mongoose.model('Visitor');