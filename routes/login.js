var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
import {secret} from '../utils/config.js'
import passwordHash from 'password-hash';


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
    if (!passwordHash.verify(req.body.password, users[0].password)) {
      respond(res, false, "Wrong password");
      return;
    }
    var token = jwt.sign(users[0], secret, {
      expiresIn: '1d'  // expires in 24 hours
    });

    // return the information including token as JSON
    res.json({
      success: true,
      message: 'Enjoy your token!',
      token: token,
      user_id: users[0]._id
    });
  });

  function respond(res, isSuccessful, message) {
    res.json({
      success: isSuccessful,
      message: message
    });
  }
});
module.exports = router;
