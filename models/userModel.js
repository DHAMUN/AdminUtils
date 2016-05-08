var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({

  hashCode: {
    type: String,
    unique: true
  },

  hashVerified: {
    type: Boolean,
    default: false
  },

  email: {
    type: String,
    unique: true
  },

  password: {
    type: String
  },

  firstName: {
    type: String,
    required: true
  },

  lastName: {
    type: String,
    required: true    
  },

  school: {
    type: String,
    required: true
  },

  country: {
    type: String,
    required: false
  },
  
  userLevel: {
    type: String,
    required: true
  },

  committee: {
    type: String,
    required: false
  }

});

module.exports = mongoose.model('users', UserSchema);
