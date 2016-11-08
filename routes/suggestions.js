var express = require('express');
var router = express.Router();
var async = require('async');
var mongoose = require('mongoose');
var Course = require('../models/Course.js');
var Professor = require('../models/Professor.js');
var Like = require('../models/Like.js');
var Suggestion = require('../models/Suggestion.js');


router.get('/', function(req, res, next) {
  /* GET /suggestions?course_id=x*/
  if (req.query.course_id) {
    Suggestion.find({course: req.query.course_id }, function(err, sugs){
        res.json(sugs);
    });
    return;
  }
  //res.send("404", "No such page")
  Suggestion.find(function (err, suggestions) {
    if (err) return next(err);
    res.json(suggestions);
  });
});

/* POST /suggestions */
router.post('/', function(req, res, next) {
  Suggestion.create(req.body, function (err, suggest) {
    if (err) return next(err);
    if(suggest.course == null) {
      res.json({
        success: false,
        message: 'No course object Id provided'
      })
      return; 
    }
    res.json({success: true});
  });
});


/* GET /suggestions/id */
router.get('/:id', function(req, res, next) {
  Suggestion.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /suggestions/:id */
router.put('/:id', function(req, res, next) {
  Suggestion.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json({success: true});
  });
});

/* DELETE /suggestions/:id */
router.delete('/:id', function(req, res, next) {
  Suggestion.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json({success: true});
  });
});

module.exports = router;

