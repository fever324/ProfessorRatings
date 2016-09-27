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
  });
/*
  * Test the /GET route
  */
  describe('/GET course', () => {
      it('it should GET all the courses', (done) => {
        chai.request(server)
            .get('/courses')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
              done();
            });
      });
  });

/*
  * Test the /POST route
  */
 describe('/POST course', () => {
    it('it should POST a course ', (done) => {
        let course = {
            name: "Distributed Computing",
            number: 5414,
            description: "2016 fall"
        }
            chai.request(server)
            .post('/courses')
            .send(course)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.length.should.be.eql(3);
                res.body.course.should.have.property('name');
                res.body.course.should.have.property('number');
                res.body.course.should.have.property('description');
              done();
            });
      });
  });
 /*
  * Test the /GET/:id route
  */
  describe('/GET/:id course', () => {
    it('it should GET a course by the given id', (done) => {
        let course = new Course({
            name: "Distributed Computing",
            number: 5414,
            description: "2016 fall"
        })
        course.save((err, course) => {
        chai.request(server)
        .get('/courses/' + course.id)
        .send(course)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.course.should.have.property('name');
          res.body.course.should.have.property('number');
          res.body.course.should.have.property('description');
          res.body.should.have.property('_id').eql(course.id);
          done();
        });
      });
      
    });
  });
/*
  * Test the /PUT/:id route
  */
  describe('/PUT/:id course', () => {
    it('it should UPDATE a course given the id', (done) => {
        let course = new Course({
            name: "Distributed Computing",
            number: 5414,
            description: "2016 fall"
        })
      course.save((err, course) => {
        chai.request(server)
          .put('/courses/' + course.id)
          .send({name: "Distributed Computing", number: 5414, description: "2017 fall"})
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('course updated!');
            res.body.course.should.have.property('description').eql("2017 fall");
            done();
          });
      });
    });
  });
 /*
  * Test the /DELETE/:id route
  */
  describe('/DELETE/:id course', () => {
    it('it should DELETE a course given the id', (done) => {
        let course = new Course({
            name: "Distributed Computing",
            number: 5414,
            description: "2016 fall"
        })
      course.save((err, course) => {
        chai.request(server)
          .delete('/courses/' + course.id)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('course successfully deleted!');
            res.body.result.should.have.property('ok').eql(1);
            res.body.result.should.have.property('n').eql(1);
            done();
          });
      });
    });
  });
});

