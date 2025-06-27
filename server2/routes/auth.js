const express = require('express');
const {  login, autoLogin, logout,forgotPassword,  resetPassword, requestOtp , verifyOtpAndSignup} = require('../controllers/authController');

const router = express.Router();

router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtpAndSignup);
router.post('/login', login);
router.post('/autoLogin', autoLogin);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);


module.exports = router;
