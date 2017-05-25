var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var flash = require('express-flash');
var session = require('express-session');
var Auth = require('./middlewares/auth');

var index = require('./routes/index');
var users = require('./routes/users');
var catalog = require('./routes/catalog'); //Import routes for "catalog" area of site
var compression = require('compression');
var helmet = require('helmet');

// Create express application project
var app = express();

app.use(helmet());

// Set up mongoose connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://pooluser:poolpass@ds149491.mlab.com:49491/local_library01');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator()); // Add this after the bodyParser middleware!
app.use(session({
  secret: 'rahasia',
  saveUninitialized: true,
  resave: false,
}));
app.use(flash());
app.use(cookieParser());

app.use(compression()); // Compress all routes

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/', users);
app.use('/catalog', Auth.check_login, catalog);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
