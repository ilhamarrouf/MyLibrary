var express = require('express');
var router = express.Router();

// Require our controllers
var book_controller = require('../controllers/bookController');

/// BOOK ROUTES ///
router.get('/', book_controller.index);
router.get('/books', book_controller.book_list);
router.get('/book/create', book_controller.book_create_get);
router.post('/book/create', book_controller.book_create_post);
router.get('/book/:id/update', book_controller.book_update_get);
router.post('/book/:id/update', book_controller.book_update_post);
router.get('/book/:id/delete', book_controller.book_delete);
router.get('/book/:id', book_controller.book_detail);



module.exports = router;