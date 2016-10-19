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
    beforeEach((done) => { //Before each test we empty the database
      Course.remove({}, (err) => { 
         done();         
      }); 

      var hf = new Course({
        name: "algo",
        number: 1110,
        description: "hhhhh"
      });
      var hf2 = new Course({
        name: "data",
        number: 2110,
        description: "blalalala"
      });

      // save the sample user
      hf.save((err) => {
        if (err) throw err;
      });
      // save the sample user
      hf2.save((err) => {
        if (err) throw err;
      });    
    });

   /*
  * Test the /GET/:id route
  */
  describe('/GET/:name course', () => {
    it('it should GET a course by the given name', (done) => {
        chai.request(server)
        .get('/courses')
        .query({name : 'data'})
        .end((err, res) => {
          console.log(JSON.stringify(res.body, null, 2))
          res.body.should.be.a('array');
          res.body.should.have.length(1)
          res.body[0].name.should.have.equal('data');
          done();
        });
      
    });
  });
});





