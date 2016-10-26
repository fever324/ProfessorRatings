"use strict";
process.env.NODE_ENV = 'test';

var fs = require('fs')
var Professor = require('../models/Professor')
var Course = require('../models/Course')
var config = require('./config')
var async = require('async')

// load mongoose package
var mongoose = require('mongoose');
// Use native Node promises
mongoose.Promise = global.Promise;

// connect to MongoDB
mongoose.connect(config.DB);

console.log('Database connection succesful')

var departments = JSON.parse(fs.readFileSync('./data/departments.json','utf-8'));
var c = {}
loadDepartment()



async function loadDepartment() {
	var keys = Object.keys(departments)
	for (var shortDepartmentName of keys) {
		// loadCourses(shortDepartmentName, 'SP16')
		loadCourses(shortDepartmentName, 'FA16')

		sleep(10000)
	}
}

console.log('db loaded');
// mongoose.connection.close();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function loadCourses(shortDepartmentName, year) {
	var fileName = shortDepartmentName+'_'+year+'.json'
	var fileDirectory = './data/'+fileName
	var stats;
	try {
      stats = fs.statSync(fileDirectory);
	} catch (err) {
  		console.log(fileName + ' does not exist!')
		return
	}
	var stats = fs.statSync(fileDirectory)
	if (stats["size"] == 0) {
		console.log(fileName + ' is empty!')
		return
	}
	var file = JSON.parse(fs.readFileSync(fileDirectory,'utf-8'));
	if(file['status'] !== 'success') {
		console.log(fileName + ' download was not successful!')
		return
	}
	var data = file["data"]
	addCourseRecursion(data['classes'], 0, shortDepartmentName)	
}

function addCourseRecursion(classes, i, shortDepartmentName){
	if (i >= classes.length) {
		return
	}
	c = classes[i]
	var course_id = String(c['subject']) + String(c['catalogNbr'])
	var course_title = c['titleLong']
	var course_description = c['description']
	if (c['enrollGroups'][0]['classSections'][0]['meetings'].length == 0 ) {
		return addCourseRecursion(classes, i + 1, shortDepartmentName)
	}

	var instructor_info = c['enrollGroups'][0]['classSections'][0]['meetings'][0]['instructors'][0]

	if (instructor_info == null) {
		return addCourseRecursion(classes, i + 1, shortDepartmentName)
	}
	var prof_email = instructor_info['netid']+'@cornell.edu'
	var prof_first_name = instructor_info['firstName']
	var prof_last_name = instructor_info['lastName']

	c = {
		course_id : course_id,
		'course_title' : course_title,
		'instructor_info' : instructor_info,
		'prof_email' : prof_email,
		'prof_first_name' : prof_first_name,
		'prof_last_name' : prof_last_name,
		'department' : departments[shortDepartmentName]
	}

	async.waterfall([
		async.constant(c),
		function(c, next) {
			Professor
	        	.find({first_name: c['prof_first_name'], last_name: c['prof_last_name']})
	        	.populate("courses")
	        	.exec(function(err, profs) {
	        		next(err, profs, c)
	        	})
		},
		function(profs, c, next) {
			if (profs == null || profs.length == 0) {
				createProfessorWithCourse(c, classes, i, shortDepartmentName)
				return
    		}
	       	// If professor exist
        	var prof = profs[0]
        	// Search if professor already have this class
          	for(var course of prof.courses) {
          		// If he does, do nothing, return
          		if (course.number === c['course_id']) {
          			return addCourseRecursion(classes, i + 1, shortDepartmentName)
          		}
          	}

    		console.log("2NOOOO", c['course_id'])
          	Course.create({
				name: c['course_title'],
				number: c['course_id'],
				description: c['description']
			}, function(err, saved_course) {
				saved_course.professor = prof
				prof.courses.push(saved_course)
				saved_course.save()
				prof.save()
				return addCourseRecursion(classes, i + 1, shortDepartmentName)
			})
		}
	]);
}

function createProfessorWithCourse(c, classes, i ,shortDepartmentName) {
	async.waterfall([
		function(next) {
			Professor.create({
				first_name: c['prof_first_name'],
				last_name: c['prof_last_name'],
				email: c['prof_email']}, 
				function(err, saved_prof) {
					console.log('created professor ' + saved_prof.first_name + ' ' + saved_prof.last_name)
					next(err, saved_prof, c)
				})
		},
		function(saved_prof, c, next) {
			Course.create({
				name: c['course_title'],
				number: c['course_id'],
				description: c['description']}, 
				function(err, saved_course){
					console.log('created course ' + saved_course.number)
					next(err, saved_course, saved_prof)
				})
		}, 
		function(saved_course, saved_prof, next) {
			saved_course.professor = saved_prof
			saved_prof.courses = [saved_course]
			saved_course.save()
			saved_prof.save()
			return addCourseRecursion(classes, i + 1, shortDepartmentName)
		}
	])
}
