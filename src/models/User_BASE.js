// Base user Mongooose User Schema for Artist and Visitors to inherit
const mongoose = require('mongoose');

// Reference: https://dev.to/helenasometimes/getting-started-with-mongoose-discriminators-in-expressjs--22m9


const baseOptions = {
    discriminatorKey: 'userrole', // our discriminator key, could be anything
    collection: 'users', // the name of our collection
  };


  const User = mongoose.model('User', new mongoose.Schema({
    firstName: {type:String, required: true},
    lastName: {type:String, required: true},
    userName: {type:String, required: true, unique: true},
    password: {type:String, required: true},
  }, baseOptions,
    ),
  );
  
  module.exports = mongoose.model('User');