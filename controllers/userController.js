var User = require('../models/user');

var crypto = require('crypto');

exports.login_get = function(req, res) {
  res.render('login', { title: 'Login'});
};

exports.login_post = function(req, res, next) {
  var session_store = req.session;
  var password = crypto.createHmac('sha256', 'rahasia').update(req.body.password).digest('hex');

  if (req.body.username == '' || req.body.password == '') {
    req.flash('info', 'Username or Password can not be empty.');

    return res.redirect('/login');
  } else {
    User.find({username: req.body.username, password: password}, function(err, results) {
      if (err) {
        return next(err);
      }

      if (results.length > 0) {
        session_store.username = results[0].username;
        session_store.loged_in = true;

        return res.redirect('/');
      } else {
        req.flash('info', 'Username or Password wrong!');

        return res.redirect('/login');
      }
    });
  }
};

exports.logout = function(req, res, next) {
  req.session.destroy(function(err) {
    if (err) {
      return next(err);
    }

    res.redirect('/login');
  });
};