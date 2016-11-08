var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Course = require('../models/Course.js');
var Like = require('../models/Like.js');
var Professor = require('../models/Professor.js');
var Suggestion = require('../models/Suggestion.js');
var Upvote = require('../models/Upvote.js');

/* POST /upvotes */
router.post('/', function(req, res, next) {
  Upvote.create(req.body, function (err, post) {
    if (err) {
        res.json({
        success: false,
        message: 'User id has existed.'
      })
      return; 
    }
    Suggestion.findOne(post.suggestion_id, function(err, suggest){
      suggest.up_votes += 1;
      suggest.save()       
    });
    res.json({success: true});
  });
});
module.exports = router;