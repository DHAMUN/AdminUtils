
require('dotenv').config();

var api_key = process.env.MAILGUN_KEY;
var domain = process.env.MAILGUN_DOMAIN;
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

var mongoose = require('mongoose');
var Users = require('./models/userModel.js');

mongoose.connect(process.env.MONGODB_URI2);

var sendVerficationMessages = function() {

  Users.find({hashVerified: false}, function(err, users){
    users.forEach(function(user){
      var data = {
        from: 'DHAMUN <no-reply@dhamun.com>',
        to: user.email,
        subject: 'Account Creation'
      };

      var text = "Hello + " + user.firstName + "\n\n";
      text += "We've noticed that you've signed up for an MUN account. Here is your validation link\n";
      text += "http://dhamun.com/#/home/signup/" + user.hashCode + "/\n\n";
      text += "This link will take you to a signup page, where you will create a DHAMUN password\n";
      text += "Then, you can sign in with the newly created password. Use this account to view your committee, your partner, your country, submit your resolution, and a whole lot more.\n"
      text += "If you have no idea what this email is, ignore it :)\n\n";
      text += "Thank you,\n";
      text += "The DHAMUN Team"

      data.text = text;
      
      mailgun.messages().send(data, function (error, body) {
        console.log(body);
      });
    })

  });
}

sendVerficationMessages();
