var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Review = require('../models/Review.js');
var Course = require('../models/Course.js');
var Like = require('../models/Like.js');
var Professor = require('../models/Professor.js');

/* POST /likes */
router.post('/', function(req, res, next) {
  Like.create(req.body, function (err, post) {
    if (err) {
        res.json({
        success: false,
        message: 'User has already liked or disliked this review.'
      })
      return; 
    }
    Review.findById(req.body.review_id, function(err, review){
      var like_count1 = review.like_count;
      var dislike_count1 = review.dislike_count;
      if (req.body.like == 1) like_count1 += 1;
      else dislike_count1 += 1;
      review.like_count = like_count1;
      review.dislike_count = dislike_count1;
      review.save(function(err){
        if(err == null) {        
          res.json({success: true});
        } else {
          res.json({success: false});
        }
      });
    });
  });
});
module.exports = router;