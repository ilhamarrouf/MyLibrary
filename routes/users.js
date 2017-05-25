var express = require('express');
var router = express.Router();

var user_controller = require('../controllers/userController');

router.get('/login', user_controller.login_get);
router.post('/login', user_controller.login_post);
router.get('/logout', user_controller.logout);

module.exports = router;
