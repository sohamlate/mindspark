const express = require('express');
const router = express.Router();
const { getUserHealthTips } = require('../controllers/healthtipController');

router.get('/:userId', getUserHealthTips);

module.exports = router;
