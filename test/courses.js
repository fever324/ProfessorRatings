"use strict";
//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
let mongoose = require("mongoose");
let Course = require('../models/Course');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Courses', () => {
   /*
  * Test the /GET/: /search?q= course name
  */
  describe('/GET/:name course', () => {
    it('it should GET a course by the given name', (done) => {
        chai.request(server)
        .get('/search')
        .query({q : 'Micro-Economics Supplement'})
        .end((err, res) => {
          res.body.should.be.a('array');
          res.body[0].courses.should.be.a('array');
          res.body[0].courses[0].course_name.should.have.contain('Micro-Economics Supplement');
          done();
        });
    });
  });
   /*
  * Test the /GET/: /search?q= professor name
  */

});





