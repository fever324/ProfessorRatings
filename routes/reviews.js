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
      Review.find({course_id: course._id }, function(err, revs){
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
    //caculate prof's reviews
    Professor.findOne({_id: post.prof_id }, function(err, prof){
      var cnt = prof.number_of_reviews + 1;
      var avg = (prof.number_of_reviews * prof.average_review + post.rating) / cnt;
      console.log(cnt);
      console.log(avg);
      Professor.update({_id: post.prof_id}, {
        number_of_reviews : cnt,
        average_review : avg
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

