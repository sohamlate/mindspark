const express = require('express');
const { signup, login, autoLogin, logout } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/autoLogin', autoLogin);
router.post('/logout', logout);

module.exports = router;
