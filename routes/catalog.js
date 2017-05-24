var express = require('express');
var router = express.Router();

// Require our controllers
var book_controller = require('../controllers/bookController');
var author_controller = require('../controllers/authorController');
var genre_controller = require('../controllers/genreController');

/// BOOK ROUTES ///
router.get('/', book_controller.index);
router.get('/books', book_controller.book_list);
router.get('/book/create', book_controller.book_create_get);
router.post('/book/create', book_controller.book_create_post);
router.get('/book/:id/update', book_controller.book_update_get);
router.post('/book/:id/update', book_controller.book_update_post);
router.get('/book/:id/delete', book_controller.book_delete);
router.get('/book/:id', book_controller.book_detail);

/// AUTHOR ROUTES ///
router.get('/authors', author_controller.author_list);
router.get('/author/create', author_controller.author_create_get);
router.post('/author/create', author_controller.author_create_post);
router.get('/author/:id/update', author_controller.author_update_get);
router.post('/author/:id/update', author_controller.author_update_post);
router.get('/author/:id/delete', author_controller.author_delete);
router.get('/author/:id', author_controller.author_detail);

/// GENRE ROUTES ///
router.get('/genres', genre_controller.genre_list);
router.get('/genre/create', genre_controller.genre_create_get);
router.post('/genre/create', genre_controller.genre_create_post);
router.get('/genre/:id/update', genre_controller.genre_update_get);
router.post('/genre/:id/update', genre_controller.genre_update_post);
router.get('/genre/:id/delete', genre_controller.genre_delete);

module.exports = router;