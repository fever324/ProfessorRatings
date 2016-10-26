"use strict";
var express = require('express');
var router = express.Router();
var async = require('async')

var mongoose = require('mongoose');
var Review = require('../models/Review.js');
var Course = require('../models/Course.js');
var Professor = require('../models/Professor.js');

/* GET /reviews?course_id=x. */
router.get('/', function(req, res, next) {
  if (req.query.courseID) {
    Course.find({_id:req.query.courseID}, function(err, courses){
      Review.find({course: courses[0]._id }, function(err, revs){
        res.json(revs);
      });
    });
    return;
  }
  // //res.send("404", "No such page")
  // Review.find(function (err, reviews) {
  //   if (err) return next(err);
  //   res.json(reviews);
  // });
  res.send("404", "No such page")
});

/* POST /reviews */
router.post('/', function(req, res, next) {
  async.waterfall([
    async.constant(req.body),
    function(params, next) {
      Course.findOne({'_id':params.course_id}, function(err, course){
        if(err || course == null) {
          res.json({
            success: false,
            message: 'No course found'
          })
          return
        }
        var cnt = course.number_of_reviews + 1;
        var avg = (course.number_of_reviews * course.average_review + params.rating) / cnt;
        var quality1 = (course.number_of_reviews * course.quality + params.quality) / cnt;
        var workload1 = (course.number_of_reviews * course.workload + params.workload) / cnt;
        var grading1 = (course.number_of_reviews * course.grading + params.grading) / cnt;
        var workload_count1 = course.workload_count;
        workload_count1[params.workload - 1] += 1;
        var quality_count1 = course.quality_count;
        quality_count1[params.quality - 1] += 1;
        var grading_count1 = course.grading_count;
        grading_count1[params.grading - 1] += 1;
        params.course = course

        next(null, params)
      })
    },
    function(params, next) {
      var review = new Review(params)
      review.save(function(err){
        if(err) {
          res.json({
            success: false,
            message: 'Unable to create review'
          })
          return
        }
        next(null, params)
      })
    },
    function(params) {
      console.log("123123")
      params.course.save(function(err) {
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
    res.json(post);
  });
});

/* DELETE /reviews/:id */
router.delete('/:id', function(req, res, next) {
  Review.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;

