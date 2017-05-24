var Author = require('../models/author');
var Book = require('../models/book');

var async = require('async');

exports.author_list = function(req, res, next) {
  Author.find().sort([['family_name', 'ascending']]).exec(function(err, results) {
    if (err) {
        return next(err);
    }

    res.render('author_list', { title: 'Author List', author_list: results });
  });
};

exports.author_detail = function(req, res, next) {
  async.parallel({
    author: function(callback) {
        Author.findById(req.params.id).exec(callback)
    },
    authors_books: function(callback) {
        Book.find({ 'author': req.params.id }, 'title summary').exec(callback)
    }
  }, function(err, results) {
    if (err) {
        return next(err);
    }

    res.render('author_detail', { title: 'Author Detail', author: results.author, author_books: results.authors_books });
  });
};

exports.author_create_get = function(req, res) {
  res.render('author_form', { title: 'Create Author'});
};

exports.author_create_post = function(req, res, next) {
  req.checkBody('first_name', 'First name must be specified').notEmpty();
  req.checkBody('family_name', 'Family name must be specified').notEmpty();
  req.checkBody('family_name', 'Family name must be alphanumeric').isAlpha();
  req.checkBody('date_of_birth', 'Invalid date').optional({ checkFalsy: true }).isDate();
  req.checkBody('date_of_death', 'Invalid date').optional({ checkFalsy: true}).isDate();

  req.sanitize('first_name').escape();
  req.sanitize('family_name').escape();
  req.sanitize('first_name').trim();
  req.sanitize('family_name').trim();
  req.sanitize('date_of_birth').toDate();
  req.sanitize('date_of_death').toDate();

  var errors = req.validationErrors();

  var author = new Author({
    first_name: req.body.first_name,
    family_name: req.body.family_name,
    date_of_birth: req.body.date_of_birth,
    date_of_death: req.body.date_of_death
  });

  if (errors) {
    return res.render('author_form', { title: 'Create Author', authors: author, errors: errors });
  } else {
    author.save(function(err) {
        res.redirect(author.url);
    });
  }
};

exports.author_update_get = function(req, res, next) {
  req.sanitize('id').escape();
  req.sanitize('id').trim();

  Author.findById(req.params.id, function(err, results) {
    if (err) {
        return next(err);
    }

    res.render('author_form', { title: 'Update Author', author: results });
  });
};

exports.author_update_post = function(req, res, next) {
  req.sanitize('id').escape();
  req.sanitize('id').trim();

  req.checkBody('first_name', 'First name must be specified').notEmpty();
  req.checkBody('family_name', 'Family name must be specified').notEmpty();
  req.checkBody('date_of_birth', 'Invalid date').optional({ checkFalsy: true }).isDate();
  req.checkBody('date_of_death', 'Invalid date').optional({ checkFalsy: true }).isDate();
  req.sanitize('first_name').escape();
  req.sanitize('family_name').escape();
  req.sanitize('first_name').trim();
  req.sanitize('family_name').trim();
  req.sanitize('date_of_birth').toDate();
  req.sanitize('date_of_death').toDate();

  var errors = req.validationErrors();

  var author = new Author({
    first_name: req.body.first_name,
    family_name: req.body.family_name,
    date_of_birth: req.body.date_of_birth,
    date_of_death: req.body.date_of_death,
    _id: req.params.id
  });

  if (errors) {
    res.render('author_form', { title: 'Author Update', author: author, errors: errors });
  } else {
    Author.findByIdAndUpdate(req.params.id, author, {}, function(err, theauthor) {
      if (err) {
        return next(err);
      }

      res.redirect(theauthor.url);
    });
  }
};

exports.author_delete = function(req, res, next) {
  Author.findByIdAndRemove(req.params.id, function deleteAuthor(err) {
    if (err) {
        return next(err);
    }

    res.redirect('/catalog/authors');
  });
};