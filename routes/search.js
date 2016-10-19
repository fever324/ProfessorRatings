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
        let re = new RegExp(req.query.q, "i")
        var coursePromise = Course
        .find({$or:[{name: re},{number: re}]})
        .populate("professor")
        .exec()

        coursePromise.then(function(courses){
          // if (err) return parallel_done(err);
          courseResult = courses.map(function(c){
            var result = {
              professor_name:c.professor.name,
              department: c.professor.department,
              average_review: 4.5,
              number_of_reviews: 100,
              courses: [{
                course_id: c.number,
                course_name: c.name
              }]
            }
            return result;
          });
          parallel_done();
        });
      },
      function(parallel_done) {
        var professorPromise = Professor
        .find({name: new RegExp(req.query.q, "i")})
        .populate("courses")
        .exec();
        professorPromise.then(function(profs) {
          profResult = profs.map(function(p){
            return {
              professor_name: p.name,
              department: p.department,
              average_review: 4.5,
              number_of_reviews: 100,
              courses: p.courses
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
  res.send("404", "No such page")
});

module.exports = router;
