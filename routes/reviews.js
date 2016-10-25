var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Review = require('../models/Review.js');
var Course = require('../models/Course.js');
var Professor = require('../models/Professor.js');

/* GET /reviews?course_id=x. */
router.get('/', function(req, res, next) {
  if (req.query.course_id) {
    Course.findOne({number: req.query.course_id }, function(err, course){
      Review.find({course_id: course.number }, function(err, revs){
        //console.log(revs);
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
  Review.create(req.body, function (err, post) {
    if (err) return next(err);
    //caculate course's reviews
    console.log(req.params);
    if(post.course_id == null) {
      res.json({
        success: false,
        message: 'No course object Id provided'
      })
      return; 
    }
    Course.find(post.course_id, function(err, course){
      var cnt = course.number_of_reviews + 1;
      var avg = (course.number_of_reviews * course.average_review + post.rating) / cnt;
      var quality1 = (course.number_of_reviews * course.quality + post.quality) / cnt;
      var workload1 = (course.number_of_reviews * course.workload + post.workload) / cnt;
      var grading1 = (course.number_of_reviews * course.grading + post.grading) / cnt;
      var workload_count1 = course.workload_count;
      workload_count1[post.workload - 1] += 1;
      var quality_count1 = course.quality_count;
      quality_count1[post.quality - 1] += 1;
      var grading_count1 = course.grading_count;
      grading_count1[post.grading - 1] += 1;            
      Course.update(post.course_id, {
        number_of_reviews : cnt,
        average_review : avg,
        quality : quality1,
        workload : workload1,
        grading : grading1,
        workload_count : workload_count1,
        quality_count : quality_count1,
        grading_count : grading_count1
      }, function(err, resp) {
        console.log(resp);
      });
    });
    res.json(post);
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

