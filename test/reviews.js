"use strict";
//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
let mongoose = require("mongoose");
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
var user2 = new User();
var user2Id = user2._id;
user2.email = 'new@conell.edu';
course.quality = 2;
course.workload = 3;
course.grading = 4;
course.rating = 1;
var review = new Review();
review.user = user2Id;
review.course = courseId;
review.quality = 2;
review.workload = 5;
review.grading = 2;
review.rating = 4;

chai.use(chaiHttp);
//Our parent block
describe('Reviews', () => {
  course.save();
  user.save();
  user2.save();
  review.save();

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
                      course: courseId,
                      quality: 4,
                      workload: 3,
                      grading: 5,
                      rating: 5,
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.success.should.be.true;
                        done();
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
                        res.body.message.should.eql('No course object Id provided');
                        done();
                    });
            });

        it('should sucessfully update count of review\'s info',
            (done) => {
                chai.request(server)
                    .get('/courses/'+courseId)
                    .end((err, course) => {
                        var quality1 = course.quality;
                        var workload1 = course.workload;
                        var grading1 = course.grading;
                        var rating1 = course.rating;
                        var cnt = course.number_of_reviews;

                        chai.request(server)
                        .post('/reviews')
                        .send({
                          comment: 'best course ever!',
                          user: userId,
                          course: courseId,
                          quality: 4,
                          workload: 3,
                          grading: 5,
                          rating: 5,
                        })
                        .end((err, res) => {
                          res.should.have.status(200);
                          res.body.success.should.be.true;
                          res.body.course.should.eql(courseId);
                          res.body.user.should.eql(userId);
                          res.body.quality.should.eql((quality1 * cnt + 4)/(cnt+1));
                          res.body.workload.should.eql((workload1 * cnt + 4)/(cnt+1));
                          res.body.grading.should.eql((grading1 * cnt + 4)/(cnt+1));
                          res.body.rating.should.eql((rating1 * cnt + 4)/(cnt+1));
                        });
                        done();
                    });
            });

    })
});





