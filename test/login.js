"use strict";
//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
let mongoose = require("mongoose");
let User = require('../models/User');
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
let ph = require('password-hash')
chai.use(chaiHttp);

var password = "12312312"
var email = "testemail@gmail.edu"
var encryptedPassword = ph.generate(password);

describe('Log in', () => {
    beforeEach((done) => { //Before each test we empty the database
        User.remove({}, (err) => {
            User.create({
              email:email,
              password:encryptedPassword
            })
            done();
        });
    });

    describe('POST /login', () => {
        it('should has a test user inside test database', (done) => {
            chai.request(server)
                .get('/users')
                .end((err, res) => {
                    res.body.should.be.a('array');
                    res.body.length.should.eql(1);
                    done();
                });
        });

        it('should sucessfully log in with correct email and password',
            (done) => {
                chai.request(server)
                    .post('/login')
                    .send({
                      email:email,
                      password: password
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.success.should.be.true;
                        res.body.token.should.not.be.null;
                        done();
                    });
            });

        it('should fail if wrong password',
            (done) => {
                var userWithWrongPassword = {
                    email: email,
                    password: password + "22"
                }
                chai.request(server)
                    .post('/login')
                    .send(userWithWrongPassword)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.success.should.be.false;
                        done();
                    });
            });

        it('should fail if user does not exist',
            (done) => {
                var userWithWrongPassword = {
                    email: email+'123',
                    password: password
                }
                chai.request(server)
                    .post('/login')
                    .send(userWithWrongPassword)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.success.should.be.false;
                        done();
                    });
            });
    })
});
