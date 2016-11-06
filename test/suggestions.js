"use strict";
//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
let mongoose = require("mongoose");
let Course = require('../models/Course');
var Review = require('../models/Review.js');
var User = require('../models/User.js');
var Suggestion = require('../models/Suggestion.js');
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
user.email = 'hello@cornell.edu';
var user2 = new User();
var user2Id = user2._id;
user2.email = 'lalal@conell.edu';
course.quality = 2;
course.workload = 3;
course.grading = 4;
course.rating = 1;
var suggest = new Suggestion();
suggest.course = courseId;
suggest.provider = user2Id;
suggest.up_votes = 0;

chai.use(chaiHttp);
//Our parent block
describe('suggestions', () => {
  course.save();
  user.save();
  user2.save();
  suggest.save();

     /*
  * Test the GET /suggestions?course_id=x.
  */
  describe('GET/:suggestions', () => {
    it('it should GET suggestions by the given course_id', (done) => {
        chai.request(server)
        .get('/suggestions')
        .query({course_id : courseId.toString()})
        .end((err, res) => {
          res.body.should.be.a('array');
          res.body[0].course.should.eql(courseId.toString());
          done();
        });
    });
  });
   /*
  * Test the /POST/: /suggestions
  */
  describe('POST /suggestions', () => {
        it('should sucessfully post a new suggestion into database',
            (done) => {
                chai.request(server)
                    .post('/suggestions')
                    .send({
                      provider: userId,
                      course: courseId,
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
                    .post('/suggestions')
                    .send({
                      user: userId,
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.success.should.be.false;
                        res.body.message.should.eql('No course object Id provided');
                        done();
                    });
            });

    })
});





