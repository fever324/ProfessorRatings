"use strict";
var express = require('express');
var router = express.Router();
var async = require('async');
var mongoose = require('mongoose');
var Review = require('../models/Review.js');
var Course = require('../models/Course.js');
var Professor = require('../models/Professor.js');
var Like = require('../models/Like.js');

 /* GET /reviews*/
router.get('/', function(req, res, next) {

/* GET /reviews?course_id=x&user_id=XX*/
 if (req.query.course_id && req.query.user_id) {
    async.waterfall([
    function(next) {
        Review.find({course: req.query.course_id})
        .populate('user', 'major year -_id')
        .exec(function(err, reviews){
          for (var i = 0; i < reviews.length; i++) {
            reviews[i] = reviews[i].toObject();
            if (!reviews[i].show_year) delete reviews[i].user.year;
            if (!reviews[i].show_major) delete reviews[i].user.major;
          }
          next(err, reviews);
        });
    },
    function(reviews, next) {
      return getWhetherUserLikedThisReviewRecursion(reviews, 0, res, req.query.user_id);
    }
    ], function (err) {
       if (err) {
          res.json({'success':false, 'message': 'Unable to give GET Course with ID' + req.query.course_id, 'err': err});
          return;
       }
    });
    return;
  }

  /* GET /reviews?course_id=x*/
  if (req.query.course_id) {
    Review.find({course: req.query.course_id })
    .populate('user', 'major year -_id')
    .exec(function(err, revs){
        for (var i = 0; i < revs.length; i++) {
          revs[i] = revs[i].toObject();
          if (!revs[i].show_year) delete revs[i].user.year;
          if (!revs[i].show_major) delete revs[i].user.major;
        }
        res.json(revs);
    });
    return;
  }

    /* GET /reviews?user_id=x*/
  if (req.query.user_id) {
    Review.find({user: req.query.user_id })
    .exec(function(err, revs){
        res.json(revs);
    });
    return;
  }

  //res.send("404", "No such page")
  Review.find()
  .populate('user', 'major year -_id')
  .exec(function (err, reviews) {
    if (err) return next(err);
    for (var i = 0; i < reviews.length; i++) {
      reviews[i] = reviews[i].toObject();
      if (!reviews[i].show_year) delete reviews[i].user.year;
      if (!reviews[i].show_major) delete reviews[i].user.major;
    }
    res.json(reviews);
  });
});


function getWhetherUserLikedThisReviewRecursion(reviews, i, res, user_id) {
    if (i >= reviews.length) {
      res.json(reviews);
      return;
    }
    Like.findOne({review_id: reviews[i]._id.toString(), user_id: user_id}, function(err, likes) {
      if (err != null || likes == null) {
        reviews[i]['liked'] = 0;
      } 
      else if (likes.like == 1) {
        reviews[i]['liked'] = 1;
      } else {
        reviews[i]['liked'] = -1;
      }
      return getWhetherUserLikedThisReviewRecursion(reviews, i+1, res);
    })
}

/* POST /reviews */
router.post('/', function(req, res, next) {
  async.waterfall([
    async.constant(req.body),
    function(params, next) {
      var review = new Review(params)
      review.save(function(err){
        if(err) {
          res.json({
            success: false,
            message: 'Unable to create review'
          })
          return;
        }
        next(null, params);
      })
    },
    function(params, next) {
      Course.findOne({'_id':params.course}, function(err, course){
        if(err || course == null) {
          res.json({
            success: false,
            message: 'No course found'
          })
          return;
        }
        var cnt = course.number_of_reviews + 1;
        var avg = (course.number_of_reviews * course.average_review + params.rating) / cnt;
        var workload1 = (course.number_of_reviews * course.workload + params.workload) / cnt;
        var grading1 = (course.number_of_reviews * course.grading + params.grading) / cnt;

        var workload = course.workload_count[params.workload - 1];
        course.workload_count.set(params.workload - 1, workload+1);
        var quality = course.quality_count[params.rating - 1];
        course.quality_count.set(params.rating - 1, quality+1);
        var grading = course.grading_count[params.grading - 1];
        course.grading_count.set(params.grading - 1, grading+1);

        course.number_of_reviews = cnt;
        course.average_review = avg;
        course.workload = workload1;
        course.grading = grading1;
        params.course = course;
        next(null, params);
      })
    },
    function(params) {
      params.course.save(function(err, updatedCourse) {
        if(err) {
          res.json({
              success: false,
              message: 'Unable to update course reviews'
          })
        } else {
          res.json({
              success: true,
              message: 'Review submitted successfully'
          })
        }
      })
    }
  ])
});


/* GET /reviews/id */
router.get('/:id', function(req, res, next) {
  Review.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /reviews/:id */
router.put('/:id', function(req, res, next) {
  Review.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json({success: true});
  });
});

/* DELETE /reviews/:id */
router.delete('/:id', function(req, res, next) {
  Review.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json({success: true});
  });
});

module.exports = router;

