"use strict";
process.env.NODE_ENV = 'test';

var fs = require('fs')
var Professor = require('../models/Professor')
var config = require('./config')

// load mongoose package
var mongoose = require('mongoose');
// Use native Node promises
mongoose.Promise = global.Promise;

// connect to MongoDB
mongoose.connect(config.DB);

console.log('Database connection succesful')
var professors = JSON.parse(fs.readFileSync('./data/professors.json','utf-8'));
for (var prof of professors) {
  var p = new Professor(prof);
  p.save((err) => {
    if (err) console.log(err);
  });
}
console.log('db loaded with ' + professors.length + ' professors\' data');
mongoose.connection.close();
