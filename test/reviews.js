"use strict";
//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
let mongoose = require("mongoose");
let async = require('async');
let Course = require('../models/Course');
var Review = require('../models/Review.js');
var User = require('../models/User.js');
var Professor = require('../models/Professor.js');
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

var course = new Course();
var courseId = course._id;
var user = new User();
var userId = user._id;
user.email = 'efg@cornell.edu';

var review = new Review();
review.user = userId;
review.course = courseId;
review.quality = 2;
review.workload = 5;
review.grading = 2;
review.rating = 4;


chai.use(chaiHttp);
//Our parent block
describe('Reviews', () => {

  before((done) => {
    async.waterfall([
      function(next) {
        Course.remove({}, function(err) {
          next(null);
        })
      },
      function(next) {
        User.remove({}, function(err) {
          next(null);
        })
      },
      function(next) {
        Review.remove({}, function(err) {
          next(null);
        })
      },
      function(next) {
        course.save(function(err) {
          user.save(function(err) {
            review.save(function(err) {
              next(null);
            })
          })
        });
      }
      ], function(err, result){
        if(err) {
          console.log("Unable to clean database");
        }
        done();
      });
  });
  /*
  * Test the GET /reviews?course_id=x.
  */
  describe('GET/:reviews', () => {
    it('it should GET reviews by the given course_id', (done) => {
        chai.request(server)
        .get('/reviews')
        .query({course_id : courseId.toString()})
        .end((err, res) => {
          res.body.should.be.a('array');
          res.body[0].course.should.eql(courseId.toString());
          done();
        });
    });
  });
   /*
  * Test the /POST/: /reviews
  */
  describe('POST /reviews', () => {
        it('should sucessfully post a new reivew into database',
            (done) => {
                chai.request(server)
                    .post('/reviews')
                    .send({
                      comment: 'best course ever!',
                      user: userId,
                      course_id: courseId,
                      quality: 4,
                      workload: 3,
                      grading: 5,
                      rating: 5,
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.success.should.be.true;
                        Review.count({}, function(err, count) {
                          count.should.eql(2);
                          done();
                        })
                    });
            });

        it('should fail if no course_id provided',
            (done) => {
                chai.request(server)
                    .post('/reviews')
                    .send({
                      comment: 'best course ever!',
                      user: userId,
                      quality: 4,
                      workload: 3,
                      grading: 5,
                      rating: 5,
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.success.should.be.false;
                        res.body.message.should.eql('No course found');
                        done();
                    });
            });

        it('should sucessfully update count of review\'s info',
            (done) => {

              Course.findById(courseId, function(err, course) {

                var quality1 = course.quality;
                var workload1 = course.workload;
                var grading1 = course.grading;
                var rating1 = course.average_review;
                var cnt = course.number_of_reviews;
                chai
                  .request(server)
                  .post('/reviews')
                  .send({
                    comment: 'best course ever!',
                    user: userId,
                    course_id: courseId,
                    quality: 5,
                    workload: 3,
                    grading: 5,
                    rating: 5,
                  })
                  .end((err, res) => {
                    res.should.have.status(200);
                    res.body.success.should.be.true;
                    Course.findById(courseId, function(err, course) {
                      var quality2 = course.quality;
                      var workload2 = course.workload;
                      var grading2 = course.grading;
                      var rating2 = course.average_review;
                      var cnt2 = course.number_of_reviews;
                      quality2.should.eql((quality1 * cnt + 5)/(cnt+1));
                      workload2.should.eql((workload1 * cnt + 3)/(cnt+1));
                      grading2.should.eql((grading1 * cnt + 5)/(cnt+1));
                      rating2.should.eql((rating1 * cnt + 5)/(cnt+1));
                      cnt2.should.eql(cnt + 1);
                      done();
                    });
                  });
              })
            });
  });
});





