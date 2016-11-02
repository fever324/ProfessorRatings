"use strict";
//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
let mongoose = require("mongoose");
let Course = require('../models/Course');
var Review = require('../models/Review.js');
var Professor = require('../models/Professor.js');
var Like = require('../models/Like.js');
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Likes', () => {
   /*
  * Test the GET /reviews?course_id=x.
  */
/*  describe('GET/:reviews', () => {
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
  });*/
   /*
  * Test the /POST/: /likes
  */
  describe('POST /likes', () => {

        it('should sucessfully post a like or unlike into database',
            (done) => {
               Like.remove({$and: [{review_id: '581754d60e563dbf2d5fedae'}, {user_id: '58174d296a9e7cbeb3b3b050'}]}, (err) => {
               });
                chai.request(server)
                    .post('/likes')
                    .send({
                      review_id: '581754d60e563dbf2d5fedae',
                      user_id: '58174d296a9e7cbeb3b3b050',
                      like: 1,
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.review_id.should.eql('581754d60e563dbf2d5fedae');
                        res.body.user_id.should.eql('58174d296a9e7cbeb3b3b050');
                        res.body.like.should.eql(1);
                        done();
                    });
            });

        it('should fail if post like to the same review again',
            (done) => {
                chai.request(server)
                    .post('/likes')
                    .send({
                      review_id: '581754d60e563dbf2d5fedae',
                      user_id: '58174d296a9e7cbeb3b3b050',
                      like: 1,
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.success.should.be.false;
                        res.body.message.should.eql('User id has existed.');
                        done();
                    });
            });

        //TODO: Fix bugs
        it('should sucessfully update count of likes',
            (done) => {
                Like.remove({$and: [{review_id: '581754d60e563dbf2d5fedae'}, {user_id: '58174d296a9e7cbeb3b3b050'}]}, (err) => {
                });
                
                chai.request(server)
                    .get('/reviews/581754d60e563dbf2d5fedae')
                    .end((err, review) => {
                      console.log(review.body);
                        var like_count1 = review.like_count;
                        var dislike_count1 = review.dislike_count;

                        chai.request(server)
                        .post('/likes')
                        .send({
                          review_id: '581754d60e563dbf2d5fedae',
                          user_id: '58174d296a9e7cbeb3b3b050',
                          like: 1,
                        })
                        .end((err, like) => {
                          chai.request(server)
                          .get('/reviews/581754d60e563dbf2d5fedae')
                          .end((err, res) => {
                            console.log(res.body);
                            console.log(like_count1);
                            res.body.like_count.should.eql(like_count1+1);
                            done();
                          });
                          //done();
                        });
                       // done();
                    });
            });

    })
});





