var Genre = require('../models/genre');
var Book = require('../models/book');

var async = require('async');

exports.genre_list = function(req, res, next) {
  Genre.find().sort([['name', 'ascending']]).exec(function(err, results) {
    if (err) {
      return next(err);
    }

    res.render('genre_list', { title: 'Genre List', list_genres: results });
  });
};

exports.genre_create_get = function(req, res) {
  res.render('genre_form', { title: 'Create Genre'});
};

exports.genre_create_post = function(req, res, next) {
 req.checkBody('name', 'Genre name required').notEmpty();

 req.sanitize('name').escape();
 req.sanitize('name').trim();

 var errors = req.validationErrors();

 var genre = new Genre({
    name: req.body.name
 });

 if (errors) {
    return res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors });
 } else {
    genre.save(function(err) {
        if (err) {
          return next(err);
        }

        res.redirect('/catalog/genres');
    });
 }
};

exports.genre_update_get = function(req, res, next) {
  req.sanitize('id').escape();
  req.sanitize('id').trim();

  Genre.findById(req.params.id, function(err, results) {
    if (err) {
        return next(err);
    }

    res.render('genre_form', { title: 'Update Genre', genre: results });
  });
};

exports.genre_update_post = function(req, res, next) {
  req.sanitize('id').escape();
  req.sanitize('id').trim();

  req.checkBody('name', 'Genre name required').notEmpty();

  req.sanitize('name').escape();
  req.sanitize('name').trim();

  var errors = req.validationErrors();

  var genre = new Genre({
    name: req.body.name,
    _id: req.params.id
  });

  if (errors) {
    return res.render('genre_form', { title: 'Update Genre', genre: genre, errors: errors });
  } else {
    Genre.findByIdAndUpdate(req.params.id, genre, {}, function(err, results) {
      if (err) {
        return next(err);
      }

      res.redirect('/catalog/genres');
    })
  }
};

exports.genre_delete = function(req, res, next) {
  Genre.findByIdAndRemove(req.params.id, function deleteGenre(err) {
    if (err) {
      return next(err);
    }

    res.redirect('/catalog/genres');
  });
};