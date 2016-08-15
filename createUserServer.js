require('dotenv').config();
var jwt = require('jwt-simple');

var request = require('request');

// Encode a user dummy with the token secret
var user = {
  userLevel: "Chair"
}

var token = jwt.encode(user, process.env.TOKEN_SECRET);

function dispatchRequest (user) {
  var options = { method: 'POST',
    url: process.env.SERVER_URI + '/api/users/create',
    headers: 
     { 'x-access-token': token,
       'content-type': 'application/json' },
    body: user,
    json: true };

  request(options, function (error, response, body) {
    if (error) console.log(user);
  });

}

// TODO: CSV parser here to read whatever format provided.
//       instead of supplying a static object


var result = [
  { 
    firstName: 'Omar',
    lastName: 'Shaikh',
    userLevel: 'Delegate',
    committee: 'General Assembly',
    school: 'Dhahran High School',
    email: 'shaik.o.418@isg.edu.sa' 
  }
  // ,

  // { 
  //   firstName: 'Shan',
  //   lastName: 'Rizvi',
  //   userLevel: 'Delegate',
  //   committee: 'Security Council',
  //   school: 'Dhahran High School',
  //   email: 'rizvi.s.418@isg.edu.sa' 
  // }

]

result.forEach(function(user){
  dispatchRequest(user);
});


