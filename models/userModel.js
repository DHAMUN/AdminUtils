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

  username: {
    type: String,
    unique: true,
    sparse: true
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
  
  userLevel: {
    type: String,
    required: true
  },

  committee: {
    type: String,
    required: true
  }

});


UserSchema.methods.compareCodes = function (candidateCode) {
  var savedPassword = this.hashCode;
  return this.hashCode === candidateCode;
};

module.exports = mongoose.model('users', UserSchema);
