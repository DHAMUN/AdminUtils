require('dotenv').config();
var jwt = require('jwt-simple');
var parse = require('csv-parse');
var request = require('request');
var fs = require("fs");

// Encode a user dummy with the token secret
var user = {
  userLevel: "Chair"
}

var token = jwt.encode(user, process.env.TOKEN_SECRET);
console.log(jwt.decode(token, process.env.TOKEN_SECRET));

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
    else console.log("Created Account");
  });

}

// TODO: CSV parser here to read whatever format provided.
//       instead of supplying a static object

fs.readFile('users.csv', 'utf8', (err, data) => {
  parse(data, function(err, rows) {
    var userTable = [];
    var keys = rows[0];
    for (var i = 1; i < rows.length; i++) {
      var userResult = {};
      rows[i].forEach((value, index) => {
        userResult[keys[index]] = value;
      });
      userTable.push(userResult);
    }
    console.log(userTable);
    userTable.forEach(function(user){
      dispatchRequest(user);
    });
  })
})






