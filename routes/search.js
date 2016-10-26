var express = require('express');
var router = express.Router();
var async = require('async');
var mongoose = require('mongoose');
var Course = require('../models/Course.js');
var Professor = require('../models/Professor.js');
/* GET /search?q= */
router.get('/', function(req, res) {
  if (req.query.q) {
    var return_data = {};
    var courseResult = {};
    var profResult = {};
    async.parallel([
      function(parallel_done) {
        if (req.query.search == "professor") {
          parallel_done();
        }
        let re = new RegExp(req.query.q, "i")
        var coursePromise = Course
        .find()
        .or([{name: re},{number: re}])
        .populate("professor")
        .exec()

        coursePromise.then(function(courses){
          //if (err) return parallel_done(err);
          courseResult = courses.map(function(c){
            var result = {
              professor_name:c.professor.first_name +' ' +c.professor.last_name,
              department: c.professor.department,
              courses: [{
                course_object_id: c._id,
                course_id: c.number,
                course_name: c.name,
                course_average_review: c.average_review,
                course_number_of_reviews: c.number_of_reviews
              }]
            }
            return result;
          });
          parallel_done();
        });
      },

      function(parallel_done) {
        if (req.query.search == "course") {
          parallel_done()
        }
        var professorPromise = Professor
        .find({name: new RegExp(req.query.q, "i")})
        .populate("courses")
        .exec();
        professorPromise.then(function(profs) {
          profResult = profs.map(function(p){
            return {
              professor_name: p.first_name+' '+p.last_name,
              department: p.department,
              courses: p.courses.map(function(c) {
                return {
                    course_object_id: c._id,
                    course_id: c.number,
                    course_name: c.name,
                    course_average_review: c.average_review,
                    course_number_of_reviews: c.number_of_reviews
                }
              })
            }
          });
          parallel_done();
        });
      }
    ], function(err) {
      res.json(courseResult.concat(profResult));
    });
    return;
  }
  let re = new RegExp(req.query.q, "i")
  var coursePromise = Course
  .find()
  .populate("professor")
  .limit(20)
  .exec()

  coursePromise.then(function(courses){
    // if (err) return parallel_done(err);
    var returnResult = courses.map(function(c){
      var result = {
        professor_name: c.professor.first_name + ' ' + c.professor.last_name,
        department: c.professor.department,
        courses: [{
          course_object_id: c._id,
          course_id: c.number,
          course_name: c.name,
          course_average_review: c.average_review,
          course_number_of_reviews: c.number_of_reviews
        }]
      }
      return result;
    });
    res.json(returnResult);
    return;
  });

  // res.send("404", "No such page")
});

module.exports = router;
