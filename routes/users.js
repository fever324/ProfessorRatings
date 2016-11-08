  var express = require('express');
  var router = express.Router();
  var passwordHash = require('password-hash');

  var mongoose = require('mongoose');
  var User = require('../models/User.js');
  /* GET /users listing. */
  router.get('/', function(req, res, next) {
    User.find(function (err, users) {
      if (err) return next(err);
      res.json(users);
    });
  });

  /* POST /users */
  router.post('/', function(req, res, next) {
    req.body.password = passwordHash.generate(req.body.password);
    User.create(req.body, function (err, post) {
      if (err) {
        var message = err.code === 11000 // duplicate email address
          ? "Email already exist"
          : "Something wierd happened";
        res.json({
          success: false,
          message: message
        })
        return
      };
      res.json({
        success: true,
        message: "Registration Successful",
        user_id: post._id});
    });
  });

  /* GET /users/id */
  router.get('/:id', function(req, res, next) {
    User.findById(req.params.id, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  });

  /* PUT /users/:id */
  router.put('/:id', function(req, res, next) {
    User.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
      if (err) return next(err);
      res.json({success: true});
    });
  });

  /* DELETE /users/:id */
  router.delete('/:id', function(req, res, next) {
    User.findByIdAndRemove(req.params.id, req.body, function (err, post) {
      if (err) return next(err);
      res.json({success: true});
    });
  });

  module.exports = router;
