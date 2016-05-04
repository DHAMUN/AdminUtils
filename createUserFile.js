require('dotenv').config();

var mongoose = require('mongoose');
var fs = require("fs");
var iso3311a2 = require('iso-3166-1-alpha-2');
var User = require('./models/userModel.js');
var Q = require('q');

var HASH_SIZE = 10;

mongoose.connect(process.env.MONGODB_URI);

var makeid = function() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < HASH_SIZE; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

var genId = function(cb) {
  var findOne = Q.nbind(User.findOne, User);
  var randomHash = makeid();
  // check to see if user already exists
  findOne({hashCode: randomHash})
    .then(function(user) {
      if (user) {
        cb(randomHash, true);
      } else {
        cb(randomHash);
      }
    });
}

var signup = function (data, cb) {
  var firstName  = data.firstName,
      lastName = data.lastName,
      userLevel = data.userLevel,
      committee = data.committee,
      school = data.school,
      country = data.country,
      email = data.email

  genId(function(newId, err){

    if (err) {
      cb(true);
      return;
    }

    create = Q.nbind(User.create, User);
    newUser = {
      hashCode: newId,
      firstName: firstName,
      lastName: lastName,
      userLevel: userLevel,
      committee: committee,
      school: school,
      country: country,
      email: email
    };

    create(newUser).then(function(user){
      cb(false)
    })
    .fail(function(error){
      cb(true);
    });

  })

}

var USER_LEVEL_MAP = {
  1: "GODMODE",
  2: "Chair",
  3: "Delegate"
}

var SCHOOL_MAP = {
  1: "Dhahran High School",
}

var COMMITTEE_MAP = {
  1: "General Assembly",
  2: "Security Council"
}

// Normally not good, but since this is a utility, no problemo
var text = fs.readFileSync('usersFile.txt', 'utf8');

var userSections = text.split("\n\n");

var count = 0;

var userSectionIterator = function(userSections) {
  var element = userSections[count];
  var model = {}

  var lines = element.split("\n");

  lines.forEach(function(element, index) {
    if (index === 0) {
      model.firstName = element.trim();
    } else if (index === 1) {
      model.lastName = element.trim();
    } else if (index === 2) {
      model.school = SCHOOL_MAP[parseInt(element.trim())];
    } else if (index === 3) {
      model.committee = COMMITTEE_MAP[parseInt(element.trim())];
    } else if (index === 4) {
      model.userLevel = USER_LEVEL_MAP[parseInt(element.trim())];
    } else if (index === 5) {
      model.country = iso3311a2.getCountry(element.trim());
    } else if (index === 6) {
      model.email = element.trim();
    }

  });

  signup(model, function(err){

    if (err) {
      console.log("Failed on the following model:");
      console.log(JSON.stringify(model, null , 2));
    }

    if (count === userSections.length - 1){
      console.log("Completed saving all users.");
      process.exit();
    } 
    count++;

    userSectionIterator(userSections);
  });
};

userSectionIterator(userSections);


