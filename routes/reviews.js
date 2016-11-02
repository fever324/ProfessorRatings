var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Review = require('../models/Review.js');
var Course = require('../models/Course.js');
var Professor = require('../models/Professor.js');

/* GET /reviews?course_id=x. */
router.get('/', function(req, res, next) {
  if (req.query.course_id) {
    Course.findById(req.query.course_id, function(err, course){
      Review.find({course: course._id }, function(err, revs){
        res.json(revs);
      });
    });
    return;
  }
  //res.send("404", "No such page")
  Review.find(function (err, reviews) {
    if (err) return next(err);
    res.json(reviews);
  });
});

/* POST /reviews */
router.post('/', function(req, res, next) {
  Review.create(req.body, function (err, review) {
    if (err) return next(err);
    if(review.course == null) {
      res.json({
        success: false,
        message: 'No course object Id provided'
      })
      return; 
    }
    //caculate course's reviews
    Course.findOne(review.course, function(err, course){
      var cnt = course.number_of_reviews + 1;
      var avg = (course.number_of_reviews * course.average_review + review.rating) / cnt;
      var quality1 = (course.number_of_reviews * course.quality + review.quality) / cnt;
      var workload1 = (course.number_of_reviews * course.workload + review.workload) / cnt;
      var grading1 = (course.number_of_reviews * course.grading + review.grading) / cnt;
      var workload_count1 = course.workload_count;
      workload_count1[review.workload - 1] += 1;
      var quality_count1 = course.quality_count;
      quality_count1[review.quality - 1] += 1;
      var grading_count1 = course.grading_count;
      grading_count1[review.grading - 1] += 1;            
      Course.update(review.course, {
        number_of_reviews : cnt,
        average_review : avg,
        quality : quality1,
        workload : workload1,
        grading : grading1,
        workload_count : workload_count1,
        quality_count : quality_count1,
        grading_count : grading_count1
      }, function(err, resp) {
        //console.log(resp);
      });
    });
    res.json(review);
  });
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

