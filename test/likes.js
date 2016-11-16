"use strict";
//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
let mongoose = require("mongoose");
let Course = require('../models/Course');
var Review = require('../models/Review.js');
var User = require('../models/User.js');
var Professor = require('../models/Professor.js');
var Like = require('../models/Like.js');
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

var user = new User();
var userId = user._id;
var review = new Review();
var revId = review._id;
var user2 = new User();
user2.email = "fdd@cornel.edu";
user.email = 'abc@cornell.edu';
review.like_count = 2;
review.dislike_count = 0;

chai.use(chaiHttp);
//Our parent block
describe('Likes', () => {
  user.save();
  review.save();
  user2.save();


   /*
  }
  * Test the /POST/: /likes
  */
  describe('POST /likes', () => {
        
        it('should sucessfully post a like into database',
          (done) => {
             Like.remove({$and: [{review_id: revId}, {user_id: userId}]});
              chai.request(server)
                  .post('/likes')
                  .send({
                    review_id: revId,
                    user_id: userId,
                    like: 1,
                  })
                  .end((err, res) => {
                      res.should.have.status(200);
                      res.body.success.should.be.true;
                      done();
                  });
          });

        it('should sucessfully post a dislike into database',
          (done) => {
             Like.remove({$and: [{review_id: revId}, {user_id: user2._id}]});
              chai.request(server)
                  .post('/likes')
                  .send({
                    review_id: revId,
                    user_id: user2._id,
                    like: 0,
                  })
                  .end((err, res) => {
                      res.should.have.status(200);
                      res.body.success.should.be.true;
                      Review.findById(revId, function(err, review) {
                        review.dislike_count.should.eql(1);
                      });
                      done();
                  });
          });

        it('should fail if post like to the same review again',
          (done) => {
              chai.request(server)
                  .post('/likes')
                  .send({
                    review_id: revId,
                    user_id: userId,
                    like: 1,
                  })
                  .end((err, res) => {
                      res.should.have.status(200);
                      res.body.success.should.be.false;
                      res.body.message.should.eql('User has already liked or disliked this review.');
                      done();
                  });
          });

        it('should sucessfully update count of likes',
            (done) => {
                Like.remove({$and: [{review_id: revId}, {user_id: userId}]});
                chai.request(server)
                .post('/likes')
                .send({
                  review_id: revId,
                  user_id: userId,
                  like: 1,
                })
                .end((err, like) => {
                  chai.request(server)
                  .get('/reviews/'+revId)
                  .end((err, res) => {
                    res.body.like_count.should.eql(3);
                    done();
                  });

                });
            });

    })
});





