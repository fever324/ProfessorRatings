var express = require('express');
var router = express.Router();
var async = require('async');
var mongoose = require('mongoose');
var Course = require('../models/Course.js');
var Professor = require('../models/Professor.js');
/* GET /search?q= */
router.get('/', function(req, res) {
	if (req.query.name) {
		var return_data = {};
        async.parallel([
            function(parallel_done) {
            	Course.find({name: new RegExp(req.query.name, "i")}, function(err, cours) {
                    if (err) return parallel_done(err);
                    return_data.courses = cours;
                    parallel_done();
                });
            },
            function(parallel_done) {
            	var professorPromise = Professor
                    .find({name: new RegExp(req.query.name, "i")})
                    .populate("courses")
                    .exec();
                professorPromise.then(function(profs) {
                    return_data.professors = profs;
                    parallel_done();
                });
            }
         ], function(err) {
         	    //console.log(return_data);
                res.json(return_data);
        });
        return;
    }
    if (req.query.number) {
        Course.find({number: req.query.number}, function(err, docs) {
           res.json(docs);
        });
        return;
    }
	res.send("404", "No such page")
});

module.exports = router;
