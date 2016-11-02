var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Professor = require('../models/Professor.js');
var Course = require('../models/Course.js');
/* GET /Professors listing. */
router.get('/', function(req, res, next) {
  Professor.find(function (err, Professors) {
    if (err) return next(err);
    res.json(Professors);
  });
});

/* POST /Professors */
router.post('/', function(req, res, next) {
  Professor.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json({success: true});
  });
});

/* GET /Professors/id */
router.get('/:id', function(req, res, next) {
  Professor.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /Professors/:id */
router.put('/:id', function(req, res, next) {
  Professor.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json({success: true});
  });
});

/* DELETE /Professors/:id */
router.delete('/:id', function(req, res, next) {
  Professor.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json({success: true});
  });
});

module.exports = router;
