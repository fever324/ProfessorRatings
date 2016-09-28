var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../models/User.js');
/* POST /login  */
router.post('/', function(req, res, next) {
  if (req.body.email == null ||req.body.email.trim() == "") {
    respond(res, false, "No email address provided");
    return;
  }

  if (req.body.password == null || req.body.password.trim() == "") {
    respond(res, false, "Empty password");
    return;
  }

  User.find({email: req.body.email}, (err, users) => {
    if (err) {
      respond(res, false, "No user with that email found");
      return;
    }
    if (users.length == 0) {
      respond(res, false, "No user with that email found");
      return;
    }
    if (users.length != 1) {
      respond(res, false, "Something wrong happend on the server. \nPlease contact the team");
      return;
    }
    if (req.body.password !== users[0].password) {
      respond(res, false, "Wrong password");
      return;
    }
    respond(res, true, "Log in successful");
  });

  function respond(res, isSuccessful, message) {
    res.json({
      success: isSuccessful,
      message: message
    });
  }
});
module.exports = router;