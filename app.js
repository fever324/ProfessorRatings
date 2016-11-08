//During the test the env variable is set to test
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var courses = require('./routes/courses');
var professors = require('./routes/professors');
var reviews = require('./routes/reviews');
var users = require('./routes/users');
var login = require('./routes/login');
var search = require('./routes/search');
var likes = require('./routes/likes');
var suggestions = require('./routes/suggestions');
var upvotes = require('./routes/upvotes');
var config = require('./utils/config');


// load mongoose package
var mongoose = require('mongoose');
// Use native Node promises
mongoose.Promise = global.Promise;

// connect to MongoDB
mongoose.connect(config.DB)
  .then(() =>  console.log('Database connection succesful'))
  .catch((err) => console.error(err));

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/courses', courses);
app.use('/professors', professors);
app.use('/reviews', reviews);
app.use('/login', login);
app.use('/search', search);
app.use('/likes', likes);
app.use('/suggestions', suggestions);
app.use('/upvotes', upvotes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
