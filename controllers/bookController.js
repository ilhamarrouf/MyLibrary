var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');

var async = require('async');

exports.index = function(req, res) {
  async.parallel({
    book_count: function(callback) {
        Book.count(callback)
    },
    author_count: function(callback) {
        Author.count(callback)
    },
    genre_count: function(callback) {
        Genre.count(callback)
    }
  }, function(err, results) {
    res.render('index', { title: 'Home', error: err, data: results });
  });
};

exports.book_list = function(req, res) {
  Book.find({}, 'title author ').populate('author').exec(function(err, lis_books) {
    if (err) {
        return next(err);
    }

    res.render('book_list', { title: 'Book List', book_list: lis_books });
  });
};

exports.book_detail = function(req, res, next) {
  async.parallel({
    book: function(callback) {
        Book.findById(req.params.id).populate('author').populate('genre').exec(callback)
    }
  }, function(err, results) {
    if (err) {
        return next(err);
    }

    res.render('book_detail', { title: 'Book Detail', book: results.book });
  });
};

exports.book_create_get = function(req, res, next) {
  async.parallel({
    authors: function(callback) {
      Author.find(callback)
    },
    genres: function(callback) {
      Genre.find(callback)
    },
  }, function(err, results) {
    if (err) {
      return next(err);
    }

    res.render('book_form', { title: 'Create Book', authors: results.authors, genres: results.genres });
  });
};

exports.book_create_post = function(req, res, next) {
  req.checkBody('title', 'Title must not be empty').notEmpty();
  req.checkBody('author', 'Author must not be empty').notEmpty();
  req.checkBody('isbn', 'ISBN must not be empty').notEmpty();
  req.checkBody('summary', 'Summary must not be empty').notEmpty();

  req.sanitize('title').escape();
  req.sanitize('author').escape();
  req.sanitize('isbn').escape();
  req.sanitize('summary').escape();
  req.sanitize('title').trim();
  req.sanitize('author').trim();
  req.sanitize('isbn').trim();
  req.sanitize('summary').trim();
  req.sanitize('genre').escape();

  var book = new Book({
    title: req.body.title,
    author: req.body.author,
    isbn: req.body.isbn,
    summary: req.body.summary,
    genre: (typeof req.body.genre === 'undefined' ? [] : req.body.genre.split(","))
  });

  console.log('BOOK: ' + book);

  var errors = req.validationErrors();

  if (errors) {
    console.log('GENRE: ' + req.body.genre);
    console.log('ERRORS: ' + errors);

    async.parallel({
      authors: function(callback) {
        Author.find(callback)
      },
      genres: function(callback) {
        Genre.find(callback)
      }
    }, function(err, results) {
      if (err) {
        return next(err);
      }

      for (i = 0; i < results.genres.length; i++) {
        if (book.genre.indexOf(results.genres[i]._id) > -1) {
          results.genres[i].checked='true';
        }
      }

      res.render('book_form', { title: 'Create Book', authors: results.authors, genres: results.genres, book: book, errors: errors });
    });
  } else {
    book.save(function(err) {
      if (err) {
        return next(err);
      }

      res.redirect(book.url);
    });
  }
};

exports.book_update_get = function(req, res, next) {
  req.sanitize('id').escape();
  req.sanitize('id').trim();

  async.parallel({
    book: function(callback) {
      Book.findById(req.params.id).populate('author').populate('genre').exec(callback)
    },
    authors: function(callback) {
      Author.find(callback)
    },
    genres: function(callback) {
      Genre.find(callback)
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    }

    for (var all_g_iter = 0; all_g_iter < results.genres.length; all_g_iter++) {
      for (var book_g_iter = 0; book_g_iter < results.book.genre.length; book_g_iter++) {
        if (results.genres[all_g_iter]._id.toString() == results.book.genre[book_g_iter]._id.toString()) {
          results.genres[all_g_iter].checked = 'true';
        }
      }
    }

    res.render('book_form', { title: 'Update Book', authors: results.authors, genres: results.genres, book: results.book });
  });

};

exports.book_update_post = function(req, res, next) {
  req.sanitize('id').escape();
  req.sanitize('id').trim();

  req.checkBody('title', 'Title must not be empty').notEmpty();
  req.checkBody('author', 'Author must not be empty').notEmpty();
  req.checkBody('isbn', 'ISBN must not be empty').notEmpty();
  req.checkBody('summary', 'Summary must not be empty').notEmpty();

  req.sanitize('title').escape();
  req.sanitize('author').escape();
  req.sanitize('isbn').escape();
  req.sanitize('summary').escape();
  req.sanitize('title').trim();
  req.sanitize('author').trim();
  req.sanitize('isbn').trim();
  req.sanitize('summary').trim();
  req.sanitize('genre').escape();

  var book = new Book({
    title: req.body.title,
    author: req.body.author,
    isbn: req.body.isbn,
    summary: req.body.summary,
    genre: (typeof req.body.genre === 'undefined') ? [] : req.body.genre.split(","),
    _id: req.params.id
  });

  var errors = req.validationErrors();

  if (errors) {
    async.parallel({
      authors: function(callback) {
        Author.find(callback)
      },
      genres: function(callback) {
        Genre.find(callback)
      }
    }, function(err, results) {
      if (err) {
        return next(err);
      }

      for (i = 0; i < results.genres.length; i++) {
        if (book.genre.indexOf(results.genres[i]._id) > -1) {
          results.genres[i].checked = 'true';
        }
      }

      res.render('book_form', { title: 'Update Book', authors: results.authors, genres: results.genres, book: book, errors: errors });
    });
  } else {
    Book.findByIdAndUpdate(req.params.id, book, {}, function(err, thebook) {
      if (err) {
        return next(err);
      }

      res.redirect(thebook.url);
    });
  }
};

exports.book_delete = function(req, res, next) {
  Book.findByIdAndRemove(req.params.id, function deleteBook(err) {
    if (err) {
      return next(err);
    }

    res.redirect('/catalog/books');
  });
};