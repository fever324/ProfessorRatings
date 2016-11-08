"use strict";
//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
let mongoose = require("mongoose");
let Course = require('../models/Course');
var Review = require('../models/Review.js');
var User = require('../models/User.js');
var Professor = require('../models/Professor.js');
var Like = require('../models/Like.js');
var Suggestion = require('../models/Suggestion.js');
var Upvote = require('../models/Upvote.js');
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

var user = new User();
var userId = user._id;
var suggest = new Suggestion();
var suggestId = suggest._id;
user.email = 'hahah@cornell.edu';
suggest.up_votes = 2;

chai.use(chaiHttp);
//Our parent block
describe('upvotes', () => {
  user.save();
  suggest.save();
   /*
  * Test the /POST/: /upvotes
  */
  describe('POST /upvotes', () => {
        
        it('should sucessfully upvote a suggestion',
            (done) => {
               Upvote.remove({$and: [{suggestion_id: suggestId}, {user_id: userId}]});
                chai.request(server)
                    .post('/upvotes')
                    .send({
                      suggestion_id: suggestId,
                      user_id: userId,
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.success.should.be.true;
                        done();
                    });
            });

        it('should fail if upvote again',
            (done) => {
                chai.request(server)
                    .post('/upvotes')
                    .send({
                      suggestion_id: suggestId,
                      user_id: userId,
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.success.should.be.false;
                        res.body.message.should.eql('User id has existed.');
                        done();
                    });
            });

        it('should sucessfully update count of upvotes',
            (done) => {
               Upvote.remove({$and: [{suggestion_id: suggestId}, {user_id: userId}]});
                chai.request(server)
                .post('/upvotes')
                .send({
                  suggestion_id: suggestId,
                  user_id: userId,
                })
                .end((err, like) => {
                  chai.request(server)
                  .get('/suggestions/'+suggestId)
                  .end((err, res) => {
                    res.body.up_votes.should.eql(3);
                    done();
                  });

                });
            });

    })
});
