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
        message: 'User id has existed.'
      })
      return; 
    }
    Review.findOne(post.review_id, function(err, review){
      var like_count1 = review.like_count;
      var dislike_count1 = review.dislike_count;
      if (post.like == 1) like_count1 += 1;
      else dislike_count1 += 1;
      //console.log(like_count1); 
      //console.log(dislike_count1); 
      review.like_count = like_count1;
      review.dislike_count = dislike_count1;
      review.save()       
    });
    res.json({success: true});
  });
});
module.exports = router;