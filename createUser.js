var mongoose    = require('mongoose');

mongoose.connect('mongodb://localhost'); // connect to mongo database


var User        = require('./models/userModel.js');
var Q           = require('q');
var readline    = require('readline');

var printInfo = function() {
  console.log();
  console.log("This utility creates users in DHAMUN");
  console.log("Enter -1 for a persons first name to halt the program");
  console.log();
}

printInfo();

var makeid = function()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var genId = function(cb) {
  var findOne = Q.nbind(User.findOne, User);
  var randomHash = makeid();
  // check to see if user already exists
  findOne({hashCode: randomHash})
    .then(function(user) {
      if (user) {
        genId(cb);
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
      school = data.school;

  genId(function(newId){

    create = Q.nbind(User.create, User);
    newUser = {
      hashCode: newId,
      firstName: firstName,
      lastName: lastName,
      userLevel: userLevel,
      committee: committee,
      school: school
    };
    console.log();
    console.log("Saving the following model: ");
    console.log(newUser);
    console.log();
    create(newUser).then(function(user){
      cb(false)
    })
    .fail(function(error){
      console.log(error);
      cb(true);
    });

  })

}

// Callback hell. TODO: use promises or anything please.
var askInformation = function(cb) {
  var that = this;
  var finalAnswers = {};
  rl.question('What is the persons first name? ', function(firstName) {
    if (firstName === "-1") {
      cb(false);
      return;
    }
    finalAnswers.firstName = firstName.trim();
    rl.question('What is the persons last name? ', function(lastName){
      finalAnswers.lastName = lastName.trim();
      rl.question('What is the persons userLevel? (1=delegate, 2=chair): ', function(userLevel){
        var level = parseInt(userLevel);
        var levels = {
          1: "Delegate",
          2: "Chair"
        }

        finalAnswers.userLevel = levels[level];

        rl.question('What delegation do they belong in? (1=security council, 2=general assembly, 3=...): ', function(delegation){
          var delegations = {
            1: "Security Council",
            2: "General Assembly",
          }

          finalAnswers.committee = delegations[parseInt(delegation)];

          rl.question("What school are they coming from (1=dhs, 2=bahrain): ", function(school){
            var schools = {
              1: "Dhahran High School"
            }

            finalAnswers.school = schools[parseInt(school)];

            cb(finalAnswers);
          });
        })

      })
    })
  })
}

var recurseAdd = function () {
  askInformation(function(answers){
    if (answers) {
      signup(answers, function(err){
        if (err) {
          console.log("Something went wrong. Record the persons info and report to an admin");
          process.exit();
        }
        console.log();
        recurseAdd();
      })
    } else {
      process.exit();
    }
  })
}

recurseAdd();



