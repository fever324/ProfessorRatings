"use strict";
//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
let mongoose = require("mongoose");
let Course = require('../models/Course');
var Review = require('../models/Review.js');
var Professor = require('../models/Professor.js');
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Reviews', () => {
   /*
  * Test the GET /reviews?course_id=x.
  */
  describe('GET/:reviews', () => {
    it('it should GET reviews by the given course_id', (done) => {
        chai.request(server)
        .get('/reviews')
        .query({course_id : '5810cda4c49f2ea46e990d46'})
        .end((err, res) => {
          res.body.should.be.a('array');
          res.body[0].course.should.eql('5810cda4c49f2ea46e990d46');
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
                      user: '58174d296a9e7cbeb3b3b050',
                      course: '5810cda4c49f2ea46e990d46',
                      quality: 4,
                      workload: 3,
                      grading: 5,
                      rating: 5,
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.course.should.eql('5810cda4c49f2ea46e990d46');
                        res.body.user.should.eql('58174d296a9e7cbeb3b3b050');
                        done();
                    });
            });

        it('should fail if the course doesn\'t exist',
            (done) => {
                chai.request(server)
                    .post('/reviews')
                    .send({
                      comment: 'best course ever!',
                      user: '58174d296a9e7cbeb3b3b050',
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
                    .get('/courses/5810cda4c49f2ea46e990d46')
                    .end((err, course) => {
                        var quality1 = course.quality;
                        var cnt = course.number_of_reviews;

                        chai.request(server)
                        .post('/reviews')
                        .send({
                          comment: 'best course ever!',
                          user: '58174d296a9e7cbeb3b3b050',
                          course: '5810cda4c49f2ea46e990d46',
                          quality: 4,
                          workload: 3,
                          grading: 5,
                          rating: 5,
                        })
                        .end((err, res) => {
                          res.should.have.status(200);
                          res.body.success.should.be.true;
                          res.body.course.should.eql('5810cda4c49f2ea46e990d46');
                          res.body.user.should.eql('58174d296a9e7cbeb3b3b050');
                          res.body.quality.should.eql((quality1 * cnt + 4)/(cnt+1))
                          done();
                        });
                        done();
                    });
            });

    })
});





