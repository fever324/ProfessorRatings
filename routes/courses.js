var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Course = require('../models/Course.js');

/* GET /courses listing. */
router.get('/', function(req, res, next) {
  if (req.query.courseID) {
    Course.findOne({_id:req.query.courseID}, function(err, course){
      //console.log(course);
      res.json(course);
    });
    return;
  }
  Course.find(function (err, courses) {
    if (err) return next(err);
    res.json(courses);
  });
});

/* POST /courses */
router.post('/', function(req, res, next) {
  Course.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET /courses/id */
router.get('/:id', function(req, res, next) {
  Course.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /courses/:id */
router.put('/:id', function(req, res, next) {
  Course.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE /courses/:id */
router.delete('/:id', function(req, res, next) {
  Course.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
